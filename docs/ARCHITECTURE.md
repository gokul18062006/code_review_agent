# Architecture Documentation

Technical overview of the Code Review Agent architecture.

---

## System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        Frontend (React)                      │
│  ┌────────────┐  ┌────────────┐  ┌────────────┐            │
│  │   Editor   │  │  Results   │  │   Header   │            │
│  └────────────┘  └────────────┘  └────────────┘            │
│         │                │                                   │
│         └────────────────┴─── API Client (Axios)            │
└─────────────────────────────────────────────────────────────┘
                           │ HTTP/JSON
                           ▼
┌─────────────────────────────────────────────────────────────┐
│                     Backend (FastAPI)                        │
│  ┌──────────────────────────────────────────────────────┐  │
│  │              Code Review Orchestrator                 │  │
│  │  ┌────────────────┐  ┌───────────────────────────┐  │  │
│  │  │ Language       │  │  Code Compression         │  │  │
│  │  │ Detector       │  │  & Chunking               │  │  │
│  │  └────────────────┘  └───────────────────────────┘  │  │
│  └──────────────────────────────────────────────────────┘  │
│           │                              │                  │
│           ▼                              ▼                  │
│  ┌─────────────────┐          ┌──────────────────────┐    │
│  │ Static Analysis │          │   AI Review          │    │
│  │  (Rule-Based)   │          │  (Gemini API)        │    │
│  │                 │          │                      │    │
│  │ • Python Rules  │          │ • Prompt Builder    │    │
│  │ • Java Rules    │          │ • API Integration   │    │
│  │ • C++ Rules     │          │ • Result Parser     │    │
│  └─────────────────┘          └──────────────────────┘    │
│           │                              │                  │
│           └──────────────┬───────────────┘                  │
│                          ▼                                  │
│              ┌───────────────────────┐                      │
│              │  Result Aggregation   │                      │
│              │  • Merge findings     │                      │
│              │  • Calculate rating   │                      │
│              │  • Generate assessment│                      │
│              └───────────────────────┘                      │
└─────────────────────────────────────────────────────────────┘
```

---

## Component Overview

### Frontend Layer

**Technology**: React 18.2 + TypeScript + Vite

**Structure**:
```
frontend/src/
├── components/
│   ├── CodeEditor.tsx      # Code input component
│   ├── ReviewResults.tsx   # Results display
│   └── Header.tsx          # App header
├── api.ts                  # API client
├── App.tsx                 # Main application
└── index.css               # Styles
```

**Key Features**:
- Real-time syntax highlighting
- Responsive design (Tailwind CSS)
- Auto-fix suggestion display
- Error handling

### Backend Layer

**Technology**: Python 3.13 + FastAPI + Uvicorn

**Structure**:
```
├── app.py                  # Main FastAPI application
├── ai/
│   ├── reviewer.py         # AI review logic
│   └── prompt_builder.py   # Prompt engineering
├── languages/
│   ├── python_rules.py     # Python static analysis
│   ├── java_rules.py       # Java static analysis
│   └── cpp_rules.py        # C++ static analysis
└── utils/
    ├── detector.py         # Language detection
    └── compressor.py       # Code compression
```

---

## Data Flow

### 1. Code Submission

```
User pastes code
    ↓
Frontend validates input
    ↓
POST /review with JSON payload
    ↓
Backend receives request
```

### 2. Language Detection

```python
# detector.py
class LanguageDetector:
    def detect(self, code: str) -> str:
        # Check file extensions
        # Analyze syntax patterns
        # Match keywords
        return detected_language
```

### 3. Static Analysis

```python
# python_rules.py
class PythonRuleChecker:
    def check_all(self, code: str) -> Dict:
        self.check_naming_conventions(code)
        self.check_hardcoded_secrets(code)
        self.check_exception_handling(code)
        # ... more checks
        
        return {
            'issues': self.issues,
            'suggestions': self.suggestions,
            'issue_fixes': self.issue_fixes
        }
