import { useEffect, useState } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import { Project, Experience } from '@/types'
import { getAllProjects, getAllExperiences } from '@/utils/markdownParser'

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

function ProjectCard({ project }: { project: Project }) {
  return (
    <Link
      to={`/project/${project.id}`}
      className="group block"
    >
      <div className="bg-white dark:bg-gray-900 rounded-2xl p-8 border-2 border-gray-200 dark:border-gray-800 hover:border-green-500 dark:hover:border-green-600 transition-all duration-300 hover:shadow-xl hover:shadow-green-500/10">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{project.title}</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">{project.date}</p>
          </div>
          <div className="px-3 py-1 bg-gray-100 dark:bg-gray-800 rounded-full text-xs font-medium text-gray-600 dark:text-gray-300">
            {project.status}
          </div>
        </div>

        <p className="text-gray-600 dark:text-gray-400 mb-6 leading-relaxed">{project.description}</p>

        <div className="flex flex-wrap gap-2 mb-3">
          {project.skillTags.map((tag) => (
            <span
              key={tag}
              className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 text-xs font-medium rounded-full"
            >
              {tag}
            </span>
          ))}
        </div>

        <div className="flex flex-wrap gap-2">
          {project.abilityTags.map((tag) => (
            <span
              key={tag}
              className="px-3 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 text-xs font-medium rounded-full"
            >
              {tag}
            </span>
          ))}
        </div>

        {project.link && (
          <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-80">
            <div className="flex items-center gap-2 text-green-600 dark:text-green-500 text-sm font-medium">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
              查看项目
            </div>
          </div>
        )}
      </div>
    </Link>
  )
}

function TimelineItem({ experience }: { experience: Experience }) {
  return (
    <Link
      to={`/experience/${experience.id}`}
      className="group block"
    >
      <div className="bg-white dark:bg-gray-900 rounded-2xl p-8 border-2 border-gray-200 dark:border-gray-800 hover:border-green-500 dark:hover:border-green-600 transition-all duration-300 hover:shadow-xl hover:shadow-green-500/10">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1">{experience.company}</h3>
            <p className="text-green-600 dark:text-green-500 font-medium">{experience.role}</p>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">{experience.period}</p>
        </div>

        {experience.location && (
          <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-4">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            {experience.location}
          </div>
        )}

        <p className="text-gray-600 dark:text-gray-400 mb-6 leading-relaxed">{experience.description}</p>

        <div className="flex flex-wrap gap-2 mb-3">
          {experience.skillTags.map((tag) => (
            <span
              key={tag}
              className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 text-xs font-medium rounded-full"
            >
              {tag}
            </span>
          ))}
        </div>

        <div className="flex flex-wrap gap-2">
          {experience.abilityTags.map((tag) => (
            <span
              key={tag}
              className="px-3 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 text-xs font-medium rounded-full"
            >
              {tag}
            </span>
          ))}
        </div>

        <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-80">
          <div className="flex items-center gap-2 text-green-600 dark:text-green-500 text-sm font-medium">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
            查看详情
          </div>
        </div>
      </div>
    </Link>
  )
}

export default function SkillDetail() {
  const { label } = useParams<{ label: string }>()
  const navigate = useNavigate()
  const [relatedProjects, setRelatedProjects] = useState<Project[]>([])
  const [relatedExperiences, setRelatedExperiences] = useState<Experience[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!label) {
      navigate('/')
      return
    }

    const projects = getAllProjects()
    const experiences = getAllExperiences()

    const filteredProjects = projects.filter(project => 
      project.skillTags.includes(label) || project.abilityTags.includes(label)
    )

    const filteredExperiences = experiences.filter(experience => 
      experience.skillTags.includes(label) || experience.abilityTags.includes(label)
    )

    setRelatedProjects(filteredProjects)
    setRelatedExperiences(filteredExperiences)
    setIsLoading(false)
  }, [label, navigate])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-950 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-gray-200 dark:border-gray-800 border-t-green-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-500 dark:text-gray-400">加载中...</p>
        </div>
      </div>
    )
  }

  const hasData = relatedProjects.length > 0 || relatedExperiences.length > 0

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 text-gray-900 dark:text-white">
      <div className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-gray-950/80 backdrop-blur-xl border-b border-gray-200 dark:border-gray-80">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-green-600 dark:hover:text-green-500 transition-colors font-medium">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            返回首页
          </Link>
          <div className="text-xl font-bold bg-gradient-to-r from-green-600 to-green-500 bg-clip-text text-transparent">
            {label}
          </div>
          <div className="w-24"></div>
        </div>
      </div>

      <div className="pt-24">
        {hasData ? (
          <>
            {relatedProjects.length > 0 && (
              <Section id="projects" title="相关项目" isLight={false}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {relatedProjects.map((project) => (
                    <ProjectCard key={project.id} project={project} />
                  ))}
                </div>
              </Section>
            )}

            {relatedExperiences.length > 0 && (
              <Section id="experience" title="相关经历" isLight={true}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {relatedExperiences.map((experience) => (
                    <TimelineItem key={experience.id} experience={experience} />
                  ))}
                </div>
              </Section>
            )}
          </>
        ) : (
          <div className="min-h-[60vh] flex items-center justify-center">
            <div className="text-center">
              <div className="w-16 h-16 bg-gray-100 dark:bg-gray-80 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">暂无相关内容</h3>
              <p className="text-gray-500 dark:text-gray-400">还没有使用技能「{label}」的项目或经历</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
