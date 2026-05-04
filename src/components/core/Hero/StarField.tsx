import { useEffect, useRef, useState } from 'react'

export function StarField() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [hasPlayed, setHasPlayed] = useState(false)

  useEffect(() => {
    if (hasPlayed) return

    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animationId: number
    let particles: Array<{ x: number; y: number; speed: number; size: number; opacity: number; life: number; maxLife: number }> = []
    let time = 0

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
      const count = Math.floor((canvas.width * canvas.height) / 10000)
      for (let i = 0; i < count; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: -50 - Math.random() * canvas.height,
          speed: 3 + Math.random() * 4,
          size: 1.5 + Math.random() * 2.5,
          opacity: 0.5 + Math.random() * 0.5,
          life: 0,
          maxLife: 100 + Math.random() * 100
        })
      }
    }

    createParticles()

    const animate = () => {
      time++
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      particles.forEach((particle) => {
        particle.life++
        particle.y += particle.speed
        particle.opacity = Math.max(0, particle.opacity - 0.002)

        if (particle.life < particle.maxLife) {
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

      const allDead = particles.every(p => p.life > p.maxLife)

      if (!allDead) {
        animationId = requestAnimationFrame(animate)
      } else {
        setHasPlayed(true)
      }
    }

    animate()

    return () => {
      window.removeEventListener('resize', resize)
      if (animationId) {
        cancelAnimationFrame(animationId)
      }
    }
  }, [hasPlayed])

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none"
    />
  )
}
