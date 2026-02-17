import { useRef } from 'react';

interface CodeEditorProps {
  code: string;
  setCode: (code: string) => void;
  onReview: () => void;
  loading: boolean;
}

const EXAMPLE_CODES = [
  {
    name: "Python",
    icon: "🐍",
    code: `def calculate_total(items):
    total = 0
    for item in items:
        if item["price"] > 100:  # Magic number
            total = total + item["price"]
    print(total)  # Don't use print in production
    return total

password = "admin123"  # Hardcoded password!`
  },
  {
    name: "JavaScript",
    icon: "⚡",
    code: `function processUserData(data) {
    return eval(data);  // Security vulnerability!
}

const api_key = "sk-1234567890";  // Hardcoded API key

for(var i=0; i<users.length; i++) {  // Use let/const
    console.log(users[i]);  // Debug code left in production
}`
  },
  {
    name: "Java",
    icon: "☕",
    code: `public class UserService {
    private String password = "admin123";  // Hardcoded password
    
    public void processUsers(List users) {
        for(int i=0; i<users.size(); i++) {  // Can use forEach
            System.out.println(users.get(i));  // Debug statement
        }
    }
}`
  }
];

export default function CodeEditor({ code, setCode, onReview, loading }: CodeEditorProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const lineCount = code.split('\n').length;
  const charCount = code.length;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const content = event.target?.result as string;
        setCode(content);
      };
      reader.readAsText(file);
    }
  };

  const handleClear = () => {
    setCode('');
  };

  const loadExample = (exampleCode: string) => {
    setCode(exampleCode);
  };

  return (
    <div className="space-y-4">
      {/* Quick Start Examples */}
      {!code && (
        <div className="bg-gradient-to-br from-blue-900/20 to-purple-900/20 rounded-xl p-6 border border-blue-800/50">
          <div className="flex items-center gap-3 mb-4">
            <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            <h3 className="text-lg font-bold text-white">Quick Start - Try an Example</h3>
          </div>
          <div className="grid grid-cols-3 gap-3">
            {EXAMPLE_CODES.map((example, idx) => (
              <button
                key={idx}
                onClick={() => loadExample(example.code)}
                className="bg-gray-800/50 hover:bg-gray-700/50 border border-gray-700 hover:border-blue-500 rounded-lg p-4 transition-all text-left group"
              >
                <div className="text-2xl mb-2">{example.icon}</div>
                <div className="text-white font-semibold group-hover:text-blue-400 transition-colors">
                  {example.name} Example
                </div>
                <div className="text-xs text-gray-400 mt-1">Click to load</div>
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="bg-gray-900 rounded-lg overflow-hidden border border-gray-800 shadow-xl">
        {/* Enhanced Header */}
        <div className="bg-gradient-to-r from-gray-800 to-gray-800 px-5 py-4 border-b border-gray-700">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
              </svg>
              <h2 className="text-lg font-semibold text-white">Code Editor</h2>
            </div>
            <div className="flex gap-2">
              {/* Upload File Button */}
              <input
                ref={fileInputRef}
                type="file"
                accept=".py,.js,.jsx,.ts,.tsx,.java,.cpp,.c,.h,.cs,.go,.rb,.php,.swift,.kt,.sql,.html,.css,.sh"
                onChange={handleFileUpload}
                className="hidden"
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center gap-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-all text-sm font-medium"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
                Upload File
              </button>
              
              {/* Clear Button */}
              {code && (
                <button
                  onClick={handleClear}
                  className="flex items-center gap-2 px-4 py-2 bg-red-900/30 hover:bg-red-900/50 text-red-400 rounded-lg transition-all text-sm font-medium border border-red-800/50"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  Clear
                </button>
              )}
              
              {/* Analyze Button */}
              <button
                onClick={onReview}
                disabled={loading || !code.trim()}
                className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 disabled:from-gray-700 disabled:to-gray-700 disabled:text-gray-500 disabled:cursor-not-allowed transition-all font-medium shadow-lg"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                </svg>
                {loading ? 'Analyzing...' : 'Analyze Code'}
              </button>
            </div>
          </div>
          
          {/* Stats Bar */}
          {code && (
            <div className="flex items-center gap-4 text-sm text-gray-400">
              <div className="flex items-center gap-1.5">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
                <span>{lineCount} lines</span>
              </div>
              <div className="flex items-center gap-1.5">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
                </svg>
                <span>{charCount} characters</span>
              </div>
              <div className="text-blue-400 flex items-center gap-1.5">
                <span>💡</span>
                <span>Supports 50+ languages</span>
              </div>
            </div>
          )}
        </div>
        
        {/* Textarea */}
        <textarea
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="📝 Paste your code here or upload a file...\n\n✨ Supports: Python, JavaScript, TypeScript, Java, C++, Go, Rust, Ruby, PHP, and 40+ more languages!\n\n🚀 Get instant analysis with auto-fix suggestions"
          className="w-full h-[500px] p-6 bg-gray-950 text-gray-100 text-base code-editor resize-none focus:outline-none border-0 font-mono"
          spellCheck={false}
        />
      </div>
    </div>
  );
}
