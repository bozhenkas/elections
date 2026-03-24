import { useState, useRef, useEffect } from 'react'
import { useI18n } from '../../stores/i18n'
import './UserDropdown.css'

interface UserDropdownProps {
  name: string
  onLogout: () => void
}

export default function UserDropdown({ name, onLogout }: UserDropdownProps) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const { t } = useI18n()

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  return (
    <div className="user-dropdown" ref={ref}>
      <button className="user-dropdown__trigger" onClick={() => setOpen(!open)}>
        <img src="/src/assets/atoms/user_icon.svg" alt="" className="user-dropdown__icon" />
        <span className="user-dropdown__name-btn">{name}</span>
      </button>

      {open && (
        <div className="user-dropdown__menu">
          <div className="user-dropdown__info">
            <span className="user-dropdown__name">{name}</span>
            <span className="user-dropdown__role">{t('header.student')}</span>
          </div>
          <div className="user-dropdown__divider" />
          <button className="user-dropdown__item" onClick={() => { setOpen(false); onLogout() }}>
            {t('header.logout')}
          </button>
        </div>
      )}
    </div>
  )
}
