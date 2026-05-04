import { useEffect, useRef } from 'react'

export function StarField() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animationId: number
    let particles: Array<{ x: number; y: number; speed: number; size: number; opacity: number }> = []

    const resize = () => {
      const rect = canvas.parentElement?.getBoundingClientRect()
      if (rect) {
        canvas.width = rect.width
        canvas.height = rect.height
      }
    }

    resize()
    window.addEventListener('resize', resize)

    const createParticles = () => {
      particles = []
      const count = Math.floor((canvas.width * canvas.height) / 15000)
      for (let i = 0; i < count; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          speed: 2 + Math.random() * 4,
          size: 1 + Math.random() * 2,
          opacity: 0.3 + Math.random() * 0.7
        })
      }
    }

    createParticles()

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      particles.forEach((particle) => {
        particle.y += particle.speed

        if (particle.y > canvas.height) {
          particle.y = 0
          particle.x = Math.random() * canvas.width
        }

        ctx.beginPath()
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(74, 222, 128, ${particle.opacity})`
        ctx.fill()

        const gradient = ctx.createRadialGradient(
          particle.x, particle.y, 0,
          particle.x, particle.y, particle.size * 2
        )
        gradient.addColorStop(0, `rgba(74, 222, 128, ${particle.opacity * 0.5})`)
        gradient.addColorStop(1, 'rgba(74, 222, 128, 0)')
        ctx.fillStyle = gradient
        ctx.beginPath()
        ctx.arc(particle.x, particle.y, particle.size * 2, 0, Math.PI * 2)
        ctx.fill()
      })

      animationId = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener('resize', resize)
      cancelAnimationFrame(animationId)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none"
    />
  )
}
