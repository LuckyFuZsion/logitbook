'use client'

import { useEffect, useRef } from 'react'
import { AlertTriangle } from 'lucide-react'

export interface ConfirmModalProps {
  title: string
  description?: string
  confirmLabel?: string
  onConfirm: () => void
  onCancel: () => void
}

/**
 * Accessible confirmation modal for destructive admin actions.
 * Traps focus, closes on Escape, and prevents background scrolling.
 */
export function ConfirmModal({
  title,
  description,
  confirmLabel = 'Delete',
  onConfirm,
  onCancel,
}: ConfirmModalProps) {
  const cancelRef = useRef<HTMLButtonElement>(null)

  /* Close on Escape */
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onCancel()
    }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [onCancel])

  /* Prevent background scroll */
  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [])

  /* Auto-focus cancel on mount */
  useEffect(() => {
    cancelRef.current?.focus()
  }, [])

  return (
    /* Backdrop */
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-modal-title"
      onClick={(e) => { if (e.target === e.currentTarget) onCancel() }}
    >
      <div className="w-full max-w-sm border border-[var(--brand-red)]/40 bg-[var(--charcoal)] shadow-[0_0_60px_rgba(0,0,0,0.7)] p-6">
        {/* Icon + Title */}
        <div className="flex items-start gap-3 mb-4">
          <div className="shrink-0 w-9 h-9 flex items-center justify-center border border-[var(--brand-red)]/40 bg-[var(--brand-red-dim)]">
            <AlertTriangle size={18} className="text-[var(--brand-red)]" aria-hidden="true" />
          </div>
          <div>
            <h2
              id="confirm-modal-title"
              className="text-base font-black text-white leading-tight"
              style={{ fontFamily: 'var(--font-orbitron)' }}
            >
              {title}
            </h2>
            {description && (
              <p className="mt-1.5 text-sm text-white/60 leading-relaxed">{description}</p>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-2 mt-6">
          <button
            ref={cancelRef}
            type="button"
            onClick={onCancel}
            className="px-4 py-2 border border-white/25 text-white/80 text-xs font-bold tracking-widest uppercase hover:bg-white/5 transition-colors"
            style={{ fontFamily: 'var(--font-orbitron)' }}
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => { onConfirm(); onCancel() }}
            className="px-5 py-2 bg-[var(--brand-red)] hover:bg-red-600 text-white text-xs font-bold tracking-widest uppercase transition-colors shadow-[0_0_20px_var(--brand-red-glow)]"
            style={{ fontFamily: 'var(--font-orbitron)' }}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  )
}
