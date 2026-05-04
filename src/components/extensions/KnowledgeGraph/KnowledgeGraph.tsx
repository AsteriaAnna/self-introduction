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
  const [isDark, setIsDark] = useState(false)
  const [graphData, setGraphData] = useState<{ nodes: GraphNode[]; edges: GraphEdge[] } | null>(null)
  const [hoveredNodeId, setHoveredNodeId] = useState<string | null>(null)
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

    const g = svg.append('g').attr('class', 'graph-group')

    const isHighlighted = (nodeLabel: string) => highlightedLabels.includes(nodeLabel)

    const simulation = d3.forceSimulation<GraphNode, GraphEdge>(nodes)
      .force('link', d3.forceLink<GraphNode, GraphEdge>(edges).id((d) => d.id).distance(80).strength(0.4))
      .force('charge', d3.forceManyBody<GraphNode>().strength(-150))
      .force('center', d3.forceCenter(width / 2, containerHeight / 2).strength(0.05))
      .force('collision', d3.forceCollide<GraphNode>().radius((d) => getNodeSize(d.weight) + 12))
    
    simulationRef.current = simulation

    const edge = g.append('g')
      .attr('class', 'edges')
      .selectAll('line')
      .data(edges)
      .enter().append('line')
      .attr('stroke', (d: any) => {
        const sourceHighlighted = isHighlighted(d.source.label)
        const targetHighlighted = isHighlighted(d.target.label)
        if (sourceHighlighted && targetHighlighted) {
          return isDark ? '#4ade80' : '#22c55e'
        }
        return isDark ? '#4b5563' : '#d1d5db'
      })
      .attr('stroke-width', (d: any) => {
        const sourceHighlighted = isHighlighted(d.source.label)
        const targetHighlighted = isHighlighted(d.target.label)
        if (sourceHighlighted && targetHighlighted) {
          return 2.5
        }
        return Math.max(1, d.weight)
      })
      .attr('opacity', (d: any) => {
        const sourceHighlighted = isHighlighted(d.source.label)
        const targetHighlighted = isHighlighted(d.target.label)
        if (sourceHighlighted && targetHighlighted) {
          return 0.9
        }
        return 0.5
      })
      .style('stroke-dasharray', (d: any) => {
        const sourceHighlighted = isHighlighted(d.source.label)
        const targetHighlighted = isHighlighted(d.target.label)
        if (sourceHighlighted && targetHighlighted) {
          return '5,5'
        }
        return 'none'
      })

    const node = g.append('g')
      .attr('class', 'nodes')
      .selectAll('g')
      .data(nodes)
      .enter().append('g')
      .attr('class', 'node')
      .attr('cursor', 'pointer')

    const nodeGroup = node.append('g').style('pointer-events', 'all')

    nodeGroup.append('circle')
      .attr('r', (d) => getNodeSize(d.weight))
      .attr('fill', (d) => {
        if (isHighlighted(d.label)) {
          return getNodeColor(d.type, isDark)
        }
        return isDark ? 'rgba(107, 114, 128, 0.2)' : 'rgba(156, 163, 175, 0.2)'
      })
      .attr('stroke', (d) => {
        if (isHighlighted(d.label)) {
          return isDark ? '#ffffff40' : '#00000020'
        }
        return isDark ? '#ffffff10' : '#00000010'
      })
      .attr('stroke-width', (d) => isHighlighted(d.label) ? 2 : 1)
      .style('filter', (d) => {
        if (isHighlighted(d.label)) {
          return isDark ? 'drop-shadow(0 0 10px rgba(74, 222, 128, 0.5))' : 'drop-shadow(0 0 8px rgba(74, 222, 128, 0.4))'
        }
        return 'none'
      })

    nodeGroup.append('text')
      .attr('dy', (d) => getNodeSize(d.weight) + 14)
      .attr('text-anchor', 'middle')
      .attr('font-size', '11px')
      .attr('fill', isDark ? '#9ca3af' : '#6b7280')
      .attr('font-weight', (d) => isHighlighted(d.label) ? 600 : 400)
      .style('pointer-events', 'none')
      .style('opacity', (d) => isHighlighted(d.label) ? 1 : 0.5)
      .text((d) => {
        const label = d.label
        if (label.length > 12) return label.substring(0, 12) + '...'
        return label
      })

    node.on('mouseenter', function(event, d) {
      setHoveredNodeId(d.id)
      
      if (simulationRef.current) {
        simulationRef.current.stop()
        d.fx = d.x
        d.fy = d.y
      }

      const [x, y] = d3.pointer(event, container)
      setTooltip({ x, y, node: d })

      const nodeSelection = d3.select(this)
      const nodeColor = getNodeColor(d.type, isDark)
      
      nodeSelection.select('circle')
        .transition().duration(100)
        .attr('r', getNodeSize(d.weight) * 1.2)
        .attr('fill', nodeColor)
        .attr('stroke', isDark ? '#ffffff60' : '#00000030')
        .attr('stroke-width', 2)
        .style('filter', isDark ? 'drop-shadow(0 0 15px rgba(74, 222, 128, 0.6))' : 'drop-shadow(0 0 12px rgba(74, 222, 128, 0.5))')

      nodeSelection.select('text')
        .transition().duration(100)
        .attr('font-weight', 700)
        .style('opacity', 1)
        .attr('fill', isDark ? '#e5e7eb' : '#1f2937')

      edge.transition().duration(100)
        .attr('opacity', (e: any) => {
          if (e.source.id === d.id || e.target.id === d.id) return 1
          const sourceHighlighted = isHighlighted(e.source.label)
          const targetHighlighted = isHighlighted(e.target.label)
          return sourceHighlighted && targetHighlighted ? 0.6 : 0.2
        })
        .attr('stroke-width', (e: any) => {
          if (e.source.id === d.id || e.target.id === d.id) return 2
          return Math.max(1, e.weight)
        })

      node.transition().duration(100)
        .style('opacity', (n) => {
          if (n.id === d.id) return 1
          const connected = edges.some(
            (e: any) => (e.source.id === d.id && e.target.id === n.id) || (e.target.id === d.id && e.source.id === n.id)
          )
          return connected ? 0.85 : 0.3
        })
    })

    node.on('mouseleave', function(event, d) {
      setHoveredNodeId(null)
      
      d.fx = null
      d.fy = null
      
      if (simulationRef.current) {
        simulationRef.current.alpha(0.1).restart()
      }

      setTooltip({ x: 0, y: 0, node: null })

      const nodeSelection = d3.select(this)
      
      nodeSelection.select('circle')
        .transition().duration(100)
        .attr('r', getNodeSize(d.weight))
        .attr('fill', () => {
          if (isHighlighted(d.label)) {
            return getNodeColor(d.type, isDark)
          }
          return isDark ? 'rgba(107, 114, 128, 0.2)' : 'rgba(156, 163, 175, 0.2)'
        })
        .attr('stroke', () => {
          if (isHighlighted(d.label)) {
            return isDark ? '#ffffff40' : '#00000020'
          }
          return isDark ? '#ffffff10' : '#00000010'
        })
        .attr('stroke-width', () => isHighlighted(d.label) ? 2 : 1)
        .style('filter', () => {
          if (isHighlighted(d.label)) {
            return isDark ? 'drop-shadow(0 0 10px rgba(74, 222, 128, 0.5))' : 'drop-shadow(0 0 8px rgba(74, 222, 128, 0.4))'
          }
          return 'none'
        })

      nodeSelection.select('text')
        .transition().duration(100)
        .attr('font-weight', () => isHighlighted(d.label) ? 600 : 400)
        .style('opacity', () => isHighlighted(d.label) ? 1 : 0.5)
        .attr('fill', isDark ? '#9ca3af' : '#6b7280')

      edge.transition().duration(100)
        .attr('opacity', (d: any) => {
          const sourceHighlighted = isHighlighted(d.source.label)
          const targetHighlighted = isHighlighted(d.target.label)
          if (sourceHighlighted && targetHighlighted) {
            return 0.9
          }
          return 0.5
        })
        .attr('stroke-width', (d: any) => {
          const sourceHighlighted = isHighlighted(d.source.label)
          const targetHighlighted = isHighlighted(d.target.label)
          if (sourceHighlighted && targetHighlighted) {
            return 2.5
          }
          return Math.max(1, d.weight)
        })

      node.transition().duration(100)
        .style('opacity', 1)
    })

    node.on('click', function(event, d) {
      event.stopPropagation()
      handleNodeClick(d)
    })

    simulation.on('tick', () => {
      edge
        .attr('x1', (d: any) => d.source.x)
        .attr('y1', (d: any) => d.source.y)
        .attr('x2', (d: any) => d.target.x)
        .attr('y2', (d: any) => d.target.y)

      node.attr('transform', (d) => `translate(${d.x}, ${d.y})`)
    })

    setTimeout(() => {
      simulation.alpha(1).restart()
    }, 100)

    const handleResize = () => {
      if (!containerRef.current) return
      const newWidth = containerRef.current.clientWidth
      const newHeight = containerRef.current.clientHeight
      if (newWidth > 0 && newHeight > 0) {
        svg.attr('width', newWidth).attr('height', newHeight)
        simulation.force('center', d3.forceCenter(newWidth / 2, newHeight / 2).strength(0.05))
        simulation.alpha(0.3).restart()
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
      <div className="w-full bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 flex items-center justify-center" style={{ height: `${height}px` }}>
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-gray-200 dark:border-gray-800 border-t-green-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-500 dark:text-gray-400">加载中...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="relative w-full h-full">
      <div ref={containerRef} className="w-full bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800" style={{ height: `${height}px` }}>
        <svg ref={svgRef} className="w-full h-full" />
      </div>

      {tooltip.node && (
        <div
          className="absolute pointer-events-none z-50 px-4 py-3 bg-gray-900 dark:bg-gray-800 text-white rounded-lg shadow-xl border border-gray-700 max-w-xs"
          style={{
            left: Math.min(tooltip.x + 15, (containerRef.current?.clientWidth || 0) - 220),
            top: tooltip.y - 60,
            transform: tooltip.x > (containerRef.current?.clientWidth || 0) - 250 ? 'translateX(-100%)' : 'none'
          }}
        >
          <div className="font-bold text-sm mb-1.5">
            {tooltip.node.label}
          </div>
          <div className="text-xs text-gray-300 mb-1">
            <span className={`inline-block px-2 py-0.5 rounded-full text-xs mr-2 ${
              tooltip.node.type === 'skill' ? 'bg-blue-900/50 text-blue-400' :
              tooltip.node.type === 'ability' ? 'bg-purple-900/50 text-purple-400' :
              tooltip.node.type === 'project' ? 'bg-green-900/50 text-green-400' :
              'bg-orange-900/50 text-orange-400'
            }`}>
              {tooltip.node.type === 'skill' ? '技能' :
               tooltip.node.type === 'ability' ? '能力' :
               tooltip.node.type === 'project' ? '项目' :
               '经历'}
            </span>
          </div>
          <div className="text-xs text-gray-400">
            关联: {tooltip.node.weight} 个
          </div>
          <div className="mt-2 pt-1.5 border-t border-gray-700 text-xs text-green-400">
            点击查看详情 →
          </div>
        </div>
      )}

      <div className="absolute bottom-4 left-4 right-4 flex flex-wrap justify-center gap-2 text-xs text-gray-500 dark:text-gray-400">
        <div className="flex items-center gap-1.5 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm px-3 py-1.5 rounded-full border border-gray-200/50 dark:border-gray-700/50 shadow-sm">
          <div className="w-2 h-2 rounded-full bg-blue-500"></div>
          <span>技能</span>
        </div>
        <div className="flex items-center gap-1.5 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm px-3 py-1.5 rounded-full border border-gray-200/50 dark:border-gray-700/50 shadow-sm">
          <div className="w-2 h-2 rounded-full bg-purple-500"></div>
          <span>能力</span>
        </div>
        <div className="flex items-center gap-1.5 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm px-3 py-1.5 rounded-full border border-gray-200/50 dark:border-gray-700/50 shadow-sm">
          <div className="w-2 h-2 rounded-full bg-green-500"></div>
          <span>项目</span>
        </div>
        <div className="flex items-center gap-1.5 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm px-3 py-1.5 rounded-full border border-gray-200/50 dark:border-gray-700/50 shadow-sm">
          <div className="w-2 h-2 rounded-full bg-orange-500"></div>
          <span>经历</span>
        </div>
      </div>
    </div>
  )
}
