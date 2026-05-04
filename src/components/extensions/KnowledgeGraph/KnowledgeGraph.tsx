import { useEffect, useRef, useState, useCallback } from 'react'
import * as d3 from 'd3'
import { GraphNode, GraphEdge } from '@/types'
import { buildGraphData, getNodeColor, getNodeSize } from '@/utils/graphBuilder'

interface TooltipData {
  x: number
  y: number
  node: GraphNode | null
}

export function KnowledgeGraph() {
  const svgRef = useRef<SVGSVGElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [tooltip, setTooltip] = useState<TooltipData>({ x: 0, y: 0, node: null })
  const [isDark, setIsDark] = useState(false)
  const [graphData, setGraphData] = useState<{ nodes: GraphNode[]; edges: GraphEdge[] } | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    try {
      const data = buildGraphData()
      setGraphData(data)
    } catch (err) {
      console.error('Failed to build graph data:', err)
      setError('Failed to load graph data')
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
      window.location.href = `/project/${node.originalId}`
    } else if (node.type === 'experience') {
      window.location.href = `/experience/${node.originalId}`
    }
  }, [])

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
      .scaleExtent([0.1, 3])
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
      .attr('d', 'M 0,-5 L 10 ,0 L 0,5')
      .attr('fill', isDark ? '#6b7280' : '#9ca3af')

    const simulation = d3.forceSimulation(nodes)
      .force('link', d3.forceLink(edges).id((d: any) => d.id).distance(150).strength(0.5))
      .force('charge', d3.forceManyBody().strength(-500))
      .force('center', d3.forceCenter(width / 2, height / 2))
      .force('collision', d3.forceCollide().radius((d: GraphNode) => getNodeSize(d.weight) + 20))

    const edge = g.append('g')
      .attr('class', 'edges')
      .selectAll('line')
      .data(edges)
      .enter().append('line')
      .attr('stroke', isDark ? '#4b5563' : '#d1d5db')
      .attr('stroke-width', (d: GraphEdge) => Math.max(1, d.weight))
      .attr('opacity', 0.7)

    const node = g.append('g')
      .attr('class', 'nodes')
      .selectAll('g')
      .data(nodes)
      .enter().append('g')
      .attr('class', 'node')
      .call(d3.drag()
        .on('start', (event, d: any) => {
          if (!event.active) simulation.alphaTarget(0.3).restart()
          d.fx = d.x
          d.fy = d.y
        })
        .on('drag', (event, d: any) => {
          d.fx = event.x
          d.fy = event.y
        })
        .on('end', (event, d: any) => {
          if (!event.active) simulation.alphaTarget(0)
          d.fx = null
          d.fy = null
        })
      )

    node.append('circle')
      .attr('r', (d: GraphNode) => getNodeSize(d.weight))
      .attr('fill', (d: GraphNode) => getNodeColor(d.type, isDark))
      .attr('stroke', isDark ? '#ffffff33' : '#00000033')
      .attr('stroke-width', 2)
      .attr('cursor', 'pointer')
      .style('filter', 'drop-shadow(0 2px 4px rgba(0, 0, 0, 0.2))')

    node.append('text')
      .attr('dy', (d: GraphNode) => getNodeSize(d.weight) + 14)
      .attr('text-anchor', 'middle')
      .attr('font-size', '11px')
      .attr('fill', isDark ? '#e5e7eb' : '#374151')
      .attr('font-weight', 500)
      .style('pointer-events', 'none')
      .text((d: GraphNode) => {
        const label = d.label
        if (label.length > 12) return label.substring(0, 12) + '...'
        return label
      })

    node.on('mouseenter', (event, d: GraphNode) => {
      const [x, y] = d3.pointer(event, containerRef.current)
      setTooltip({ x, y, node: d })

      d3.select(event.currentTarget).select('circle')
        .transition().duration(200)
        .attr('r', getNodeSize(d.weight) * 1.3)
        .attr('stroke-width', 3)

      edge.attr('opacity', (e: any) => {
        return e.source.id === d.id || e.target.id === d.id ? 1 : 0.15
      })

      node.style('opacity', (n: GraphNode) => {
        if (n.id === d.id) return 1
        const connected = edges.some(
          (e: any) => (e.source.id === d.id && e.target.id === n.id) || (e.target.id === d.id && e.source.id === n.id)
        )
        return connected ? 0.9 : 0.25
      })
    })

    node.on('mouseleave', (event, d: GraphNode) => {
      setTooltip({ x: 0, y: 0, node: null })
      d3.select(event.currentTarget).select('circle')
        .transition().duration(200)
        .attr('r', getNodeSize(d.weight))
        .attr('stroke-width', 2)

      edge.attr('opacity', 0.7)
      node.style('opacity', 1)
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
  }, [graphData, isDark, handleNodeClick])

  if (error) {
    return (
      <div className="w-full h-[600px] bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 flex items-center justify-center">
        <p className="text-red-500">{error}</p>
      </div>
    )
  }

  if (!graphData || graphData.nodes.length === 0) {
    return (
      <div className="w-full h-[600px] bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 flex items-center justify-center">
        <p className="text-gray-500 dark:text-gray-400">暂无数据</p>
      </div>
    )
  }

  return (
    <div className="relative w-full h-full">
      <div ref={containerRef} className="w-full h-[600px] bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700">
        <svg ref={svgRef} className="w-full h-full" />
      </div>

      {tooltip.node && (
        <div
          className="absolute pointer-events-none z-10 px-4 py-3 bg-gray-900 dark:bg-gray-800 text-white rounded-lg shadow-xl border border-gray-700"
          style={{
            left: Math.min(tooltip.x + 15, (containerRef.current?.clientWidth || 0) - 200),
            top: tooltip.y - 60,
            transform: tooltip.x > (containerRef.current?.clientWidth || 0) - 250 ? 'translateX(-100%)' : 'none'
          }}
        >
          <div className="font-bold text-lg mb-1">{tooltip.node.label}</div>
          <div className="text-sm text-gray-300">
            类型: {tooltip.node.type === 'skill' ? '技能' : tooltip.node.type === 'project' ? '项目' : '经历'}
          </div>
          <div className="text-sm text-gray-300">
            关联数: {tooltip.node.weight}
          </div>
          {tooltip.node.type !== 'skill' && (
            <div className="text-xs text-green-400 mt-2">点击查看详情</div>
          )}
        </div>
      )}
    </div>
  )
}
