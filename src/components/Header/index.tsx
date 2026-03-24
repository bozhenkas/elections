import UserDropdown from '../UserDropdown'
import { useI18n } from '../../stores/i18n'
import './Header.css'

interface HeaderProps {
  user?: { name: string } | null
  onLogin?: () => void
  onLogout?: () => void
}

export default function Header({ user, onLogin, onLogout }: HeaderProps) {
  const { lang, setLang, t } = useI18n()

  const toggleLang = (e: React.MouseEvent) => {
    e.stopPropagation()
    setLang(lang === 'ru' ? 'en' : 'ru')
  }

  return (
    <header className="header">
      <div className="header__logo">
        <img src={t('header.logo')} alt="Elections SPbGUT" className="header__logo-img" />
      </div>

      <div className="header__ornament">
        <img src="/assets/atoms/logo_sut_sc.svg" alt="" width="55" height="55" />
      </div>

      <div className="header__actions">
        <div className="header__pill">
          <button className="header__lang-btn" onClick={toggleLang}>
            {lang}
          </button>
          {user ? (
            <UserDropdown name={user.name} onLogout={onLogout || (() => {})} />
          ) : (
            <button className="header__login-btn" onClick={onLogin}>
              {t('header.login')}
            </button>
          )}
        </div>
      </div>
    </header>
  )
}
