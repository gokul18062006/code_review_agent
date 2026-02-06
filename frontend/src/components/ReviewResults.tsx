import { CodeReviewResponse } from '../api';
import { AlertCircle, CheckCircle, Lightbulb, TrendingUp, Award } from 'lucide-react';

interface ReviewResultsProps {
  result: CodeReviewResponse;
}

const getRatingColor = (rating: string) => {
  const colors: Record<string, string> = {
    'Excellent': 'text-green-600 dark:text-green-400',
    'Good': 'text-blue-600 dark:text-blue-400',
    'Average': 'text-yellow-600 dark:text-yellow-400',
    'Needs Improvement': 'text-orange-600 dark:text-orange-400',
    'Poor': 'text-red-600 dark:text-red-400',
  };
  return colors[rating] || 'text-gray-600';
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

export default function ReviewResults({ result }: ReviewResultsProps) {
  return (
    <div className="space-y-6 fade-in">
      {/* Success Banner */}
      <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
        <div className="flex items-center gap-2">
          <CheckCircle className="text-green-600 dark:text-green-400" size={20} />
          <p className="text-green-800 dark:text-green-200 font-medium">
            ✅ Review completed!
          </p>
        </div>
      </div>

      {/* Rating Card */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <Award className="text-primary" size={32} />
            <div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                {getRatingEmoji(result.rating)} Code Quality: {' '}
                <span className={getRatingColor(result.rating)}>{result.rating}</span>
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Detected Language: <span className="font-semibold uppercase">{result.language}</span>
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
          <p className="text-blue-900 dark:text-blue-100">
            <strong>Assessment:</strong> {result.assessment}
          </p>
        </div>
      </div>

      {/* Code Statistics */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="text-primary" size={20} />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Code Statistics
          </h3>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-primary">{result.code_summary.total_lines}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">Total Lines</div>
          </div>
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-primary">{result.code_summary.code_lines}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">Code Lines</div>
          </div>
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-primary">{result.code_summary.functions}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">Functions</div>
          </div>
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-primary">{result.code_summary.classes}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">Classes</div>
          </div>
        </div>
      </div>

      {/* Issues */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        <div className="flex items-center gap-2 mb-4">
          <AlertCircle className="text-red-500" size={20} />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Issues Found ({result.issues.length})
          </h3>
        </div>
        
        {result.issues.length > 0 ? (
          <div className="space-y-2">
            {result.issues.map((issue, index) => (
              <div
                key={index}
                className="flex items-start gap-3 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg"
              >
                <span className="text-red-600 dark:text-red-400 mt-0.5">
                  {issue.includes('[AI]') ? '🤖' : '⚠️'}
                </span>
                <p className="text-red-800 dark:text-red-200 text-sm flex-1">
                  {issue.replace('[AI]', '').trim()}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
            <p className="text-green-800 dark:text-green-200">No issues found! 🎉</p>
          </div>
        )}
      </div>

      {/* Suggestions */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        <div className="flex items-center gap-2 mb-4">
          <Lightbulb className="text-yellow-500" size={20} />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Suggestions ({result.suggestions.length})
          </h3>
        </div>
        
        {result.suggestions.length > 0 ? (
          <div className="space-y-2">
            {result.suggestions.map((suggestion, index) => (
              <div
                key={index}
                className="flex items-start gap-3 p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg"
              >
                <span className="text-yellow-600 dark:text-yellow-400 mt-0.5">
                  {suggestion.includes('[AI]') ? '🤖' : '💡'}
                </span>
                <p className="text-yellow-800 dark:text-yellow-200 text-sm flex-1">
                  {suggestion.replace('[AI]', '').trim()}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
            <p className="text-blue-800 dark:text-blue-200">No suggestions - code looks good!</p>
          </div>
        )}
      </div>

      {/* AI Analysis Details */}
      {result.ai_analysis && result.ai_analysis.raw_review && 
       !result.ai_analysis.raw_review.includes('Mock review') && 
       !result.ai_analysis.raw_review.includes('API not available') && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-2xl">🤖</span>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              AI Analysis Details
            </h3>
          </div>
          
          <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4">
            <pre className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap font-mono">
              {result.ai_analysis.raw_review}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
}
