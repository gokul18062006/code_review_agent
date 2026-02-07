import { CodeReviewResponse } from '../api';
import { AlertCircle, Lightbulb, Bug, ArrowRight } from 'lucide-react';

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
              <Bug size={18} className="text-red-400" />
              <span className="font-semibold text-white">Issues with Auto-Fix Suggestions ({result.static_analysis.issue_fixes.length})</span>
            </div>
            <div className="space-y-3">
              {result.static_analysis.issue_fixes.map((item, index) => (
                <div key={index} className="bg-gray-800 rounded-lg p-4 border-l-4 border-red-500">
                  <div className="flex items-start gap-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <AlertCircle size={16} className="text-red-400" />
                        <span className="text-red-300 font-medium">Issue:</span>
                      </div>
                      <p className="text-gray-200 mb-3">{item.issue}</p>
                      
                      <div className="flex items-center gap-2 mb-2">
                        <ArrowRight size={16} className="text-green-400" />
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
              <Bug size={18} className="text-red-400" />
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
              <Lightbulb size={18} className="text-yellow-400" />
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
