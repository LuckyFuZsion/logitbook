'use client'

import Link from 'next/link'
import { useCallback, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { ChevronUp, ChevronDown, Plus, Trash2, GripVertical } from 'lucide-react'
import type { FaqData, FaqItem } from '@/lib/faq-types'
import { AdminSaveBar } from '@/components/admin-save-bar'
import { ConfirmModal, type ConfirmModalProps } from '@/components/admin-confirm-modal'

function newFaqId() {
  return `faq-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`
}

function newFaqItem(): FaqItem {
  return { id: newFaqId(), question: '', answer: '' }
}

/* ──────── Single FAQ row ──────── */

function FaqRow({
  item,
  index,
  total,
  onUpdate,
  requestDelete,
  onMoveUp,
  onMoveDown,
}: {
  item: FaqItem
  index: number
  total: number
  onUpdate: (updated: FaqItem) => void
  requestDelete: () => void
  onMoveUp: () => void
  onMoveDown: () => void
}) {
  const [open, setOpen] = useState(false)

  return (
    <div className="border border-white/15 bg-[var(--charcoal)] rounded-sm overflow-hidden">
      {/* Header row */}
      <div className="flex items-center gap-2 px-3 py-2.5 bg-white/5">
        {/* Reorder */}
        <div className="flex flex-col gap-0.5 shrink-0">
          <button
            type="button"
            title="Move up"
            disabled={index === 0}
            onClick={onMoveUp}
            className="text-white/30 hover:text-white disabled:opacity-20 transition-colors"
          >
            <ChevronUp size={13} />
          </button>
          <button
            type="button"
            title="Move down"
            disabled={index === total - 1}
            onClick={onMoveDown}
            className="text-white/30 hover:text-white disabled:opacity-20 transition-colors"
          >
            <ChevronDown size={13} />
          </button>
        </div>
        <GripVertical size={13} className="text-white/20 shrink-0" aria-hidden />

        {/* Number + question preview */}
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          className="flex-1 text-left flex items-center gap-2 min-w-0"
        >
          <span
            className="text-[10px] font-bold text-white/30 shrink-0 w-6 text-right tabular-nums"
            style={{ fontFamily: 'var(--font-orbitron)' }}
          >
            {index + 1}
          </span>
          <span className="text-sm text-white/80 truncate">
            {item.question || <span className="text-white/30 italic">Untitled question</span>}
          </span>
          <span className="ml-auto text-white/30 text-xs shrink-0">
            {open ? '▲' : '▼'}
          </span>
        </button>

        {/* Delete */}
        <button
          type="button"
          title="Delete FAQ"
          onClick={requestDelete}
          className="text-white/30 hover:text-red-400 transition-colors ml-1 shrink-0"
        >
          <Trash2 size={14} />
        </button>
      </div>

      {/* Expanded editor */}
      {open && (
        <div className="p-3 space-y-3 border-t border-white/10">
          <div>
            <label className="text-[10px] uppercase tracking-widest text-white/50 block mb-1">
              Question
            </label>
            <input
              type="text"
              value={item.question}
              placeholder="Enter the question…"
              onChange={(e) => onUpdate({ ...item, question: e.target.value })}
              className="w-full bg-transparent border border-white/15 text-white text-sm px-3 py-1.5 focus:outline-none focus:border-white/40"
            />
          </div>
          <div>
            <label className="text-[10px] uppercase tracking-widest text-white/50 block mb-1">
              Answer{' '}
              <span className="normal-case font-normal text-white/30">
                — use blank lines between paragraphs, &ldquo;- item&rdquo; for bullet points
              </span>
            </label>
            <textarea
              value={item.answer}
              rows={8}
              placeholder={'Enter the answer…\n\nUse blank lines between paragraphs.\n- Use "- " prefix for bullet points'}
              onChange={(e) => onUpdate({ ...item, answer: e.target.value })}
              className="w-full bg-transparent border border-white/15 text-white text-sm px-3 py-2 focus:outline-none focus:border-white/40 resize-y font-mono leading-relaxed"
            />
          </div>
        </div>
      )}
    </div>
  )
}

/* ──────── Main component ──────── */

export default function AdminFaqClient({
  initialData,
  persistenceBackend,
  cmsCollectionId,
}: {
  initialData: FaqData
  persistenceBackend: 'firestore' | 'file'
  cmsCollectionId: string
}) {
  const router = useRouter()
  const [items, setItems] = useState<FaqItem[]>(initialData.items)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [confirm, setConfirm] = useState<Omit<ConfirmModalProps, 'onCancel'> | null>(null)

  const isDirty = useMemo(
    () => JSON.stringify(items) !== JSON.stringify(initialData.items),
    [items, initialData.items],
  )

  const saveMessage =
    persistenceBackend === 'firestore'
      ? `Saving to Firestore (${cmsCollectionId}/faq) — FAQ page and schema update live immediately.`
      : 'Saving to data/faq.json — redeploy to update production.'

  function updateItem(idx: number, updated: FaqItem) {
    setItems((prev) => prev.map((it, i) => (i === idx ? updated : it)))
    setMessage(null)
    setError(null)
  }

  function deleteItem(idx: number) {
    setItems((prev) => prev.filter((_, i) => i !== idx))
  }

  function requestDelete(idx: number) {
    const it = items[idx]
    setConfirm({
      title: 'Delete FAQ?',
      description: it.question
        ? `"${it.question.slice(0, 80)}${it.question.length > 80 ? '…' : ''}" will be permanently removed.`
        : 'This FAQ item will be permanently removed.',
      confirmLabel: 'Delete',
      onConfirm: () => deleteItem(idx),
    })
  }

  function moveItem(idx: number, dir: -1 | 1) {
    setItems((prev) => {
      const next = [...prev]
      const target = idx + dir
      if (target < 0 || target >= next.length) return prev
      ;[next[idx], next[target]] = [next[target], next[idx]]
      return next
    })
  }

  function addItem() {
    setItems((prev) => [...prev, newFaqItem()])
    // scroll to bottom after render
    requestAnimationFrame(() => {
      window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' })
    })
  }

  const handleSave = useCallback(async () => {
    setSaving(true)
    setError(null)
    setMessage(null)

    const emptyQ = items.findIndex((it) => !it.question.trim())
    if (emptyQ !== -1) {
      setError(`FAQ #${emptyQ + 1} has no question — please fill it in or delete it.`)
      setSaving(false)
      return
    }

    try {
      const res = await fetch('/api/admin/faq', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items }),
      })
      const json = await res.json()
      if (!res.ok) {
        setError(json.error ?? 'Save failed')
      } else {
        setMessage('Saved. FAQ page and schema are now live.')
        router.refresh()
      }
    } catch {
      setError('Network error — please try again.')
    } finally {
      setSaving(false)
    }
  }, [items, router])

  const handleDiscard = useCallback(() => {
    setItems(initialData.items)
    setMessage(null)
    setError(null)
  }, [initialData.items])

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 pb-28 text-white">
      {/* Header */}
      <div className="mb-8">
        <Link
          href="/admin"
          className="text-[10px] font-bold tracking-widest uppercase text-white/40 hover:text-white/80 transition-colors mb-2 inline-block"
          style={{ fontFamily: 'var(--font-orbitron)' }}
        >
          ← Admin
        </Link>
        <h1
          className="text-2xl font-black text-white mb-1"
          style={{ fontFamily: 'var(--font-orbitron)' }}
        >
          FAQ ADMIN
        </h1>
        <p className="text-sm text-white/50">
          {items.length} question{items.length !== 1 ? 's' : ''}. Changes update the live FAQ and its schema.org JSON-LD on save.
        </p>
      </div>

      {/* Messages */}
      {error && (
        <div className="mb-4 border border-red-500/40 bg-red-500/10 text-red-300 text-sm px-4 py-3">
          {error}
        </div>
      )}
      {message && !isDirty && (
        <div className="mb-4 border border-green-500/40 bg-green-500/10 text-green-300 text-sm px-4 py-3">
          {message}
        </div>
      )}

      {/* FAQ list */}
      <div className="space-y-2 mb-6">
        {items.map((item, idx) => (
          <FaqRow
            key={item.id}
            item={item}
            index={idx}
            total={items.length}
            onUpdate={(updated) => updateItem(idx, updated)}
            requestDelete={() => requestDelete(idx)}
            onMoveUp={() => moveItem(idx, -1)}
            onMoveDown={() => moveItem(idx, 1)}
          />
        ))}
      </div>

      {/* Add button */}
      <button
        type="button"
        onClick={addItem}
        className="flex items-center gap-2 text-sm text-white/50 hover:text-white border border-dashed border-white/20 hover:border-white/40 px-4 py-3 transition-colors w-full justify-center"
      >
        <Plus size={14} /> Add FAQ
      </button>

      <AdminSaveBar
        show={isDirty}
        saving={saving}
        onSave={handleSave}
        onDiscard={handleDiscard}
        message={saveMessage}
      />

      {confirm && (
        <ConfirmModal
          {...confirm}
          onCancel={() => setConfirm(null)}
        />
      )}
    </div>
  )
}
