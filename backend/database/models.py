
from sqlalchemy import Column, Integer, String, Float, DateTime, Text, create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from datetime import datetime
import os

Base = declarative_base()

class UsageRecord(Base):
    __tablename__ = "usage_records"

    id = Column(Integer, primary_key=True, index=True)
    model = Column(String(100), nullable=False)
    prompt_tokens = Column(Integer, nullable=False)
    completion_tokens = Column(Integer, nullable=False)
    total_tokens = Column(Integer, nullable=False)
    search_context_size = Column(Integer, nullable=False, default=0)
    input_tokens_cost = Column(Float, nullable=False)
    output_tokens_cost = Column(Float, nullable=False)
    request_cost = Column(Float, nullable=False)
    total_cost = Column(Float, nullable=False)
    input_prompt = Column(Text, nullable=False)
    output_prompt = Column(Text, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    energy_consumed = Column(Float, nullable=False)  # in kWh
    carbon_emission = Column(Float, nullable=False)  # in gCO2

# Database setup
DATABASE_URL = "sqlite:///./database/analytics.db"
engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def create_tables():
    """Create all database tables"""
    Base.metadata.create_all(bind=engine)

def get_db():
    """Database dependency for FastAPI"""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
