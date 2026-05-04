import { Project, Experience } from '@/types'
import { getAllProjects, getAllExperiences } from './markdownParser'

const SKILL_KEYWORDS = [
  'React', 'Vue', 'Angular', 'Node.js', 'Python', 'Java', 'Go', 'TypeScript',
  'JavaScript', 'CSS', 'HTML', 'Sass', 'Less', 'Tailwind CSS', 'Bootstrap',
  'React', 'Vue.js', 'Next.js', 'Nuxt.js', 'Express', 'Koa', 'FastAPI', 'Django', 'Flask',
  'MongoDB', 'MySQL', 'PostgreSQL', 'Redis', 'Elasticsearch', 'SQLite',
  'Docker', 'Kubernetes', 'AWS', 'Azure', 'GCP', 'Vercel', 'Netlify',
  'Git', 'GitHub', 'GitLab', 'CI/CD', 'Jenkins', 'Travis CI',
  'GraphQL', 'REST API', 'WebSocket', 'Socket.io',
  'Webpack', 'Vite', 'Rollup', 'Babel', 'ESLint', 'Prettier',
  'D3.js', 'ECharts', 'AntV', 'Three.js', 'Canvas', 'SVG',
  'React Native', 'Flutter', 'uni-app', 'Electron', 'Tauri',
  'Webpack', 'Gulp', 'Grunt', 'npm', 'yarn', 'pnpm',
  'TypeScript', 'JavaScript', 'Python', 'Java', 'Go', 'Rust', 'C++', 'C#',
  'Linux', 'Nginx', 'Apache', 'Tomcat', 'Shell',
  'Machine Learning', 'Deep Learning', 'TensorFlow', 'PyTorch', 'OpenCV',
  'Agile', 'Scrum', 'Kanban', 'Jira', 'Confluence'
]

const STOP_WORDS = new Set([
  '的', '了', '和', '是', '在', '我', '有', '个', '人', '这', '中', '大', '为',
  '与', '到', '说', '们', '要', '会', '去', '你', '好', '对', '事', '也', '时',
  '就', '看', '没', '他', '那', '它', '她', '吗', '呢', '吧', '啊', '哦', '嗯',
  'the', 'a', 'an', 'is', 'are', 'was', 'were', 'be', 'been', 'being',
  'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could',
  'should', 'may', 'might', 'must', 'can', 'to', 'of', 'in', 'for',
  'on', 'with', 'at', 'by', 'from', 'as', 'into', 'through', 'during',
  'and', 'or', 'but', 'if', 'because', 'while', 'although', 'that',
  'this', 'these', 'those', 'it', 'its'
])

export function extractKeywords(text: string): string[] {
  const words = text
    .toLowerCase()
    .replace(/[^\w\s\u4e00-\u9fa5]/g, ' ')
    .split(/\s+/)
    .filter(word => word.length > 1)
    .filter(word => !STOP_WORDS.has(word))

  const matchedSkills = new Set<string>()

  words.forEach(word => {
    const exactMatch = SKILL_KEYWORDS.find(
      skill => skill.toLowerCase() === word
    )
    if (exactMatch) {
      matchedSkills.add(exactMatch)
    }

    const partialMatch = SKILL_KEYWORDS.find(
      skill => skill.toLowerCase().includes(word) ||
               word.includes(skill.toLowerCase())
    )
    if (partialMatch) {
      matchedSkills.add(partialMatch)
    }
  })

  return Array.from(matchedSkills)
}

export function matchProjects(jdKeywords: string[], projects: Project[]): {
  matchedProjects: Project[]
  matchScores: Map<string, number>
} {
  const matchedProjects: Project[] = []
  const matchScores = new Map<string, number>()

  projects.forEach(project => {
    const projectTags = project.tags.map(tag => tag.toLowerCase())
    const matchedCount = jdKeywords.filter(keyword =>
      projectTags.some(tag => tag.includes(keyword.toLowerCase()))
    ).length

    if (matchedCount > 0) {
      const score = (matchedCount / jdKeywords.length) * 100
      matchScores.set(project.id, score)
      matchedProjects.push(project)
    }
  })

  matchedProjects.sort((a, b) =>
    (matchScores.get(b.id) || 0) - (matchScores.get(a.id) || 0)
  )

  return { matchedProjects, matchScores }
}

export function matchExperiences(jdKeywords: string[], experiences: Experience[]): {
  matchedExperiences: Experience[]
  matchScores: Map<string, number>
} {
  const matchedExperiences: Experience[] = []
  const matchScores = new Map<string, number>()

  experiences.forEach(exp => {
    const expTags = exp.tags.map(tag => tag.toLowerCase())
    const roleAndCompany = `${exp.role} ${exp.company}`.toLowerCase()

    const matchedFromTags = jdKeywords.filter(keyword =>
      expTags.some(tag => tag.includes(keyword.toLowerCase()))
    ).length

    const matchedFromRole = jdKeywords.filter(keyword =>
      roleAndCompany.includes(keyword.toLowerCase())
    ).length

    const matchedCount = matchedFromTags + matchedFromRole

    if (matchedCount > 0) {
      const score = Math.min((matchedCount / jdKeywords.length) * 100, 100)
      matchScores.set(exp.id, score)
      matchedExperiences.push(exp)
    }
  })

  matchedExperiences.sort((a, b) =>
    (matchScores.get(b.id) || 0) - (matchScores.get(a.id) || 0)
  )

  return { matchedExperiences, matchScores }
}

export function calculateOverallMatchScore(
  projectScore: number,
  experienceScore: number,
  hasProjects: boolean,
  hasExperiences: boolean
): number {
  if (!hasProjects && !hasExperiences) return 0
  if (!hasProjects) return experienceScore
  if (!hasExperiences) return projectScore
  return Math.round((projectScore + experienceScore) / 2)
}
