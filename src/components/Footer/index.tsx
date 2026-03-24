import { useI18n } from '../../stores/i18n'
import './Footer.css'

export default function Footer() {
  const { t } = useI18n()

  return (
    <footer className="footer">
      <p className="footer__copy">&copy; 2026</p>
      <p className="footer__org">{t('footer.org')}</p>
      <p className="footer__credits">
        designed by{' '}
        <a href="https://t.me/debozhe" target="_blank" rel="noopener noreferrer">
          bozhenkas
        </a>
        , developed by{' '}
        <a href="https://vk.com/tech__dep" target="_blank" rel="noopener noreferrer">
          TechDep
        </a>
        .
      </p>
    </footer>
  )
}
