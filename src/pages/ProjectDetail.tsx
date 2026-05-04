import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import ReactMarkdown from 'react-markdown'
import { Project } from '@/types'
import { getProjectById } from '@/utils/markdownParser'
import { Navbar } from '@components/common/Layout'
import { useTheme } from '@components/extensions/Theme'
import { useLanguage } from '@components/extensions/Language'

export default function ProjectDetail() {
  const { id } = useParams<{ id: string }>()
  const [project, setProject] = useState<Project | null>(null)
  const { theme } = useTheme()
  const { t } = useLanguage()

  useEffect(() => {
    if (id) {
      const proj = getProjectById(id)
      setProject(proj || null)
    }
  }, [id])

  if (!project) {
    return (
      <div className={`min-h-screen ${theme === 'dark' ? 'bg-gray-950' : 'bg-white'}`}>
        <Navbar />
        <div className="max-w-2xl mx-auto px-6 py-32 text-center">
          <h1 className="text-2xl font-light text-gray-900 dark:text-white mb-8">
            {t('not.found.title')}
          </h1>
          <Link to="/" className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors text-sm tracking-wide">
            {t('not.found.subtitle')}
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-gray-950' : 'bg-white'}`}>
      <Navbar />
      <main className="max-w-3xl mx-auto px-6 pt-32 pb-20">
        <Link
          to="/"
          className="inline-flex items-center gap-3 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 mb-16 text-sm tracking-wide transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M15 19l-7-7 7-7" />
          </svg>
          {t('nav.back')}
        </Link>

        <header className="mb-16">
          <div className="flex items-baseline justify-between mb-6">
            <h1 className="text-3xl sm:text-4xl font-light tracking-tight text-gray-900 dark:text-white">
              {project.title}
            </h1>
            <span className={`text-xs tracking-wide ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>
              {project.status}
            </span>
          </div>

          <div className={`flex flex-wrap gap-3 mb-8 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
            <span className="text-sm">{project.date}</span>
            {project.link && (
              <a
                href={project.link}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm hover:text-gray-900 dark:hover:text-white transition-colors"
              >
                GitHub →
              </a>
            )}
          </div>

          {project.skillTags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {project.skillTags.map((tag) => (
                <span
                  key={tag}
                  className={`text-xs px-3 py-1 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          {project.abilityTags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2">
              {project.abilityTags.map((tag) => (
                <span
                  key={tag}
                  className={`text-xs px-3 py-1 ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </header>

        <article className={`prose prose-lg dark:prose-invert max-w-none ${theme === 'dark' ? 'prose-gray-400' : 'prose-gray-600'}`}>
          <ReactMarkdown>{project.content}</ReactMarkdown>
        </article>
      </main>
    </div>
  )
}
