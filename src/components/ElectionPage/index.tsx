import { useState, useMemo } from 'react'
import { useI18n } from '../../stores/i18n'
import { VOTE_WINDOW_HOURS } from '../../constants'
import Badge from '../Badge'
import Timer from '../Timer'
import Modal from '../Modal'
import WireframeBallot from '../WireframeBallot'
import type { MockElection } from '../../mock'
import './ElectionPage.css'

// Страница конкретных выборов (условный роут /elections/:id)
// Доступна без авторизации — голосование только с авторизацией

interface ElectionPageProps {
  election: MockElection
  isAuthorized: boolean
  hasVoted: boolean
  onLogin: () => void
  onViewCandidate: (candidateId: string) => void
  onBack: () => void
}

export default function ElectionPage({
  election,
  isAuthorized,
  hasVoted,
  onLogin,
  onViewCandidate,
  onBack,
}: ElectionPageProps) {
  const { t } = useI18n()
  const [ballotOpen, setBallotOpen] = useState(false)
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [successOpen, setSuccessOpen] = useState(false)
  const [votedLocal, setVotedLocal] = useState(hasVoted)
  const [expandedIdx, setExpandedIdx] = useState<number | null>(null)

  const statusLabel = election.status === 'upcoming'
    ? t('election.upcoming')
    : election.status === 'active'
      ? t('election.active')
      : t('election.completed')
  const statusVariant = election.status === 'active' ? 'pink' : 'outline' as const

  // TODO backend: заменить на реальное время окончания из API вместо now + VOTE_WINDOW_HOURS
  const endDate = useMemo(() => {
    const d = new Date()
    d.setHours(d.getHours() + VOTE_WINDOW_HOURS)
    return d
  }, [])

  const handleGetBallot = () => {
    if (!isAuthorized) {
      onLogin()
      return
    }
    setBallotOpen(true)
  }

  const handleVoteSubmit = () => {
    setBallotOpen(false)
    setConfirmOpen(true)
  }

  const handleConfirm = () => {
    setConfirmOpen(false)
    setVotedLocal(true)
    setSuccessOpen(true)
    // TODO backend: POST /api/vote
  }

  return (
    <div className="el-page">
      {/* Navigation */}
      <button className="el-page__back" onClick={onBack}>{t('elpage.back')}</button>

      {/* Header */}
      <div className="el-page__header">
        <div className="el-page__meta">
          <span className="el-page__decor">{t('election.decor')}</span>
          <h2 className="el-page__title">
            {t('election.chairman')}
            {'\n'}
            {t('election.subtitle')}
          </h2>
        </div>
        <div className="el-page__badges">
          <Badge variant={statusVariant}>{statusLabel}</Badge>
          <Badge variant="outline-pink">{t('election.date')}</Badge>
          <Badge variant="pink">{election.time}</Badge>
          <Badge variant="outline-pink">{election.year}</Badge>
        </div>
      </div>

      {/* Timer for active elections */}
      {election.status === 'active' && (
        <Timer targetDate={endDate} />
      )}

      {/* Candidates */}
      <div className="el-page__section">
        <h3 className="el-page__section-title">{t('elpage.candidates')}</h3>
        <div className="el-page__candidates">
          {election.candidates.map((c, i) => (
            <div key={c.id} className="el-page__candidate">
              <div className="el-page__candidate-main">
                <div className="el-page__candidate-photo">
                  {c.photoUrl ? (
                    <img src={c.photoUrl} alt={c.name} loading="lazy" />
                  ) : (
                    <svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <circle cx="40" cy="40" r="40" fill="#243434"/>
                      <circle cx="40" cy="30" r="14" fill="#CDDCDC" opacity="0.4"/>
                      <path d="M16 72C16 56 26 48 40 48C54 48 64 56 64 72" fill="#CDDCDC" opacity="0.4"/>
                    </svg>
                  )}
                </div>
                <div className="el-page__candidate-info">
                  <span className="el-page__candidate-name">{c.name}</span>
                  <span className="el-page__candidate-details">{c.faculty}, {c.course}</span>
                </div>
                <div className="el-page__candidate-actions">
                  <button
                    className="el-page__candidate-btn el-page__candidate-btn--program"
                    onClick={() => setExpandedIdx(expandedIdx === i ? null : i)}
                  >
                    {expandedIdx === i ? t('elpage.collapse') : t('elpage.program')}
                  </button>
                  <button
                    className="el-page__candidate-btn el-page__candidate-btn--detail"
                    onClick={() => onViewCandidate(c.id)}
                  >
                    {t('elpage.details')}
                  </button>
                </div>
              </div>
              {expandedIdx === i && (
                <div className="el-page__candidate-program">
                  <div className="wf-block">
                    <span className="wf-block__label">{t('elpage.wireframeProgram')}</span>
                    <p className="wf-block__text wf-block__text--pre">{c.program}</p>
                    <p className="wf-block__note">// TODO дизайнер: CANDIDATE-01 · стилизация программы</p>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Action area */}
      {election.status !== 'completed' && (
        <div className="el-page__action">
          {votedLocal ? (
            <div className="wf-block wf-block--centered">
              <span className="wf-block__label">{t('elpage.wireframeVoted')}</span>
              <div className="wf-block__icon">✓</div>
              <p className="el-page__action-title">{t('elpage.alreadyVoted')}</p>
              <p className="wf-block__sub">{t('elpage.voteRecorded')}</p>
              <p className="wf-block__note">// TODO: показать код голоса · DESIGN_TASKS: CARD-02</p>
            </div>
          ) : election.status === 'upcoming' ? (
            <div className="wf-block wf-block--centered">
              <span className="wf-block__label">{t('elpage.wireframeWaiting')}</span>
              <div className="wf-block__icon">◷</div>
              <p className="el-page__action-title">{t('elpage.notStarted')}</p>
              <p className="wf-block__sub">{t('elpage.canVoteAt')} {t('election.date')} {t('elpage.in')} {election.time}</p>
            </div>
          ) : (
            <div className="el-page__ballot-action">
              <button className="el-page__ballot-btn" onClick={handleGetBallot}>
                {isAuthorized ? t('elpage.getBallot') : t('elpage.loginAndVote')}
              </button>
              {!isAuthorized && (
                <p className="el-page__ballot-hint">{t('elpage.authRequired')}</p>
              )}
              {isAuthorized && (
                <p className="el-page__ballot-hint">{t('elpage.noChange')}</p>
              )}
            </div>
          )}
        </div>
      )}

      {/* Results for completed elections */}
      {election.status === 'completed' && (
        <div className="el-page__section">
          <h3 className="el-page__section-title">{t('elpage.resultsSection')}</h3>
          <div className="wf-block">
            <span className="wf-block__label">{t('elpage.wireframeResults')}</span>
            <p className="wf-block__text">
              {t('elpage.resultsDesc')}
            </p>
            <p className="wf-block__note">// TODO: ResultChart + данные из API · DESIGN_TASKS: ARCHIVE-01</p>
          </div>
        </div>
      )}

      {/* ─── Ballot modal ───────────────────────────────────────────── */}
      <Modal isOpen={ballotOpen} onClose={() => setBallotOpen(false)}>
        <WireframeBallot
          candidates={election.candidates}
          onVote={handleVoteSubmit}
        />
      </Modal>

      {/* ─── Confirm modal ──────────────────────────────────────────── */}
      <Modal isOpen={confirmOpen} onClose={() => setConfirmOpen(false)}>
        <div className="wf-block wf-block--centered">
          <span className="wf-block__label">{t('elpage.wireframeConfirm')}</span>
          <p className="vote-form__question">{t('vote.sure')}</p>
          <p className="vote-form__candidate">{t('vote.willBeRecorded')}</p>
          <div className="vote-form__actions">
            <button className="vote-form__yes" onClick={handleConfirm}>{t('vote.confirm')}</button>
            <button className="vote-form__cancel" onClick={() => { setConfirmOpen(false); setBallotOpen(true) }}>{t('vote.change')}</button>
          </div>
          <p className="wf-block__note">// TODO дизайнер: BALLOT-02 · подтверждение</p>
        </div>
      </Modal>

      {/* ─── Success modal ──────────────────────────────────────────── */}
      <Modal isOpen={successOpen} onClose={() => setSuccessOpen(false)}>
        <div className="wf-block wf-block--centered">
          <span className="wf-block__label">{t('elpage.wireframeVoteRecorded')}</span>
          <div className="vote-success__icon">
            <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="32" cy="32" r="30" stroke="#CDDCDC" strokeWidth="1.5"/>
              <path d="M20 32L28 40L44 24" stroke="#CDDCDC" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <p className="vote-success__title">{t('vote.recorded')}</p>
          <p className="vote-success__subtitle">{t('vote.thanks')}</p>
          <div className="wf-block__vote-id">
            <span className="wf-block__note">{t('elpage.voteCode')}: #VT-2025-XXXX</span>
          </div>
          <button className="wf-block__btn" onClick={() => setSuccessOpen(false)}>
            {t('vote.close')}
          </button>
          <p className="wf-block__note">// TODO backend: реальный ID голоса · DESIGN_TASKS: BALLOT-03</p>
        </div>
      </Modal>
    </div>
  )
}
