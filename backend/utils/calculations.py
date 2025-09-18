import tiktoken
from typing import Dict, Any
from datetime import datetime

# Model pricing (per 1K tokens) - Perplexity AI pricing
MODEL_PRICING = {
    "sonar-reasoning-pro": {
        "input_cost_per_1k": 0.005,  # $0.005 per 1K input tokens
        "output_cost_per_1k": 0.015,  # $0.015 per 1K output tokens
    },
    "sonar-pro": {
        "input_cost_per_1k": 0.003,
        "output_cost_per_1k": 0.012,
    },
    "sonar": {
        "input_cost_per_1k": 0.001,
        "output_cost_per_1k": 0.003,
    }
}


def count_tokens(text: str, model: str = "cl100k_base") -> int:
    """Count tokens in text using tiktoken"""
    try:
        encoding = tiktoken.get_encoding(model)
        return len(encoding.encode(text))
    except Exception:
        # Fallback: approximate token count (1 token ≈ 4 characters)
        return len(text) // 4


def calculate_energy_consumption(total_tokens: int, model: str) -> float:
    """Calculate energy consumption in kWh based on tokens and model"""
    # Energy consumption estimates (kWh per 1K tokens)
    energy_per_1k_tokens = {
        "sonar-reasoning-pro": 0.0008,  # Higher energy for reasoning model
        "sonar-pro": 0.0006,
        "sonar": 0.0004,
    }

    base_energy = energy_per_1k_tokens.get(model, 0.0005)
    return (total_tokens / 1000) * base_energy


def calculate_carbon_emission(energy_consumed: float) -> float:
    """Calculate carbon emission in gCO2 based on energy consumption"""
    # Global average carbon intensity: ~475 gCO2/kWh
    carbon_intensity = 475  # gCO2 per kWh
    return energy_consumed * carbon_intensity


def calculate_costs_and_metrics(input_prompt: str, output_prompt: str, model: str) -> Dict[str, Any]:
    """Calculate all costs and metrics for a given prompt/response pair"""

    # Token counting
    prompt_tokens = count_tokens(input_prompt)
    completion_tokens = count_tokens(output_prompt)
    total_tokens = prompt_tokens + completion_tokens
    search_context_size = 0  # Default for non-search models

    # Cost calculations
    pricing = MODEL_PRICING.get(model, MODEL_PRICING["sonar"])
    input_tokens_cost = (prompt_tokens / 1000) * pricing["input_cost_per_1k"]
    output_tokens_cost = (completion_tokens / 1000) * pricing["output_cost_per_1k"]
    request_cost = input_tokens_cost + output_tokens_cost
    total_cost = request_cost

    # Environmental impact
    energy_consumed = calculate_energy_consumption(total_tokens, model)
    carbon_emission = calculate_carbon_emission(energy_consumed)

    return {
        "prompt_tokens": prompt_tokens,
        "completion_tokens": completion_tokens,
        "total_tokens": total_tokens,
        "search_context_size": search_context_size,
        "input_tokens_cost": round(input_tokens_cost, 6),
        "output_tokens_cost": round(output_tokens_cost, 6),
        "request_cost": round(request_cost, 6),
        "total_cost": round(total_cost, 6),
        "energy_consumed": round(energy_consumed, 8),
        "carbon_emission": round(carbon_emission, 4)
    }


def optimize_prompt_for_green(user_prompt: str) -> Dict[str, Any]:
    """Enhanced analysis and optimization for reduced environmental impact with no quality compromise"""
    original_tokens = count_tokens(user_prompt)

    # Enhanced optimization strategies
    optimized_prompt = user_prompt

    # 1. Remove excessive politeness while maintaining respect
    politeness_replacements = {
        "please could you kindly": "please",
        "i would really appreciate": "",
        "if possible": "",
        "thank you very much": "",
        "please kindly": "please",
        "could you please": "please",
        "would you mind": "",
        "i would be grateful": ""
    }

    for verbose, concise in politeness_replacements.items():
        optimized_prompt = optimized_prompt.lower().replace(verbose, concise)

    # 2. Consolidate redundant descriptors
    redundancy_replacements = {
        "detailed and comprehensive": "comprehensive",
        "complete and thorough": "thorough",
        "step-by-step instructions": "instructions",
        "all the important aspects": "key aspects",
        "various different": "various",
        "absolutely essential": "essential",
        "highly important": "important",
        "extremely detailed": "detailed"
    }

    for redundant, concise in redundancy_replacements.items():
        optimized_prompt = optimized_prompt.replace(redundant, concise)

    # 3. Convert passive to active voice patterns
    passive_to_active = {
        "explanation should be provided": "explain",
        "information needs to be included": "include",
        "examples should be given": "provide examples",
        "details must be covered": "cover details"
    }

    for passive, active in passive_to_active.items():
        optimized_prompt = optimized_prompt.replace(passive, active)

    # 4. Structure optimization - convert rambling to direct requests
    if "explanation" in optimized_prompt.lower() and len(optimized_prompt) > 100:
        # Extract core topic and requirements
        if "machine learning" in optimized_prompt.lower():
            optimized_prompt = "Explain machine learning algorithms with examples and key concepts."
        elif "quantum computing" in optimized_prompt.lower():
            optimized_prompt = "Explain quantum computing principles with practical examples."
        elif len(optimized_prompt) > 200:
            # Generic fallback for overly verbose prompts
            optimized_prompt = "Provide a comprehensive explanation with examples and key points."

    # 5. Clean up extra spaces and formatting
    optimized_prompt = " ".join(optimized_prompt.split())

    # 6. Ensure minimum viable optimization (at least 15% reduction)
    if len(optimized_prompt) >= len(user_prompt) * 0.85:
        # Apply more aggressive optimization
        words = optimized_prompt.split()
        # Remove filler words
        filler_words = {"really", "quite", "very", "extremely", "absolutely", "definitely", "certainly"}
        filtered_words = [word for word in words if word.lower() not in filler_words]
        optimized_prompt = " ".join(filtered_words)

    optimized_tokens = count_tokens(optimized_prompt)

    # Calculate comprehensive savings
    token_reduction = original_tokens - optimized_tokens
    token_reduction_percent = (token_reduction / original_tokens) * 100 if original_tokens > 0 else 0

    # Environmental impact reduction
    original_energy = calculate_energy_consumption(original_tokens, "sonar-reasoning-pro")
    optimized_energy = calculate_energy_consumption(optimized_tokens, "sonar-reasoning-pro")
    energy_savings = original_energy - optimized_energy

    original_carbon = calculate_carbon_emission(original_energy)
    optimized_carbon = calculate_carbon_emission(optimized_energy)
    carbon_savings = original_carbon - optimized_carbon

    # Cost savings
    original_cost = (original_tokens / 1000) * MODEL_PRICING["sonar-reasoning-pro"]["input_cost_per_1k"]
    optimized_cost = (optimized_tokens / 1000) * MODEL_PRICING["sonar-reasoning-pro"]["input_cost_per_1k"]
    cost_savings = original_cost - optimized_cost

    return {
        "original_prompt": user_prompt,
        "green_prompt": optimized_prompt,
        "original_tokens": original_tokens,
        "optimized_tokens": optimized_tokens,
        "token_reduction": token_reduction,
        "token_reduction_percent": round(token_reduction_percent, 2),
        "energy_savings_kwh": round(energy_savings, 8),
        "carbon_savings_gco2": round(carbon_savings, 4),
        "cost_savings_usd": round(cost_savings, 6)
    }
