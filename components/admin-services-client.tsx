'use client'

import Link from 'next/link'
import { useCallback, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  ChevronDown,
  ChevronUp,
  Plus,
  Trash2,
  GripVertical,
} from 'lucide-react'
import type { ServicesData, ServiceCategory, ServiceItem } from '@/lib/services-types'
import { AdminSaveBar } from '@/components/admin-save-bar'
import { ConfirmModal, type ConfirmModalProps } from '@/components/admin-confirm-modal'
import { cn } from '@/lib/utils'

const ICON_OPTIONS = Object.values({
  cylinders: '/icons/cylinder.webp',
  regulators: '/icons/regulator.webp',
  bcds: '/icons/bcd.webp',
  repairs: '/icons/repairs.webp',
})

function newCategoryId() {
  return `cat-${Date.now()}`
}
function newServiceId() {
  return `svc-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`
}

function newCategory(): ServiceCategory {
  return {
    id: newCategoryId(),
    title: 'New Category',
    icon: '/icons/repairs.webp',
    description: '',
    services: [],
  }
}

function newServiceItem(): ServiceItem {
  return {
    id: newServiceId(),
    name: '',
    standard: null,
    member: null,
    note: '',
  }
}

function priceToString(v: number | null): string {
  if (v === null) return ''
  return String(v)
}

function stringToPrice(s: string): number | null {
  const trimmed = s.trim()
  if (trimmed === '' || trimmed === '-') return null
  const n = parseFloat(trimmed)
  return isNaN(n) ? null : Math.round(n * 100) / 100
}

/* ──────── Sub-components ──────── */

function ServiceItemRow({
  item,
  onUpdate,
  requestDelete,
  onMoveUp,
  onMoveDown,
  isFirst,
  isLast,
}: {
  item: ServiceItem
  onUpdate: (updated: ServiceItem) => void
  requestDelete: () => void
  onMoveUp: () => void
  onMoveDown: () => void
  isFirst: boolean
  isLast: boolean
}) {
  return (
    <div className="grid grid-cols-[auto_1fr_auto] gap-2 items-start border border-white/10 bg-white/3 p-3 rounded-sm">
      {/* Reorder */}
      <div className="flex flex-col gap-0.5 pt-1">
        <button
          type="button"
          title="Move up"
          disabled={isFirst}
          onClick={onMoveUp}
          className="text-white/30 hover:text-white disabled:opacity-20 transition-colors"
        >
          <ChevronUp size={14} />
        </button>
        <button
          type="button"
          title="Move down"
          disabled={isLast}
          onClick={onMoveDown}
          className="text-white/30 hover:text-white disabled:opacity-20 transition-colors"
        >
          <ChevronDown size={14} />
        </button>
      </div>

      {/* Fields */}
      <div className="grid gap-2">
        {/* Name */}
        <input
          type="text"
          placeholder="Service name"
          value={item.name}
          onChange={(e) => onUpdate({ ...item, name: e.target.value })}
          className="w-full bg-transparent border border-white/15 text-white text-sm px-3 py-1.5 focus:outline-none focus:border-white/40"
        />
        <div className="grid grid-cols-3 gap-2">
          {/* Standard */}
          <div>
            <label className="text-[10px] uppercase tracking-widest text-white/50 block mb-1">
              Standard £
            </label>
            <input
              type="text"
              inputMode="decimal"
              placeholder="blank = POA"
              value={priceToString(item.standard)}
              onChange={(e) => onUpdate({ ...item, standard: stringToPrice(e.target.value) })}
              className="w-full bg-transparent border border-white/15 text-white text-sm px-2 py-1.5 focus:outline-none focus:border-white/40"
            />
          </div>
          {/* Member */}
          <div>
            <label className="text-[10px] uppercase tracking-widest text-white/50 block mb-1">
              Member £
            </label>
            <input
              type="text"
              inputMode="decimal"
              placeholder="blank = POA"
              value={priceToString(item.member)}
              onChange={(e) => onUpdate({ ...item, member: stringToPrice(e.target.value) })}
              className="w-full bg-transparent border border-white/15 text-white text-sm px-2 py-1.5 focus:outline-none focus:border-white/40"
            />
          </div>
          {/* Note */}
          <div>
            <label className="text-[10px] uppercase tracking-widest text-white/50 block mb-1">
              Note (optional)
            </label>
            <input
              type="text"
              placeholder="e.g. Free with purchase"
              value={item.note ?? ''}
              onChange={(e) => onUpdate({ ...item, note: e.target.value || undefined })}
              className="w-full bg-transparent border border-white/15 text-white text-sm px-2 py-1.5 focus:outline-none focus:border-white/40"
            />
          </div>
        </div>
      </div>

      {/* Delete */}
      <button
        type="button"
        title="Delete service"
        onClick={requestDelete}
        className="mt-1 text-white/30 hover:text-red-400 transition-colors"
      >
        <Trash2 size={15} />
      </button>
    </div>
  )
}

