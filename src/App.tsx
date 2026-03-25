import { useState, useCallback, useMemo } from 'react'
import { I18nContext, useI18nState, useI18n } from './stores/i18n'
import { getElectionById, getCandidateById, getActiveElection } from './mock'
import ErrorBoundary from './components/ErrorBoundary'
import CursorGlow from './components/CursorGlow'
import Header from './components/Header'
import Hero from './components/Hero'
import ElectionCard from './components/ElectionCard'
import FAQSection from './components/FAQSection'
import Footer from './components/Footer'
import Modal from './components/Modal'
import ArchiveSection from './components/ArchiveSection'
import ElectionPage from './components/ElectionPage'
import CandidateDetail from './components/CandidateDetail'
import './styles/global.css'
import './App.css'

function useFaqItems() {
  const { t } = useI18n()
  return useMemo(() => [
    { question: t('faq.q1'), answer: t('faq.a1') },
    { question: t('faq.q2'), answer: t('faq.a2') },
    { question: t('faq.q3'), answer: t('faq.a3') },
    { question: t('faq.q4'), answer: t('faq.a4') },
  ], [t])
}

interface User {
  name: string
}

export default function App() {
  const i18n = useI18nState()
  const [user, setUser] = useState<User | null>(null)
  const [hasVoted, setHasVoted] = useState(false)
  const [authModalOpen, setAuthModalOpen] = useState(false)

  // Modal-based navigation (no routing — per CLAUDE.md)
  const [electionModalId, setElectionModalId] = useState<string | null>(null)
  const [candidateModalId, setCandidateModalId] = useState<string | null>(null)

  const handleLogin = useCallback(() => {
    // TODO backend: OAuth через ЛК СПбГУТ
    setUser({ name: 'Стецурин Л.Д.' })
    setAuthModalOpen(false)
  }, [])

  const handleLogout = useCallback(() => {
    setUser(null)
    setHasVoted(false)
  }, [])

  const openAuthModal = useCallback(() => {
    setAuthModalOpen(true)
  }, [])

  const handleElectionClick = useCallback(() => {
    const active = getActiveElection()
    if (active) setElectionModalId(active.id)
  }, [])

  const closeElectionModal = useCallback(() => {
    setElectionModalId(null)
    setCandidateModalId(null)
  }, [])

  const openCandidateModal = useCallback((candidateId: string) => {
    setCandidateModalId(candidateId)
  }, [])

  const closeCandidateModal = useCallback(() => {
    setCandidateModalId(null)
  }, [])

  const handleVoted = useCallback(() => {
    setHasVoted(true)
  }, [])

  const election = electionModalId ? getElectionById(electionModalId) : undefined
  const candidate = candidateModalId ? getCandidateById(candidateModalId) : undefined

  return (
    <I18nContext.Provider value={i18n}>
      <ErrorBoundary>
      <CursorGlow />
      <Header user={user} onLogin={openAuthModal} onLogout={handleLogout} />

      <HomePage onElectionClick={handleElectionClick} />

      {/* ─── Election modal ──────────────────────────────────────── */}
      <Modal isOpen={!!electionModalId && !!election && !candidateModalId} onClose={closeElectionModal}>
        {election && (
          <ElectionPage
            election={election}
            isAuthorized={!!user}
            hasVoted={hasVoted}
            onLogin={openAuthModal}
            onViewCandidate={openCandidateModal}
            onBack={closeElectionModal}
            onVoted={handleVoted}
          />
        )}
      </Modal>

      {/* ─── Candidate detail modal ──────────────────────────────── */}
      <Modal isOpen={!!candidateModalId && !!candidate} onClose={closeCandidateModal}>
        {candidate && election && (
          <CandidateDetail
            candidate={candidate}
            electionTitle={`${i18n.t('election.chairman')} ${i18n.t('election.subtitle')}`}
            onBack={closeCandidateModal}
            onVote={!hasVoted && election.status === 'active' ? closeCandidateModal : undefined}
          />
        )}
      </Modal>

      {/* ─── Auth modal (global) ─────────────────────────────────── */}
      <Modal isOpen={authModalOpen} onClose={() => setAuthModalOpen(false)}>
        <div className="modal-election">
          <div className="modal-election__header">
            <span className="modal-election__decor">{i18n.t('election.decor')}</span>
            <h2 className="modal-election__title">{i18n.t('election.chairman')} {i18n.t('election.subtitle')}</h2>
          </div>
          <div className="wf-block wf-block--centered">
            <span className="wf-block__label">{i18n.t('auth.wireframe')}</span>
            <div className="wf-block__icon">⬡</div>
            <p className="wf-auth__title" style={{ whiteSpace: 'pre-line' }}>{i18n.t('auth.title')}</p>
            <p className="wf-block__sub">{i18n.t('auth.sub')}</p>
            <button className="wf-block__btn" onClick={handleLogin}>
              {i18n.t('auth.btn')} <span className="wf-block__arrow">→</span>
            </button>
            <p className="wf-block__note">// TODO backend: OAuth через ЛК СПбГУТ (см. DESIGN_TASKS.md → AUTH-01)</p>
          </div>
        </div>
      </Modal>
      </ErrorBoundary>
    </I18nContext.Provider>
  )
}

// ─── Home page ───────────────────────────────────────────────────────────────

function HomePage({ onElectionClick }: { onElectionClick: () => void }) {
  const { t } = useI18n()
  const faqItems = useFaqItems()
  const active = getActiveElection()
  return (
    <>
      <Hero />

      <main className="main">
        <ElectionCard
          title={t('election.chairman')}
          date={t('election.date')}
          time={active?.time ?? '10:00 – 18:00'}
          daysLeft={active?.daysLeft}
          onClick={onElectionClick}
        />
      </main>

      <ArchiveSection />
      <FAQSection items={faqItems} />
      <Footer />
    </>
  )
}
