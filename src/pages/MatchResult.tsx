import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { Navbar } from '@components/common/Layout'
import { ProjectCard } from '@components/core/ProjectList/ProjectCard'
import { TimelineItem } from '@components/core/Experience/TimelineItem'
import { Project, Experience } from '@/types'
import { getAllProjects, getAllExperiences } from '@/utils/markdownParser'
import { extractKeywords, matchProjects, matchExperiences } from '@/utils/keywordMatcher'

export default function MatchResult() {
  const location = useLocation()
  const navigate = useNavigate()
  const [jdText, setJdText] = useState('')
  const [extractedKeywords, setExtractedKeywords] = useState<string[]>([])
  const [matchedProjects, setMatchedProjects] = useState<Project[]>([])
  const [matchedExperiences, setMatchedExperiences] = useState<Experience[]>([])
  const [projectScores, setProjectScores] = useState<Map<string, number>>(new Map())
  const [experienceScores, setExperienceScores] = useState<Map<string, number>>(new Map())
  const [overallScore, setOverallScore] = useState(0)

  useEffect(() => {
    const state = location.state as { jdText?: string }
    if (state?.jdText) {
      setJdText(state.jdText)
      processMatch(state.jdText)
    } else {
      navigate('/')
    }
  }, [location.state, navigate])

  const processMatch = (text: string) => {
    const keywords = extractKeywords(text)
    setExtractedKeywords(keywords)

    const projects = getAllProjects()
    const experiences = getAllExperiences()

    const { matchedProjects: projs, matchScores: projScores } = matchProjects(keywords, projects)
    const { matchedExperiences: exps, matchScores: expScores } = matchExperiences(keywords, experiences)

    setMatchedProjects(projs)
    setMatchedExperiences(exps)
    setProjectScores(projScores)
    setExperienceScores(expScores)

    const maxProjectScore = projs.length > 0
      ? Math.max(...projs.map(p => projScores.get(p.id) || 0))
      : 0

    const maxExperienceScore = exps.length > 0
      ? Math.max(...exps.map(e => expScores.get(e.id) || 0))
      : 0

    let overall = 0
    if (projs.length > 0 && exps.length > 0) {
      overall = Math.round((maxProjectScore + maxExperienceScore) / 2)
    } else if (projs.length > 0) {
      overall = Math.round(maxProjectScore)
    } else if (exps.length > 0) {
      overall = Math.round(maxExperienceScore)
    }
    setOverallScore(overall)
  }

  const goBack = () => {
    navigate('/')
  }

  const totalMatches = matchedProjects.length + matchedExperiences.length

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 text-gray-900 dark:text-white">
      <Navbar />
      <main>
        <section className="py-16 px-4 bg-gradient-to-br from-green-600 to-emerald-700">
          <div className="max-w-4xl mx-auto text-center text-white">
            <button
              onClick={goBack}
              className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-8 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              返回首页
            </button>
            <h1 className="text-4xl font-bold mb-4">JD匹配结果</h1>
            <p className="text-white/80 mb-8">
              根据您提供的招聘需求，为您匹配以下项目和经历
            </p>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto">
              <div className="bg-white/20 backdrop-blur-sm rounded-xl p-6">
                <div className="text-4xl font-bold mb-2">{totalMatches}</div>
                <div className="text-sm text-white/80">总匹配数</div>
              </div>
              <div className="bg-white/20 backdrop-blur-sm rounded-xl p-6">
                <div className="text-4xl font-bold mb-2">{matchedProjects.length}</div>
                <div className="text-sm text-white/80">匹配项目</div>
              </div>
              <div className="bg-white/20 backdrop-blur-sm rounded-xl p-6">
                <div className="text-4xl font-bold mb-2">{matchedExperiences.length}</div>
                <div className="text-sm text-white/80">匹配经历</div>
              </div>
              <div className="bg-white/20 backdrop-blur-sm rounded-xl p-6">
                <div className="text-4xl font-bold mb-2">{overallScore}%</div>
                <div className="text-sm text-white/80">综合匹配度</div>
              </div>
            </div>

            {extractedKeywords.length > 0 && (
              <div className="mt-8">
                <p className="text-sm text-white/80 mb-3">识别到的技能关键词</p>
                <div className="flex flex-wrap justify-center gap-2">
                  {extractedKeywords.map((keyword) => (
                    <span
                      key={keyword}
                      className="px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-sm font-medium"
                    >
                      {keyword}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>

        {matchedProjects.length > 0 && (
          <section className="py-16 px-4 bg-white dark:bg-gray-950">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-3xl font-bold mb-8 text-center">
                匹配项目 ({matchedProjects.length})
              </h2>
              <div className="space-y-6">
                {matchedProjects.map((project, index) => (
                  <div
                    key={project.id}
                    className={`transition-all duration-700 ease-out ${
                      index === 0 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                    }`}
                    style={{ transitionDelay: `${index * 200}ms` }}
                  >
                    <ProjectCard
                      project={project}
                      isHighlighted={true}
                      matchScore={projectScores.get(project.id) || 0}
                    />
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {matchedExperiences.length > 0 && (
          <section className="py-16 px-4 bg-gray-50 dark:bg-gray-900">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-3xl font-bold mb-8 text-center">
                匹配经历 ({matchedExperiences.length})
              </h2>
              <div className="space-y-8">
                {matchedExperiences.map((experience, index) => (
                  <div
                    key={experience.id}
                    className={`transition-all duration-700 ease-out ${
                      index === 0 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                    }`}
                    style={{ transitionDelay: `${index * 200}ms` }}
                  >
                    <TimelineItem
                      experience={experience}
                      isLast={index === matchedExperiences.length - 1}
                      isHighlighted={true}
                      matchScore={experienceScores.get(experience.id) || 0}
                    />
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {totalMatches === 0 && (
          <section className="py-24 px-4 bg-white dark:bg-gray-950">
            <div className="max-w-4xl mx-auto text-center">
              <div className="text-6xl mb-6">🔍</div>
              <h2 className="text-2xl font-bold mb-4">没有找到匹配结果</h2>
              <p className="text-gray-500 dark:text-gray-400 mb-8">
                请尝试使用更详细的JD内容或不同的关键词
              </p>
              <button
                onClick={goBack}
                className="px-6 py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors"
              >
                返回首页重新匹配
              </button>
            </div>
          </section>
        )}
      </main>
    </div>
  )
}
