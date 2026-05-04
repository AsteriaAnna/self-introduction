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

function parseFrontMatter(content: string): { data: Record<string, any>; content: string } {
  const frontMatterRegex = /^---\s*\n([\s\S]*?)\n---\s*\n([\s\S]*)$/
  const match = content.match(frontMatterRegex)

  if (!match) {
    return { data: {}, content }
  }

  const [, frontMatter, rest] = match
  const data: Record<string, any> = {}

  frontMatter.split('\n').forEach(line => {
    const colonIndex = line.indexOf(':')
    if (colonIndex > 0) {
      const key = line.slice(0, colonIndex).trim()
      let value = line.slice(colonIndex + 1).trim()

      if (value.startsWith('[') && value.endsWith(']')) {
        value = value.slice(1, -1).split(',').map(v => v.trim().replace(/['"]/g, ''))
      }

      data[key] = value
    }
  })

  return { data, content: rest }
}

export function parseProject(markdown: string): Project {
  const { data, content } = parseFrontMatter(markdown)
  return {
    id: data.id || '',
    title: data.title || '',
    description: data.description || '',
    tags: Array.isArray(data.tags) ? data.tags : [],
    link: data.link,
    image: data.image,
    date: data.date || '',
    status: data.status || 'completed',
    content: content
  }
}

export function parseExperience(markdown: string): Experience {
  const { data, content } = parseFrontMatter(markdown)
  return {
    id: data.id || '',
    company: data.company || '',
    role: data.role || '',
    period: data.period || '',
    description: data.description || '',
    tags: Array.isArray(data.tags) ? data.tags : [],
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
