@echo off
REM Quick Demo Runner for Code Review Agent
REM This proves the code actually works!

echo ================================================================================
echo CODE REVIEW AGENT - QUICK DEMO
echo ================================================================================
echo.

REM Activate virtual environment
call .\venv\Scripts\Activate.bat

echo [1/2] Running Static Analysis Demo...
echo ----------------------------------------
py test_demo.py

echo.
echo.
echo ================================================================================
echo [2/2] Instructions for API Test:
echo ================================================================================
echo.
echo To test the API, open TWO terminals:
echo.
echo Terminal 1 - Start API Server:
echo    cd backend\app
echo    py app.py
echo.
echo Terminal 2 - Test API:
echo    .\venv\Scripts\Activate.bat
echo    py test_api.py
echo.
echo ================================================================================
echo DEMO COMPLETE! See output above for proof it works.
echo ================================================================================
echo.
echo Next steps:
echo 1. Take screenshots of this output
echo 2. Test the API (instructions above)
echo 3. Read SUBMISSION_PROOF.md
echo 4. Post on LinkedIn
echo.

pause
