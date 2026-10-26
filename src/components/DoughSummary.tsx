import { fill, formatPct, useI18n } from '../i18n'
import type { DoughInput, DoughResult } from '../lib/dough'
import { formatTeaspoons, G_PER_TSP } from '../lib/units'
import { usePrefs, useWeight } from '../prefs'
import { Card } from './ui'

function Row({ icon, name, amount, extra }: { icon: string; name: string; amount: string; extra?: string }) {
  return (
    <li className="flex items-center gap-3 py-2.5">
      <span className="grid size-10 shrink-0 place-items-center rounded-2xl bg-dough text-xl" aria-hidden="true">
        {icon}
      </span>
      <span className="flex-1">
        <span className="block font-bold">{name}</span>
        {extra && <span className="block text-sm text-muted">{extra}</span>}
      </span>
      <span className="font-display text-xl font-semibold tabular-nums text-crust-dark">{amount}</span>
    </li>
  )
}

/** Ingredient amounts, starter build and loaf options for one dough. */
export function DoughSummary({ input, result }: { input: DoughInput; result: DoughResult }) {
  const { t, lang } = useI18n()
  const { units } = usePrefs()
  const w = useWeight()
  const pct = (value: number) => `${formatPct(value, lang)} ${t.ofFlour}`
  const tsp = (grams: number, gPerTsp: number) =>
    units === 'imperial' ? `≈ ${formatTeaspoons(grams, gPerTsp)} ${t.tsp} · ` : ''

  const { leavening } = input
  const yeastPct = leavening === 'instant' ? input.instantPct : input.freshPct

  return (
    <>
      <Card>
        <h2 className="font-display text-xl font-semibold text-crust-dark">{t.yourDough}</h2>
        <ul className="mt-1 divide-y divide-dough">
          <Row
            icon="🌾"
            name={t.ingredient.flour}
            amount={w(result.flourToAdd)}
            extra={
              result.starter
                ? fill(t.flourNote, { total: w(result.totalFlour), starter: w(result.starter.total / 2) })
                : undefined
            }
          />
          <Row icon="💧" name={t.ingredient.water} amount={w(result.waterToAdd)} extra={fill(t.waterNote, { pct: formatPct(input.hydration, lang) })} />
          {result.starter && (
            <Row icon="🥣" name={t.ingredient.starter} amount={w(result.starter.total)} extra={pct(input.starterPct)} />
          )}
          <Row icon="🧂" name={t.ingredient.salt} amount={w(result.salt)} extra={tsp(result.salt, G_PER_TSP.salt) + pct(input.saltPct)} />
          {leavening !== 'sourdough' && (
            <Row
              icon="🥄"
              name={t.ingredient[leavening]}
              amount={w(result.yeast)}
              extra={(leavening === 'instant' ? tsp(result.yeast, G_PER_TSP.instant) : '') + pct(yeastPct)}
            />
          )}
        </ul>
        <div className="mt-2 flex items-center justify-between rounded-2xl bg-wheat-soft/60 px-4 py-3">
          <span className="font-bold">{t.totalDough}</span>
          <span className="font-display text-xl font-semibold tabular-nums text-crust-dark">{w(result.doughWeight)}</span>
        </div>
        {result.starter && (
          <div className="mt-3 rounded-2xl border-2 border-dashed border-wheat/70 px-4 py-3">
            <div className="font-bold text-crust-dark">🥣 {t.starterBuildTitle}</div>
            <p className="mt-1 text-sm leading-relaxed">{fill(t.starterBuild, { each: w(result.starter.buildEach) })}</p>
          </div>
        )}
      </Card>

      <Card>
        <h2 className="font-display text-xl font-semibold text-crust-dark">{t.loavesTitle}</h2>
        <p className="text-sm text-muted">{fill(t.bakedTotal, { weight: w(result.bakedWeight) })}</p>
        <ul className="mt-3 grid grid-cols-2 gap-3">
          {result.loaves.map((loaf) => (
            <li key={loaf.count} className="rounded-2xl bg-dough/70 p-3">
              <div className="flex gap-0.5 text-lg" aria-hidden="true">
                {'🍞'.repeat(Math.min(loaf.count, 6))}
              </div>
              <div className="mt-1 font-bold">{t.loafCount(loaf.count)}</div>
              <div className="font-display text-xl font-semibold whitespace-nowrap text-crust-dark">≈ {w(loaf.bakedEach)}</div>
              <div className="text-xs text-muted">{fill(t.doughEach, { weight: w(loaf.doughEach) })}</div>
            </li>
          ))}
        </ul>
        {result.smallLoaf && <p className="mt-2 text-sm text-muted">{t.smallLoaf}</p>}
        <p className="mt-3 text-xs text-muted">{fill(t.lossNote, { pct: formatPct(input.bakeLossPct, lang) })}</p>
      </Card>
    </>
  )
}
