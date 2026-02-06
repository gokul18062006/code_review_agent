import { Code, Sparkles } from 'lucide-react';

interface CodeEditorProps {
  code: string;
  setCode: (code: string) => void;
  onReview: () => void;
  loading: boolean;
}

export default function CodeEditor({ code, setCode, onReview, loading }: CodeEditorProps) {
  return (
    <div className="bg-gray-900 rounded-2xl shadow-2xl overflow-hidden card-hover border-2 border-purple-500">
      <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Code size={24} className="text-white" />
            <h2 className="text-xl font-bold text-white">
              Code Editor
            </h2>
          </div>
          <button
            onClick={onReview}
            disabled={loading || !code.trim()}
            className="flex items-center gap-2 px-8 py-3 bg-white text-purple-600 rounded-xl hover:bg-gray-100 disabled:bg-gray-600 disabled:text-gray-300 disabled:cursor-not-allowed transition-all duration-300 font-bold shadow-lg hover:shadow-xl hover:scale-105 disabled:hover:scale-100"
          >
            <Sparkles size={20} />
            {loading ? 'Analyzing...' : 'Analyze Code'}
          </button>
        </div>
      </div>
      
      <textarea
        value={code}
        onChange={(e) => setCode(e.target.value)}
        placeholder="✨ Paste your code here for AI-powered analysis...\n\nExample:\ndef greet(name):\n    print(f'Hello, {name}!')\n\ngreet('World')"
        className="w-full h-[500px] p-6 bg-black text-white code-editor resize-none focus:outline-none focus:ring-2 focus:ring-purple-500 border-t-2 border-purple-500/30"
        spellCheck={false}
      />
    </div>
  );
}
