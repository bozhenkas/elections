import { useState } from 'react'
import { useI18n } from '../../stores/i18n'
import './WireframeBallot.css'

// WIREFRAME — требует дизайна от дизайнера (см. DESIGN_TASKS.md → BALLOT-01, BALLOT-02)
interface Candidate {
  name: string
  faculty: string
  course: string
}

interface WireframeBallotProps {
  candidates: Candidate[]
  electionTitle?: string
  onVote?: () => void
}

export default function WireframeBallot({ candidates, electionTitle = 'ПРЕДСЕДАТЕЛЯ СТУДЕНЧЕСКОГО СОВЕТА', onVote }: WireframeBallotProps) {
  const [selected, setSelected] = useState<number | null>(null)
  const { t } = useI18n()

  return (
    <div className="wf-ballot">
      <div className="wf-ballot__label">wireframe · {t('ballot.decor')}</div>

      <div className="wf-ballot__header">
        <span className="wf-ballot__decor">{t('ballot.decor')}</span>
        <h3 className="wf-ballot__title">{electionTitle}</h3>
      </div>

      <div className="wf-ballot__divider" />

      <p className="wf-ballot__instruction">
        {t('ballot.instruction')}
      </p>

      <div className="wf-ballot__candidates">
        {candidates.map((c, i) => (
          <div
            key={c.name}
            className={`wf-ballot__candidate${selected === i ? ' wf-ballot__candidate--selected' : ''}`}
            onClick={() => setSelected(i)}
          >
            <div className={`wf-ballot__radio${selected === i ? ' wf-ballot__radio--checked' : ''}`} />
            <div className="wf-ballot__candidate-info">
              <span className="wf-ballot__candidate-name">{c.name}</span>
              <span className="wf-ballot__candidate-meta">{c.faculty} · {c.course}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="wf-ballot__footer">
        <button
          className="wf-ballot__btn"
          disabled={selected === null}
          onClick={() => selected !== null && onVote?.()}
        >
          {t('ballot.confirm')}
        </button>
        <p className="wf-ballot__disclaimer">
          {t('ballot.disclaimer')}
        </p>
      </div>

      <p className="wf-ballot__note">// TODO backend: POST /api/vote · TODO дизайнер: BALLOT-01</p>
    </div>
  )
}
