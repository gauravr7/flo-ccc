from fastapi import FastAPI, HTTPException, Depends
from pydantic import BaseModel
import httpx
import os
import json
import sys
from typing import Dict, Any
from datetime import datetime
from dotenv import load_dotenv
from fastapi.middleware.cors import CORSMiddleware

# Add parent directory to path for imports
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from database.models import create_tables
from utils.calculations import calculate_costs_and_metrics

# Load environment variables from .env file
load_dotenv()

app = FastAPI(
    title="LLM Calling API",
    description="API for calling Perplexity AI and storing usage data",
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

# Pydantic models
class LLMRequest(BaseModel):
    INPUT_PROMPT: str
    MODEL: str

class LLMResponse(BaseModel):
    OUTPUT_PROMPT: str
    TOTAL_TOKEN_COUNT: int

# Create tables on startup
@app.on_event("startup")
async def startup():
    create_tables()

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {"status": "healthy", "timestamp": datetime.utcnow(), "service": "LLM Calling API"}

@app.post("/call-llm", response_model=LLMResponse)
async def call_llm(request: LLMRequest):
    """Call Perplexity AI and store usage data"""
    try:
        # Get API key from environment
        api_key = os.getenv("PERPLEXITY_API_KEY")
        if not api_key:
            # Use a more specific error to avoid being caught by the generic handler
            # This will now correctly return a 500 error with the detailed message.
            raise ValueError("PERPLEXITY_API_KEY not found in environment. Please set it in your .env file.")

        # Call Perplexity AI
        headers = {
            "accept": "application/json",
            "content-type": "application/json",
            "Authorization": f"Bearer {api_key}",
        }

        payload = {
            "model": request.MODEL,
            "messages": [
                {"role": "user", "content": request.INPUT_PROMPT}
            ]
        }

        async with httpx.AsyncClient(timeout=60.0) as client:
            response = await client.post(
                "https://api.perplexity.ai/chat/completions",
                headers=headers,
                json=payload
            )
            if response.status_code != 200:
                raise HTTPException(
                    status_code=response.status_code,
                    detail=f"Perplexity API error: {response.text}"
                )

            result = response.json()
            output_prompt = result["choices"][0]["message"]["content"]

            # Get token counts from response if available
            usage = result.get("usage", {})
            total_tokens = usage.get("total_tokens", 0)

            # If tokens not provided by API, calculate them
            if total_tokens == 0:
                metrics = calculate_costs_and_metrics(request.INPUT_PROMPT, output_prompt, request.MODEL)
                total_tokens = metrics["total_tokens"]

            # Store usage data by calling Analytics API
            analytics_payload = {
                "INPUT_PROMPT": request.INPUT_PROMPT,
                "OUTPUT_PROMPT": output_prompt,
                "MODEL": request.MODEL
            }

            try:
                async with httpx.AsyncClient(timeout=30.0) as analytics_client:
                    analytics_response = await analytics_client.post(
                        "http://localhost:8001/store-usage",
                        json=analytics_payload,
                    )
                    analytics_response.raise_for_status()
            except httpx.RequestError as exc:
                # Log error but don't fail the main request
                print(f"Warning: Failed to store usage data to Analytics API: {exc}")
            except Exception as exc:
                # Log error but don't fail the main request
                print(f"Warning: An unexpected error occurred while storing usage data: {exc}")

            return LLMResponse(
                OUTPUT_PROMPT=output_prompt,
                TOTAL_TOKEN_COUNT=total_tokens
            )

    except httpx.TimeoutException:
        raise HTTPException(status_code=504, detail="Request to Perplexity AI timed out")
    except httpx.RequestError as e:
        raise HTTPException(status_code=500, detail=f"Error calling Perplexity AI: {e.request.url} - {e}")
    except ValueError as e:
        raise HTTPException(status_code=500, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error calling LLM: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8002)
