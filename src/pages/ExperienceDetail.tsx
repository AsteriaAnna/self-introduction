import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import ReactMarkdown from 'react-markdown'
import { Experience } from '@/types'
import { getExperienceById } from '@/utils/markdownParser'
import { Navbar } from '@components/common/Layout'
import { useTheme } from '@components/extensions/Theme'
import { useLanguage } from '@components/extensions/Language'

export default function ExperienceDetail() {
  const { id } = useParams<{ id: string }>()
  const [experience, setExperience] = useState<Experience | null>(null)
  const { theme } = useTheme()
  const { t } = useLanguage()

  useEffect(() => {
    if (id) {
      const exp = getExperienceById(id)
      setExperience(exp || null)
    }
  }, [id])

  if (!experience) {
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
          <h1 className="text-3xl sm:text-4xl font-light tracking-tight text-gray-900 dark:text-white mb-4">
            {experience.role}
          </h1>
          <div className={`flex flex-wrap gap-3 items-center mb-6 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
            <span className="text-base">{experience.company}</span>
            <span className={theme === 'dark' ? 'text-gray-600' : 'text-gray-300'}>·</span>
            <span className="text-sm">{experience.period}</span>
            {experience.location && (
              <>
                <span className={theme === 'dark' ? 'text-gray-600' : 'text-gray-300'}>·</span>
                <span className="text-sm">{experience.location}</span>
              </>
            )}
          </div>

          {experience.skillTags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {experience.skillTags.map((tag) => (
                <span
                  key={tag}
                  className={`text-xs px-3 py-1 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          {experience.abilityTags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2">
              {experience.abilityTags.map((tag) => (
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
          <ReactMarkdown>{experience.content}</ReactMarkdown>
        </article>
      </main>
    </div>
  )
}
