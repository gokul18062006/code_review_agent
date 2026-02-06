# 🔍 Code Review Agent

An advanced AI-powered code review system that combines static analysis with LLM-based review to provide comprehensive feedback on code quality, security, performance, and best practices.

## 🌟 Features

- **Multi-Language Support**: Python, Java, and C++ with extensible architecture
- **Hybrid Analysis**: Combines rule-based static analysis with AI-powered insights
- **Context Compression**: Intelligent code chunking for efficient LLM processing
- **Security Scanning**: Detects hardcoded secrets, vulnerabilities, and security risks
- **Performance Analysis**: Identifies optimization opportunities and complexity issues
- **Best Practices**: Checks adherence to language-specific conventions
- **REST API**: FastAPI-based backend for integration
- **Web UI**: User-friendly Streamlit interface

## 🏗️ Architecture

```
User Code Input
      ↓
Language Detection
      ↓
Code Compression & Chunking
      ↓
┌─────────────────┬──────────────────┐
│ Static Analysis │  AI-LLM Review   │
│ (Rule-Based)    │  (OpenAI/Local)  │
└─────────────────┴──────────────────┘
      ↓
Result Aggregation
      ↓
Review Output (Issues + Suggestions + Rating)
```

## 📂 Project Structure

```
code-review-agent/
│
├── app.py                      # FastAPI main application
├── streamlit_app.py            # Streamlit web UI
├── requirements.txt            # Python dependencies
│
├── ai/
│   ├── prompt_builder.py       # Dynamic prompt generation
│   └── reviewer.py             # AI-powered review logic
│
├── languages/
│   ├── python_rules.py         # Python static analysis rules
│   ├── java_rules.py           # Java static analysis rules
│   └── cpp_rules.py            # C++ static analysis rules
│
├── utils/
│   ├── detector.py             # Language detection
│   └── compressor.py           # Code compression & chunking
│
└── README.md                   # This file
```

## 🚀 Quick Start

### 1. Installation

```bash
# Clone the repository
git clone <your-repo-url>
cd code-review-agent

# Create virtual environment (recommended)
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt
```

### 2. Configuration

**For AI-powered reviews**, set your OpenAI API key:

```bash
# Linux/Mac
export OPENAI_API_KEY='your-api-key-here'

# Windows PowerShell
$env:OPENAI_API_KEY='your-api-key-here'
```

**Note**: The system works without an API key using static analysis only.

### 3. Run the Application

**Option A: Web UI (Recommended)**

```bash
streamlit run streamlit_app.py
```

Open browser at: `http://localhost:8501`

**Option B: API Server**

```bash
python app.py
```

API available at: `http://localhost:8000`
API Docs: `http://localhost:8000/docs`

## 📖 Usage

### Web Interface

1. Open the Streamlit app
2. Paste your code or load an example
3. Select language (or use auto-detect)
4. Choose review focus (Comprehensive/Security/Performance/Style)
5. Click "Review Code"
6. View results with issues, suggestions, and ratings

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
  "issues": [
    "Missing docstring for hello",
    "[AI] Function lacks error handling"
  ],
  "suggestions": [
    "Add docstrings to functions",
    "[AI] Consider adding type hints"
  ],
  "rating": "Good",
  "assessment": "The python code is functional but has 2 issue(s)...",
  "static_analysis": {...},
  "ai_analysis": {...},
  "code_summary": {...}
}
```

### Python Integration

```python
from app import CodeReviewer

reviewer = CodeReviewer()

code = """
def calculate(x, y):
    return x / y
"""

result = reviewer.review(
    code=code,
    language='python',
    focus='comprehensive',
    use_ai=True
)

print(f"Rating: {result['rating']}")
print(f"Issues: {result['issues']}")
print(f"Suggestions: {result['suggestions']}")
```

## 🔍 What We Check

### Python
- ✅ PEP 8 compliance
- ✅ Missing docstrings
- ✅ Unused variables
- ✅ Exception handling
- ✅ Function length
- ✅ Hardcoded secrets
- ✅ Import organization
- ✅ Naming conventions

### Java
- ✅ Exception handling
- ✅ Resource management
- ✅ Null checks
- ✅ String comparison (== vs .equals())
- ✅ Naming conventions
- ✅ JavaDoc comments
- ✅ Constants (final)
- ✅ Hardcoded values

### C++
- ✅ Memory management (new/delete)
- ✅ Smart pointer usage
- ✅ Namespace usage (using namespace std)
- ✅ Const correctness
- ✅ Pointer safety (nullptr vs NULL)
- ✅ RAII pattern
- ✅ Modern C++ features
- ✅ Resource cleanup

## 🎯 Review Focus Types

1. **Comprehensive** - All aspects (bugs, security, performance, style)
2. **Security** - Vulnerabilities, input validation, data exposure
3. **Performance** - Algorithmic complexity, optimization opportunities
4. **Style** - Code readability, naming conventions, documentation

## 🧪 Testing

Run the test examples in each module:

```bash
# Test language detection
python utils/detector.py

# Test code compression
python utils/compressor.py

# Test Python rules
python languages/python_rules.py

# Test Java rules
python languages/java_rules.py

# Test C++ rules
python languages/cpp_rules.py

# Test prompt builder
python ai/prompt_builder.py

# Test AI reviewer
python ai/reviewer.py
```

## 📊 Example Output

**Input Code (Python):**
```python
def process(data):
    password = "secret123"
    result = []
    for item in data:
        if item > 0:
            result.append(item * 2)
    return result
```

**Review Output:**
```
Rating: Needs Improvement

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
