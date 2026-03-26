import { useI18n } from '../../stores/i18n'
import { useLavaSpotlight } from '../../hooks/useLavaSpotlight'
import Badge from '../Badge'
import './ElectionCard.css'

type ElectionCardProps = {
  title: string
  subtitle?: string
  date: string
  time: string
  daysLeft?: number
  isArchive?: boolean
  result?: string
  onClick?: () => void
}

export default function ElectionCard({
  title,
  subtitle,
  date,
  time,
  daysLeft,
  isArchive = false,
  result,
  onClick,
}: ElectionCardProps) {
  const { t } = useI18n()
  const { onMouseMove, onMouseLeave } = useLavaSpotlight()

  return (
    <div className="election-card-wrap">
      <div
        className={`election-card glass-spotlight ${isArchive ? 'election-card--archive' : ''}`}
        onClick={onClick}
        onMouseMove={onMouseMove}
        onMouseLeave={onMouseLeave}
      >
        <div className="election-card__content">
          <div className="election-card__badges">
            {!isArchive && <Badge variant="pink">{t('election.upcoming')}</Badge>}
            {isArchive && <Badge variant="outline">{t('election.completed')}</Badge>}
            <Badge variant={isArchive ? 'outline' : 'outline-pink'}>{date}</Badge>
            <Badge variant={isArchive ? 'outline' : 'pink'}>{time}</Badge>
          </div>

          <div className="election-card__text">
            <span className="election-card__decor">{t('election.decor')}</span>
            <h2 className="election-card__title">{title}</h2>
            <h3 className="election-card__subtitle">{subtitle || t('election.subtitle')}</h3>
          </div>

          <div className="election-card__footer">
            {daysLeft != null && (
              <div className="election-card__countdown">
                <Badge variant="outline-pink">{t('election.daysLeft')}</Badge>
                <Badge variant="pink">{` ${daysLeft} ${t('election.days')}`}</Badge>
              </div>
            )}
            {result && (
              <div className="election-card__result">
                <Badge variant="outline">{result}</Badge>
              </div>
            )}
            <button className="election-card__button">
              {isArchive ? t('election.results') : t('election.goto')}
            </button>
          </div>
        </div>

        <div className="election-card__silhouettes">
          <img src="/assets/atoms/avatars.svg" alt="" />
        </div>
      </div>
    </div>
  )
}
