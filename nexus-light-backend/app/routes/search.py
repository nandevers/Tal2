from fastapi import APIRouter, Depends, HTTPException, Request
from sqlalchemy.orm import Session
from sqlalchemy import or_
from app.database import get_db, Entity
from app.models import SearchRequest, SearchResponse
from app.config import GEMINI_API_KEY
from google import genai # Changed import
import google.genai.types as types # Import types for Tool and GoogleSearch
import json
import logging
from starlette.concurrency import run_in_threadpool # Import for async wrapping

router = APIRouter(
    prefix="/api/search",
    tags=["Search"]
)

# Configure the Gemini API client
if not GEMINI_API_KEY:
    raise ValueError("GEMINI_API_KEY not found in environment variables.")

client = genai.Client(api_key=GEMINI_API_KEY)
MODEL_ID = 'models/gemini-2.5-flash'

# Setup logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# --- Local Tool Functions ---

def get_entities_from_db(query: str, db: Session) -> list[dict]:
    """
    Searches the local database for entities (people or businesses) matching the query.
    Returns a list of dictionaries with entity details.
    """
    search_term = f"%{query}%"
    db_results = db.query(Entity).filter(
        or_(
            Entity.name.ilike(search_term),
            Entity.role.ilike(search_term),
            Entity.company.ilike(search_term),
            Entity.industry.ilike(search_term),
            Entity.location.ilike(search_term),
            Entity.source.ilike(search_term)
        )
    ).all()
    
    results_list = [
        {
            "id": entity.id, "type": entity.type, "name": entity.name,
            "role": entity.role, "company": entity.company,
            "industry": entity.industry, "location": entity.location,
            "avatar": entity.avatar, "status": entity.status,
            "group": entity.group, "source": entity.source,
            "coords": entity.coords
        } for entity in db_results
    ]
    return results_list

def google_web_search(query: str) -> str:
    """
    Performs a Google Web Search for the given query.
    Returns a summary of the search results as a string.
    This is a placeholder for actual Google Search API integration.
    """
    logger.info(f"Simulating Google Web Search for: {query}")
    # In a real scenario, this would call an external Google Search API
    return f"Simulated web search results for '{query}': No live API integration yet, but this is where it would go."

# --- Tool Definitions for Gemini ---

get_entities_tool = types.Tool(
    function_declarations=[
        types.FunctionDeclaration(
            name="get_entities_from_db",
            description="Searches the local database for sales entities (people or businesses) based on a query.",
            parameters=types.Schema(
                type=types.Type.OBJECT,
                properties={
                    "query": types.Schema(type=types.Type.STRING, description="The search query for entities (e.g., 'fintech CEOs in Brazil', 'SaaS companies').")
                },
                required=["query"],
            ),
        )
    ]
)

google_search_tool = types.Tool(
    function_declarations=[
        types.FunctionDeclaration(
            name="google_web_search",
            description="Performs a general Google Web Search to find information on the internet. Use this for general knowledge questions or when information is not expected to be in a local database.",
            parameters=types.Schema(
                type=types.Type.OBJECT,
                properties={
                    "query": types.Schema(type=types.Type.STRING, description="The search query for Google.")
                },
                required=["query"],
            ),
        )
    ]
)

@router.post("", response_model=SearchResponse)
async def perform_intelligent_search(
    request: SearchRequest, db: Session = Depends(get_db)
):
    user_message_parts = [
        types.Part(text=request.query),
    ]

    # Initial call to Gemini with all tools
    try:
        gemini_response = await run_in_threadpool(
            client.models.generate_content,
            model=MODEL_ID,
            contents=user_message_parts,
            config=types.GenerateContentConfig(
                tools=[get_entities_tool, google_search_tool],
                safety_settings=None, # Temporarily disable safety settings for broader testing
                temperature=0.5
            )
        )
        # Check if Gemini wants to call a function
        if gemini_response.parts and gemini_response.parts[0].function_call:
            function_call = gemini_response.parts[0].function_call
            tool_name = function_call.name
            tool_args = {k: v for k, v in function_call.args.items()} # Ensure args are mutable dict
            
            logger.info(f"Gemini requested tool call: {tool_name} with args: {tool_args}")

            tool_response_content = None
            structured_results = []

            if tool_name == "get_entities_from_db":
                db_query = tool_args.get("query", "")
                if db_query:
                    structured_results = get_entities_from_db(db_query, db)
                    tool_response_content = json.dumps(structured_results)
                else:
                    tool_response_content = "No query provided for entity search."
                
                # Pass the structured results directly back to Gemini to get a summary
                # And also include them in our FastAPI response
                final_summary_response = await run_in_threadpool(
                    client.models.generate_content,
                    model=MODEL_ID,
                    contents=[
                        user_message_parts[0], # Original user query
                        types.Part(
                            function_response=types.FunctionResponse(
                                name="get_entities_from_db",
                                response={ "entities": structured_results } # Pass structured data back
                            )
                        ),
                    ],
                    config=types.GenerateContentConfig(
                        tools=[get_entities_tool, google_search_tool], # Provide tools again
                        safety_settings=None,
                        temperature=0.5
                    )
                )
                final_summary = final_summary_response.text if final_summary_response.text else "Gemini could not generate a summary for the database entities. Please check the model's response or try a different query."
                return SearchResponse(summary=final_summary, results=structured_results)

            elif tool_name == "google_web_search":
                web_query = tool_args.get("query", "")
                if web_query:
                    web_search_result = google_web_search(web_query)
                    tool_response_content = json.dumps({"search_result": web_search_result})
                else:
                    tool_response_content = "No query provided for web search."
                
                # Send web search result back to Gemini for summary
                final_summary_response = await run_in_threadpool(
                    client.models.generate_content,
                    model=MODEL_ID,
                    contents=[
                        user_message_parts[0], # Original user query
                        types.Part(
                            function_response=types.FunctionResponse(
                                name="google_web_search",
                                response={ "result": web_search_result } # Pass search result back
                            )
                        )
                    ],
                    config=types.GenerateContentConfig(
                        tools=[get_entities_tool, google_search_tool], # Provide tools again
                        safety_settings=None,
                        temperature=0.5
                    )
                )
                final_summary = final_summary_response.text if final_summary_response.text else "Gemini could not generate a summary for the web search results. Please check the model's response or try a different query."
                return SearchResponse(summary=final_summary, results=[]) # No structured cards from web search

        # If Gemini did not call a function, it responded directly with text
        final_summary = gemini_response.text
        return SearchResponse(summary=final_summary, results=[])

    except Exception as e:
        logger.error(f"Error in Gemini interaction: {e}", exc_info=True)
        # Check if the error is due to an invalid model name again
        if "404 models/" in str(e) and "not found" in str(e):
            raise HTTPException(status_code=500, detail=f"Gemini API error: Check model name and availability. Original error: {e}")
        else:
            raise HTTPException(status_code=500, detail=f"Gemini API error (unexpected): {e}")
