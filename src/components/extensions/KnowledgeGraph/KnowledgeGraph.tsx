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
  const [currentTransform, setCurrentTransform] = useState<d3.ZoomTransform>(d3.zoomIdentity)
  const navigate = useNavigate()
  const simulationRef = useRef<d3.Simulation<GraphNode, GraphEdge> | null>(null)
  const zoomRef = useRef<d3.ZoomBehavior<SVGSVGElement, unknown> | null>(null)
  const gRef = useRef<d3.Selection<SVGGElement, unknown, null, undefined> | null>(null)
  const isHoveringRef = useRef<boolean>(false)

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

  const handleResetView = useCallback(() => {
    if (zoomRef.current && svgRef.current) {
      const svg = d3.select(svgRef.current)
      svg.transition().duration(500).call(
        zoomRef.current.transform,
        d3.zoomIdentity
      )
      setCurrentTransform(d3.zoomIdentity)
    }
  }, [])

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
    gRef.current = g

    const zoom = d3.zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.2, 4])
      .on('zoom', (event) => {
        g.attr('transform', event.transform)
        setCurrentTransform(event.transform)
      })

    zoomRef.current = zoom
    svg.call(zoom)
    svg.on('dblclick.zoom', null)

    svg.append('defs').append('marker')
      .attr('id', 'arrowhead')
      .attr('viewBox', '-0 -5 10 10')
      .attr('refX', 20)
      .attr('refY', 0)
      .attr('orient', 'auto')
      .attr('markerWidth', 6)
      .attr('markerHeight', 6)
      .append('path')
      .attr('d', 'M 0,-5 L 10,0 L 0,5')
      .attr('fill', isDark ? '#6b7280' : '#d1d5db')

    const isHighlighted = (nodeLabel: string) => highlightedLabels.includes(nodeLabel)

    const centerX = width / 2
    const centerY = containerHeight / 2

    const simulation = d3.forceSimulation<GraphNode, GraphEdge>(nodes)
      .force('link', d3.forceLink<GraphNode, GraphEdge>(edges).id((d) => d.id).distance(80).strength(0.3))
      .force('charge', d3.forceManyBody<GraphNode>().strength(-200))
      .force('center', d3.forceCenter(centerX, centerY).strength(0.1))
      .force('collision', d3.forceCollide<GraphNode>().radius((d) => getNodeSize(d.weight) + 15))
    
    simulationRef.current = simulation
    isHoveringRef.current = false

    const edge = g.append('g')
      .attr('class', 'edges')
      .selectAll('line')
      .data(edges)
      .enter().append('line')
      .attr('stroke', isDark ? '#4b5563' : '#d1d5db')
      .attr('stroke-width', (d) => Math.max(1, d.weight))
      .attr('opacity', 0.6)

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
        return isDark ? 'rgba(107, 114, 128, 0.15)' : 'rgba(156, 163, 175, 0.15)'
      })
      .attr('stroke', (d) => {
        if (isHighlighted(d.label)) {
          return isDark ? '#ffffff50' : '#00000030'
        }
        return isDark ? '#ffffff10' : '#00000010'
      })
      .attr('stroke-width', (d) => isHighlighted(d.label) ? 2 : 1)
      .style('filter', (d) => {
        if (isHighlighted(d.label)) {
          return isDark ? 'drop-shadow(0 0 12px rgba(74, 222, 128, 0.4))' : 'drop-shadow(0 0 8px rgba(74, 222, 128, 0.3))'
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
      isHoveringRef.current = true
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
        .transition().duration(120)
        .attr('r', getNodeSize(d.weight) * 1.25)
        .attr('fill', nodeColor)
        .attr('stroke', isDark ? '#ffffff70' : '#00000040')
        .attr('stroke-width', 2.5)
        .style('filter', isDark ? 'drop-shadow(0 0 18px rgba(74, 222, 128, 0.6))' : 'drop-shadow(0 0 12px rgba(74, 222, 128, 0.5))')

      nodeSelection.select('text')
        .transition().duration(120)
        .attr('font-weight', 700)
        .style('opacity', 1)
        .attr('fill', isDark ? '#e5e7eb' : '#1f2937')

      edge.transition().duration(120)
        .attr('opacity', (e: any) => {
          if (e.source.id === d.id || e.target.id === d.id) return 1
          return 0.15
        })
        .attr('stroke-width', (e: any) => {
          if (e.source.id === d.id || e.target.id === d.id) return 2
          return 1
        })

      node.transition().duration(120)
        .style('opacity', (n) => {
          if (n.id === d.id) return 1
          const connected = edges.some(
            (e: any) => (e.source.id === d.id && e.target.id === n.id) || (e.target.id === d.id && e.source.id === n.id)
          )
          return connected ? 0.9 : 0.2
        })
    })

    node.on('mouseleave', function(event, d) {
      isHoveringRef.current = false
      setHoveredNodeId(null)
      
      d.fx = null
      d.fy = null
      
      if (simulationRef.current) {
        simulationRef.current.alpha(0.1).restart()
      }

      setTooltip({ x: 0, y: 0, node: null })

      const nodeSelection = d3.select(this)
      
      nodeSelection.select('circle')
        .transition().duration(120)
        .attr('r', getNodeSize(d.weight))
        .attr('fill', () => {
          if (isHighlighted(d.label)) {
            return getNodeColor(d.type, isDark)
          }
          return isDark ? 'rgba(107, 114, 128, 0.15)' : 'rgba(156, 163, 175, 0.15)'
        })
        .attr('stroke', () => {
          if (isHighlighted(d.label)) {
            return isDark ? '#ffffff50' : '#00000030'
          }
          return isDark ? '#ffffff10' : '#00000010'
        })
        .attr('stroke-width', () => isHighlighted(d.label) ? 2 : 1)
        .style('filter', () => {
          if (isHighlighted(d.label)) {
            return isDark ? 'drop-shadow(0 0 12px rgba(74, 222, 128, 0.4))' : 'drop-shadow(0 0 8px rgba(74, 222, 128, 0.3))'
          }
          return 'none'
        })

      nodeSelection.select('text')
        .transition().duration(120)
        .attr('font-weight', () => isHighlighted(d.label) ? 600 : 400)
        .style('opacity', () => isHighlighted(d.label) ? 1 : 0.5)
        .attr('fill', isDark ? '#9ca3af' : '#6b7280')

      edge.transition().duration(120)
        .attr('opacity', 0.6)
        .attr('stroke-width', (d) => Math.max(1, d.weight))

      node.transition().duration(120)
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
        simulation.force('center', d3.forceCenter(newWidth / 2, newHeight / 2).strength(0.1))
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

  const scale = Math.round(currentTransform.k * 100)

  return (
    <div className="relative w-full h-full">
      <div ref={containerRef} className="w-full bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800" style={{ height: `${height}px` }}>
        <svg ref={svgRef} className="w-full h-full" />
      </div>

      <div className="absolute top-4 right-4 flex flex-col gap-2">
        <button
          onClick={handleResetView}
          className="p-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          title="重置视图"
        >
          <svg className="w-5 h-5 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        </button>
        
        <div className="p-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg text-xs text-gray-500 dark:text-gray-400 font-medium">
          {scale}%
        </div>
      </div>

      {tooltip.node && (
        <div
          className="absolute pointer-events-none z-50 px-4 py-3 bg-gray-900 dark:bg-gray-800 text-white rounded-lg shadow-2xl border border-gray-700 max-w-xs"
          style={{
            left: Math.min(tooltip.x + 15, (containerRef.current?.clientWidth || 0) - 220),
            top: tooltip.y - 60,
            transform: tooltip.x > (containerRef.current?.clientWidth || 0) - 250 ? 'translateX(-100%)' : 'none'
          }}
        >
          <div className="font-bold text-sm mb-1.5 flex items-center gap-2">
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

      <div className="absolute bottom-4 left-4 right-4 flex flex-wrap justify-center gap-2 text-xs text-gray-500 dark:text-gray-400 sm:static sm:flex-nowrap sm:bg-transparent sm:border-0 sm:shadow-none sm:p-0">
        <div className="flex items-center gap-1.5 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm px-3 py-1.5 rounded-full border border-gray-200/50 dark:border-gray-700/50 shadow-sm">
          <div className="w-2 h-2 rounded-full bg-blue-500"></div>
          <span className="text-xs">技能</span>
        </div>
        <div className="flex items-center gap-1.5 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm px-3 py-1.5 rounded-full border border-gray-200/50 dark:border-gray-700/50 shadow-sm">
          <div className="w-2 h-2 rounded-full bg-purple-500"></div>
          <span className="text-xs">能力</span>
        </div>
        <div className="flex items-center gap-1.5 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm px-3 py-1.5 rounded-full border border-gray-200/50 dark:border-gray-700/50 shadow-sm">
          <div className="w-2 h-2 rounded-full bg-green-500"></div>
          <span className="text-xs">项目</span>
        </div>
        <div className="flex items-center gap-1.5 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm px-3 py-1.5 rounded-full border border-gray-200/50 dark:border-gray-700/50 shadow-sm">
          <div className="w-2 h-2 rounded-full bg-orange-500"></div>
          <span className="text-xs">经历</span>
        </div>
      </div>
    </div>
  )
}
