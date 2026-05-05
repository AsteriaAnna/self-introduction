import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export function JDMatcher() {
  const navigate = useNavigate();
  const [jdText, setJdText] = useState('');
  const [isMatching, setIsMatching] = useState(false);

  const handleMatch = () => {
    if (!jdText.trim()) return;

    setIsMatching(true);

    setTimeout(() => {
      navigate('/match-result', {
        state: { jdText },
      });
    }, 500);
  };

  return (
    <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 p-6">
      <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">JD智能匹配</h3>
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
        粘贴招聘需求，我会帮你匹配相关的项目和经历
      </p>

      <textarea
        value={jdText}
        onChange={(e) => setJdText(e.target.value)}
        placeholder="粘贴JD内容，例如：需要掌握React、TypeScript、Node.js等技术栈..."
        className="w-full h-32 px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 resize-none focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
      />

      <div className="flex gap-3 mt-4">
        <button
          onClick={handleMatch}
          disabled={!jdText.trim() || isMatching}
          className="px-6 py-2.5 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
        >
          {isMatching ? (
            <>
              <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              匹配中...
            </>
          ) : (
            '开始匹配'
          )}
        </button>
      </div>
    </div>
  );
}
