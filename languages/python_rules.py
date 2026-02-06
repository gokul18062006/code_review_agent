"""
Python-specific static analysis rules
"""

import re
import ast
from typing import List, Dict


class PythonRuleChecker:
    """Static analysis rules for Python code"""
    
    def __init__(self):
        self.issues = []
        self.suggestions = []
    
    def check_all(self, code: str) -> Dict[str, List[str]]:
        """
        Run all Python checks
        
        Args:
            code: Python source code
            
        Returns:
            Dictionary with issues and suggestions
        """
        self.issues = []
        self.suggestions = []
        
        self.check_unused_variables(code)
        self.check_function_length(code)
        self.check_docstrings(code)
        self.check_hardcoded_secrets(code)
        self.check_exception_handling(code)
        self.check_naming_conventions(code)
        self.check_imports(code)
        self.check_complexity(code)
        
        return {
            'issues': self.issues,
            'suggestions': self.suggestions
        }
    
    def check_unused_variables(self, code: str):
        """Check for unused variables"""
        try:
            tree = ast.parse(code)
            assigned_vars = set()
            used_vars = set()
            
            for node in ast.walk(tree):
                if isinstance(node, ast.Assign):
                    for target in node.targets:
                        if isinstance(target, ast.Name):
                            assigned_vars.add(target.id)
                elif isinstance(node, ast.Name) and isinstance(node.ctx, ast.Load):
                    used_vars.add(node.id)
            
            unused = assigned_vars - used_vars
            if unused and not any(var.startswith('_') for var in unused):
                self.issues.append(f"Unused variables detected: {', '.join(list(unused)[:3])}")
                self.suggestions.append("Remove unused variables or prefix with '_' if intentional")
        except:
            pass
    
    def check_function_length(self, code: str):
        """Check for functions that are too long"""
        lines = code.split('\n')
        in_function = False
        function_start = 0
        function_name = ""
        
        for i, line in enumerate(lines):
            if re.match(r'\s*def\s+(\w+)', line):
                if in_function:
                    length = i - function_start
                    if length > 50:
                        self.issues.append(f"Function '{function_name}' is too long ({length} lines)")
                        self.suggestions.append("Break down long functions into smaller, reusable functions")
                
                match = re.match(r'\s*def\s+(\w+)', line)
                function_name = match.group(1)
                function_start = i
                in_function = True
    
    def check_docstrings(self, code: str):
        """Check for missing docstrings"""
        try:
            tree = ast.parse(code)
            
            for node in ast.walk(tree):
                if isinstance(node, (ast.FunctionDef, ast.ClassDef)):
                    if not ast.get_docstring(node):
                        self.issues.append(f"Missing docstring for {node.name}")
                        self.suggestions.append("Add docstrings to functions and classes for better documentation")
        except:
            pass
    
    def check_hardcoded_secrets(self, code: str):
        """Check for potential hardcoded secrets"""
        secret_patterns = [
            (r'password\s*=\s*["\'](?!{{)[^"\']+["\']', "Potential hardcoded password"),
            (r'api[_-]?key\s*=\s*["\'](?!{{)[^"\']+["\']', "Potential hardcoded API key"),
            (r'secret\s*=\s*["\'](?!{{)[^"\']+["\']', "Potential hardcoded secret"),
            (r'token\s*=\s*["\'](?!{{)[^"\']+["\']', "Potential hardcoded token"),
        ]
        
        for pattern, message in secret_patterns:
            if re.search(pattern, code, re.IGNORECASE):
                self.issues.append(f"🔒 Security: {message} detected")
                self.suggestions.append("Use environment variables or secure vaults for sensitive data")
                break
    
    def check_exception_handling(self, code: str):
        """Check exception handling practices"""
        if re.search(r'except\s*:', code):
            self.issues.append("Bare 'except:' clause detected")
            self.suggestions.append("Catch specific exceptions instead of using bare except")
        
        if re.search(r'except\s+Exception\s*:', code):
            self.suggestions.append("Consider catching more specific exceptions instead of broad Exception")
    
    def check_naming_conventions(self, code: str):
        """Check naming conventions"""
        # Check for camelCase in function names (should be snake_case)
        camel_case_functions = re.findall(r'def\s+([a-z]+[A-Z]\w+)\s*\(', code)
        if camel_case_functions:
            self.issues.append(f"Non-Pythonic naming: {camel_case_functions[0]}() uses camelCase")
            self.suggestions.append("Use snake_case for function names (PEP 8)")
        
        # Check for single-letter variable names (except in comprehensions/loops)
        single_letter_vars = re.findall(r'\b([a-z])\s*=\s*', code)
        if len(single_letter_vars) > 3:
            self.suggestions.append("Avoid excessive single-letter variable names; use descriptive names")
    
    def check_imports(self, code: str):
        """Check import statements"""
        lines = code.split('\n')
        
        # Check for wildcard imports
        wildcard_imports = [line for line in lines if re.match(r'from\s+\w+\s+import\s+\*', line)]
        if wildcard_imports:
            self.issues.append("Wildcard import detected (from x import *)")
            self.suggestions.append("Use explicit imports instead of wildcard imports")
        
        # Check import order
        import_lines = [i for i, line in enumerate(lines) if line.strip().startswith(('import ', 'from '))]
        if import_lines and max(import_lines) - min(import_lines) > len(import_lines) + 5:
            self.suggestions.append("Group imports at the top of the file (PEP 8)")
    
    def check_complexity(self, code: str):
        """Check code complexity indicators"""
        # Check for deeply nested code
        max_indent = 0
        for line in code.split('\n'):
            if line.strip():
                indent = len(line) - len(line.lstrip())
                max_indent = max(max_indent, indent // 4)
        
        if max_indent > 4:
            self.issues.append(f"Deep nesting detected (level {max_indent})")
            self.suggestions.append("Reduce nesting by extracting functions or using early returns")


if __name__ == "__main__":
    # Test the rule checker
    test_code = """
def myFunction():
    password = "hardcoded123"
    x = 10
    y = 20
    unused_var = 30
    
    try:
        result = x / y
    except:
        pass
    
    return result
"""
    
    checker = PythonRuleChecker()
    results = checker.check_all(test_code)
    
    print("Issues:")
    for issue in results['issues']:
        print(f"  - {issue}")
    
    print("\nSuggestions:")
    for suggestion in results['suggestions']:
        print(f"  - {suggestion}")
