export type Leavening = 'instant' | 'fresh' | 'sourdough'

/** Baker's percentages, as whole percent values (2 = 2% of total flour). */
export interface Percentages {
  saltPct: number
  instantPct: number
  freshPct: number
  starterPct: number
  bakeLossPct: number
}

export const DEFAULT_PERCENTAGES: Percentages = {
  saltPct: 2,
  instantPct: 1,
  freshPct: 3,
  starterPct: 20,
  bakeLossPct: 15,
}

/** Allowed ranges for the fine-tune settings. */
export const PERCENT_RANGES: Record<keyof Percentages, { min: number; max: number; step: number }> = {
  saltPct: { min: 1.5, max: 2.5, step: 0.1 },
  instantPct: { min: 0.2, max: 2, step: 0.1 },
  freshPct: { min: 0.6, max: 6, step: 0.1 },
  starterPct: { min: 10, max: 30, step: 1 },
  bakeLossPct: { min: 10, max: 20, step: 1 },
}

export const FLOUR_RANGE = { min: 300, max: 3000, step: 25, default: 1000 }
export const HYDRATION_RANGE = { min: 55, max: 90, step: 1, default: 70 }
