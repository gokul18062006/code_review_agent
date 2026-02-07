import { Code, Sparkles } from 'lucide-react';

interface CodeEditorProps {
  code: string;
  setCode: (code: string) => void;
  onReview: () => void;
  loading: boolean;
}

export default function CodeEditor({ code, setCode, onReview, loading }: CodeEditorProps) {
  return (
    <div className="bg-gray-900 rounded-lg overflow-hidden border border-gray-800">
      <div className="bg-gray-800 px-5 py-4 border-b border-gray-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Code size={20} className="text-gray-400" />
            <h2 className="text-lg font-semibold text-white">Code Editor</h2>
          </div>
          <button
            onClick={onReview}
            disabled={loading || !code.trim()}
            className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-700 disabled:text-gray-500 disabled:cursor-not-allowed transition-colors font-medium"
          >
            <Sparkles size={18} />
            {loading ? 'Analyzing...' : 'Analyze Code'}
          </button>
        </div>
      </div>
      
      <textarea
        value={code}
        onChange={(e) => setCode(e.target.value)}
        placeholder="Paste your code here...\n\nExample:\ndef hello():\n    print('Hello, World!')\n\nhello()"
        className="w-full h-[600px] p-6 bg-gray-950 text-gray-100 text-base code-editor resize-none focus:outline-none border-0"
        spellCheck={false}
      />
    </div>
  );
}
