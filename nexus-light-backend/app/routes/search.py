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
from starlette.concurrency import run_in_threadpool

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
    Manages the conversation loop with a gate keeper to decide the flow.
    """
    
    # Initialize GenAI Client
    if not GEMINI_API_KEY:
        logger.warning("GEMINI_API_KEY is missing. Search will fail.")
        yield json.dumps({"type": "error", "content": "GEMINI_API_KEY is missing."}) + "\n"
        return

    client = genai.Client(api_key=GEMINI_API_KEY)
    MODEL_ID = 'gemini-2.0-flash'

    # 1. Gate Keeper: Classify the user's intent
    gate_keeper_prompt = f"""
    You are a classification model. Your task is to determine if the user's query requires a web search or if it's a simple conversational question.
    Respond with a single word: "SEARCH" if a web search is needed, or "CHAT" if it's a general question.

    User Query: "{user_query}"
    """
    
    try:
        gate_keeper_response = await run_in_threadpool(client.models.generate_content, model=MODEL_ID, contents=gate_keeper_prompt)
        intent = gate_keeper_response.text.strip().upper()
    except Exception as e:
        logger.error(f"Gate keeper failed: {e}")
        intent = "CHAT" # Default to CHAT on failure

    yield json.dumps({"type": "status", "content": f"Intent classified as: {intent}"}) + "\n"

    # 2. Execute based on intent
    if intent == "SEARCH":
        # --- This is the existing tool-using logic ---
        yield json.dumps({"type": "status", "content": "Performing a web search..."}) + "\n"
        
        def search_db_wrapper(query: str):
            logger.info(f"TOOL: Searching DB for {query}")
            search_term = f"%{query}%"
            results = db.query(Entity).filter(
                or_(Entity.name.ilike(search_term), Entity.role.ilike(search_term), Entity.company.ilike(search_term))
            ).all()
            if not results: return "No records found in local database."
            return json.dumps([{"id": e.id, "name": e.name, "role": e.role, "company": e.company, "location": e.location} for e in results])

        tools_config = [search_web_tool, search_db_wrapper]
        system_instruction = (
            "You are a smart search assistant. Your goal is to find information for the user.\n"
            "1. ALWAYS check the 'search_db_wrapper' FIRST to see if we know the person/company locally.\n"
            "2. If not found locally, use 'search_web_tool'.\n"
            "3. Synthesize the search results into a JSON list of objects. Each object should represent a person or a company and have the following fields: 'id', 'name', 'role', 'company', 'location'."
        )

        chat = client.chats.create(
            model=MODEL_ID,
            config=types.GenerateContentConfig(tools=tools_config, system_instruction=system_instruction, temperature=0.3)
        )
        
        try:
            response = chat.send_message(user_query)
            while response.function_calls:
                for call in response.function_calls:
                    yield json.dumps({"type": "status", "content": f"Using tool: {call.name} with args: {call.args}"}) + "\n"
                    tool_result = "Error: Tool not found"
                    if call.name == "search_web_tool": tool_result = search_web_tool(**call.args)
                    elif call.name == "search_db_wrapper": tool_result = search_db_wrapper(**call.args)
                    response = chat.send_message(types.Part.from_function_response(name=call.name, response={"result": tool_result}))
            
            if response.text:
                yield json.dumps({"type": "answer", "content": response.text, "format": "json"}) + "\n"
        except Exception as e:
            logger.error(f"AI Generation Error (Search): {e}")
            yield json.dumps({"type": "error", "content": str(e)}) + "\n"
    
    else: # CHAT
        # --- This is the simple chat logic ---
        yield json.dumps({"type": "status", "content": "Generating a chat response..."}) + "\n"
        try:
            chat_response = await run_in_threadpool(client.models.generate_content, model=MODEL_ID, contents=user_query)
            yield json.dumps({"type": "answer", "content": chat_response.text, "format": "text"}) + "\n"
        except Exception as e:
            logger.error(f"AI Generation Error (Chat): {e}")
            yield json.dumps({"type": "error", "content": str(e)}) + "\n"


@router.get("/")
async def search_endpoint(q: str, db: Session = Depends(get_db)):
    """
    Endpoint that streams the AI's thought process and final answer.
    """
    return StreamingResponse(
        ai_search_generator(q, db),
        media_type="application/x-ndjson"
    )
