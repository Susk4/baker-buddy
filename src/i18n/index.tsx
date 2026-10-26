import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { loadString, save } from '../lib/storage'
import { de } from './de'
import { en, type Dict } from './en'
import { es } from './es'
import { hu } from './hu'

export const LANGUAGES = ['en', 'hu', 'de', 'es'] as const
export type Lang = (typeof LANGUAGES)[number]

export const DICTS: Record<Lang, Dict> = { en, hu, de, es }

function detectLang(): Lang {
  for (const tag of navigator.languages ?? [navigator.language]) {
    const base = tag.slice(0, 2).toLowerCase() as Lang
    if (LANGUAGES.includes(base)) return base
  }
  return 'en'
}

/** Replaces {name} placeholders. */
export function fill(template: string, vars: Record<string, string>): string {
  return template.replace(/\{(\w+)\}/g, (_, k: string) => vars[k] ?? '')
}

export function formatPct(value: number, locale: string): string {
  return new Intl.NumberFormat(locale, { style: 'percent', maximumFractionDigits: 1 }).format(value / 100)
}

interface I18n {
  lang: Lang
  setLang: (lang: Lang) => void
  t: Dict
}

const I18nContext = createContext<I18n | null>(null)

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(() => loadString('bb.lang', LANGUAGES, detectLang()))

  useEffect(() => {
    document.documentElement.lang = lang
  }, [lang])

  const value = useMemo<I18n>(
    () => ({
      lang,
      t: DICTS[lang],
      setLang: (next) => {
        save('bb.lang', next)
        setLangState(next)
      },
    }),
    [lang],
  )
  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>
}

export function useI18n(): I18n {
  const ctx = useContext(I18nContext)
  if (!ctx) throw new Error('useI18n outside I18nProvider')
  return ctx
}
