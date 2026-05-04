import { useEffect, useRef } from 'react'

export function StarField() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animationId: number
    let particles: Array<{ x: number; y: number; speed: number; size: number; opacity: number; life: number; maxLife: number }> = []

    const resize = () => {
      const rect = canvas.parentElement?.getBoundingClientRect()
      if (rect && rect.width > 0 && rect.height > 0) {
        canvas.width = rect.width
        canvas.height = rect.height
      }
    }

    const createParticles = () => {
      particles = []
      const count = Math.floor((canvas.width * canvas.height) / 10000)
      for (let i = 0; i < count; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          speed: 2 + Math.random() * 3,
          size: 1.5 + Math.random() * 2.5,
          opacity: 0.5 + Math.random() * 0.5,
          life: 0,
          maxLife: 100 + Math.random() * 100
        })
      }
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      particles.forEach((particle) => {
        particle.life++
        particle.y -= particle.speed
        particle.opacity = Math.max(0, particle.opacity - 0.002)

        if (particle.life < particle.maxLife && particle.y > -10) {
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
        }
      })

      const visibleParticles = particles.filter(p => p.life < p.maxLife && p.y > -10)

      if (visibleParticles.length > 0) {
        animationId = requestAnimationFrame(animate)
      }
    }

    const handleResize = () => {
      resize()
      createParticles()
      animate()
    }

    resize()
    createParticles()
    animate()

    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
      if (animationId) {
        cancelAnimationFrame(animationId)
      }
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
    />
  )
}
