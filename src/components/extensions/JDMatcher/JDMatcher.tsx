import { useState } from 'react'
import { Project, Experience } from '@/types'
import {
  extractKeywords,
  matchProjects,
  matchExperiences,
  calculateOverallMatchScore
} from '@/utils/keywordMatcher'
import { getAllProjects, getAllExperiences } from '@/utils/markdownParser'

interface JDMatcherProps {
  onMatch: (matchedProjectIds: string[], matchedExperienceIds: string[]) => void
  onClear: () => void
}

export function JDMatcher({ onMatch, onClear }: JDMatcherProps) {
  const [jdText, setJdText] = useState('')
  const [isMatching, setIsMatching] = useState(false)
  const [extractedKeywords, setExtractedKeywords] = useState<string[]>([])

  const handleMatch = () => {
    if (!jdText.trim()) return

    setIsMatching(true)

    const keywords = extractKeywords(jdText)
    setExtractedKeywords(keywords)

    const projects = getAllProjects()
    const experiences = getAllExperiences()

    const { matchedProjects } = matchProjects(keywords, projects)
    const { matchedExperiences } = matchExperiences(keywords, experiences)

    const projectIds = matchedProjects.map(p => p.id)
    const experienceIds = matchedExperiences.map(e => e.id)

    onMatch(projectIds, experienceIds)
    setIsMatching(false)
  }

  const handleClear = () => {
    setJdText('')
    setExtractedKeywords([])
    onClear()
  }

  const projects = getAllProjects()
  const experiences = getAllExperiences()

  const { matchedProjects, matchScores: projectScores } = matchProjects(extractedKeywords, projects)
  const { matchedExperiences, matchScores: experienceScores } = matchExperiences(extractedKeywords, experiences)

  const maxProjectScore = matchedProjects.length > 0
    ? Math.max(...matchedProjects.map(p => projectScores.get(p.id) || 0))
    : 0

  const maxExperienceScore = matchedExperiences.length > 0
    ? Math.max(...matchedExperiences.map(e => experienceScores.get(e.id) || 0))
    : 0

  const overallScore = calculateOverallMatchScore(
    maxProjectScore,
    maxExperienceScore,
    matchedProjects.length > 0,
    matchedExperiences.length > 0
  )

  return (
    <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 p-6">
      <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">
        JD智能匹配
      </h3>
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
        粘贴招聘需求，我会帮你匹配相关的项目和经历
      </p>

      <textarea
        value={jdText}
        onChange={(e) => setJdText(e.target.value)}
        placeholder="粘贴JD内容，例如：需要掌握React、TypeScript、Node.js等技术栈..."
        className="w-full h-32 px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 resize-none focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
      />

      <div className="flex gap-3 mt-4">
        <button
          onClick={handleMatch}
          disabled={!jdText.trim() || isMatching}
          className="px-6 py-2.5 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isMatching ? '匹配中...' : '开始匹配'}
        </button>
        {extractedKeywords.length > 0 && (
          <button
            onClick={handleClear}
            className="px-6 py-2.5 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
          >
            清除结果
          </button>
        )}
      </div>

      {extractedKeywords.length > 0 && (
        <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-semibold text-gray-900 dark:text-white">
              匹配结果
            </h4>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500 dark:text-gray-400">综合匹配度</span>
              <span className="text-2xl font-bold text-green-600 dark:text-green-500">
                {overallScore}%
              </span>
            </div>
          </div>

          <div className="mb-4">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              识别到的技能关键词：
            </span>
            <div className="flex flex-wrap gap-2 mt-2">
              {extractedKeywords.map((keyword) => (
                <span
                  key={keyword}
                  className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-full text-sm font-medium"
                >
                  {keyword}
                </span>
              ))}
            </div>
          </div>

          {matchedProjects.length > 0 && (
            <div className="mb-4">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                匹配的项目 ({matchedProjects.length})
              </span>
              <div className="space-y-2 mt-2">
                {matchedProjects.map((project) => (
                  <div
                    key={project.id}
                    className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
                  >
                    <span className="text-gray-900 dark:text-white font-medium">
                      {project.title}
                    </span>
                    <span className="text-green-600 dark:text-green-500 font-semibold">
                      {Math.round(projectScores.get(project.id) || 0)}%
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {matchedExperiences.length > 0 && (
            <div>
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                匹配的经历 ({matchedExperiences.length})
              </span>
              <div className="space-y-2 mt-2">
                {matchedExperiences.map((exp) => (
                  <div
                    key={exp.id}
                    className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
                  >
                    <span className="text-gray-900 dark:text-white font-medium">
                      {exp.role} @ {exp.company}
                    </span>
                    <span className="text-green-600 dark:text-green-500 font-semibold">
                      {Math.round(experienceScores.get(exp.id) || 0)}%
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {matchedProjects.length === 0 && matchedExperiences.length === 0 && (
            <div className="text-center py-8">
              <p className="text-gray-500 dark:text-gray-400">
                没有找到匹配的技能关键词，请尝试粘贴更详细的JD内容
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
