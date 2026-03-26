import { useState, useRef, useCallback, useMemo } from 'react'
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

// ─── Candidate name pools ────────────────────────────────────────────────────

const LAST_NAMES = [
  'Иванов', 'Петрова', 'Сидоров', 'Козлова', 'Новиков',
  'Фёдорова', 'Морозов', 'Волкова', 'Алексеев', 'Лебедева',
  'Семёнов', 'Егорова', 'Павлов', 'Кузнецова', 'Степанов',
  'Николаева', 'Орлов', 'Андреева', 'Макаров', 'Захарова',
  'Васильев', 'Соколова', 'Михайлов', 'Попова', 'Григорьев',
]

const INITIALS = [
  'А. В.', 'И. С.', 'Д. М.', 'Е. К.', 'М. А.',
  'К. Р.', 'О. Н.', 'П. Л.', 'Н. Г.', 'С. Т.',
  'В. Д.', 'Л. Ф.', 'Г. Ю.', 'Т. Б.', 'Р. П.',
]

// Deterministic pseudo-random based on seed
function seededRandom(seed: number): () => number {
  let s = seed
  return () => {
    s = (s * 16807 + 0) % 2147483647
    return (s - 1) / 2147483646
  }
}

function generateCandidates(seed: number, count: number, includeAgainstAll: string): Candidate[] {
  const rng = seededRandom(seed)
  const used = new Set<number>()
  const candidates: Candidate[] = []

  for (let i = 0; i < count; i++) {
    let nameIdx: number
    do { nameIdx = Math.floor(rng() * LAST_NAMES.length) } while (used.has(nameIdx))
    used.add(nameIdx)
    candidates.push({
      name: `${LAST_NAMES[nameIdx]} ${INITIALS[nameIdx % INITIALS.length]}`,
      percent: 0,
    })
  }

  // Generate percentages
  let remaining = 100
  const againstAllPct = 3 + Math.floor(rng() * 12)
  remaining -= againstAllPct

  for (let i = 0; i < candidates.length; i++) {
    if (i === candidates.length - 1) {
      candidates[i].percent = remaining
    } else {
      const share = Math.floor(remaining * (0.3 + rng() * 0.4))
      candidates[i].percent = share
      remaining -= share
    }
  }

  // Sort by percent descending, mark winner
  candidates.sort((a, b) => b.percent - a.percent)
  candidates[0].isWinner = true

  candidates.push({ name: includeAgainstAll, percent: againstAllPct })

  return candidates
}

const FACULTIES = ['ИСиТ', 'РТС', 'СЦТ', 'ФП', 'ИКСС', 'ЦЭУБИ', 'КТ', 'ВУЦ']

// ─── Data (i18n-aware) ───────────────────────────────────────────────────────

