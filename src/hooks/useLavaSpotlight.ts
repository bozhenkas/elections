import { useEffect, useRef, useCallback, type MouseEvent as ReactMouseEvent } from 'react'

const BLOB_COUNT = 4
const EASE = [0.14, 0.07, 0.035, 0.018]

export function useLavaSpotlight() {
  const blobsRef = useRef(EASE.map(() => ({ x: 50, y: 50 })))
  const targetRef = useRef({ x: 50, y: 50 })
  const rafRef = useRef<number>(0)
  const elRef = useRef<HTMLElement | null>(null)
  const activeRef = useRef(false)

  const animate = useCallback(() => {
    const el = elRef.current
    if (!el) { rafRef.current = 0; return }

    const blobs = blobsRef.current
    const target = targetRef.current
    let moving = false

    for (let i = 0; i < BLOB_COUNT; i++) {
      const dx = target.x - blobs[i].x
      const dy = target.y - blobs[i].y
      if (Math.abs(dx) > 0.05 || Math.abs(dy) > 0.05) {
        blobs[i].x += dx * EASE[i]
        blobs[i].y += dy * EASE[i]
        moving = true
      }
      el.style.setProperty(`--b${i}x`, `${blobs[i].x}%`)
      el.style.setProperty(`--b${i}y`, `${blobs[i].y}%`)
    }

    if (moving || activeRef.current) {
      rafRef.current = requestAnimationFrame(animate)
    } else {
      rafRef.current = 0
    }
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
    // keep animation running so blobs settle naturally
  }, [])

  useEffect(() => {
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [])

  return { onMouseMove, onMouseLeave }
}
