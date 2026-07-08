import { useEffect, useRef } from 'react'

const COLORS = ['#c77dff', '#f97316', '#22c55e', '#3b82f6', '#eab308', '#ec4899', '#06b6d4']

export default function Confetti({ active }) {
  const canvasRef = useRef(null)
  const animRef   = useRef(null)
  const particles = useRef([])

  useEffect(() => {
    if (!active) return
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')

    // Match canvas size to its CSS size
    const resize = () => {
      canvas.width  = canvas.offsetWidth
      canvas.height = canvas.offsetHeight
    }
    resize()

    // Spawn particles
    particles.current = Array.from({ length: 120 }, () => ({
      x:     Math.random() * canvas.width,
      y:     Math.random() * -canvas.height * 0.5,
      w:     6 + Math.random() * 6,
      h:     3 + Math.random() * 4,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      vx:    (Math.random() - 0.5) * 2.5,
      vy:    2 + Math.random() * 4,
      rot:   Math.random() * 360,
      rotV:  (Math.random() - 0.5) * 8,
      alpha: 1,
    }))

    let start = null
    const DURATION = 3500

    const draw = (ts) => {
      if (!start) start = ts
      const elapsed = ts - start
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      let alive = false
      for (const p of particles.current) {
        p.x   += p.vx
        p.y   += p.vy
        p.vy  += 0.07           // gravity
        p.rot += p.rotV
        if (elapsed > DURATION - 800) p.alpha = Math.max(0, p.alpha - 0.015)

        if (p.y < canvas.height + 20 && p.alpha > 0) {
          alive = true
          ctx.save()
          ctx.translate(p.x, p.y)
          ctx.rotate((p.rot * Math.PI) / 180)
          ctx.globalAlpha = p.alpha
          ctx.fillStyle = p.color
          ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h)
          ctx.restore()
        }
      }

      if (alive && elapsed < DURATION + 500) {
        animRef.current = requestAnimationFrame(draw)
      } else {
        ctx.clearRect(0, 0, canvas.width, canvas.height)
      }
    }

    animRef.current = requestAnimationFrame(draw)
    return () => cancelAnimationFrame(animRef.current)
  }, [active])

  if (!active) return null

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 10,
      }}
    />
  )
}
