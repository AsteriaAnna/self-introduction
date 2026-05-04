import { Link } from 'react-router-dom'
import { Project } from '@/types'

interface ProjectCardProps {
  project: Project
  isHighlighted?: boolean
  matchScore?: number
}

export function ProjectCard({ project, isHighlighted = false, matchScore }: ProjectCardProps) {
  return (
    <Link
      to={`/project/${project.id}`}
      className={`block p-6 rounded-lg border transition-all duration-300 hover:shadow-xl hover:-translate-y-1 ${
        isHighlighted
          ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
          : 'border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 hover:border-green-500 dark:hover:border-green-600'
      }`}
    >
      <div className="flex items-start justify-between mb-4">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white">
          {project.title}
        </h3>
        <div className="flex items-center gap-2">
          {matchScore !== undefined && (
            <span className="px-3 py-1 bg-green-100 dark:bg-green-900/50 text-green-700 dark:text-green-400 rounded-full text-sm font-semibold">
              {Math.round(matchScore)}% 匹配
            </span>
          )}
          <span
            className={`px-3 py-1 rounded-full text-xs font-medium ${
              project.status === 'completed'
                ? 'bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-400'
                : project.status === 'in-progress'
                ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-400'
                : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300'
            }`}
          >
            {project.status === 'completed'
              ? '已完成'
              : project.status === 'in-progress'
              ? '进行中'
              : '计划中'}
          </span>
        </div>
      </div>

      <p className="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">
        {project.description}
      </p>

      {project.skillTags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-2">
          {project.skillTags.map((tag) => (
            <span
              key={tag}
              className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded text-sm"
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      {project.abilityTags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {project.abilityTags.map((tag) => (
            <span
              key={tag}
              className="px-3 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 rounded text-sm"
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
        <span>{project.date}</span>
        <span className="text-green-600 dark:text-green-500 font-medium">
          查看详情 →
        </span>
      </div>
    </Link>
  )
}
