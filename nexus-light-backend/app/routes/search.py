from fastapi import APIRouter, Depends, HTTPException, Request
from fastapi.responses import StreamingResponse
from sqlalchemy.orm import Session
from sqlalchemy import or_
from app.database import get_db, Entity
from app.models import SearchRequest, SearchResponse, EntityModel, UIComponent
from app.config import GEMINI_API_KEY, SERPAPI_API_KEY
from google import genai 
import google.genai.types as types
import json
import logging
from starlette.concurrency import run_in_threadpool
import re
import asyncio
from typing import List, Optional

router = APIRouter(
    prefix="/api/search",
    tags=["Search"]
)

if not GEMINI_API_KEY:
    raise ValueError("GEMINI_API_KEY not found in environment variables.")

client = genai.Client(api_key=GEMINI_API_KEY)

MODEL_ID = 'gemini-2.0-flash'



logging.basicConfig(level=logging.INFO)

logger = logging.getLogger(__name__)



import requests

import os

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

    Performs a Google search using the SerpApi with robust error handling.

    Returns a formatted string of the search results or a clear error message.

    """

    logger.info(f"Performing SerpApi Google Search for: {query}")

    

    api_key = SERPAPI_API_KEY

    if not api_key:

        logger.error("SERPAPI_API_KEY is not set in the environment variables.")

        return "Error: The SerpApi API key is not configured."

    try:

        url = "https://serpapi.com/search"

        payload = {"q": query, "api_key": api_key}

        

        response = requests.get(url, params=payload)

        

        if 400 <= response.status_code < 500:

            logger.error(f"Client Error {response.status_code}: {response.text}")

            return f"Error: The search request was denied or invalid (Status {response.status_code}). Please check the API key and query."

        elif 500 <= response.status_code < 600:

            logger.error(f"Server Error {response.status_code}: {response.text}")

            return f"Error: The web search service is currently unavailable (Status {response.status_code}). Please try again later."

        response.raise_for_status()

        

        results = response.json()

        items = results.get('organic_results', [])

        

        if not items:

            return f"No Google search results found for '{query}'."

            

        formatted_results = []

        for item in items[:5]:

            title = item.get('title', 'No Title')

            link = item.get('link', 'No Link')

            snippet = item.get('snippet', 'No Snippet')

            formatted_results.append(f"Title: {title}\nURL: {link}\nSnippet: {snippet}\n---")

        

        return "Google Search Results:\n" + "\n".join(formatted_results)

    except requests.exceptions.RequestException as e:

        logger.error(f"Network error during SerpApi search for '{query}': {e}", exc_info=True)

        return "Error: A network problem occurred while trying to perform the web search."

    except Exception as e:

        logger.error(f"An unexpected error occurred during SerpApi search for '{query}': {e}", exc_info=True)

        return "An unexpected error occurred with the web search tool."

get_entities_tool = types.Tool(

    function_declarations=[

        types.FunctionDeclaration(

            name="get_entities_from_db",

            description="Searches the local database for sales entities (people or businesses) based on a query.",

            parameters=types.Schema(

                type=types.Type.OBJECT,

                properties={"query": types.Schema(type=types.Type.STRING, description="The search query for entities.")},

                required=["query"],

            ),

        )

    ]

)

google_search_tool = types.Tool(

    function_declarations=[

        types.FunctionDeclaration(

            name="google_web_search",

            description="Use this tool to search the public internet for people, companies, or information.",

            parameters=types.Schema(

                type=types.Type.OBJECT,

                properties={"query": types.Schema(type=types.Type.STRING, description="The search query for Google.")},

                required=["query"],

            ),

        )

    ]

)

async def search_generator(user_query: str, db: Session):

    """

        A generator function that yields different states of the search process.

        """

        model = client.generative_model(MODEL_ID)
        chat = model.start_chat()

    

        fetched_entities: List[EntityModel] = []

    

        web_search_data: Optional[str] = None

    

        final_summary: str = ""

    

    

    

        model = client.generative_model(MODEL_ID)

    

        chat = model.start_chat()
