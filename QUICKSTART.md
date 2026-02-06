# 🚀 Quick Start Guide - Code Review Agent

## Step 1: Install Dependencies

```powershell
# Install all required packages
pip install -r requirements.txt
```

## Step 2: Configure API Key (Optional)

For AI-powered reviews, set your OpenAI API key:

```powershell
# Set environment variable
$env:OPENAI_API_KEY = "your-api-key-here"
```

**Get API Key:** https://platform.openai.com/api-keys

**Note:** The system works WITHOUT API key using static analysis only!

## Step 3: Run the Application

### Option A: Web UI (Recommended for Testing)

```powershell
streamlit run streamlit_app.py
```

Then open: http://localhost:8501

### Option B: API Server

```powershell
python app.py
```

API: http://localhost:8000
Docs: http://localhost:8000/docs

## Step 4: Test the System

Run the test suite:

```powershell
python test_examples.py
```

## 📝 How to Use:

### Using Web Interface:
1. Open http://localhost:8501
2. Paste your code or load an example
3. Select language (or use auto-detect)
4. Click "Review Code"
5. See issues, suggestions, and rating!

### Using API:

```powershell
# Test with curl or Postman
curl -X POST "http://localhost:8000/review" `
  -H "Content-Type: application/json" `
  -d '{
    "code": "def hello():\n    print(\"hello\")",
    "language": "python",
    "use_ai": true
  }'
```

## 🎯 What to Test:

1. **Auto Language Detection** - Don't specify language, let it detect
2. **Python Code** - Test with good and bad Python examples
3. **Java Code** - Test class definitions, exceptions
4. **C++ Code** - Test memory management issues
5. **Security Scan** - Add hardcoded passwords to see detection

## 🐛 Troubleshooting:

**Issue:** Import errors
**Fix:** Make sure you're in the project directory and ran `pip install -r requirements.txt`

**Issue:** AI review not working
**Fix:** Either set OPENAI_API_KEY or disable AI review (use_ai=False)

**Issue:** Module not found
**Fix:** Check Python path and ensure all files are in correct directories

## 📊 Example Test:

Paste this bad Python code to see all features:

```python
def myFunction():
    password = "secret123"
    x = 10
    unused_var = 20
    
    try:
        result = x / 0
    except:
        pass
    
    return result
```

Expected issues:
- ❌ Hardcoded password
- ❌ Unused variable
- ❌ Bare except clause
- ❌ Missing docstring
- ❌ CamelCase function name

## ✅ Success Checklist:

- [ ] Dependencies installed
- [ ] Can run streamlit_app.py
- [ ] Can see web interface
- [ ] Can paste code and get review
- [ ] Can see issues and suggestions
- [ ] Test with Python, Java, C++ examples

## 🎓 For Your Submission:

1. **Demo the UI** - Show live code review
2. **Explain Architecture** - Static + AI hybrid approach
3. **Show Multi-Language** - Test all 3 languages
4. **Highlight Features:**
   - Auto language detection
   - Security scanning
   - Code compression
   - AI + Rule-based hybrid

Good luck! 🚀
