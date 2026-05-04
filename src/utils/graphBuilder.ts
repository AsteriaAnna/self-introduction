import { GraphNode, GraphEdge } from '@/types'
import { getAllProjects, getAllExperiences } from './markdownParser'

export function buildGraphData(): { nodes: GraphNode[]; edges: GraphEdge[] } {
  const projects = getAllProjects()
  const experiences = getAllExperiences()

  const nodes: GraphNode[] = []
  const edges: GraphEdge[] = []
  const nodeIds = new Set<string>()
  const tagCounts = new Map<string, number>()

  projects.forEach(project => {
    const projectId = `project-${project.id}`
    if (!nodeIds.has(projectId)) {
      nodeIds.add(projectId)
      nodes.push({
        id: projectId,
        label: project.title,
        type: 'project',
        weight: project.tags.length,
        originalId: project.id
      })
    }

    project.tags.forEach(tag => {
      tagCounts.set(tag, (tagCounts.get(tag) || 0) + 1)

      const tagId = `skill-${tag}`
      if (!nodeIds.has(tagId)) {
        nodeIds.add(tagId)
        nodes.push({
          id: tagId,
          label: tag,
          type: 'skill',
          weight: 1,
          originalId: tag
        })
      }

      edges.push({
        source: projectId,
        target: tagId,
        weight: 1
      })
    })
  })

  experiences.forEach(exp => {
    const expId = `experience-${exp.id}`
    if (!nodeIds.has(expId)) {
      nodeIds.add(expId)
      nodes.push({
        id: expId,
        label: `${exp.role}@${exp.company}`,
        type: 'experience',
        weight: exp.tags.length,
        originalId: exp.id
      })
    }

    exp.tags.forEach(tag => {
      tagCounts.set(tag, (tagCounts.get(tag) || 0) + 1)

      const tagId = `skill-${tag}`
      if (!nodeIds.has(tagId)) {
        nodeIds.add(tagId)
        nodes.push({
          id: tagId,
          label: tag,
          type: 'skill',
          weight: 1,
          originalId: tag
        })
      }

      edges.push({
        source: expId,
        target: tagId,
        weight: 1
      })
    })
  })

  nodes.forEach(node => {
    if (node.type === 'skill') {
      node.weight = tagCounts.get(node.label) || 1
    }
  })

  return { nodes, edges }
}

export function getNodeColor(type: string, isDark: boolean): string {
  const colors: Record<string, { light: string; dark: string }> = {
    skill: { light: '#3b82f6', dark: '#60a5fa' },
    project: { light: '#22c55e', dark: '#4ade80' },
    experience: { light: '#f59e0b', dark: '#fbbf24' }
  }
  return colors[type]?.[isDark ? 'dark' : 'light'] || '#6b7280'
}

export function getNodeSize(weight: number): number {
  const minSize = 12
  const maxSize = 30
  return Math.min(maxSize, Math.max(minSize, minSize + weight * 2))
}
