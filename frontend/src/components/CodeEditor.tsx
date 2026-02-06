import { Code, Search } from 'lucide-react';

interface CodeEditorProps {
  code: string;
  setCode: (code: string) => void;
  onReview: () => void;
  loading: boolean;
}

export default function CodeEditor({ code, setCode, onReview, loading }: CodeEditorProps) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
      <div className="bg-gray-50 dark:bg-gray-700 px-4 py-3 border-b border-gray-200 dark:border-gray-600">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Code size={20} className="text-primary" />
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Enter Your Code
            </h2>
          </div>
          <button
            onClick={onReview}
            disabled={loading || !code.trim()}
            className="flex items-center gap-2 px-6 py-2 bg-primary text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-medium"
          >
            <Search size={18} />
            Review Code
          </button>
        </div>
      </div>
      
      <textarea
        value={code}
        onChange={(e) => setCode(e.target.value)}
        placeholder="Paste your code here...

Example:
def example():
    # Your code here
    pass"
        className="w-full h-96 p-4 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 font-mono text-sm resize-none focus:outline-none code-editor"
        spellCheck={false}
      />
    </div>
  );
}
