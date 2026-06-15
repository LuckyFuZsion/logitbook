'use client'

import Link from 'next/link'
import { useCallback, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { ChevronDown, ChevronUp, Plus, Star, Trash2, GripVertical } from 'lucide-react'
import type { TestimonialsData, Testimonial } from '@/lib/testimonials-types'
import {
  countFeaturedReviews,
  HOME_FEATURED_REVIEWS_LIMIT,
} from '@/lib/testimonials-utils'
import { AdminSaveBar } from '@/components/admin-save-bar'
import { ConfirmModal, type ConfirmModalProps } from '@/components/admin-confirm-modal'

function newId() { return `t-${Date.now()}-${Math.random().toString(36).slice(2, 5)}` }

function StarPicker({ value, onChange }: { value: number; onChange: (n: number) => void }) {
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((n) => (
        <button key={n} type="button" onClick={() => onChange(n)} className="text-lg leading-none">
          <Star size={18} className={n <= value ? 'text-amber-400 fill-amber-400' : 'text-white/20'} />
        </button>
      ))}
    </div>
  )
}

function TestimonialRow({
  item, index, total, onUpdate, requestDelete, onMoveUp, onMoveDown, featuredCount,
}: {
  item: Testimonial; index: number; total: number
  onUpdate: (u: Testimonial) => void; requestDelete: () => void
  onMoveUp: () => void; onMoveDown: () => void
  featuredCount: number
}) {
  const [open, setOpen] = useState(false)
  const inputCls = 'w-full bg-transparent border border-white/15 text-white text-sm px-3 py-1.5 focus:outline-none focus:border-white/40'

  return (
    <div className="border border-white/15 bg-[var(--charcoal)] rounded-sm overflow-hidden">
      <div className="flex items-center gap-2 px-3 py-2.5 bg-white/5">
        <div className="flex flex-col gap-0.5 shrink-0">
          <button type="button" disabled={index === 0} onClick={onMoveUp} className="text-white/30 hover:text-white disabled:opacity-20"><ChevronUp size={13} /></button>
          <button type="button" disabled={index === total - 1} onClick={onMoveDown} className="text-white/30 hover:text-white disabled:opacity-20"><ChevronDown size={13} /></button>
        </div>
        <GripVertical size={13} className="text-white/20 shrink-0" aria-hidden />
        <button type="button" onClick={() => setOpen(o => !o)} className="flex-1 text-left flex items-center gap-2 min-w-0">
          <span className="text-[10px] font-bold text-white/30 w-5 text-right tabular-nums" style={{ fontFamily: 'var(--font-orbitron)' }}>{index + 1}</span>
          <span className="text-sm text-white/80 truncate">{item.name || <span className="text-white/30 italic">Unnamed</span>}</span>
          {item.featured && <span className="text-[9px] border border-[var(--brand-red)]/50 text-[var(--brand-red)] px-1.5 py-0.5 uppercase tracking-wider shrink-0">Featured</span>}
          <span className="ml-auto text-white/30 text-xs shrink-0">{open ? '▲' : '▼'}</span>
        </button>
        <button type="button" onClick={requestDelete} className="text-white/30 hover:text-red-400 transition-colors ml-1 shrink-0"><Trash2 size={14} /></button>
      </div>
      {open && (
        <div className="p-3 space-y-3 border-t border-white/10">
          <div className="grid sm:grid-cols-2 gap-3">
            <div>
              <label className="text-[10px] uppercase tracking-widest text-white/50 block mb-1">Name</label>
              <input className={inputCls} value={item.name} onChange={(e) => onUpdate({ ...item, name: e.target.value })} />
            </div>
            <div>
              <label className="text-[10px] uppercase tracking-widest text-white/50 block mb-1">Role / Title (optional)</label>
              <input className={inputCls} value={item.role ?? ''} onChange={(e) => onUpdate({ ...item, role: e.target.value || undefined })} />
            </div>
          </div>
          <div>
            <label className="text-[10px] uppercase tracking-widest text-white/50 block mb-1">Review</label>
            <textarea
              rows={4}
              className="w-full bg-transparent border border-white/15 text-white text-sm px-3 py-2 focus:outline-none focus:border-white/40 resize-y"
              value={item.text}
              onChange={(e) => onUpdate({ ...item, text: e.target.value })}
            />
          </div>
          <div className="grid sm:grid-cols-3 gap-3 items-end">
            <div>
              <label className="text-[10px] uppercase tracking-widest text-white/50 block mb-2">Rating</label>
              <StarPicker value={item.rating} onChange={(n) => onUpdate({ ...item, rating: n })} />
            </div>
            <div>
              <label className="text-[10px] uppercase tracking-widest text-white/50 block mb-1">Date (YYYY-MM, optional)</label>
              <input className={inputCls} value={item.date ?? ''} placeholder="2026-01" onChange={(e) => onUpdate({ ...item, date: e.target.value || undefined })} />
            </div>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={item.featured}
                disabled={!item.featured && featuredCount >= HOME_FEATURED_REVIEWS_LIMIT}
                onChange={(e) => onUpdate({ ...item, featured: e.target.checked })}
                className="accent-[var(--brand-red)] w-4 h-4 disabled:opacity-40"
              />
              <span className="text-sm text-white/70">
                Featured on homepage
                {!item.featured && featuredCount >= HOME_FEATURED_REVIEWS_LIMIT && (
                  <span className="text-white/40"> (max {HOME_FEATURED_REVIEWS_LIMIT})</span>
                )}
              </span>
            </label>
          </div>
        </div>
      )}
    </div>
  )
}

