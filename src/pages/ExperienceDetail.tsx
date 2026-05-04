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

  const MarkdownComponents = {
    h1: ({ children }: { children: React.ReactNode }) => (
      <h1 className="text-2xl sm:text-3xl font-light tracking-tight text-gray-900 dark:text-white mt-12 mb-6">
        {children}
      </h1>
    ),
    h2: ({ children }: { children: React.ReactNode }) => (
      <h2 className="text-xl sm:text-2xl font-light tracking-tight text-gray-900 dark:text-white mt-10 mb-4">
        {children}
      </h2>
    ),
    h3: ({ children }: { children: React.ReactNode }) => (
      <h3 className="text-lg sm:text-xl font-light text-gray-900 dark:text-white mt-8 mb-3">
        {children}
      </h3>
    ),
    p: ({ children }: { children: React.ReactNode }) => (
      <p className={`text-sm sm:text-base leading-relaxed mb-6 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
        {children}
      </p>
    ),
    ul: ({ children }: { children: React.ReactNode }) => (
      <ul className={`space-y-3 mb-6 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
        {children}
      </ul>
    ),
    ol: ({ children }: { children: React.ReactNode }) => (
      <ol className={`space-y-3 mb-6 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
        {children}
      </ol>
    ),
    li: ({ children }: { children: React.ReactNode }) => (
      <li className="text-sm sm:text-base flex items-start gap-2">
        <span className={`shrink-0 w-1.5 h-1.5 rounded-full mt-2 ${theme === 'dark' ? 'bg-gray-500' : 'bg-gray-400'}`}></span>
        <span>{children}</span>
      </li>
    ),
    blockquote: ({ children }: { children: React.ReactNode }) => (
      <blockquote className={`border-l-2 pl-4 py-1 my-6 ${theme === 'dark' ? 'border-gray-700 text-gray-400' : 'border-gray-300 text-gray-500'}`}>
        {children}
      </blockquote>
    ),
    code: ({ children }: { children: React.ReactNode }) => (
      <code className={`px-2 py-0.5 rounded text-xs font-mono ${theme === 'dark' ? 'bg-gray-800 text-gray-300' : 'bg-gray-100 text-gray-700'}`}>
        {children}
      </code>
    ),
    pre: ({ children }: { children: React.ReactNode }) => (
      <pre className={`p-4 rounded-lg text-sm overflow-x-auto my-6 ${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-100'}`}>
        {children}
      </pre>
    ),
    a: ({ href, children }: { href: string; children: React.ReactNode }) => (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={`text-sm font-medium transition-colors hover:underline ${theme === 'dark' ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'}`}
      >
        {children}
      </a>
    ),
  }

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-gray-950' : 'bg-white'}`}>
      <Navbar />
      <main className="max-w-3xl lg:max-w-4xl mx-auto px-6 pt-32 pb-20">
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
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-light tracking-tight text-gray-900 dark:text-white mb-4">
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
                  className={`text-xs px-4 py-1.5 rounded-full border ${theme === 'dark' ? 'text-gray-400 border-gray-700' : 'text-gray-500 border-gray-200'}`}
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          {experience.abilityTags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-3">
              {experience.abilityTags.map((tag) => (
                <span
                  key={tag}
                  className={`text-xs px-4 py-1.5 ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </header>

        <article className="space-y-1">
          <ReactMarkdown components={MarkdownComponents}>{experience.content}</ReactMarkdown>
        </article>
      </main>
    </div>
  )
}
