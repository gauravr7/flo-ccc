# 🚀 Quick Start Guide

Get the LLM Analytics Backend System running in 5 minutes!

## ⚡ Super Quick Setup (Linux/Mac)

```bash
# 1. Extract and navigate
unzip llm_analytics_backend.zip
cd llm_analytics_backend

# 2. Start everything (this will auto-install dependencies)
chmod +x start_apps.sh
./start_apps.sh

# 3. Test the system
python test_apis.py
```

## ⚡ Super Quick Setup (Windows)

```cmd
# 1. Extract and navigate
# Extract the zip file to your desired location
cd llm_analytics_backend

# 2. Start everything (this will auto-install dependencies)  
start_apps.bat

# 3. Test the system (in a new command prompt)
python test_apis.py
```

## 🔑 Add Your API Key (Optional but Recommended)

To enable actual LLM calling functionality:

1. Get a Perplexity AI API key from https://www.perplexity.ai/
2. Edit the `.env` file:
   ```bash
   PERPLEXITY_API_KEY=your_actual_api_key_here
   ```
3. Restart the services

## ✅ Verify Everything is Working

### Check Health Status
```bash
curl http://localhost:8001/health  # Analytics API
curl http://localhost:8002/health  # LLM Calling API  
curl http://localhost:8003/health  # Green Prompt API
```

Expected response: `{"status": "healthy", ...}`

### Test Store Usage
```bash
curl -X POST "http://localhost:8001/store-usage" \
  -H "Content-Type: application/json" \
  -d '{
    "INPUT_PROMPT": "What is AI?",
    "OUTPUT_PROMPT": "AI is artificial intelligence.",
    "MODEL": "sonar-reasoning-pro"
  }'
```

### Get Analytics  
```bash
curl http://localhost:8001/analytics
```

### Test Green Prompt
```bash
curl -X POST "http://localhost:8003/generate-green-prompt" \
  -H "Content-Type: application/json" \
  -d '{
    "USER_PROMPT": "Please provide a detailed explanation"
  }'
```

## 🌐 Access API Documentation

Once running, visit these URLs:
- Analytics API: http://localhost:8001/docs
- LLM Calling API: http://localhost:8002/docs  
- Green Prompt API: http://localhost:8003/docs

## 📊 View Your Data

The system comes pre-loaded with 14 days of dummy data. Get analytics:

```bash
curl http://localhost:8001/analytics | python -m json.tool
```

## 🛑 Stop the System

```bash
# Linux/Mac
./stop_apps.sh

# Windows
# Close the command windows or use Task Manager
```

## 🔍 What Each API Does

1. **Analytics API (8001)** 
   - Stores LLM usage data
   - Calculates costs and environmental impact
   - Provides 6 types of analytics data

2. **LLM Calling API (8002)**
   - Calls Perplexity AI  
   - Automatically stores usage data
   - Returns response + token count

3. **Green Prompt Generator (8003)**
   - Optimizes prompts for efficiency
   - Reduces token usage
   - Minimizes environmental impact

## 🎯 Next Steps

1. **Explore the APIs** - Use the interactive docs at `/docs` endpoints
2. **Set API Key** - Add your Perplexity API key for full functionality  
3. **Integrate** - Use these APIs in your applications
4. **Customize** - Modify the code for your specific needs

## ❓ Need Help?

- Check the full README.md for detailed documentation
- Run `python test_apis.py` to diagnose issues
- Check logs in the `logs/` directory
- Ensure ports 8001, 8002, 8003 are not in use by other applications

That's it! You now have a fully functional LLM analytics backend system running locally. 🎉
