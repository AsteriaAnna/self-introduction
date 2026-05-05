import { Link } from 'react-router-dom';

export default function Graph() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 pt-24 px-4">
      <div className="max-w-2xl mx-auto text-center">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">知识图谱</h1>
        <p className="text-gray-600 dark:text-gray-400 mb-8">知识图谱现在已经在首页展示了！</p>
        <Link
          to="/#graph-preview"
          className="inline-flex items-center gap-2 px-8 py-4 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-all duration-300 font-medium shadow-lg hover:shadow-xl"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
          前往首页查看知识图谱
        </Link>
      </div>
    </div>
  );
}
