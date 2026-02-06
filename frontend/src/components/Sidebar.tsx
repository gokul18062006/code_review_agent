import { Settings, BookOpen } from 'lucide-react';

interface SidebarProps {
  language: string;
  setLanguage: (lang: string) => void;
  focus: 'comprehensive' | 'security' | 'performance' | 'style';
  setFocus: (focus: 'comprehensive' | 'security' | 'performance' | 'style') => void;
  useAI: boolean;
  setUseAI: (use: boolean) => void;
  onLoadExample: (code: string) => void;
}

const EXAMPLES = {
  'python-bad': `def myFunction():
    password = "hardcoded123"
    x = 10
    unused_var = 20
    
    try:
        result = x / 0
    except:
        pass
    
    return result`,
  
  'python-good': `def calculate_sum(numbers: list[int]) -> int:
    """
    Calculate the sum of a list of numbers.
    
    Args:
        numbers: List of integers to sum
        
    Returns:
        Sum of all numbers
    """
    if not numbers:
        raise ValueError("Cannot sum empty list")
    
    return sum(numbers)`,
  
  'java-bad': `public class testClass {
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
}`,
  
  'cpp-bad': `#include <stdio.h>
using namespace std;

int main() {
    int* data = new int[10];
    int* ptr = NULL;
    
    int value = *ptr;
    
    return 0;
}`
};

export default function Sidebar({
  language,
  setLanguage,
  focus,
  setFocus,
  useAI,
  setUseAI,
  onLoadExample
}: SidebarProps) {
  return (
    <div className="space-y-6">
      {/* Supported Languages */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">
          📊 Supported Languages
        </h3>
        <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
          <div>✅ Python</div>
          <div>✅ Java</div>
          <div>✅ C++</div>
        </div>
      </div>
    </div>
  );
}
