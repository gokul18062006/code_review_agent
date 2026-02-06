@echo off
echo ================================
echo Code Review Agent - Full Stack
echo ================================
echo.
echo Starting Backend Server...
echo.
start cmd /k "cd .. && python app.py"
timeout /t 3 /nobreak > nul
echo.
echo Starting Frontend Dev Server...
echo.
cd frontend
npm run dev
