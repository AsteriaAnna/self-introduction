import { useEffect, useState } from 'react'
import { Navbar } from '@components/common/Layout'
import { config } from '@/data/config'
import { getAllProjects, getAllExperiences } from '@/utils/markdownParser'
import { Keyword } from '@/types'
import { KnowledgeGraph } from '@components/extensions/KnowledgeGraph/KnowledgeGraph'

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

  return (
    <section
      id="hero"
      className="min-h-screen flex items-center justify-center py-20 px-6 relative overflow-hidden"
    >
      <div className="absolute inset-0 bg-gradient-to-b from-black via-black to-gray-950" />
      
      <div className="relative z-10 max-w-5xl mx-auto text-center">
        <div
          className={`transition-all duration-1000 transform ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
          }`}
        >
          <p className="text-green-400 text-sm sm:text-base tracking-widest uppercase mb-6 font-medium">
            你好，我是
          </p>
          <h1 className="text-5xl sm:text-7xl lg:text-8xl font-bold text-white mb-6">
            {config.name}
          </h1>
          <p className="text-2xl sm:text-3xl text-gray-400 mb-8 font-light">
            {config.title}
          </p>
          <p className="text-lg sm:text-xl text-gray-500 max-w-2xl mx-auto mb-12 leading-relaxed">
            {config.bio}
          </p>
          
          <div className="flex flex-wrap justify-center gap-4">
            <a
              href={`mailto:${config.email}`}
              className="px-8 py-4 bg-green-600 hover:bg-green-500 text-white rounded-full transition-all duration-300 font-medium shadow-lg shadow-green-900/30 hover:shadow-green-800/40 hover:-translate-y-0.5"
            >
              联系我
            </a>
            <a
              href="#graph"
              className="px-8 py-4 border border-gray-700 hover:border-green-500 text-gray-300 hover:text-green-400 rounded-full transition-all duration-300 font-medium"
            >
              探索更多
            </a>
          </div>
        </div>
      </div>
      
      <div className="absolute bottom-12 left-1/2 transform -translate-x-1/2 animate-bounce">
        <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
      </div>
    </section>
  )
}

