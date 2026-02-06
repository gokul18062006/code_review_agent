"""
Test Examples for Code Review Agent
Run this to test the reviewer with different code samples
"""

from app import CodeReviewer


def test_python_bad():
    """Test Python code with issues"""
    print("\n" + "="*80)
    print("Testing Python - Bad Code Example")
    print("="*80)
    
    code = """
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

def longFunction():
    # This is a very long function
    a = 1
    b = 2
    c = 3
    d = 4
    e = 5
    # Imagine 50 more lines here...
    return a + b + c + d + e
"""
    
    reviewer = CodeReviewer()
    result = reviewer.review(code, 'python', use_ai=False)
    
    print(f"\nLanguage: {result['language']}")
    print(f"Rating: {result['rating']}")
    print(f"\nIssues ({len(result['issues'])}):")
    for issue in result['issues']:
        print(f"  - {issue}")
    print(f"\nSuggestions ({len(result['suggestions'])}):")
    for suggestion in result['suggestions']:
        print(f"  - {suggestion}")
    print(f"\nAssessment: {result['assessment']}")


def test_java_bad():
    """Test Java code with issues"""
    print("\n" + "="*80)
    print("Testing Java - Bad Code Example")
    print("="*80)
    
    code = """
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
    
    reviewer = CodeReviewer()
    result = reviewer.review(code, 'java', use_ai=False)
    
    print(f"\nLanguage: {result['language']}")
    print(f"Rating: {result['rating']}")
    print(f"\nIssues ({len(result['issues'])}):")
    for issue in result['issues']:
        print(f"  - {issue}")
    print(f"\nSuggestions ({len(result['suggestions'])}):")
    for suggestion in result['suggestions']:
        print(f"  - {suggestion}")


def test_cpp_bad():
    """Test C++ code with issues"""
    print("\n" + "="*80)
    print("Testing C++ - Bad Code Example")
    print("="*80)
    
    code = """
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
    
    reviewer = CodeReviewer()
    result = reviewer.review(code, 'cpp', use_ai=False)
    
    print(f"\nLanguage: {result['language']}")
    print(f"Rating: {result['rating']}")
    print(f"\nIssues ({len(result['issues'])}):")
    for issue in result['issues']:
        print(f"  - {issue}")
    print(f"\nSuggestions ({len(result['suggestions'])}):")
    for suggestion in result['suggestions']:
        print(f"  - {suggestion}")


def test_auto_detect():
    """Test automatic language detection"""
    print("\n" + "="*80)
    print("Testing Auto Language Detection")
    print("="*80)
    
    codes = {
        "Python": "def hello():\n    print('Hello, World!')",
        "Java": "public class Hello {\n    public static void main(String[] args) {\n        System.out.println(\"Hello\");\n    }\n}",
        "C++": "#include <iostream>\nint main() {\n    std::cout << \"Hello\" << std::endl;\n    return 0;\n}"
    }
    
    reviewer = CodeReviewer()
    
    for expected_lang, code in codes.items():
        result = reviewer.review(code, language=None, use_ai=False)
        detected = result['language']
        print(f"\nExpected: {expected_lang.lower()}, Detected: {detected} {'✓' if detected == expected_lang.lower() else '✗'}")


def test_good_python():
    """Test well-written Python code"""
    print("\n" + "="*80)
    print("Testing Python - Good Code Example")
    print("="*80)
    
    code = """
from typing import List

def calculate_sum(numbers: List[int]) -> int:
    \"\"\"
    Calculate the sum of a list of numbers.
    
    Args:
        numbers: List of integers to sum
        
    Returns:
        Sum of all numbers
        
    Raises:
        ValueError: If numbers is empty
    \"\"\"
    if not numbers:
        raise ValueError("Cannot calculate sum of empty list")
    
    return sum(numbers)


def process_data(data: List[int]) -> List[int]:
    \"\"\"
    Process data by filtering and transforming.
    
    Args:
        data: Input data list
        
    Returns:
        Processed data list
    \"\"\"
    # Use list comprehension for efficiency
    return [x * 2 for x in data if x > 0]
"""
    
    reviewer = CodeReviewer()
    result = reviewer.review(code, 'python', use_ai=False)
    
    print(f"\nLanguage: {result['language']}")
    print(f"Rating: {result['rating']}")
    print(f"\nIssues ({len(result['issues'])}):")
    for issue in result['issues']:
        print(f"  - {issue}")
    print(f"\nSuggestions ({len(result['suggestions'])}):")
    for suggestion in result['suggestions']:
        print(f"  - {suggestion}")
    print(f"\nAssessment: {result['assessment']}")


if __name__ == "__main__":
    print("\n🔍 Code Review Agent - Test Suite")
    print("="*80)
    
    # Run all tests
    test_auto_detect()
    test_python_bad()
    test_good_python()
    test_java_bad()
    test_cpp_bad()
    
    print("\n" + "="*80)
    print("✅ All tests completed!")
    print("="*80)
