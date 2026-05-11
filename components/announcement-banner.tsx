'use client'

import { useEffect, useState } from 'react'
import { X } from 'lucide-react'
import type { AnnouncementData } from '@/lib/announcement-types'

const STYLE_CLASSES = {
  info:    'bg-blue-600/90 border-blue-400/40 text-white',
  warning: 'bg-amber-600/90 border-amber-400/40 text-white',
  promo:   'bg-[var(--brand-red)]/90 border-[var(--brand-red)]/50 text-white',
}

export function AnnouncementBanner() {
  const [data, setData] = useState<AnnouncementData | null>(null)
  const [dismissed, setDismissed] = useState(false)

  useEffect(() => {
    fetch('/api/announcement')
      .then((r) => r.json())
      .then((j: { data: AnnouncementData }) => setData(j.data))
      .catch(() => {})
  }, [])

  /* Check localStorage dismissal keyed to this announcement's content */
  useEffect(() => {
    if (!data?.enabled || !data.message) return
    const key = `logit-ann-${data.updatedAt}`
    if (typeof localStorage !== 'undefined' && localStorage.getItem(key) === 'dismissed') {
      setDismissed(true)
    }
  }, [data])

  if (!data?.enabled || !data.message || dismissed) return null

  /* Check expiry */
  if (data.expiresAt) {
    const expiry = new Date(data.expiresAt)
    if (!isNaN(expiry.getTime()) && expiry < new Date()) return null
  }

  const dismiss = () => {
    const key = `logit-ann-${data.updatedAt}`
    try { localStorage.setItem(key, 'dismissed') } catch {}
    setDismissed(true)
  }

  return (
    <div
      className={`relative z-[60] w-full border-b backdrop-blur-sm px-4 py-2.5 flex items-center justify-center gap-3 ${STYLE_CLASSES[data.style]}`}
      role="banner"
      aria-live="polite"
    >
      <p className="text-sm text-center leading-snug flex-1 max-w-2xl">
        {data.message}
        {data.link && data.linkText && (
          <>
            {' '}
            <a
              href={data.link}
              target={data.link.startsWith('http') ? '_blank' : undefined}
              rel="noopener noreferrer"
              className="underline underline-offset-2 font-bold hover:opacity-80 transition-opacity"
            >
              {data.linkText}
            </a>
          </>
        )}
      </p>
      <button
        type="button"
        onClick={dismiss}
        aria-label="Dismiss announcement"
        className="shrink-0 opacity-70 hover:opacity-100 transition-opacity"
      >
        <X size={16} />
      </button>
    </div>
  )
}
