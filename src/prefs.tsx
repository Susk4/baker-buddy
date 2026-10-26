import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react'
import { useI18n } from './i18n'
import { loadString, save } from './lib/storage'
import { formatWeight, type UnitSystem } from './lib/units'

interface Prefs {
  units: UnitSystem
  setUnits: (units: UnitSystem) => void
}

const PrefsContext = createContext<Prefs | null>(null)

export function PrefsProvider({ children }: { children: ReactNode }) {
  const [units, setUnitsState] = useState<UnitSystem>(() => loadString('bb.units', ['metric', 'imperial'], 'metric'))
  const value = useMemo<Prefs>(
    () => ({
      units,
      setUnits: (next) => {
        save('bb.units', next)
        setUnitsState(next)
      },
    }),
    [units],
  )
  return <PrefsContext.Provider value={value}>{children}</PrefsContext.Provider>
}

export function usePrefs(): Prefs {
  const ctx = useContext(PrefsContext)
  if (!ctx) throw new Error('usePrefs outside PrefsProvider')
  return ctx
}

/** Formats grams in the chosen unit system and language. */
export function useWeight(): (grams: number) => string {
  const { units } = usePrefs()
  const { lang } = useI18n()
  return useCallback((grams: number) => formatWeight(grams, units, lang), [units, lang])
}