```

### 4. AI Review (Optional)

```python
# reviewer.py
class AIReviewer:
    def review_code(self, code: str, language: str) -> Dict:
        # Build prompt
        prompt = self.prompt_builder.build_review_prompt(code, language)
        
        # Call Gemini API
        response = self.client.generate_content(prompt)
        
        # Parse response
        return self._parse_review(response.text, language)
```

### 5. Result Aggregation

```python
# app.py
class CodeReviewer:
    def review(self, code: str, language: str) -> Dict:
        # Static analysis
        static_results = self.rule_checkers[language].check_all(code)
        
        # AI analysis
        ai_results = self.ai_reviewer.review_code(code, language)
        
        # Merge results
        all_issues = static_results['issues'] + ai_results['issues']
        
        # Calculate rating
        rating = self._calculate_rating(all_issues)
        
        return combined_results
```

---

## Key Algorithms

### 1. Language Detection

**Algorithm**: Multi-pattern matching

```python
def detect(self, code: str) -> str:
    score = {
        'python': 0,
        'java': 0,
        'cpp': 0
    }
    
    # Check keywords
    if 'def ' in code: score['python'] += 3
    if 'class ' in code and ':' in code: score['python'] += 2
    
    if 'public class' in code: score['java'] += 5
    if 'void ' in code: score['java'] += 2
    
    if '#include' in code: score['cpp'] += 5
    if 'std::' in code: score['cpp'] += 3
    
    return max(score, key=score.get)
```

### 2. Code Compression

**Algorithm**: Intelligent chunking

```python
def smart_compress(self, code: str, language: str) -> str:
    # Estimate tokens
    tokens = len(code.split())
    
    if tokens < 2000:
        return code  # No compression needed
    
    # Extract key components
    functions = self._extract_functions(code)
    classes = self._extract_classes(code)
    imports = self._extract_imports(code)
    
    # Build compressed version
    compressed = imports + '\n'
    compressed += self._summarize_classes(classes)
    compressed += self._summarize_functions(functions)
    
    return compressed
```

### 3. Rating Calculation

**Algorithm**: Weighted severity scoring

```python
def _calculate_rating(self, issues: list) -> str:
    critical_count = sum(1 for i in issues if 'security' in i.lower())
    warning_count = sum(1 for i in issues if 'warning' in i.lower())
    
    if critical_count > 0:
        return 'Poor'
    elif len(issues) > 10:
        return 'Needs Improvement'
    elif len(issues) > 5:
        return 'Average'
    elif len(issues) > 0:
        return 'Good'
    else:
        return 'Excellent'
```

---

## API Design

### REST Principles

1. **Resource-based URLs**: `/review`, `/health`
2. **HTTP methods**: POST for review, GET for health
3. **JSON payload**: Consistent request/response format
4. **Status codes**: 200 (OK), 400 (Bad Request), 500 (Error)

### Request/Response Schema

```typescript
// Request
interface CodeReviewRequest {
  code: string;
  language?: string;
  focus?: 'comprehensive' | 'security' | 'performance' | 'style';
  use_ai?: boolean;
}

// Response
interface CodeReviewResponse {
  language: string;
  issues: string[];
  suggestions: string[];
  issue_fixes: IssueFix[];
  rating: string;
  assessment: string;
  static_analysis: Analysis;
  ai_analysis?: Analysis;
  code_summary: CodeSummary;
}
```

---

## Security Considerations

### 1. Input Validation

```python
@app.post("/review")
async def review_code(request: CodeReviewRequest):
    if not request.code or not request.code.strip():
        raise HTTPException(status_code=400, detail="Code cannot be empty")
    
    if len(request.code) > 50000:  # 50KB limit
        raise HTTPException(status_code=400, detail="Code too large")
