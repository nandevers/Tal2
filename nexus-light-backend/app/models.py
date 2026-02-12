from pydantic import BaseModel
from typing import List, Optional, Any
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

# New models for structured data and UI components
class EntityModel(BaseModel):
    id: Optional[int] = None
    type: str
    name: str
    role: Optional[str] = None
    company: Optional[str] = None
    industry: Optional[str] = None
    location: Optional[str] = None
    avatar: Optional[str] = None
    status: Optional[str] = None
    group: Optional[str] = None
    source: Optional[str] = None
    coords: Optional[dict] = None # Changed from str to dict to match database data

class UIComponent(BaseModel):
    component_type: str # e.g., "EntityCard", "MapDisplay", "TextOutput", "List"
    data: Optional[Any] = None # Arbitrary data for the component, can be a list of EntityModel or dict

class SearchResponse(BaseModel):
    summary: str
    entities: List[EntityModel] = [] # Renamed from 'results' to 'entities' for clarity
    ui_components: List[UIComponent] = [] # New field for UI instructions
