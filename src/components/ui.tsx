import { useEffect, type ReactNode } from 'react'
import { useI18n } from '../i18n'

export function Card({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <section className={`rounded-3xl bg-white/80 p-5 shadow-[0_6px_24px_-12px_rgb(110_61_30/0.35)] ring-1 ring-dough ${className}`}>
      {children}
    </section>
  )
}

interface SliderProps {
  label: string
  display: string
  hint?: string
  value: number
  min: number
  max: number
  step: number
  onChange: (value: number) => void
}

export function Slider({ label, display, hint, value, min, max, step, onChange }: SliderProps) {
  const fill = `${((value - min) / (max - min)) * 100}%`
  return (
    <label className="block">
      <div className="flex items-baseline justify-between gap-3">
        <span className="font-semibold text-muted">{label}</span>
        <span className="font-display text-3xl font-semibold tabular-nums text-crust-dark">{display}</span>
      </div>
      <input
        type="range"
        className="slider"
        style={{ ['--fill' as string]: fill }}
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
      />
      {hint && <div className="-mt-1 text-sm text-muted">{hint}</div>}
    </label>
  )
}

interface SegmentedProps<T extends string> {
  value: T
  options: { value: T; label: string }[]
  onChange: (value: T) => void
}

export function Segmented<T extends string>({ value, options, onChange }: SegmentedProps<T>) {
  return (
    <div className="flex gap-1 rounded-2xl bg-dough p-1" role="radiogroup">
      {options.map((o) => (
        <button
          key={o.value}
          type="button"
          role="radio"
          aria-checked={o.value === value}
          onClick={() => onChange(o.value)}
          className={`min-h-11 flex-1 rounded-xl px-2 text-sm font-bold transition ${
            o.value === value ? 'bg-white text-crust-dark shadow' : 'text-muted active:bg-white/50'
          }`}
        >
          {o.label}
        </button>
      ))}
    </div>
  )
}

export function Sheet({ title, onClose, children }: { title: string; onClose: () => void; children: ReactNode }) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])
  const { t } = useI18n()

  return (
    <div className="fixed inset-0 z-40 flex items-end justify-center sm:items-center" role="dialog" aria-modal="true" aria-label={title}>
      <div className="animate-fade absolute inset-0 bg-ink/40" onClick={onClose} />
      <div className="animate-rise relative max-h-[90dvh] w-full max-w-lg overflow-y-auto rounded-t-[2rem] bg-cream px-5 pt-3 pb-[max(1.5rem,env(safe-area-inset-bottom))] shadow-2xl sm:rounded-[2rem]">
        <div className="mx-auto mb-3 h-1.5 w-12 rounded-full bg-dough sm:hidden" />
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-display text-2xl font-semibold text-crust-dark">{title}</h2>
          <button type="button" onClick={onClose} className="grid size-10 place-items-center rounded-full text-muted active:bg-dough" aria-label={t.close}>
            <CloseIcon />
          </button>
        </div>
        {children}
      </div>
    </div>
  )
}

export function Button({
  children,
  onClick,
  variant = 'primary',
  type = 'button',
  disabled,
}: {
  children: ReactNode
  onClick?: () => void
  variant?: 'primary' | 'soft' | 'danger'
  type?: 'button' | 'submit'
  disabled?: boolean
}) {
  const styles = {
    primary: 'bg-crust text-white shadow-[0_6px_16px_-6px_rgb(110_61_30/0.7)] active:bg-crust-dark',
    soft: 'bg-dough text-crust-dark active:bg-wheat-soft',
    danger: 'bg-red-50 text-red-700 active:bg-red-100',
  }[variant]
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`flex min-h-12 w-full items-center justify-center gap-2 rounded-2xl px-5 font-bold transition disabled:opacity-50 ${styles}`}
    >
      {children}
    </button>
  )
}

export function GoogleButton({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex min-h-12 w-full items-center justify-center gap-3 rounded-2xl bg-white px-5 font-bold text-ink shadow ring-1 ring-dough active:bg-dough"
    >
      <svg viewBox="0 0 48 48" className="size-5" aria-hidden="true">
        <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.7 29.2 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.4-.4-3.5z" />
        <path fill="#FF3D00" d="m6.3 14.7 6.6 4.8C14.7 15.1 19 12 24 12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z" />
        <path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2c-2 1.5-4.5 2.4-7.2 2.4-5.2 0-9.6-3.3-11.3-8l-6.5 5C9.5 39.6 16.2 44 24 44z" />
        <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.2-2.2 4.2-4.1 5.6l6.2 5.2C37 39.2 44 34 44 24c0-1.3-.1-2.4-.4-3.5z" />
      </svg>
      {label}
    </button>
  )
}

const iconProps = {
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 2,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
  'aria-hidden': true,
}

export const CloseIcon = () => (
  <svg {...iconProps} className="size-6">
    <path d="M18 6 6 18M6 6l12 12" />
  </svg>
)
export const GearIcon = () => (
  <svg {...iconProps} className="size-6">
    <circle cx="12" cy="12" r="3" />
    <path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z" />
  </svg>
)
export const CalculatorIcon = () => (
  <svg {...iconProps} className="size-6">
    <rect x="5" y="3" width="14" height="18" rx="2.5" />
    <path d="M8.5 7h7M8.5 11.5h.01M12 11.5h.01M15.5 11.5h.01M8.5 15h.01M12 15h.01M15.5 15h.01M8.5 18h.01M12 18h3.5" />
  </svg>
)
export const BookIcon = () => (
  <svg {...iconProps} className="size-6">
    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20V3H6.5A2.5 2.5 0 0 0 4 5.5v14zM20 17v4H6.5A2.5 2.5 0 0 1 4 18.5" />
  </svg>
)
export const ChevronLeftIcon = () => (
  <svg {...iconProps} className="size-6">
    <path d="m15 18-6-6 6-6" />
  </svg>
)

export function BreadLogo({ className = 'size-10' }: { className?: string }) {
  return (
    <svg viewBox="0 3.5 64 64" className={className} aria-hidden="true">
      <ellipse cx="32" cy="38" rx="26" ry="17" fill="#c9783f" />
      <path d="M6 38c0-12 11.6-22 26-22s26 10 26 22c0 3-3 5-8 5H14c-5 0-8-2-8-5z" fill="#e2a15e" />
      <path d="M19 26c2 3 3 6 3 10M30 22c2 4 3 8 3 13M42 25c2 3 3 6 3 10" stroke="#fbe3b8" strokeWidth="3.5" strokeLinecap="round" fill="none" />
      <circle cx="24" cy="44" r="1.6" fill="#6e3d1e" />
      <circle cx="40" cy="44" r="1.6" fill="#6e3d1e" />
      <path d="M29 47c1.8 1.5 4.2 1.5 6 0" stroke="#6e3d1e" strokeWidth="1.8" strokeLinecap="round" fill="none" />
    </svg>
  )
}
