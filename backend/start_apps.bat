@echo off
REM LLM Analytics Backend - Windows Startup Script

echo Starting LLM Analytics Backend System...

REM Check if Python virtual environment exists
if not exist "venv" (
    echo Creating Python virtual environment...
    python -m venv venv
)

REM Activate virtual environment
echo Activating virtual environment...
call venv\Scripts\activate.bat

REM Install requirements
echo Installing requirements...
pip install -r requirements.txt

REM Initialize database
echo Initializing database...
python init_db.py

REM Create log directory
if not exist "logs" mkdir logs

echo Starting all applications...

REM Start App1 (Analytics API) on port 8001
echo Starting Analytics API on port 8001...
start "Analytics API" cmd /c "python -m uvicorn app1.main:app --host 0.0.0.0 --port 8001 > logs/app1.log 2>&1"

REM Start App2 (LLM Calling API) on port 8002  
echo Starting LLM Calling API on port 8002...
start "LLM Calling API" cmd /c "python -m uvicorn app2.main:app --host 0.0.0.0 --port 8002 > logs/app2.log 2>&1"

REM Start App3 (Green Prompt Generator) on port 8003
echo Starting Green Prompt Generator on port 8003...
start "Green Prompt Generator" cmd /c "python -m uvicorn app3.main:app --host 0.0.0.0 --port 8003 > logs/app3.log 2>&1"

REM Wait for services to start
echo Waiting for services to start...
timeout /t 5

echo.
echo 🚀 LLM Analytics Backend System is now running!
echo.
echo 📊 API Documentation:
echo    Analytics API: http://localhost:8001/docs
echo    LLM Calling API: http://localhost:8002/docs
echo    Green Prompt API: http://localhost:8003/docs
echo.
echo 🔍 Health Checks:
echo    curl http://localhost:8001/health
echo    curl http://localhost:8002/health
echo    curl http://localhost:8003/health
echo.
echo To stop services, close the command windows or use Task Manager
pause
