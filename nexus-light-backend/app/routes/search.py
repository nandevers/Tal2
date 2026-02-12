from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import or_
from app.database import get_db, Entity
from app.models import SearchRequest, SearchResponse
from app.config import GEMINI_API_KEY
import google.generativeai as genai
import json

router = APIRouter(
    prefix="/api/search",
    tags=["Search"]
)

# Configure the Gemini API
if GEMINI_API_KEY:
    genai.configure(api_key=GEMINI_API_KEY)
    model = genai.GenerativeModel('models/gemini-pro-latest') # Changed model name to a valid one
else:
    raise ValueError("GEMINI_API_KEY not found in environment variables.")

@router.post("", response_model=SearchResponse)
async def perform_intelligent_search(request: SearchRequest, db: Session = Depends(get_db)):
    
    # Step 1: Intent Detection
    intent_prompt = f"""Is the following user query a general greeting/conversation or a request to search a database of business entities?
    Query: "{request.query}"
    Respond with only the word "GREETING" or "SEARCH".
    """
    try:
        intent_response = await model.generate_content_async(intent_prompt)
        intent = intent_response.text.strip().upper()
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Gemini API error (Intent Detection): {e}")

    # Step 2: Conditional Logic based on Intent
    if "GREETING" in intent:
        # It's a conversational query, just chat back.
        chat_prompt = f"The user said: '{request.query}'. Respond in a friendly, conversational way as a sales assistant."
        try:
            chat_response = await model.generate_content_async(chat_prompt)
            return SearchResponse(summary=chat_response.text, results=[])
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Gemini API error (Greeting): {e}")

    elif "SEARCH" in intent:
        # It's a search query, perform the database lookup.
        search_term = f"%{request.query}%"
        db_results = db.query(Entity).filter(
            or_(
                Entity.name.ilike(search_term),
                Entity.role.ilike(search_term),
                Entity.company.ilike(search_term),
                Entity.industry.ilike(search_term),
                Entity.location.ilike(search_term)
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

        context = "No relevant entities were found in the database."
        if results_list:
            context_data = json.dumps(results_list, indent=2)
            context = f"Found the following entities in the database:\n{context_data}"

        summary_prompt = f"""You are a helpful assistant for a Sales OS.
        Based on the following context, answer the user's query.

        CONTEXT:
        ---
        {context}
        ---
        USER QUERY: "{request.query}"

        Provide a concise summary of your answer based *only* on the context provided.
        """
        try:
            summary_response = await model.generate_content_async(summary_prompt)
            gemini_summary = summary_response.text
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Gemini API error (Summary): {e}")

        return SearchResponse(summary=gemini_summary, results=results_list)
    
    else:
        # Fallback if intent is unclear
        return SearchResponse(summary="I'm not sure how to handle that request. Can you try rephrasing?", results=[])
