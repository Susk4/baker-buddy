import { useState, type FormEvent } from 'react'
import { useI18n } from '../i18n'
import { Button, Sheet } from './ui'

interface Props {
  sheetTitle: string
  initial?: { title: string; notes: string }
  onSubmit: (data: { title: string; notes: string }) => Promise<unknown>
  onClose: () => void
}

/** Title + notes sheet, used both for saving a new recipe and editing one. */
export function RecipeForm({ sheetTitle, initial, onSubmit, onClose }: Props) {
  const { t } = useI18n()
  const [title, setTitle] = useState(initial?.title ?? '')
  const [notes, setNotes] = useState(initial?.notes ?? '')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState(false)

  const submit = async (e: FormEvent) => {
    e.preventDefault()
    setBusy(true)
    setError(false)
    try {
      await onSubmit({ title: title.trim(), notes: notes.trim() })
      onClose()
    } catch {
      setError(true)
      setBusy(false)
    }
  }

  const field = 'mt-1 w-full rounded-2xl border-0 bg-white px-4 py-3 text-base ring-1 ring-dough outline-none focus:ring-2 focus:ring-wheat'

  return (
    <Sheet title={sheetTitle} onClose={onClose}>
      <form onSubmit={submit} className="space-y-4">
        <label className="block">
          <span className="font-bold text-muted">{t.titleLabel}</span>
          <input className={field} value={title} onChange={(e) => setTitle(e.target.value)} placeholder={t.titlePlaceholder} maxLength={100} required autoFocus />
        </label>
        <label className="block">
          <span className="font-bold text-muted">{t.notesLabel}</span>
          <textarea className={`${field} min-h-32`} value={notes} onChange={(e) => setNotes(e.target.value)} placeholder={t.notesPlaceholder} maxLength={5000} />
        </label>
        {error && <p className="text-sm text-red-700">{t.saveError}</p>}
        <div className="flex gap-3">
          <Button variant="soft" onClick={onClose}>
            {t.cancel}
          </Button>
          <Button type="submit" disabled={busy || !title.trim()}>
            {t.confirmSave}
          </Button>
        </div>
      </form>
    </Sheet>
  )
}
