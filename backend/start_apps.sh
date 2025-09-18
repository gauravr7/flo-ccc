#!/bin/bash

# LLM Analytics Backend - Startup Script
echo "Starting LLM Analytics Backend System..."

# Check if Python virtual environment exists
if [ ! -d "venv" ]; then
    echo "Creating Python virtual environment..."
    python3 -m venv venv
fi

# Activate virtual environment
echo "Activating virtual environment..."
source venv/bin/activate

# Install requirements
echo "Installing requirements..."
pip install -r requirements.txt

# Initialize database with dummy data
echo "Initializing database..."
python init_db.py

# Create log directory
mkdir -p logs

echo "Starting all applications..."

# Start App1 (Analytics API) on port 8001
echo "Starting Analytics API on port 8001..."
nohup python -m uvicorn app1.main:app --host 0.0.0.0 --port 8001 > logs/app1.log 2>&1 &
APP1_PID=$!
echo "Analytics API started with PID: $APP1_PID"

# Start App2 (LLM Calling API) on port 8002
echo "Starting LLM Calling API on port 8002..."
nohup python -m uvicorn app2.main:app --host 0.0.0.0 --port 8002 > logs/app2.log 2>&1 &
APP2_PID=$!
echo "LLM Calling API started with PID: $APP2_PID"

# Start App3 (Green Prompt Generator) on port 8003
echo "Starting Green Prompt Generator on port 8003..."
nohup python -m uvicorn app3.main:app --host 0.0.0.0 --port 8003 > logs/app3.log 2>&1 &
APP3_PID=$!
echo "Green Prompt Generator started with PID: $APP3_PID"

# Save PIDs to file for later stopping
echo "$APP1_PID" > pids.txt
echo "$APP2_PID" >> pids.txt
echo "$APP3_PID" >> pids.txt

# Wait for services to start
echo "Waiting for services to start..."
sleep 5

# Check if services are running
echo "Checking service health..."
curl -s http://localhost:8001/health > /dev/null && echo "✓ Analytics API (8001) is running" || echo "✗ Analytics API (8001) failed to start"
curl -s http://localhost:8002/health > /dev/null && echo "✓ LLM Calling API (8002) is running" || echo "✗ LLM Calling API (8002) failed to start"
curl -s http://localhost:8003/health > /dev/null && echo "✓ Green Prompt Generator (8003) is running" || echo "✗ Green Prompt Generator (8003) failed to start"

echo ""
echo "🚀 LLM Analytics Backend System is now running!"
echo ""
echo "📊 API Documentation:"
echo "   Analytics API: http://localhost:8001/docs"
echo "   LLM Calling API: http://localhost:8002/docs"
echo "   Green Prompt API: http://localhost:8003/docs"
echo ""
echo "🔍 Health Checks:"
echo "   curl http://localhost:8001/health"
echo "   curl http://localhost:8002/health"
echo "   curl http://localhost:8003/health"
echo ""
echo "To stop all services, run: ./stop_apps.sh"
echo "To view logs: tail -f logs/app1.log logs/app2.log logs/app3.log"
