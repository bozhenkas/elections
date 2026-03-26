import { useEffect, useRef } from 'react'
import './CursorGlow.css'

const CLICKABLE = 'a, button, [role="button"], [onclick], .arc-card--front, .arc-card__back-click, .arc-card__cta-inline, .election-card, .wf-ballot__candidate, .faq__item, input[type="radio"], input[type="checkbox"], label'

const HAS_POINTER = typeof window !== 'undefined' && window.matchMedia('(pointer: fine)').matches

export default function CursorGlow() {
  const cursorRef = useRef<HTMLDivElement>(null)
  const imgRef = useRef<HTMLImageElement>(null)

  useEffect(() => {
    if (!HAS_POINTER) return

    let raf: number
    let mouseX = window.innerWidth / 2
    let mouseY = window.innerHeight / 2
    let curX = mouseX, curY = mouseY
    const ease = 0.65
    let pressed = false
    let hovering = false
    let currentSrc = 'normal'

    const el = cursorRef.current
    if (!el) return

    const show = () => { el.style.opacity = '' }
    const hide = () => { el.style.opacity = '0' }

    const syncCursor = () => {
      const want = (pressed || hovering) ? 'click' : 'normal'
      if (want !== currentSrc && imgRef.current) {
        currentSrc = want
        imgRef.current.setAttribute('src', `/assets/atoms/cursor_${want}.svg`)
      }
    }

    // Re-check what's under the cursor (works even if mouse didn't move)
    const recheckHover = () => {
      const target = document.elementFromPoint(mouseX, mouseY)
      hovering = !!target?.closest?.(CLICKABLE)
      syncCursor()
    }

    const onMove = (e: PointerEvent) => {
      mouseX = e.clientX
      mouseY = e.clientY

      if (e.clientX <= 1 || e.clientY <= 1 ||
          e.clientX >= window.innerWidth - 1 ||
          e.clientY >= window.innerHeight - 1) {
        hide()
        return
      }

      show()
      hovering = !!(e.target as HTMLElement)?.closest?.(CLICKABLE)
      syncCursor()
    }

    const onDown = () => { pressed = true; syncCursor() }
    const onUp = () => {
      pressed = false
      // DOM may have changed after click (modal open etc.) — re-check hover
      requestAnimationFrame(recheckHover)
    }

    let frameCount = 0
    const loop = () => {
      curX += (mouseX - curX) * ease
      curY += (mouseY - curY) * ease
      el.style.transform = `translate(${curX}px, ${curY}px)`

      // Re-check hover every 30 frames (~0.5s) to catch DOM changes
      if (++frameCount % 30 === 0) recheckHover()

      raf = requestAnimationFrame(loop)
    }

    window.addEventListener('pointermove', onMove)
    document.addEventListener('pointerdown', onDown)
    document.addEventListener('pointerup', onUp)
    document.addEventListener('pointercancel', onUp)
    document.addEventListener('mouseleave', hide)
    document.documentElement.addEventListener('mouseleave', hide)
    window.addEventListener('blur', hide)
    raf = requestAnimationFrame(loop)

    return () => {
      window.removeEventListener('pointermove', onMove)
      document.removeEventListener('pointerdown', onDown)
      document.removeEventListener('pointerup', onUp)
      document.removeEventListener('pointercancel', onUp)
      document.removeEventListener('mouseleave', hide)
      document.documentElement.removeEventListener('mouseleave', hide)
      window.removeEventListener('blur', hide)
      cancelAnimationFrame(raf)
    }
  }, [])

  if (!HAS_POINTER) return null

  return (
    <div ref={cursorRef} className="cursor-custom" aria-hidden>
      <img
        ref={imgRef}
        src="/assets/atoms/cursor_normal.svg"
        alt=""
        draggable={false}
      />
    </div>
  )
}