```

### 2. API Key Protection

```python
# .env file (not committed)
GEMINI_API_KEY=secret_key_here

# Load securely
from dotenv import load_dotenv
load_dotenv()
api_key = os.getenv("GEMINI_API_KEY")
```

### 3. CORS Configuration

```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Specific origin
    allow_credentials=True,
    allow_methods=["POST", "GET"],  # Limited methods
    allow_headers=["Content-Type"],
)
```

---

## Performance Optimization

### 1. Code Compression

Reduces token count for AI processing:
- Remove comments
- Simplify whitespace
- Extract key structures

**Result**: 50-70% reduction in tokens

### 2. Caching (Future)

```python
from functools import lru_cache

@lru_cache(maxsize=100)
def review_code_cached(code_hash: str):
    # Cache review results
    pass
```

### 3. Async Processing

```python
@app.post("/review")
async def review_code(request: CodeReviewRequest):
    # Non-blocking I/O
    result = await async_review(request.code)
    return result
```

---

## Scalability

### Horizontal Scaling

```
┌──────────┐     ┌──────────┐     ┌──────────┐
│Backend 1 │     │Backend 2 │     │Backend 3 │
└──────────┘     └──────────┘     └──────────┘
      │                │                │
      └────────────────┴────────────────┘
                       │
                Load Balancer
                       │
                   Frontend
```

### Database Integration (Future)

```python
# Store review history
class ReviewHistory:
    id: int
    code_hash: str
    language: str
    rating: str
    issues_count: int
    created_at: datetime
```

---

## Error Handling

### Frontend

```typescript
try {
  const result = await api.reviewCode(request);
  setReviewResult(result);
} catch (err) {
  if (err.response?.status === 400) {
    setError('Invalid code provided');
  } else {
    setError('Server error. Please try again.');
  }
}
```

### Backend

```python
try:
    ai_results = self.ai_reviewer.review_code(code, language)
except Exception as e:
    logger.error(f"AI review failed: {e}")
    return self._mock_review(code, language)
```

---

## Monitoring & Logging

### Application Logs

```python
import logging

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)

logger.info(f"Review request for {language} code ({len(code)} chars)")
```

### Metrics (Future)

- Request count
- Average response time
- Error rate
- Language distribution

---

## Testing Strategy

### Unit Tests

```python
def test_language_detection():
    detector = LanguageDetector()
    code = "def hello():\n    print('hi')"
    assert detector.detect(code) == 'python'
```

### Integration Tests

```python
def test_review_endpoint():
    response = client.post('/review', json={
        'code': 'def test(): pass',
        'language': 'python'
    })
    assert response.status_code == 200
    assert 'issues' in response.json()
```

---

## Deployment Architecture

### Development
```
Localhost:3000 (Frontend) → Localhost:8000 (Backend)
```

### Production
```
Vercel (Frontend) → Render/Railway (Backend)
              ↓
        Gemini AI API
```

---

## Technology Decisions

| Decision | Rationale |
|----------|-----------|
| **React** | Component-based, large ecosystem |
| **TypeScript** | Type safety, better IDE support |
| **FastAPI** | Fast, async, auto-documentation |
| **Gemini AI** | Free tier, good performance |
| **Tailwind** | Rapid UI development |
| **Vite** | Fast build times |

---

## Future Enhancements

1. **WebSocket Support**: Real-time streaming results
2. **Database Integration**: Store review history
3. **User Authentication**: Multi-user support
4. **Custom Rules Engine**: User-defined checks
5. **Batch Processing**: Multiple files at once
6. **VS Code Extension**: IDE integration
7. **GitHub Integration**: PR review automation
8. **Report Export**: PDF/HTML generation

---

## References

- [FastAPI Documentation](https://fastapi.tiangolo.com/)
- [React Documentation](https://react.dev/)
- [Gemini API Documentation](https://ai.google.dev/docs)
- [Tailwind CSS](https://tailwindcss.com/)
