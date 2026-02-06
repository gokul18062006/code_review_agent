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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Sidebar
              language={language}
              setLanguage={setLanguage}
              focus={focus}
              setFocus={setFocus}
              useAI={useAI}
              setUseAI={setUseAI}
              onLoadExample={loadExample}
            />
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-6">
            {/* Code Editor */}
            <CodeEditor
              code={code}
              setCode={setCode}
              onReview={handleReview}
              loading={loading}
            />

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 fade-in">
                <p className="text-red-800 dark:text-red-200 text-sm">{error}</p>
              </div>
            )}

            {/* Loading State */}
            {loading && (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 text-center fade-in">
                <Loader2 className="w-12 h-12 animate-spin mx-auto text-primary mb-4" />
                <p className="text-gray-600 dark:text-gray-300">Analyzing your code...</p>
              </div>
            )}

            {/* Review Results */}
            {reviewResult && !loading && (
              <ReviewResults result={reviewResult} />
            )}

            {/* Placeholder */}
            {!reviewResult && !loading && !error && (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
                <div className="text-center text-gray-500 dark:text-gray-400">
                  <h3 className="text-xl font-semibold mb-4">How it works:</h3>
                  <div className="space-y-3 text-left max-w-2xl mx-auto">
                    <div className="flex items-start gap-3">
                      <span className="text-2xl">1️⃣</span>
                      <p><strong>Paste Your Code:</strong> Enter code in any supported language</p>
                    </div>
                    <div className="flex items-start gap-3">
                      <span className="text-2xl">2️⃣</span>
                      <p><strong>Configure Settings:</strong> Choose language and focus area</p>
                    </div>
                    <div className="flex items-start gap-3">
                      <span className="text-2xl">3️⃣</span>
                      <p><strong>Get AI Review:</strong> Receive comprehensive analysis</p>
                    </div>
                    <div className="flex items-start gap-3">
                      <span className="text-2xl">4️⃣</span>
                      <p><strong>Fix Issues:</strong> Follow suggestions to improve code</p>
                    </div>
                  </div>

                  <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700">
                    <h4 className="font-semibold mb-3">What we check:</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                      <div>🐛 Bugs & Errors</div>
                      <div>🔒 Security Vulnerabilities</div>
                      <div>⚡ Performance Issues</div>
                      <div>📚 Best Practices</div>
                      <div>🎨 Code Style</div>
                      <div>♻️ Code Maintainability</div>
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
