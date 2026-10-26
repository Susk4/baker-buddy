import { useI18n, formatPct } from '../i18n'
import { FLOUR_RANGE, HYDRATION_RANGE, type Leavening } from '../lib/defaults'
import type { DoughInput, DoughResult } from '../lib/dough'
import { G_PER_OZ } from '../lib/units'
import { usePrefs, useWeight } from '../prefs'
import { DoughSummary } from './DoughSummary'
import { Button, Card, Segmented, Slider } from './ui'

export interface CalcInputs {
  flour: number
  hydration: number
  leavening: Leavening
}

function hydrationFeel(h: number): 'firm' | 'classic' | 'open' | 'wet' {
  if (h <= 62) return 'firm'
  if (h <= 72) return 'classic'
  if (h <= 80) return 'open'
  return 'wet'
}

interface Props {
  inputs: CalcInputs
  onChange: (inputs: CalcInputs) => void
  doughInput: DoughInput
  result: DoughResult
  onSave: () => void
}

export function Calculator({ inputs, onChange, doughInput, result, onSave }: Props) {
  const { t, lang } = useI18n()
  const { units } = usePrefs()
  const w = useWeight()
  const set = (patch: Partial<CalcInputs>) => onChange({ ...inputs, ...patch })

  // Imperial moves the flour slider in whole ounces; grams stay the source of truth.
  const flourSlider =
    units === 'metric'
      ? { value: inputs.flour, min: FLOUR_RANGE.min, max: FLOUR_RANGE.max, step: FLOUR_RANGE.step, toGrams: (v: number) => v }
      : {
          value: Math.round(inputs.flour / G_PER_OZ),
          min: Math.ceil(FLOUR_RANGE.min / G_PER_OZ),
          max: Math.floor(FLOUR_RANGE.max / G_PER_OZ),
          step: 1,
          toGrams: (v: number) => v * G_PER_OZ,
        }

  return (
    <div className="space-y-4">
      <Card className="space-y-5">
        <div>
          <Segmented<Leavening>
            value={inputs.leavening}
            onChange={(leavening) => set({ leavening })}
            options={(['instant', 'fresh', 'sourdough'] as const).map((value) => ({ value, label: t.leavening[value] }))}
          />
          <p className="mt-2 text-center text-sm text-muted">{t.leaveningHint[inputs.leavening]}</p>
        </div>
        <Slider
          label={t.flour}
          display={w(inputs.flour)}
          hint={t.flourHint}
          {...flourSlider}
          onChange={(v) => set({ flour: flourSlider.toGrams(v) })}
        />
        <Slider
          label={t.hydration}
          display={formatPct(inputs.hydration, lang)}
          hint={t.hydrationFeel[hydrationFeel(inputs.hydration)]}
          value={inputs.hydration}
          min={HYDRATION_RANGE.min}
          max={HYDRATION_RANGE.max}
          step={HYDRATION_RANGE.step}
          onChange={(hydration) => set({ hydration })}
        />
      </Card>

      <DoughSummary input={doughInput} result={result} />

      <Button onClick={onSave}>🍞 {t.save}</Button>
    </div>
  )
}
