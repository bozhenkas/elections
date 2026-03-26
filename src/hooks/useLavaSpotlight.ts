import { useEffect, useRef, useCallback, type MouseEvent as ReactMouseEvent } from 'react'

export function useLavaSpotlight() {
  const xRef = useRef(50)
  const yRef = useRef(50)
  const targetRef = useRef({ x: 50, y: 50 })
  const rafRef = useRef<number>(0)
  const elRef = useRef<HTMLElement | null>(null)
  const activeRef = useRef(false)
  const ease = 0.12

  const animate = useCallback(() => {
    const el = elRef.current
    if (!el) { rafRef.current = 0; return }

    const dx = targetRef.current.x - xRef.current
    const dy = targetRef.current.y - yRef.current

    if (Math.abs(dx) > 0.05 || Math.abs(dy) > 0.05) {
      xRef.current += dx * ease
      yRef.current += dy * ease
    }

    el.style.setProperty('--gx', `${xRef.current}%`)
    el.style.setProperty('--gy', `${yRef.current}%`)

    if (activeRef.current || Math.abs(dx) > 0.05 || Math.abs(dy) > 0.05) {
      rafRef.current = requestAnimationFrame(animate)
    } else {
      rafRef.current = 0
    }
  }, [])

  const onMouseMove = useCallback((e: ReactMouseEvent<HTMLElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    targetRef.current = {
      x: ((e.clientX - rect.left) / rect.width) * 100,
      y: ((e.clientY - rect.top) / rect.height) * 100,
    }
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
  }, [])

  useEffect(() => {
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current) }
  }, [])

  return { onMouseMove, onMouseLeave }
}
