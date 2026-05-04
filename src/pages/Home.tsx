import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Navbar } from '@components/common/Layout'
import { SiteConfig } from '@/types'
import configJson from '@/data/config.json'
import { getAllProjects, getAllExperiences } from '@/utils/markdownParser'
import { Keyword } from '@/types'
import { KnowledgeGraph } from '@components/extensions/KnowledgeGraph/KnowledgeGraph'
import { useTheme } from '@components/extensions/Theme'
import { useLanguage } from '@components/extensions/Language'

const config = configJson as SiteConfig

function useScrollAnimation(id: string) {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.15 }
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

  return isVisible
}

function HeroSection() {
  const isVisible = useScrollAnimation('hero')
  const { theme } = useTheme()
  const { t } = useLanguage()

  return (
    <section
      id="hero"
      className="min-h-screen flex flex-col items-center justify-center px-4 sm:px-6 relative"
    >
      <div className={`absolute inset-0 ${theme === 'dark' ? 'bg-gray-950' : 'bg-white'}`} />

      <div className="relative z-10 max-w-3xl mx-auto text-center">
        <div
          className={`transition-all duration-1000 transform ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
          }`}
        >
          <p className={`text-xs sm:text-sm tracking-[0.3em] uppercase mb-4 sm:mb-8 text-gray-400 ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>
            {t('hero.hello')}
          </p>
          <h1 className={`text-3xl xs:text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extralight tracking-tight mb-4 sm:mb-8 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
            {config.name}
          </h1>
          <p className={`text-base sm:text-xl font-light mb-8 sm:mb-12 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
            {config.title}
          </p>
          <p className={`text-sm sm:text-base leading-loose max-w-xl mx-auto mb-12 sm:mb-16 px-2 ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>
            {config.bio}
          </p>

          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
            {config.email && (
              <a
                href={`mailto:${config.email}`}
                className={`relative inline-block px-8 sm:px-12 py-3 text-sm sm:text-base tracking-wide transition-all duration-300 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}
              >
                {t('hero.contact')}
                <span className={`absolute -bottom-1 left-0 w-0 h-0.5 transition-all duration-300 ${theme === 'dark' ? 'bg-white' : 'bg-gray-900'} hover:w-full`} />
                <span className={`absolute -bottom-1 left-0 w-full h-0.5 ${theme === 'dark' ? 'bg-white/20' : 'bg-gray-900/20'}`} />
              </a>
            )}
            <a
              href="#graph"
              className={`relative inline-block px-8 sm:px-12 py-3 text-sm sm:text-base tracking-wide transition-all duration-300 ${theme === 'dark' ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-900'}`}
            >
              {t('hero.explore')}
              <span className={`absolute -bottom-1 left-0 w-0 h-0.5 transition-all duration-300 ${theme === 'dark' ? 'bg-white' : 'bg-gray-900'} hover:w-full`} />
              <span className={`absolute -bottom-1 left-0 w-full h-0.5 ${theme === 'dark' ? 'bg-white/20' : 'bg-gray-900/20'}`} />
            </a>
          </div>
        </div>
      </div>

      <div className="absolute bottom-16 left-1/2 transform -translate-x-1/2 animate-bounce">
        <svg className={`w-5 h-5 ${theme === 'dark' ? 'text-gray-700' : 'text-gray-300'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
      </div>
    </section>
  )
}

function LifeAttitudeSection() {
  const isVisible = useScrollAnimation('attitude')
  const { t, language } = useLanguage()

  const attitudes = language === 'zh' ? [
    { word: '专注', desc: '用心做好每一件事' },
    { word: '探索', desc: '对新事物充满好奇心' },
    { word: '创造', desc: '用代码创造价值' },
    { word: '热爱', desc: '享受技术带来的乐趣' }
  ] : [
    { word: 'Focus', desc: 'Doing things with care' },
    { word: 'Explore', desc: 'Curious about new things' },
    { word: 'Create', desc: 'Creating value with code' },
    { word: 'Love', desc: 'Enjoying the joy of tech' }
  ]

  return (
    <section
      id="attitude"
      className="py-16 sm:py-24 md:py-32 px-4 sm:px-6"
    >
      <div className="max-w-4xl mx-auto">
        <div
          className={`text-center mb-12 sm:mb-16 md:mb-20 transition-all duration-1000 transform ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
          }`}
        >
          <p className="text-xs tracking-[0.3em] uppercase mb-4 sm:mb-6 text-gray-400">
            {t('life.attitude.title')}
          </p>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-light text-gray-900 dark:text-white">
            {t('life.attitude.subtitle')}
          </h2>
        </div>

        <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 gap-8 sm:gap-12">
          {attitudes.map((item, index) => (
            <div
              key={item.word}
              className={`text-center transition-all duration-700 transform ${
                isVisible
                  ? 'opacity-100 translate-y-0'
                  : 'opacity-0 translate-y-12'
              }`}
              style={{ transitionDelay: `${index * 150}ms` }}
            >
              <h3 className="text-lg sm:text-xl font-light tracking-wide text-gray-900 dark:text-white mb-2 sm:mb-3">
                {item.word}
              </h3>
              <p className="text-xs sm:text-sm text-gray-400 dark:text-gray-500">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function AbilityCloudSection() {
  const isVisible = useScrollAnimation('ability-cloud')
  const [abilities, setAbilities] = useState<Keyword[]>([])
  const { t } = useLanguage()
  const navigate = useNavigate()

  useEffect(() => {
    const projects = getAllProjects()
    const experiences = getAllExperiences()

    const tagCounts = new Map<string, number>()
    projects.forEach(project => {
      project.abilityTags.forEach(tag => {
        tagCounts.set(tag, (tagCounts.get(tag) || 0) + 1)
      })
    })
    experiences.forEach(exp => {
      exp.abilityTags.forEach(tag => {
        tagCounts.set(tag, (tagCounts.get(tag) || 0) + 1)
      })
    })

    const abilityList: Keyword[] = Array.from(tagCounts.entries()).map(([name, count]) => ({
      name,
      count,
      type: 'ability' as const
    }))
    abilityList.sort((a, b) => b.count - a.count)
    setAbilities(abilityList)
  }, [])

  const getSize = (count: number, maxCount: number) => {
    const minSize = 0.7
    const maxSize = 2.0
    const ratio = maxCount > 1 ? (count - 1) / (maxCount - 1) : 0
    return minSize + ratio * (maxSize - minSize)
  }

  const getColor = (index: number) => {
    const colors = [
      'text-gray-400',
      'text-gray-500',
      'text-gray-600',
      'text-gray-400 dark:text-gray-500',
      'text-gray-500 dark:text-gray-400',
    ]
    return colors[index % colors.length]
  }

  const getRotation = (index: number) => {
    const rotations = [-15, 0, 15, -10, 10, -5, 5, -20, 20]
    return rotations[index % rotations.length]
  }

  const handleClick = (abilityName: string) => {
    navigate(`/skill/${encodeURIComponent(abilityName)}`)
  }

  const maxCount = abilities.length > 0 ? Math.max(...abilities.map(k => k.count)) : 0

  return (
    <section
      id="ability-cloud"
      className="py-16 sm:py-24 md:py-32 px-4 sm:px-6"
    >
      <div className="max-w-5xl mx-auto">
        <div
          className={`text-center mb-10 sm:mb-16 transition-all duration-1000 transform ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
          }`}
        >
          <p className="text-xs tracking-[0.3em] uppercase mb-4 sm:mb-6 text-gray-400">
            {t('ability.cloud.title')}
          </p>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-light text-gray-900 dark:text-white">
            {t('ability.cloud.subtitle')}
          </h2>
        </div>

        <div
          className={`relative transition-all duration-1000 transform ${
            isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
          }`}
        >
          <div className="flex flex-wrap justify-center items-center gap-x-4 gap-y-2 sm:gap-x-10 sm:gap-y-4 py-4 sm:py-8">
            {abilities.map((ability, index) => {
              const size = getSize(ability.count, maxCount)
              const rotation = getRotation(index)
              const isRotated = Math.abs(rotation) > 5

              return (
                <span
                  key={ability.name}
                  onClick={() => handleClick(ability.name)}
                  className={`cursor-pointer select-none transition-all duration-300 hover:text-gray-900 dark:hover:text-white ${getColor(index)}`}
                  style={{
                    fontSize: `${size}rem`,
                    transform: `rotate(${rotation}deg)`,
                    display: 'inline-block',
                    padding: isRotated ? '0.2rem 0.4rem' : '0.1rem 0.2rem',
                    transitionDelay: `${index * 40}ms`
                  }}
                >
                  {ability.name}
                </span>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}

function ExploreDirectionsSection() {
  const isVisible = useScrollAnimation('explore')
  const { t, language } = useLanguage()

  const directions = language === 'zh' ? [
    { title: '前端', desc: 'React, Vue, 现代 Web' },
    { title: '后端', desc: 'Node.js, Go, 架构设计' },
    { title: 'AI', desc: '机器学习, 深度学习' },
    { title: '设计', desc: '用户体验, 产品设计' }
  ] : [
    { title: 'Frontend', desc: 'React, Vue, Modern Web' },
    { title: 'Backend', desc: 'Node.js, Go, Architecture' },
    { title: 'AI', desc: 'Machine Learning, Deep Learning' },
    { title: 'Design', desc: 'User Experience, Product' }
  ]

  return (
    <section
      id="explore"
      className="py-16 sm:py-24 md:py-32 px-4 sm:px-6"
    >
      <div className="max-w-4xl mx-auto">
        <div
          className={`text-center mb-12 sm:mb-16 md:mb-20 transition-all duration-1000 transform ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
          }`}
        >
          <p className="text-xs tracking-[0.3em] uppercase mb-4 sm:mb-6 text-gray-400">
            {t('explore.directions.title')}
          </p>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-light text-gray-900 dark:text-white">
            {t('explore.directions.subtitle')}
          </h2>
        </div>

        <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 gap-8 sm:gap-12">
          {directions.map((item, index) => (
            <div
              key={item.title}
              className={`text-center transition-all duration-700 transform ${
                isVisible
                  ? 'opacity-100 translate-y-0'
                  : 'opacity-0 translate-y-12'
              }`}
              style={{ transitionDelay: `${index * 150}ms` }}
            >
              <h3 className="text-lg sm:text-xl font-light tracking-wide text-gray-900 dark:text-white mb-2">
                {item.title}
              </h3>
              <p className="text-xs sm:text-sm text-gray-400 dark:text-gray-500">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function SkillCloudSection() {
  const isVisible = useScrollAnimation('skill-cloud')
  const [skills, setSkills] = useState<Keyword[]>([])
  const { theme } = useTheme()
  const { t } = useLanguage()
  const navigate = useNavigate()

  useEffect(() => {
    const projects = getAllProjects()
    const experiences = getAllExperiences()

    const tagCounts = new Map<string, number>()
    projects.forEach(project => {
      project.skillTags.forEach(tag => {
        tagCounts.set(tag, (tagCounts.get(tag) || 0) + 1)
      })
    })
    experiences.forEach(exp => {
      exp.skillTags.forEach(tag => {
        tagCounts.set(tag, (tagCounts.get(tag) || 0) + 1)
      })
    })

    const skillList: Keyword[] = Array.from(tagCounts.entries()).map(([name, count]) => ({
      name,
      count,
      type: 'skill' as const
    }))
    skillList.sort((a, b) => b.count - a.count)
    setSkills(skillList)
  }, [])

  const getSize = (count: number, maxCount: number) => {
    const minSize = 0.7
    const maxSize = 2.25
    const ratio = maxCount > 1 ? (count - 1) / (maxCount - 1) : 0
    return minSize + ratio * (maxSize - minSize)
  }

  const getColor = (index: number, theme: string) => {
    const lightColors = [
      'text-gray-500',
      'text-gray-600',
      'text-gray-700',
      'text-gray-400',
      'text-gray-500',
    ]
    const darkColors = [
      'text-gray-400',
      'text-gray-500',
      'text-gray-300',
      'text-gray-400',
      'text-gray-500',
    ]
    const colors = theme === 'dark' ? darkColors : lightColors
    return colors[index % colors.length]
  }

  const getRotation = (index: number) => {
    const rotations = [-12, 0, 12, -8, 8, -3, 3, -18, 18, -6, 6]
    return rotations[index % rotations.length]
  }

  const handleClick = (skillName: string) => {
    navigate(`/skill/${encodeURIComponent(skillName)}`)
  }

  const maxCount = skills.length > 0 ? Math.max(...skills.map(k => k.count)) : 0

  return (
    <section
      id="skill-cloud"
      className="py-16 sm:py-24 md:py-32 px-4 sm:px-6"
    >
      <div className="max-w-5xl mx-auto">
        <div
          className={`text-center mb-10 sm:mb-16 transition-all duration-1000 transform ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
          }`}
        >
          <p className="text-xs tracking-[0.3em] uppercase mb-4 sm:mb-6 text-gray-400">
            {t('skill.cloud.title')}
          </p>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-light text-gray-900 dark:text-white">
            {t('skill.cloud.subtitle')}
          </h2>
        </div>

        <div
          className={`relative transition-all duration-1000 transform ${
            isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
          }`}
        >
          <div className="flex flex-wrap justify-center items-center gap-x-4 gap-y-2 sm:gap-x-10 sm:gap-y-4 py-4 sm:py-8">
            {skills.map((skill, index) => {
              const size = getSize(skill.count, maxCount)
              const rotation = getRotation(index)
              const isRotated = Math.abs(rotation) > 5

              return (
                <span
                  key={skill.name}
                  onClick={() => handleClick(skill.name)}
                  className={`cursor-pointer select-none transition-all duration-300 hover:text-gray-900 dark:hover:text-white ${getColor(index, theme)}`}
                  style={{
                    fontSize: `${size}rem`,
                    transform: `rotate(${rotation}deg)`,
                    display: 'inline-block',
                    padding: isRotated ? '0.2rem 0.4rem' : '0.1rem 0.2rem',
                    transitionDelay: `${index * 30}ms`
                  }}
                >
                  {skill.name}
                </span>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}

function KnowledgeGraphSection() {
  const isVisible = useScrollAnimation('graph')
  const { t } = useLanguage()

  return (
    <section
      id="graph"
      className="py-16 sm:py-24 md:py-32 px-4 sm:px-6"
    >
      <div className="max-w-6xl lg:max-w-7xl mx-auto">
        <div
          className={`text-center mb-10 sm:mb-16 transition-all duration-1000 transform ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
          }`}
        >
          <p className="text-xs tracking-[0.3em] uppercase mb-4 sm:mb-6 text-gray-400">
            {t('knowledge.graph.title')}
          </p>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-light text-gray-900 dark:text-white">
            {t('knowledge.graph.subtitle')}
          </h2>
        </div>

        <div
          className={`transition-all duration-1000 transform ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
          }`}
        >
          <div className="bg-gray-50/50 dark:bg-gray-900/50 rounded-lg overflow-hidden">
            <KnowledgeGraph height={600} />
          </div>
        </div>
      </div>
    </section>
  )
}

function ContactSection() {
  const isVisible = useScrollAnimation('contact')
  const { t } = useLanguage()

  return (
    <section
      id="contact"
      className="py-16 sm:py-24 md:py-32 px-4 sm:px-6"
    >
      <div className="max-w-2xl mx-auto text-center">
        <div
          className={`transition-all duration-1000 transform ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
          }`}
        >
          <p className="text-xs tracking-[0.3em] uppercase mb-4 sm:mb-6 text-gray-400">
            {t('contact.title')}
          </p>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-light text-gray-900 dark:text-white mb-8 sm:mb-12">
            {t('contact.subtitle')}
          </h2>

          <div className="flex flex-col sm:flex-row gap-6 sm:gap-8 justify-center mb-12 sm:mb-16">
            {config.email && (
              <a
                href={`mailto:${config.email}`}
                className="text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors text-sm tracking-wide"
              >
                {config.email}
              </a>
            )}

            {config.github && (
              <a
                href={config.github}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors text-sm tracking-wide"
              >
                {config.github.split('/').pop()}
              </a>
            )}

            {config.wechat && (
              <span className="text-gray-500 dark:text-gray-400 text-sm tracking-wide">
                {config.wechat}
              </span>
            )}
          </div>

          <p className="text-gray-400 dark:text-gray-500 text-xs sm:text-sm">
            {t('contact.cta')}
          </p>
        </div>
      </div>
    </section>
  )
}

export default function Home() {
  const { theme } = useTheme()

  return (
    <div className={`min-h-screen overflow-x-hidden ${theme === 'dark' ? 'bg-gray-950' : 'bg-white'}`}>
      <Navbar />
      <main>
        <HeroSection />
        <LifeAttitudeSection />
        <AbilityCloudSection />
        <ExploreDirectionsSection />
        <SkillCloudSection />
        <KnowledgeGraphSection />
        <ContactSection />
      </main>
    </div>
  )
}
