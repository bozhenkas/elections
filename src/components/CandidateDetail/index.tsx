import { useI18n } from '../../stores/i18n'
import type { MockCandidate } from '../../mock'
import './CandidateDetail.css'

// Страница кандидата (условный роут /elections/:id/candidates/:cid)
// WIREFRAME — требует дизайна от дизайнера (см. DESIGN_TASKS.md → CANDIDATE-01)

interface CandidateDetailProps {
  candidate: MockCandidate
  electionTitle: string
  onBack: () => void
  onVote?: () => void
}

export default function CandidateDetail({
  candidate,
  electionTitle,
  onBack,
  onVote,
}: CandidateDetailProps) {
  const { t } = useI18n()
  return (
    <div className="cd">
      <button className="cd__back" onClick={onBack}>{t('candidate.back')}</button>

      {/* Election context */}
      <div className="cd__election-context">
        <span className="cd__election-decor">{t('election.decor')}</span>
        <span className="cd__election-title">{electionTitle}</span>
      </div>

      {/* Hero: photo + info */}
      <div className="cd__hero">
        <div className="cd__photo">
          {candidate.photoUrl ? (
            <img src={candidate.photoUrl} alt={candidate.name} />
          ) : (
            <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="100" cy="100" r="100" fill="#243434"/>
              <circle cx="100" cy="75" r="35" fill="#CDDCDC" opacity="0.4"/>
              <path d="M40 180C40 140 65 120 100 120C135 120 160 140 160 180" fill="#CDDCDC" opacity="0.4"/>
            </svg>
          )}
        </div>

        <div className="cd__info">
          <h2 className="cd__name">{candidate.name}</h2>
          <div className="cd__meta">
            <span className="cd__meta-item">{candidate.faculty}</span>
            <span className="cd__meta-sep">·</span>
            <span className="cd__meta-item">{candidate.course}</span>
            {candidate.age && (
              <>
                <span className="cd__meta-sep">·</span>
                <span className="cd__meta-item">{candidate.age} {t('candidate.age')}</span>
              </>
            )}
            {candidate.group && (
              <>
                <span className="cd__meta-sep">·</span>
                <span className="cd__meta-item">{t('candidate.group')} {candidate.group}</span>
              </>
            )}
          </div>

          {/* Contacts wireframe */}
          <div className="wf-block cd__contacts-wf">
            <span className="wf-block__label">wireframe · {t('candidate.contacts')}</span>
            <div className="cd__contacts-list">
              {candidate.contacts.vk && (
                <a href={candidate.contacts.vk} target="_blank" rel="noopener noreferrer" className="cd__contact-link">
                  VK ↗
                </a>
              )}
              {candidate.contacts.telegram && (
                <a href={candidate.contacts.telegram} target="_blank" rel="noopener noreferrer" className="cd__contact-link">
                  Telegram ↗
                </a>
              )}
              {!candidate.contacts.vk && !candidate.contacts.telegram && (
                <span className="cd__contact-empty">{t('candidate.noContacts')}</span>
              )}
            </div>
            <p className="wf-block__note">// TODO дизайнер: стилизация контактов · CANDIDATE-01</p>
          </div>

          {/* Action buttons */}
          <div className="cd__actions">
            <button className="cd__back-btn" onClick={onBack}>{t('candidate.back')}</button>
            {onVote && (
              <button className="cd__vote-btn" onClick={onVote}>{t('candidate.toVoting')}</button>
            )}
          </div>
        </div>
      </div>

      {/* Bio */}
      <div className="cd__section">
        <h3 className="cd__section-title">{t('candidate.about')}</h3>
        <div className="wf-block">
          <span className="wf-block__label">wireframe · {t('candidate.about')}</span>
          <p className="wf-block__text">{candidate.bio}</p>
          <p className="wf-block__note">// TODO дизайнер: CANDIDATE-01 · стилизация биографии</p>
        </div>
      </div>

      {/* Program */}
      <div className="cd__section">
        <h3 className="cd__section-title">{t('candidate.program')}</h3>
        <div className="wf-block">
          <span className="wf-block__label">wireframe · {t('candidate.program')}</span>
          <p className="wf-block__text wf-block__text--pre">{candidate.program}</p>
          <p className="wf-block__note">// TODO дизайнер: CANDIDATE-01 · стилизация программы</p>
        </div>
      </div>
    </div>
  )
}
