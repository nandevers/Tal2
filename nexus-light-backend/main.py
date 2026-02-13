from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config import GEMINI_API_KEY
from app.database import create_db_and_tables, SessionLocal, Entity

app = FastAPI(title="Nexus Light Backend")

# Define the allowed origins for CORS
origins = [
    "http://localhost:5173",
    "http://localhost:5174",
]

# Add CORS middleware to the application
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def seed_database():
    db = SessionLocal()
    try:
        # Check if entities already exist
        if db.query(Entity).count() == 0:
            MOCK_ENTITIES = [
                { "id": 1, "type": 'person', "name": "Elena Silva", "role": "VP Sales", "company": "TechFlow", "avatar": "https://api.dicebear.com/7.x/avataaars/svg?seed=Elena", "status": "Active", "group": "VIP", "coords": { "x": 30, "y": 40 }, "source": "LinkedIn Sales Nav" },
                { "id": 2, "type": 'person', "name": "Marcus Chen", "role": "Head of Growth", "company": "Nubank", "avatar": "https://api.dicebear.com/7.x/avataaars/svg?seed=Marcus", "status": "Active", "group": "Fintech", "coords": { "x": 65, "y": 25 }, "source": "Apollo.io" },
                { "id": 3, "type": 'person', "name": "Sarah Jones", "role": "CRO", "company": "Vtex", "avatar": "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah", "status": "Unassigned", "group": "Retail", "coords": { "x": 20, "y": 70 }, "source": "Clearbit" },
                { "id": 101, "type": 'business', "name": "TechFlow HQ", "industry": "SaaS Platform", "location": "São Paulo", "avatar": "https://api.dicebear.com/7.x/initials/svg?seed=TF", "status": "Target", "group": "High Growth", "coords": { "x": 32, "y": 38 }, "source": "Google Places" },
                { "id": 102, "type": 'business', "name": "Nubank Office", "industry": "Fintech", "location": "São Paulo", "avatar": "https://api.dicebear.com/7.x/initials/svg?seed=NB", "status": "Customer", "group": "Enterprise", "coords": { "x": 62, "y": 22 }, "source": "Google Places" },
                { "id": 103, "type": 'business', "name": "Mercado Libre", "industry": "E-commerce", "location": "Buenos Aires", "avatar": "https://api.dicebear.com/7.x/initials/svg?seed=ML", "status": "New", "group": "Enterprise", "coords": { "x": 80, "y": 60 }, "source": "Internal DB" },
            ]
            for entity_data in MOCK_ENTITIES:
                # Unpack common fields
                common_fields = {k: v for k, v in entity_data.items() if k not in ['role', 'company', 'industry', 'location']}
                
                if entity_data['type'] == 'person':
                    db_entity = Entity(
                        **common_fields,
                        role=entity_data.get('role'),
                        company=entity_data.get('company')
                    )
                else: # business
                    db_entity = Entity(
                        **common_fields,
                        industry=entity_data.get('industry'),
                        location=entity_data.get('location')
                    )
                db.add(db_entity)
            db.commit()
    finally:
        db.close()

from app.routes.search import get_available_models, MODEL_FALLBACK_CHAIN # Import here

@app.on_event("startup")
async def on_startup(): # Make it async
    create_db_and_tables()
    seed_database()
    from app.config import SERPAPI_API_KEY # Import here to ensure config is loaded
    print(f"Loaded SERPAPI_API_KEY: {SERPAPI_API_KEY}")

    # Populate the MODEL_FALLBACK_CHAIN dynamically
    if not GEMINI_API_KEY:
        print("GEMINI_API_KEY not found. Skipping dynamic model loading.")
    else:
        print("Attempting to dynamically load GenAI models...")
        models = await get_available_models()
        MODEL_FALLBACK_CHAIN.extend(models) # Use extend to add elements
        print(f"MODEL_FALLBACK_CHAIN populated with: {MODEL_FALLBACK_CHAIN}")

@app.get("/api/status", tags=["Health Check"])
def get_status():
    """Return the application's status and configuration."""
    return {"status": "ok", "gemini_api_key_loaded": bool(GEMINI_API_KEY)}

from app.routes import search
app.include_router(search.router)
