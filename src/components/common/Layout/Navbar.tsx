import { ThemeToggle } from '@components/extensions/Theme'
import { Link } from 'react-router-dom'

export function Navbar() {
  return (
    <nav className="sticky top-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="text-xl font-bold text-gray-900 dark:text-white">
          个人展示
        </Link>
        <div className="flex items-center gap-4">
          <Link
            to="/"
            className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
          >
            首页
          </Link>
          <Link
            to="/graph"
            className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
          >
            知识图谱
          </Link>
          <ThemeToggle />
        </div>
      </div>
    </nav>
  )
}
