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
            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
            </svg>
            <h2 className="text-lg font-semibold text-white">Code Editor</h2>
          </div>
          <button
            onClick={onReview}
            disabled={loading || !code.trim()}
            className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-700 disabled:text-gray-500 disabled:cursor-not-allowed transition-colors font-medium"
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
        placeholder="Paste your code here...\n\nExample:\ndef hello():\n    print('Hello, World!')\n\nhello()"
        className="w-full h-[600px] p-6 bg-gray-950 text-gray-100 text-base code-editor resize-none focus:outline-none border-0"
        spellCheck={false}
      />
    </div>
  );
}
