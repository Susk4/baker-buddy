export type UnitSystem = 'metric' | 'imperial'

export const G_PER_OZ = 28.349523125

/** Approximate grams per US teaspoon, for the small imperial amounts. */
export const G_PER_TSP = { salt: 6, instant: 3.1 } as const

function num(value: number, locale: string, decimals: number): string {
  return new Intl.NumberFormat(locale, {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value)
}

export function formatGrams(grams: number, locale: string): string {
  return `${num(grams, locale, grams < 10 ? 1 : 0)} g`
}

export function formatImperial(grams: number, locale: string): string {
  const oz = grams / G_PER_OZ
  if (oz < 1) return `${num(oz, locale, 2)} oz`
  if (oz < 16) return `${num(oz, locale, 1)} oz`
  let lb = Math.floor(oz / 16)
  let rest = Math.round(oz - lb * 16)
  if (rest === 16) {
    lb += 1
    rest = 0
  }
  return rest === 0 ? `${lb} lb` : `${lb} lb ${rest} oz`
}

export function formatWeight(grams: number, system: UnitSystem, locale: string): string {
  return system === 'metric' ? formatGrams(grams, locale) : formatImperial(grams, locale)
}

const FRACTIONS = ['', '¼', '½', '¾']

/** Rounds to the nearest quarter teaspoon (minimum ¼), e.g. "1 ¾". */
export function formatTeaspoons(grams: number, gPerTsp: number): string {
  const quarters = Math.max(1, Math.round((grams / gPerTsp) * 4))
  const whole = Math.floor(quarters / 4)
  const frac = FRACTIONS[quarters % 4]
  if (whole === 0) return frac
  return frac ? `${whole} ${frac}` : `${whole}`
}
