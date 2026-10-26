import { useEffect, useMemo, useState } from 'react'
import { signIn, useAuth } from './auth/useAuth'
import { Calculator, type CalcInputs } from './components/Calculator'
import { RecipeForm } from './components/RecipeForm'
import { Recipes } from './components/Recipes'
import { SettingsSheet } from './components/SettingsSheet'
import { BookIcon, BreadLogo, GearIcon, GoogleButton, CalculatorIcon, Sheet } from './components/ui'
import { addRecipe, useRecipes } from './data/recipes'
import { useUserDefaults } from './data/userSettings'
import { firebaseReady } from './firebase'
import { useI18n } from './i18n'
import { FLOUR_RANGE, HYDRATION_RANGE } from './lib/defaults'
import { calculateDough, type DoughInput } from './lib/dough'
import { load, save } from './lib/storage'

type Tab = 'calculator' | 'recipes'

const INITIAL_INPUTS: CalcInputs = { flour: FLOUR_RANGE.default, hydration: HYDRATION_RANGE.default, leavening: 'sourdough' }

export default function App() {
  const { t } = useI18n()
  const { user } = useAuth()
  const defaults = useUserDefaults(user?.uid ?? null)
  const recipes = useRecipes(user?.uid ?? null)

  const [tab, setTab] = useState<Tab>('calculator')
  const [inputs, setInputs] = useState<CalcInputs>(() => load('bb.inputs', INITIAL_INPUTS))
  const [sheet, setSheet] = useState<'settings' | 'save' | 'signin' | null>(null)
  const [toast, setToast] = useState<string | null>(null)

  useEffect(() => save('bb.inputs', inputs), [inputs])

  useEffect(() => {
    if (!toast) return
    const id = setTimeout(() => setToast(null), 2500)
    return () => clearTimeout(id)
  }, [toast])

  // A user who signs in from the "save" prompt goes straight on to saving.
  const activeSheet = sheet === 'signin' && user ? 'save' : sheet

  const doughInput: DoughInput = useMemo(() => ({ ...defaults, ...inputs }), [defaults, inputs])
  const result = useMemo(() => calculateDough(doughInput), [doughInput])

  const onSignInError = () => setToast(t.signInError)

  return (
    <div className="mx-auto flex min-h-dvh max-w-lg flex-col px-4 pt-[max(1rem,env(safe-area-inset-top))]">
      <header className="flex items-center gap-3 py-2">
        <BreadLogo className="size-12" />
        <div className="flex-1">
          <h1 className="font-display text-2xl leading-tight font-semibold text-crust-dark">Baker Buddy</h1>
          <p className="text-sm text-muted">{t.tagline}</p>
        </div>
        <button
          type="button"
          onClick={() => setSheet('settings')}
          className="grid size-12 place-items-center overflow-hidden rounded-full text-crust active:bg-dough"
          aria-label={t.settings}
        >
          {user?.photoURL ? <img src={user.photoURL} alt="" className="size-9 rounded-full ring-2 ring-wheat" referrerPolicy="no-referrer" /> : <GearIcon />}
        </button>
      </header>

      <main className="flex-1 pt-2 pb-28">
        {tab === 'calculator' ? (
          <Calculator
            inputs={inputs}
            onChange={setInputs}
            doughInput={doughInput}
            result={result}
            onSave={() => setSheet(user ? 'save' : 'signin')}
          />
        ) : (
          <Recipes user={user} recipes={recipes} onSignInError={onSignInError} />
        )}
      </main>

      <nav className="fixed inset-x-0 bottom-0 z-30 border-t border-dough bg-cream/90 pb-[env(safe-area-inset-bottom)] backdrop-blur">
        <div className="mx-auto flex max-w-lg">
          {(
            [
              ['calculator', t.nav.calculator, <CalculatorIcon key="c" />],
              ['recipes', t.nav.recipes, <BookIcon key="r" />],
            ] as const
          ).map(([value, label, icon]) => (
            <button
              key={value}
              type="button"
              onClick={() => setTab(value)}
              aria-current={tab === value ? 'page' : undefined}
              className={`flex min-h-16 flex-1 flex-col items-center justify-center gap-0.5 text-xs font-bold ${tab === value ? 'text-crust' : 'text-muted'}`}
            >
              {icon}
              {label}
            </button>
          ))}
        </div>
      </nav>

      {activeSheet === 'settings' && (
        <SettingsSheet user={user} defaults={defaults} onClose={() => setSheet(null)} onSignInError={onSignInError} />
      )}
      {activeSheet === 'signin' && (
        <Sheet title={t.save} onClose={() => setSheet(null)}>
          <div className="space-y-4 pb-2 text-center">
            <BreadLogo className="mx-auto size-16" />
            <p className="text-muted">{t.signInPitch}</p>
            {firebaseReady && <GoogleButton label={t.signIn} onClick={() => signIn().catch(onSignInError)} />}
          </div>
        </Sheet>
      )}
      {activeSheet === 'save' && user && (
        <RecipeForm
          sheetTitle={t.saveTitle}
          onSubmit={async (data) => {
            await addRecipe(user.uid, { ...data, input: doughInput, result })
            setToast(t.saved)
          }}
          onClose={() => setSheet(null)}
        />
      )}

      {toast && (
        <div className="animate-fade fixed inset-x-0 bottom-24 z-50 flex justify-center px-4" role="status">
          <div className="rounded-full bg-ink px-5 py-3 font-bold text-cream shadow-lg">{toast}</div>
        </div>
      )}
    </div>
  )
}
