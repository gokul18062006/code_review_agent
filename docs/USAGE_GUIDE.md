# Usage Guide

Learn how to use the Code Review Agent effectively.

---

## Table of Contents
1. [Web Interface](#web-interface)
2. [Code Examples](#code-examples)
3. [Understanding Results](#understanding-results)
4. [Best Practices](#best-practices)
5. [Advanced Features](#advanced-features)

---

## Web Interface

### Analyzing Code

1. **Access the application** at http://localhost:3000

2. **Paste your code** into the editor

3. **Click "Analyze Code"**

4. **Wait for results** (usually 1-3 seconds)

5. **Review findings**:
   - Language detection
   - Code metrics
   - Issues with fixes
   - Suggestions

### Interface Overview

```
┌─────────────────────────────────────────┐
│  Code Review Agent                       │
│  AI-Powered Code Analysis                │
└─────────────────────────────────────────┘
┌─────────────────────────────────────────┐
│  Code Editor                             │
│  ┌───────────────────────────────────┐  │
│  │ Paste your code here...           │  │
│  │                                   │  │
│  │                                   │  │
│  └───────────────────────────────────┘  │
│         [Analyze Code Button]            │
└─────────────────────────────────────────┘
┌─────────────────────────────────────────┐
│  PYTHON Code Analysis                    │
│  Lines: 10 | Functions: 2 | Classes: 0  │
└─────────────────────────────────────────┘
┌─────────────────────────────────────────┐
│  Review Findings                         │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ │
│  Issues with Auto-Fix Suggestions (3)    │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ │
│  🔴 Issue: Missing docstring            │
│  ✅ Fix: Add """Description."""          │
└─────────────────────────────────────────┘
```

---

## Code Examples

### Example 1: Python Function Review

**Input:**
```python
def calculateTotal(items):
    total = 0
    for item in items:
        total = total + item
    return total
```

**Output:**
```
✅ PYTHON Code Analysis
📊 5 lines | 1 function | 0 classes

❌ Issues with Auto-Fix Suggestions (2)

🔴 Issue: Function 'calculateTotal' uses camelCase
✅ Fix: Rename to: calculate_total()

🔴 Issue: Missing docstring for calculateTotal
✅ Fix: Add docstring: """Description of calculateTotal."""

💡 Suggestions (1)
Use sum() built-in instead of manual loop
```

**Fixed Code:**
```python
def calculate_total(items):
    """Calculate the sum of all items in a list.
    
    Args:
        items: List of numbers to sum
        
    Returns:
        Total sum of all items
    """
    return sum(items)
```

### Example 2: Security Issues

**Input:**
```python
def connect_db():
    password = "admin123"
    connection = db.connect(
        host="localhost",
        user="admin",
        password=password
    )
    return connection
```

**Output:**
```
❌ Issues with Auto-Fix Suggestions (1)

🔴 Issue: 🔒 Security: Potential hardcoded password detected
✅ Fix: Use os.getenv('DB_PASSWORD') or python-dotenv
```

**Fixed Code:**
```python
import os
from dotenv import load_dotenv

load_dotenv()

def connect_db():
    """Establish database connection using environment variables."""
    connection = db.connect(
        host=os.getenv('DB_HOST', 'localhost'),
        user=os.getenv('DB_USER', 'admin'),
        password=os.getenv('DB_PASSWORD')
    )
    return connection
```

### Example 3: Java Exception Handling

**Input:**
```java
public void processFile(String filename) {
    try {
        FileReader reader = new FileReader(filename);
        // process file
    } catch (Exception e) {
        // ignore
    }
}
```

**Output:**
```
❌ Issues with Auto-Fix Suggestions (2)

🔴 Issue: Empty catch block detected
✅ Fix: Add: logger.error("Error occurred", e);

🔴 Issue: Catching generic Exception
✅ Fix: Replace with: catch (IOException | FileNotFoundException e)
```

**Fixed Code:**
```java
public void processFile(String filename) {
    try {
        FileReader reader = new FileReader(filename);
        // process file
    } catch (IOException | FileNotFoundException e) {
        logger.error("Failed to process file: {}", filename, e);
        throw new RuntimeException("File processing failed", e);
    }
}
```

---

## Understanding Results

### Code Metrics

| Metric | Description |
|--------|-------------|
| **Lines** | Total lines of code (excluding blanks/comments) |
| **Functions** | Number of functions/methods |
| **Classes** | Number of classes/interfaces |

### Issue Severity

Issues are categorized by severity (implied by icon):

- 🔴 **Critical**: Security vulnerabilities, crashes
- 🟡 **Warning**: Code smells, bad practices
- 🔵 **Info**: Style suggestions, optimizations

### Rating Scale

| Rating | Criteria |
|--------|----------|
| **Excellent** | No issues, follows all best practices |
| **Good** | Minor issues only, well-structured |
| **Average** | Several issues but functional |
| **Needs Improvement** | Multiple issues, poor structure |
| **Poor** | Critical issues, security problems |

### Auto-Fix Suggestions

Each issue includes:
1. **Problem**: What's wrong with the code
2. **Solution**: Specific fix with code example

Example:
```
🔴 Issue: Bare 'except:' clause detected
✅ Fix: Replace with: except ValueError: or except (TypeError, KeyError):
```

---

## Best Practices

### 1. Review Small Chunks

✅ **Good**: Review 50-200 lines at a time
```python
# Single function or class
def process_data(data):
    # implementation
```

❌ **Bad**: Paste entire file (1000+ lines)
- Results may be less accurate
- Takes longer to analyze

### 2. Focus Your Review

Use specific review modes for targeted analysis:

- **Security**: When dealing with authentication, data handling
- **Performance**: For algorithms, data processing
- **Style**: For code readability, consistency

### 3. Iterate on Fixes

1. Get initial review
2. Fix critical issues
3. Re-run review
4. Repeat until satisfied

### 4. Language-Specific Tips

**Python:**
- Always include docstrings
- Follow PEP 8 naming (snake_case)
- Use type hints
- Avoid bare except

**Java:**
- Use meaningful class names (PascalCase)
- Handle exceptions properly
- Close resources (try-with-resources)
- Add JavaDoc comments

**C++:**
- Use smart pointers
- Follow RAII pattern
- Avoid raw pointers
- Use const correctly

---

## Advanced Features

### 1. API Integration

Integrate code review into your workflow:

```python
import requests

def review_code(code: str) -> dict:
    """Review code using the API."""
    response = requests.post(
        'http://localhost:8000/review',
        json={'code': code, 'language': 'python'}
    )
    return response.json()

# Use in your CI/CD pipeline
result = review_code(my_code)
if result['rating'] in ['Poor', 'Needs Improvement']:
    raise ValueError(f"Code quality check failed: {result['issues']}")
```

### 2. Batch Processing

Review multiple files:

```python
import os
import requests

def review_directory(directory: str):
    """Review all Python files in directory."""
    results = {}
    
    for filename in os.listdir(directory):
        if filename.endswith('.py'):
            with open(os.path.join(directory, filename)) as f:
                code = f.read()
            
            response = requests.post(
                'http://localhost:8000/review',
                json={'code': code, 'language': 'python'}
            )
            
            results[filename] = response.json()
    
    return results
```

### 3. Custom Rules

Add your own rules in `languages/python_rules.py`:

```python
def check_custom_rule(self, code: str):
    """Check for custom company-specific rules."""
    if 'TODO' in code:
        issue = "TODO comments found in code"
        fix = "Complete TODOs before committing"
        self.issues.append(issue)
        self.issue_fixes.append({'issue': issue, 'fix': fix})
```

### 4. Export Reports

```python
import json

def export_report(result: dict, filename: str):
    """Export review results to JSON."""
    with open(filename, 'w') as f:
        json.dump(result, f, indent=2)

# Usage
result = review_code(my_code)
export_report(result, 'code_review_report.json')
```

---

## Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Ctrl+Enter` | Analyze code |
| `Ctrl+L` | Clear editor |
| `Ctrl+/` | Toggle comments |
| `Tab` | Indent |
| `Shift+Tab` | Outdent |

---

## Tips & Tricks

### 1. Quick Language Detection

The tool auto-detects language from:
- Function keywords (`def`, `function`, `void`)
- File patterns (`import`, `#include`, `package`)
- Syntax patterns (indentation, braces)

### 2. Understand AI vs Static Analysis

- **Static Analysis**: Fast, rule-based, always available
- **AI Analysis**: Slower, context-aware, requires API key

Both are combined for comprehensive results.

### 3. Performance Tips

For large files:
- Code is automatically chunked if > 2000 tokens
- Each chunk analyzed separately
- Results aggregated

### 4. Getting Better Results

✅ **Include context**: Paste related functions together
✅ **Use descriptive names**: Helps AI understand intent
✅ **Add comments**: Explains complex logic
✅ **Follow conventions**: Makes analysis more accurate

---

## Common Patterns

### Pattern 1: Pre-Commit Review

```bash
# Add to .git/hooks/pre-commit
python scripts/review_changes.py
```

### Pattern 2: CI/CD Integration

```yaml
# .github/workflows/code-review.yml
name: Code Review
on: [pull_request]
jobs:
  review:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Review Code
        run: python scripts/ci_review.py
```

### Pattern 3: IDE Integration

```json
// VSCode task.json
{
  "label": "Review Code",
  "type": "shell",
  "command": "curl -X POST http://localhost:8000/review -d @${file}"
}
```

---

## FAQs

**Q: Can I review code without internet?**
A: Yes! Static analysis works offline. AI requires API key.

**Q: What languages are supported?**
A: Python, Java, C++ fully. Others partially via AI.

**Q: Is my code stored?**
A: No, code is analyzed in-memory only.

**Q: Can I customize rules?**
A: Yes, edit files in `languages/` directory.

**Q: How accurate is the AI review?**
A: 85-95% accuracy on common issues. Always validate suggestions.

---

## Next Steps

- Explore [API Documentation](API_DOCUMENTATION.md)
- Learn about [Architecture](ARCHITECTURE.md)
- Contribute new rules
- Share feedback
