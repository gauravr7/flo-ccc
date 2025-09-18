# LLM Analytics Backend System

A comprehensive FastAPI-based backend system for tracking, analyzing, and optimizing Large Language Model (LLM) usage with environmental impact monitoring.

## 🌟 Features

- **Analytics API** - Store and analyze LLM usage data with automatic cost and environmental impact calculations
- **LLM Calling API** - Seamlessly call Perplexity AI and auto-store usage metrics  
- **Green Prompt Generator** - Optimize prompts to reduce token usage and environmental impact
- **Environmental Tracking** - Monitor energy consumption and carbon emissions per request
- **Comprehensive Analytics** - 6 different data views for visualization and reporting
- **14 Days Dummy Data** - Pre-populated with realistic sample data for testing

## 🏗️ System Architecture

### APPLICATION 1 - Analytics API (localhost:8001)
- **API 1**: `POST /store-usage` - Store LLM usage data with automatic calculations
- **API 2**: `GET /analytics` - Retrieve comprehensive analytics (6 data sets)

### APPLICATION 2 - LLM Calling API (localhost:8002) 
- **API 1**: `POST /call-llm` - Call Perplexity AI and auto-store usage data

### APPLICATION 3 - Green Prompt Generator (localhost:8003)
- **API 1**: `POST /generate-green-prompt` - Optimize prompts for efficiency

## 🚀 Quick Start

### Prerequisites
- Python 3.8+
- pip package manager
- Internet connection for Perplexity AI calls

### 1. Setup
```bash
# Extract and navigate to project
unzip llm_analytics_backend.zip
cd llm_analytics_backend

# Set your Perplexity API key (required for LLM calling)
cp .env .env.local
# Edit .env and add your API key:
# PERPLEXITY_API_KEY=your_actual_api_key_here
```

### 2. Start All Services
```bash
# Linux/Mac
chmod +x start_apps.sh
./start_apps.sh

# Windows
start_apps.bat
```

### 3. Verify Installation
```bash
# Test all APIs
python test_apis.py

# Check individual health endpoints
curl http://localhost:8001/health
curl http://localhost:8002/health  
curl http://localhost:8003/health
```

## 📊 API Documentation

Once running, visit these URLs for interactive API documentation:
- **Analytics API**: http://localhost:8001/docs
- **LLM Calling API**: http://localhost:8002/docs
- **Green Prompt API**: http://localhost:8003/docs

## 🧪 Testing with Curl Commands

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

### Get Analytics
```bash
curl -X GET "http://localhost:8001/analytics" \
  -H "accept: application/json"
```

### Call LLM (requires API key)
```bash
curl -X POST "http://localhost:8002/call-llm" \
  -H "Content-Type: application/json" \
  -d '{
    "INPUT_PROMPT": "Explain quantum computing in simple terms",
    "MODEL": "sonar-reasoning-pro"
  }'
```

### Generate Green Prompt
```bash
curl -X POST "http://localhost:8003/generate-green-prompt" \
  -H "Content-Type: application/json" \
  -d '{
    "USER_PROMPT": "Please could you kindly provide me with a very detailed and comprehensive explanation of machine learning algorithms, if possible with multiple examples and step-by-step instructions. I would really appreciate it if you could make sure to cover all the important aspects. Thank you very much."
  }'
```

### Health Checks
```bash
curl -X GET "http://localhost:8001/health"
curl -X GET "http://localhost:8002/health"
curl -X GET "http://localhost:8003/health"
```

## 📈 Analytics Data Structure

The `/analytics` endpoint returns 6 data sets:

1. **Overview Statistics**
   - TOTAL_TOKEN_COUNT, TOTAL_CARBON_EMISSION, TOTAL_APIS, TOTAL_ENERGY_CONSUMED, TOTAL_COST

2. **Latest 30 Entries**  
   - Complete records with all fields for recent API calls

3. **Carbon Emission Line Graph Data**
   - Daily carbon emissions for last 7 days

4. **Energy Consumption Line Graph Data**
   - Daily energy consumption for last 7 days

5. **Carbon Emission Heatmap Data**
   - Hourly carbon emissions for last 7 days (24hr breakdown)

6. **Energy Consumption Heatmap Data**
   - Hourly energy consumption for last 7 days (24hr breakdown)

