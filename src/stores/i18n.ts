import { createContext, useContext, useState, useCallback } from 'react'
import ru from '../locales/ru.json'
import en from '../locales/en.json'

export type Lang = 'ru' | 'en'

type Translations = typeof ru
const messages: Record<Lang, Translations> = { ru, en }

// Dot-path accessor: t('header.login') → messages[lang].header.login
function resolve(obj: unknown, path: string): string {
  const parts = path.split('.')
  let cur: unknown = obj
  for (const p of parts) {
    if (cur == null || typeof cur !== 'object') return path
    cur = (cur as Record<string, unknown>)[p]
  }
  return typeof cur === 'string' ? cur : path
}

export function t(key: string, lang: Lang): string {
  return resolve(messages[lang], key)
}

// ─── React context ───────────────────────────────────────────────────────────

interface I18nContextValue {
  lang: Lang
  setLang: (lang: Lang) => void
  t: (key: string) => string
}

export const I18nContext = createContext<I18nContextValue>({
  lang: 'ru',
  setLang: () => {},
  t: (key) => resolve(ru, key),
})

export function useI18n() {
  return useContext(I18nContext)
}

export function useI18nState() {
  const [lang, setLang] = useState<Lang>('ru')
  const translate = useCallback((key: string) => t(key, lang), [lang])
  return { lang, setLang, t: translate }
}
