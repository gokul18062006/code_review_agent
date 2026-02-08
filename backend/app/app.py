"""
Code Review Agent - Main Application
Multi-language AI-powered code reviewer with static analysis
"""

import os
from typing import Dict, Optional
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

from utils.detector import LanguageDetector
from utils.compressor import CodeCompressor
from languages.python_rules import PythonRuleChecker
from languages.java_rules import JavaRuleChecker
from languages.cpp_rules import CppRuleChecker
from ai.reviewer import AIReviewer


# FastAPI app
app = FastAPI(
    title="Code Review Agent",
    description="AI-powered multi-language code reviewer",
    version="1.0.0"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Request/Response models
class CodeReviewRequest(BaseModel):
    code: str
    language: Optional[str] = None  # Auto-detect if not provided
    focus: Optional[str] = 'comprehensive'  # comprehensive, security, performance, style
    use_ai: Optional[bool] = True


class CodeReviewResponse(BaseModel):
    language: str
    issues: list
    suggestions: list
    rating: str
    assessment: str
    static_analysis: dict
    ai_analysis: Optional[dict] = None
    code_summary: dict


class CodeReviewer:
    """Main code review orchestrator"""
    
    def __init__(self):
        self.detector = LanguageDetector()
        self.compressor = CodeCompressor()
        self.ai_reviewer = AIReviewer()
        
        self.rule_checkers = {
            'python': PythonRuleChecker(),
            'java': JavaRuleChecker(),
            'cpp': CppRuleChecker()
        }
    
    def review(self, code: str, language: Optional[str] = None, 
               focus: str = 'comprehensive', use_ai: bool = True) -> Dict:
        """
        Perform comprehensive code review
        
        Args:
            code: Source code to review
            language: Programming language (auto-detected if None)
            focus: Review focus area
            use_ai: Whether to use AI-powered review
            
        Returns:
            Complete review results
        """
        # Step 1: Detect language if not provided
        if not language:
            language = self.detector.detect(code)
        
        if language == 'unknown':
            raise ValueError("Could not detect programming language")
        
        # Step 2: Generate code summary
        code_summary = self.compressor.create_summary(code, language)
        
        # Step 3: Run static analysis (rule-based checks)
        static_results = {'issues': [], 'suggestions': []}
        
        if language in self.rule_checkers:
            checker = self.rule_checkers[language]
            static_results = checker.check_all(code)
        
        # Step 4: Run AI-powered review
        ai_results = None
        if use_ai:
            # Compress code if needed
            compressed_code = self.compressor.smart_compress(code, language)
            ai_results = self.ai_reviewer.review_code(compressed_code, language, focus)
        
        # Step 5: Combine results
        all_issues = static_results['issues'].copy()
        all_suggestions = static_results['suggestions'].copy()
        
        if ai_results:
            # Add AI findings, avoiding duplicates and mock messages
            for issue in ai_results.get('issues', []):
                # Skip mock review messages
                if 'AI review unavailable' in issue or 'Using static analysis only' in issue:
                    continue
                if issue not in all_issues:
                    all_issues.append(f"[AI] {issue}")
            
            for suggestion in ai_results.get('suggestions', []):
                # Skip mock review messages
                if 'API key' in suggestion or 'rule-based checks only' in suggestion:
                    continue
                if suggestion not in all_suggestions:
                    all_suggestions.append(f"[AI] {suggestion}")
        
        # Step 6: Determine overall rating
        rating = self._calculate_rating(all_issues, all_suggestions, ai_results)
        
        # Step 7: Generate assessment
        assessment = self._generate_assessment(language, all_issues, all_suggestions, rating)
        
        return {
            'language': language,
            'issues': all_issues,
            'suggestions': all_suggestions,
            'rating': rating,
            'assessment': assessment,
            'static_analysis': static_results,
            'ai_analysis': ai_results,
            'code_summary': code_summary
        }
    
    def _calculate_rating(self, issues: list, suggestions: list, ai_results: Optional[Dict]) -> str:
        """Calculate overall code quality rating"""
        # Count critical issues (security, bugs)
        critical_count = sum(1 for i in issues if any(
            keyword in i.lower() for keyword in ['security', 'leak', 'crash', 'bug', 'error', 'dangerous']
        ))
        
        # If AI provided rating, consider it
        if ai_results and 'rating' in ai_results:
            ai_rating = ai_results['rating']
            if critical_count > 0:
                return 'Needs Improvement'
            return ai_rating
        
        # Rule-based rating
        if critical_count > 3:
            return 'Poor'
        elif critical_count > 1:
            return 'Needs Improvement'
        elif len(issues) > 5:
            return 'Average'
        elif len(issues) > 2:
            return 'Good'
        else:
            return 'Excellent'
    
    def _generate_assessment(self, language: str, issues: list, suggestions: list, rating: str) -> str:
        """Generate overall assessment"""
        critical_issues = [i for i in issues if any(
            keyword in i.lower() for keyword in ['security', 'leak', 'crash', 'bug']
        )]
        
        if critical_issues:
            return f"The {language} code has {len(critical_issues)} critical issue(s) that should be addressed immediately. " + \
                   f"Overall rating: {rating}. Focus on resolving security and stability issues first."
        elif len(issues) > 0:
            return f"The {language} code is functional but has {len(issues)} issue(s) and {len(suggestions)} suggestion(s) for improvement. " + \
                   f"Overall rating: {rating}. Consider addressing the identified improvements."
        else:
            return f"The {language} code follows best practices with no critical issues found. " + \
                   f"Overall rating: {rating}. Great work!"


# Global reviewer instance
reviewer = CodeReviewer()


# API Endpoints
@app.get("/")
def root():
    """Root endpoint"""
    return {
        "service": "Code Review Agent",
        "version": "1.0.0",
        "supported_languages": ["python", "java", "cpp"],
        "endpoints": {
            "review": "/review",
            "health": "/health"
        }
    }


@app.post("/review", response_model=CodeReviewResponse)
def review_code(request: CodeReviewRequest):
    """
    Review code endpoint
    
    POST /review
    {
        "code": "def hello():\\n    print('hello')",
        "language": "python",  // optional
        "focus": "comprehensive",  // optional
        "use_ai": true  // optional
    }
    """
    try:
        result = reviewer.review(
            code=request.code,
            language=request.language,
            focus=request.focus,
            use_ai=request.use_ai
        )
        return result
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Review failed: {str(e)}")


@app.get("/health")
def health_check():
    """Health check endpoint"""
    api_key_configured = bool(os.getenv("OPENAI_API_KEY"))
    
    return {
        "status": "healthy",
        "ai_enabled": api_key_configured,
        "supported_languages": ["python", "java", "cpp"]
    }


if __name__ == "__main__":
    import uvicorn
    
    print("🚀 Starting Code Review Agent API...")
    print("📝 Supported Languages: Python, Java, C++")
    print("🤖 AI-Powered + Rule-Based Analysis")
    print("\nAPI will be available at: http://localhost:8000")
    print("API Documentation: http://localhost:8000/docs")
    
    uvicorn.run(app, host="0.0.0.0", port=8000)
