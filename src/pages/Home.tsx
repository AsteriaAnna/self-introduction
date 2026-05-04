import { useEffect, useState } from 'react'
import { Navbar } from '@components/common/Layout'
import { Hero } from '@components/core/Hero'
import { ProjectList } from '@components/core/ProjectList'
import { ExperienceTimeline } from '@components/core/Experience'
import { KeywordsCloud } from '@components/extensions/Keywords'
import { KnowledgeGraph } from '@components/extensions/KnowledgeGraph/KnowledgeGraph'

function Section({ id, title, children, isLight = true }: {
  id: string
  title: string
  children: React.ReactNode
  isLight?: boolean
}) {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.1 }
    )

    const element = document.getElementById(id)
    if (element) {
      observer.observe(element)
    }

    return () => {
      if (element) {
        observer.unobserve(element)
      }
    }
  }, [id])

  return (
    <section
      id={id}
      className={`min-h-screen py-12 px-4 sm:px-6 lg:px-8 transition-all duration-1000 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
      } ${isLight ? 'bg-white dark:bg-gray-950' : 'bg-gray-50 dark:bg-gray-900'}`}
    >
      <div className="max-w-6xl mx-auto">
        <h2 className="text-2xl sm:text-3xl font-bold mb-8 text-center">{title}</h2>
        {children}
      </div>
    </section>
  )
}

function GraphPreview() {
  const [isVisible, setIsVisible] = useState(false)
  const [graphHeight, setGraphHeight] = useState(500)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.1 }
    )

    const element = document.getElementById('graph-preview')
    if (element) {
      observer.observe(element)
    }

    return () => {
      if (element) {
        observer.unobserve(element)
      }
    }
  }, [])

  useEffect(() => {
    const updateHeight = () => {
      if (window.innerWidth < 640) {
        setGraphHeight(400)
      } else if (window.innerWidth < 1024) {
        setGraphHeight(480)
      } else {
        setGraphHeight(580)
      }
    }

    updateHeight()
    window.addEventListener('resize', updateHeight)
    return () => window.removeEventListener('resize', updateHeight)
  }, [])

  return (
    <section
      id="graph-preview"
      className={`py-12 px-4 sm:px-6 lg:px-8 transition-all duration-1000 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
      }`}
    >
      <div className="max-w-6xl mx-auto">
        <h2 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6 text-center">知识图谱</h2>
        <p className="text-center text-gray-500 dark:text-gray-400 mb-6 sm:mb-8 max-w-lg mx-auto text-sm sm:text-base">
          点击节点查看详情 · 下方标签筛选列表
        </p>
        <KnowledgeGraph height={graphHeight} />
      </div>
    </section>
  )
}

export default function Home() {
  const [selectedKeywords, setSelectedKeywords] = useState<string[]>([])

  const handleKeywordClick = (keyword: string) => {
    if (selectedKeywords.includes(keyword)) {
      setSelectedKeywords(selectedKeywords.filter(k => k !== keyword))
    } else {
      setSelectedKeywords([...selectedKeywords, keyword])
    }
  }

  const clearAllFilters = () => {
    setSelectedKeywords([])
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 text-gray-900 dark:text-white overflow-x-hidden">
      <Navbar />
      <main>
        <Hero />

        <GraphPreview />

        <section id="keywords" className="py-8 sm:py-12 px-4 sm:px-6 lg:px-8 bg-white dark:bg-gray-950 transition-all duration-1000">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 text-center">技能标签</h2>
            <KeywordsCloud
              selectedKeywords={selectedKeywords}
              onKeywordClick={handleKeywordClick}
            />
          </div>
        </section>

        {selectedKeywords.length > 0 && (
          <div className="fixed bottom-4 sm:bottom-8 right-4 sm:right-8 z-40">
            <button
              onClick={clearAllFilters}
              className="px-4 sm:px-6 py-2 sm:py-3 bg-green-600 text-white rounded-full shadow-xl hover:bg-green-700 transition-all duration-300 flex items-center gap-2 font-medium text-sm sm:text-base"
            >
              <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
              清除筛选 ({selectedKeywords.length})
            </button>
          </div>
        )}

        <Section id="projects" title="项目展示" isLight={false}>
          <ProjectList filterKeywords={selectedKeywords} />
        </Section>

        <Section id="experience" title="工作经历" isLight={true}>
          <ExperienceTimeline filterKeywords={selectedKeywords} />
        </Section>

        <Section id="contact" title="联系我" isLight={false}>
          <p className="text-gray-500 dark:text-gray-400 text-center text-sm sm:text-base">
            联系方式已在首页展示
          </p>
        </Section>
      </main>
    </div>
  )
}
