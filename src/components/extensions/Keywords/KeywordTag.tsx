import { Keyword } from '@/types'

interface KeywordTagProps {
  keyword: Keyword
  isSelected?: boolean
  onClick?: () => void
}

export function KeywordTag({ keyword, isSelected = false, onClick }: KeywordTagProps) {
  return (
    <button
      onClick={onClick}
      className={`
        px-3 py-1 rounded-full transition-all duration-300 text-sm font-medium
        ${isSelected
          ? 'bg-green-600 text-white'
          : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-green-100 dark:hover:bg-green-900/30'
        }
      `}
    >
      {keyword.name}
      <span className="ml-1 text-xs opacity-70">{keyword.count}</span>
    </button>
  )
}
