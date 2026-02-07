"""
Java-specific static analysis rules
"""

import re
from typing import List, Dict


class JavaRuleChecker:
    """Static analysis rules for Java code"""
    
    def __init__(self):
        self.issues = []
        self.suggestions = []
        self.issue_fixes = []
    
    def check_all(self, code: str) -> Dict[str, List[str]]:
        """
        Run all Java checks
        
        Args:
            code: Java source code
            
        Returns:
            Dictionary with issues and suggestions
        """
        self.issues = []
        self.suggestions = []
        self.issue_fixes = []
        
        self.check_exception_handling(code)
        self.check_constants(code)
        self.check_naming_conventions(code)
        self.check_comments(code)
        self.check_resource_management(code)
        self.check_null_checks(code)
        self.check_string_comparison(code)
        self.check_hardcoded_values(code)
        
        return {
            'issues': self.issues,
            'suggestions': self.suggestions,
            'issue_fixes': self.issue_fixes
        }
    
    def check_exception_handling(self, code: str):
        """Check exception handling practices"""
        # Check for empty catch blocks
        empty_catch = re.findall(r'catch\s*\([^)]+\)\s*{\s*}', code)
        if empty_catch:
            issue = "Empty catch block detected"
            fix = "Add: logger.error(\"Error occurred\", e); or handle the exception"
            self.issues.append(issue)
            self.suggestions.append(fix)
            self.issue_fixes.append({'issue': issue, 'fix': fix})
        
        # Check for catching Exception/Throwable
        if re.search(r'catch\s*\(\s*Exception\s+\w+\s*\)', code):
            fix = "Replace with: catch (IOException | SQLException e)"
            self.suggestions.append(fix)
        
        if re.search(r'catch\s*\(\s*Throwable\s+\w+\s*\)', code):
            issue = "Catching Throwable is dangerous"
            fix = "Use: catch (Exception e) or specific exceptions like IOException"
            self.issues.append(issue)
            self.suggestions.append(fix)
            self.issue_fixes.append({'issue': issue, 'fix': fix})
    
    def check_constants(self, code: str):
        """Check constant declarations"""
        # Check for non-final static variables that should be constants
        non_final_static = re.findall(r'(static\s+(?!final)\w+\s+[A-Z_]+\s*=)', code)
        if non_final_static:
            issue = "Static variable should be final"
            fix = "Change to: private static final TYPE CONSTANT_NAME = value;"
            self.issues.append(issue)
            self.suggestions.append(fix)
            self.issue_fixes.append({'issue': issue, 'fix': fix})
        
        # Check for magic numbers
        magic_numbers = re.findall(r'[^a-zA-Z_]\d{2,}[^a-zA-Z_]', code)
        if len(magic_numbers) > 3:
            fix = "Create constants: private static final int MAX_RETRIES = 100;"
            self.suggestions.append(fix)
    
    def check_naming_conventions(self, code: str):
        """Check Java naming conventions"""
        # Check class names (should be PascalCase)
        class_names = re.findall(r'class\s+([a-z][a-zA-Z0-9]*)', code)
        if class_names:
            issue = f"Class name '{class_names[0]}' should start with uppercase (PascalCase)"
            fix = f"Rename to: {class_names[0].capitalize()}"
            self.issues.append(issue)
            self.suggestions.append(fix)
            self.issue_fixes.append({'issue': issue, 'fix': fix})
        
        # Check method names (should be camelCase)
        method_names = re.findall(r'(?:public|private|protected)\s+\w+\s+([A-Z][a-zA-Z0-9]*)\s*\(', code)
        if method_names:
            self.issues.append(f"Method name '{method_names[0]}' should start with lowercase (camelCase)")
        
        # Check constant names (should be UPPER_CASE)
        constants = re.findall(r'static\s+final\s+\w+\s+([a-z][a-zA-Z0-9]*)\s*=', code)
        if constants:
            self.suggestions.append(f"Constant '{constants[0]}' should be UPPER_CASE")
    
    def check_comments(self, code: str):
        """Check for lack of documentation"""
        # Check for public methods without JavaDoc
        public_methods = re.findall(r'public\s+\w+\s+\w+\s*\([^)]*\)', code)
        javadoc_count = len(re.findall(r'/\*\*', code))
        
        if len(public_methods) > javadoc_count:
            self.suggestions.append("Add JavaDoc comments to public methods")
    
    def check_resource_management(self, code: str):
        """Check resource management"""
        # Check for resources that should use try-with-resources
        resource_types = ['FileInputStream', 'FileOutputStream', 'BufferedReader', 'Connection', 'Statement']
        
        for resource in resource_types:
            if resource in code and 'try (' not in code:
                self.suggestions.append(f"Use try-with-resources for {resource} to ensure proper resource cleanup")
                break
    
    def check_null_checks(self, code: str):
        """Check for potential null pointer issues"""
        # Check for method calls without null checks
        method_calls = re.findall(r'(\w+)\.(\w+)\(', code)
        if method_calls and 'if' not in code and 'null' not in code:
            self.suggestions.append("Consider adding null checks before method calls")
    
    def check_string_comparison(self, code: str):
        """Check string comparison practices"""
        # Check for == instead of .equals()
        string_compare = re.findall(r'(\w+)\s*==\s*"[^"]*"', code)
        if string_compare:
            self.issues.append("String comparison using == instead of .equals()")
            self.suggestions.append("Use .equals() method for string comparison")
    
    def check_hardcoded_values(self, code: str):
        """Check for hardcoded sensitive values"""
        secret_patterns = [
            (r'password\s*=\s*"[^"]+"', "Potential hardcoded password"),
            (r'apiKey\s*=\s*"[^"]+"', "Potential hardcoded API key"),
            (r'secret\s*=\s*"[^"]+"', "Potential hardcoded secret"),
        ]
        
        for pattern, message in secret_patterns:
            if re.search(pattern, code, re.IGNORECASE):
                self.issues.append(f"🔒 Security: {message} detected")
                self.suggestions.append("Use configuration files or environment variables for sensitive data")
                break


if __name__ == "__main__":
    # Test the rule checker
    test_code = """
public class testClass {
    static String API_KEY = "12345";
    
    public void MyMethod() {
        String name = "John";
        if (name == "John") {
            System.out.println("Hello");
        }
        
        try {
            int result = 10 / 0;
        } catch (Exception e) {
            
        }
    }
}
"""
    
    checker = JavaRuleChecker()
    results = checker.check_all(test_code)
    
    print("Issues:")
    for issue in results['issues']:
        print(f"  - {issue}")
    
    print("\nSuggestions:")
    for suggestion in results['suggestions']:
        print(f"  - {suggestion}")
