import { useEffect, useRef, useCallback, type MouseEvent as ReactMouseEvent } from 'react'

// 8 blobs: some follow cursor, some flee from it, some orbit
const BLOB_COUNT = 8

interface Blob {
  x: number
  y: number
  vx: number
  vy: number
  // Each blob has its own behavior
  ease: number       // how fast it moves
  flee: number       // 0 = follow cursor, >0 = flee from cursor (strength)
  orbit: number      // 0 = no orbit, >0 = orbit radius
  orbitSpeed: number  // orbit angular speed
  angle: number       // current orbit angle
  homeX: number       // resting position X
  homeY: number       // resting position Y
}

function createBlobs(): Blob[] {
  return [
    // 2 blobs follow cursor closely
    { x: 50, y: 50, vx: 0, vy: 0, ease: 0.12, flee: 0, orbit: 0, orbitSpeed: 0, angle: 0, homeX: 50, homeY: 50 },
    { x: 50, y: 50, vx: 0, vy: 0, ease: 0.06, flee: 0, orbit: 0, orbitSpeed: 0, angle: 0, homeX: 50, homeY: 50 },
    // 4 blobs flee from cursor
    { x: 20, y: 20, vx: 0, vy: 0, ease: 0.04, flee: 35, orbit: 0, orbitSpeed: 0, angle: 0, homeX: 15, homeY: 15 },
    { x: 80, y: 20, vx: 0, vy: 0, ease: 0.04, flee: 40, orbit: 0, orbitSpeed: 0, angle: 0, homeX: 85, homeY: 15 },
    { x: 20, y: 80, vx: 0, vy: 0, ease: 0.03, flee: 35, orbit: 0, orbitSpeed: 0, angle: 0, homeX: 15, homeY: 85 },
    { x: 80, y: 80, vx: 0, vy: 0, ease: 0.03, flee: 40, orbit: 0, orbitSpeed: 0, angle: 0, homeX: 85, homeY: 85 },
    // 2 blobs orbit around cursor
    { x: 50, y: 50, vx: 0, vy: 0, ease: 0.08, flee: 0, orbit: 25, orbitSpeed: 0.015, angle: 0, homeX: 50, homeY: 50 },
    { x: 50, y: 50, vx: 0, vy: 0, ease: 0.08, flee: 0, orbit: 18, orbitSpeed: -0.02, angle: Math.PI, homeX: 50, homeY: 50 },
  ]
}

export function useLavaSpotlight() {
  const blobsRef = useRef<Blob[]>(createBlobs())
  const targetRef = useRef({ x: 50, y: 50 })
  const rafRef = useRef<number>(0)
  const elRef = useRef<HTMLElement | null>(null)
  const activeRef = useRef(false)

  const animate = useCallback(() => {
    const el = elRef.current
    if (!el) { rafRef.current = 0; return }

    const blobs = blobsRef.current
    const tx = targetRef.current.x
    const ty = targetRef.current.y

    for (let i = 0; i < BLOB_COUNT; i++) {
      const b = blobs[i]

      if (b.flee > 0 && activeRef.current) {
        // Flee behavior: move away from cursor
        const dx = b.x - tx
        const dy = b.y - ty
        const dist = Math.sqrt(dx * dx + dy * dy) || 1
        const fleeRadius = 45 // flee when cursor is within this %
        const strength = Math.max(0, 1 - dist / fleeRadius)

        // Target is home position + flee push
        const pushX = (dx / dist) * b.flee * strength
        const pushY = (dy / dist) * b.flee * strength
        const goalX = b.homeX + pushX
        const goalY = b.homeY + pushY

        b.x += (goalX - b.x) * b.ease
        b.y += (goalY - b.y) * b.ease
      } else if (b.orbit > 0 && activeRef.current) {
        // Orbit behavior: circle around cursor
        b.angle += b.orbitSpeed
        const goalX = tx + Math.cos(b.angle) * b.orbit
        const goalY = ty + Math.sin(b.angle) * b.orbit
        b.x += (goalX - b.x) * b.ease
        b.y += (goalY - b.y) * b.ease
      } else if (b.flee > 0) {
        // Return to home when not active
        b.x += (b.homeX - b.x) * b.ease
        b.y += (b.homeY - b.y) * b.ease
      } else {
        // Follow cursor
        b.x += (tx - b.x) * b.ease
        b.y += (ty - b.y) * b.ease
      }

      // Clamp to card bounds
      b.x = Math.max(-10, Math.min(110, b.x))
      b.y = Math.max(-10, Math.min(110, b.y))

      el.style.setProperty(`--b${i}x`, `${b.x}%`)
      el.style.setProperty(`--b${i}y`, `${b.y}%`)
    }

    rafRef.current = requestAnimationFrame(animate)
  }, [])

  const onMouseMove = useCallback((e: ReactMouseEvent<HTMLElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width) * 100
    const y = ((e.clientY - rect.top) / rect.height) * 100
    targetRef.current = { x, y }
    elRef.current = e.currentTarget
    activeRef.current = true
    e.currentTarget.style.setProperty('--glow', '1')

    if (!rafRef.current) {
      rafRef.current = requestAnimationFrame(animate)
    }
  }, [animate])

  const onMouseLeave = useCallback((e: ReactMouseEvent<HTMLElement>) => {
    e.currentTarget.style.setProperty('--glow', '0')
    activeRef.current = false
    // animation keeps running so blobs settle to home positions
    setTimeout(() => {
      if (!activeRef.current && rafRef.current) {
        cancelAnimationFrame(rafRef.current)
        rafRef.current = 0
      }
    }, 2000)
  }, [])

  useEffect(() => {
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [])

  return { onMouseMove, onMouseLeave }
}
