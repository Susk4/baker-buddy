import { describe, expect, it } from 'vitest'
import { DEFAULT_PERCENTAGES } from './defaults'
import { calculateDough, type DoughInput } from './dough'

const base: DoughInput = { ...DEFAULT_PERCENTAGES, flour: 1000, hydration: 70, leavening: 'instant' }

describe('calculateDough', () => {
  it('uses baker’s percentages for instant yeast', () => {
    const r = calculateDough(base)
    expect(r.totalWater).toBe(700)
    expect(r.salt).toBe(20)
    expect(r.yeast).toBe(10)
    expect(r.flourToAdd).toBe(1000)
    expect(r.waterToAdd).toBe(700)
    expect(r.starter).toBeNull()
    expect(r.doughWeight).toBe(1730)
    expect(r.bakedWeight).toBeCloseTo(1470.5)
  })

  it('uses 3% for fresh yeast', () => {
    const r = calculateDough({ ...base, leavening: 'fresh' })
    expect(r.yeast).toBe(30)
    expect(r.doughWeight).toBe(1750)
  })

  it('counts starter flour and water toward the totals', () => {
    const r = calculateDough({ ...base, leavening: 'sourdough' })
    expect(r.yeast).toBe(0)
    expect(r.starter).toEqual({ total: 200, buildEach: 200 / 3 })
    expect(r.flourToAdd).toBe(900)
    expect(r.waterToAdd).toBe(600)
    // Hydration stays exact: (600 + 100) / (900 + 100) = 70%
    expect((r.waterToAdd + 100) / (r.flourToAdd + 100)).toBe(0.7)
    expect(r.doughWeight).toBe(1720)
    expect(r.flourToAdd + r.waterToAdd + r.starter!.total + r.salt).toBe(r.doughWeight)
  })

  it('lists loaf counts whose baked weight is 500–2000 g', () => {
    const r = calculateDough(base) // ≈1470 g baked
    expect(r.loaves.map((l) => l.count)).toEqual([1, 2])
    expect(r.loaves[1].bakedEach).toBeCloseTo(735.25)
    expect(r.loaves[1].doughEach).toBe(865)
    expect(r.smallLoaf).toBe(false)
  })

  it('skips counts that are too heavy and caps the list at 4', () => {
    const r = calculateDough({ ...base, flour: 3000 }) // ≈4411 g baked
    expect(r.loaves.map((l) => l.count)).toEqual([3, 4, 5, 6])
  })

  it('flags a small loaf when one loaf is under 500 g', () => {
    const r = calculateDough({ ...base, flour: 300, hydration: 55 })
    expect(r.loaves).toHaveLength(1)
    expect(r.smallLoaf).toBe(true)
  })
})
