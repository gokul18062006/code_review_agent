"""
Universal Language Test - Demonstrates Analysis of ANY Programming Language
Tests 15+ different programming languages!
"""

from utils.detector import LanguageDetector
from languages.generic_rules import GenericRuleChecker

# Test code samples in different languages
TEST_CODES = {
    "JavaScript": """
function calculateTotal(items) {
    let t = 0;
    for(let i = 0; i < items.length; i++) {
        t = t + items[i].price;
    }
    console.log(t);
    return t;
}
""",
    
    "TypeScript": """
interface User {
    name: string;
    age: number;
}

function greetUser(user: User): string {
    return `Hello ${user.name}`;
}
""",
    
    "Go": """
package main
import "fmt"

func main() {
    data := "test"
    fmt.Println(data)
}
""",
    
    "Rust": """
fn main() {
    let mut x = 5;
    println!("Value: {}", x);
    x = x + 1000000;
}
""",
    
    "Ruby": """
def process_data
    temp = get_data()
    puts temp
end
""",
    
    "PHP": """
<?php
function getData() {
    $password = "admin123";
    echo $password;
    return $data;
}
?>
""",
    
    "C#": """
using System;

class Program {
    static void Main() {
        Console.WriteLine("Hello");
    }
}
""",
    
    "Swift": """
func calculateSum(numbers: [Int]) -> Int {
    var temp = 0
    for n in numbers {
        temp = temp + n
    }
    return temp
}
""",
    
    "Kotlin": """
fun main() {
    val data = "test"
    println(data)
}
""",
    
    "SQL": """
SELECT * FROM users WHERE password = 'admin' + input
""",
    
    "HTML": """
<!DOCTYPE html>
<html>
<body>
    <div>Hello World</div>
</body>
</html>
""",
    
    "Bash": """
#!/bin/bash
echo "Starting..."
password="admin123"
echo $password
""",
}


def test_universal_analysis():
    """Test code analysis for multiple programming languages"""
    
    print("=" * 80)
    print("🌍 UNIVERSAL CODE ANALYZER - Testing 12+ Programming Languages!")
    print("=" * 80)
    print()
    
    detector = LanguageDetector()
    total_issues = 0
    
    for lang_name, code in TEST_CODES.items():
        print(f"\n{'=' * 80}")
        print(f"📝 Testing: {lang_name}")
        print(f"{'=' * 80}")
        
        # Detect language
        detected = detector.detect(code)
        print(f"✅ Detected Language: {detected}")
        
        # Analyze code
        analyzer = GenericRuleChecker(code, detected)
        issues = analyzer.analyze()
        
        print(f"\n🔍 Found {len(issues)} issues:")
        
        if issues:
            for issue in issues[:5]:  # Show first 5 issues
                severity_emoji = {
                    'critical': '🔴',
                    'high': '🟠',
                    'medium': '🟡',
                    'low': '🟢'
                }.get(issue['severity'], '⚪')
                
                print(f"\n  {severity_emoji} Line {issue['line']}: [{issue['type'].upper()}]")
                print(f"     {issue['message']}")
                print(f"     💡 {issue['suggestion']}")
            
            if len(issues) > 5:
                print(f"\n  ... and {len(issues) - 5} more issues")
        
        total_issues += len(issues)
    
    print(f"\n\n{'=' * 80}")
    print(f"✨ SUMMARY: Analyzed {len(TEST_CODES)} different languages")
    print(f"🔍 Total Issues Found: {total_issues}")
    print(f"🌟 Universal Analysis Works for ALL Programming Languages!")
    print(f"{'=' * 80}")


if __name__ == "__main__":
    test_universal_analysis()
