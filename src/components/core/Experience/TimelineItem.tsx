import { Experience } from '@/types'

interface TimelineItemProps {
  experience: Experience
  isLast?: boolean
  isHighlighted?: boolean
}

export function TimelineItem({ experience, isLast = false, isHighlighted = false }: TimelineItemProps) {
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
        className={`p-6 rounded-lg border transition-all ${
          isHighlighted
            ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
            : 'border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900'
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

        <div className="flex flex-wrap gap-2">
          {experience.tags.map((tag) => (
            <span
              key={tag}
              className="px-3 py-1 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded text-sm"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}
