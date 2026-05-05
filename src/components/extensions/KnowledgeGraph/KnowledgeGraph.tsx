import { useEffect, useRef, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import * as d3 from 'd3';
import { GraphNode, GraphEdge } from '@/types';
import { buildGraphData, getNodeSize } from '@/utils/graphBuilder';
import { useTheme } from '@components/extensions/Theme';
import { logger } from '@utils/logger';

interface KnowledgeGraphProps {
  isPreview?: boolean;
  highlightedLabels?: string[];
  height?: number;
}

export function KnowledgeGraph({
  isPreview = false,
  highlightedLabels = [
    'React',
    'TypeScript',
    'Node.js',
    '个人展示',
    '二手交易',
    '技术主管',
    '团队协作',
    '学习能力',
  ],
  height = 600,
}: KnowledgeGraphProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [graphData, setGraphData] = useState<{ nodes: GraphNode[]; edges: GraphEdge[] } | null>(
    null
  );
  const [containerHeight, setContainerHeight] = useState(height);
  const navigate = useNavigate();
  const simulationRef = useRef<d3.Simulation<GraphNode, GraphEdge> | null>(null);
  const { theme } = useTheme();

  useEffect(() => {
    const updateHeight = () => {
      const width = window.innerWidth;
      if (width < 640) {
        setContainerHeight(300);
      } else if (width < 768) {
        setContainerHeight(350);
      } else if (width < 1024) {
        setContainerHeight(400);
      } else {
        setContainerHeight(height);
      }
    };

    updateHeight();
    window.addEventListener('resize', updateHeight);
    return () => window.removeEventListener('resize', updateHeight);
  }, [height]);

  useEffect(() => {
    try {
      const data = buildGraphData();
      setGraphData(data);
    } catch (err) {
      logger.error('Failed to build graph data', 'KnowledgeGraph', undefined, err as Error);
    }
  }, []);

  const handleNodeClick = useCallback(
    (node: GraphNode) => {
      try {
        if (node.type === 'project' || node.type === 'experience') {
          if (!node.originalId) {
            logger.warn('Node has no originalId', 'KnowledgeGraph', { nodeId: node.id });
            return;
          }
          navigate(`/${node.type}/${node.originalId}`);
        } else if (node.type === 'skill' || node.type === 'ability') {
          navigate(`/skill/${encodeURIComponent(node.label)}`);
        }
      } catch (err) {
        logger.error('Navigation error', 'KnowledgeGraph', { nodeId: node.id }, err as Error);
      }
    },
    [navigate]
  );

  useEffect(() => {
    if (!svgRef.current || !containerRef.current || !graphData) return;

    const { nodes, edges } = graphData;
    if (nodes.length === 0) return;

    const container = containerRef.current;
    const svg = d3.select(svgRef.current);
    let width = container.clientWidth;
    let containerHeight = container.clientHeight;

    if (width === 0 || containerHeight === 0) {
      width = 800;
      containerHeight = height;
    }

    const isDark = theme === 'dark';

    // 根据屏幕大小计算缩放比例
    const screenWidth = window.innerWidth;
    let scale = 1.3; // 电脑端放大更多
    let fontSize = '14px';
    let maxLabelLength = 25;
    let linkDistance = 160;
    let chargeStrength = -350;
    let collisionRadius = 90;

    if (screenWidth < 640) {
      scale = 0.7;
      fontSize = '9px';
      maxLabelLength = 10;
      linkDistance = 80;
      chargeStrength = -120;
      collisionRadius = 40;
    } else if (screenWidth < 768) {
      scale = 0.85;
      fontSize = '10px';
      maxLabelLength = 14;
      linkDistance = 100;
      chargeStrength = -160;
      collisionRadius = 50;
    } else if (screenWidth < 1024) {
      scale = 1.0;
      fontSize = '12px';
      maxLabelLength = 18;
      linkDistance = 130;
      chargeStrength = -250;
      collisionRadius = 70;
    } else if (screenWidth < 1280) {
      scale = 1.15;
      fontSize = '13px';
      maxLabelLength = 22;
      linkDistance = 145;
      chargeStrength = -300;
      collisionRadius = 80;
    }

    svg.selectAll('*').remove();
    svg.attr('width', width).attr('height', containerHeight);

    const linkColor = isDark ? 'rgba(148, 163, 184, 0.25)' : 'rgba(148, 163, 184, 0.35)';
    const linkHighlightColor = isDark ? 'rgba(148, 163, 184, 0.6)' : 'rgba(100, 116, 139, 0.7)';
    const linkFadedColor = isDark ? 'rgba(148, 163, 184, 0.08)' : 'rgba(148, 163, 184, 0.12)';
    const nodeFill = isDark ? 'rgba(148, 163, 184, 0.5)' : 'rgba(100, 116, 139, 0.5)';
    const nodeStroke = isDark ? 'rgba(148, 163, 184, 0.35)' : 'rgba(100, 116, 139, 0.4)';
    const textColor = isDark ? '#94a3b8' : '#64748b';
    const hoverTextColor = isDark ? '#cbd5e1' : '#334155';

    const simulation = d3
      .forceSimulation<GraphNode, GraphEdge>(nodes)
      .force(
        'link',
        d3
          .forceLink<GraphNode, GraphEdge>(edges)
          .id((d) => d.id)
          .distance(linkDistance)
      )
      .force('charge', d3.forceManyBody<GraphNode>().strength(chargeStrength))
      .force('center', d3.forceCenter(width / 2, containerHeight / 2))
      .force('collision', d3.forceCollide<GraphNode>().radius(collisionRadius))
      .force('x', d3.forceX(width / 2).strength(0.03))
      .force('y', d3.forceY(containerHeight / 2).strength(0.03));

    simulationRef.current = simulation;

    const link = svg
      .append('g')
      .selectAll('line')
      .data(edges)
      .enter()
      .append('line')
      .attr('stroke', linkColor)
      .attr('stroke-width', 0.8)
      .attr('stroke-linecap', 'round')
      .attr('class', 'edge-line');

    const node = svg
      .append('g')
      .selectAll('g')
      .data(nodes)
      .enter()
      .append('g')
      .attr('class', 'node')
      .attr('cursor', 'pointer')
      .style('touch-action', 'none') // 禁止触摸时的默认滚动行为
      .call(
        d3
          .drag<SVGGElement, GraphNode>()
          .on('start', dragstarted)
          .on('drag', dragged)
          .on('end', dragended)
      );

    node.each(function (d: GraphNode) {
      const g = d3.select(this);
      const r = getNodeSize(d.weight) * 0.4 * scale;

      g.append('circle')
        .attr('r', r)
        .attr('fill', nodeFill)
        .attr('stroke', nodeStroke)
        .attr('stroke-width', 0.6)
        .attr('class', 'node-circle');

      g.append('text')
        .attr('class', 'node-label')
        .attr('x', r + 6)
        .attr('y', 3)
        .attr('font-size', fontSize)
        .attr('font-weight', 400)
        .attr('fill', textColor)
        .style('pointer-events', 'none')
        .style('user-select', 'none')
        .style('letter-spacing', '-0.01em')
        .text(() => {
          const label = d.label;
          if (label.length > maxLabelLength) return label.substring(0, maxLabelLength) + '...';
          return label;
        });
    });

    node.on('mouseover', function (_event, d) {
      d3.select(this)
        .select('.node-circle')
        .transition()
        .duration(120)
        .attr('fill', hoverTextColor)
        .attr('stroke', isDark ? '#e2e8f0' : '#1e293b')
        .attr('stroke-width', 1);

      d3.select(this)
        .select('.node-label')
        .transition()
        .duration(120)
        .attr('fill', hoverTextColor)
        .attr('font-weight', 500);

      link.each(function (edge) {
        const edgeD = edge as unknown as GraphEdge;
        const sourceId =
          typeof edgeD.source === 'string' ? edgeD.source : (edgeD.source as GraphNode).id;
        const targetId =
          typeof edgeD.target === 'string' ? edgeD.target : (edgeD.target as GraphNode).id;

        if (sourceId === d.id || targetId === d.id) {
          d3.select(this)
            .transition()
            .duration(120)
            .attr('stroke', linkHighlightColor)
            .attr('stroke-width', 1.2);
        } else {
          d3.select(this)
            .transition()
            .duration(120)
            .attr('stroke', linkFadedColor)
            .attr('stroke-width', 0.4);
        }
      });
    });

    node.on('mouseout', function (_event, _d) {
      d3.select(this)
        .select('.node-circle')
        .transition()
        .duration(120)
        .attr('fill', nodeFill)
        .attr('stroke', nodeStroke)
        .attr('stroke-width', 0.6);

      d3.select(this)
        .select('.node-label')
        .transition()
        .duration(120)
        .attr('fill', textColor)
        .attr('font-weight', 400);

      link.each(function () {
        d3.select(this)
          .transition()
          .duration(120)
          .attr('stroke', linkColor)
          .attr('stroke-width', 0.8);
      });
    });

    node.on('click', function (event, d) {
      event.stopPropagation();
      handleNodeClick(d);
    });

    function dragstarted(event: d3.D3DragEvent<SVGGElement, GraphNode, GraphNode>) {
      if (!event.active) simulation.alphaTarget(0.1).restart();
      event.subject.fx = event.x;
      event.subject.fy = event.y;
    }

    function dragged(event: d3.D3DragEvent<SVGGElement, GraphNode, GraphNode>) {
      event.subject.fx = event.x;
      event.subject.fy = event.y;
    }

    function dragended(event: d3.D3DragEvent<SVGGElement, GraphNode, GraphNode>) {
      if (!event.active) simulation.alphaTarget(0);
      event.subject.fx = null as unknown as number | undefined;
      event.subject.fy = null as unknown as number | undefined;
    }

    simulation.on('tick', () => {
      link
        .attr('x1', (d) => (d.source as unknown as GraphNode).x ?? 0)
        .attr('y1', (d) => (d.source as unknown as GraphNode).y ?? 0)
        .attr('x2', (d) => (d.target as unknown as GraphNode).x ?? 0)
        .attr('y2', (d) => (d.target as unknown as GraphNode).y ?? 0);

      node.attr('transform', (d) => `translate(${d.x ?? 0},${d.y ?? 0})`);
    });

    const handleResize = () => {
      if (!containerRef.current) return;
      const newWidth = containerRef.current.clientWidth;
      const newHeight = containerRef.current.clientHeight;
      if (newWidth > 0 && newHeight > 0) {
        svg.attr('width', newWidth).attr('height', newHeight);
        simulation.force('center', d3.forceCenter(newWidth / 2, newHeight / 2));
        simulation.force('x', d3.forceX(newWidth / 2).strength(0.02));
        simulation.force('y', d3.forceY(newHeight / 2).strength(0.02));
        simulation.alpha(0.1).restart();
      }
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      simulation.stop();
    };
  }, [graphData, theme, handleNodeClick, isPreview, highlightedLabels, height]);

  if (!graphData) {
    return (
      <div
        className="w-full flex items-center justify-center"
        style={{ height: `${containerHeight}px` }}
      >
        <div
          className={`text-center ${theme === 'dark' ? 'text-gray-600' : 'text-gray-400'} text-xs tracking-wide`}
        >
          Loading...
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full">
      <div
        ref={containerRef}
        className="w-full"
        style={{ height: `${containerHeight}px`, cursor: 'grab', touchAction: 'auto' }}
      >
        <svg ref={svgRef} className="w-full h-full" />
      </div>
    </div>
  );
}