function CategoryCard({
  category,
  onUpdate,
  onDelete,
  onMoveUp,
  onMoveDown,
  isFirst,
  isLast,
  requestConfirm,
}: {
  category: ServiceCategory
  onUpdate: (updated: ServiceCategory) => void
  onDelete: () => void
  onMoveUp: () => void
  onMoveDown: () => void
  isFirst: boolean
  isLast: boolean
  requestConfirm: (opts: Omit<ConfirmModalProps, 'onCancel'>) => void
}) {
  const [open, setOpen] = useState(true)

  function updateService(idx: number, updated: ServiceItem) {
    const services = category.services.map((s, i) => (i === idx ? updated : s))
    onUpdate({ ...category, services })
  }

  function deleteService(idx: number) {
    const services = category.services.filter((_, i) => i !== idx)
    onUpdate({ ...category, services })
  }

  function requestDeleteService(idx: number) {
    const svc = category.services[idx]
    requestConfirm({
      title: 'Remove service item?',
      description: svc.name
        ? `"${svc.name}" will be removed from this category.`
        : 'This service item will be removed.',
      confirmLabel: 'Remove',
      onConfirm: () => deleteService(idx),
    })
  }

  function addService() {
    onUpdate({ ...category, services: [...category.services, newServiceItem()] })
  }

  function moveService(idx: number, dir: -1 | 1) {
    const services = [...category.services]
    const target = idx + dir
    if (target < 0 || target >= services.length) return
    ;[services[idx], services[target]] = [services[target], services[idx]]
    onUpdate({ ...category, services })
  }

  return (
    <div className="border border-white/15 bg-[var(--charcoal)] rounded-sm overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-2 px-4 py-3 border-b border-white/10 bg-white/5">
        <div className="flex flex-col gap-0.5">
          <button
            type="button"
            title="Move category up"
            disabled={isFirst}
            onClick={onMoveUp}
            className="text-white/30 hover:text-white disabled:opacity-20 transition-colors"
          >
            <ChevronUp size={14} />
          </button>
          <button
            type="button"
            title="Move category down"
            disabled={isLast}
            onClick={onMoveDown}
            className="text-white/30 hover:text-white disabled:opacity-20 transition-colors"
          >
            <ChevronDown size={14} />
          </button>
        </div>
        <GripVertical size={14} className="text-white/20 shrink-0" aria-hidden />
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          className="flex-1 text-left font-bold text-white text-sm tracking-wide flex items-center gap-2"
          style={{ fontFamily: 'var(--font-orbitron)' }}
        >
          {category.title || 'Untitled Category'}
          <span className="text-white/30 text-xs font-normal">
            ({category.services.length} services)
          </span>
          {open ? <ChevronUp size={14} className="ml-auto" /> : <ChevronDown size={14} className="ml-auto" />}
        </button>
        <button
          type="button"
          title="Delete category"
          onClick={() =>
            requestConfirm({
              title: 'Delete category?',
              description: category.title
                ? `"${category.title}" and all its service items will be deleted.`
                : 'This category and all its service items will be deleted.',
              confirmLabel: 'Delete',
              onConfirm: onDelete,
            })
          }
          className="text-white/30 hover:text-red-400 transition-colors ml-2"
        >
          <Trash2 size={15} />
        </button>
      </div>

      {/* Body */}
      {open && (
        <div className="p-4 space-y-4">
          {/* Category fields */}
          <div className="grid sm:grid-cols-2 gap-3">
            <div>
              <label className="text-[10px] uppercase tracking-widest text-white/50 block mb-1">
                Category Title
              </label>
              <input
                type="text"
                value={category.title}
                onChange={(e) => onUpdate({ ...category, title: e.target.value })}
                className="w-full bg-transparent border border-white/15 text-white text-sm px-3 py-1.5 focus:outline-none focus:border-white/40"
              />
            </div>
            <div>
              <label className="text-[10px] uppercase tracking-widest text-white/50 block mb-1">
                Icon
              </label>
              <select
                value={category.icon}
                onChange={(e) => onUpdate({ ...category, icon: e.target.value })}
                className="w-full bg-[var(--charcoal)] border border-white/15 text-white text-sm px-3 py-1.5 focus:outline-none focus:border-white/40"
              >
                {ICON_OPTIONS.map((icon) => (
                  <option key={icon} value={icon}>
                    {icon}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div>
            <label className="text-[10px] uppercase tracking-widest text-white/50 block mb-1">
              Description
            </label>
            <textarea
              value={category.description}
              rows={2}
              onChange={(e) => onUpdate({ ...category, description: e.target.value })}
              className="w-full bg-transparent border border-white/15 text-white text-sm px-3 py-1.5 focus:outline-none focus:border-white/40 resize-none"
            />
          </div>

          {/* Services */}
          <div>
            <h4
              className="text-[10px] uppercase tracking-widest text-white/50 mb-2"
            >
              Services
            </h4>
            <div className="space-y-2">
              {category.services.map((svc, idx) => (
                <ServiceItemRow
                  key={svc.id}
                  item={svc}
                  isFirst={idx === 0}
                  isLast={idx === category.services.length - 1}
                  onUpdate={(updated) => updateService(idx, updated)}
                  requestDelete={() => requestDeleteService(idx)}
                  onMoveUp={() => moveService(idx, -1)}
                  onMoveDown={() => moveService(idx, 1)}
                />
              ))}
            </div>
            <button
              type="button"
              onClick={addService}
              className="mt-3 flex items-center gap-1.5 text-xs text-white/50 hover:text-white border border-dashed border-white/20 hover:border-white/40 px-3 py-2 transition-colors w-full justify-center"
            >
              <Plus size={13} /> Add Service Item
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

/* ──────── Main component ──────── */

export default function AdminServicesClient({
  initialData,
  persistenceBackend,
  cmsCollectionId,
}: {
  initialData: ServicesData
  persistenceBackend: 'firestore' | 'file'
  cmsCollectionId: string
}) {
  const router = useRouter()
  const [data, setData] = useState<ServicesData>(initialData)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [confirm, setConfirm] = useState<Omit<ConfirmModalProps, 'onCancel'> | null>(null)

  function requestConfirm(opts: Omit<ConfirmModalProps, 'onCancel'>) {
    setConfirm(opts)
  }

  const isDirty = useMemo(
    () => JSON.stringify(data) !== JSON.stringify(initialData),
    [data, initialData],
  )

  const saveMessage =
    persistenceBackend === 'firestore'
      ? `Saving to Firestore (${cmsCollectionId}/services) — live immediately.`
      : 'Saving to data/services.json — redeploy to reflect changes in production.'

  function updateCategory(idx: number, updated: ServiceCategory) {
    setData((d) => ({
      ...d,
      categories: d.categories.map((c, i) => (i === idx ? updated : c)),
    }))
    setMessage(null)
    setError(null)
  }

  function deleteCategory(idx: number) {
    setData((d) => ({
      ...d,
      categories: d.categories.filter((_, i) => i !== idx),
    }))
  }

  function requestDeleteCategory(idx: number) {
    const cat = data.categories[idx]
    requestConfirm({
      title: 'Delete category?',
      description: cat.title
        ? `"${cat.title}" and all its service items will be deleted.`
        : 'This category and all its service items will be deleted.',
      confirmLabel: 'Delete',
      onConfirm: () => deleteCategory(idx),
    })
  }

  function moveCategory(idx: number, dir: -1 | 1) {
    setData((d) => {
      const cats = [...d.categories]
      const target = idx + dir
      if (target < 0 || target >= cats.length) return d
      ;[cats[idx], cats[target]] = [cats[target], cats[idx]]
      return { ...d, categories: cats }
    })
  }

  function addCategory() {
    setData((d) => ({ ...d, categories: [...d.categories, newCategory()] }))
  }

  const handleSave = useCallback(async () => {
    setSaving(true)
    setError(null)
    setMessage(null)
    try {
      const res = await fetch('/api/admin/services', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      const json = await res.json()
      if (!res.ok) {
        setError(json.error ?? 'Save failed')
      } else {
        setMessage('Saved successfully.')
        router.refresh()
      }
    } catch {
      setError('Network error — please try again.')
    } finally {
      setSaving(false)
    }
  }, [data, router])

  const handleDiscard = useCallback(() => {
    setData(initialData)
    setMessage(null)
    setError(null)
  }, [initialData])

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 pb-28">
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
          SERVICES ADMIN
        </h1>
        <p className="text-sm text-white/50">
          Manage service categories, items, and pricing. Leave price blank for &ldquo;Price on request&rdquo;.
        </p>
      </div>

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

      {/* Categories */}
      <section className="space-y-4 mb-8">
        <h2
          className="text-[10px] uppercase tracking-widest text-white/50 mb-3"
        >
          Service Categories
        </h2>
        {data.categories.map((cat, idx) => (
          <CategoryCard
            key={cat.id}
            category={cat}
            isFirst={idx === 0}
            isLast={idx === data.categories.length - 1}
            onUpdate={(updated) => updateCategory(idx, updated)}
            onDelete={() => deleteCategory(idx)}
            onMoveUp={() => moveCategory(idx, -1)}
            onMoveDown={() => moveCategory(idx, 1)}
            requestConfirm={requestConfirm}
          />
        ))}
        <button
          type="button"
          onClick={addCategory}
          className="flex items-center gap-2 text-sm text-white/50 hover:text-white border border-dashed border-white/20 hover:border-white/40 px-4 py-3 transition-colors w-full justify-center"
        >
          <Plus size={14} /> Add Category
        </button>
      </section>

      {/* Footer / Notes */}
      <section className="border border-white/15 bg-[var(--charcoal)] p-4 space-y-4">
        <h2
          className="text-[10px] uppercase tracking-widest text-white/50"
        >
          Pricing Notes & Club Details
        </h2>

        <div>
          <label className="text-[10px] uppercase tracking-widest text-white/50 block mb-1">
            VAT / Pricing Note
          </label>
          <textarea
            value={data.vatNote}
            rows={2}
            onChange={(e) => setData((d) => ({ ...d, vatNote: e.target.value }))}
            className="w-full bg-transparent border border-white/15 text-white text-sm px-3 py-1.5 focus:outline-none focus:border-white/40 resize-none"
          />
        </div>
        <div>
          <label className="text-[10px] uppercase tracking-widest text-white/50 block mb-1">
            Members Note
          </label>
          <textarea
            value={data.membersNote}
            rows={2}
            onChange={(e) => setData((d) => ({ ...d, membersNote: e.target.value }))}
            className="w-full bg-transparent border border-white/15 text-white text-sm px-3 py-1.5 focus:outline-none focus:border-white/40 resize-none"
          />
        </div>
        <div className="grid sm:grid-cols-2 gap-3">
          <div>
            <label className="text-[10px] uppercase tracking-widest text-white/50 block mb-1">
              Club Name
            </label>
            <input
              type="text"
              value={data.clubName}
              onChange={(e) => setData((d) => ({ ...d, clubName: e.target.value }))}
              className="w-full bg-transparent border border-white/15 text-white text-sm px-3 py-1.5 focus:outline-none focus:border-white/40"
            />
          </div>
          <div>
            <label className="text-[10px] uppercase tracking-widest text-white/50 block mb-1">
              Club URL
            </label>
            <input
              type="url"
              value={data.clubUrl}
              onChange={(e) => setData((d) => ({ ...d, clubUrl: e.target.value }))}
              className="w-full bg-transparent border border-white/15 text-white text-sm px-3 py-1.5 focus:outline-none focus:border-white/40"
            />
          </div>
        </div>
      </section>

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
