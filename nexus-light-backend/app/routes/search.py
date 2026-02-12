import os
import logging
import json
import requests
from typing import List, Optional, Generator, Any, Dict
from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import StreamingResponse
from sqlalchemy.orm import Session
from sqlalchemy import or_
from app.database import get_db, Entity
from app.config import GEMINI_API_KEY, SERPAPI_API_KEY
from google import genai
from google.genai import types

# Setup Logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# --- THE FASTAPI ROUTER ---
router = APIRouter(prefix="/api/search", tags=["Search"])

# --- TOOL FUNCTIONS ---

def search_web_tool(query: str) -> str:
    """
    Performs a Google search using SerpApi.
    """
    logger.info(f"TOOL: Searching Web for {query}")
    if not SERPAPI_API_KEY:
        return "Error: SERPAPI_API_KEY not configured."
    
    try:
        url = "https://serpapi.com/search"
        params = {"q": query, "api_key": SERPAPI_API_KEY}
        response = requests.get(url, params=params)
        response.raise_for_status()
        
        data = response.json()
        results = data.get("organic_results", [])
        
        if not results:
            return "No results found."
            
        summary = []
        for item in results[:4]: # Limit to top 4 to save context window
            summary.append(f"- Title: {item.get('title')}\n  Link: {item.get('link')}\n  Snippet: {item.get('snippet')}")
            
        return "\n".join(summary)
    except Exception as e:
        logger.error(f"SerpApi Error: {e}")
        return f"Error performing web search: {str(e)}"

# --- THE AI ORCHESTRATOR ---

async def ai_search_generator(user_query: str, db: Session):
    """
    Manages the conversation loop:
    1. Sends query to LLM.
    2. Checks if LLM wants to use a tool.
    3. Executes tool (DB or Web).
    4. Feeds result back to LLM.
    5. Streams text chunks to User.
    """
    
    # Initialize GenAI Client
    if not GEMINI_API_KEY:
        logger.warning("GEMINI_API_KEY is missing. Search will fail.")
        yield json.dumps({"type": "error", "content": "GEMINI_API_KEY is missing."}) + "\n"
        return

    client = genai.Client(api_key=GEMINI_API_KEY)
    MODEL_ID = 'gemini-2.0-flash'

    # 1. Define Tool Wrappers with context
    # We wrap the DB function here so it uses the 'db' session passed from the request
    def search_db_wrapper(query: str):
        logger.info(f"TOOL: Searching DB for {query}")
        search_term = f"%{query}%"
        results = db.query(Entity).filter(
            or_(
                Entity.name.ilike(search_term),
                Entity.role.ilike(search_term),
                Entity.company.ilike(search_term)
            )
        ).all()
        
        if not results:
            return "No records found in local database."
            
        return json.dumps([{
            "id": e.id, "name": e.name, "role": e.role, 
            "company": e.company, "location": e.location
        } for e in results])

    # 2. Configure Tools for Gemini
    # In the new SDK, we can pass python functions directly!
    tools_config = [search_web_tool, search_db_wrapper]

    # 3. System Prompt
    system_instruction = (
        "You are a smart search assistant. Your goal is to find information for the user.\n"
        "1. ALWAYS check the 'search_db_wrapper' FIRST to see if we know the person/company locally.\n"
        "2. If not found locally, use 'search_web_tool'.\n"
        "3. Synthesize the answer clearly."
    )

    chat = client.chats.create(
        model=MODEL_ID,
        config=types.GenerateContentConfig(
            tools=tools_config,
            system_instruction=system_instruction,
            temperature=0.3 # Low temp for factual accuracy
        )
    )

    # 4. The Conversation Loop
    # We send the message and inspect the response for function calls
    
    try:
        # Initial message to start the chain
        response = chat.send_message(user_query)
        
        # Loop while the model is asking for tool execution (function calls)
        while response.function_calls:
            for call in response.function_calls:
                func_name = call.name
                func_args = call.args
                
                # Yield a "Status Update" to the UI
                yield json.dumps({
                    "type": "status", 
                    "content": f"Using tool: {func_name} with args: {func_args}"
                }) + "\n"

                # Execute the requested function
                tool_result = "Error: Tool not found"
                
                if func_name == "search_web_tool":
                    tool_result = search_web_tool(**func_args)
                elif func_name == "search_db_wrapper":
                    tool_result = search_db_wrapper(**func_args)

                # Send the tool output back to the model
                # The model will then generate the next step (either another tool or final text)
                response = chat.send_message(
                    types.Part.from_function_response(
                        name=func_name,
                        response={"result": tool_result}
                    )
                )

        # 5. Yield the Final Text Response
        # The response is now text (since the while loop for function_calls finished)
        if response.text:
            yield json.dumps({
                "type": "answer", 
                "content": response.text
            }) + "\n"
            
    except Exception as e:
        logger.error(f"AI Generation Error: {e}")
        yield json.dumps({
            "type": "error", 
            "content": str(e)
        }) + "\n"


@router.get("/")
async def search_endpoint(q: str, db: Session = Depends(get_db)):
    """
    Endpoint that streams the AI's thought process and final answer.
    """
    return StreamingResponse(
        ai_search_generator(q, db),
        media_type="application/x-ndjson"
    )
