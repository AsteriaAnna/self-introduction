import { useEffect, useRef, useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import * as d3 from 'd3'
import { GraphNode, GraphEdge } from '@/types'
import { buildGraphData, getNodeColor, getNodeSize } from '@/utils/graphBuilder'

interface TooltipData {
  x: number
  y: number
  node: GraphNode | null
}

interface KnowledgeGraphProps {
  isPreview?: boolean
  highlightedLabels?: string[]
  height?: number
}

export function KnowledgeGraph({ isPreview = false, highlightedLabels = ['React', 'TypeScript', 'Node.js', '个人展示', '二手交易', '技术主管', '团队协作', '学习能力'], height = 600 }: KnowledgeGraphProps) {
  const svgRef = useRef<SVGSVGElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [tooltip, setTooltip] = useState<TooltipData>({ x: 0, y: 0, node: null })
  const [isDark, setIsDark] = useState(true)
  const [graphData, setGraphData] = useState<{ nodes: GraphNode[]; edges: GraphEdge[] } | null>(null)
  const navigate = useNavigate()
  const simulationRef = useRef<d3.Simulation<GraphNode, GraphEdge> | null>(null)

  useEffect(() => {
    try {
      const data = buildGraphData()
      setGraphData(data)
    } catch (err) {
      console.error('Failed to build graph data:', err)
    }
  }, [])

  useEffect(() => {
    const darkMode = window.matchMedia('(prefers-color-scheme: dark)').matches
    setIsDark(darkMode)

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    const handleChange = (e: MediaQueryListEvent) => {
      setIsDark(e.matches)
    }
    mediaQuery.addEventListener('change', handleChange)
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [])

  useEffect(() => {
    const handleKeydown = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        e.preventDefault()
        setIsDark(prev => !prev)
      }
    }
    window.addEventListener('keydown', handleKeydown)
    return () => window.removeEventListener('keydown', handleKeydown)
  }, [])

  const handleNodeClick = useCallback((node: GraphNode) => {
    try {
      if (node.type === 'project' || node.type === 'experience') {
        if (!node.originalId) {
          console.warn('Node has no originalId:', node)
          return
        }
        navigate(`/${node.type}/${node.originalId}`)
      } else if (node.type === 'skill' || node.type === 'ability') {
        navigate(`/skill/${encodeURIComponent(node.label)}`)
      }
    } catch (err) {
      console.error('Navigation error:', err)
    }
  }, [navigate])

  useEffect(() => {
    if (!svgRef.current || !containerRef.current || !graphData) return

    const { nodes, edges } = graphData
    if (nodes.length === 0) return

    const container = containerRef.current
    const svg = d3.select(svgRef.current)
    let width = container.clientWidth
    let containerHeight = container.clientHeight

    if (width === 0 || containerHeight === 0) {
      width = 800
      containerHeight = height
    }

    svg.selectAll('*').remove()
    svg.attr('width', width).attr('height', containerHeight)

    const isHighlighted = (nodeLabel: string) => highlightedLabels.includes(nodeLabel)

    const nodeLinks: Record<string, number> = {}
    edges.forEach(l => {
      const sourceId = typeof l.source === 'object' ? l.source.id : String(l.source)
      const targetId = typeof l.target === 'object' ? l.target.id : String(l.target)
      nodeLinks[sourceId] = (nodeLinks[sourceId] || 0) + 1
      nodeLinks[targetId] = (nodeLinks[targetId] || 0) + 1
    })

    const colorGroup = d3.scaleOrdinal<string>()
      .domain(['skill', 'ability', 'project', 'experience'])
      .range(['#38a169', '#a0aec0', '#718096', '#48bb78'])

    const simulation = d3.forceSimulation<GraphNode, GraphEdge>(nodes)
      .force('link', d3.forceLink<GraphNode, GraphEdge>(edges).id((d) => d.id).distance(130))
      .force('charge', d3.forceManyBody<GraphNode>().strength(-480))
      .force('center', d3.forceCenter(width / 2, containerHeight / 2))
      .force('collide', d3.forceCollide<GraphNode>().radius(65))
    
    simulationRef.current = simulation

    const link = svg.append('g')
      .selectAll('line')
      .data(edges)
      .enter().append('line')
      .attr('stroke', isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)')
      .attr('stroke-width', 1)

    const node = svg.append('g')
      .selectAll('g')
      .data(nodes)
      .enter().append('g')
      .call(d3.drag<SVGGElement, GraphNode>()
        .on('start', dragstarted)
        .on('drag', dragged)
        .on('end', dragended))

    node.each(function(d: GraphNode) {
      const g = d3.select(this)
      const r = getNodeSize(d.weight)
      const color = isHighlighted(d.label) ? getNodeColor(d.type, isDark) : colorGroup(d.type)

      g.append('circle')
        .attr('r', r)
        .attr('fill', color)
        .attr('class', 'glass-node')
        .style('opacity', 0.85)
        .style('filter', 'blur(0.6px)')

      g.append('circle')
        .attr('r', r * 0.85)
        .attr('fill', isDark ? 'rgba(255,255,255,0.25)' : 'rgba(0,0,0,0.15)')
        .attr('cy', -r * 0.25)
        .attr('cx', -r * 0.25)

      g.on('mouseover', function() {
        d3.select(this).select('.glass-node')
          .style('filter', `drop-shadow(0 0 12px ${color}80) blur(0.6px)`)
      })
      .on('mouseout', function() {
        d3.select(this).select('.glass-node')
          .style('filter', 'blur(0.6px)')
      })
    })

    node.append('text')
      .attr('class', 'node-text')
      .attr('dx', 10)
      .attr('dy', 4)
      .attr('font-size', '12px')
      .attr('font-weight', 500)
      .attr('fill', isDark ? '#e2e8f0' : '#2d3748')
      .style('pointer-events', 'none')
      .style('user-select', 'none')
      .text((d) => {
        const label = d.label
        if (label.length > 12) return label.substring(0, 12) + '...'
        return label
      })

    node.on('click', function(event, d) {
      event.stopPropagation()
      handleNodeClick(d)
    })

    function dragstarted(event: d3.D3DragEvent<SVGGElement, GraphNode>) {
      if (!event.active) simulation.alphaTarget(0.2).restart()
      event.subject.fx = event.x
      event.subject.fy = event.y
    }

    function dragged(event: d3.D3DragEvent<SVGGElement, GraphNode>) {
      event.subject.fx = event.x
      event.subject.fy = event.y
    }

    function dragended(event: d3.D3DragEvent<SVGGElement, GraphNode>) {
      if (!event.active) simulation.alphaTarget(0)
      event.subject.fx = null
      event.subject.fy = null
    }

    simulation.on('tick', () => {
      link
        .attr('x1', (d: any) => d.source.x)
        .attr('y1', (d: any) => d.source.y)
        .attr('x2', (d: any) => d.target.x)
        .attr('y2', (d: any) => d.target.y)

      node.attr('transform', (d) => `translate(${d.x},${d.y})`)
    })

    const handleResize = () => {
      if (!containerRef.current) return
      const newWidth = containerRef.current.clientWidth
      const newHeight = containerRef.current.clientHeight
      if (newWidth > 0 && newHeight > 0) {
        svg.attr('width', newWidth).attr('height', newHeight)
        simulation.force('center', d3.forceCenter(newWidth / 2, newHeight / 2))
        simulation.alpha(0.2).restart()
      }
    }

    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
      simulation.stop()
    }
  }, [graphData, isDark, handleNodeClick, isPreview, highlightedLabels, height])

  if (!graphData) {
    return (
      <div className="w-full flex items-center justify-center" style={{ height: `${height}px`, background: isDark ? '#0f1217' : '#f9fafb' }}>
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-gray-200 dark:border-gray-800 border-t-green-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-500 dark:text-gray-400">加载中...</p>
        </div>
      </div>
    )
  }

  return (
    <div 
      className="relative w-full h-full"
      style={{ background: isDark ? '#0f1217' : '#f9fafb', transition: 'background 0.4s ease' }}
    >
      <div ref={containerRef} className="w-full" style={{ height: `${height}px`, cursor: 'grab' }}>
        <svg ref={svgRef} className="w-full h-full" />
      </div>

      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-3 text-xs">
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full" style={{ background: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)' }}>
          <div className="w-2 h-2 rounded-full bg-green-600"></div>
          <span style={{ color: isDark ? '#e2e8f0' : '#2d3748' }}>技能</span>
        </div>
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full" style={{ background: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)' }}>
          <div className="w-2 h-2 rounded-full bg-gray-400"></div>
          <span style={{ color: isDark ? '#e2e8f0' : '#2d3748' }}>能力</span>
        </div>
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full" style={{ background: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)' }}>
          <div className="w-2 h-2 rounded-full bg-gray-600"></div>
          <span style={{ color: isDark ? '#e2e8f0' : '#2d3748' }}>项目</span>
        </div>
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full" style={{ background: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)' }}>
          <div className="w-2 h-2 rounded-full bg-green-500"></div>
          <span style={{ color: isDark ? '#e2e8f0' : '#2d3748' }}>经历</span>
        </div>
      </div>

      <div className="absolute top-4 right-4 text-xs px-3 py-1.5 rounded-full" style={{ background: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)', color: isDark ? '#e2e8f0' : '#2d3748' }}>
        按空格键切换主题
      </div>
    </div>
  )
}
