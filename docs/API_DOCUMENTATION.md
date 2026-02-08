# API Documentation

## Base URL
- **Development**: `http://localhost:8000`
- **Production**: `https://your-backend-url.com`

## Endpoints

### 1. Health Check
Check if the API is running and view configuration.

**Endpoint:** `GET /health`

**Response:**
```json
{
  "status": "healthy",
  "ai_enabled": true,
  "supported_languages": ["python", "java", "cpp"]
}
```

**cURL Example:**
```bash
curl http://localhost:8000/health
```

---

### 2. Review Code
Analyze code and get comprehensive review results.

**Endpoint:** `POST /review`

**Request Body:**
```json
{
  "code": "def hello():\n    print('Hello, World!')",
  "language": "python",
  "focus": "comprehensive",
  "use_ai": true
}
```

**Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `code` | string | Yes | The source code to review |
| `language` | string | No | Language (python, java, cpp). Auto-detected if not provided |
| `focus` | string | No | Review focus: `comprehensive`, `security`, `performance`, `style` |
| `use_ai` | boolean | No | Enable AI-powered review (default: true) |

**Response:**
```json
{
  "language": "python",
  "issues": [
    "Missing docstring for hello"
  ],
  "suggestions": [
    "Add docstring: \"\"\"Description of hello.\"\"\""
  ],
  "issue_fixes": [
    {
      "issue": "Missing docstring for hello",
      "fix": "Add docstring: \"\"\"Description of hello.\"\"\""
    }
  ],
  "rating": "Good",
  "assessment": "The code is functional but missing documentation",
  "static_analysis": {
    "issues": ["Missing docstring for hello"],
    "suggestions": ["Add docstring: \"\"\"Description of hello.\"\"\""],
    "issue_fixes": [
      {
        "issue": "Missing docstring for hello",
        "fix": "Add docstring: \"\"\"Description of hello.\"\"\""
      }
    ]
  },
  "ai_analysis": {
    "issues": [],
    "suggestions": [],
    "rating": "Good",
    "assessment": "AI-powered review completed",
    "raw_review": "Full AI review text..."
  },
  "code_summary": {
    "total_lines": 2,
    "code_lines": 2,
    "functions": 1,
    "classes": 0,
    "tokens": 15,
    "needs_chunking": false
  }
}
```

**cURL Example:**
```bash
curl -X POST http://localhost:8000/review \
  -H "Content-Type: application/json" \
  -d '{
    "code": "def hello():\n    print(\"Hello, World!\")",
    "language": "python",
    "focus": "comprehensive",
    "use_ai": true
  }'
```

**JavaScript/Axios Example:**
```javascript
import axios from 'axios';

const response = await axios.post('http://localhost:8000/review', {
  code: 'def hello():\n    print("Hello, World!")',
  language: 'python',
  focus: 'comprehensive',
  use_ai: true
});

console.log(response.data);
```

**Python Example:**
```python
import requests

response = requests.post('http://localhost:8000/review', json={
    'code': 'def hello():\n    print("Hello, World!")',
    'language': 'python',
    'focus': 'comprehensive',
    'use_ai': True
})

result = response.json()
print(result['rating'])
print(result['issues'])
```

---

## Response Fields

### CodeReviewResponse

| Field | Type | Description |
|-------|------|-------------|
| `language` | string | Detected programming language |
| `issues` | string[] | List of all issues found |
| `suggestions` | string[] | List of improvement suggestions |
| `issue_fixes` | IssueFix[] | Paired issues with specific fixes |
| `rating` | string | Overall code quality (Excellent, Good, Average, Needs Improvement, Poor) |
| `assessment` | string | Summary of the code review |
| `static_analysis` | object | Results from rule-based static analysis |
| `ai_analysis` | object | Results from AI-powered review (if enabled) |
| `code_summary` | CodeSummary | Code metrics and statistics |

### IssueFix

| Field | Type | Description |
|-------|------|-------------|
| `issue` | string | The problem found in the code |
| `fix` | string | Specific solution to fix the issue |

### CodeSummary

| Field | Type | Description |
|-------|------|-------------|
| `total_lines` | number | Total lines including blank and comments |
| `code_lines` | number | Lines of actual code |
| `functions` | number | Number of functions/methods |
| `classes` | number | Number of classes |
| `tokens` | number | Approximate token count |
| `needs_chunking` | boolean | Whether code needs to be split for AI processing |

---

## Error Responses

### 400 Bad Request
```json
{
  "detail": "Code cannot be empty"
}
```

### 422 Validation Error
```json
{
  "detail": [
    {
      "loc": ["body", "code"],
      "msg": "field required",
      "type": "value_error.missing"
    }
  ]
}
```

### 500 Internal Server Error
```json
{
  "detail": "Internal server error occurred"
}
```

---

## Rate Limits

Currently no rate limits are enforced. For production deployment, consider implementing:
- 100 requests per minute per IP
- 1000 requests per hour per API key

---

## Authentication

The current version does not require authentication. For production:

1. Add API key header:
```bash
curl -H "X-API-Key: your-api-key" http://localhost:8000/review
```

2. Or use Bearer token:
```bash
curl -H "Authorization: Bearer your-token" http://localhost:8000/review
```

---

## WebSocket Support (Future)

Real-time code review streaming:

```javascript
const ws = new WebSocket('ws://localhost:8000/ws/review');

ws.onmessage = (event) => {
  const data = JSON.parse(event.data);
  console.log('Review update:', data);
};

ws.send(JSON.stringify({
  code: 'def hello(): print("hi")',
  language: 'python'
}));
```

---

## Interactive API Documentation

FastAPI provides interactive API documentation:

- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

These interfaces allow you to:
- Test endpoints directly in the browser
- View request/response schemas
- Download OpenAPI specification
