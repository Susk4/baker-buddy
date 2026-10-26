import type { Leavening, Percentages } from './defaults'

export interface DoughInput extends Percentages {
  /** Total flour in grams, including the flour inside the starter. */
  flour: number
  /** Water as % of total flour. */
  hydration: number
  leavening: Leavening
}

export interface LoafOption {
  count: number
  doughEach: number
  bakedEach: number
}

export interface DoughResult {
  totalFlour: number
  totalWater: number
  /** Flour and water to weigh into the bowl (total minus what the starter brings). */
  flourToAdd: number
  waterToAdd: number
  salt: number
  /** Instant or fresh yeast in grams; 0 for sourdough. */
  yeast: number
  starter: {
    total: number
    /** Equal parts old starter, flour and water. */
    buildEach: number
  } | null
  doughWeight: number
  bakedWeight: number
  loaves: LoafOption[]
  /** True when even a single loaf is lighter than the usual minimum. */
  smallLoaf: boolean
}

export const LOAF_MIN = 500
export const LOAF_MAX = 2000
const MAX_LOAVES = 8
const MAX_OPTIONS = 4

export function calculateDough(input: DoughInput): DoughResult {
  const { flour, hydration, leavening } = input
  const totalWater = (flour * hydration) / 100
  const salt = (flour * input.saltPct) / 100

  let yeast = 0
  let starterTotal = 0
  if (leavening === 'instant') yeast = (flour * input.instantPct) / 100
  else if (leavening === 'fresh') yeast = (flour * input.freshPct) / 100
  else starterTotal = (flour * input.starterPct) / 100

  // The starter is 100% hydration: half flour, half water.
  const flourToAdd = flour - starterTotal / 2
  const waterToAdd = totalWater - starterTotal / 2

  const doughWeight = flour + totalWater + salt + yeast
  const bakedWeight = doughWeight * (1 - input.bakeLossPct / 100)

  const loaves: LoafOption[] = []
  for (let count = 1; count <= MAX_LOAVES && loaves.length < MAX_OPTIONS; count++) {
    const bakedEach = bakedWeight / count
    if (bakedEach < LOAF_MIN) break
    if (bakedEach <= LOAF_MAX) loaves.push({ count, doughEach: doughWeight / count, bakedEach })
  }
  const smallLoaf = loaves.length === 0 && bakedWeight < LOAF_MIN
  if (smallLoaf) loaves.push({ count: 1, doughEach: doughWeight, bakedEach: bakedWeight })

  return {
    totalFlour: flour,
    totalWater,
    flourToAdd,
    waterToAdd,
    salt,
    yeast,
    starter: leavening === 'sourdough' ? { total: starterTotal, buildEach: starterTotal / 3 } : null,
    doughWeight,
    bakedWeight,
    loaves,
    smallLoaf,
  }
}
