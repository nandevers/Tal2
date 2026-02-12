from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

class Message(BaseModel):
    role: str
    content: str
    timestamp: Optional[datetime] = None

class ChatRequest(BaseModel):
    message: str
    session_id: str

class ChatResponse(BaseModel):
    role: str
    content: str
    session_id: str
    timestamp: datetime

class SearchRequest(BaseModel):
    query: str
    session_id: str

class SearchResult(BaseModel):
    title: str
    description: str
    link: str

class SearchResponse(BaseModel):
    summary: str
    results: List[SearchResult]
