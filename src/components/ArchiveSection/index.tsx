import React, { useState, useRef, useCallback, useMemo } from 'react'
import { MAX_ARCHIVE_STACK } from '../../constants'
import { motion, AnimatePresence } from 'framer-motion'
import { useI18n } from '../../stores/i18n'
import Badge from '../Badge'
import './ArchiveSection.css'

// ─── Types ────────────────────────────────────────────────────────────────────

interface Candidate {
  name: string
  percent: number
  isWinner?: boolean
}

interface Council {
  name: string
  candidates: Candidate[]
}

interface SimpleElection {
  id: string
  decor: string
  title: string
  date: string
  time: string
  year: string
  type: 'simple'
  candidates: Candidate[]
  totalVoters: number
  totalEligible: number
  turnoutPercent: number
}

interface CouncilsElection {
  id: string
  decor: string
  title: string
  date: string
  time: string
  year: string
  type: 'councils'
  councils: Council[]
  totalVoters: number
  totalEligible: number
  turnoutPercent: number
}

type ArchiveItem = SimpleElection | CouncilsElection

// ─── Data (i18n-aware) ───────────────────────────────────────────────────────

function getArchiveItems(t: (key: string) => string): ArchiveItem[] {
  const againstAll = t('archive.againstAll')
  return [
    {
      id: '1',
      decor: t('election.decor'),
      title: t('archive.chairmanTitle'),
      date: t('archive.date_dec18'),
      time: '10:00 – 18:00',
      year: '2025',
      type: 'simple',
      candidates: [
        { name: 'Артём Серебренников', percent: 57, isWinner: true },
        { name: 'Николай Масюткин', percent: 35 },
        { name: againstAll, percent: 8 },
      ],
      totalVoters: 1450,
      totalEligible: 9291,
      turnoutPercent: 57,
    },
    {
      id: '2',
      decor: t('election.decor'),
      title: t('archive.chairsTitle'),
      date: t('archive.date_sep5'),
      time: '10:00 – 18:00',
      year: '2025',
      type: 'councils',
      councils: [
        {
          name: 'ИТПП',
          candidates: [
            { name: 'Малика Гадар Бадар', percent: 57, isWinner: true },
            { name: 'Подставной челик', percent: 20 },
            { name: againstAll.toLowerCase(), percent: 23 },
          ],
        },
        {
          name: 'ИСиТ',
          candidates: [
            { name: 'Малика Гадар Бадар', percent: 57, isWinner: true },
            { name: 'Подставной челик', percent: 20 },
            { name: againstAll.toLowerCase(), percent: 23 },
          ],
        },
        {
          name: 'РТС',
          candidates: [
            { name: 'Малика Гадар Бадар', percent: 57, isWinner: true },
            { name: 'Подставной челик', percent: 20 },
            { name: againstAll.toLowerCase(), percent: 23 },
          ],
        },
      ],
      totalVoters: 1450,
      totalEligible: 9291,
      turnoutPercent: 2.3,
    },
    {
      id: '3',
      decor: t('election.decor'),
      title: t('archive.chairmanTitle'),
      date: t('archive.date_may15'),
      time: '10:00 – 18:00',
      year: '2024',
      type: 'simple',
      candidates: [
        { name: 'Козлова М. А.', percent: 43, isWinner: true },
        { name: 'Новиков К. Р.', percent: 34 },
        { name: 'Фёдорова Е. В.', percent: 23 },
      ],
      totalVoters: 1134,
      totalEligible: 1842,
      turnoutPercent: 62,
    },
  ]
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function PctBlock({ candidate, compact }: { candidate: Candidate; compact?: boolean }) {
  return (
    <div className={`arc-pct${candidate.isWinner ? ' arc-pct--winner' : ''}${compact ? ' arc-pct--compact' : ''}`}>
      <div className="arc-pct__num">
        <span className="arc-pct__value">{candidate.percent}</span>
        <span className="arc-pct__sign">%</span>
      </div>
      <span className="arc-pct__name">{candidate.name}</span>
    </div>
  )
}

function formatTurnout(value: number): string {
  const decimal = value % 1
  if (decimal === 0) return String(value)
  return value.toFixed(1).replace('.', ',')
}

function Turnout({ totalVoters, totalEligible, turnoutPercent }: {
  totalVoters: number; totalEligible: number; turnoutPercent: number
}) {
  const { t, lang } = useI18n()
  const locale = lang === 'ru' ? 'ru-RU' : 'en-US'
  return (
    <div className="arc-turnout">
      <div className="arc-turnout__main">
        <div className="arc-turnout__numbers">
          <div className="arc-turnout__bracket-group">
            <span className="arc-turnout__bracket">(</span>
            <span className="arc-turnout__fraction-text">
              {totalVoters.toLocaleString(locale)}<br />{t('archive.from')}<br />{totalEligible.toLocaleString(locale)}
            </span>
            <span className="arc-turnout__bracket">)</span>
          </div>
          <span className="arc-turnout__num-group">
            <span className="arc-turnout__num">{formatTurnout(turnoutPercent)}</span>
            <span className="arc-turnout__pct-sign">%</span>
          </span>
        </div>
        <span className="arc-turnout__label">{t('archive.turnout')}</span>
      </div>
    </div>
  )
}

function CardHeader({ item }: { item: ArchiveItem }) {
  return (
    <div className="arc-card__head">
      <div className="arc-card__meta">
        <span className="arc-card__decor">{item.decor}</span>
        <h3 className="arc-card__title">{item.title}</h3>
      </div>
      <div className="arc-card__badges">
        <Badge variant="outline-pink">{item.date}</Badge>
        <Badge variant="pink">{item.time}</Badge>
        <Badge variant="outline-pink">{item.year}</Badge>
      </div>
    </div>
  )
}

const EXPAND_SPRING = {
  type: 'spring' as const,
  stiffness: 300,
  damping: 30,
  mass: 0.8,
}

function CardContent({ item, isExpanded, onExpand, onCollapse }: {
  item: ArchiveItem; isExpanded: boolean; onExpand: () => void; onCollapse: () => void
}) {
  const { t } = useI18n()
  return (
    <div className="arc-card__inner">
      <CardHeader item={item} />

      {item.type === 'simple' ? (
        <div className="arc-card__results">
          {item.candidates.map(c => <PctBlock key={c.name} candidate={c} />)}
        </div>
      ) : (
        <AnimatePresence mode="wait">
          {isExpanded ? (
            <motion.div
              key="councils"
              className="arc-card__councils-wrap"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={EXPAND_SPRING}
            >
              <div className="arc-card__councils">
                {item.councils.map((council, i) => (
                  <motion.div
                    key={council.name}
                    className="arc-card__council"
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ ...EXPAND_SPRING, delay: i * 0.06 }}
                  >
                    <div className="arc-card__council-label">
                      <span className="arc-card__council-pre">{t('archive.council')}</span>{' '}
                      <span className="arc-card__council-name">{council.name}</span>
                    </div>
                    <div className="arc-card__council-row">
                      {council.candidates.map(c => <PctBlock key={c.name} candidate={c} compact />)}
                    </div>
                  </motion.div>
                ))}
              </div>
              <button
                className="arc-card__collapse-btn"
                onClick={e => { e.stopPropagation(); onCollapse() }}
              >
                {t('archive.collapse')}
              </button>
            </motion.div>
          ) : (
            <motion.div
              key="cta"
              className="arc-card__cta-inline"
              onClick={e => { e.stopPropagation(); onExpand() }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <span className="arc-card__cta-hint">{t('archive.open')}</span>
              <span className="arc-card__cta-label">{t('archive.press')}</span>
            </motion.div>
          )}
        </AnimatePresence>
      )}

      <Turnout
        totalVoters={item.totalVoters}
        totalEligible={item.totalEligible}
        turnoutPercent={item.turnoutPercent}
      />
    </div>
  )
}

