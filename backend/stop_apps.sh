#!/bin/bash

# LLM Analytics Backend - Shutdown Script
echo "Stopping LLM Analytics Backend System..."

# Read PIDs from file and stop processes
if [ -f "pids.txt" ]; then
    while read pid; do
        if ps -p $pid > /dev/null; then
            echo "Stopping process $pid..."
            kill $pid
        else
            echo "Process $pid not found (may have already stopped)"
        fi
    done < pids.txt

    # Clean up PID file
    rm pids.txt
    echo "PID file removed"
else
    echo "No PID file found, attempting to kill processes by port..."

    # Fallback: kill processes by port
    pkill -f "uvicorn.*8001" 2>/dev/null && echo "Stopped process on port 8001"
    pkill -f "uvicorn.*8002" 2>/dev/null && echo "Stopped process on port 8002"
    pkill -f "uvicorn.*8003" 2>/dev/null && echo "Stopped process on port 8003"
fi

# Wait for processes to terminate
sleep 2

# Check if ports are free
echo "Checking if ports are free..."
lsof -ti:8001 >/dev/null && echo "⚠️  Port 8001 still in use" || echo "✓ Port 8001 is free"
lsof -ti:8002 >/dev/null && echo "⚠️  Port 8002 still in use" || echo "✓ Port 8002 is free"
lsof -ti:8003 >/dev/null && echo "⚠️  Port 8003 still in use" || echo "✓ Port 8003 is free"

echo "🛑 LLM Analytics Backend System stopped!"
