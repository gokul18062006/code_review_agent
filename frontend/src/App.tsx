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
              <div className="bg-gray-900 rounded-2xl shadow-xl p-5 border-2 border-red-500 fade-in">
                <div className="flex items-start gap-3">
                  <span className="text-2xl">⚠️</span>
                  <p className="text-white font-semibold">{error}</p>
                </div>
              </div>
            )}

            {/* Loading State */}
            {loading && (
              <div className="bg-gray-900 rounded-2xl shadow-2xl p-12 text-center fade-in border-2 border-purple-500">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-24 h-24 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full blur-xl opacity-50 animate-pulse"></div>
                  </div>
                  <Loader2 className="w-16 h-16 animate-spin mx-auto text-purple-400 relative z-10" />
                </div>
                <p className="text-white font-bold text-lg mt-6">Analyzing your code with AI...</p>
                <p className="text-gray-300 text-sm mt-2">This may take a few moments</p>
              </div>
            )}

            {/* Review Results */}
            {reviewResult && !loading && (
              <ReviewResults result={reviewResult} />
            )}

            {/* Placeholder */}
            {!reviewResult && !loading && !error && (
              <div className="bg-gray-900 rounded-2xl shadow-2xl p-10 border-2 border-purple-500 card-hover">
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl mb-6 shadow-lg">
                    <span className="text-4xl">🚀</span>
                  </div>
                  <h3 className="text-3xl font-extrabold text-white mb-6">
                    How It Works
                  </h3>
                  <div className="space-y-4 text-left max-w-2xl mx-auto mb-10">
                    <div className="flex items-start gap-4 p-4 bg-blue-900/30 rounded-xl border-2 border-blue-500">
                      <span className="text-3xl flex-shrink-0">1️⃣</span>
                      <div>
                        <p className="font-bold text-white">Paste Your Code</p>
                        <p className="text-sm text-gray-300">Enter code in Python, Java, or C++</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-4 p-4 bg-purple-900/30 rounded-xl border-2 border-purple-500">
                      <span className="text-3xl flex-shrink-0">2️⃣</span>
                      <div>
                        <p className="font-bold text-white">AI Analysis</p>
                        <p className="text-sm text-gray-300">Powered by Google Gemini AI</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-4 p-4 bg-pink-900/30 rounded-xl border-2 border-pink-500">
                      <span className="text-3xl flex-shrink-0">3️⃣</span>
                      <div>
                        <p className="font-bold text-white">Get Insights</p>
                        <p className="text-sm text-gray-300">Receive detailed analysis and suggestions</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-4 p-4 bg-green-900/30 rounded-xl border-2 border-green-500">
                      <span className="text-3xl flex-shrink-0">4️⃣</span>
                      <div>
                        <p className="font-bold text-white">Improve Code</p>
                        <p className="text-sm text-gray-300">Follow recommendations to enhance quality</p>
                      </div>
                    </div>
                  </div>

                  <div className="pt-8 border-t-2 border-gray-700">
                    <h4 className="font-bold text-xl mb-5 text-white">🔍 What We Analyze</h4>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-sm">
                      <div className="p-3 bg-red-900/30 rounded-lg border-2 border-red-500 font-semibold text-white">
                        🐛 Bugs & Errors
                      </div>
                      <div className="p-3 bg-orange-900/30 rounded-lg border-2 border-orange-500 font-semibold text-white">
                        🔒 Security
                      </div>
                      <div className="p-3 bg-yellow-900/30 rounded-lg border-2 border-yellow-500 font-semibold text-white">
                        ⚡ Performance
                      </div>
                      <div className="p-3 bg-green-900/30 rounded-lg border-2 border-green-500 font-semibold text-white">
                        📚 Best Practices
                      </div>
                      <div className="p-3 bg-blue-900/30 rounded-lg border-2 border-blue-500 font-semibold text-white">
                        🎨 Code Style
                      </div>
                      <div className="p-3 bg-purple-900/30 rounded-lg border-2 border-purple-500 font-semibold text-white">
                        ♻️ Maintainability
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
