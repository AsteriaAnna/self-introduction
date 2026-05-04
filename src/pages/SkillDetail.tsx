import { useEffect, useState } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import { Project, Experience } from '@/types'
import { getAllProjects, getAllExperiences } from '@/utils/markdownParser'
import { Navbar } from '@components/common/Layout'
import { useTheme } from '@components/extensions/Theme'
import { useLanguage } from '@components/extensions/Language'

function ProjectItem({ project }: { project: Project }) {
  const { theme } = useTheme()
  
  return (
    <Link
      to={`/project/${project.id}`}
      className="group block py-8 border-b border-gray-200/50 dark:border-gray-800/50 last:border-b-0"
    >
      <div className="flex items-baseline justify-between mb-2">
        <h3 className="text-lg font-light text-gray-900 dark:text-white group-hover:text-gray-600 dark:hover:text-gray-300 transition-colors">
          {project.title}
        </h3>
        <span className={`text-xs ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>
          {project.date}
        </span>
      </div>
      <p className={`text-sm leading-loose mb-4 ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>
        {project.description}
      </p>
      <div className="flex flex-wrap gap-2">
        {project.skillTags.map((tag) => (
          <span
            key={tag}
            className={`text-xs ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}
          >
            {tag}
          </span>
        ))}
      </div>
    </Link>
  )
}

function ExperienceItem({ experience }: { experience: Experience }) {
  const { theme } = useTheme()
  
  return (
    <Link
      to={`/experience/${experience.id}`}
      className="group block py-8 border-b border-gray-200/50 dark:border-gray-800/50 last:border-b-0"
    >
      <div className="flex items-baseline justify-between mb-2">
        <h3 className="text-lg font-light text-gray-900 dark:text-white group-hover:text-gray-600 dark:hover:text-gray-300 transition-colors">
          {experience.company}
        </h3>
        <span className={`text-xs ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>
          {experience.period}
        </span>
      </div>
      <p className={`text-sm mb-2 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
        {experience.role}
      </p>
      <p className={`text-sm leading-loose mb-4 ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>
        {experience.description}
      </p>
      <div className="flex flex-wrap gap-2">
        {experience.skillTags.map((tag) => (
          <span
            key={tag}
            className={`text-xs ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}
          >
            {tag}
          </span>
        ))}
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
  const { theme } = useTheme()
  const { t } = useLanguage()

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

    const filteredExperiences = experiences.filter(exp => 
      exp.skillTags.includes(label) || exp.abilityTags.includes(label)
    )

    setRelatedProjects(filteredProjects)
    setRelatedExperiences(filteredExperiences)
    setIsLoading(false)
  }, [label, navigate])

  if (isLoading) {
    return (
      <div className={`min-h-screen ${theme === 'dark' ? 'bg-gray-950' : 'bg-white'}`}>
        <Navbar />
        <div className={`text-center py-32 ${theme === 'dark' ? 'text-gray-600' : 'text-gray-400'} text-sm tracking-wide`}>
          {t('loading')}
        </div>
      </div>
    )
  }

  const hasData = relatedProjects.length > 0 || relatedExperiences.length > 0

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-gray-950' : 'bg-white'}`}>
      <Navbar />

      <div className="pt-32 pb-20 max-w-3xl mx-auto px-6">
        <Link
          to="/"
          className="inline-flex items-center gap-3 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 mb-16 text-sm tracking-wide transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M15 19l-7-7 7-7" />
          </svg>
          {t('nav.back')}
        </Link>

        <header className="mb-16">
          <h1 className="text-3xl sm:text-4xl font-light tracking-tight text-gray-900 dark:text-white mb-4">
            {label}
          </h1>
          <p className={`text-sm ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>
            {hasData 
              ? `${relatedProjects.length + relatedExperiences.length} ${t('related.items')}`
              : t('no.content')}
          </p>
        </header>

        {hasData ? (
          <>
            {relatedProjects.length > 0 && (
              <section className="mb-12">
                <h2 className={`text-xs tracking-[0.3em] uppercase mb-8 ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>
                  {t('skill.detail.projects')}
                </h2>
                <div>
                  {relatedProjects.map((project) => (
                    <ProjectItem key={project.id} project={project} />
                  ))}
                </div>
              </section>
            )}

            {relatedExperiences.length > 0 && (
              <section>
                <h2 className={`text-xs tracking-[0.3em] uppercase mb-8 ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>
                  {t('skill.detail.experience')}
                </h2>
                <div>
                  {relatedExperiences.map((experience) => (
                    <ExperienceItem key={experience.id} experience={experience} />
                  ))}
                </div>
              </section>
            )}
          </>
        ) : (
          <div className="text-center py-20">
            <p className={`text-sm ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>
              {t('no.content')}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
