import type { User } from 'firebase/auth'
import { useState } from 'react'
import { signIn, signOut } from '../auth/useAuth'
import { saveUserDefaults } from '../data/userSettings'
import { DICTS, LANGUAGES, formatPct, useI18n } from '../i18n'
import { DEFAULT_PERCENTAGES, PERCENT_RANGES, type Percentages } from '../lib/defaults'
import { usePrefs } from '../prefs'
import { Button, GoogleButton, Segmented, Sheet, Slider } from './ui'

interface Props {
  user: User | null
  defaults: Percentages
  onClose: () => void
  onSignInError: () => void
}

export function SettingsSheet({ user, defaults, onClose, onSignInError }: Props) {
  const { t, lang, setLang } = useI18n()
  const { units, setUnits } = usePrefs()
  const [draft, setDraft] = useState<Percentages>(defaults)
  const [saving, setSaving] = useState(false)
  const dirty = (Object.keys(draft) as (keyof Percentages)[]).some((k) => draft[k] !== defaults[k])

  const saveDefaults = async () => {
    if (!user) return
    setSaving(true)
    try {
      await saveUserDefaults(user.uid, draft)
    } finally {
      setSaving(false)
    }
  }

  return (
    <Sheet title={t.settings} onClose={onClose}>
      <div className="space-y-6">
        <div>
          <h3 className="mb-2 font-bold text-muted">{t.language}</h3>
          <Segmented value={lang} onChange={setLang} options={LANGUAGES.map((l) => ({ value: l, label: DICTS[l].languageName }))} />
        </div>
        <div>
          <h3 className="mb-2 font-bold text-muted">{t.units}</h3>
          <Segmented
            value={units}
            onChange={setUnits}
            options={[
              { value: 'metric', label: t.metric },
              { value: 'imperial', label: t.imperial },
            ]}
          />
        </div>

        <div className="rounded-3xl bg-white/80 p-4 ring-1 ring-dough">
          <h3 className="font-display text-lg font-semibold text-crust-dark">{t.defaultsTitle}</h3>
          <p className="text-sm text-muted">{user ? t.defaultsHint : t.defaultsSignIn}</p>
          <fieldset disabled={!user} className={`mt-3 space-y-2 ${user ? '' : 'opacity-50'}`}>
            {(Object.keys(PERCENT_RANGES) as (keyof Percentages)[]).map((key) => (
              <Slider
                key={key}
                label={t.pct[key]}
                display={formatPct(draft[key], lang)}
                {...PERCENT_RANGES[key]}
                value={draft[key]}
                onChange={(v) => setDraft({ ...draft, [key]: Math.round(v * 10) / 10 })}
              />
            ))}
          </fieldset>
          {user && (
            <div className="mt-4 flex gap-3">
              <Button variant="soft" onClick={() => setDraft(DEFAULT_PERCENTAGES)}>
                {t.reset}
              </Button>
              <Button onClick={saveDefaults} disabled={!dirty || saving}>
                {t.confirmSave}
              </Button>
            </div>
          )}
        </div>

        {user ? (
          <div className="flex items-center gap-3">
            {user.photoURL && <img src={user.photoURL} alt="" className="size-10 rounded-full" referrerPolicy="no-referrer" />}
            <div className="min-w-0 flex-1">
              <div className="truncate font-bold">{user.displayName}</div>
              <div className="truncate text-sm text-muted">{user.email}</div>
            </div>
            <div className="w-36">
              <Button variant="soft" onClick={signOut}>
                {t.signOut}
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-2">
            <p className="text-center text-sm text-muted">{t.signInPitch}</p>
            <GoogleButton label={t.signIn} onClick={() => signIn().catch(onSignInError)} />
          </div>
        )}
      </div>
    </Sheet>
  )
}
