import type { User } from 'firebase/auth'
import { useState } from 'react'
import { signIn } from '../auth/useAuth'
import { deleteRecipe, updateRecipe, type Recipe } from '../data/recipes'
import { formatPct, useI18n } from '../i18n'
import { useWeight } from '../prefs'
import { DoughSummary } from './DoughSummary'
import { RecipeForm } from './RecipeForm'
import { BreadLogo, Button, Card, ChevronLeftIcon, GoogleButton } from './ui'

interface Props {
  user: User | null
  recipes: Recipe[] | null
  onSignInError: () => void
}

export function Recipes({ user, recipes, onSignInError }: Props) {
  const { t, lang } = useI18n()
  const w = useWeight()
  const [openId, setOpenId] = useState<string | null>(null)

  if (!user) {
    return (
      <Card className="space-y-4 text-center">
        <BreadLogo className="mx-auto size-20" />
        <p className="text-muted">{t.signInPitch}</p>
        <GoogleButton label={t.signIn} onClick={() => signIn().catch(onSignInError)} />
      </Card>
    )
  }

  const open = recipes?.find((r) => r.id === openId)
  if (open) return <RecipeDetail uid={user.uid} recipe={open} onBack={() => setOpenId(null)} />

  if (recipes && recipes.length === 0) {
    return (
      <Card className="space-y-3 text-center">
        <BreadLogo className="mx-auto size-20" />
        <p className="text-muted">{t.recipesEmpty}</p>
      </Card>
    )
  }

  const dateFmt = new Intl.DateTimeFormat(lang, { dateStyle: 'medium' })

  return (
    <ul className="space-y-3">
      {recipes?.map((r) => (
        <li key={r.id}>
          <button
            type="button"
            onClick={() => setOpenId(r.id)}
            className="w-full rounded-3xl bg-white/80 p-4 text-left shadow-[0_6px_24px_-12px_rgb(110_61_30/0.35)] ring-1 ring-dough active:bg-dough"
          >
            <div className="flex items-baseline justify-between gap-3">
              <span className="font-display text-lg font-semibold text-crust-dark">{r.title}</span>
              {r.createdAt && <span className="shrink-0 text-xs text-muted">{dateFmt.format(r.createdAt.toDate())}</span>}
            </div>
            <div className="mt-1 text-sm text-muted">
              {t.leavening[r.input.leavening]} · {w(r.input.flour)} · {formatPct(r.input.hydration, lang)}
            </div>
            {r.notes && <p className="mt-1 line-clamp-2 text-sm">{r.notes}</p>}
          </button>
        </li>
      ))}
    </ul>
  )
}

function RecipeDetail({ uid, recipe, onBack }: { uid: string; recipe: Recipe; onBack: () => void }) {
  const { t, lang } = useI18n()
  const w = useWeight()
  const [editing, setEditing] = useState(false)

  const remove = async () => {
    if (!confirm(t.deleteConfirm)) return
    onBack()
    await deleteRecipe(uid, recipe.id)
  }

  return (
    <div className="space-y-4">
      <button type="button" onClick={onBack} className="-ml-2 flex min-h-11 items-center gap-1 rounded-full pr-3 font-bold text-crust active:bg-dough">
        <ChevronLeftIcon /> {t.back}
      </button>
      <Card>
        <h2 className="font-display text-2xl font-semibold text-crust-dark">{recipe.title}</h2>
        <p className="mt-1 text-sm text-muted">
          {t.leavening[recipe.input.leavening]} · {w(recipe.input.flour)} ·{formatPct(recipe.input.hydration, lang)}
        </p>
        {recipe.notes && <p className="mt-3 whitespace-pre-wrap leading-relaxed">{recipe.notes}</p>}
      </Card>
      <DoughSummary input={recipe.input} result={recipe.result} />
      <div className="flex gap-3">
        <Button variant="danger" onClick={remove}>
          {t.delete}
        </Button>
        <Button variant="soft" onClick={() => setEditing(true)}>
          {t.edit}
        </Button>
      </div>
      {editing && (
        <RecipeForm
          sheetTitle={t.edit}
          initial={recipe}
          onSubmit={(data) => updateRecipe(uid, recipe.id, data)}
          onClose={() => setEditing(false)}
        />
      )}
    </div>
  )
}
