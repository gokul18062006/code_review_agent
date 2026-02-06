import { Layers, Zap } from 'lucide-react';

interface SidebarProps {
  language: string;
  setLanguage: (lang: string) => void;
  focus: 'comprehensive' | 'security' | 'performance' | 'style';
  setFocus: (focus: 'comprehensive' | 'security' | 'performance' | 'style') => void;
  useAI: boolean;
  setUseAI: (use: boolean) => void;
  onLoadExample: (code: string) => void;
}

export default function Sidebar({
  language,
  setLanguage,
  focus,
  setFocus,
  useAI,
  setUseAI,
  onLoadExample
}: SidebarProps) {
  return (
    <div className="space-y-6">
      {/* AI Power */}
      <div className="bg-gray-900 rounded-2xl shadow-xl p-6 border-2 border-purple-500 card-hover">
        <div className="flex items-center gap-2 mb-4">
          <Zap className="text-yellow-400" size={24} />
          <h3 className="text-lg font-bold text-white">
            AI Analysis
          </h3>
        </div>
        <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl p-4 text-white shadow-lg">
          <p className="text-sm font-semibold mb-2">🤖 Powered by Gemini AI</p>
          <p className="text-xs opacity-90">Advanced code analysis with machine learning</p>
        </div>
      </div>

      {/* Supported Languages */}
      <div className="bg-gray-900 rounded-2xl shadow-xl p-6 border-2 border-blue-500 card-hover">
        <div className="flex items-center gap-2 mb-4">
          <Layers className="text-blue-400" size={24} />
          <h3 className="text-lg font-bold text-white">
            Supported Languages
          </h3>
        </div>
        <div className="space-y-3">
          <div className="flex items-center gap-3 p-3 bg-yellow-900/30 rounded-lg border-2 border-yellow-500">
            <span className="text-2xl">🐍</span>
            <span className="font-semibold text-white">Python</span>
          </div>
          <div className="flex items-center gap-3 p-3 bg-red-900/30 rounded-lg border-2 border-red-500">
            <span className="text-2xl">☕</span>
            <span className="font-semibold text-white">Java</span>
          </div>
          <div className="flex items-center gap-3 p-3 bg-blue-900/30 rounded-lg border-2 border-blue-500">
            <span className="text-2xl">⚡</span>
            <span className="font-semibold text-white">C++</span>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="bg-gray-900 rounded-2xl shadow-xl p-6 border-2 border-green-500 card-hover">
        <h3 className="text-sm font-bold text-white mb-3">✨ Features</h3>
        <ul className="space-y-2 text-sm text-gray-200">
          <li className="flex items-center gap-2">
            <span className="text-green-400 text-lg">✓</span> <span className="text-white">Security Analysis</span>
          </li>
          <li className="flex items-center gap-2">
            <span className="text-green-400 text-lg">✓</span> <span className="text-white">Performance Review</span>
          </li>
          <li className="flex items-center gap-2">
            <span className="text-green-400 text-lg">✓</span> <span className="text-white">Best Practices</span>
          </li>
          <li className="flex items-center gap-2">
            <span className="text-green-400 text-lg">✓</span> <span className="text-white">Code Quality Score</span>
          </li>
        </ul>
      </div>
    </div>
  );
}
