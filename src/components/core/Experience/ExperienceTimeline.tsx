import { useEffect, useState } from 'react'
import { Experience } from '@/types'
import { getAllExperiences } from '@/utils/markdownParser'
import { TimelineItem } from './TimelineItem'

interface ExperienceTimelineProps {
  highlightedIds?: string[]
  filterKeyword?: string | null
}

export function ExperienceTimeline({ highlightedIds = [], filterKeyword = null }: ExperienceTimelineProps) {
  const [experiences, setExperiences] = useState<Experience[]>([])
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const loadedExperiences = getAllExperiences()
    setExperiences(loadedExperiences)
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

    const element = document.getElementById('experience')
    if (element) {
      observer.observe(element)
    }

    return () => {
      if (element) {
        observer.unobserve(element)
      }
    }
  }, [])

  const filteredExperiences = filterKeyword
    ? experiences.filter(exp =>
        exp.tags.some(tag => tag.toLowerCase().includes(filterKeyword.toLowerCase())) ||
        exp.role.toLowerCase().includes(filterKeyword.toLowerCase()) ||
        exp.company.toLowerCase().includes(filterKeyword.toLowerCase())
      )
    : experiences

  return (
    <div className="relative">
      {filteredExperiences.map((experience, index) => (
        <div
          key={experience.id}
          className={`transition-all duration-700 ${
            isVisible
              ? 'opacity-100 translate-x-0'
              : 'opacity-0 -translate-x-10'
          }`}
          style={{ transitionDelay: `${index * 150}ms` }}
        >
          <TimelineItem
            experience={experience}
            isLast={index === filteredExperiences.length - 1}
            isHighlighted={highlightedIds.includes(experience.id)}
          />
        </div>
      ))}
    </div>
  )
}
