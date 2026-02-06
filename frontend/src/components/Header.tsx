import { Code2, Github, Sparkles } from 'lucide-react';

export default function Header() {
  return (
    <header className="bg-black shadow-2xl border-b-2 border-purple-500 sticky top-0 z-50">
      <div className="container mx-auto px-6 py-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl blur opacity-75 animate-pulse"></div>
              <div className="relative bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 p-3 rounded-2xl shadow-lg">
                <Code2 size={32} className="text-white" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-3xl font-extrabold text-white">
                  Code Review Agent
                </h1>
                <Sparkles size={20} className="text-purple-400 animate-pulse" />
              </div>
              <p className="text-sm text-gray-300 font-medium mt-1">
                ✨ AI-Powered Multi-Language Code Analysis
              </p>
            </div>
          </div>
          
          <a
            href="https://github.com/gokul18062006/code_review_agent"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-6 py-3 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 font-semibold border-2 border-purple-400"
          >
            <Github size={22} />
            <span className="hidden sm:inline">View on GitHub</span>
          </a>
        </div>
      </div>
    </header>
  );
}
