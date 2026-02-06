"""
Dynamic Prompt Builder for Multi-Language Code Review
"""

from typing import Dict


class PromptBuilder:
    """Builds AI prompts dynamically based on programming language"""
    
    # Language-specific expertise and focus areas
    LANGUAGE_CONTEXT = {
        'python': {
            'expertise': 'senior Python developer',
            'focus_areas': [
                'PEP 8 compliance',
                'Pythonic idioms',
                'Type hints usage',
                'Exception handling',
                'List comprehensions vs loops',
                'Context managers',
                'Generator usage'
            ],
            'common_issues': [
                'Mutable default arguments',
                'Variable scope issues',
                'Import organization',
                'String formatting'
            ]
        },
        'java': {
            'expertise': 'senior Java developer',
            'focus_areas': [
                'OOP principles',
                'SOLID principles',
                'Exception hierarchy',
                'Resource management',
                'Collections framework usage',
                'Concurrency issues',
                'Java naming conventions'
            ],
            'common_issues': [
                'String comparison with ==',
                'Missing @Override',
                'Improper exception handling',
                'Resource leaks'
            ]
        },
        'cpp': {
            'expertise': 'senior C++ developer',
            'focus_areas': [
                'Memory management',
                'RAII pattern',
                'Smart pointer usage',
                'Const correctness',
                'Move semantics',
                'Template usage',
                'Modern C++ features (C++11/14/17/20)'
            ],
            'common_issues': [
                'Memory leaks',
                'Dangling pointers',
                'Undefined behavior',
                'Buffer overflows',
                'Using namespace std in headers'
            ]
        }
    }
    
    @staticmethod
    def build_review_prompt(code: str, language: str, focus: str = 'comprehensive') -> str:
        """
        Build a review prompt based on language and focus area
        
        Args:
            code: Source code to review
            language: Programming language
            focus: Focus area (comprehensive, security, performance, style)
            
        Returns:
            Formatted prompt string
        """
        lang_context = PromptBuilder.LANGUAGE_CONTEXT.get(language, {
            'expertise': 'senior software developer',
            'focus_areas': ['Code quality', 'Best practices'],
            'common_issues': ['Common bugs']
        })
        
        base_prompt = f"""You are a {lang_context['expertise']} conducting a thorough code review.

REVIEW THE FOLLOWING {language.upper()} CODE:

```{language}
{code}
```

REVIEW CRITERIA:
1. **Bugs & Errors**: Identify any logical errors, runtime issues, or potential crashes
2. **Security**: Check for security vulnerabilities, input validation, and data exposure
3. **Performance**: Analyze algorithmic complexity, resource usage, and optimization opportunities
4. **Best Practices**: Evaluate adherence to {language} conventions and industry standards
5. **Maintainability**: Assess code readability, documentation, and structure

LANGUAGE-SPECIFIC FOCUS AREAS FOR {language.upper()}:
"""
        
        for area in lang_context['focus_areas']:
            base_prompt += f"- {area}\n"
        
        base_prompt += f"\nCOMMON {language.upper()} PITFALLS TO CHECK:\n"
        for issue in lang_context['common_issues']:
            base_prompt += f"- {issue}\n"
        
        base_prompt += """
REQUIRED OUTPUT FORMAT:

**ISSUES FOUND:**
[List critical issues, bugs, and security concerns. Use bullet points. If none, write "No critical issues found"]

**SUGGESTIONS:**
[List improvements, optimizations, and best practice recommendations. Use bullet points]

**CODE QUALITY RATING:**
[Provide one of: Excellent / Good / Average / Needs Improvement / Poor]

**OVERALL ASSESSMENT:**
[2-3 sentence summary of the code quality and main recommendations]

Be specific, actionable, and constructive in your feedback.
"""
        
        return base_prompt
    
    @staticmethod
    def build_focused_prompt(code: str, language: str, focus_type: str) -> str:
        """
        Build a focused review prompt for specific concern
        
        Args:
            code: Source code
            language: Programming language
            focus_type: 'security', 'performance', or 'style'
            
        Returns:
            Focused prompt
        """
        focus_prompts = {
            'security': f"""You are a security expert reviewing {language} code.

Analyze this code for security vulnerabilities:
```{language}
{code}
```

Check for:
- SQL injection risks
- XSS vulnerabilities  
- Hardcoded credentials
- Input validation issues
- Authentication/authorization flaws
- Cryptographic weaknesses

Provide specific security issues and remediation steps.""",

            'performance': f"""You are a performance optimization expert reviewing {language} code.

Analyze this code for performance issues:
```{language}
{code}
```

Check for:
- Algorithmic complexity (Big O)
- Unnecessary loops or iterations
- Memory inefficiency
- I/O bottlenecks
- Caching opportunities
- Database query optimization

Provide specific performance improvements with expected impact.""",

            'style': f"""You are a code style and readability expert reviewing {language} code.

Analyze this code for style and maintainability:
```{language}
{code}
```

Check for:
- Naming conventions
- Code organization
- Documentation quality
- Consistency
- Readability
- Design patterns usage

Provide specific style improvements."""
        }
        
        return focus_prompts.get(focus_type, PromptBuilder.build_review_prompt(code, language))
    
    @staticmethod
    def build_summary_prompt(code: str, language: str) -> str:
        """Build prompt for code summary/explanation"""
        return f"""Provide a concise summary of this {language} code:

```{language}
{code}
```

Include:
1. What the code does (1-2 sentences)
2. Main components/functions
3. Key dependencies
4. Potential use cases"""


if __name__ == "__main__":
    # Test prompt building
    sample_code = """
def process_data(data):
    result = []
    for item in data:
        if item > 0:
            result.append(item * 2)
    return result
"""
    
    builder = PromptBuilder()
    prompt = builder.build_review_prompt(sample_code, 'python')
    print(prompt)
    print("\n" + "="*80 + "\n")
    
    security_prompt = builder.build_focused_prompt(sample_code, 'python', 'security')
    print(security_prompt)
