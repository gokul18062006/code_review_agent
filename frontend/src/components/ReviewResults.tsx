import { CodeReviewResponse } from '../api';

interface ReviewResultsProps {
  result: CodeReviewResponse;
}

export default function ReviewResults({ result }: ReviewResultsProps) {
  const getRatingColor = (rating: string) => {
    const r = rating.toLowerCase();
    if (r.includes('excellent')) return 'text-green-400 bg-green-900/30 border-green-500';
    if (r.includes('good')) return 'text-blue-400 bg-blue-900/30 border-blue-500';
    if (r.includes('average')) return 'text-yellow-400 bg-yellow-900/30 border-yellow-500';
    if (r.includes('poor') || r.includes('needs improvement')) return 'text-red-400 bg-red-900/30 border-red-500';
    return 'text-gray-400 bg-gray-900/30 border-gray-500';
  };

  const getRatingEmoji = (rating: string) => {
    const r = rating.toLowerCase();
    if (r.includes('excellent')) return '🌟';
    if (r.includes('good')) return '✅';
    if (r.includes('average')) return '⚠️';
    if (r.includes('poor') || r.includes('needs improvement')) return '🚨';
    return '📊';
  };

  return (
    <div className="space-y-5 fade-in">
      {/* Enhanced Header with Rating */}
      <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl px-6 py-5 border border-gray-700 shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="text-2xl font-bold text-white">
              {result.language.toUpperCase()} Code Analysis
            </div>
            <div className={`px-4 py-1.5 rounded-lg font-bold text-sm border-2 ${getRatingColor(result.rating)}`}>
              {getRatingEmoji(result.rating)} {result.rating}
            </div>
          </div>
        </div>
        <div className="flex gap-6 text-sm">
          <div className="flex items-center gap-2 px-4 py-2 bg-blue-900/20 rounded-lg border border-blue-800/50">
            <div className="text-2xl font-bold text-blue-400">{result.code_summary.total_lines}</div>
            <div className="text-gray-400">Lines</div>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-green-900/20 rounded-lg border border-green-800/50">
            <div className="text-2xl font-bold text-green-400">{result.code_summary.functions}</div>
            <div className="text-gray-400">Functions</div>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-purple-900/20 rounded-lg border border-purple-800/50">
            <div className="text-2xl font-bold text-purple-400">{result.code_summary.classes}</div>
            <div className="text-gray-400">Classes</div>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-orange-900/20 rounded-lg border border-orange-800/50">
            <div className="text-2xl font-bold text-orange-400">
              {(result.static_analysis?.issue_fixes?.length || result.issues.length)}
            </div>
            <div className="text-gray-400">Issues</div>
          </div>
        </div>
      </div>

      {/* Assessment */}
      <div className="bg-gray-900 rounded-xl p-5 border border-gray-800">
        <div className="flex items-start gap-3">
          <svg className="w-6 h-6 text-blue-400 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <div>
            <h3 className="text-lg font-bold text-white mb-2">Assessment</h3>
            <p className="text-gray-300 leading-relaxed">{result.assessment}</p>
          </div>
        </div>
      </div>

      {/* Auto-Fix Suggestions - UNIQUE FEATURE SHOWCASE */}
      {result.static_analysis?.issue_fixes && result.static_analysis.issue_fixes.length > 0 && (
        <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl p-6 border border-gray-700 shadow-xl">
          <div className="flex items-center gap-3 mb-5">
            <div className="bg-gradient-to-br from-blue-500 to-purple-500 p-2 rounded-lg">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">🔧 Auto-Fix Suggestions</h3>
              <p className="text-sm text-gray-400">Exact solutions for each issue detected</p>
            </div>
            <div className="ml-auto bg-blue-900/30 px-3 py-1 rounded-full border border-blue-500/50">
              <span className="text-blue-300 font-bold">{result.static_analysis.issue_fixes.length} issues</span>
            </div>
          </div>
          
          <div className="space-y-4">
            {result.static_analysis.issue_fixes.map((item, index) => (
              <div key={index} className="bg-gray-800/50 rounded-xl overflow-hidden border border-gray-700/50 hover:border-gray-600 transition-colors">
                <div className="p-5">
                  {/* Issue */}
                  <div className="flex items-start gap-3 mb-4">
                    <div className="bg-red-900/30 p-1.5 rounded-lg mt-0.5">
                      <svg className="w-4 h-4 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <div className="text-xs text-red-300 font-semibold mb-1">❌ ISSUE DETECTED</div>
                      <p className="text-gray-200 font-medium">{item.issue}</p>
                    </div>
                  </div>
                  
                  {/* Arrow */}
                  <div className="flex items-center gap-2 ml-7 mb-4">
                    <div className="h-px bg-gradient-to-r from-red-500 to-green-500 flex-1"></div>
                    <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </div>
                  
                  {/* Fix */}
                  <div className="flex items-start gap-3">
                    <div className="bg-green-900/30 p-1.5 rounded-lg mt-0.5">
                      <svg className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <div className="text-xs text-green-300 font-semibold mb-1">✅ EXACT FIX</div>
                      <div className="bg-green-900/20 border border-green-800/50 rounded-lg p-3">
                        <p className="text-green-200 font-mono text-sm leading-relaxed">{item.fix}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Additional Issues (without fixes) */}
      {result.issues.length > 0 && !result.static_analysis?.issue_fixes?.length && (
        <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
          <div className="flex items-center gap-2 mb-4">
            <svg className="w-5 h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3 className="text-lg font-bold text-white">Issues Found ({result.issues.length})</h3>
          </div>
          <div className="space-y-2">
            {result.issues.map((issue, index) => (
              <div key={index} className="p-4 bg-red-900/10 border-l-4 border-red-500 rounded-r">
                <p className="text-gray-200">{issue.replace('[AI]', '').trim()}</p>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* Suggestions */}
      {result.suggestions.length > 0 && (
        <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
          <div className="flex items-center gap-2 mb-4">
            <svg className="w-5 h-5 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
            <h3 className="text-lg font-bold text-white">Additional Suggestions ({result.suggestions.length})</h3>
          </div>
          <div className="space-y-2">
            {result.suggestions.map((suggestion, index) => (
              <div key={index} className="p-4 bg-yellow-900/10 border-l-4 border-yellow-500 rounded-r">
                <p className="text-gray-200">{suggestion.replace('[AI]', '').trim()}</p>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* No Issues */}
      {!result.static_analysis?.issue_fixes?.length && result.issues.length === 0 && result.suggestions.length === 0 && (
        <div className="bg-gradient-to-br from-green-900/20 to-blue-900/20 rounded-xl p-12 text-center border border-green-800/50">
          <div className="text-6xl mb-4">🎉</div>
          <h3 className="text-2xl font-bold text-green-400 mb-2">Perfect Code!</h3>
          <p className="text-gray-300">No issues or suggestions found. Great work!</p>
        </div>
      )}
    </div>
  );
}