export default function AdminTestimonialsClient({
  initialData,
  persistenceBackend,
  cmsCollectionId,
}: {
  initialData: TestimonialsData
  persistenceBackend: 'firestore' | 'file'
  cmsCollectionId: string
}) {
  const router = useRouter()
  const [items, setItems] = useState(initialData.items)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [confirm, setConfirm] = useState<Omit<ConfirmModalProps, 'onCancel'> | null>(null)

  const isDirty = useMemo(() => JSON.stringify(items) !== JSON.stringify(initialData.items), [items, initialData.items])

  const update = (idx: number, u: Testimonial) => setItems((p) => p.map((x, i) => i === idx ? u : x))
  const move = (idx: number, dir: -1 | 1) => setItems((p) => {
    const n = [...p]; const t = idx + dir
    if (t < 0 || t >= n.length) return p
    ;[n[idx], n[t]] = [n[t], n[idx]]; return n
  })
  const deleteItem = (idx: number) => setItems((p) => p.filter((_, i) => i !== idx))
  const requestDelete = (idx: number) => {
    const it = items[idx]
    setConfirm({ title: 'Delete review?', description: it.name ? `"${it.name}"'s review will be removed.` : 'This review will be removed.', confirmLabel: 'Delete', onConfirm: () => deleteItem(idx) })
  }

  const featuredCount = countFeaturedReviews(items)

  const handleSave = useCallback(async () => {
    setSaving(true); setError(null); setMessage(null)
    const empty = items.findIndex((x) => !x.name.trim() || !x.text.trim())
    if (empty !== -1) { setError(`Review #${empty + 1} needs both a name and review text.`); setSaving(false); return }
    if (featuredCount > HOME_FEATURED_REVIEWS_LIMIT) {
      setError(`No more than ${HOME_FEATURED_REVIEWS_LIMIT} reviews can be featured on the homepage.`)
      setSaving(false)
      return
    }
    const res = await fetch('/api/admin/testimonials', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ items }) })
    const json = await res.json()
    setSaving(false)
    if (!res.ok) { setError(json.error ?? 'Save failed') } else { setMessage('Saved.'); router.refresh() }
  }, [featuredCount, items, router])

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 pb-28 text-white">
      <div className="mb-8">
        <Link href="/admin" className="text-[10px] font-bold tracking-widest uppercase text-white/40 hover:text-white/80 transition-colors mb-2 inline-block" style={{ fontFamily: 'var(--font-orbitron)' }}>← Admin</Link>
        <h1 className="text-2xl font-black text-white mb-1" style={{ fontFamily: 'var(--font-orbitron)' }}>TESTIMONIALS</h1>
        <p className="text-sm text-white/50">
          {items.length} review{items.length !== 1 ? 's' : ''}. Mark up to{' '}
          {HOME_FEATURED_REVIEWS_LIMIT} as featured for the homepage (desktop). All reviews appear on the{' '}
          <span className="text-white/70">/testimonials</span> page.
        </p>
        <p className="text-xs text-white/40 mt-2">
          Featured on homepage: {countFeaturedReviews(items)}/{HOME_FEATURED_REVIEWS_LIMIT}
        </p>
      </div>
      {error && <div className="mb-4 border border-red-500/40 bg-red-500/10 text-red-300 text-sm px-4 py-3">{error}</div>}
      {message && !isDirty && <div className="mb-4 border border-green-500/40 bg-green-500/10 text-green-300 text-sm px-4 py-3">{message}</div>}
      <div className="space-y-2 mb-4">
        {items.map((item, idx) => (
          <TestimonialRow key={item.id} item={item} index={idx} total={items.length}
            featuredCount={featuredCount}
            onUpdate={(u) => update(idx, u)} requestDelete={() => requestDelete(idx)}
            onMoveUp={() => move(idx, -1)} onMoveDown={() => move(idx, 1)} />
        ))}
      </div>
      <button type="button" onClick={() => setItems((p) => [...p, { id: newId(), name: '', text: '', rating: 5, featured: false }])}
        className="flex items-center gap-2 text-sm text-white/50 hover:text-white border border-dashed border-white/20 hover:border-white/40 px-4 py-3 transition-colors w-full justify-center">
        <Plus size={14} /> Add Review
      </button>
      <AdminSaveBar show={isDirty} saving={saving} onSave={handleSave} onDiscard={() => { setItems(initialData.items); setMessage(null); setError(null) }}
        message={persistenceBackend === 'firestore' ? `Saves to Firestore (${cmsCollectionId}/testimonials).` : 'Saves to data/testimonials.json.'} />
      {confirm && <ConfirmModal {...confirm} onCancel={() => setConfirm(null)} />}
    </div>
  )
}
