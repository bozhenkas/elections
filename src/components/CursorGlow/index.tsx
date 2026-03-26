import { useEffect, useRef } from 'react'
import './CursorGlow.css'

const CLICKABLE = 'a, button, [role="button"], [onclick], .arc-card--front, .arc-card__back-click, .arc-card__cta-inline, .election-card, .wf-ballot__candidate, .faq__item, input[type="radio"], input[type="checkbox"], label'

// Only render on devices with a fine pointer (mouse/trackpad)
const HAS_POINTER = typeof window !== 'undefined' && window.matchMedia('(pointer: fine)').matches

export default function CursorGlow() {
  const cursorRef = useRef<HTMLDivElement>(null)
  const hoveringRef = useRef(false)
  const pressedRef = useRef(false)
  const imgRef = useRef<HTMLImageElement>(null)

  useEffect(() => {
    if (!HAS_POINTER) return

    let raf: number
    let mouseX = window.innerWidth / 2
    let mouseY = window.innerHeight / 2
    let curX = mouseX, curY = mouseY
    const ease = 0.65

    const el = cursorRef.current
    if (!el) return

    const show = () => { el.style.opacity = '' }
    const hide = () => { el.style.opacity = '0' }

    const updateImg = () => {
      if (!imgRef.current) return
      const src = pressedRef.current || hoveringRef.current
        ? '/assets/atoms/cursor_click.svg'
        : '/assets/atoms/cursor_normal.svg'
      if (imgRef.current.src !== src) imgRef.current.src = src
    }

    const onMove = (e: MouseEvent) => {
      mouseX = e.clientX
      mouseY = e.clientY

      // Boundary check — most reliable Safari workaround for hiding
      // when cursor leaves the viewport
      if (e.clientX <= 1 || e.clientY <= 1 ||
          e.clientX >= window.innerWidth - 1 ||
          e.clientY >= window.innerHeight - 1) {
        hide()
        return
      }

      show()
      const over = !!(e.target as HTMLElement).closest?.(CLICKABLE)
      if (over !== hoveringRef.current) {
        hoveringRef.current = over
        updateImg()
      }
    }

    const onDown = () => { pressedRef.current = true; updateImg() }
    const onUp = () => { pressedRef.current = false; updateImg() }

    const onLeave = () => hide()
    const onBlur = () => hide()

    const loop = () => {
      curX += (mouseX - curX) * ease
      curY += (mouseY - curY) * ease
      el.style.transform = `translate(${curX}px, ${curY}px)`
      raf = requestAnimationFrame(loop)
    }

    window.addEventListener('pointermove', onMove)
    document.addEventListener('pointerdown', onDown)
    document.addEventListener('pointerup', onUp)
    document.addEventListener('pointercancel', onUp)
    document.addEventListener('mouseleave', onLeave)
    document.documentElement.addEventListener('mouseleave', onLeave)
    window.addEventListener('blur', onBlur)
    raf = requestAnimationFrame(loop)

    return () => {
      window.removeEventListener('pointermove', onMove)
      document.removeEventListener('pointerdown', onDown)
      document.removeEventListener('pointerup', onUp)
      document.removeEventListener('pointercancel', onUp)
      document.removeEventListener('mouseleave', onLeave)
      document.documentElement.removeEventListener('mouseleave', onLeave)
      window.removeEventListener('blur', onBlur)
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
