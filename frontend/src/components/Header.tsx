export default function Header() {
  return (
    <header className="bg-gray-900 border-b border-gray-800 py-6">
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="bg-gradient-to-br from-blue-500 to-purple-600 p-3 rounded-lg">
              <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
              </svg>
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
