'use client'

import Link from 'next/link'
import { useCallback, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { ChevronDown, ChevronUp, Plus, Trash2 } from 'lucide-react'
import type { StoryData, StoryMilestone, StoryValue } from '@/lib/story-types'
import { AdminSaveBar } from '@/components/admin-save-bar'
import { ConfirmModal, type ConfirmModalProps } from '@/components/admin-confirm-modal'

const STORY_ICONS = ['Target', 'TrendingUp', 'Users', 'Globe', 'Shield', 'Zap', 'Anchor', 'Star', 'Heart', 'Award']

function newMsId() { return `ms-${Date.now()}` }
function newValId() { return `v-${Date.now()}` }

const inputCls = 'w-full bg-transparent border border-white/15 text-white text-sm px-3 py-1.5 focus:outline-none focus:border-white/40'
const textareaCls = 'w-full bg-transparent border border-white/15 text-white text-sm px-3 py-2 focus:outline-none focus:border-white/40 resize-y'
function Label({ children }: { children: React.ReactNode }) {
  return <label className="text-[10px] uppercase tracking-widest text-white/50 block mb-1">{children}</label>
}

function SectionBox({ title, children }: { title: string; children: React.ReactNode }) {
  const [open, setOpen] = useState(true)
  return (
    <div className="border border-white/15 bg-[var(--charcoal)] rounded-sm overflow-hidden">
      <button type="button" onClick={() => setOpen(o => !o)} className="w-full flex items-center justify-between px-4 py-3 bg-white/5 border-b border-white/10">
        <span className="text-sm font-black text-white tracking-wide" style={{ fontFamily: 'var(--font-orbitron)' }}>{title}</span>
        {open ? <ChevronUp size={15} className="text-white/50" /> : <ChevronDown size={15} className="text-white/50" />}
      </button>
      {open && <div className="p-4">{children}</div>}
    </div>
  )
}

export default function AdminStoryClient({
  initialData, persistenceBackend, cmsCollectionId,
}: {
  initialData: StoryData; persistenceBackend: 'firestore' | 'file'; cmsCollectionId: string
}) {
  const router = useRouter()
  const [d, setD] = useState(initialData)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [confirm, setConfirm] = useState<Omit<ConfirmModalProps, 'onCancel'> | null>(null)

  const isDirty = useMemo(() => JSON.stringify(d) !== JSON.stringify(initialData), [d, initialData])

  /* Milestones */
  const updateMs = (idx: number, u: StoryMilestone) => setD((p) => ({ ...p, milestones: p.milestones.map((m, i) => i === idx ? u : m) }))
  const deleteMs = (idx: number) => setD((p) => ({ ...p, milestones: p.milestones.filter((_, i) => i !== idx) }))
  const moveMs = (idx: number, dir: -1 | 1) => setD((p) => {
    const a = [...p.milestones]; const t = idx + dir; if (t < 0 || t >= a.length) return p
    ;[a[idx], a[t]] = [a[t], a[idx]]; return { ...p, milestones: a }
  })

  /* Values */
  const updateVal = (idx: number, u: StoryValue) => setD((p) => ({ ...p, values: p.values.map((v, i) => i === idx ? u : v) }))
  const deleteVal = (idx: number) => setD((p) => ({ ...p, values: p.values.filter((_, i) => i !== idx) }))
  const moveVal = (idx: number, dir: -1 | 1) => setD((p) => {
    const a = [...p.values]; const t = idx + dir; if (t < 0 || t >= a.length) return p
    ;[a[idx], a[t]] = [a[t], a[idx]]; return { ...p, values: a }
  })

  const requestConfirmMs = (idx: number) => {
    const m = d.milestones[idx]
    setConfirm({ title: 'Delete milestone?', description: m.title ? `"${m.title}" will be removed.` : 'This milestone will be removed.', confirmLabel: 'Delete', onConfirm: () => deleteMs(idx) })
  }
  const requestConfirmVal = (idx: number) => {
    const v = d.values[idx]
    setConfirm({ title: 'Delete value?', description: v.title ? `"${v.title}" will be removed.` : 'This value will be removed.', confirmLabel: 'Delete', onConfirm: () => deleteVal(idx) })
  }

  const handleSave = useCallback(async () => {
    setSaving(true); setError(null); setMessage(null)
    const res = await fetch('/api/admin/story', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(d) })
    const json = await res.json()
    setSaving(false)
    if (!res.ok) { setError(json.error ?? 'Save failed') } else { setMessage('Saved.'); router.refresh() }
  }, [d, router])

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 pb-28 text-white">
      <div className="mb-8">
        <Link href="/admin" className="text-[10px] font-bold tracking-widest uppercase text-white/40 hover:text-white/80 transition-colors mb-2 inline-block" style={{ fontFamily: 'var(--font-orbitron)' }}>← Admin</Link>
        <h1 className="text-2xl font-black mb-1" style={{ fontFamily: 'var(--font-orbitron)' }}>BRAND STORY</h1>
        <p className="text-sm text-white/50">Edit story text, timeline milestones, and &ldquo;What We Stand For&rdquo; values.</p>
      </div>

      {error && <div className="mb-4 border border-red-500/40 bg-red-500/10 text-red-300 text-sm px-4 py-3">{error}</div>}
      {message && !isDirty && <div className="mb-4 border border-green-500/40 bg-green-500/10 text-green-300 text-sm px-4 py-3">{message}</div>}

      <div className="space-y-4">
        {/* Story text */}
        <SectionBox title="Story Text">
          <div className="space-y-3">
            <div><Label>Paragraph 1</Label><textarea className={textareaCls} rows={4} value={d.paragraph1} onChange={(e) => setD((p) => ({ ...p, paragraph1: e.target.value }))} /></div>
            <div><Label>Paragraph 2</Label><textarea className={textareaCls} rows={4} value={d.paragraph2} onChange={(e) => setD((p) => ({ ...p, paragraph2: e.target.value }))} /></div>
            <div>
              <Label>Feature bullets (one per line)</Label>
              <textarea className={`${textareaCls} font-mono`} rows={5} value={d.bullets.join('\n')} onChange={(e) => setD((p) => ({ ...p, bullets: e.target.value.split('\n').map(s => s.trimEnd()).filter(Boolean) }))} />
            </div>
          </div>
        </SectionBox>

        {/* Milestones */}
        <SectionBox title="Timeline Milestones">
          <div className="space-y-2 mb-3">
            {d.milestones.map((ms, idx) => (
              <div key={ms.id} className="border border-white/10 bg-white/3 p-3 space-y-2">
                <div className="flex items-center gap-2">
                  <div className="flex flex-col gap-0.5">
                    <button type="button" disabled={idx === 0} onClick={() => moveMs(idx, -1)} className="text-white/30 hover:text-white disabled:opacity-20"><ChevronUp size={13} /></button>
                    <button type="button" disabled={idx === d.milestones.length - 1} onClick={() => moveMs(idx, 1)} className="text-white/30 hover:text-white disabled:opacity-20"><ChevronDown size={13} /></button>
                  </div>
                  <span className="text-xs text-white/50 flex-1">{ms.year} — {ms.title}</span>
                  <button type="button" onClick={() => requestConfirmMs(idx)} className="text-white/30 hover:text-red-400 transition-colors"><Trash2 size={14} /></button>
                </div>
                <div className="grid sm:grid-cols-4 gap-2 items-start">
                  <div><Label>Year</Label><input className={inputCls} value={ms.year} onChange={(e) => updateMs(idx, { ...ms, year: e.target.value })} /></div>
                  <div className="sm:col-span-3"><Label>Title</Label><input className={inputCls} value={ms.title} onChange={(e) => updateMs(idx, { ...ms, title: e.target.value })} /></div>
                </div>
                <div><Label>Description</Label><textarea className={textareaCls} rows={2} value={ms.description} onChange={(e) => updateMs(idx, { ...ms, description: e.target.value })} /></div>
              </div>
            ))}
          </div>
          <button type="button" onClick={() => setD((p) => ({ ...p, milestones: [...p.milestones, { id: newMsId(), year: '', title: '', description: '' }] }))}
            className="flex items-center gap-2 text-sm text-white/50 hover:text-white border border-dashed border-white/20 px-3 py-2 w-full justify-center">
            <Plus size={13} /> Add Milestone
          </button>
        </SectionBox>

        {/* Values */}
        <SectionBox title="What We Stand For">
          <div className="space-y-2 mb-3">
            {d.values.map((val, idx) => (
              <div key={val.id} className="border border-white/10 bg-white/3 p-3 space-y-2">
                <div className="flex items-center gap-2">
                  <div className="flex flex-col gap-0.5">
                    <button type="button" disabled={idx === 0} onClick={() => moveVal(idx, -1)} className="text-white/30 hover:text-white disabled:opacity-20"><ChevronUp size={13} /></button>
                    <button type="button" disabled={idx === d.values.length - 1} onClick={() => moveVal(idx, 1)} className="text-white/30 hover:text-white disabled:opacity-20"><ChevronDown size={13} /></button>
                  </div>
                  <span className="text-xs text-white/50 flex-1">{val.icon} — {val.title}</span>
                  <button type="button" onClick={() => requestConfirmVal(idx)} className="text-white/30 hover:text-red-400 transition-colors"><Trash2 size={14} /></button>
                </div>
                <div className="grid sm:grid-cols-3 gap-2">
                  <div>
                    <Label>Icon</Label>
                    <select value={val.icon} onChange={(e) => updateVal(idx, { ...val, icon: e.target.value })} className="w-full bg-[var(--charcoal)] border border-white/15 text-white text-sm px-3 py-1.5 focus:outline-none">
                      {STORY_ICONS.map((ic) => <option key={ic} value={ic}>{ic}</option>)}
                    </select>
                  </div>
                  <div><Label>Title</Label><input className={inputCls} value={val.title} onChange={(e) => updateVal(idx, { ...val, title: e.target.value })} /></div>
                  <div><Label>Description</Label><input className={inputCls} value={val.description} onChange={(e) => updateVal(idx, { ...val, description: e.target.value })} /></div>
                </div>
              </div>
            ))}
          </div>
          <button type="button" onClick={() => setD((p) => ({ ...p, values: [...p.values, { id: newValId(), icon: 'Star', title: '', description: '' }] }))}
            className="flex items-center gap-2 text-sm text-white/50 hover:text-white border border-dashed border-white/20 px-3 py-2 w-full justify-center">
            <Plus size={13} /> Add Value
          </button>
        </SectionBox>
      </div>

      <AdminSaveBar show={isDirty} saving={saving} onSave={handleSave} onDiscard={() => { setD(initialData); setMessage(null); setError(null) }}
        message={persistenceBackend === 'firestore' ? `Saves to Firestore (${cmsCollectionId}/story).` : 'Saves to data/story.json.'} />
      {confirm && <ConfirmModal {...confirm} onCancel={() => setConfirm(null)} />}
    </div>
  )
}
