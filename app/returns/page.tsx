'use client'

import Link from 'next/link'
import { useEffect, useState, type ReactNode } from 'react'
import type { ReturnsData } from '@/lib/returns-types'
import { DEFAULT_RETURNS_DATA } from '@/lib/returns-defaults'

function renderTermText(text: string) {
  const emailMatch = text.match(/([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/)
  const phoneMatch = text.match(/(0\d{4}\s?\d{6,7}|\d{11})/)

  if (!emailMatch && !phoneMatch) return text

  const parts: ReactNode[] = []
  let remaining = text

  if (emailMatch && emailMatch.index !== undefined) {
    const before = remaining.slice(0, emailMatch.index)
    const email = emailMatch[0]
    const after = remaining.slice(emailMatch.index + email.length)
    if (before) parts.push(before)
    parts.push(
      <a
        key="email"
        href={`mailto:${email}`}
        className="text-[var(--brand-red)] hover:text-red-400 underline underline-offset-4 decoration-[var(--brand-red)]/40"
      >
        {email}
      </a>,
    )
    remaining = after
  }

  if (phoneMatch && phoneMatch.index !== undefined) {
    const idx = remaining.indexOf(phoneMatch[0])
    if (idx !== -1) {
      const before = remaining.slice(0, idx)
      const phone = phoneMatch[0]
      const after = remaining.slice(idx + phone.length)
      if (before) parts.push(before)
      parts.push(
        <a
          key="phone"
          href={`tel:${phone.replace(/\s/g, '')}`}
          className="text-[var(--brand-red)] hover:text-red-400 underline underline-offset-4 decoration-[var(--brand-red)]/40"
        >
          {phone}
        </a>,
      )
      if (after) parts.push(after)
      return parts
    }
  }

  if (remaining) parts.push(remaining)
  return parts
}

export default function ReturnsPage() {
  const [data, setData] = useState<ReturnsData>(DEFAULT_RETURNS_DATA)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/returns')
      .then((r) => r.json())
      .then((j: { data: ReturnsData }) => setData(j.data))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const titleBeforeAmp = data.pageTitle.includes('&')
    ? data.pageTitle.split('&')[0].trim()
    : null
  const titleAfterAmp = data.pageTitle.includes('&')
    ? data.pageTitle.split('&').slice(1).join('&').trim()
    : null

  return (
    <main className="min-h-screen bg-background px-4 pt-24 pb-16">
      <div className="max-w-3xl mx-auto">
        <p className="text-sm text-white/60 mb-6">
          <Link href="/" className="underline underline-offset-4 decoration-white/20 hover:decoration-white/60">
            Back to home
          </Link>
          {' · '}
          <Link href="/shop" className="underline underline-offset-4 decoration-white/20 hover:decoration-white/60">
            Shop
          </Link>
        </p>

        <h1
          className="text-4xl md:text-5xl font-black text-white/90 mb-8 text-balance"
          style={{ fontFamily: 'var(--font-orbitron)' }}
        >
          {titleBeforeAmp && titleAfterAmp ? (
            <>
              {titleBeforeAmp} &amp; <span className="text-[var(--brand-red)]">{titleAfterAmp}</span>
            </>
          ) : (
            data.pageTitle
          )}
        </h1>

        <div className="space-y-6 text-white/65 leading-relaxed text-base">
          <h2
            className="text-lg font-black text-white/90"
            style={{ fontFamily: 'var(--font-orbitron)' }}
          >
            {data.sectionTitle}
          </h2>

          {loading ? (
            <div className="space-y-3 animate-pulse" aria-hidden="true">
              {[1, 2, 3, 4].map((n) => (
                <div key={n} className="h-16 bg-white/5 rounded" />
              ))}
            </div>
          ) : (
            <ol className="list-decimal pl-6 space-y-4 text-white/70">
              {data.points.map((point, index) => (
                <li key={index}>{renderTermText(point)}</li>
              ))}
            </ol>
          )}
        </div>
      </div>
    </main>
  )
}
