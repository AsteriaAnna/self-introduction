import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import ReactMarkdown from 'react-markdown'
import { Experience } from '@/types'
import { getExperienceById } from '@/utils/markdownParser'
import { Navbar } from '@components/common/Layout'

export default function ExperienceDetail() {
  const { id } = useParams<{ id: string }>()
  const [experience, setExperience] = useState<Experience | null>(null)

  useEffect(() => {
    if (id) {
      const exp = getExperienceById(id)
      setExperience(exp || null)
    }
  }, [id])

  if (!experience) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-950 text-gray-900 dark:text-white">
        <Navbar />
        <div className="max-w-4xl mx-auto px-4 py-20 text-center">
          <h1 className="text-3xl font-bold mb-4">经历不存在</h1>
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
      <main className="max-w-4xl mx-auto px-4 py-12">
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
            <h1 className="text-4xl font-bold mb-4">{experience.role}</h1>
            <div className="flex flex-wrap gap-4 items-center text-gray-600 dark:text-gray-300 mb-4">
              <span className="text-xl text-green-600 dark:text-green-500 font-medium">
                {experience.company}
              </span>
              <span className="text-gray-400">|</span>
              <span>{experience.period}</span>
              {experience.location && (
                <>
                  <span className="text-gray-400">|</span>
                  <span>{experience.location}</span>
                </>
              )}
            </div>

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
              <div className="flex flex-wrap gap-2">
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
          </header>

          <div className="prose prose-lg dark:prose-invert max-w-none">
            <ReactMarkdown>{experience.content}</ReactMarkdown>
          </div>
        </article>
      </main>
    </div>
  )
}
