import { CodeReviewResponse } from '../api';
import { AlertCircle, CheckCircle, Lightbulb, TrendingUp, Award, Target, Bug, Sparkles } from 'lucide-react';

interface ReviewResultsProps {
  result: CodeReviewResponse;
}

const getRatingColor = (rating: string) => {
  const colors: Record<string, string> = {
    'Excellent': 'bg-green-600',
    'Good': 'bg-blue-600',
    'Average': 'bg-yellow-600',
    'Needs Improvement': 'bg-orange-600',
    'Poor': 'bg-red-600',
  };
  return colors[rating] || 'bg-gray-600';
};

const getRatingEmoji = (rating: string) => {
  const emojis: Record<string, string> = {
    'Excellent': '🌟',
    'Good': '✅',
    'Average': '⚠️',
    'Needs Improvement': '⚠️',
    'Poor': '❌',
  };
  return emojis[rating] || '❓';
};

const getRatingScore = (rating: string) => {
  const scores: Record<string, number> = {
    'Excellent': 95,
    'Good': 80,
    'Average': 65,
    'Needs Improvement': 45,
    'Poor': 25,
  };
  return scores[rating] || 0;
};

export default function ReviewResults({ result }: ReviewResultsProps) {
  return (
    <div className="space-y-6 fade-in">
      {/* Language Indicator */}
      <div className="bg-gray-900 rounded-lg px-6 py-3 border border-gray-800">
        <div className="text-lg font-semibold text-white">
          Language: {result.language.toUpperCase()}
        </div>
      </div>

      {/* Code Statistics */}
      <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <TrendingUp size={20} className="text-blue-400" />
          Code Metrics
        </h3>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-gray-800 rounded-lg p-4 text-center border border-gray-700">
            <div className="text-2xl font-bold text-purple-400">{result.code_summary.total_lines}</div>
            <div className="text-xs text-gray-400 mt-1">Total Lines</div>
          </div>
          <div className="bg-gray-800 rounded-lg p-4 text-center border border-gray-700">
            <div className="text-2xl font-bold text-blue-400">{result.code_summary.code_lines}</div>
            <div className="text-xs text-gray-400 mt-1">Code Lines</div>
          </div>
          <div className="bg-gray-800 rounded-lg p-4 text-center border border-gray-700">
            <div className="text-2xl font-bold text-green-400">{result.code_summary.functions}</div>
            <div className="text-xs text-gray-400 mt-1">Functions</div>
          </div>
          <div className="bg-gray-800 rounded-lg p-4 text-center border border-gray-700">
            <div className="text-2xl font-bold text-orange-400">{result.code_summary.classes}</div>
            <div className="text-xs text-gray-400 mt-1">Classes</div>
          </div>
        </div>
      </div>

      {/* Issues */}
      <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <Bug size={20} className="text-red-400" />
          Issues Found
          {result.issues.length > 0 && (
            <span className="ml-2 px-2 py-0.5 bg-red-600 text-white rounded text-xs">
              {result.issues.length}
            </span>
          )}
        </h3>
        
        {result.issues.length > 0 ? (
          <div className="space-y-2">
            {result.issues.map((issue, index) => (
              <div
                key={index}
                className="p-3 bg-red-900/20 border-l-2 border-red-500 rounded"
              >
                <p className="text-gray-200 text-sm">
                  {issue.replace('[AI]', '').trim()}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-green-900/20 border border-green-800 rounded-lg p-4 text-center">
            <p className="text-green-400 font-medium">No issues found!</p>
          </div>
        )}
      </div>

      {/* Suggestions */}
      <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <Lightbulb size={20} className="text-yellow-400" />
          Suggestions
          {result.suggestions.length > 0 && (
            <span className="ml-2 px-2 py-0.5 bg-yellow-600 text-white rounded text-xs">
              {result.suggestions.length}
            </span>
          )}
        </h3>
        
        {result.suggestions.length > 0 ? (
          <div className="space-y-2">
            {result.suggestions.map((suggestion, index) => (
              <div
                key={index}
                className="p-3 bg-yellow-900/20 border-l-2 border-yellow-500 rounded"
              >
                <p className="text-gray-200 text-sm">
                  {suggestion.replace('[AI]', '').trim()}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-blue-900/20 border border-blue-800 rounded-lg p-4 text-center">
            <p className="text-blue-400">No suggestions at this time</p>
          </div>
        )}
      </div>

      {/* AI Analysis Details */}
      {!result.ai_analysis.raw_review.includes('Mock review') && !result.ai_analysis.raw_review.includes('API not available') && result.ai_analysis.raw_review && (
        <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <Sparkles size={20} className="text-purple-400" />
            AI Deep Analysis
          </h3>
          
          <div className="bg-black rounded-lg p-4 border border-gray-800">
            <pre className="text-sm text-gray-300 whitespace-pre-wrap leading-relaxed font-mono">
              {result.ai_analysis.raw_review}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
}
