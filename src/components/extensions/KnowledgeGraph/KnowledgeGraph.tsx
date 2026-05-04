import { useEffect, useRef, useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import * as d3 from 'd3'
import { GraphNode, GraphEdge } from '@/types'
import { buildGraphData, getNodeSize } from '@/utils/graphBuilder'

interface KnowledgeGraphProps {
  isPreview?: boolean
  highlightedLabels?: string[]
  height?: number
}

export function KnowledgeGraph({ isPreview = false, highlightedLabels = ['React', 'TypeScript', 'Node.js', '个人展示', '二手交易', '技术主管', '团队协作', '学习能力'], height = 600 }: KnowledgeGraphProps) {
  const svgRef = useRef<SVGSVGElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [isDark, setIsDark] = useState(true)
  const [graphData, setGraphData] = useState<{ nodes: GraphNode[]; edges: GraphEdge[] } | null>(null)
  const navigate = useNavigate()
  const simulationRef = useRef<d3.Simulation<GraphNode, GraphEdge> | null>(null)
  const nodeElementsRef = useRef<d3.Selection<SVGGElement, GraphNode, SVGGElement, unknown> | null>(null)
  const linkElementsRef = useRef<d3.Selection<SVGLineElement, GraphEdge, SVGGElement, unknown> | null>(null)

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

    const simulation = d3.forceSimulation<GraphNode, GraphEdge>(nodes)
      .force('link', d3.forceLink<GraphNode, GraphEdge>(edges).id((d) => d.id).distance(80).strength(0.5))
      .force('charge', d3.forceManyBody<GraphNode>().strength(-150))
      .force('center', d3.forceCenter(width / 2, containerHeight / 2))
      .force('collision', d3.forceCollide<GraphNode>().radius((d) => getNodeSize(d.weight) + 20))
    
    simulationRef.current = simulation

    const link = svg.append('g')
      .selectAll('line')
      .data(edges)
      .enter().append('line')
      .attr('stroke', isDark ? 'rgba(148, 163, 184, 0.12)' : 'rgba(148, 163, 184, 0.2)')
      .attr('stroke-width', 1)
      .attr('stroke-linecap', 'round')

    linkElementsRef.current = link

    const node = svg.append('g')
      .selectAll('g')
      .data(nodes)
      .enter().append('g')
      .attr('class', 'node')
      .attr('cursor', 'pointer')

    nodeElementsRef.current = node

    node.each(function(d: GraphNode) {
      const g = d3.select(this)
      const r = getNodeSize(d.weight)

      g.append('circle')
        .attr('r', r)
        .attr('fill', isDark ? 'rgba(148, 163, 184, 0.05)' : 'rgba(148, 163, 184, 0.08)')
        .attr('stroke', isDark ? 'rgba(148, 163, 184, 0.15)' : 'rgba(148, 163, 184, 0.2)')
        .attr('stroke-width', 1)
        .attr('class', 'node-circle')

      g.append('text')
        .attr('class', 'node-label')
        .attr('text-anchor', 'middle')
        .attr('dy', 4)
        .attr('font-size', '11px')
        .attr('font-weight', 500)
        .attr('fill', isDark ? '#94a3b8' : '#64748b')
        .style('pointer-events', 'none')
        .style('user-select', 'none')
        .style('letter-spacing', '-0.02em')
        .text((d) => {
          const label = d.label
          if (label.length > 10) return label.substring(0, 10) + '...'
          return label
        })
    })

    let lastTickTime = 0
    const tickInterval = 1000 / 30

    simulation.on('tick', () => {
      const now = Date.now()
      if (now - lastTickTime < tickInterval) return
      lastTickTime = now

      link
        .attr('x1', (d: any) => d.source.x)
        .attr('y1', (d: any) => d.source.y)
        .attr('x2', (d: any) => d.target.x)
        .attr('y2', (d: any) => d.target.y)

      node.attr('transform', (d) => `translate(${d.x},${d.y})`)
    })

    node.on('mouseover', function(event, d) {
      if (simulationRef.current) {
        simulationRef.current.stop()
      }

      const color = isDark ? '#38bdf8' : '#2563eb'

      d3.select(this).select('.node-circle')
        .attr('fill', isDark ? 'rgba(148, 163, 184, 0.12)' : 'rgba(148, 163, 184, 0.15)')
        .attr('stroke', color)
        .attr('stroke-width', 2)

      d3.select(this).select('.node-label')
        .attr('fill', color)
        .attr('font-weight', 600)
    })

    node.on('mouseout', function(event, d) {
      d3.select(this).select('.node-circle')
        .attr('fill', isDark ? 'rgba(148, 163, 184, 0.05)' : 'rgba(148, 163, 184, 0.08)')
        .attr('stroke', isDark ? 'rgba(148, 163, 184, 0.15)' : 'rgba(148, 163, 184, 0.2)')
        .attr('stroke-width', 1)

      d3.select(this).select('.node-label')
        .attr('fill', isDark ? '#94a3b8' : '#64748b')
        .attr('font-weight', 500)
    })

    node.on('click', function(event, d) {
      event.stopPropagation()
      handleNodeClick(d)
    })

    const drag = d3.drag<SVGGElement, GraphNode>()
      .on('start', function(event) {
        if (!event.active) simulation.alphaTarget(0.1).restart()
        event.subject.fx = event.subject.x
        event.subject.fy = event.subject.y
      })
      .on('drag', function(event) {
        event.subject.fx = event.x
        event.subject.fy = event.y
      })
      .on('end', function(event) {
        if (!event.active) simulation.alphaTarget(0)
        event.subject.fx = null
        event.subject.fy = null
      })

    node.call(drag)

    const handleResize = () => {
      if (!containerRef.current) return
      const newWidth = containerRef.current.clientWidth
      const newHeight = containerRef.current.clientHeight
      if (newWidth > 0 && newHeight > 0) {
        svg.attr('width', newWidth).attr('height', newHeight)
        simulation.force('center', d3.forceCenter(newWidth / 2, newHeight / 2))
        simulation.alpha(0.1).restart()
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
      <div className="w-full flex items-center justify-center" style={{ height: `${height}px` }}>
        <div className="text-center">
          <div className="w-10 h-10 border-3 border-gray-200 dark:border-gray-800 border-t-blue-400 rounded-full animate-spin mx-auto mb-3"></div>
          <p style={{ color: isDark ? 'rgba(148, 163, 184, 0.6)' : 'rgba(148, 163, 184, 0.7)' }}>加载中...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="relative w-full h-full">
      <div ref={containerRef} className="w-full" style={{ height: `${height}px`, cursor: 'grab' }}>
        <svg ref={svgRef} className="w-full h-full" />
      </div>
    </div>
  )
}
