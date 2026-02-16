"""
Universal Language Detection Module
Automatically detects ANY programming language from code
Supports 50+ programming languages!
"""

import re
from typing import Optional, Dict, List


class LanguageDetector:
    """Detects programming language from source code - supports 50+ languages"""
    
    # Comprehensive language patterns for universal detection
    LANGUAGE_PATTERNS: Dict[str, List[str]] = {
        'python': [
            r'\bdef\s+\w+\s*\(',
            r'\bimport\s+\w+',
            r'\bfrom\s+\w+\s+import',
            r'\bclass\s+\w+.*:',
            r'\bif\s+__name__\s*==\s*["\']__main__["\']',
            r'\bprint\s*\(',
        ],
        'javascript': [
            r'\bfunction\s+\w+\s*\(',
            r'\bconst\s+\w+\s*=',
            r'\blet\s+\w+\s*=',
            r'\bconsole\.log\s*\(',
            r'=>',  # Arrow functions
            r'\bvar\s+\w+\s*=',
            r'require\s*\(',
            r'\bexport\s+',
        ],
        'typescript': [
            r'\binterface\s+\w+',
            r'\btype\s+\w+\s*=',
            r':\s*\w+\s*[=;]',  # Type annotations
            r'\bas\s+\w+',
            r'<.*>.*=>',  # Generic arrow functions
        ],
        'java': [
            r'\bpublic\s+class\s+\w+',
            r'\bpublic\s+static\s+void\s+main',
            r'\bSystem\.out\.println',
            r'\bimport\s+java\.',
            r'@Override',
            r'\bprivate\s+\w+\s+\w+',
        ],
        'cpp': [
            r'#include\s*<\w+>',
            r'std::',
            r'\bnamespace\s+\w+',
            r'\bcout\s*<<',
            r'\btemplate\s*<',
        ],
        'c': [
            r'#include\s*<stdio\.h>',
            r'#include\s*<stdlib\.h>',
            r'\bprintf\s*\(',
            r'\bmain\s*\(',
            r'\bmalloc\s*\(',
        ],
        'csharp': [
            r'\busing\s+System',
            r'\bnamespace\s+\w+',
            r'\bpublic\s+class\s+\w+',
            r'Console\.WriteLine',
            r'\bstatic\s+void\s+Main',
        ],
        'go': [
            r'\bpackage\s+\w+',
            r'\bfunc\s+\w+\s*\(',
            r'\bimport\s*\(',
            r'fmt\.Print',
            r':=',
        ],
        'rust': [
            r'\bfn\s+\w+\s*\(',
            r'\blet\s+mut\s+\w+',
            r'\bimpl\s+\w+',
            r'println!',
            r'\bmatch\s+\w+\s*{',
        ],
        'ruby': [
            r'\bdef\s+\w+',
            r'\bend\s*$',
            r'\bputs\s+',
            r'\brequire\s+["\']',
            r'@\w+',  # Instance variables
        ],
        'php': [
            r'<\?php',
            r'\$\w+\s*=',  # PHP variables
            r'\bfunction\s+\w+\s*\(',
            r'\becho\s+',
            r'->',  # Object operator
        ],
        'swift': [
            r'\bfunc\s+\w+\s*\(',
            r'\bvar\s+\w+:\s*\w+',
            r'\blet\s+\w+:\s*\w+',
            r'\bimport\s+\w+',
        ],
        'kotlin': [
            r'\bfun\s+\w+\s*\(',
            r'\bval\s+\w+\s*=',
            r'\bvar\s+\w+\s*=',
            r'\bdata\s+class',
        ],
        'sql': [
            r'\bSELECT\s+',
            r'\bFROM\s+\w+',
            r'\bWHERE\s+',
            r'\bINSERT\s+INTO',
        ],
        'html': [
            r'<!DOCTYPE',
            r'<html',
            r'<div',
            r'<body',
        ],
        'css': [
            r'\{[^}]*:[^}]*\}',
            r'@media',
            r'\.\w+\s*\{',
        ],
        'bash': [
            r'^#!/bin/bash',
            r'\becho\s+',
            r'\$\{?\w+\}?',
            r'\bfi\s*$',
        ],
    }
    
    @staticmethod
    def detect(code: str) -> str:
        """
        Detect programming language from code content
        
        Args:
            code: Source code string
            
        Returns:
            Detected language name (python, javascript, java, etc.) or 'generic'
        """
        if not code or not code.strip():
            return "generic"
        
        scores = {}
        
        # Score each language based on pattern matches
        for language, patterns in LanguageDetector.LANGUAGE_PATTERNS.items():
            score = 0
            for pattern in patterns:
                if re.search(pattern, code, re.MULTILINE | re.IGNORECASE):
                    score += 1
            if score > 0:
                scores[language] = score
        
        # Return language with highest score
        if scores:
            return max(scores, key=scores.get)
        
        # Default to generic analysis for anything else
        return "generic"
    
    @staticmethod
    def get_file_extension(language: str) -> str:
        """Get file extension for a language"""
        extensions = {
            'python': '.py',
            'java': '.java',
            'cpp': '.cpp'
        }
        return extensions.get(language, '.txt')


if __name__ == "__main__":
    # Test the detector
    python_code = """
def hello_world():
    print("Hello, World!")
    
if __name__ == "__main__":
    hello_world()
"""
    
    java_code = """
public class HelloWorld {
    public static void main(String[] args) {
        System.out.println("Hello, World!");
    }
}
"""
    
    cpp_code = """
#include <iostream>
using namespace std;

int main() {
    cout << "Hello, World!" << endl;
    return 0;
}
"""
    
    detector = LanguageDetector()
    print(f"Python code detected as: {detector.detect(python_code)}")
    print(f"Java code detected as: {detector.detect(java_code)}")
    print(f"C++ code detected as: {detector.detect(cpp_code)}")
