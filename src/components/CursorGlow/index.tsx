import { useEffect, useRef } from 'react'
import './CursorGlow.css'

// Only render on devices with a fine pointer (mouse/trackpad)
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

    const el = cursorRef.current
    if (!el) return

    const show = () => { el.style.opacity = '' }
    const hide = () => { el.style.opacity = '0' }

    const setSrc = (click: boolean) => {
      if (!imgRef.current) return
      imgRef.current.setAttribute('src', click
        ? '/assets/atoms/cursor_click.svg'
        : '/assets/atoms/cursor_normal.svg')
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
    }

    const onDown = () => { pressed = true; setSrc(true) }
    const onUp = () => { pressed = false; setSrc(false) }

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
