import { describe, expect, it } from 'vitest'
import { formatGrams, formatImperial, formatTeaspoons, G_PER_OZ, G_PER_TSP } from './units'

describe('formatGrams', () => {
  it('shows whole grams, and one decimal under 10 g', () => {
    expect(formatGrams(1720, 'en')).toBe('1,720 g')
    expect(formatGrams(6.66, 'en')).toBe('6.7 g')
    expect(formatGrams(20, 'en')).toBe('20 g')
  })

  it('uses the locale’s separators', () => {
    expect(formatGrams(6.66, 'de')).toBe('6,7 g')
  })
})

describe('formatImperial', () => {
  it('uses ounces with decimals for small amounts', () => {
    expect(formatImperial(20, 'en')).toBe('0.71 oz')
    expect(formatImperial(150, 'en')).toBe('5.3 oz')
  })

  it('uses pounds and whole ounces from 1 lb', () => {
    expect(formatImperial(1000, 'en')).toBe('2 lb 3 oz')
    expect(formatImperial(16 * G_PER_OZ, 'en')).toBe('1 lb')
    expect(formatImperial(31.8 * G_PER_OZ, 'en')).toBe('2 lb')
  })
})

describe('formatTeaspoons', () => {
  it('rounds to the nearest quarter teaspoon', () => {
    expect(formatTeaspoons(20, G_PER_TSP.salt)).toBe('3 ¼')
    expect(formatTeaspoons(10, G_PER_TSP.instant)).toBe('3 ¼')
    expect(formatTeaspoons(3, G_PER_TSP.salt)).toBe('½')
    expect(formatTeaspoons(0.1, G_PER_TSP.salt)).toBe('¼')
    expect(formatTeaspoons(12, G_PER_TSP.salt)).toBe('2')
  })
})
