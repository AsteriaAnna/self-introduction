import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import ReactMarkdown from 'react-markdown'
import { Project } from '@/types'
import { getProjectById } from '@/utils/markdownParser'
import { Navbar } from '@components/common/Layout'

export default function ProjectDetail() {
  const { id } = useParams<{ id: string }>()
  const [project, setProject] = useState<Project | null>(null)

  useEffect(() => {
    if (id) {
      const proj = getProjectById(id)
      setProject(proj || null)
    }
  }, [id])

  if (!project) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-950 text-gray-900 dark:text-white">
        <Navbar />
        <div className="max-w-4xl mx-auto px-4 py-20 text-center">
          <h1 className="text-3xl font-bold mb-4">项目不存在</h1>
          <Link to="/" className="text-green-600 dark:text-green-500 hover:underline">
            返回首页
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 text-gray-900 dark:text-white">
      <Navbar />
      <main className="max-w-4xl mx-auto px-4 pt-24 pb-12">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-green-600 dark:text-green-500 hover:text-green-700 dark:hover:text-green-400 mb-8 font-medium"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          返回首页
        </Link>

        <article className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 p-8 md:p-12">
          <header className="mb-8 pb-8 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-start justify-between mb-4">
              <h1 className="text-4xl font-bold">{project.title}</h1>
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

            <div className="flex items-center gap-6 text-sm text-gray-500 dark:text-gray-400">
              <span>{project.date}</span>
              {project.link && (
                <a
                  href={project.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-green-600 dark:text-green-500 hover:text-green-700 dark:hover:text-green-400 font-medium"
                >
                  查看GitHub →
                </a>
              )}
            </div>
          </header>

          <div className="prose prose-lg dark:prose-invert max-w-none">
            <ReactMarkdown>{project.content}</ReactMarkdown>
          </div>
        </article>
      </main>
    </div>
  )
}
