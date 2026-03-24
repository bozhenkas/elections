import { useEffect, useRef, useState } from 'react'
import './CursorGlow.css'

const CLICKABLE = 'a, button, [role="button"], [onclick], .arc-card--front, .arc-card__cta-overlay, .arc-card__cta-inline, .election-card, .wf-ballot__candidate, .faq__item, input[type="radio"], input[type="checkbox"], label'

export default function CursorGlow() {
  const glowRef = useRef<HTMLDivElement>(null)
  const cursorRef = useRef<HTMLDivElement>(null)
  const [clicking, setClicking] = useState(false)

  useEffect(() => {
    let raf: number
    let mouseX = window.innerWidth / 2
    let mouseY = window.innerHeight / 2
    let curX = mouseX, curY = mouseY
    let glowX = mouseX, glowY = mouseY
    // курсор движется быстрее, свечение медленнее — разные коэффициенты ease
    const cursorEase = 0.65
    const glowEase = 0.46

    const onMove = (e: MouseEvent) => {
      mouseX = e.clientX
      mouseY = e.clientY
      const target = e.target as HTMLElement
      const isClickable = target.closest(CLICKABLE) !== null
      setClicking(isClickable)
    }

    const update = () => {
      curX += (mouseX - curX) * cursorEase
      curY += (mouseY - curY) * cursorEase
      glowX += (mouseX - glowX) * glowEase
      glowY += (mouseY - glowY) * glowEase

      if (glowRef.current) glowRef.current.style.transform = `translate(${glowX}px, ${glowY}px)`
      if (cursorRef.current) cursorRef.current.style.transform = `translate(${curX}px, ${curY}px)`

      raf = requestAnimationFrame(update)
    }

    const onLeave = () => {
      if (cursorRef.current) cursorRef.current.style.opacity = '0'
      if (glowRef.current) glowRef.current.style.opacity = '0'
    }
    const onEnter = () => {
      if (cursorRef.current) cursorRef.current.style.opacity = ''
      if (glowRef.current) glowRef.current.style.opacity = ''
    }

    window.addEventListener('mousemove', onMove)
    document.addEventListener('mouseleave', onLeave)
    document.addEventListener('mouseenter', onEnter)
    raf = requestAnimationFrame(update)

    return () => {
      window.removeEventListener('mousemove', onMove)
      document.removeEventListener('mouseleave', onLeave)
      document.removeEventListener('mouseenter', onEnter)
      cancelAnimationFrame(raf)
    }
  }, [])

  return (
    <>
      <div ref={glowRef} className="cursor-glow" aria-hidden />
      <div ref={cursorRef} className="cursor-custom" aria-hidden>
        <img
          src={clicking ? '/assets/atoms/cursor_click.svg' : '/assets/atoms/cursor_normal.svg'}
          alt=""
          draggable={false}
        />
      </div>
    </>
  )
}
