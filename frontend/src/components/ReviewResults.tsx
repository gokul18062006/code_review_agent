import { CodeReviewResponse } from '../api';

interface ReviewResultsProps {
  result: CodeReviewResponse;
}

export default function ReviewResults({ result }: ReviewResultsProps) {
  return (
    <div className="space-y-5 fade-in">
      {/* Simple Header */}
      <div className="bg-gray-900 rounded-lg px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="text-xl font-bold text-white">
            {result.language.toUpperCase()} Code Analysis
          </div>
          <div className="flex gap-6 text-sm">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-400">{result.code_summary.total_lines}</div>
              <div className="text-gray-400">Lines</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-400">{result.code_summary.functions}</div>
              <div className="text-gray-400">Functions</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-400">{result.code_summary.classes}</div>
              <div className="text-gray-400">Classes</div>
            </div>
          </div>
        </div>
      </div>

      {/* Issues & Suggestions Combined */}
      <div className="bg-gray-900 rounded-lg p-6">
        <h3 className="text-xl font-bold text-white mb-5">Review Findings</h3>
        
        {result.static_analysis?.issue_fixes && result.static_analysis.issue_fixes.length > 0 ? (
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-3">
              <svg className="w-5 h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="font-semibold text-white">Issues with Auto-Fix Suggestions ({result.static_analysis.issue_fixes.length})</span>
            </div>
            <div className="space-y-3">
              {result.static_analysis.issue_fixes.map((item, index) => (
                <div key={index} className="bg-gray-800 rounded-lg p-4 border-l-4 border-red-500">
                  <div className="flex items-start gap-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <svg className="w-4 h-4 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span className="text-red-300 font-medium">Issue:</span>
                      </div>
                      <p className="text-gray-200 mb-3">{item.issue}</p>
                      
                      <div className="flex items-center gap-2 mb-2">
                        <svg className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                        </svg>
                        <span className="text-green-300 font-medium">How to Fix:</span>
                      </div>
                      <p className="text-green-200 bg-green-900/20 p-2 rounded font-mono text-sm">{item.fix}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : result.issues.length > 0 ? (
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-3">
              <svg className="w-5 h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="font-semibold text-white">Issues ({result.issues.length})</span>
            </div>
            <div className="space-y-2">
              {result.issues.map((issue, index) => (
                <div
                  key={index}
                  className="p-4 bg-red-900/10 border-l-4 border-red-500 rounded-r"
                >
                  <p className="text-gray-200">
                    {issue.replace('[AI]', '').trim()}
                  </p>
                </div>
              ))}
            </div>
          </div>
        ) : null}
        
        {result.suggestions.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-3">
              <svg className="w-5 h-5 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
              <span className="font-semibold text-white">Suggestions ({result.suggestions.length})</span>
            </div>
            <div className="space-y-2">
              {result.suggestions.map((suggestion, index) => (
                <div
                  key={index}
                  className="p-4 bg-yellow-900/10 border-l-4 border-yellow-500 rounded-r"
                >
                  <p className="text-gray-200">
                    {suggestion.replace('[AI]', '').trim()}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {!result.static_analysis?.issue_fixes?.length && result.issues.length === 0 && result.suggestions.length === 0 && (
          <p className="text-gray-400 text-center py-8">✨ No issues or suggestions found. Code looks good!</p>
        )}
      </div>
    </div>
  );
}
