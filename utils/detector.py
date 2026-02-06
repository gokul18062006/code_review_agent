"""
Language Detection Module
Automatically detects programming language from code
"""

import re
from typing import Optional


class LanguageDetector:
    """Detects programming language from source code"""
    
    @staticmethod
    def detect(code: str) -> str:
        """
        Detect programming language from code content
        
        Args:
            code: Source code string
            
        Returns:
            Detected language: 'python', 'java', 'cpp', or 'unknown'
        """
        if not code or not code.strip():
            return "unknown"
        
        # Python indicators
        python_patterns = [
            r'\bdef\s+\w+\s*\(',
            r'\bimport\s+\w+',
            r'\bfrom\s+\w+\s+import',
            r'\bclass\s+\w+.*:',
            r'^\s*#.*$',  # Python comments
            r'\bif\s+__name__\s*==\s*["\']__main__["\']',
        ]
        
        # Java indicators
        java_patterns = [
            r'\bpublic\s+class\s+\w+',
            r'\bpublic\s+static\s+void\s+main',
            r'\bprivate\s+\w+\s+\w+',
            r'\bSystem\.out\.println',
            r'\bimport\s+java\.',
            r'\@Override',
        ]
        
        # C++ indicators
        cpp_patterns = [
            r'#include\s*<\w+>',
            r'#include\s*"\w+"',
            r'\bstd::\w+',
            r'\busing\s+namespace\s+std',
            r'\bint\s+main\s*\(',
            r'\bcout\s*<<',
            r'\bcin\s*>>',
            r'->',  # Pointer operator
        ]
        
        # Count pattern matches
        python_score = sum(1 for p in python_patterns if re.search(p, code, re.MULTILINE))
        java_score = sum(1 for p in java_patterns if re.search(p, code, re.MULTILINE))
        cpp_score = sum(1 for p in cpp_patterns if re.search(p, code, re.MULTILINE))
        
        # Determine language based on highest score
        scores = {
            'python': python_score,
            'java': java_score,
            'cpp': cpp_score
        }
        
        max_score = max(scores.values())
        if max_score == 0:
            return "unknown"
        
        return max(scores, key=scores.get)
    
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
