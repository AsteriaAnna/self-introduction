import { useEffect, useState } from 'react'
import { Navbar } from '@components/common/Layout'
import { Hero } from '@components/core/Hero'
import { ProjectList } from '@components/core/ProjectList'
import { ExperienceTimeline } from '@components/core/Experience'
import { KeywordsCloud } from '@components/extensions/Keywords'
import { JDMatcher } from '@components/extensions/JDMatcher'

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
      className={`min-h-screen py-20 px-4 transition-all duration-1000 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
      } ${isLight ? 'bg-white dark:bg-gray-950' : 'bg-gray-50 dark:bg-gray-900'}`}
    >
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold mb-12 text-center">{title}</h2>
        {children}
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
    <div className="min-h-screen bg-white dark:bg-gray-950 text-gray-900 dark:text-white">
      <Navbar />
      <main>
        <Hero />

        <section id="jdmatcher" className="py-12 px-4 bg-gray-50 dark:bg-gray-900 transition-all duration-1000">
          <div className="max-w-4xl mx-auto">
            <JDMatcher />
          </div>
        </section>

        <section id="keywords" className="py-12 px-4 bg-white dark:bg-gray-950 transition-all duration-1000">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-2xl font-bold mb-6 text-center">技能标签</h2>
            <KeywordsCloud
              selectedKeywords={selectedKeywords}
              onKeywordClick={handleKeywordClick}
            />
          </div>
        </section>

        {selectedKeywords.length > 0 && (
          <div className="fixed bottom-8 right-8 z-40">
            <button
              onClick={clearAllFilters}
              className="px-6 py-3 bg-green-600 text-white rounded-full shadow-xl hover:bg-green-700 transition-all duration-300 flex items-center gap-2 font-medium"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
          <p className="text-gray-500 dark:text-gray-400 text-center">
            联系方式已在首页展示
          </p>
        </Section>
      </main>
    </div>
  )
}