function LifeAttitudeSection() {
  const isVisible = useScrollAnimation('attitude')
  const attitudes = [
    { word: '专注', desc: '用心做好每一件事' },
    { word: '探索', desc: '对新事物充满好奇心' },
    { word: '创造', desc: '用代码创造价值' },
    { word: '热爱', desc: '享受技术带来的乐趣' }
  ]

  return (
    <section
      id="attitude"
      className="py-24 sm:py-32 px-6 bg-white dark:bg-black"
    >
      <div className="max-w-6xl mx-auto">
        <div
          className={`text-center mb-16 transition-all duration-1000 transform ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
          }`}
        >
          <p className="text-green-600 dark:text-green-400 text-sm tracking-widest uppercase mb-4 font-medium">
            生活态度
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white">
            我的人生关键词
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {attitudes.map((item, index) => (
            <div
              key={item.word}
              className={`group text-center p-8 rounded-2xl transition-all duration-700 transform ${
                isVisible
                  ? 'opacity-100 translate-y-0'
                  : 'opacity-0 translate-y-12'
              }`}
              style={{ transitionDelay: `${index * 150}ms` }}
            >
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gray-50 dark:bg-gray-900 flex items-center justify-center border border-gray-200 dark:border-gray-800 group-hover:border-green-500/50 group-hover:bg-green-50 dark:group-hover:bg-green-950/30 transition-all duration-300">
                <span className="text-2xl font-bold text-gray-900 dark:text-white group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors">
                  {index + 1}
                </span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3 group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors">
                {item.word}
              </h3>
              <p className="text-gray-500 dark:text-gray-400 text-sm">
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
      type: 'ability'
    }))
    abilityList.sort((a, b) => b.count - a.count)
    setAbilities(abilityList)
  }, [])

  const getSize = (count: number, maxCount: number) => {
    const minSize = 0.875
    const maxSize = 2.25
    const ratio = maxCount > 1 ? (count - 1) / (maxCount - 1) : 0
    return minSize + ratio * (maxSize - minSize)
  }

  const maxCount = abilities.length > 0 ? Math.max(...abilities.map(k => k.count)) : 0

  return (
    <section
      id="ability-cloud"
      className="py-24 sm:py-32 px-6 bg-gray-50 dark:bg-gray-950"
    >
      <div className="max-w-5xl mx-auto">
        <div
          className={`text-center mb-16 transition-all duration-1000 transform ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
          }`}
        >
          <p className="text-green-600 dark:text-green-400 text-sm tracking-widest uppercase mb-4 font-medium">
            内在特质
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            能力云图
          </h2>
          <p className="text-gray-500 dark:text-gray-400">
            我的软技能特质
          </p>
        </div>

        <div
          className={`relative transition-all duration-1000 transform ${
            isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
          }`}
        >
          <div className="bg-white dark:bg-gray-900 rounded-3xl p-8 sm:p-12 shadow-sm border border-gray-200 dark:border-gray-800">
            <div className="flex flex-wrap justify-center items-center gap-3 sm:gap-4">
              {abilities.map((ability, index) => {
                const size = getSize(ability.count, maxCount)
                return (
                  <span
                    key={ability.name}
                    className="px-4 sm:px-6 py-2.5 sm:py-3 rounded-full text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-800 cursor-default select-none"
                    style={{
                      fontSize: `${size}rem`,
                      transitionDelay: `${index * 50}ms`
                    }}
                  >
                    {ability.name}
                  </span>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function ExploreDirectionsSection() {
  const isVisible = useScrollAnimation('explore')
  const directions = [
    {
      title: '前端开发',
      desc: 'React、Vue、现代Web技术',
      icon: '🎨'
    },
    {
      title: '后端架构',
      desc: 'Node.js、Go、系统设计',
      icon: '⚙️'
    },
    {
      title: '人工智能',
      desc: '机器学习、深度学习应用',
      icon: '🤖'
    },
    {
      title: '产品设计',
      desc: '用户体验、产品思维',
      icon: '✨'
    }
  ]

  return (
    <section
      id="explore"
      className="py-24 sm:py-32 px-6 bg-white dark:bg-black"
    >
      <div className="max-w-6xl mx-auto">
        <div
          className={`text-center mb-16 transition-all duration-1000 transform ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
          }`}
        >
          <p className="text-green-600 dark:text-green-400 text-sm tracking-widest uppercase mb-4 font-medium">
            探索方向
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white">
            我在做什么
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8">
          {directions.map((item, index) => (
            <div
              key={item.title}
              className={`group transition-all duration-700 transform ${
                isVisible
                  ? 'opacity-100 translate-y-0'
                  : 'opacity-0 translate-y-12'
              }`}
              style={{ transitionDelay: `${index * 150}ms` }}
            >
              <div className="relative h-48 sm:h-56 rounded-2xl overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 border border-gray-200 dark:border-gray-800 group-hover:border-green-500/50 transition-all duration-300">
                <div className="absolute inset-0 flex flex-col items-center justify-center p-8">
                  <span className="text-4xl sm:text-5xl mb-4 group-hover:scale-110 transition-transform duration-300">
                    {item.icon}
                  </span>
                  <h3 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-2">
                    {item.title}
                  </h3>
                  <p className="text-gray-500 dark:text-gray-400 text-sm">
                    {item.desc}
                  </p>
                </div>
              </div>
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
      type: 'skill'
    }))
    skillList.sort((a, b) => b.count - a.count)
    setSkills(skillList)
  }, [])

  const getSize = (count: number, maxCount: number) => {
    const minSize = 0.875
    const maxSize = 2.5
    const ratio = maxCount > 1 ? (count - 1) / (maxCount - 1) : 0
    return minSize + ratio * (maxSize - minSize)
  }

  const maxCount = skills.length > 0 ? Math.max(...skills.map(k => k.count)) : 0

  return (
    <section
      id="skill-cloud"
      className="py-24 sm:py-32 px-6 bg-gray-50 dark:bg-gray-950"
    >
      <div className="max-w-6xl mx-auto">
        <div
          className={`text-center mb-16 transition-all duration-1000 transform ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
          }`}
        >
          <p className="text-green-600 dark:text-green-400 text-sm tracking-widest uppercase mb-4 font-medium">
            技术栈
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            技能云图
          </h2>
          <p className="text-gray-500 dark:text-gray-400">
            我掌握的技术
          </p>
        </div>

        <div
          className={`transition-all duration-1000 transform ${
            isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
          }`}
        >
          <div className="bg-white dark:bg-gray-900 rounded-3xl p-8 sm:p-12 shadow-sm border border-gray-200 dark:border-gray-800">
            <div className="flex flex-wrap justify-center items-center gap-3 sm:gap-4">
              {skills.map((skill, index) => {
                const size = getSize(skill.count, maxCount)
                return (
                  <span
                    key={skill.name}
                    className="px-4 sm:px-6 py-2.5 sm:py-3 rounded-full bg-gradient-to-r from-green-500/10 to-emerald-500/10 dark:from-green-900/20 dark:to-emerald-900/20 border border-green-500/20 dark:border-green-500/30 text-green-700 dark:text-green-400 cursor-default select-none"
                    style={{
                      fontSize: `${size}rem`,
                      transitionDelay: `${index * 40}ms`
                    }}
                  >
                    {skill.name}
                  </span>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function KnowledgeGraphSection() {
  const isVisible = useScrollAnimation('graph')

  return (
    <section
      id="graph"
      className="py-24 sm:py-32 px-6 bg-white dark:bg-black"
    >
      <div className="max-w-6xl mx-auto">
        <div
          className={`text-center mb-12 transition-all duration-1000 transform ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
          }`}
        >
          <p className="text-green-600 dark:text-green-400 text-sm tracking-widest uppercase mb-4 font-medium">
            知识网络
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            知识图谱
          </h2>
          <p className="text-gray-500 dark:text-gray-400 max-w-lg mx-auto">
            点击节点查看项目详情
          </p>
        </div>

        <div
          className={`transition-all duration-1000 transform ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
          }`}
        >
          <div className="bg-gray-50 dark:bg-gray-900 rounded-3xl overflow-hidden border border-gray-200 dark:border-gray-800">
            <KnowledgeGraph height={580} />
          </div>
        </div>
      </div>
    </section>
  )
}

function ContactSection() {
  const isVisible = useScrollAnimation('contact')

  return (
    <section
      id="contact"
      className="py-24 sm:py-32 px-6 bg-gray-50 dark:bg-gray-950"
    >
      <div className="max-w-4xl mx-auto text-center">
        <div
          className={`transition-all duration-1000 transform ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
          }`}
        >
          <p className="text-green-600 dark:text-green-400 text-sm tracking-widest uppercase mb-4 font-medium">
            联系方式
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-8">
            联系我
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            <a
              href={`mailto:${config.email}`}
              className="group p-6 rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 hover:border-green-500/50 transition-all duration-300"
            >
              <div className="text-3xl mb-4">📧</div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Email</p>
              <p className="text-gray-900 dark:text-white font-medium group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors">
                {config.email}
              </p>
            </a>

            <a
              href={config.github}
              target="_blank"
              rel="noopener noreferrer"
              className="group p-6 rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 hover:border-green-500/50 transition-all duration-300"
            >
              <div className="text-3xl mb-4">🐙</div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">GitHub</p>
              <p className="text-gray-900 dark:text-white font-medium group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors">
                {config.github.split('/').pop()}
              </p>
            </a>

            <div className="group p-6 rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 hover:border-green-500/50 transition-all duration-300">
              <div className="text-3xl mb-4">📱</div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Phone</p>
              <p className="text-gray-900 dark:text-white font-medium group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors">
                {config.phone}
              </p>
            </div>

            <div className="group p-6 rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 hover:border-green-500/50 transition-all duration-300">
              <div className="text-3xl mb-4">💬</div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">WeChat</p>
              <p className="text-gray-900 dark:text-white font-medium group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors">
                {config.wechat}
              </p>
            </div>
          </div>

          <p className="text-gray-400 dark:text-gray-500 text-sm">
            期待与你合作 🤝
          </p>
        </div>
      </div>
    </section>
  )
}

export default function Home() {
  return (
    <div className="min-h-screen bg-white dark:bg-black overflow-x-hidden">
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
