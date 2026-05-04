import matter from 'gray-matter'
import { Project, Experience } from '@/types'

const projectFiles = import.meta.glob('/src/data/projects/*.md', {
  query: '?raw',
  import: 'default',
  eager: true
})

const experienceFiles = import.meta.glob('/src/data/experiences/*.md', {
  query: '?raw',
  import: 'default',
  eager: true
})

export function parseProject(markdown: string): Project {
  const { data, content } = matter(markdown)
  return {
    id: data.id || '',
    title: data.title || '',
    description: data.description || '',
    tags: data.tags || [],
    link: data.link,
    image: data.image,
    date: data.date || '',
    status: data.status || 'completed',
    content: content
  }
}

export function parseExperience(markdown: string): Experience {
  const { data, content } = matter(markdown)
  return {
    id: data.id || '',
    company: data.company || '',
    role: data.role || '',
    period: data.period || '',
    description: data.description || '',
    tags: data.tags || [],
    location: data.location,
    content: content
  }
}

export function getAllProjects(): Project[] {
  return Object.values(projectFiles)
    .map((content) => parseProject(content as string))
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
}

export function getAllExperiences(): Experience[] {
  return Object.values(experienceFiles)
    .map((content) => parseExperience(content as string))
}

export function getProjectById(id: string): Project | undefined {
  return getAllProjects().find(p => p.id === id)
}

export function getExperienceById(id: string): Experience | undefined {
  return getAllExperiences().find(e => e.id === id)
}
