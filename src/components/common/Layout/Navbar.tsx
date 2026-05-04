import { ThemeToggle } from '@components/extensions/Theme'
import { Link, useLocation } from 'react-router-dom'

export function Navbar() {
  const location = useLocation()

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }

  const isHomePage = location.pathname === '/'

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-white/80 dark:bg-gray-900/80 border-b border-gray-200 dark:border-gray-800">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="text-xl font-bold text-gray-900 dark:text-white">
          Asteria
        </Link>
        <div className="flex items-center gap-6">
          {isHomePage ? (
            <>
              <button
                onClick={() => scrollToSection('hero')}
                className="text-gray-600 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-500 transition-colors font-medium"
              >
                首页
              </button>
              <button
                onClick={() => scrollToSection('projects')}
                className="text-gray-600 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-500 transition-colors font-medium"
              >
                项目
              </button>
              <button
                onClick={() => scrollToSection('experience')}
                className="text-gray-600 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-500 transition-colors font-medium"
              >
                经历
              </button>
              <button
                onClick={() => scrollToSection('contact')}
                className="text-gray-600 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-500 transition-colors font-medium"
              >
                联系
              </button>
            </>
          ) : (
            <Link
              to="/"
              className="text-gray-600 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-500 transition-colors font-medium"
            >
              返回首页
            </Link>
          )}
          <ThemeToggle />
        </div>
      </div>
    </nav>
  )
}
