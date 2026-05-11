'use client'

import Link from 'next/link'
import { useCallback, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import type { HeroData } from '@/lib/hero-types'
import { AdminSaveBar } from '@/components/admin-save-bar'

const CTA_TARGETS = ['shop', 'services', 'story', 'gallery', 'home']

export default function AdminHeroClient({
  initialData,
  persistenceBackend,
  cmsCollectionId,
}: {
  initialData: HeroData
  persistenceBackend: 'firestore' | 'file'
  cmsCollectionId: string
}) {
  const router = useRouter()
  const [d, setD] = useState(initialData)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const isDirty = useMemo(() => JSON.stringify(d) !== JSON.stringify(initialData), [d, initialData])

  const tickerText = d.tickerItems.join('\n')

  const f = (k: keyof HeroData) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setD((prev) => ({ ...prev, [k]: e.target.value }))

  const handleTicker = (e: React.ChangeEvent<HTMLTextAreaElement>) =>
    setD((prev) => ({ ...prev, tickerItems: e.target.value.split('\n').map((s) => s.trimEnd()).filter(Boolean) }))

  const handleSave = useCallback(async () => {
    setSaving(true); setError(null); setMessage(null)
    const res = await fetch('/api/admin/hero', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(d) })
    const json = await res.json()
    setSaving(false)
    if (!res.ok) { setError(json.error ?? 'Save failed') } else { setMessage('Saved.'); router.refresh() }
  }, [d, router])

  const inputCls = 'w-full bg-transparent border border-white/15 text-white text-sm px-3 py-1.5 focus:outline-none focus:border-white/40'
  const selectCls = 'w-full bg-[var(--charcoal)] border border-white/15 text-white text-sm px-3 py-1.5 focus:outline-none'
  const label = (txt: string) => <label className="text-[10px] uppercase tracking-widest text-white/50 block mb-1">{txt}</label>

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 pb-28 text-white">
      <div className="mb-8">
        <Link href="/admin" className="text-[10px] font-bold tracking-widest uppercase text-white/40 hover:text-white/80 transition-colors mb-2 inline-block" style={{ fontFamily: 'var(--font-orbitron)' }}>
          ← Admin
        </Link>
        <h1 className="text-2xl font-black text-white mb-1" style={{ fontFamily: 'var(--font-orbitron)' }}>HERO SECTION</h1>
        <p className="text-sm text-white/50">Homepage hero text, ticker tape, and CTA buttons.</p>
      </div>

      {error && <div className="mb-4 border border-red-500/40 bg-red-500/10 text-red-300 text-sm px-4 py-3">{error}</div>}
      {message && !isDirty && <div className="mb-4 border border-green-500/40 bg-green-500/10 text-green-300 text-sm px-4 py-3">{message}</div>}

      <div className="space-y-4">
        <div className="border border-white/15 bg-[var(--charcoal)] p-4 space-y-4">
          <h2 className="text-[10px] uppercase tracking-widest text-white/50">Main Text</h2>
          <div>
            {label('Sub-heading (below logo)')}
            <textarea
              className="w-full bg-transparent border border-white/15 text-white text-sm px-3 py-2 focus:outline-none focus:border-white/40 resize-none"
              rows={3}
              value={d.subheading}
              onChange={f('subheading')}
            />
          </div>
        </div>

        <div className="border border-white/15 bg-[var(--charcoal)] p-4 space-y-4">
          <h2 className="text-[10px] uppercase tracking-widest text-white/50">CTA Buttons</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              {label('Primary button label')}
              <input className={inputCls} value={d.cta1Label} onChange={f('cta1Label')} />
              {label('Primary button scrolls to')}
              <select className={selectCls} value={d.cta1Target} onChange={f('cta1Target')}>
                {CTA_TARGETS.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div className="space-y-2">
              {label('Secondary button label')}
              <input className={inputCls} value={d.cta2Label} onChange={f('cta2Label')} />
              {label('Secondary button scrolls to')}
              <select className={selectCls} value={d.cta2Target} onChange={f('cta2Target')}>
                {CTA_TARGETS.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
          </div>
        </div>

        <div className="border border-white/15 bg-[var(--charcoal)] p-4">
          <h2 className="text-[10px] uppercase tracking-widest text-white/50 mb-2">Ticker Tape</h2>
          <p className="text-xs text-white/40 mb-2">One item per line. All caps recommended.</p>
          <textarea
            className="w-full bg-transparent border border-white/15 text-white text-sm px-3 py-2 focus:outline-none focus:border-white/40 font-mono resize-y"
            rows={8}
            value={tickerText}
            onChange={handleTicker}
          />
        </div>
      </div>

      <AdminSaveBar
        show={isDirty}
        saving={saving}
        onSave={handleSave}
        onDiscard={() => { setD(initialData); setMessage(null); setError(null) }}
        message={persistenceBackend === 'firestore' ? `Saving to Firestore (${cmsCollectionId}/hero).` : 'Saving to data/hero.json.'}
      />
    </div>
  )
}
