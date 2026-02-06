"""
C++ specific static analysis rules
"""

import re
from typing import List, Dict


class CppRuleChecker:
    """Static analysis rules for C++ code"""
    
    def __init__(self):
        self.issues = []
        self.suggestions = []
    
    def check_all(self, code: str) -> Dict[str, List[str]]:
        """
        Run all C++ checks
        
        Args:
            code: C++ source code
            
        Returns:
            Dictionary with issues and suggestions
        """
        self.issues = []
        self.suggestions = []
        
        self.check_memory_management(code)
        self.check_namespace_usage(code)
        self.check_const_correctness(code)
        self.check_pointer_usage(code)
        self.check_exception_handling(code)
        self.check_includes(code)
        self.check_resource_management(code)
        self.check_modern_cpp(code)
        
        return {
            'issues': self.issues,
            'suggestions': self.suggestions
        }
    
    def check_memory_management(self, code: str):
        """Check memory management practices"""
        # Check for new without corresponding delete
        new_count = len(re.findall(r'\bnew\b', code))
        delete_count = len(re.findall(r'\bdelete\b', code))
        
        if new_count > delete_count:
            self.issues.append(f"Potential memory leak: {new_count} 'new' but only {delete_count} 'delete'")
            self.suggestions.append("Ensure every 'new' has a corresponding 'delete'")
        
        # Check for malloc/free usage
        if 'malloc' in code or 'calloc' in code:
            self.suggestions.append("Consider using 'new/delete' instead of malloc/free in C++")
        
        # Suggest smart pointers
        if 'new' in code and 'unique_ptr' not in code and 'shared_ptr' not in code:
            self.suggestions.append("Consider using smart pointers (unique_ptr, shared_ptr) instead of raw pointers")
    
    def check_namespace_usage(self, code: str):
        """Check namespace usage"""
        if re.search(r'using\s+namespace\s+std\s*;', code):
            self.issues.append("Using 'using namespace std' in global scope")
            self.suggestions.append("Avoid 'using namespace std' to prevent name conflicts; use std:: prefix")
    
    def check_const_correctness(self, code: str):
        """Check const correctness"""
        # Check for methods that should be const
        method_pattern = r'(\w+)\s+(\w+)\s*\([^)]*\)\s*{'
        methods = re.findall(method_pattern, code)
        const_methods = re.findall(r'(\w+)\s+(\w+)\s*\([^)]*\)\s*const\s*{', code)
        
        if len(methods) > len(const_methods) + 2:
            self.suggestions.append("Consider marking methods as 'const' when they don't modify object state")
        
        # Check for non-const references in getters
        getters = re.findall(r'(\w+&)\s+get\w+\s*\(', code)
        if getters:
            self.suggestions.append("Return const references from getter methods")
    
    def check_pointer_usage(self, code: str):
        """Check pointer usage"""
        # Check for NULL instead of nullptr
        if re.search(r'\bNULL\b', code):
            self.issues.append("Using NULL instead of nullptr")
            self.suggestions.append("Use nullptr instead of NULL in C++11 and later")
        
        # Check for raw pointer dereferencing without null check
        pointer_deref = re.findall(r'(\w+)->(\w+)', code)
        if pointer_deref and 'if' not in code[:code.find('->') if '->' in code else 0]:
            self.suggestions.append("Add null checks before dereferencing pointers")
    
    def check_exception_handling(self, code: str):
        """Check exception handling"""
        # Check for throw() specification (deprecated)
        if 'throw()' in code:
            self.issues.append("Using deprecated throw() specification")
            self.suggestions.append("Use noexcept instead of throw() in C++11 and later")
        
        # Check for catch(...) without rethrowing
        if re.search(r'catch\s*\(\s*\.\.\.\s*\)\s*{(?!.*throw)', code):
            self.suggestions.append("Consider rethrowing or logging in catch(...) blocks")
    
    def check_includes(self, code: str):
        """Check include directives"""
        # Check for C headers instead of C++ versions
        c_headers = ['stdio.h', 'stdlib.h', 'string.h', 'math.h']
        for header in c_headers:
            if f'#{header}' in code or f'"{header}"' in code:
                cpp_header = 'c' + header.replace('.h', '')
                self.suggestions.append(f"Use <{cpp_header}> instead of <{header}> in C++")
                break
    
    def check_resource_management(self, code: str):
        """Check resource management (RAII)"""
        # Check for manual file handling without RAII
        if 'fopen' in code or 'open' in code:
            if 'fclose' not in code and 'close' not in code:
                self.issues.append("File opened but not closed")
                self.suggestions.append("Use RAII pattern (e.g., std::ifstream/ofstream) for automatic resource management")
    
    def check_modern_cpp(self, code: str):
        """Check for modern C++ practices"""
        # Check for C-style casts
        c_casts = re.findall(r'\(\s*\w+\s*\*?\s*\)', code)
        if c_casts and 'static_cast' not in code:
            self.suggestions.append("Use C++ style casts (static_cast, dynamic_cast) instead of C-style casts")
        
        # Check for manual array management
        if re.search(r'\bnew\s+\w+\s*\[', code) and 'vector' not in code:
            self.suggestions.append("Consider using std::vector instead of manual array management")
        
        # Check for auto keyword usage
        if code.count('=') > 5 and 'auto' not in code:
            self.suggestions.append("Consider using 'auto' keyword for type deduction in C++11 and later")


if __name__ == "__main__":
    # Test the rule checker
    test_code = """
#include <stdio.h>
using namespace std;

class MyClass {
public:
    int* data;
    
    MyClass() {
        data = new int[10];
    }
    
    int getValue() {
        return *data;
    }
};

int main() {
    MyClass* obj = NULL;
    int value = obj->getValue();
    return 0;
}
"""
    
    checker = CppRuleChecker()
    results = checker.check_all(test_code)
    
    print("Issues:")
    for issue in results['issues']:
        print(f"  - {issue}")
    
    print("\nSuggestions:")
    for suggestion in results['suggestions']:
        print(f"  - {suggestion}")
