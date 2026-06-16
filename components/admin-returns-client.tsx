'use client'

import Link from 'next/link'
import { useCallback, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Plus, Trash2 } from 'lucide-react'
import type { ReturnsData } from '@/lib/returns-types'
import { AdminSaveBar } from '@/components/admin-save-bar'

export default function AdminReturnsClient({
  initialData,
  persistenceBackend,
  cmsCollectionId,
}: {
  initialData: ReturnsData
  persistenceBackend: 'firestore' | 'file'
  cmsCollectionId: string
}) {
  const router = useRouter()
  const [data, setData] = useState<ReturnsData>(initialData)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const isDirty = useMemo(() => JSON.stringify(data) !== JSON.stringify(initialData), [data, initialData])

  const updatePoint = (index: number, value: string) => {
    setData((prev) => {
      const points = [...prev.points]
      points[index] = value
      return { ...prev, points }
    })
  }

  const addPoint = () => {
    setData((prev) => ({ ...prev, points: [...prev.points, ''] }))
  }

  const removePoint = (index: number) => {
    setData((prev) => ({ ...prev, points: prev.points.filter((_, i) => i !== index) }))
  }

  const save = useCallback(async () => {
    setSaving(true)
    setMessage(null)
    setError(null)
    try {
      const res = await fetch('/api/admin/returns', {
        method: 'PUT',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      const json = await res.json()
      if (!res.ok) {
        setError(typeof json.error === 'string' ? json.error : 'Save failed')
        return
      }
      setMessage('Saved. The returns page will use this text.')
      router.refresh()
    } catch {
      setError('Save failed')
    } finally {
      setSaving(false)
    }
  }, [data, router])

  const discard = () => {
    if (!window.confirm('Discard unsaved changes?')) return
    setData(initialData)
    setMessage(null)
    setError(null)
  }

  const inputCls =
    'w-full bg-transparent border border-white/15 text-white text-sm px-3 py-2 focus:outline-none focus:border-white/40'
  const label = (text: string) => (
    <label className="text-[10px] uppercase tracking-widest text-white/50 block mb-1">{text}</label>
  )

  return (
    <div className={`max-w-3xl mx-auto px-4 py-12 text-white ${isDirty ? 'pb-28' : ''}`}>
      <div className="mb-8">
        <Link
          href="/admin"
          className="text-[10px] font-bold tracking-widest uppercase text-white/40 hover:text-white/80 transition-colors mb-2 inline-block"
          style={{ fontFamily: 'var(--font-orbitron)' }}
        >
          ← Admin
        </Link>
        <h1 className="text-2xl font-black mb-1" style={{ fontFamily: 'var(--font-orbitron)' }}>
          Returns &amp; payment terms
        </h1>
        <p className="text-white/50 text-sm">
          Edit the text shown on the public returns page. Saved to{' '}
          {persistenceBackend === 'firestore' ? (
            <code className="text-white/70">{cmsCollectionId}/returns</code>
          ) : (
            <code className="text-white/70">data/returns.json</code>
          )}
          .
        </p>
      </div>

      {message && (
        <p className="mb-4 text-sm text-emerald-400/90" role="status">
          {message}
        </p>
      )}
      {error && (
        <p className="mb-4 text-sm text-red-400" role="alert">
          {error}
        </p>
      )}

      <div className="space-y-6">
        <div className="border border-[var(--charcoal-light)] bg-[var(--charcoal)] p-4 space-y-4">
          {label('Page heading')}
          <input
            className={inputCls}
            value={data.pageTitle}
            onChange={(e) => setData((prev) => ({ ...prev, pageTitle: e.target.value }))}
          />
          {label('Section title')}
          <input
            className={inputCls}
            value={data.sectionTitle}
            onChange={(e) => setData((prev) => ({ ...prev, sectionTitle: e.target.value }))}
          />
        </div>

        <div className="border border-[var(--charcoal-light)] bg-[var(--charcoal)] p-4 space-y-4">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-[10px] uppercase tracking-widest text-white/50">Payment terms</h2>
            <button
              type="button"
              onClick={addPoint}
              className="inline-flex items-center gap-1 px-3 py-1.5 border border-[var(--brand-red)]/60 text-[var(--brand-red)] text-[10px] font-bold tracking-widest uppercase hover:bg-[var(--brand-red)]/10"
              style={{ fontFamily: 'var(--font-orbitron)' }}
            >
              <Plus size={12} aria-hidden="true" />
              Add term
            </button>
          </div>

          <ol className="space-y-4">
            {data.points.map((point, index) => (
              <li key={index} className="space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest">
                    Term {index + 1}
                  </span>
                  <button
                    type="button"
                    onClick={() => removePoint(index)}
                    disabled={data.points.length <= 1}
                    className="text-white/30 hover:text-red-400 disabled:opacity-30 transition-colors"
                    title="Remove term"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
                <textarea
                  className={`${inputCls} min-h-[88px] resize-y`}
                  value={point}
                  onChange={(e) => updatePoint(index, e.target.value)}
                />
              </li>
            ))}
          </ol>
        </div>

        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => save()}
            disabled={saving || !isDirty}
            className="px-4 py-2 bg-[var(--brand-red)] text-white text-xs font-bold tracking-widest uppercase disabled:opacity-50"
            style={{ fontFamily: 'var(--font-orbitron)' }}
          >
            {saving ? 'Saving...' : 'Save changes'}
          </button>
          {isDirty && (
            <button
              type="button"
              onClick={discard}
              className="px-4 py-2 border border-white/20 text-white/70 text-xs font-bold tracking-widest uppercase hover:text-white"
              style={{ fontFamily: 'var(--font-orbitron)' }}
            >
              Discard
            </button>
          )}
        </div>
      </div>

      <AdminSaveBar
        show={isDirty}
        saving={saving}
        onSave={() => save()}
        onDiscard={discard}
        message="Unsaved returns text — save to update the live page."
      />
    </div>
  )
}
