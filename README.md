# � AI Code Review Agent

An intelligent, multi-language code review tool powered by Google Gemini AI that provides instant feedback, identifies issues, and suggests automatic fixes.

![Python](https://img.shields.io/badge/Python-3.13-blue)
![React](https://img.shields.io/badge/React-18.2-61dafb)
![FastAPI](https://img.shields.io/badge/FastAPI-Latest-009688)
![License](https://img.shields.io/badge/License-MIT-green)

## ✨ Features

### 🎯 Core Features
- **Multi-Language Support**: Python, Java, C++, and more
- **AI-Powered Analysis**: Leverages Google Gemini 1.5 Flash for intelligent code review
- **Static Analysis**: Rule-based checking without API dependency
- **Auto-Fix Suggestions**: Each issue comes with a specific solution ⭐
- **Real-time Analysis**: Instant feedback as you paste code
- **Clean Dark UI**: Modern, minimalist interface for better readability

### 🔥 Auto-Improvement Suggestions (Unique Feature!)
For every issue detected, the tool suggests **exactly how to fix it**:

| Issue | Auto-Fix Suggestion |
|-------|---------------------|
| Debug print found | Use logging module: `logger.info()` |
| `eval()` detected | Use `ast.literal_eval()` for safety |
| Bare except clause | Replace with: `except ValueError:` |
| camelCase function | Rename to: `snake_case_name()` |
| Hardcoded password | Use `os.getenv('PASSWORD')` |

### 📊 Code Metrics
- Total lines of code
- Function count
- Class count
- Complexity analysis

## �️ Technology Stack

**Frontend:**
- React 18.2 + TypeScript
- Vite 5.4
- Tailwind CSS
- Lucide React Icons
- Axios

**Backend:**
- Python 3.13
- FastAPI
- Google Gemini AI API
- Uvicorn

## 📂 Project Structure

```
code_review_agent/
├── ai/                      # AI review logic
│   ├── prompt_builder.py   # Prompt engineering
│   └── reviewer.py         # Gemini AI integration
├── backend/
│   └── app/               # FastAPI backend (future)
├── frontend/              # React frontend
│   ├── src/
│   │   ├── components/   # React components
│   │   ├── api.ts        # API client
│   │   └── App.tsx       # Main app
│   └── package.json
├── languages/             # Language-specific rules
│   ├── python_rules.py
│   ├── java_rules.py
│   └── cpp_rules.py
├── utils/                 # Utilities
│   ├── detector.py       # Language detection
│   └── compressor.py     # Code compression
├── app.py                # FastAPI main application
├── requirements.txt      # Python dependencies
├── .env                  # Environment variables
└── start.bat            # Quick start script
```

## 🚀 Quick Start

### Prerequisites
- Python 3.11+
- Node.js 18+
- Google Gemini API Key ([Get it here](https://aistudio.google.com/app/apikey))

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/gokul18062006/code_review_agent.git
cd code_review_agent
```

2. **Set up Python virtual environment**
```bash
python -m venv venv
.\venv\Scripts\Activate.ps1  # Windows
# or
source venv/bin/activate      # Linux/Mac
```

3. **Install Python dependencies**
```bash
pip install -r requirements.txt
```

4. **Configure environment variables**
Create a `.env` file in the project root:
```env
GEMINI_API_KEY=your_gemini_api_key_here
OPENAI_API_KEY=  # Optional
```

5. **Install frontend dependencies**
```bash
cd frontend
npm install
```

### Running the Application

**Option 1: Using the start script (Windows)**
```bash
.\start.bat
```

**Option 2: Manually**

Terminal 1 - Backend:
```bash
cd code_review_agent
.\venv\Scripts\Activate.ps1
python -m uvicorn app:app --reload --host 127.0.0.1 --port 8000
```

Terminal 2 - Frontend:
```bash
cd frontend
npm run dev
```

**Access the application:**
- Frontend: http://localhost:3000
- Backend API: http://127.0.0.1:8000
- API Docs: http://127.0.0.1:8000/docs

## 📖 Usage

### Web Interface

1. **Paste your code** into the editor
2. Click **"Analyze Code"**
3. View results:
   - Language detection
   - Code metrics (lines, functions, classes)
   - Issues with specific fix suggestions
   - General improvement suggestions

### Example

**Input:**
```python
def myFunction():
    password = "secret123"
    try:
        x = 10 / 0
    except:
        pass
```

**Output:**
```
✅ PYTHON Code Analysis

📊 Metrics: 5 lines | 1 function | 0 classes

❌ Issues with Auto-Fix Suggestions (3)

🔴 Issue: Function 'myFunction' uses camelCase
✅ How to Fix: Rename to: my_function()

🔴 Issue: 🔒 Security: Potential hardcoded password detected
✅ How to Fix: Use os.getenv('PASSWORD') or python-dotenv

🔴 Issue: Bare 'except:' clause detected
✅ How to Fix: Replace with: except ZeroDivisionError:
```

### API Usage

**POST /review**

```bash
curl -X POST "http://localhost:8000/review" \
  -H "Content-Type: application/json" \
  -d '{
    "code": "def hello():\n    print(\"hello\")",
    "language": "python",
    "focus": "comprehensive",
    "use_ai": true
  }'
```

**Response:**

```json
{
  "language": "python",
  "issues": ["Missing docstring for hello"],
  "suggestions": ["Add docstring: \"\"\"Description of hello.\"\"\""],
  "issue_fixes": [
    {
      "issue": "Missing docstring for hello",
      "fix": "Add docstring: \"\"\"Description of hello.\"\"\""
    }
  ],
  "rating": "Good",
  "code_summary": {
    "total_lines": 1,
    "functions": 1,
    "classes": 0
  }
}
```
## 🌐 Deployment

### Option 1: Vercel (Frontend) + Render (Backend) - Recommended

**Frontend (Vercel):**
```bash
cd frontend
npm i -g vercel
vercel
```

**Backend (Render):**
1. Create `render.yaml` in project root:
```yaml
services:
  - type: web
    name: code-review-agent-api
    env: python
    buildCommand: pip install -r requirements.txt
    startCommand: uvicorn app:app --host 0.0.0.0 --port $PORT
    envVars:
      - key: GEMINI_API_KEY
        sync: false
```

2. Push to GitHub
3. Go to [render.com](https://render.com)
4. Connect your repo
5. Add `GEMINI_API_KEY` environment variable

### Option 2: Railway (All-in-One)
1. Go to [railway.app](https://railway.app)
2. Deploy from GitHub
3. Add `GEMINI_API_KEY` environment variable

### Option 3: Docker
```dockerfile
FROM python:3.11-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt
COPY . .
EXPOSE 8000
CMD ["uvicorn", "app:app", "--host", "0.0.0.0", "--port", "8000"]
```

```bash
docker build -t code-review-agent .
docker run -p 8000:8000 -e GEMINI_API_KEY=your_key code-review-agent
```

## 🔍 What We Check

### Python
- ✅ PEP 8 compliance & naming conventions
- ✅ Missing docstrings
- ✅ Unused variables
- ✅ Exception handling (bare except, broad exceptions)
- ✅ Function length & complexity
- ✅ Hardcoded secrets (passwords, API keys)
- ✅ Import organization (wildcard imports)
- ✅ Deep nesting detection

### Java
- ✅ Exception handling (empty catch, Throwable)
- ✅ Resource management
- ✅ Null checks
- ✅ String comparison (== vs .equals())
- ✅ Naming conventions (PascalCase, camelCase)
- ✅ JavaDoc comments
- ✅ Constants (static final)
- ✅ Magic numbers

### C++
- ✅ Memory management (new/delete)
- ✅ Smart pointer usage
- ✅ Namespace usage
- ✅ Const correctness
- ✅ Pointer safety (nullptr)
- ✅ RAII pattern
- ✅ Modern C++ features

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 🐛 Troubleshooting

**Issue: "No API key configured"**
- Solution: Ensure `.env` file exists with `GEMINI_API_KEY`
- Restart the backend server

**Issue: Frontend not connecting to backend**
- Solution: Check backend is running on port 8000
- Verify CORS settings in `app.py`

**Issue: Gemini API error 404**
- Solution: Model name updated to `gemini-1.5-flash` (fixed in latest version)

## 📄 License

This project is licensed under the MIT License.

## 👤 Author

**Gokul**
- GitHub: [@gokul18062006](https://github.com/gokul18062006)

## 🙏 Acknowledgments

- Google Gemini AI for powerful code analysis
- FastAPI for the excellent Python framework
- React and Vite for the modern frontend stack
- Tailwind CSS for beautiful styling

## 🗺️ Roadmap

- [ ] Support for more languages (JavaScript, Go, Rust)
- [ ] Code diff comparison
- [ ] Integration with GitHub/GitLab
- [ ] VS Code Extension
- [ ] Batch file analysis
- [ ] Custom rule configuration
- [ ] Export reports as PDF/HTML

---

⭐ **If you find this project helpful, please give it a star!**

📧 **Contact:** [Create an issue](https://github.com/gokul18062006/code_review_agent/issues) for questions or suggestions.

Issues:
⚠️ 🔒 Security: Potential hardcoded password detected
⚠️ Missing docstring for process
🤖 No input validation for data parameter

Suggestions:
💡 Use environment variables for sensitive data
💡 Add docstrings to functions
💡 Add type hints for better code clarity
🤖 Consider using list comprehension for better performance

Assessment: The python code has 1 critical issue(s) that should be addressed immediately...
```

## 🔧 Configuration

### Environment Variables

- `OPENAI_API_KEY` - OpenAI API key for AI reviews
- `OPENAI_MODEL` - Model to use (default: gpt-3.5-turbo)

### Customization

- Add new languages in `languages/` directory
- Modify rules in respective `*_rules.py` files
- Adjust prompts in `ai/prompt_builder.py`
- Configure compression in `utils/compressor.py`

## 🚀 Deployment

### Docker (Coming Soon)

```bash
docker build -t code-review-agent .
docker run -p 8000:8000 -e OPENAI_API_KEY=your-key code-review-agent
```

### Cloud Deployment

Deploy to:
- AWS Lambda + API Gateway
- Google Cloud Run
- Azure Functions
- Heroku

## 🛣️ Future Enhancements

- [ ] Support for JavaScript, TypeScript, Go
- [ ] GitHub integration (PR comments)
- [ ] VS Code extension
- [ ] Custom rule configuration
- [ ] Code fix suggestions (auto-fix)
- [ ] Batch file processing
- [ ] Historical analysis & trends
- [ ] Team collaboration features
- [ ] Local LLM support (Ollama, LLaMA)

## 📝 License

MIT License - feel free to use for personal or commercial projects

## 🤝 Contributing

Contributions welcome! Please:
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📧 Contact

For questions or feedback, reach out via GitHub issues.

---

**Built with ❤️ using Python, FastAPI, Streamlit, and OpenAI**
