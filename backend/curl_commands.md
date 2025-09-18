# 🔧 API Testing Commands

Use these curl commands to test all API endpoints.

## Health Check Commands

### Analytics API Health Check
```bash
curl -X GET "http://localhost:8001/health"
```

### LLM Calling API Health Check  
```bash
curl -X GET "http://localhost:8002/health"
```

### Green Prompt Generator Health Check
```bash
curl -X GET "http://localhost:8003/health"
```

## Analytics API Commands (Port 8001)

### Store Usage Data
```bash
curl -X POST "http://localhost:8001/store-usage" \
  -H "Content-Type: application/json" \
  -d '{
    "INPUT_PROMPT": "What is machine learning?",
    "OUTPUT_PROMPT": "Machine learning is a subset of AI that enables computers to learn from data.",
    "MODEL": "sonar-reasoning-pro"
  }'
```

### Get Comprehensive Analytics
```bash
curl -X GET "http://localhost:8001/analytics" \
  -H "accept: application/json"
```

## LLM Calling API Commands (Port 8002)

### Call LLM and Store Usage
```bash
curl -X POST "http://localhost:8002/call-llm" \
  -H "Content-Type: application/json" \
  -d '{
    "INPUT_PROMPT": "Explain quantum computing in simple terms",
    "MODEL": "sonar-reasoning-pro"
  }'
```

## Green Prompt Generator Commands (Port 8003)

### Generate Optimized Green Prompt
```bash
curl -X POST "http://localhost:8003/generate-green-prompt" \
  -H "Content-Type: application/json" \
  -d '{
    "USER_PROMPT": "Please could you kindly provide me with a very detailed and comprehensive explanation of machine learning algorithms, if possible with multiple examples and step-by-step instructions. I would really appreciate it if you could make sure to cover all the important aspects. Thank you very much."
  }'
```

## Expected Responses

### Health Check Response
```json
{
  "status": "healthy",
  "timestamp": "2024-01-01T12:00:00.000000",
  "service": "Analytics API"
}
```

### Store Usage Response
```json
{
  "message": "Usage data stored successfully",
  "id": 1,
  "metrics": {
    "prompt_tokens": 4,
    "completion_tokens": 18,
    "total_tokens": 22,
    "search_context_size": 0,
    "input_tokens_cost": 0.00002,
    "output_tokens_cost": 0.00027,
    "request_cost": 0.00029,
    "total_cost": 0.00029,
    "energy_consumed": 0.0000176,
    "carbon_emission": 8.36
  }
}
```

### Analytics Response Structure
```json
{
  "overview": {
    "TOTAL_TOKEN_COUNT": 125000,
    "TOTAL_CARBON_EMISSION": 59375.0000,
    "TOTAL_APIS": 150,
    "TOTAL_ENERGY_CONSUMED": 0.125,
    "TOTAL_COST": 2.456789
  },
  "latest_entries": [...],
  "carbon_line_graph_data": [...],
  "energy_line_graph_data": [...],
  "carbon_heatmap_data": [...],
  "energy_heatmap_data": [...]
}
```

### LLM Call Response
```json
{
  "OUTPUT_PROMPT": "Quantum computing is a revolutionary computing paradigm...",
  "TOTAL_TOKEN_COUNT": 150
}
```

### Green Prompt Response  
```json
{
  "GREEN_PROMPT": "Explain machine learning algorithms with examples and key concepts."
}
```

## Testing All APIs in Sequence

Run these commands in order to test the complete system:

```bash
# 1. Check all health endpoints
curl http://localhost:8001/health
curl http://localhost:8002/health
curl http://localhost:8003/health

# 2. Store some usage data
curl -X POST "http://localhost:8001/store-usage" \
  -H "Content-Type: application/json" \
  -d '{"INPUT_PROMPT": "Test prompt", "OUTPUT_PROMPT": "Test response", "MODEL": "sonar-reasoning-pro"}'

# 3. Get analytics
curl http://localhost:8001/analytics | python -m json.tool

# 4. Generate green prompt
curl -X POST "http://localhost:8003/generate-green-prompt" \
  -H "Content-Type: application/json" \
  -d '{"USER_PROMPT": "Please explain AI in detail with examples"}'

# 5. Call LLM (requires API key)
curl -X POST "http://localhost:8002/call-llm" \
  -H "Content-Type: application/json" \
  -d '{"INPUT_PROMPT": "What is the future of AI?", "MODEL": "sonar-reasoning-pro"}'
```

## Notes

- All APIs support CORS for web frontend integration
- The LLM calling API requires a valid PERPLEXITY_API_KEY in the .env file
- Analytics data includes 14 days of pre-loaded dummy data
- Green prompt generation works without API key (uses rule-based fallback)
- All timestamps are in UTC format
- Token costs are calculated based on Perplexity AI pricing
