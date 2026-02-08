# Setup Guide

Complete guide to set up and run the Code Review Agent locally.

---

## Table of Contents
1. [Prerequisites](#prerequisites)
2. [Installation](#installation)
3. [Configuration](#configuration)
4. [Running the Application](#running-the-application)
5. [Troubleshooting](#troubleshooting)

---

## Prerequisites

### Required Software

1. **Python 3.11 or higher**
   ```bash
   python --version
   # Should output: Python 3.11.x or higher
   ```
   Download: https://www.python.org/downloads/

2. **Node.js 18 or higher**
   ```bash
   node --version
   # Should output: v18.x.x or higher
   ```
   Download: https://nodejs.org/

3. **Git**
   ```bash
   git --version
   ```
   Download: https://git-scm.com/downloads

### Google Gemini API Key

1. Go to [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Sign in with your Google account
3. Click "Create API Key"
4. Copy the API key (starts with `AIza...`)

---

## Installation

### Step 1: Clone the Repository

```bash
git clone https://github.com/gokul18062006/code_review_agent.git
cd code_review_agent
```

### Step 2: Set Up Python Environment

**Windows:**
```powershell
# Create virtual environment
python -m venv venv

# Activate virtual environment
.\venv\Scripts\Activate.ps1

# If you get execution policy error:
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

**Linux/Mac:**
```bash
# Create virtual environment
python3 -m venv venv

# Activate virtual environment
source venv/bin/activate
```

### Step 3: Install Python Dependencies

```bash
# Ensure venv is activated (you should see (venv) in your prompt)
pip install -r requirements.txt
```

**Expected packages:**
- fastapi
- uvicorn
- python-dotenv
- google-generativeai
- openai (optional)

### Step 4: Install Frontend Dependencies

```bash
cd frontend
npm install
```

**Expected packages:**
- react
- vite
- tailwindcss
- axios
- lucide-react
- typescript

---

## Configuration

### Environment Variables

1. **Create `.env` file** in the project root:

```bash
# Windows
cd c:\Users\gokulp\Desktop\code_review_agent
notepad .env

# Linux/Mac
cd ~/code_review_agent
nano .env
```

2. **Add the following content:**

```env
# Google Gemini API Configuration (Primary)
GEMINI_API_KEY=AIzaSy...your_actual_key_here

# OpenAI API Configuration (Optional Alternative)
OPENAI_API_KEY=

# Model Configuration (Optional)
OPENAI_MODEL=gpt-4o
```

3. **Save the file**

**⚠️ Important:**
- Replace `AIzaSy...your_actual_key_here` with your actual Gemini API key
- Never commit the `.env` file to Git (it's already in `.gitignore`)
- Keep your API key secret

### Verify Configuration

```bash
# Check if .env file exists
ls -la .env  # Linux/Mac
dir .env     # Windows

# Verify environment variables are loaded (in Python)
python -c "import os; from dotenv import load_dotenv; load_dotenv(); print(os.getenv('GEMINI_API_KEY'))"
```

---

## Running the Application

### Option 1: Quick Start (Windows Only)

```bash
.\start.bat
```

This will:
1. Activate the Python virtual environment
2. Start the backend server on port 8000
3. Start the frontend dev server on port 3000

### Option 2: Manual Start (All Platforms)

**Terminal 1 - Backend:**

```bash
# Navigate to project root
cd code_review_agent

# Activate virtual environment
.\venv\Scripts\Activate.ps1  # Windows
source venv/bin/activate      # Linux/Mac

# Start backend server
python -m uvicorn app:app --reload --host 127.0.0.1 --port 8000
```

**Terminal 2 - Frontend:**

```bash
# Navigate to frontend directory
cd code_review_agent/frontend

# Start frontend dev server
npm run dev
```

### Access the Application

- **Frontend UI**: http://localhost:3000
- **Backend API**: http://127.0.0.1:8000
- **API Documentation**: http://127.0.0.1:8000/docs

---

## Verification

### 1. Check Backend Health

Open browser or use curl:

```bash
curl http://localhost:8000/health
```

Expected response:
```json
{
  "status": "healthy",
  "ai_enabled": true,
  "supported_languages": ["python", "java", "cpp"]
}
```

### 2. Test Code Review

```bash
curl -X POST http://localhost:8000/review \
  -H "Content-Type: application/json" \
  -d '{"code": "def hello():\n    print(\"hi\")", "language": "python"}'
```

### 3. Test Frontend

1. Open http://localhost:3000
2. Paste sample code:
```python
def test():
    print("hello")
```
3. Click "Analyze Code"
4. Should see results with language detection and metrics

---

## Troubleshooting

### Backend Issues

**Problem: `ModuleNotFoundError: No module named 'fastapi'`**

Solution:
```bash
# Ensure virtual environment is activated
.\venv\Scripts\Activate.ps1  # Windows
source venv/bin/activate      # Linux/Mac

# Reinstall dependencies
pip install -r requirements.txt
```

**Problem: `Error: GEMINI_API_KEY not found`**

Solution:
```bash
# Check .env file exists
cat .env  # Should show GEMINI_API_KEY=...

# Verify it's loaded
python -c "from dotenv import load_dotenv; load_dotenv(); import os; print(os.getenv('GEMINI_API_KEY'))"

# Restart backend server
```

**Problem: `Port 8000 already in use`**

Solution:
```bash
# Find and kill process using port 8000
# Windows:
netstat -ano | findstr :8000
taskkill /PID <PID> /F

# Linux/Mac:
lsof -ti:8000 | xargs kill -9

# Or use different port:
python -m uvicorn app:app --reload --port 8001
```

### Frontend Issues

**Problem: `npm ERR! code ENOENT`**

Solution:
```bash
cd frontend
npm install
```

**Problem: `Port 3000 already in use`**

Solution:
```bash
# Edit vite.config.ts to use different port
# Or kill process on port 3000

# Windows:
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Linux/Mac:
lsof -ti:3000 | xargs kill -9
```

**Problem: `Failed to fetch from http://localhost:8000`**

Solution:
1. Ensure backend is running on port 8000
2. Check `frontend/src/api.ts` has correct API_BASE_URL
3. Verify CORS is enabled in `app.py`

### API Key Issues

**Problem: `404 models/gemini-pro is not found`**

Solution:
- Already fixed in code (using `gemini-1.5-flash`)
- If you modified `ai/reviewer.py`, ensure model is set to `'gemini-1.5-flash'`

**Problem: `AI review unavailable`**

Solution:
```bash
# Verify API key is correct
# Get new key: https://aistudio.google.com/app/apikey

# Update .env file
GEMINI_API_KEY=your_new_key_here

# Restart backend server
```

---

## Development Mode

### Hot Reload

Both backend and frontend support hot reload:

- **Backend**: Automatically reloads when Python files change
- **Frontend**: Automatically reloads when React files change

### Debug Mode

Enable verbose logging:

```bash
# Backend
python -m uvicorn app:app --reload --log-level debug

# Frontend
npm run dev -- --debug
```

---

## Production Setup

### Build Frontend

```bash
cd frontend
npm run build
```

Output will be in `frontend/dist/`

### Run in Production Mode

```bash
# Backend
python -m uvicorn app:app --host 0.0.0.0 --port 8000

# Serve frontend static files with nginx or serve
npm install -g serve
serve -s dist -l 3000
```

---

## Next Steps

- Read [API Documentation](API_DOCUMENTATION.md)
- Check [Usage Guide](USAGE_GUIDE.md)
- Learn about [Architecture](ARCHITECTURE.md)
- View [Contributing Guide](../CONTRIBUTING.md)
