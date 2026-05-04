import { useEffect, useState } from 'react'
import { Keyword } from '@/types'
import { getAllProjects, getAllExperiences } from '@/utils/markdownParser'

interface KeywordsCloudProps {
  selectedKeyword: string | null
  onKeywordClick: (keyword: string) => void
}

export function KeywordsCloud({ selectedKeyword, onKeywordClick }: KeywordsCloudProps) {
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
    const maxSize = 1.5
    const ratio = maxCount > 0 ? (count - 1) / (maxCount - 1) : 0
    return minSize + ratio * (maxSize - minSize)
  }

  const maxCount = keywords.length > 0 ? Math.max(...keywords.map(k => k.count)) : 0

  if (keywords.length === 0) {
    return null
  }

  return (
    <div className="flex flex-wrap gap-3 justify-center items-center py-8">
      {keywords.map((keyword) => {
        const size = getSize(keyword.count, maxCount)
        const isSelected = selectedKeyword === keyword.name

        return (
          <button
            key={keyword.name}
            onClick={() => onKeywordClick(keyword.name)}
            className={`
              px-4 py-2 rounded-full transition-all duration-300 font-medium
              ${isSelected
                ? 'bg-green-600 text-white shadow-lg scale-105'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-green-100 dark:hover:bg-green-900/30 hover:text-green-700 dark:hover:text-green-400'
              }
            `}
            style={{ fontSize: `${size}rem` }}
          >
            {keyword.name}
            <span className={`ml-2 text-xs ${isSelected ? 'text-green-200' : 'text-gray-400 dark:text-gray-500'}`}>
              {keyword.count}
            </span>
          </button>
        )
      })}
    </div>
  )
}
