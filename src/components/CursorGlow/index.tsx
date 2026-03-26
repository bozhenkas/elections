import { useEffect, useRef, useState } from 'react'
import './CursorGlow.css'

const CLICKABLE = 'a, button, [role="button"], [onclick], .arc-card--front, .arc-card__back-click, .arc-card__cta-inline, .election-card, .wf-ballot__candidate, .faq__item, input[type="radio"], input[type="checkbox"], label'

export default function CursorGlow() {
  const cursorRef = useRef<HTMLDivElement>(null)
  const [clicking, setClicking] = useState(false)
  const [hasPointer, setHasPointer] = useState(true)

  useEffect(() => {
    // Hide entirely on touch-only devices
    if (!window.matchMedia('(pointer: fine)').matches) {
      setHasPointer(false)
      return
    }
  }, [])

  useEffect(() => {
    if (!hasPointer) return
    let raf: number
    let mouseX = window.innerWidth / 2
    let mouseY = window.innerHeight / 2
    let curX = mouseX, curY = mouseY
    const cursorEase = 0.65

    const show = () => { if (cursorRef.current) cursorRef.current.style.opacity = '' }
    const hide = () => { if (cursorRef.current) cursorRef.current.style.opacity = '0' }

    const onMove = (e: MouseEvent) => {
      mouseX = e.clientX
      mouseY = e.clientY
      show()
      const target = e.target as HTMLElement
      setClicking(target.closest(CLICKABLE) !== null)
    }

    const update = () => {
      curX += (mouseX - curX) * cursorEase
      curY += (mouseY - curY) * cursorEase
      if (cursorRef.current) cursorRef.current.style.transform = `translate(${curX}px, ${curY}px)`
      raf = requestAnimationFrame(update)
    }

    // Works in Chrome/Firefox
    const onLeave = () => hide()

    // Safari: mouseout with null relatedTarget = left the page
    const onOut = (e: MouseEvent) => {
      if (!e.relatedTarget) hide()
    }

    window.addEventListener('mousemove', onMove)
    document.addEventListener('mouseleave', onLeave)
    document.documentElement.addEventListener('mouseleave', onLeave)
    document.documentElement.addEventListener('mouseout', onOut)
    raf = requestAnimationFrame(update)

    return () => {
      window.removeEventListener('mousemove', onMove)
      document.removeEventListener('mouseleave', onLeave)
      document.documentElement.removeEventListener('mouseleave', onLeave)
      document.documentElement.removeEventListener('mouseout', onOut)
      cancelAnimationFrame(raf)
    }
  }, [hasPointer])

  if (!hasPointer) return null

  return (
    <div ref={cursorRef} className="cursor-custom" aria-hidden>
      <img
        src={clicking ? '/assets/atoms/cursor_click.svg' : '/assets/atoms/cursor_normal.svg'}
        alt=""
        draggable={false}
      />
    </div>
  )
}