function getArchiveItems(t: (key: string) => string): ArchiveItem[] {
  const againstAll = t('archive.againstAll')
  const decor = t('election.decor')
  const chairmanTitle = t('archive.chairmanTitle')
  const chairsTitle = t('archive.chairsTitle')

  const items: ArchiveItem[] = []
  let id = 1

  // 6 years: 2025 down to 2020, each with chairman (December) + councils (September)
  const years = [2025, 2024, 2023, 2022, 2021, 2020]
  const decDates = ['18 декабря', '12 декабря', '15 декабря', '10 декабря', '17 декабря', '14 декабря']
  const sepDates = ['5 сентября', '8 сентября', '3 сентября', '6 сентября', '9 сентября', '4 сентября']

  for (let yi = 0; yi < years.length; yi++) {
    const year = years[yi]
    const seed = year * 100

    // Chairman election (December)
    const chairCount = 2 + Math.floor(seededRandom(seed + 1)() * 4) // 2-5 candidates
    items.push({
      id: String(id++),
      decor,
      title: chairmanTitle,
      date: decDates[yi],
      time: '10:00 – 18:00',
      year: String(year),
      type: 'simple',
      candidates: generateCandidates(seed + 10, chairCount, againstAll),
      totalVoters: 800 + Math.floor(seededRandom(seed + 20)() * 1200),
      totalEligible: 8000 + Math.floor(seededRandom(seed + 30)() * 3000),
      turnoutPercent: Math.floor(10 + seededRandom(seed + 40)() * 55),
    })

    // Councils election (September)
    const councils: Council[] = FACULTIES.map((faculty, fi) => {
      const cCount = 2 + Math.floor(seededRandom(seed + 50 + fi)() * 3) // 2-4 candidates
      return {
        name: faculty,
        candidates: generateCandidates(seed + 100 + fi * 10, cCount, againstAll.toLowerCase()),
      }
    })

    items.push({
      id: String(id++),
      decor,
      title: chairsTitle,
      date: sepDates[yi],
      time: '10:00 – 18:00',
      year: String(year),
      type: 'councils',
      councils,
      totalVoters: 1000 + Math.floor(seededRandom(seed + 60)() * 1500),
      totalEligible: 8000 + Math.floor(seededRandom(seed + 70)() * 3000),
      turnoutPercent: Math.round((5 + seededRandom(seed + 80)() * 20) * 10) / 10,
    })
  }

  return items
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

// карточка уходит вглубь стопки: поднимается, уменьшается, исчезает
const PAGE_TURN_ANIM = {
  type: 'tween' as const,
  duration: 0.46,
  ease: [0.4, 0, 0.9, 0.6] as [number, number, number, number],
}

// карточки стопки плавно занимают позицию
const STACK_SPRING = {
  type: 'spring' as const,
  stiffness: 260,
  damping: 34,
  mass: 0.9,
}

// фронтальная карточка возвращается в нейтральное положение
const FRONT_SPRING = {
  type: 'spring' as const,
  stiffness: 340,
  damping: 36,
  mass: 0.7,
}

// Depth → visual properties
// 2 visible cards + 1 incoming during animation
function depthStyle(depth: number) {
  if (depth === 0) return { x: 0, y: 0, z: 0, scale: 1, rotateZ: 0, opacity: 1 }
  if (depth === 1) return { x: 16, y: -10, z: -15, scale: 1, rotateZ: 0, opacity: 1 }
  // depth 2: same position as depth 1 but invisible — fades in smoothly
  return { x: 16, y: -10, z: -15, scale: 1, rotateZ: 0, opacity: 0 }
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

  // Page-turn: card hinges on left edge, rotates forward like turning a page
  const advance = useCallback(() => {
    if (lockRef.current) return
    lockRef.current = true
    const frontId = items[order[0]].id

    setFlyingId(frontId)
    setExpandedId(null)

    // After fly-out animation, reorder
    setTimeout(() => {
      setOrder(prev => {
        const next = [...prev]
        const front = next.shift()!
        next.push(front)
        return next
      })
      setFlyingId(null)
      setTimeout(() => { lockRef.current = false }, 500)
    }, 380)
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

  // Jump to a specific year — find the first election of that year
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
            // Show 2 cards normally + 1 extra during fly animation (slides in)
            const isVisible = depth < MAX_VISIBLE || (depth === MAX_VISIBLE && flyingId !== null)
            const isFlying = flyingId === item.id
            const isFront = depth === 0
            const isExpanded = expandedId === item.id && isFront

            if (!isVisible && !isFlying) return null

            const ds = depthStyle(depth)

            // Breathing on back cards
            const backBreathY = [ds.y, ds.y - 3, ds.y] as number[]

            // Card slides to back of stack while fading out, then reorders
            const animateTarget = isFlying
              ? {
                  x: 42 as number,
                  y: -22 as number | number[],
                  z: -60,
                  scale: 0.88,
                  rotateZ: 2,
                  opacity: 0,
                }
              : {
                  x: ds.x,
                  y: (!isFront ? backBreathY : ds.y) as number | number[],
                  z: ds.z,
                  scale: ds.scale,
                  rotateZ: ds.rotateZ,
                  opacity: ds.opacity,
                }

            // Incoming card (depth 2) gets a gentle fade-in spring
            const isIncoming = depth === MAX_VISIBLE

            const transition = isFlying
              ? PAGE_TURN_ANIM
              : isFront
                ? FRONT_SPRING
                : isIncoming
                  ? { ...STACK_SPRING, opacity: { duration: 0.5, ease: 'easeOut' } }
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

                {/* Back cards: clickable to bring to front (no text overlay) */}
                {!isFront && !isFlying && (
                  <div
                    className="arc-card__back-click"
                    onClick={e => { e.stopPropagation(); bringToFront(depth) }}
                  />
                )}
              </motion.div>
            )
          })}
        </div>
      </div>

      {/* Year navigation only */}
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
    </section>
  )
}
