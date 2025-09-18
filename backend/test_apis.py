#!/usr/bin/env python3
"""
API Testing Script for LLM Analytics Backend
Tests all endpoints with sample data
"""

import requests
import json
import time
import sys
from datetime import datetime

# API endpoints
ANALYTICS_BASE = "http://localhost:8001"
LLM_BASE = "http://localhost:8002"
GREEN_BASE = "http://localhost:8003"

def test_health_endpoints():
    """Test health check endpoints"""
    print("🔍 Testing Health Check Endpoints...")

    endpoints = [
        ("Analytics API", f"{ANALYTICS_BASE}/health"),
        ("LLM Calling API", f"{LLM_BASE}/health"),
        ("Green Prompt API", f"{GREEN_BASE}/health")
    ]

    for name, url in endpoints:
        try:
            response = requests.get(url, timeout=10)
            if response.status_code == 200:
                print(f"✓ {name}: {response.json()['status']}")
            else:
                print(f"✗ {name}: HTTP {response.status_code}")
        except requests.RequestException as e:
            print(f"✗ {name}: Connection failed - {str(e)}")

def test_store_usage_api():
    """Test store usage API"""
    print("\n📊 Testing Store Usage API...")

    test_data = {
        "INPUT_PROMPT": "What is machine learning?",
        "OUTPUT_PROMPT": "Machine learning is a subset of AI that enables computers to learn from data.",
        "MODEL": "sonar-reasoning-pro"
    }

    try:
        response = requests.post(
            f"{ANALYTICS_BASE}/store-usage",
            json=test_data,
            headers={"Content-Type": "application/json"},
            timeout=10
        )

        if response.status_code == 200:
            result = response.json()
            print(f"✓ Usage stored successfully - ID: {result['id']}")
            print(f"  Tokens: {result['metrics']['total_tokens']}")
            print(f"  Cost: ${result['metrics']['total_cost']}")
            print(f"  Carbon: {result['metrics']['carbon_emission']} gCO2")
        else:
            print(f"✗ Store usage failed: HTTP {response.status_code}")
            print(f"  Response: {response.text}")
    except requests.RequestException as e:
        print(f"✗ Store usage failed: {str(e)}")

def test_analytics_api():
    """Test analytics API"""
    print("\n📈 Testing Analytics API...")

    try:
        response = requests.get(
            f"{ANALYTICS_BASE}/analytics",
            headers={"accept": "application/json"},
            timeout=10
        )

        if response.status_code == 200:
            result = response.json()
            overview = result["overview"]
            print("✓ Analytics retrieved successfully")
            print(f"  Total APIs: {overview['TOTAL_APIS']}")
            print(f"  Total Tokens: {overview['TOTAL_TOKEN_COUNT']:,}")
            print(f"  Total Cost: ${overview['TOTAL_COST']}")
            print(f"  Total Carbon: {overview['TOTAL_CARBON_EMISSION']} gCO2")
            print(f"  Latest entries: {len(result['latest_entries'])}")
            print(f"  Carbon line data points: {len(result['carbon_line_graph_data'])}")
            print(f"  Energy line data points: {len(result['energy_line_graph_data'])}")
        else:
            print(f"✗ Analytics failed: HTTP {response.status_code}")
            print(f"  Response: {response.text}")
    except requests.RequestException as e:
        print(f"✗ Analytics failed: {str(e)}")

def test_green_prompt_api():
    """Test green prompt generator API"""
    print("\n🌱 Testing Green Prompt Generator API...")

    test_data = {
        "USER_PROMPT": "Please could you kindly provide me with a very detailed and comprehensive explanation of machine learning algorithms, if possible with multiple examples and step-by-step instructions. I would really appreciate it if you could make sure to cover all the important aspects. Thank you very much."
    }

    try:
        response = requests.post(
            f"{GREEN_BASE}/generate-green-prompt",
            json=test_data,
            headers={"Content-Type": "application/json"},
            timeout=30
        )

        if response.status_code == 200:
            result = response.json()
            print("✓ Green prompt generated successfully")
            print(f"  Original length: {len(test_data['USER_PROMPT'])} chars")
            print(f"  Optimized length: {len(result['GREEN_PROMPT'])} chars")
            print(f"  Green prompt: {result['GREEN_PROMPT'][:100]}...")
        else:
            print(f"✗ Green prompt failed: HTTP {response.status_code}")
            print(f"  Response: {response.text}")
    except requests.RequestException as e:
        print(f"✗ Green prompt failed: {str(e)}")

def test_llm_calling_api():
    """Test LLM calling API (requires API key)"""
    print("\n🤖 Testing LLM Calling API...")

    # Check if API key is available
    import os
    api_key = os.getenv("PERPLEXITY_API_KEY")
    if not api_key or api_key == "your_perplexity_api_key_here":
        print("⚠️  Skipping LLM calling test - PERPLEXITY_API_KEY not set")
        return

    test_data = {
        "INPUT_PROMPT": "Explain quantum computing in simple terms",
        "MODEL": "sonar-reasoning-pro"
    }

    try:
        response = requests.post(
            f"{LLM_BASE}/call-llm",
            json=test_data,
            headers={"Content-Type": "application/json"},
            timeout=60
        )

        if response.status_code == 200:
            result = response.json()
            print("✓ LLM call successful")
            print(f"  Total tokens: {result['TOTAL_TOKEN_COUNT']}")
            print(f"  Response: {result['OUTPUT_PROMPT'][:100]}...")
        else:
            print(f"✗ LLM call failed: HTTP {response.status_code}")
            print(f"  Response: {response.text}")
    except requests.RequestException as e:
        print(f"✗ LLM call failed: {str(e)}")

def main():
    """Run all API tests"""
    print("🧪 LLM Analytics Backend API Test Suite")
    print("=" * 50)
    print(f"Test started at: {datetime.now()}")
    print()

    # Wait for services to be ready
    print("Waiting 3 seconds for services to be ready...")
    time.sleep(3)

    # Run tests
    test_health_endpoints()
    test_store_usage_api()
    test_analytics_api()
    test_green_prompt_api()
    test_llm_calling_api()

    print("\n" + "=" * 50)
    print("✅ API testing completed!")
    print("\n💡 Next steps:")
    print("1. Set your PERPLEXITY_API_KEY in .env file to test LLM calling")
    print("2. Visit API docs: http://localhost:8001/docs")
    print("3. Use the provided curl commands for manual testing")

if __name__ == "__main__":
    main()
