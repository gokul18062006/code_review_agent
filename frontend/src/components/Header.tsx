import { Code2 } from 'lucide-react';

export default function Header() {
  return (
    <header className="bg-gray-900 border-b border-gray-800 py-6">
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="bg-gradient-to-br from-blue-500 to-purple-600 p-3 rounded-lg">
              <Code2 size={28} className="text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">
                Code Review Agent
              </h1>
              <p className="text-sm text-gray-400 mt-1">
                AI-Powered Code Analysis
              </p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
