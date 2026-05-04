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
}

export function KnowledgeGraph({ isPreview = false, highlightedLabels = ['React', 'TypeScript', 'Node.js', '个人展示', '二手交易', '技术主管', '团队协作', '学习能力'] }: KnowledgeGraphProps) {
  const svgRef = useRef<SVGSVGElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [tooltip, setTooltip] = useState<TooltipData>({ x: 0, y: 0, node: null })
  const [isDark, setIsDark] = useState(false)
  const [graphData, setGraphData] = useState<{ nodes: GraphNode[]; edges: GraphEdge[] } | null>(null)
  const navigate = useNavigate()

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
    if (node.type === 'project') {
      navigate(`/project/${node.originalId}`)
    } else if (node.type === 'experience') {
      navigate(`/experience/${node.originalId}`)
    } else if (node.type === 'skill' || node.type === 'ability') {
      navigate(`/skill/${encodeURIComponent(node.label)}`)
    }
  }, [navigate])

  useEffect(() => {
    if (!svgRef.current || !containerRef.current || !graphData) return

    const { nodes, edges } = graphData
    if (nodes.length === 0) return

    const container = containerRef.current
    const svg = d3.select(svgRef.current)
    let width = container.clientWidth
    let height = container.clientHeight

    if (width === 0 || height === 0) {
      width = 800
      height = 600
    }

    svg.selectAll('*').remove()
    svg.attr('width', width).attr('height', height)

    const g = svg.append('g').attr('class', 'graph-group')

    const zoom = d3.zoom()
      .scaleExtent([0.3, 3])
      .on('zoom', (event) => {
        g.attr('transform', event.transform)
      })

    svg.call(zoom)

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

    const simulation = d3.forceSimulation(nodes)
      .force('link', d3.forceLink(edges).id((d: any) => d.id).distance(120).strength(0.5))
      .force('charge', d3.forceManyBody().strength(-400))
      .force('center', d3.forceCenter(width / 2, height / 2))
      .force('collision', d3.forceCollide().radius((d: GraphNode) => getNodeSize(d.weight) + 30))

    const edge = g.append('g')
      .attr('class', 'edges')
      .selectAll('line')
      .data(edges)
      .enter().append('line')
      .attr('stroke', isDark ? '#4b5563' : '#d1d5db')
      .attr('stroke-width', (d: GraphEdge) => Math.max(1.5, d.weight))
      .attr('opacity', (d: any) => {
        const sourceHighlighted = isHighlighted(d.source.label)
        const targetHighlighted = isHighlighted(d.target.label)
        return sourceHighlighted && targetHighlighted ? 0.8 : 0.3
      })
      .attr('marker-end', 'url(#arrowhead)')

    const node = g.append('g')
      .attr('class', 'nodes')
      .selectAll('g')
      .data(nodes)
      .enter().append('g')
      .attr('class', 'node')
      .attr('cursor', 'pointer')
      .style('opacity', (d: GraphNode) => isHighlighted(d.label) ? 1 : 0.2)

    const nodeGroup = node.append('g').style('pointer-events', 'all')

    nodeGroup.append('circle')
      .attr('r', (d: GraphNode) => getNodeSize(d.weight))
      .attr('fill', (d: GraphNode) => getNodeColor(d.type, isDark))
      .attr('stroke', isDark ? '#ffffff33' : '#00000033')
      .attr('stroke-width', (d: GraphNode) => isHighlighted(d.label) ? 4 : 2)
      .style('filter', (d: GraphNode) => {
        if (isHighlighted(d.label)) {
          return isDark ? 'drop-shadow(0 0 20px rgba(74, 222, 128, 0.6))' : 'drop-shadow(0 0 15px rgba(74, 222, 128, 0.5))'
        }
        return 'none'
      })

    nodeGroup.append('text')
      .attr('dy', (d: GraphNode) => getNodeSize(d.weight) + 16)
      .attr('text-anchor', 'middle')
      .attr('font-size', '12px')
      .attr('fill', isDark ? '#e5e7eb' : '#374151')
      .attr('font-weight', (d: GraphNode) => isHighlighted(d.label) ? 700 : 500)
      .style('pointer-events', 'none')
      .text((d: GraphNode) => {
        const label = d.label
        if (label.length > 10) return label.substring(0, 10) + '...'
        return label
      })

    node.on('mouseenter', (event, d: GraphNode) => {
      const [x, y] = d3.pointer(event, containerRef.current)
      setTooltip({ x, y, node: d })

      d3.select(event.currentTarget).select('circle')
        .transition().duration(200)
        .attr('r', getNodeSize(d.weight) * 1.25)
        .style('filter', isDark ? 'drop-shadow(0 0 25px rgba(74, 222, 128, 0.8))' : 'drop-shadow(0 0 20px rgba(74, 222, 128, 0.7))')

      edge.attr('opacity', (e: any) => {
        if (e.source.id === d.id || e.target.id === d.id) return 1
        const sourceHighlighted = isHighlighted(e.source.label)
        const targetHighlighted = isHighlighted(e.target.label)
        return sourceHighlighted && targetHighlighted ? 0.6 : 0.2
      })

      node.style('opacity', (n: GraphNode) => {
        if (n.id === d.id) return 1
        const connected = edges.some(
          (e: any) => (e.source.id === d.id && e.target.id === n.id) || (e.target.id === d.id && e.source.id === n.id)
        )
        return connected ? 0.7 : isHighlighted(n.label) ? 0.8 : 0.15
      })
    })

    node.on('mouseleave', (event, d: GraphNode) => {
      setTooltip({ x: 0, y: 0, node: null })
      d3.select(event.currentTarget).select('circle')
        .transition().duration(200)
        .attr('r', getNodeSize(d.weight))
        .style('filter', (d: GraphNode) => {
          if (isHighlighted(d.label)) {
            return isDark ? 'drop-shadow(0 0 20px rgba(74, 222, 128, 0.6))' : 'drop-shadow(0 0 15px rgba(74, 222, 128, 0.5))'
          }
          return 'none'
        })

      edge.attr('opacity', (d: any) => {
        const sourceHighlighted = isHighlighted(d.source.label)
        const targetHighlighted = isHighlighted(d.target.label)
        return sourceHighlighted && targetHighlighted ? 0.8 : 0.3
      })

      node.style('opacity', (n: GraphNode) => isHighlighted(n.label) ? 1 : 0.2)
    })

    node.on('click', (event, d: GraphNode) => {
      handleNodeClick(d)
    })

    simulation.on('tick', () => {
      edge
        .attr('x1', (d: any) => d.source.x)
        .attr('y1', (d: any) => d.source.y)
        .attr('x2', (d: any) => d.target.x)
        .attr('y2', (d: any) => d.target.y)

      node.attr('transform', (d: GraphNode) => `translate(${d.x}, ${d.y})`)
    })

    setTimeout(() => {
      nodes.forEach(d => {
        if (isHighlighted(d.label)) {
          d.fx = width / 2 + (Math.random() - 0.5) * 150
          d.fy = height / 2 + (Math.random() - 0.5) * 150
        }
      })
      simulation.alpha(0.3).restart()
    }, 600)

    const handleResize = () => {
      if (!containerRef.current) return
      const newWidth = containerRef.current.clientWidth
      const newHeight = containerRef.current.clientHeight
      if (newWidth > 0 && newHeight > 0) {
        svg.attr('width', newWidth).attr('height', newHeight)
        simulation.force('center', d3.forceCenter(newWidth / 2, newHeight / 2))
        simulation.alpha(0.3).restart()
      }
    }

    window.addEventListener('resize', handleResize)

    setTimeout(() => {
      simulation.alpha(1).restart()
    }, 100)

    return () => {
      window.removeEventListener('resize', handleResize)
      simulation.stop()
    }
  }, [graphData, isDark, handleNodeClick, isPreview, highlightedLabels])

  if (!graphData) {
    return (
      <div className="w-full h-[600px] bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-gray-200 dark:border-gray-800 border-t-green-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-500 dark:text-gray-400">加载中...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="relative w-full h-full">
      <div ref={containerRef} className="w-full h-[600px] bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800">
        <svg ref={svgRef} className="w-full h-full" />
      </div>

      {tooltip.node && (
        <div
          className="absolute pointer-events-none z-50 px-5 py-4 bg-gray-900 dark:bg-gray-800 text-white rounded-lg shadow-2xl border border-gray-700 max-w-xs"
          style={{
            left: Math.min(tooltip.x + 15, (containerRef.current?.clientWidth || 0) - 220),
            top: tooltip.y - 70,
            transform: tooltip.x > (containerRef.current?.clientWidth || 0) - 250 ? 'translateX(-100%)' : 'none'
          }}
        >
          <div className="font-bold text-lg mb-2 flex items-center gap-2">
            {tooltip.node.label}
          </div>
          <div className="text-sm text-gray-300 mb-2">
            <span className={`inline-block px-2 py-1 rounded-full text-xs mr-2 ${
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
          <div className="text-sm text-gray-400">
            关联: {tooltip.node.weight} 个
          </div>
          <div className="mt-3 pt-2 border-t border-gray-700 text-xs text-green-400">
            点击查看详情 →
          </div>
        </div>
      )}

      <div className="absolute bottom-4 left-4 flex gap-3 text-xs text-gray-500 dark:text-gray-400">
        <div className="flex items-center gap-1 bg-white dark:bg-gray-800 px-3 py-2 rounded-full border border-gray-200 dark:border-gray-700">
          <div className="w-2.5 h-2.5 rounded-full bg-blue-500"></div>
          <span>技能</span>
        </div>
        <div className="flex items-center gap-1 bg-white dark:bg-gray-800 px-3 py-2 rounded-full border border-gray-200 dark:border-gray-700">
          <div className="w-2.5 h-2.5 rounded-full bg-purple-500"></div>
          <span>能力</span>
        </div>
        <div className="flex items-center gap-1 bg-white dark:bg-gray-800 px-3 py-2 rounded-full border border-gray-200 dark:border-gray-700">
          <div className="w-2.5 h-2.5 rounded-full bg-green-500"></div>
          <span>项目</span>
        </div>
        <div className="flex items-center gap-1 bg-white dark:bg-gray-800 px-3 py-2 rounded-full border border-gray-200 dark:border-gray-700">
          <div className="w-2.5 h-2.5 rounded-full bg-orange-500"></div>
          <span>经历</span>
        </div>
      </div>
    </div>
  )
}
