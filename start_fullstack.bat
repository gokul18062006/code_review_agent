@echo off
REM Full Stack Launcher - Code Review Agent
echo ================================================================================
echo STARTING CODE REVIEW AGENT - FULL STACK
echo ================================================================================
echo.

echo [1/2] Starting Backend API...
echo ----------------------------------------
start "Backend API" cmd /k "cd backend\app && py app.py"
timeout /t 3 > nul

echo.
echo [2/2] Starting Frontend...
echo ----------------------------------------
cd frontend
start "Frontend Dev Server" cmd /k "npm run dev"

echo.
echo ================================================================================
echo SERVERS STARTING!
echo ================================================================================
echo.
echo Backend API: http://localhost:8000
echo Frontend UI: http://localhost:5173
echo.
echo Wait 10 seconds, then open: http://localhost:5173
echo.
echo Press any key to see instructions...
pause > nul

echo.
echo ================================================================================
echo HOW TO USE
echo ================================================================================
echo.
echo 1. Wait for both servers to start
echo 2. Open browser: http://localhost:5173
echo 3. Click "Bad Example" button
echo 4. Click "Analyze Code" button
echo 5. See the beautiful results!
echo.
echo TAKE SCREENSHOTS for LinkedIn/submission!
echo.
echo To stop servers: Close the terminal windows
echo ================================================================================
echo.
