import { useEffect, useState } from 'react'
import { Project } from '@/types'
import { getAllProjects } from '@/utils/markdownParser'
import { ProjectCard } from './ProjectCard'

interface ProjectListProps {
  highlightedIds?: string[]
  filterKeyword?: string | null
}

export function ProjectList({ highlightedIds = [], filterKeyword = null }: ProjectListProps) {
  const [projects, setProjects] = useState<Project[]>([])
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const loadedProjects = getAllProjects()
    setProjects(loadedProjects)
  }, [])

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.1 }
    )

    const element = document.getElementById('projects')
    if (element) {
      observer.observe(element)
    }

    return () => {
      if (element) {
        observer.unobserve(element)
      }
    }
  }, [])

  const filteredProjects = filterKeyword
    ? projects.filter(p => p.tags.some(tag => tag.toLowerCase().includes(filterKeyword.toLowerCase())))
    : projects

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {filteredProjects.map((project, index) => (
        <div
          key={project.id}
          className={`transition-all duration-700 ease-out ${
            isVisible
              ? 'opacity-100 translate-y-0 translate-x-0'
              : 'opacity-0 translate-y-8 translate-x-4'
          }`}
          style={{ transitionDelay: `${index * 100}ms` }}
        >
          <ProjectCard
            project={project}
            isHighlighted={highlightedIds.includes(project.id)}
          />
        </div>
      ))}
    </div>
  )
}
