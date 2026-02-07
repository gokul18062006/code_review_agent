import { useState } from 'react';
import CodeEditor from './components/CodeEditor';
import ReviewResults from './components/ReviewResults';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import { api, CodeReviewResponse } from './api';
import { Loader2 } from 'lucide-react';

function App() {
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState<string>('auto');
  const [focus, setFocus] = useState<'comprehensive' | 'security' | 'performance' | 'style'>('comprehensive');
  const [useAI, setUseAI] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [reviewResult, setReviewResult] = useState<CodeReviewResponse | null>(null);

  const handleReview = async () => {
    if (!code.trim()) {
      setError('Please enter some code to review');
      return;
    }

    setLoading(true);
    setError(null);
    setReviewResult(null);

    try {
      const result = await api.reviewCode({
        code,
        language: language === 'auto' ? undefined : language,
        focus,
        use_ai: useAI,
      });
      setReviewResult(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to review code. Make sure the backend is running.');
      console.error('Review error:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadExample = (exampleCode: string) => {
    setCode(exampleCode);
  };

  return (
    <div className="min-h-screen bg-black">
      <Header />
      
      <div className="container mx-auto px-6 py-10">
        <div className="max-w-6xl mx-auto">
          {/* Main Content */}
          <div className="space-y-6">\n            {/* Code Editor */}
            <CodeEditor
              code={code}
              setCode={setCode}
              onReview={handleReview}
              loading={loading}
            />

            {/* Error Message */}
            {error && (
              <div className="bg-red-900/20 border border-red-800 rounded-lg p-4 fade-in">
                <p className="text-red-300 text-sm">{error}</p>
              </div>
            )}

            {/* Loading State */}
            {loading && (
              <div className="bg-gray-900 border border-gray-800 rounded-lg p-12 text-center fade-in">
                <Loader2 className="w-12 h-12 animate-spin mx-auto text-blue-500 mb-4" />
                <p className="text-white font-medium">Analyzing your code...</p>
                <p className="text-gray-400 text-sm mt-2">Please wait</p>
              </div>
            )}

            {/* Review Results */}
            {reviewResult && !loading && (
              <ReviewResults result={reviewResult} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
