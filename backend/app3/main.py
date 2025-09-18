import os
import re
import sys
from datetime import datetime
from typing import Optional

import httpx
import uvicorn
from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

# Add parent directory to path for imports
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from database.models import create_tables
from utils.calculations import optimize_prompt_for_green

load_dotenv()

app = FastAPI(
    title="Green Prompt Generator API",
    description="API for generating environmentally optimized prompts",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


def extract_final_prompt(response_text: str) -> str:
    """
    Cleans the LLM response text to extract only the final green prompt.
    Removes markdown, conversational text, and unnecessary formatting.
    """
    # Remove code blocks and think tags
    response_text = re.sub(r"``````", "", response_text, flags=re.DOTALL)
    response_text = re.sub(r"<think>.*?</think>", "", response_text, flags=re.DOTALL | re.IGNORECASE)

    # Remove common prefixes, headers, and labels
    response_text = re.sub(
        r"^(Here is the optimized prompt:|Here's the optimized prompt:|Optimized Prompt:|Green Prompt:|Final Prompt:)\s*",
        "",
        response_text,
        flags=re.IGNORECASE,
    )

    # Strip markdown quotes, bold, whitespace
    response_text = response_text.strip().strip("*_`\"'").strip()

    return response_text


class GreenPromptRequest(BaseModel):
    USER_PROMPT: str = Field(..., description="User's original prompt to optimize.")


class GreenPromptResponse(BaseModel):
    GREEN_PROMPT: str = Field(..., description="The optimized green prompt response.")


class GreenPromptGenerationRequest(BaseModel):
    task_intent: str = Field(..., description="Task or intent for green prompt generation.")
    strict_guidelines: Optional[str] = Field(None, description="Optional strict guidelines.")
    expected_output: Optional[str] = Field(None, description="Optional expected output description.")


class GreenPromptGenerationResponse(BaseModel):
    GREEN_PROMPT: str
    token_savings: Optional[int] = None
    carbon_savings: Optional[float] = None


@app.on_event("startup")
async def startup():
    create_tables()


@app.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "timestamp": datetime.utcnow(),
        "service": "Green Prompt Generator API",
    }


@app.post("/optimize-green-prompt", response_model=GreenPromptResponse)
async def optimize_green_prompt(request: GreenPromptRequest):
    api_key = os.getenv("PERPLEXITY_API_KEY")

    if not api_key:
        # Fallback to rule-based optimization if API key missing
        res = optimize_prompt_for_green(request.USER_PROMPT)
        return GreenPromptResponse(GREEN_PROMPT=res["green_prompt"])

    system_prompt = f"""You are an expert Green Prompt Optimizer dedicated to reducing AI prompt token usage and carbon footprint while preserving the complete meaning, clarity, and functionality of the original user prompt.

Principles:
- Eliminate redundancy and verbosity
- Use clear and direct language
- Merge repetitive instructions
- Maintain 100% task intent and output quality

Original Prompt:
\"\"\"{request.USER_PROMPT}\"\"\"

Provide ONLY the optimized green prompt, shorter by 20-50%, that maintains full intent and quality.
"""

    headers = {
        "accept": "application/json",
        "content-type": "application/json",
        "Authorization": f"Bearer {api_key}"
    }

    payload = {
        "model": "sonar-reasoning-pro",
        "messages": [
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": "Generate the optimized green prompt."}
        ],
    }

    try:
        async with httpx.AsyncClient(timeout=60) as client:
            response = await client.post(
                "https://api.perplexity.ai/chat/completions",
                headers=headers,
                json=payload,
            )

        if response.status_code != 200:
            res = optimize_prompt_for_green(request.USER_PROMPT)
            return GreenPromptResponse(GREEN_PROMPT=res["green_prompt"])

        response_json = response.json()
        llm_content = response_json["choices"][0]["message"]["content"]
        clean_prompt = extract_final_prompt(llm_content)

        return GreenPromptResponse(GREEN_PROMPT=clean_prompt)

    except Exception:
        res = optimize_prompt_for_green(request.USER_PROMPT)
        return GreenPromptResponse(GREEN_PROMPT=res["green_prompt"])


@app.post("/generate-green-prompt", response_model=GreenPromptGenerationResponse)
async def generate_green_prompt_advanced(request: GreenPromptGenerationRequest):
    base_prompt = f"Task: {request.task_intent}"
    if request.strict_guidelines:
        base_prompt += f"\n\nGuidelines:\n{request.strict_guidelines}"
    if request.expected_output:
        base_prompt += f"\n\nExpected Output Format:\n{request.expected_output}"

    optimization_result = optimize_prompt_for_green(base_prompt)
    token_savings = optimization_result.get("token_reduction", 0)
    carbon_savings = optimization_result.get("carbon_savings_gco2", 0)

    api_key = os.getenv("PERPLEXITY_API_KEY")
    if not api_key:
        # Fallback rule-based
        return GreenPromptGenerationResponse(
            GREEN_PROMPT=optimization_result["green_prompt"],
            token_savings=token_savings,
            carbon_savings=carbon_savings,
        )

    system_prompt = f"""You are an AI prompt engineer specialized in generating carbon-efficient prompts that maintain full task fidelity.

TASK:
{request.task_intent}
"""

    if request.strict_guidelines:
        system_prompt += f"GUIDELINES:\n{request.strict_guidelines}\n\n"
    if request.expected_output:
        system_prompt += f"EXPECTED OUTPUT:\n{request.expected_output}\n\n"

    system_prompt += (
        "Create an optimized green prompt that balances minimal token usage and carbon footprint "
        "while maintaining all functional and quality requirements. Return ONLY the final optimized green prompt."
    )

    headers = {
        "accept": "application/json",
        "content-type": "application/json",
        "Authorization": f"Bearer {api_key}",
    }

    payload = {
        "model": "sonar-reasoning-pro",
        "messages": [
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": "Generate the green prompt."},
        ],
    }

    try:
        async with httpx.AsyncClient(timeout=60) as client:
            response = await client.post(
                "https://api.perplexity.ai/chat/completions",
                headers=headers,
                json=payload,
            )

        if response.status_code != 200:
            return GreenPromptGenerationResponse(
                GREEN_PROMPT=optimization_result["green_prompt"],
                token_savings=token_savings,
                carbon_savings=carbon_savings,
            )

        response_json = response.json()
        llm_content = response_json["choices"][0]["message"]["content"]
        clean_prompt = extract_final_prompt(llm_content)

        return GreenPromptGenerationResponse(
            GREEN_PROMPT=clean_prompt,
            token_savings=token_savings,
            carbon_savings=carbon_savings,
        )

    except Exception:
        return GreenPromptGenerationResponse(
            GREEN_PROMPT=optimization_result["green_prompt"],
            token_savings=token_savings,
            carbon_savings=carbon_savings,
        )


@app.get("/optimization-analysis/{user_prompt}")
async def get_optimization_analysis(user_prompt: str):
    try:
        analysis = optimize_prompt_for_green(user_prompt)
        recommendations = [
            "Remove excessive politeness words",
            "Consolidate redundant phrases",
            "Use more direct language",
            "Structure requests clearly",
            "Specify exact requirements only",
        ]
        return {"analysis": analysis, "recommendations": recommendations}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error analyzing prompt: {str(e)}")


if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8003)