## 🎯 Key Metrics Calculated

### Token Costs
- Input token cost (per 1K tokens)
- Output token cost (per 1K tokens) 
- Total request cost

### Environmental Impact
- Energy consumption (kWh per token estimates)
- Carbon emissions (gCO2 based on global energy grid)
- Optimization savings (before/after prompt comparisons)

### Model Pricing (Perplexity AI)
- **sonar-reasoning-pro**: $0.005 input / $0.015 output per 1K tokens
- **sonar-pro**: $0.003 input / $0.012 output per 1K tokens  
- **sonar**: $0.001 input / $0.003 output per 1K tokens

## 🗂️ Project Structure
```
llm_analytics_backend/
├── app1/              # Analytics API (Port 8001)
│   └── main.py
├── app2/              # LLM Calling API (Port 8002)  
│   └── main.py
├── app3/              # Green Prompt Generator (Port 8003)
│   └── main.py
├── database/          # SQLite models and setup
│   └── models.py
├── utils/             # Calculation utilities
│   └── calculations.py
├── requirements.txt   # Dependencies
├── .env               # Environment configuration
├── init_db.py        # Database initialization with dummy data
├── start_apps.sh     # Start all applications (Linux/Mac)
├── start_apps.bat    # Start all applications (Windows)
├── stop_apps.sh      # Stop all applications  
├── test_apis.py      # Test all APIs
├── README.md         # This documentation
└── QUICK_START.md    # Quick setup guide
```

## 🔧 Configuration

### Environment Variables (.env)
```bash
PERPLEXITY_API_KEY=your_perplexity_api_key_here
DATABASE_URL=sqlite:///./database/analytics.db
APP1_PORT=8001
APP2_PORT=8002
APP3_PORT=8003
```

### Database Schema
The system uses SQLite with the following main table:

**usage_records**
- id, model, prompt_tokens, completion_tokens, total_tokens
- search_context_size, input_tokens_cost, output_tokens_cost  
- request_cost, total_cost, input_prompt, output_prompt
- created_at, energy_consumed, carbon_emission

## 🛠️ Development

### Adding New Features
1. **New API endpoints**: Add to respective app/main.py files
2. **New calculations**: Update utils/calculations.py
3. **Database changes**: Modify database/models.py

### Running Individual Services
```bash
# Analytics API only
python -m uvicorn app1.main:app --host 0.0.0.0 --port 8001

# LLM Calling API only  
python -m uvicorn app2.main:app --host 0.0.0.0 --port 8002

# Green Prompt Generator only
python -m uvicorn app3.main:app --host 0.0.0.0 --port 8003
```

### Debugging
- Check logs in `logs/` directory
- Use health check endpoints to verify service status
- Run `python test_apis.py` for comprehensive testing

## 🔄 Stopping Services

```bash
# Linux/Mac
./stop_apps.sh

# Windows - Close command windows or use Task Manager

# Manual process killing
pkill -f "uvicorn.*800[1-3]"
```

## ⚠️ Troubleshooting

### Common Issues

1. **Port already in use**
   ```bash
   # Find and kill processes using ports
   lsof -ti:8001 | xargs kill
   lsof -ti:8002 | xargs kill  
   lsof -ti:8003 | xargs kill
   ```

2. **Permission denied on scripts**
   ```bash
   chmod +x start_apps.sh stop_apps.sh test_apis.py
   ```

3. **Python virtual environment issues**
   ```bash
   # Remove and recreate venv
   rm -rf venv
   python3 -m venv venv
   source venv/bin/activate
   pip install -r requirements.txt
   ```

4. **Database locked errors**
   ```bash
   # Remove database and reinitialize
   rm database/analytics.db
   python init_db.py
   ```

## 📝 API Response Examples

### Store Usage Response
```json
{
  "message": "Usage data stored successfully",
  "id": 123,
  "metrics": {
    "prompt_tokens": 15,
    "completion_tokens": 25, 
    "total_tokens": 40,
    "total_cost": 0.000675,
    "carbon_emission": 19.0000
  }
}
```

### Analytics Response
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

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch  
5. Create a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For issues and questions:
1. Check the troubleshooting section
2. Review API documentation at `/docs` endpoints
3. Run the test suite with `python test_apis.py`
4. Check application logs in the `logs/` directory
