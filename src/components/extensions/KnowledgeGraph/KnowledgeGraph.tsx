import { useEffect, useRef, useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import * as d3 from 'd3'
import { GraphNode, GraphEdge } from '@/types'
import { buildGraphData, getNodeColor, getNodeSize } from '@/utils/graphBuilder'

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
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null)
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
      setSelectedNodeId(node.id)
      setTimeout(() => {
        if (node.type === 'project' || node.type === 'experience') {
          if (!node.originalId) {
            console.warn('Node has no originalId:', node)
            return
          }
          navigate(`/${node.type}/${node.originalId}`)
        } else if (node.type === 'skill' || node.type === 'ability') {
          navigate(`/skill/${encodeURIComponent(node.label)}`)
        }
      }, 300)
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
      .force('link', d3.forceLink<GraphNode, GraphEdge>(edges).id((d) => d.id).distance(120))
      .force('charge', d3.forceManyBody<GraphNode>().strength(-300))
      .force('center', d3.forceCenter(width / 2, containerHeight / 2))
      .force('collide', d3.forceCollide<GraphNode>().radius(45))
    
    simulationRef.current = simulation

    const link = svg.append('g')
      .selectAll('line')
      .data(edges)
      .enter().append('line')
      .attr('stroke', isDark ? 'rgba(148, 163, 184, 0.2)' : 'rgba(148, 163, 184, 0.3)')
      .attr('stroke-width', 1)
      .attr('stroke-linecap', 'round')

    const node = svg.append('g')
      .selectAll('g')
      .data(nodes)
      .enter().append('g')
      .attr('class', 'node')
      .attr('cursor', 'pointer')
      .call(d3.drag<SVGGElement, GraphNode>()
        .on('start', dragstarted)
        .on('drag', dragged)
        .on('end', dragended))

    node.each(function(d: GraphNode) {
      const g = d3.select(this)
      const r = getNodeSize(d.weight)
      const isSelected = selectedNodeId === d.id

      g.append('circle')
        .attr('r', r)
        .attr('fill', isDark ? 'rgba(148, 163, 184, 0.08)' : 'rgba(148, 163, 184, 0.12)')
        .attr('stroke', isDark ? 'rgba(148, 163, 184, 0.25)' : 'rgba(148, 163, 184, 0.35)')
        .attr('stroke-width', 1.5)
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

    node.on('mouseover', function(event, d) {
      const isSelected = selectedNodeId === d.id
      const color = isDark ? '#38bdf8' : '#2563eb'

      d3.select(this).select('.node-circle')
        .transition()
        .duration(150)
        .attr('fill', isSelected ? (isDark ? 'rgba(56, 189, 248, 0.2)' : 'rgba(37, 99, 235, 0.15)') : (isDark ? 'rgba(148, 163, 184, 0.12)' : 'rgba(148, 163, 184, 0.18)'))
        .attr('stroke', isSelected ? color : (isDark ? 'rgba(148, 163, 184, 0.35)' : 'rgba(148, 163, 184, 0.45)'))

      d3.select(this).select('.node-label')
        .transition()
        .duration(150)
        .attr('fill', isSelected ? color : (isDark ? '#cbd5e1' : '#475569'))
    })

    node.on('mouseout', function(event, d) {
      const isSelected = selectedNodeId === d.id
      const color = isDark ? '#38bdf8' : '#2563eb'

      d3.select(this).select('.node-circle')
        .transition()
        .duration(150)
        .attr('fill', isSelected ? (isDark ? 'rgba(56, 189, 248, 0.15)' : 'rgba(37, 99, 235, 0.12)') : (isDark ? 'rgba(148, 163, 184, 0.08)' : 'rgba(148, 163, 184, 0.12)'))
        .attr('stroke', isSelected ? color : (isDark ? 'rgba(148, 163, 184, 0.25)' : 'rgba(148, 163, 184, 0.35)'))

      d3.select(this).select('.node-label')
        .transition()
        .duration(150)
        .attr('fill', isSelected ? color : (isDark ? '#94a3b8' : '#64748b'))
    })

    node.on('click', function(event, d) {
      event.stopPropagation()
      
      const color = isDark ? '#38bdf8' : '#2563eb'

      d3.select(this).select('.node-circle')
        .transition()
        .duration(200)
        .attr('fill', isDark ? 'rgba(56, 189, 248, 0.2)' : 'rgba(37, 99, 235, 0.15)')
        .attr('stroke', color)
        .attr('stroke-width', 2)

      d3.select(this).select('.node-label')
        .transition()
        .duration(200)
        .attr('fill', color)
        .attr('font-weight', 600)

      handleNodeClick(d)
    })

    svg.on('click', function(event) {
      if ((event.target as SVGElement).tagName === 'svg') {
        setSelectedNodeId(null)
        node.each(function(d) {
          d3.select(this).select('.node-circle')
            .transition()
            .duration(150)
            .attr('fill', isDark ? 'rgba(148, 163, 184, 0.08)' : 'rgba(148, 163, 184, 0.12)')
            .attr('stroke', isDark ? 'rgba(148, 163, 184, 0.25)' : 'rgba(148, 163, 184, 0.35)')
            .attr('stroke-width', 1.5)

          d3.select(this).select('.node-label')
            .transition()
            .duration(150)
            .attr('fill', isDark ? '#94a3b8' : '#64748b')
            .attr('font-weight', 500)
        })
      }
    })

    function dragstarted(event: d3.D3DragEvent<SVGGElement, GraphNode>) {
      if (!event.active) simulation.alphaTarget(0.15).restart()
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
        simulation.alpha(0.15).restart()
      }
    }

    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
      simulation.stop()
    }
  }, [graphData, isDark, handleNodeClick, isPreview, highlightedLabels, height, selectedNodeId])

  if (!graphData) {
    return (
      <div className="w-full flex items-center justify-center" style={{ height: `${height}px`, background: isDark ? '#0f1117' : '#f8fafc' }}>
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-gray-200 dark:border-gray-800 border-t-blue-500 rounded-full animate-spin mx-auto mb-4"></div>
          <p style={{ color: isDark ? '#64748b' : '#94a3b8' }}>加载中...</p>
        </div>
      </div>
    )
  }

  return (
    <div 
      className="relative w-full h-full"
      style={{ background: isDark ? '#0f1117' : '#f8fafc', transition: 'background 0.4s ease' }}
    >
      <div ref={containerRef} className="w-full" style={{ height: `${height}px`, cursor: 'grab' }}>
        <svg ref={svgRef} className="w-full h-full" />
      </div>

      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2 text-xs" style={{ pointerEvents: 'none' }}>
        <span style={{ color: isDark ? 'rgba(148, 163, 184, 0.6)' : 'rgba(148, 163, 184, 0.7)' }}>按空格键切换主题</span>
        <span style={{ color: isDark ? 'rgba(148, 163, 184, 0.3)' : 'rgba(148, 163, 184, 0.4)' }}>•</span>
        <span style={{ color: isDark ? 'rgba(148, 163, 184, 0.6)' : 'rgba(148, 163, 184, 0.7)' }}>点击节点查看详情</span>
      </div>
    </div>
  )
}
