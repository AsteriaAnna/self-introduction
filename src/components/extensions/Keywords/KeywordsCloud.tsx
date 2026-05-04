import { useEffect, useState } from 'react'
import { Keyword } from '@/types'
import { getAllProjects, getAllExperiences } from '@/utils/markdownParser'

interface KeywordsCloudProps {
  selectedKeywords: string[]
  onKeywordClick: (keyword: string) => void
}

export function KeywordsCloud({ selectedKeywords, onKeywordClick }: KeywordsCloudProps) {
  const [keywords, setKeywords] = useState<Keyword[]>([])

  useEffect(() => {
    const projects = getAllProjects()
    const experiences = getAllExperiences()

    const tagCounts = new Map<string, number>()

    projects.forEach(project => {
      project.tags.forEach(tag => {
        tagCounts.set(tag, (tagCounts.get(tag) || 0) + 1)
      })
    })

    experiences.forEach(exp => {
      exp.tags.forEach(tag => {
        tagCounts.set(tag, (tagCounts.get(tag) || 0) + 1)
      })
    })

    const keywordList: Keyword[] = Array.from(tagCounts.entries()).map(([name, count]) => ({
      name,
      count,
      type: 'skill' as const
    }))

    keywordList.sort((a, b) => b.count - a.count)
    setKeywords(keywordList)
  }, [])

  const getSize = (count: number, maxCount: number) => {
    const minSize = 0.875
    const maxSize = 2.25
    const ratio = maxCount > 1 ? (count - 1) / (maxCount - 1) : 0
    return minSize + ratio * (maxSize - minSize)
  }

  const maxCount = keywords.length > 0 ? Math.max(...keywords.map(k => k.count)) : 0

  if (keywords.length === 0) {
    return null
  }

  return (
    <div className="relative w-full py-8">
      <div className="flex flex-wrap justify-center items-center gap-4 px-4">
        {keywords.map((keyword, index) => {
          const size = getSize(keyword.count, maxCount)
          const isSelected = selectedKeywords.includes(keyword.name)
          const delay = index * 30

          return (
            <button
              key={keyword.name}
              onClick={() => onKeywordClick(keyword.name)}
              className={`
                relative px-5 py-2.5 rounded-full transition-all duration-500 font-medium
                transform hover:scale-110 hover:-translate-y-1
                ${isSelected
                  ? 'bg-gradient-to-r from-green-600 to-emerald-600 text-white shadow-lg shadow-green-500/30 scale-105'
                  : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:shadow-lg border border-gray-200 dark:border-gray-700 hover:border-green-400 dark:hover:border-green-500'
                }
              `}
              style={{
                fontSize: `${size}rem`,
                transitionDelay: `${delay}ms`
              }}
            >
              {keyword.name}
              <span className={`
                ml-2 text-xs font-normal
                ${isSelected ? 'text-green-200' : 'text-gray-400 dark:text-gray-500'}
              `}>
                {keyword.count}
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
