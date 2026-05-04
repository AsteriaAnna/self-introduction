import { useEffect, useState } from 'react'
import { Experience } from '@/types'
import { getAllExperiences } from '@/utils/markdownParser'
import { TimelineItem } from './TimelineItem'

interface ExperienceTimelineProps {
  filterKeywords?: string[]
  highlightedIds?: string[]
}

export function ExperienceTimeline({ filterKeywords = [], highlightedIds = [] }: ExperienceTimelineProps) {
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

  const filteredExperiences = filterKeywords.length > 0
    ? experiences.filter(exp =>
        filterKeywords.some(keyword =>
          exp.tags.some(tag => tag.toLowerCase().includes(keyword.toLowerCase())) ||
          exp.role.toLowerCase().includes(keyword.toLowerCase()) ||
          exp.company.toLowerCase().includes(keyword.toLowerCase())
        )
      )
    : experiences

  if (filteredExperiences.length === 0 && filterKeywords.length > 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 dark:text-gray-400 text-lg">
          没有找到匹配的经历
        </p>
      </div>
    )
  }

  return (
    <div className="relative">
      {filteredExperiences.map((experience, index) => (
        <div
          key={experience.id}
          className={`transition-all duration-700 ease-out ${
            isVisible
              ? 'opacity-100 translate-x-0 translate-y-0'
              : 'opacity-0 -translate-x-12 translate-y-8'
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
