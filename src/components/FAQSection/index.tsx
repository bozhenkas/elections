import { useState } from 'react'
import { useI18n } from '../../stores/i18n'
import { sanitizeLinks } from '../../utils/sanitize'
import './FAQSection.css'

type FAQItem = {
  question: string
  answer: string
}

type FAQSectionProps = {
  items: FAQItem[]
}

export default function FAQSection({ items }: FAQSectionProps) {
  const [openIndices, setOpenIndices] = useState<Set<number>>(new Set())
  const [closingIndices, setClosingIndices] = useState<Set<number>>(new Set())
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)
  const { t } = useI18n()

  const toggle = (i: number) => {
    if (openIndices.has(i)) {
      setClosingIndices(prev => new Set(prev).add(i))
      setHoveredIndex(null)
      setOpenIndices(prev => {
        const next = new Set(prev)
        next.delete(i)
        return next
      })
    } else {
      setClosingIndices(prev => {
        const next = new Set(prev)
        next.delete(i)
        return next
      })
      setOpenIndices(prev => new Set(prev).add(i))
    }
  }

  const handleMouseEnter = (i: number) => {
    if (!closingIndices.has(i)) setHoveredIndex(i)
  }

  const handleMouseLeave = (i: number) => {
    setHoveredIndex(prev => prev === i ? null : prev)
    if (closingIndices.has(i)) {
      setClosingIndices(prev => {
        const next = new Set(prev)
        next.delete(i)
        return next
      })
    }
  }

  const allOpen = items.length > 0 && openIndices.size === items.length && closingIndices.size === 0

  return (
    <section className="faq">
      <div className="faq__header">
        <h2 className="faq__title">{t('faq.title')}</h2>
        <span className="faq__subtitle">{t('faq.subtitle')}</span>
      </div>
      <div className="faq__list">
        {items.map((item, i) => {
          const isOpen = openIndices.has(i)
          const isHovered = hoveredIndex === i
          return (
            <div
              key={item.question}
              className={[
                'faq__item',
                isOpen ? 'faq__item--open' : '',
                isHovered ? 'faq__item--hover' : '',
              ].filter(Boolean).join(' ')}
              onClick={() => toggle(i)}
              onMouseEnter={() => handleMouseEnter(i)}
              onMouseLeave={() => handleMouseLeave(i)}
            >
              <p className="faq__question">{item.question}</p>
              <div className="faq__point">
                <img src="/assets/atoms/point.svg" alt="" width="40" height="40" />
              </div>
              <div className="faq__body">
                <p className="faq__answer" dangerouslySetInnerHTML={{ __html: sanitizeLinks(item.answer) }} />
              </div>
            </div>
          )
        })}
      </div>
      <div className="faq__footer-wrap">
        <p className={`faq__footer ${allOpen ? 'faq__footer--visible' : ''}`}>
          {t('faq.fallback')}{' '}
          <a href="https://t.me/spbgut_sc" target="_blank" rel="noopener noreferrer">телеграм</a>
          {' '}{t('faq.or')}{' '}
          <a href="https://vk.com/spbgut_sc" target="_blank" rel="noopener noreferrer">вконтакте</a>
        </p>
      </div>
    </section>
  )
}
