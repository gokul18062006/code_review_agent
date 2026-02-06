import { CodeReviewResponse } from '../api';
import { AlertCircle, CheckCircle, Lightbulb, TrendingUp, Award, Target, Bug, Sparkles } from 'lucide-react';

interface ReviewResultsProps {
  result: CodeReviewResponse;
}

const getRatingColor = (rating: string) => {
  const colors: Record<string, string> = {
    'Excellent': 'from-green-500 to-emerald-600',
    'Good': 'from-blue-500 to-cyan-600',
    'Average': 'from-yellow-500 to-orange-500',
    'Needs Improvement': 'from-orange-500 to-red-500',
    'Poor': 'from-red-500 to-pink-600',
  };
  return colors[rating] || 'from-gray-500 to-gray-600';
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
    <div className="space-y-8 fade-in">
      {/* Success Banner */}
      <div className="bg-gray-900 rounded-2xl shadow-xl p-5 border-2 border-green-500 card-hover">
        <div className="flex items-center gap-3">
          <CheckCircle className="text-green-400" size={28} />
          <p className="text-white font-bold text-lg">
            ✅ Analysis Complete!
          </p>
        </div>
      </div>

      {/* Rating Card */}
      <div className={`bg-gray-900 rounded-2xl shadow-2xl overflow-hidden border-2 border-purple-500 card-hover`}>
        <div className={`bg-gradient-to-r ${getRatingColor(result.rating)} px-8 py-6`}>
          <div className="flex items-center gap-4">
            <div className="bg-white/20 backdrop-blur-sm p-4 rounded-xl">
              <Award className="text-white" size={40} />
            </div>
            <div>
              <h3 className="text-3xl font-extrabold text-white mb-1">
                {getRatingEmoji(result.rating)} {result.rating}
              </h3>
              <p className="text-white/90 text-sm font-semibold">
                Detected: <span className="uppercase">{result.language}</span>
              </p>
            </div>
          </div>
        </div>
        
        <div className="p-6 bg-gray-800">
          <div className="flex items-start gap-3">
            <Target className="text-blue-400 mt-1" size={24} />
            <div>
              <h4 className="font-bold text-white mb-2">Assessment Summary</h4>
              <p className="text-gray-200 leading-relaxed">
                {result.assessment}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Code Statistics */}
      <div className="bg-gray-900 rounded-2xl shadow-2xl p-8 border-2 border-blue-500 card-hover">
        <div className="flex items-center gap-3 mb-6">
          <div className="bg-gradient-to-br from-blue-500 to-purple-600 p-3 rounded-xl shadow-lg">
            <TrendingUp className="text-white" size={24} />
          </div>
          <h3 className="text-2xl font-bold text-white">
            Code Metrics
          </h3>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-purple-900/30 rounded-xl p-5 text-center border-2 border-purple-500 card-hover">
            <div className="text-3xl font-black text-purple-400">{result.code_summary.total_lines}</div>
            <div className="text-sm font-semibold text-white mt-2">Total Lines</div>
          </div>
          <div className="bg-blue-900/30 rounded-xl p-5 text-center border-2 border-blue-500 card-hover">
            <div className="text-3xl font-black text-blue-400">{result.code_summary.code_lines}</div>
            <div className="text-sm font-semibold text-white mt-2">Code Lines</div>
          </div>
          <div className="bg-green-900/30 rounded-xl p-5 text-center border-2 border-green-500 card-hover">
            <div className="text-3xl font-black text-green-400">{result.code_summary.functions}</div>
            <div className="text-sm font-semibold text-white mt-2">Functions</div>
          </div>
          <div className="bg-orange-900/30 rounded-xl p-5 text-center border-2 border-orange-500 card-hover">
            <div className="text-3xl font-black text-orange-400">{result.code_summary.classes}</div>
            <div className="text-sm font-semibold text-white mt-2">Classes</div>
          </div>
        </div>
      </div>

      {/* Issues */}
      <div className="bg-gray-900 rounded-2xl shadow-2xl p-8 border-2 border-red-500 card-hover">
        <div className="flex items-center gap-3 mb-6">
          <div className="bg-gradient-to-br from-red-500 to-pink-600 p-3 rounded-xl shadow-lg">
            <Bug className="text-white" size={24} />
          </div>
          <h3 className="text-2xl font-bold text-white">
            Issues Found
            <span className="ml-3 px-3 py-1 bg-red-600 text-white rounded-full text-sm font-bold">
              {result.issues.length}
            </span>
          </h3>
        </div>
        
        {result.issues.length > 0 ? (
          <div className="space-y-3">
            {result.issues.map((issue, index) => (
              <div
                key={index}
                className="flex items-start gap-4 p-4 bg-red-900/30 border-l-4 border-red-500 rounded-lg shadow-md hover:shadow-lg transition-shadow"
              >
                <span className="text-2xl flex-shrink-0 mt-1">
                  {issue.includes('[AI]') ? '🤖' : '🐛'}
                </span>
                <p className="text-white text-sm flex-1 leading-relaxed">
                  {issue.replace('[AI]', '').trim()}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-green-900/30 border-2 border-green-500 rounded-xl p-6 text-center">
            <p className="text-white font-bold text-lg">No issues found! 🎉</p>
            <p className="text-gray-300 text-sm mt-1">Your code looks great!</p>
          </div>
        )}
      </div>

      {/* Suggestions */}
      <div className="bg-gray-900 rounded-2xl shadow-2xl p-8 border-2 border-yellow-500 card-hover">
        <div className="flex items-center gap-3 mb-6">
          <div className="bg-gradient-to-br from-yellow-500 to-orange-600 p-3 rounded-xl shadow-lg">
            <Lightbulb className="text-white" size={24} />
          </div>
          <h3 className="text-2xl font-bold text-white">
            Suggestions
            <span className="ml-3 px-3 py-1 bg-yellow-600 text-white rounded-full text-sm font-bold">
              {result.suggestions.length}
            </span>
          </h3>
        </div>
        
        {result.suggestions.length > 0 ? (
          <div className="space-y-3">
            {result.suggestions.map((suggestion, index) => (
              <div
                key={index}
                className="flex items-start gap-4 p-4 bg-yellow-900/30 border-l-4 border-yellow-500 rounded-lg shadow-md hover:shadow-lg transition-shadow"
              >
                <span className="text-2xl flex-shrink-0 mt-1">
                  {suggestion.includes('[AI]') ? '🤖' : '💡'}
                </span>
                <p className="text-white text-sm flex-1 leading-relaxed">
                  {suggestion.replace('[AI]', '').trim()}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-blue-900/30 border-2 border-blue-500 rounded-xl p-6 text-center">
            <p className="text-white font-bold">No suggestions at this time.</p>
          </div>
        )}
      </div>

      {/* AI Analysis Details */}
      {!result.ai_analysis.raw_review.includes('Mock review') && !result.ai_analysis.raw_review.includes('API not available') && result.ai_analysis.raw_review && (
        <div className="bg-gray-900 rounded-2xl shadow-2xl p-8 border-2 border-purple-500 card-hover">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-gradient-to-br from-purple-500 to-pink-600 p-3 rounded-xl shadow-lg">
              <Sparkles className="text-white" size={24} />
            </div>
            <h3 className="text-2xl font-bold text-white">
              AI Deep Dive Analysis
            </h3>
          </div>
          
          <div className="bg-black rounded-xl p-6 border-2 border-purple-500">
            <pre className="text-sm text-gray-200 whitespace-pre-wrap leading-relaxed font-mono">
              {result.ai_analysis.raw_review}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
}
