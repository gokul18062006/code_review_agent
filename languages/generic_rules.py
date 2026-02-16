"""
Generic Code Quality Analyzer
Works with ANY programming language!
Analyzes code quality patterns that apply universally across all languages
"""

import re
from typing import Dict, List


class GenericRuleChecker:
    """Universal code quality checker for all programming languages"""
    
    def __init__(self, code: str, language: str = "generic"):
        self.code = code
        self.language = language
        self.lines = code.splitlines()
        self.issues: List[Dict] = []
    
    def analyze(self) -> List[Dict]:
        """Run all generic code quality checks"""
        self.check_line_length()
        self.check_code_complexity()
        self.check_naming_conventions()
        self.check_comments()
        self.check_duplication()
        self.check_error_handling()
        self.check_security_patterns()
        self.check_code_smells()
        self.check_best_practices()
        return self.issues
    
    def check_line_length(self):
        """Check for excessively long lines"""
        max_length = 120
        for i, line in enumerate(self.lines, 1):
            if len(line) > max_length:
                self.issues.append({
                    'line': i,
                    'type': 'style',
                    'severity': 'low',
                    'message': f'Line too long ({len(line)} > {max_length} characters)',
                    'suggestion': 'Break long lines into multiple lines for readability'
                })
    
    def check_code_complexity(self):
        """Detect overly complex code structures"""
        # Check for deep nesting
        for i, line in enumerate(self.lines, 1):
            indent = len(line) - len(line.lstrip())
            if indent > 16:  # More than 4 levels of indentation
                self.issues.append({
                    'line': i,
                    'type': 'complexity',
                    'severity': 'medium',
                    'message': 'Deep nesting detected - code may be too complex',
                    'suggestion': 'Consider refactoring into separate functions or methods'
                })
        
        # Check for very long functions/methods
        function_pattern = r'\b(def|function|func|fn|public|private|protected)\s+\w+'
        function_starts = []
        for i, line in enumerate(self.lines, 1):
            if re.search(function_pattern, line):
                function_starts.append(i)
        
        for i in range(len(function_starts) - 1):
            length = function_starts[i + 1] - function_starts[i]
            if length > 50:
                self.issues.append({
                    'line': function_starts[i],
                    'type': 'complexity',
                    'severity': 'high',
                    'message': f'Function/method is too long ({length} lines)',
                    'suggestion': 'Break down large functions into smaller, focused functions'
                })
    
    def check_naming_conventions(self):
        """Check for poor naming practices"""
        # Check for single-letter variable names (except common loop counters)
        bad_names = r'\b([b-hj-z]|[A-HJ-Z])\s*='
        for i, line in enumerate(self.lines, 1):
            if re.search(bad_names, line):
                self.issues.append({
                    'line': i,
                    'type': 'naming',
                    'severity': 'medium',
                    'message': 'Single-letter variable name detected',
                    'suggestion': 'Use descriptive variable names that explain their purpose'
                })
        
        # Check for generic names
        generic_names = r'\b(data|temp|tmp|var|val|value|item)\s*='
        for i, line in enumerate(self.lines, 1):
            if re.search(generic_names, line, re.IGNORECASE):
                self.issues.append({
                    'line': i,
                    'type': 'naming',
                    'severity': 'low',
                    'message': 'Generic variable name detected',
                    'suggestion': 'Use specific, meaningful names instead of generic terms'
                })
    
    def check_comments(self):
        """Analyze comment quality"""
        comment_patterns = [
            r'^\s*#',      # Python, Ruby, Bash
            r'^\s*//',     # JavaScript, Java, C++, Go
            r'^\s*/\*',    # C-style
            r'^\s*--',     # SQL, Lua
        ]
        
        total_lines = len([l for l in self.lines if l.strip()])
        comment_lines = 0
        
        for line in self.lines:
            for pattern in comment_patterns:
                if re.match(pattern, line):
                    comment_lines += 1
                    break
        
        if total_lines > 20 and comment_lines == 0:
            self.issues.append({
                'line': 1,
                'type': 'documentation',
                'severity': 'medium',
                'message': 'No comments found in code',
                'suggestion': 'Add comments to explain complex logic and intent'
            })
    
    def check_duplication(self):
        """Detect duplicate/similar code"""
        line_hashes = {}
        for i, line in enumerate(self.lines, 1):
            stripped = line.strip()
            if len(stripped) > 20:  # Ignore short lines
                if stripped in line_hashes:
                    self.issues.append({
                        'line': i,
                        'type': 'duplication',
                        'severity': 'medium',
                        'message': f'Duplicate code detected (also on line {line_hashes[stripped]})',
                        'suggestion': 'Extract duplicate code into a reusable function'
                    })
                else:
                    line_hashes[stripped] = i
    
    def check_error_handling(self):
        """Check for error handling patterns"""
        # Look for try/catch blocks
        has_error_handling = any(
            re.search(r'\b(try|catch|except|rescue|panic|unwrap)\b', line, re.IGNORECASE)
            for line in self.lines
        )
        
        # Look for risky operations
        risky_ops = [
            r'\bopen\s*\(',
            r'\bread\s*\(',
            r'\bwrite\s*\(',
            r'\bconnect\s*\(',
            r'\bparse\s*\(',
        ]
        
        has_risky = any(
            re.search(pattern, line, re.IGNORECASE)
            for line in self.lines
            for pattern in risky_ops
        )
        
        if has_risky and not has_error_handling:
            self.issues.append({
                'line': 1,
                'type': 'error_handling',
                'severity': 'high',
                'message': 'No error handling found for risky operations',
                'suggestion': 'Add try/catch or error checking for file operations, network calls, etc.'
            })
    
    def check_security_patterns(self):
        """Detect common security issues"""
        security_patterns = {
            r'eval\s*\(': 'Avoid eval() - it can execute arbitrary code',
            r'exec\s*\(': 'Avoid exec() - it can execute arbitrary code',
            r'password\s*=\s*["\'][\w]+["\']': 'Hard-coded password detected',
            r'api[_-]?key\s*=\s*["\'][\w]+["\']': 'Hard-coded API key detected',
            r'token\s*=\s*["\'][\w]+["\']': 'Hard-coded token detected',
            r'SELECT\s+.*\+': 'Possible SQL injection vulnerability',
        }
        
        for i, line in enumerate(self.lines, 1):
            for pattern, message in security_patterns.items():
                if re.search(pattern, line, re.IGNORECASE):
                    self.issues.append({
                        'line': i,
                        'type': 'security',
                        'severity': 'critical',
                        'message': message,
                        'suggestion': 'Use environment variables and parameterized queries'
                    })
    
    def check_code_smells(self):
        """Detect common code smells"""
        # Magic numbers
        magic_number = r'(?<!\w)([2-9]\d{2,}|[1-9]\d{4,})(?!\w)'
        for i, line in enumerate(self.lines, 1):
            if re.search(magic_number, line):
                self.issues.append({
                    'line': i,
                    'type': 'code_smell',
                    'severity': 'low',
                    'message': 'Magic number detected',
                    'suggestion': 'Replace magic numbers with named constants'
                })
        
        # Long parameter lists
        long_params = r'\([^)]{80,}\)'
        for i, line in enumerate(self.lines, 1):
            if re.search(long_params, line):
                self.issues.append({
                    'line': i,
                    'type': 'code_smell',
                    'severity': 'medium',
                    'message': 'Function has too many parameters',
                    'suggestion': 'Consider using a configuration object or builder pattern'
                })
    
    def check_best_practices(self):
        """Check for language-agnostic best practices"""
        code_lower = self.code.lower()
        
        # Check for TODO/FIXME comments
        todo_pattern = r'\b(TODO|FIXME|XXX|HACK)\b'
        for i, line in enumerate(self.lines, 1):
            if re.search(todo_pattern, line, re.IGNORECASE):
                self.issues.append({
                    'line': i,
                    'type': 'maintenance',
                    'severity': 'low',
                    'message': 'TODO/FIXME comment found',
                    'suggestion': 'Address or track this technical debt'
                })
        
        # Check for console output in production code
        console_patterns = [
            r'\bconsole\.log\s*\(',
            r'\bprint\s*\(',
            r'\bprintf\s*\(',
            r'\becho\s+',
            r'System\.out\.print',
        ]
        
        for i, line in enumerate(self.lines, 1):
            for pattern in console_patterns:
                if re.search(pattern, line):
                    self.issues.append({
                        'line': i,
                        'type': 'best_practice',
                        'severity': 'low',
                        'message': 'Console output detected',
                        'suggestion': 'Use proper logging instead of console output in production code'
                    })
                    break


def analyze_generic_code(code: str, language: str = "generic") -> List[Dict]:
    """
    Main entry point for generic code analysis
    
    Args:
        code: Source code to analyze
        language: Detected language name
    
    Returns:
        List of issues found
    """
    checker = GenericRuleChecker(code, language)
    return checker.analyze()
