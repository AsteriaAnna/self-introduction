import { useEffect, useRef, useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { buildGraphData } from '@/utils/graphBuilder'

interface Star {
  id: string
  x: number
  y: number
  size: number
  opacity: number
  delay: number
  isPolaris: boolean
  label?: string
  type?: 'skill' | 'project' | 'experience'
}

interface StarFieldProps {
  starCount?: number
  polarisLabel?: string
}

export function StarField({ starCount = 80, polarisLabel = 'Asteria' }: StarFieldProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [hoveredStar, setHoveredStar] = useState<Star | null>(null)
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })
  const navigate = useNavigate()

  const { stars, skillStars } = useMemo(() => {
    const graphData = buildGraphData()
    const allStars: Star[] = []
    const skills: Star[] = []

    for (let i = 0; i < starCount; i++) {
      const isSkill = i < 15
      const isPolaris = i === 0

      const star: Star = {
        id: `star-${i}`,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: isPolaris ? 6 : isSkill ? 4 + Math.random() * 2 : 1 + Math.random() * 2,
        opacity: 0.3 + Math.random() * 0.7,
        delay: Math.random() * 5,
        isPolaris,
        label: isSkill ? graphData.nodes.find(n => n.type === 'skill')?.label : undefined,
        type: isSkill ? 'skill' : undefined
      }

      allStars.push(star)
      if (isSkill && star.label) {
        skills.push(star)
      }
    }

    const usedLabels = new Set<string>()
    const uniqueSkills: Star[] = []
    for (const star of allStars) {
      if (star.label && !usedLabels.has(star.label)) {
        usedLabels.add(star.label)
        uniqueSkills.push(star)
      }
      if (uniqueSkills.length >= 12) break
    }

    return { stars: allStars, skillStars: uniqueSkills }
  }, [starCount])

  useEffect(() => {
    const canvas = canvasRef.current
    const container = containerRef.current
    if (!canvas || !container) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animationId: number
    let time = 0

    const resize = () => {
      const rect = container.getBoundingClientRect()
      canvas.width = rect.width
      canvas.height = rect.height
    }

    resize()
    window.addEventListener('resize', resize)

    const animate = () => {
      time += 0.02
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      stars.forEach((star) => {
        const x = (star.x / 100) * canvas.width
        const y = (star.y / 100) * canvas.height
        const twinkle = Math.sin(time + star.delay) * 0.3 + 0.7
        const size = star.size * twinkle

        ctx.beginPath()
        ctx.arc(x, y, size, 0, Math.PI * 2)

        if (star.isPolaris) {
          const gradient = ctx.createRadialGradient(x, y, 0, x, y, size * 3)
          gradient.addColorStop(0, `rgba(255, 255, 255, ${twinkle})`)
          gradient.addColorStop(0.5, `rgba(74, 222, 128, ${twinkle * 0.5})`)
          gradient.addColorStop(1, 'rgba(74, 222, 128, 0)')
          ctx.fillStyle = gradient
          ctx.arc(x, y, size * 3, 0, Math.PI * 2)
        } else if (star.type === 'skill') {
          ctx.fillStyle = `rgba(74, 222, 128, ${star.opacity * twinkle})`
        } else {
          ctx.fillStyle = `rgba(255, 255, 255, ${star.opacity * twinkle})`
        }

        ctx.fill()

        if (star.isPolaris || star.type === 'skill') {
          ctx.beginPath()
          ctx.arc(x, y, size * 1.5, 0, Math.PI * 2)
          ctx.strokeStyle = star.isPolaris
            ? `rgba(74, 222, 128, ${twinkle * 0.8})`
            : `rgba(74, 222, 128, ${star.opacity * twinkle * 0.5})`
          ctx.lineWidth = 1
          ctx.stroke()
        }
      })

      animationId = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener('resize', resize)
      cancelAnimationFrame(animationId)
    }
  }, [stars])

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = containerRef.current?.getBoundingClientRect()
    if (rect) {
      setMousePos({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      })

      const x = (e.clientX - rect.left) / rect.width * 100
      const y = (e.clientY - rect.top) / rect.height * 100

      const hovered = skillStars.find(star => {
        const dx = star.x - x
        const dy = star.y - y
        return Math.sqrt(dx * dx + dy * dy) < 3
      })

      setHoveredStar(hovered || null)
    }
  }

  const handleClick = () => {
    if (hoveredStar?.label) {
      navigate(`/graph?highlight=${encodeURIComponent(hoveredStar.label)}`)
    }
  }

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 overflow-hidden cursor-pointer"
      onMouseMove={handleMouseMove}
      onClick={handleClick}
    >
      <canvas ref={canvasRef} className="absolute inset-0" />

      {skillStars.map((star) => (
        <div
          key={star.id}
          className="absolute pointer-events-none transition-opacity duration-300"
          style={{
            left: `${star.x}%`,
            top: `${star.y}%`,
            opacity: hoveredStar?.id === star.id ? 1 : 0
          }}
        >
          <div className="transform -translate-x-1/2 -translate-y-1/2 px-3 py-1.5 bg-gray-900/90 dark:bg-gray-800/90 text-white text-xs rounded-full border border-green-500/50 whitespace-nowrap shadow-lg">
            {star.label}
          </div>
        </div>
      ))}

      {hoveredStar && (
        <div className="absolute bottom-4 right-4 text-xs text-green-400/70">
          点击查看相关项目 →
        </div>
      )}
    </div>
  )
}
