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
    if (!svgRef.current || !containerRef.current) return

    const { nodes, edges } = buildGraphData()
    if (nodes.length === 0) return

    const container = containerRef.current
    const svg = d3.select(svgRef.current)
    const width = container.clientWidth
    const height = container.clientHeight

    svg.attr('width', width).attr('height', height)

    const zoom = d3.zoom()
      .scaleExtent([0.1, 3])
      .on('zoom', (event) => {
        svg.select('.graph-group').attr('transform', event.transform)
      })

    svg.call(zoom)

    const g = svg.select('.graph-group')

    const edgeGroup = g.append('g').attr('class', 'edges')
    const nodeGroup = g.append('g').attr('class', 'nodes')

    const simulation = d3.forceSimulation(nodes)
      .force('link', d3.forceLink(edges).id((d: any) => d.id).distance(120))
      .force('charge', d3.forceManyBody().strength(-800))
      .force('center', d3.forceCenter(width / 2, height / 2))
      .force('collision', d3.forceCollide().radius((d: GraphNode) => getNodeSize(d.weight) + 10))

    const edge = edgeGroup.selectAll('line')
      .data(edges)
      .enter().append('line')
      .attr('stroke', isDark ? '#4b5563' : '#e5e7eb')
      .attr('stroke-width', (d: GraphEdge) => d.weight * 1.5)
      .attr('opacity', 0.6)

    const node = nodeGroup.selectAll('g')
      .data(nodes)
      .enter().append('g')
      .attr('class', 'node')
      .call(d3.drag()
        .on('start', (event, d) => {
          if (!event.active) simulation.alphaTarget(0.3).restart()
          d.fx = d.x
          d.fy = d.y
        })
        .on('drag', (event, d) => {
          d.fx = event.x
          d.fy = event.y
        })
        .on('end', (event, d) => {
          if (!event.active) simulation.alphaTarget(0)
          d.fx = null
          d.fy = null
        })
      )

    node.append('circle')
      .attr('r', (d: GraphNode) => getNodeSize(d.weight))
      .attr('fill', (d: GraphNode) => getNodeColor(d.type, isDark))
      .attr('stroke', isDark ? '#ffffff' : '#000000')
      .attr('stroke-width', 2)
      .attr('cursor', 'pointer')
      .style('filter', 'drop-shadow(0 4px 6px rgba(0, 0, 0, 0.3))')

    node.append('text')
      .attr('dy', (d: GraphNode) => getNodeSize(d.weight) + 12)
      .attr('text-anchor', 'middle')
      .attr('font-size', '12px')
      .attr('fill', isDark ? '#e5e7eb' : '#374151')
      .attr('font-weight', 500)
      .text((d: GraphNode) => {
        const label = d.label
        if (label.length > 15) return label.substring(0, 15) + '...'
        return label
      })

    node.on('mouseenter', (event, d) => {
      const [x, y] = d3.pointer(event, svgRef.current)
      setTooltip({ x, y, node: d })
      d3.select(event.currentTarget).select('circle')
        .transition().duration(200)
        .attr('r', getNodeSize(d.weight) * 1.2)

      edge.style('opacity', (e: GraphEdge) => {
        return e.source === d || e.target === d ? 1 : 0.2
      })

      node.style('opacity', (n: GraphNode) => {
        if (n.id === d.id) return 1
        const connected = edges.some(
          e => (e.source === d && e.target === n) || (e.target === d && e.source === n)
        )
        return connected ? 0.8 : 0.3
      })
    })

    node.on('mouseleave', (event, d) => {
      setTooltip({ x: 0, y: 0, node: null })
      d3.select(event.currentTarget).select('circle')
        .transition().duration(200)
        .attr('r', getNodeSize(d.weight))

      edge.style('opacity', 0.6)
      node.style('opacity', 1)
    })

    node.on('click', (event, d) => {
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
      const newWidth = container.clientWidth
      const newHeight = container.clientHeight
      svg.attr('width', newWidth).attr('height', newHeight)
      simulation.force('center', d3.forceCenter(newWidth / 2, newHeight / 2))
      simulation.alpha(0.3).restart()
    }

    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
      simulation.stop()
      svg.selectAll('*').remove()
    }
  }, [isDark, handleNodeClick])

  return (
    <div className="relative w-full h-full">
      <div ref={containerRef} className="w-full h-[600px] bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700">
        <svg ref={svgRef} className="w-full h-full">
          <g className="graph-group" />
        </svg>
      </div>

      {tooltip.node && (
        <div
          className="absolute pointer-events-none z-10 px-4 py-3 bg-gray-900 dark:bg-gray-800 text-white rounded-lg shadow-xl border border-gray-700"
          style={{
            left: tooltip.x + 15,
            top: tooltip.y - 50,
            transform: tooltip.x > window.innerWidth - 250 ? 'translateX(-100%)' : 'none'
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
