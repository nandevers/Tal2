from sqlalchemy import create_engine, Column, Integer, String, DateTime, JSON
from sqlalchemy.orm import sessionmaker
from sqlalchemy.ext.declarative import declarative_base
from datetime import datetime

DATABASE_URL = "sqlite:///./sql_app.db?check_same_thread=False"

engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

class ChatHistory(Base):
    __tablename__ = "chat_history"
    id = Column(Integer, primary_key=True, index=True)
    session_id = Column(String, index=True, nullable=False)
    role = Column(String, nullable=False)
    content = Column(String, nullable=False)
    timestamp = Column(DateTime, default=datetime.utcnow)

class Entity(Base):
    __tablename__ = "entities"
    id = Column(Integer, primary_key=True, index=True)
    type = Column(String, nullable=False)
    name = Column(String, index=True)
    # Person-specific
    role = Column(String, nullable=True)
    company = Column(String, nullable=True)
    # Business-specific
    industry = Column(String, nullable=True)
    location = Column(String, nullable=True)
    # Common
    avatar = Column(String)
    status = Column(String)
    group = Column(String)
    source = Column(String, nullable=True)
    coords = Column(JSON, nullable=True)


def create_db_and_tables():
    Base.metadata.create_all(bind=engine)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
