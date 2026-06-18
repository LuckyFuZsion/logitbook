'use client'

import Link from 'next/link'
import { useCallback, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import type { DiveDestinationsData } from '@/lib/dive-destinations-types'
import { AdminSaveBar } from '@/components/admin-save-bar'
import { DiveDestinationCard } from '@/components/dive-destination-card'

export default function AdminDiveDestinationsClient({
  initialData,
  persistenceBackend,
  cmsCollectionId,
}: {
  initialData: DiveDestinationsData
  persistenceBackend: 'firestore' | 'file'
  cmsCollectionId: string
}) {
  const router = useRouter()
  const [data, setData] = useState<DiveDestinationsData>(initialData)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const isDirty = useMemo(() => JSON.stringify(data) !== JSON.stringify(initialData), [data, initialData])

  const updateNarrative = (id: string, narrative: string) => {
    setData((prev) => ({
      ...prev,
      destinations: prev.destinations.map((d) => (d.id === id ? { ...d, narrative } : d)),
    }))
  }

  const save = useCallback(async () => {
    setSaving(true)
    setMessage(null)
    setError(null)
    try {
      const res = await fetch('/api/admin/dive-destinations', {
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
      setMessage('Saved. Destination narratives will appear on the dive destinations page.')
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
    <div className={`max-w-5xl mx-auto px-4 py-12 text-white ${isDirty ? 'pb-28' : ''}`}>
      <div className="mb-8">
        <Link
          href="/admin"
          className="text-[10px] font-bold tracking-widest uppercase text-white/40 hover:text-white/80 transition-colors mb-2 inline-block"
          style={{ fontFamily: 'var(--font-orbitron)' }}
        >
          ← Admin
        </Link>
        <h1 className="text-2xl font-black mb-1" style={{ fontFamily: 'var(--font-orbitron)' }}>
          Dive destinations
        </h1>
        <p className="text-white/50 text-sm">
          Add a brief narrative under each destination&apos;s accessibility rating. Saved to{' '}
          {persistenceBackend === 'firestore' ? (
            <code className="text-white/70">{cmsCollectionId}/dive-destinations</code>
          ) : (
            <code className="text-white/70">data/dive-destinations.json</code>
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

      <div className="space-y-8">
        {data.destinations.map((destination) => (
          <div key={destination.id} className="border border-[var(--charcoal-light)] bg-[var(--charcoal)] p-4 md:p-5">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="pointer-events-none opacity-90">
                <DiveDestinationCard destination={destination} />
              </div>
              <div className="flex flex-col">
                {label(`Narrative — ${destination.destination}`)}
                <textarea
                  className={`${inputCls} min-h-[200px] flex-1 resize-y`}
                  value={destination.narrative}
                  onChange={(e) => updateNarrative(destination.id, e.target.value)}
                  placeholder="A short paragraph about accessibility, facilities, and what makes this destination special…"
                />
                <p className="mt-2 text-xs text-white/40">
                  Shown below the star rating on the public dive destinations page. Leave blank to hide.
                </p>
              </div>
            </div>
          </div>
        ))}

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
        message="Unsaved destination narratives — save to update the live page."
      />
    </div>
  )
}
