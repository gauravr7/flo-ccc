from fastapi import FastAPI, HTTPException, Depends
from pydantic import BaseModel
from sqlalchemy.orm import Session
from sqlalchemy import func, extract, desc
from typing import List, Dict, Any
from datetime import datetime, timedelta
import sys
import os

# Add parent directory to path for imports
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from database.models import UsageRecord, get_db, create_tables
from utils.calculations import calculate_costs_and_metrics
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(
    title="LLM Analytics API",
    description="API for storing and analyzing LLM usage data",
    version="1.0.0"
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

# Pydantic models for requests
class UsageRequest(BaseModel):
    INPUT_PROMPT: str
    OUTPUT_PROMPT: str
    MODEL: str

class UsageResponse(BaseModel):
    id: int
    model: str
    prompt_tokens: int
    completion_tokens: int
    total_tokens: int
    search_context_size: int
    input_tokens_cost: float
    output_tokens_cost: float
    request_cost: float
    total_cost: float
    input_prompt: str
    output_prompt: str
    created_at: datetime
    energy_consumed: float
    carbon_emission: float

# Create tables on startup
@app.on_event("startup")
async def startup():
    create_tables()

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {"status": "healthy", "timestamp": datetime.utcnow(), "service": "Analytics API"}

@app.post("/store-usage")
async def store_usage(request: UsageRequest, db: Session = Depends(get_db)):
    """Store LLM usage data with automatic calculations"""
    try:
        # Calculate metrics
        metrics = calculate_costs_and_metrics(
            request.INPUT_PROMPT,
            request.OUTPUT_PROMPT,
            request.MODEL
        )

        # Create database record
        usage_record = UsageRecord(
            model=request.MODEL,
            prompt_tokens=metrics["prompt_tokens"],
            completion_tokens=metrics["completion_tokens"],
            total_tokens=metrics["total_tokens"],
            search_context_size=metrics["search_context_size"],
            input_tokens_cost=metrics["input_tokens_cost"],
            output_tokens_cost=metrics["output_tokens_cost"],
            request_cost=metrics["request_cost"],
            total_cost=metrics["total_cost"],
            input_prompt=request.INPUT_PROMPT,
            output_prompt=request.OUTPUT_PROMPT,
            energy_consumed=metrics["energy_consumed"],
            carbon_emission=metrics["carbon_emission"]
        )

        db.add(usage_record)
        db.commit()
        db.refresh(usage_record)

        return {
            "message": "Usage data stored successfully",
            "id": usage_record.id,
            "metrics": metrics
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error storing usage data: {str(e)}")

@app.get("/analytics")
async def get_analytics(db: Session = Depends(get_db)):
    """Get comprehensive analytics data"""
    try:
        # 1. Overall statistics
        total_records = db.query(UsageRecord).count()
        total_tokens = db.query(func.sum(UsageRecord.total_tokens)).scalar() or 0
        total_carbon = db.query(func.sum(UsageRecord.carbon_emission)).scalar() or 0
        total_energy = db.query(func.sum(UsageRecord.energy_consumed)).scalar() or 0
        total_cost = db.query(func.sum(UsageRecord.total_cost)).scalar() or 0

        overview = {
            "TOTAL_TOKEN_COUNT": int(total_tokens),
            "TOTAL_CARBON_EMISSION": round(total_carbon, 4),
            "TOTAL_APIS": total_records,
            "TOTAL_ENERGY_CONSUMED": round(total_energy, 8),
            "TOTAL_COST": round(total_cost, 6)
        }

        # 2. Latest 30 entries
        latest_entries = db.query(UsageRecord).order_by(desc(UsageRecord.created_at)).limit(30).all()
        latest_data = []
        for entry in latest_entries:
            latest_data.append({
                "id": entry.id,
                "model": entry.model,
                "prompt_tokens": entry.prompt_tokens,
                "completion_tokens": entry.completion_tokens,
                "total_tokens": entry.total_tokens,
                "search_context_size": entry.search_context_size,
                "input_tokens_cost": entry.input_tokens_cost,
                "output_tokens_cost": entry.output_tokens_cost,
                "request_cost": entry.request_cost,
                "total_cost": entry.total_cost,
                "INPUT_PROMPT": entry.input_prompt[:100] + "..." if len(entry.input_prompt) > 100 else entry.input_prompt,
                "OUTPUT_PROMPT": entry.output_prompt[:100] + "..." if len(entry.output_prompt) > 100 else entry.output_prompt,
                "created_at": entry.created_at.isoformat(),
                "energy_consumed": entry.energy_consumed,
                "carbon_emission": entry.carbon_emission
            })

        # 3. Last 7 days carbon emission data for line graph
        seven_days_ago = datetime.utcnow() - timedelta(days=7)
        carbon_by_day = db.query(
            func.date(UsageRecord.created_at).label('date'),
            func.sum(UsageRecord.carbon_emission).label('carbon_emission')
        ).filter(
            UsageRecord.created_at >= seven_days_ago
        ).group_by(
            func.date(UsageRecord.created_at)
        ).order_by('date').all()

        carbon_line_data = [
            {"date": str(day.date), "carbon_emission": round(day.carbon_emission, 4)}
            for day in carbon_by_day
        ]

        # 4. Last 7 days energy consumption data for line graph
        energy_by_day = db.query(
            func.date(UsageRecord.created_at).label('date'),
            func.sum(UsageRecord.energy_consumed).label('energy_consumed')
        ).filter(
            UsageRecord.created_at >= seven_days_ago
        ).group_by(
            func.date(UsageRecord.created_at)
        ).order_by('date').all()

        energy_line_data = [
            {"date": str(day.date), "energy_consumed": round(day.energy_consumed, 8)}
            for day in energy_by_day
        ]

        # 5. Last 7 days hourly carbon emission data for heatmap
        carbon_heatmap = db.query(
            func.date(UsageRecord.created_at).label('date'),
            extract('hour', UsageRecord.created_at).label('hour'),
            func.sum(UsageRecord.carbon_emission).label('carbon_emission')
        ).filter(
            UsageRecord.created_at >= seven_days_ago
        ).group_by(
            func.date(UsageRecord.created_at),
            extract('hour', UsageRecord.created_at)
        ).order_by('date', 'hour').all()

        carbon_heatmap_data = [
            {
                "date": str(entry.date),
                "hour": int(entry.hour),
                "carbon_emission": round(entry.carbon_emission, 4)
            }
            for entry in carbon_heatmap
        ]

        # 6. Last 7 days hourly energy consumption data for heatmap
        energy_heatmap = db.query(
            func.date(UsageRecord.created_at).label('date'),
            extract('hour', UsageRecord.created_at).label('hour'),
            func.sum(UsageRecord.energy_consumed).label('energy_consumed')
        ).filter(
            UsageRecord.created_at >= seven_days_ago
        ).group_by(
            func.date(UsageRecord.created_at),
            extract('hour', UsageRecord.created_at)
        ).order_by('date', 'hour').all()

        energy_heatmap_data = [
            {
                "date": str(entry.date),
                "hour": int(entry.hour),
                "energy_consumed": round(entry.energy_consumed, 8)
            }
            for entry in energy_heatmap
        ]

        return {
            "overview": overview,
            "latest_entries": latest_data,
            "carbon_line_graph_data": carbon_line_data,
            "energy_line_graph_data": energy_line_data,
            "carbon_heatmap_data": carbon_heatmap_data,
            "energy_heatmap_data": energy_heatmap_data
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error retrieving analytics: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001)
