import { useState } from 'react';
import CodeEditor from './components/CodeEditor';
import ReviewResults from './components/ReviewResults';
import Header from './components/Header';
import { api, CodeReviewResponse } from './api';

function App() {
  const [code, setCode] = useState('');
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
        language: undefined,
        focus: 'comprehensive',
        use_ai: true,
      });
      setReviewResult(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to review code. Make sure the backend is running.');
      console.error('Review error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black">
      <Header />
      
      <div className="container mx-auto px-6 py-10">
        <div className="max-w-6xl mx-auto">
          {/* Welcome Banner - Only show when no code and no results */}
          {!code && !reviewResult && !loading && (
            <div className="bg-gradient-to-br from-blue-900/30 via-purple-900/30 to-pink-900/30 rounded-2xl p-8 border border-blue-800/50 mb-6 fade-in">
              <div className="flex items-start gap-4">
                <div className="bg-gradient-to-br from-blue-500 to-purple-500 p-3 rounded-xl">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z\" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-white mb-2">🚀 Welcome to AI Code Review Agent!</h2>
                  <p className="text-gray-300 text-lg mb-4">
                    Get instant, professional code analysis powered by AI. Detect bugs, security issues, and get automatic fix suggestions.
                  </p>
                  <div className="grid grid-cols-3 gap-4 mt-4">
                    <div className="bg-gray-900/50 rounded-lg p-4 border border-gray-800">
                      <div className="text-3xl mb-2">🌍</div>
                      <div className="text-white font-semibold mb-1">50+ Languages</div>
                      <div className="text-sm text-gray-400">Python, JavaScript, Java, C++, Go, Rust & more</div>
                    </div>
                    <div className="bg-gray-900/50 rounded-lg p-4 border border-gray-800">
                      <div className="text-3xl mb-2">⚡</div>
                      <div className="text-white font-semibold mb-1">Instant Analysis</div>
                      <div className="text-sm text-gray-400">Static analysis + AI-powered insights</div>
                    </div>
                    <div className="bg-gray-900/50 rounded-lg p-4 border border-gray-800">
                      <div className="text-3xl mb-2">🔧</div>
                      <div className="text-white font-semibold mb-1">Auto-Fix</div>
                      <div className="text-sm text-gray-400">Get exact code fixes for each issue</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Main Content */}
          <div className="space-y-6">
            {/* Code Editor */}
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
                <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
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
