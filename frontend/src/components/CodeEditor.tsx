interface CodeEditorProps {
  code: string;
  setCode: (code: string) => void;
  onReview: () => void;
  loading: boolean;
}

const DEMO_EXAMPLES = {
  bad: `// JavaScript with issues
const password = "admin123";  // Hardcoded password!
const api_key = "sk-test-1234567890abcdef";

function calculateTotal(items) {
    let t = 0;  // Poor naming
    for(let i = 0; i < items.length; i++) {
        if(items[i].price > 100000) {  // Magic number
            t = t + items[i].price;
        }
    }
    console.log(t);  // Console logging
    return t;
}

function processUserData(data) {
    return eval(data);  // Security vulnerability!
}`,
  good: `// TypeScript - Clean Code
import { config } from 'dotenv';

interface Product {
    id: number;
    name: string;
    price: number;
}

const PREMIUM_THRESHOLD = 100000;

export function calculateTotal(items: Product[]): number {
    const total = items
        .filter(item => item.price > PREMIUM_THRESHOLD)
        .reduce((sum, item) => sum + item.price, 0);
    
    return total;
}`
};

export default function CodeEditor({ code, setCode, onReview, loading }: CodeEditorProps) {
  return (
    <div className="bg-gray-900 rounded-lg overflow-hidden border border-gray-800 shadow-xl">
      <div className="bg-gradient-to-r from-gray-800 to-gray-800 px-5 py-4 border-b border-gray-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
            </svg>
            <h2 className="text-lg font-semibold text-white">Code Editor</h2>
          </div>
          <button
            onClick={onReview}
            disabled={loading || !code.trim()}
            className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 disabled:from-gray-700 disabled:to-gray-700 disabled:text-gray-500 disabled:cursor-not-allowed transition-all font-medium shadow-lg"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
            </svg>
            {loading ? 'Analyzing...' : 'Analyze Code'}
          </button>
        </div>
      </div>
      
      <textarea
        value={code}
        onChange={(e) => setCode(e.target.value)}
        placeholder="Paste your code here..."
        className="w-full h-[600px] p-6 bg-gray-950 text-gray-100 text-base code-editor resize-none focus:outline-none border-0 font-mono"
        spellCheck={false}
      />
    </div>
  );
}