// ─── Animation constants ───────────────────────────────────────────────────────

const MAX_VISIBLE = MAX_ARCHIVE_STACK

// Page-turn spring (dramatic, smooth)
const PAGE_TURN_SPRING = {
  type: 'spring' as const,
  stiffness: 200,
  damping: 28,
  mass: 1.0,
}

const STACK_SPRING = {
  type: 'spring' as const,
  stiffness: 320,
  damping: 28,
  mass: 0.8,
}

const FRONT_SPRING = {
  type: 'spring' as const,
  stiffness: 380,
  damping: 32,
  mass: 0.7,
}

// Depth → visual properties — per Figma: back cards offset right and up
// Front: x=0, y=0 | Depth 1: x=+21, y=-13 | Depth 2: x=+45, y=-26
function depthStyle(depth: number) {
  const d = Math.min(depth, MAX_VISIBLE - 1)
  return {
    x: d === 1 ? 21 : d === 2 ? 45 : 0,
    y: d * -13,
    rotateY: 0,
    opacity: 1,
    z: -d * 20,
  }
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function ArchiveSection() {
  const { t } = useI18n()
  const items = useMemo(() => getArchiveItems(t), [t])
  const [order, setOrder] = useState<number[]>(items.map((_, i) => i))
  const [flyingId, setFlyingId] = useState<string | null>(null)
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const lockRef = useRef(false)

  // Extract unique years for navigation
  const years = useMemo(() => {
    const set = new Set(items.map(it => it.year))
    return Array.from(set).sort((a, b) => Number(b) - Number(a))
  }, [items])

  // Current front card index
  const frontIndex = order[0]
  const frontItem = items[frontIndex]
  const currentPosition = order[0] + 1

  // Page-turn: card hinges on left edge, rotates forward like turning a page
  const advance = useCallback(() => {
    if (lockRef.current) return
    lockRef.current = true
    const frontId = items[order[0]].id

    setFlyingId(frontId)
    setExpandedId(null)

    // After page-turn animation, reorder
    setTimeout(() => {
      setOrder(prev => {
        const next = [...prev]
        const front = next.shift()!
        next.push(front)
        return next
      })
      setFlyingId(null)
      setTimeout(() => { lockRef.current = false }, 500)
    }, 450)
  }, [items, order])

  // Bring back card to front
  const bringToFront = useCallback((depth: number) => {
    if (lockRef.current) return
    lockRef.current = true
    setExpandedId(null)
    setOrder(prev => {
      const next = [...prev]
      const [picked] = next.splice(depth, 1)
      next.unshift(picked)
      return next
    })
    setTimeout(() => { lockRef.current = false }, 700)
  }, [])

  // Jump to a specific year
  const jumpToYear = useCallback((year: string) => {
    if (lockRef.current) return
    const idx = items.findIndex(it => it.year === year)
    if (idx === -1) return
    lockRef.current = true
    setExpandedId(null)
    setOrder(prev => {
      const next = [...prev]
      const pos = next.indexOf(idx)
      if (pos === 0) { lockRef.current = false; return prev }
      const [picked] = next.splice(pos, 1)
      next.unshift(picked)
      return next
    })
    setTimeout(() => { lockRef.current = false }, 700)
  }, [items])

  const expandCard = useCallback((id: string) => {
    setExpandedId(id)
  }, [])

  const collapseCard = useCallback(() => {
    setExpandedId(null)
  }, [])

  return (
    <section className="archive">
      <h2 className="archive__title">{t('archive.title')}</h2>

      <div className="archive__stack-wrap">
        <div
          className="archive__stack"
          role="group"
          aria-label="Архив выборов"
        >
          {order.map((itemIdx, depth) => {
            const item = items[itemIdx]
            const isVisible = depth < MAX_VISIBLE
            const isFlying = flyingId === item.id
            const isFront = depth === 0
            const isExpanded = expandedId === item.id && isFront

            if (!isVisible && !isFlying) return null

            const ds = depthStyle(depth)

            // Breathing on back cards
            const backBreathY = [ds.y, ds.y - 3, ds.y] as number[]

            // Page-turn: rotateY around left edge, fly forward then swing behind
            const animateTarget = isFlying
              ? {
                  x: 0 as number,
                  y: 0 as number | number[],
                  rotateY: -120,
                  opacity: 0,
                  z: 100,
                }
              : {
                  x: ds.x,
                  y: (!isFront ? backBreathY : ds.y) as number | number[],
                  rotateY: ds.rotateY,
                  opacity: ds.opacity,
                  z: ds.z,
                }

            const transition = isFlying
              ? PAGE_TURN_SPRING
              : isFront
                ? FRONT_SPRING
                : {
                    ...STACK_SPRING,
                    y: {
                      repeat: Infinity,
                      repeatType: 'mirror' as const,
                      duration: 3.6 + depth * 0.6,
                      ease: 'easeInOut',
                    },
                  }

            return (
              <motion.div
                key={item.id}
                className={`arc-card${isFront ? ' arc-card--front' : ' arc-card--back'}`}
                style={{
                  zIndex: isFlying ? 20 : isFront ? 10 : 10 - depth,
                  transformStyle: 'preserve-3d',
                }}
                animate={animateTarget}
                transition={transition}
              >
                <CardContent
                  item={item}
                  isExpanded={isExpanded}
                  onExpand={() => expandCard(item.id)}
                  onCollapse={collapseCard}
                />

                {/* Front card: click anywhere (except CTA) to page-turn */}
                {isFront && (
                  <div
                    className="arc-card__click-area"
                    onClick={advance}
                    role="button"
                    aria-label={t('archive.next')}
                  />
                )}

                {/* Back cards: НАЖМИТЕ overlay brings to front */}
                {!isFront && !isFlying && (
                  <div
                    className="arc-card__cta-overlay"
                    onClick={e => { e.stopPropagation(); bringToFront(depth) }}
                  >
                    <span className="arc-card__cta-hint">{t('archive.open')}</span>
                    <span className="arc-card__cta-label">{t('archive.press')}</span>
                  </div>
                )}
              </motion.div>
            )
          })}
        </div>
      </div>

      {/* Year navigation — useful when there are many elections */}
      {years.length > 1 && (
        <div className="archive__nav">
          {years.map(year => (
            <button
              key={year}
              className={`archive__nav-btn${frontItem.year === year ? ' archive__nav-btn--active' : ''}`}
              onClick={() => jumpToYear(year)}
            >
              {year}
            </button>
          ))}
        </div>
      )}

      <span className="archive__counter">{currentPosition} / {items.length}</span>
      <span className="archive__hint">{t('archive.hint')}</span>
    </section>
  )
}
