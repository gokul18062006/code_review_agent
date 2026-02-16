"""
AI-Powered Code Reviewer using LLM
"""

import os
from typing import Dict, List, Optional
from .prompt_builder import PromptBuilder


class AIReviewer:
    """AI-powered code reviewer using language models"""
    
    def __init__(self, api_key: Optional[str] = None, model: str = "gpt-3.5-turbo"):
        """
        Initialize AI reviewer
        
        Args:
            api_key: OpenAI or Gemini API key (optional, will check environment)
            model: Model to use (gpt-3.5-turbo, gpt-4, gemini-pro, etc.)
        """
        # Check for Gemini API key first, then OpenAI
        self.gemini_key = os.getenv("GEMINI_API_KEY")
        self.openai_key = api_key or os.getenv("OPENAI_API_KEY")
        self.model = model
        self.prompt_builder = PromptBuilder()
        self.client = None
        self.use_gemini = False
        
        # Initialize Gemini client if API key available
        if self.gemini_key:
            try:
                import warnings
                warnings.filterwarnings('ignore', category=FutureWarning, module='google.generativeai')
                import google.generativeai as genai
                genai.configure(api_key=self.gemini_key)
                # Use stable V1 model - updated model name
                self.client = genai.GenerativeModel('gemini-1.5-pro-latest')
                self.use_gemini = True
                print("Using Gemini API for code review")
            except ImportError:
                print("Warning: Google Generative AI package not installed. Run: pip install google-generativeai")
        # Otherwise try OpenAI
        elif self.openai_key:
            try:
                from openai import OpenAI
                self.client = OpenAI(api_key=self.openai_key)
                self.use_gemini = False
                print("Using OpenAI API for code review")
            except ImportError:
                print("Warning: OpenAI package not installed. Run: pip install openai")
    
    def review_code(self, code: str, language: str, focus: str = 'comprehensive') -> Dict:
        """
        Review code using AI
        
        Args:
            code: Source code to review
            language: Programming language
            focus: Review focus (comprehensive, security, performance, style)
            
        Returns:
            Dictionary with review results
        """
        if not self.client:
            return self._mock_review(code, language)
        
        try:
            # Build appropriate prompt
            if focus == 'comprehensive':
                prompt = self.prompt_builder.build_review_prompt(code, language)
            else:
                prompt = self.prompt_builder.build_focused_prompt(code, language, focus)
            
            # Call appropriate API
            if self.use_gemini:
                # Call Gemini API
                response = self.client.generate_content(
                    f"You are an expert {language} code reviewer.\n\n{prompt}"
                )
                review_text = response.text
            else:
                # Call OpenAI API
                response = self.client.chat.completions.create(
                    model=self.model,
                    messages=[
                        {"role": "system", "content": f"You are an expert {language} code reviewer."},
                        {"role": "user", "content": prompt}
                    ],
                    temperature=0.3,  # Lower temperature for more consistent reviews
                    max_tokens=1500
                )
                review_text = response.choices[0].message.content
            
            # Parse the response
            return self._parse_review(review_text, language)
            
        except Exception as e:
            print(f"Error calling AI API: {e}")
            return self._mock_review(code, language)
    
    def _parse_review(self, review_text: str, language: str) -> Dict:
        """Parse AI review response into structured format"""
        issues = []
        suggestions = []
        rating = "Good"
        assessment = ""
        
        # Simple parsing (can be enhanced)
        lines = review_text.split('\n')
        current_section = None
        
        for line in lines:
            line = line.strip()
            
            if 'ISSUES FOUND' in line.upper() or 'BUGS' in line.upper():
                current_section = 'issues'
            elif 'SUGGESTIONS' in line.upper() or 'IMPROVEMENTS' in line.upper():
                current_section = 'suggestions'
            elif 'RATING' in line.upper():
                current_section = 'rating'
            elif 'ASSESSMENT' in line.upper() or 'SUMMARY' in line.upper():
                current_section = 'assessment'
            elif line.startswith('-') or line.startswith('•') or line.startswith('*'):
                # Bullet point
                item = line.lstrip('-•* ').strip()
                if item and current_section == 'issues':
                    issues.append(item)
                elif item and current_section == 'suggestions':
                    suggestions.append(item)
            elif current_section == 'rating' and any(r in line for r in ['Excellent', 'Good', 'Average', 'Poor', 'Needs Improvement']):
                for r in ['Excellent', 'Good', 'Average', 'Needs Improvement', 'Poor']:
                    if r in line:
                        rating = r
                        break
            elif current_section == 'assessment' and line and not line.startswith('*'):
                assessment += line + " "
        
        return {
            'issues': issues if issues else ['No critical issues found'],
            'suggestions': suggestions if suggestions else ['Code looks good overall'],
            'rating': rating,
            'assessment': assessment.strip() or 'Code review completed',
            'raw_review': review_text
        }
    
    def _mock_review(self, code: str, language: str) -> Dict:
        """Provide mock review when API not available"""
        return {
            'issues': [],
            'suggestions': [],
            'rating': 'Unknown',
            'assessment': 'Static analysis completed.',
            'raw_review': 'Mock review - API not available'
        }
    
    def get_summary(self, code: str, language: str) -> str:
        """Get AI-generated code summary"""
        if not self.client:
            return f"AI summary unavailable. {language} code with {len(code.split())} lines."
        
        try:
            prompt = self.prompt_builder.build_summary_prompt(code, language)
            
            response = self.client.chat.completions.create(
                model=self.model,
                messages=[
                    {"role": "system", "content": "You are a code documentation expert."},
                    {"role": "user", "content": prompt}
                ],
                temperature=0.5,
                max_tokens=300
            )
            
            return response.choices[0].message.content
            
        except Exception as e:
            return f"Summary unavailable: {str(e)}"


if __name__ == "__main__":
    # Test the reviewer
    sample_code = """
def calculate_total(items):
    total = 0
    for item in items:
        total = total + item
    return total
"""
    
    reviewer = AIReviewer()
    result = reviewer.review_code(sample_code, 'python')
    
    print("AI Review Result:")
    print(f"Rating: {result['rating']}")
    print(f"\nIssues: {result['issues']}")
    print(f"\nSuggestions: {result['suggestions']}")
    print(f"\nAssessment: {result['assessment']}")
