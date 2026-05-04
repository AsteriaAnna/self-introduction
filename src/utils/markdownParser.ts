import { Project, Experience } from '@/types'
import { logger } from '@utils/logger'

const projectFiles = import.meta.glob('/src/data/projects/*.md', {
  query: '?raw',
  import: 'default',
  eager: true
}) as Record<string, string>

const experienceFiles = import.meta.glob('/src/data/experiences/*.md', {
  query: '?raw',
  import: 'default',
  eager: true
}) as Record<string, string>

function parseFrontMatter(content: string): { data: Record<string, unknown>; content: string } {
  const frontMatterRegex = /^---\s*\n([\s\S]*?)\n---\s*\n?([\s\S]*)$/
  const match = content.match(frontMatterRegex)

  if (!match) {
    return { data: {}, content }
  }

  const [, frontMatter, rest] = match
  const data: Record<string, unknown> = {}

  frontMatter.split('\n').forEach(line => {
    const colonIndex = line.indexOf(':')
    if (colonIndex > 0) {
      const key = line.slice(0, colonIndex).trim()
      let value: string | string[] = line.slice(colonIndex + 1).trim()

      if (value.startsWith('[') && value.endsWith(']')) {
        value = value.slice(1, -1).split(',').map(v => v.trim().replace(/['"]/g, ''))
      }

      data[key] = value
    }
  })

  return { data, content: rest?.trim() || '' }
}

export function parseProject(markdown: string): Project {
  const { data, content } = parseFrontMatter(markdown)
  return {
    id: String(data.id || ''),
    title: String(data.title || ''),
    description: String(data.description || ''),
    skillTags: Array.isArray(data.skillTags) ? data.skillTags : (Array.isArray(data.tags) ? data.tags : []),
    abilityTags: Array.isArray(data.abilityTags) ? data.abilityTags : [],
    link: data.link ? String(data.link) : undefined,
    image: data.image ? String(data.image) : undefined,
    date: String(data.date || ''),
    status: (data.status as Project['status']) || 'completed',
    content: content
  }
}

export function parseExperience(markdown: string): Experience {
  const { data, content } = parseFrontMatter(markdown)
  return {
    id: String(data.id || ''),
    company: String(data.company || ''),
    role: String(data.role || ''),
    period: String(data.period || ''),
    description: String(data.description || ''),
    skillTags: Array.isArray(data.skillTags) ? data.skillTags : (Array.isArray(data.tags) ? data.tags : []),
    abilityTags: Array.isArray(data.abilityTags) ? data.abilityTags : [],
    location: data.location ? String(data.location) : undefined,
    content: content
  }
}

export function getAllProjects(): Project[] {
  try {
    return Object.values(projectFiles)
      .map((content) => {
        try {
          return parseProject(content as string)
        } catch (err) {
          logger.error('Failed to parse project', 'MarkdownParser', undefined, err as Error)
          return null
        }
      })
      .filter((p): p is Project => p !== null)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  } catch (err) {
    logger.error('Failed to load projects', 'MarkdownParser', undefined, err as Error)
    return []
  }
}

export function getAllExperiences(): Experience[] {
  try {
    return Object.values(experienceFiles)
      .map((content) => {
        try {
          return parseExperience(content as string)
        } catch (err) {
          logger.error('Failed to parse experience', 'MarkdownParser', undefined, err as Error)
          return null
        }
      })
      .filter((e): e is Experience => e !== null)
  } catch (err) {
    logger.error('Failed to load experiences', 'MarkdownParser', undefined, err as Error)
    return []
  }
}

export function getProjectById(id: string): Project | undefined {
  return getAllProjects().find(p => p.id === id)
}

export function getExperienceById(id: string): Experience | undefined {
  return getAllExperiences().find(e => e.id === id)
}
