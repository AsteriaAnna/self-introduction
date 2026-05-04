import { Link } from 'react-router-dom'
import { Experience } from '@/types'

interface TimelineItemProps {
  experience: Experience
  isLast?: boolean
  isHighlighted?: boolean
  matchScore?: number
}

export function TimelineItem({ experience, isLast = false, isHighlighted = false, matchScore }: TimelineItemProps) {
  return (
    <div className="relative pl-8 pb-8">
      {!isLast && (
        <div className="absolute left-3 top-3 w-0.5 h-full bg-gray-200 dark:bg-gray-700" />
      )}
      <div
        className={`absolute left-0 top-1 w-6 h-6 rounded-full border-4 ${
          isHighlighted
            ? 'border-green-500 bg-green-500'
            : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900'
        }`}
      />

      <div
        className={`p-6 rounded-lg border transition-all hover:shadow-lg ${
          isHighlighted
            ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
            : 'border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 hover:border-green-500 dark:hover:border-green-600'
        }`}
      >
        <div className="flex items-start justify-between mb-3">
          <div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">
              {experience.role}
            </h3>
            <p className="text-green-600 dark:text-green-500 font-medium">
              {experience.company}
            </p>
          </div>
          <div className="text-right">
            {matchScore !== undefined && (
              <span className="inline-block px-3 py-1 bg-green-100 dark:bg-green-900/50 text-green-700 dark:text-green-400 rounded-full text-sm font-semibold mb-2">
                {Math.round(matchScore)}% 匹配
              </span>
            )}
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {experience.period}
            </span>
            {experience.location && (
              <p className="text-sm text-gray-400 dark:text-gray-500">
                {experience.location}
              </p>
            )}
          </div>
        </div>

        <p className="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">
          {experience.description}
        </p>

        {experience.skillTags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-2">
            {experience.skillTags.map((tag) => (
              <span
                key={tag}
                className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded text-sm"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {experience.abilityTags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {experience.abilityTags.map((tag) => (
              <span
                key={tag}
                className="px-3 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 rounded text-sm"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        <Link
          to={`/experience/${experience.id}`}
          className="inline-flex items-center gap-2 text-green-600 dark:text-green-500 hover:text-green-700 dark:hover:text-green-400 font-medium transition-colors"
        >
          查看详情
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      </div>
    </div>
  )
}
