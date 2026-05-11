'use client'

type AdminSaveBarProps = {
  show: boolean
  saving: boolean
  onSave: () => void
  onDiscard: () => void
  message?: string
}

export function AdminSaveBar({
  show,
  saving,
  onSave,
  onDiscard,
  message = 'You have unsaved changes. Save to write them to disk and update the live site.',
}: AdminSaveBarProps) {
  if (!show) return null

  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-50 border-t border-white/15 bg-[var(--charcoal)]/95 backdrop-blur-md px-4 py-3 shadow-[0_-12px_40px_rgba(0,0,0,0.45)] flex flex-wrap items-center justify-center gap-4 sm:justify-between"
      style={{ paddingBottom: 'max(0.75rem, env(safe-area-inset-bottom, 0px))' }}
      role="region"
      aria-label="Unsaved changes"
    >
      <p className="text-xs text-amber-100/95 text-center sm:text-left max-w-md leading-snug">{message}</p>
      <div className="flex flex-wrap justify-center gap-2">
        <button
          type="button"
          onClick={onDiscard}
          disabled={saving}
          className="px-4 py-2 border border-white/25 text-white/90 text-xs font-bold tracking-widest uppercase hover:bg-white/5 disabled:opacity-40"
          style={{ fontFamily: 'var(--font-orbitron)' }}
        >
          Discard
        </button>
        <button
          type="button"
          onClick={onSave}
          disabled={saving}
          className="px-5 py-2 bg-[var(--brand-red)] text-white text-xs font-bold tracking-widest uppercase disabled:opacity-50 shadow-[0_0_20px_var(--brand-red-glow)]"
          style={{ fontFamily: 'var(--font-orbitron)' }}
        >
          {saving ? 'Saving...' : 'Save changes'}
        </button>
      </div>
    </div>
  )
}
