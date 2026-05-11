'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useCallback, useMemo, useState } from 'react'
import type { GalleryBeforeAfter, GalleryGridItem } from '@/lib/gallery-types'
import { AdminSaveBar } from '@/components/admin-save-bar'
import { ConfirmModal, type ConfirmModalProps } from '@/components/admin-confirm-modal'
import { cn } from '@/lib/utils'

async function uploadFile(file: File): Promise<{ url: string; destination: 'cloudinary' | 'local' }> {
  const fd = new FormData()
  fd.append('file', file)
  const res = await fetch('/api/admin/upload', {
    method: 'POST',
    credentials: 'include',
    body: fd,
  })
  const json = (await res.json()) as {
    url?: string
    destination?: 'cloudinary' | 'local'
    error?: string
  }
  if (!res.ok) throw new Error(json.error ?? 'Upload failed')
  if (!json.url) throw new Error('Upload failed')
  return {
    url: json.url,
    destination: json.destination ?? 'local',
  }
}

function newSlideId() {
  return typeof crypto !== 'undefined' && crypto.randomUUID
    ? crypto.randomUUID()
    : `ba-${Date.now()}`
}

export default function AdminGalleryClient({
  initialGrid,
  initialBeforeAfterSlides,
  uploadDestination,
  persistenceBackend,
  cmsCollectionId,
}: {
  initialGrid: GalleryGridItem[]
  initialBeforeAfterSlides: GalleryBeforeAfter[]
  uploadDestination: 'cloudinary' | 'local'
  persistenceBackend: 'firestore' | 'file'
  cmsCollectionId: string
}) {
  const router = useRouter()
  const [grid, setGrid] = useState<GalleryGridItem[]>(initialGrid)
  const [beforeAfterSlides, setBeforeAfterSlides] =
    useState<GalleryBeforeAfter[]>(initialBeforeAfterSlides)
  const [message, setMessage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [uploadKey, setUploadKey] = useState<string | null>(null)
  const [confirm, setConfirm] = useState<Omit<ConfirmModalProps, 'onCancel'> | null>(null)

  const baseline = useMemo(
    () => ({
      grid: JSON.parse(JSON.stringify(initialGrid)) as GalleryGridItem[],
      beforeAfterSlides: JSON.parse(JSON.stringify(initialBeforeAfterSlides)) as GalleryBeforeAfter[],
    }),
    [initialGrid, initialBeforeAfterSlides],
  )

  const isDirty =
    JSON.stringify({ grid, beforeAfterSlides }) !==
    JSON.stringify({ grid: baseline.grid, beforeAfterSlides: baseline.beforeAfterSlides })

  const discardChanges = useCallback(() => {
    if (!window.confirm('Discard all unsaved changes? This will restore the last saved content.')) {
      return
    }
    setGrid(JSON.parse(JSON.stringify(baseline.grid)))
    setBeforeAfterSlides(JSON.parse(JSON.stringify(baseline.beforeAfterSlides)))
    setMessage(null)
    setError(null)
  }, [baseline])

  const logout = useCallback(async () => {
    await fetch('/api/admin/logout', { method: 'POST', credentials: 'include' })
    router.push('/admin/login')
    router.refresh()
  }, [router])

  const save = useCallback(async () => {
    setSaving(true)
    setMessage(null)
    setError(null)
    const cleaned = grid.filter((row) => row.src.trim())
    const cleanedSlides = beforeAfterSlides.filter(
      (s) => s.beforeSrc.trim() && s.afterSrc.trim(),
    )
    try {
      const res = await fetch('/api/admin/gallery', {
        method: 'PUT',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          grid: cleaned,
          beforeAfterSlides: cleanedSlides,
        }),
      })
      const json = await res.json()
      if (!res.ok) {
        setError(typeof json.error === 'string' ? json.error : 'Save failed')
        return
      }
      setMessage('Saved. The public gallery will show these images.')
      router.refresh()
    } catch {
      setError('Save failed')
    } finally {
      setSaving(false)
    }
  }, [beforeAfterSlides, grid, router])

  const clearPublished = useCallback(async () => {
    if (
      !window.confirm(
        'Clear all published gallery images? The site will show built-in placeholders until you publish again.',
      )
    ) {
      return
    }
    setSaving(true)
    setMessage(null)
    setError(null)
    try {
      const res = await fetch('/api/admin/gallery', {
        method: 'PUT',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          grid: [],
          beforeAfterSlides: null,
        }),
      })
      const json = await res.json()
      if (!res.ok) {
        setError(typeof json.error === 'string' ? json.error : 'Could not reset')
        return
      }
      setMessage('Cleared. Restoring default placeholders on the site.')
      router.refresh()
    } catch {
      setError('Could not reset')
    } finally {
      setSaving(false)
    }
  }, [router])

  const addRow = () => {
    const id =
      typeof crypto !== 'undefined' && crypto.randomUUID
        ? crypto.randomUUID()
        : `row-${Date.now()}`
    setGrid((g) => [
      ...g,
      {
        id,
        src: '',
        alt: '',
        caption: '',
      },
    ])
  }

  const removeRow = (id: string) => {
    setGrid((g) => g.filter((row) => row.id !== id))
  }

  const requestRemoveRow = (id: string) => {
    const row = grid.find((r) => r.id === id)
    setConfirm({
      title: 'Remove image?',
      description: row?.caption
        ? `"${row.caption}" will be removed from the gallery grid.`
        : 'This image will be removed from the gallery grid.',
      confirmLabel: 'Remove',
      onConfirm: () => removeRow(id),
    })
  }

  const move = (index: number, dir: -1 | 1) => {
    setGrid((g) => {
      const next = [...g]
      const j = index + dir
      if (j < 0 || j >= next.length) return g
      ;[next[index], next[j]] = [next[j], next[index]]
      return next
    })
  }

  const patchRow = (id: string, patch: Partial<GalleryGridItem>) => {
    setGrid((g) => g.map((row) => (row.id === id ? { ...row, ...patch } : row)))
  }

  const onUploadGrid = async (id: string, file: File | null) => {
    if (!file) return
    setUploadKey(`grid:${id}`)
    setError(null)
    try {
      const { url, destination } = await uploadFile(file)
      patchRow(id, { src: url })
      setMessage(
        destination === 'cloudinary'
          ? 'Image uploaded to Cloudinary. Click Save to publish.'
          : 'Image saved on this server. Click Save to publish.',
      )
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Upload failed')
    } finally {
      setUploadKey(null)
    }
  }

  const addBeforeAfterSlide = () => {
    setBeforeAfterSlides((slides) => [
      ...slides,
      {
        id: newSlideId(),
        title: '',
        beforeSrc: '',
        afterSrc: '',
        beforeAlt: '',
        afterAlt: '',
      },
    ])
  }

  const removeBeforeAfterSlide = (id: string) => {
    setBeforeAfterSlides((slides) => slides.filter((s) => s.id !== id))
  }

  const requestRemoveBeforeAfterSlide = (id: string) => {
    const slide = beforeAfterSlides.find((s) => s.id === id)
    setConfirm({
      title: 'Remove before/after slide?',
      description: slide?.title
        ? `"${slide.title}" will be removed from the carousel.`
        : 'This before/after slide will be removed from the carousel.',
      confirmLabel: 'Remove',
      onConfirm: () => removeBeforeAfterSlide(id),
    })
  }

  const moveBeforeAfterSlide = (index: number, dir: -1 | 1) => {
    setBeforeAfterSlides((slides) => {
      const next = [...slides]
      const j = index + dir
      if (j < 0 || j >= next.length) return slides
      ;[next[index], next[j]] = [next[j], next[index]]
      return next
    })
  }

  const patchBeforeAfterSlide = (id: string, patch: Partial<GalleryBeforeAfter>) => {
    setBeforeAfterSlides((slides) =>
      slides.map((s) => (s.id === id ? { ...s, ...patch } : s)),
    )
  }

  const onUploadBa = async (slideId: string, side: 'before' | 'after', file: File | null) => {
    if (!file) return
    setUploadKey(`${side}:${slideId}`)
    setError(null)
    try {
      const { url, destination } = await uploadFile(file)
      if (side === 'before') patchBeforeAfterSlide(slideId, { beforeSrc: url })
      else patchBeforeAfterSlide(slideId, { afterSrc: url })
      setMessage(
        destination === 'cloudinary'
          ? 'Image uploaded to Cloudinary. Click Save to publish.'
          : 'Image saved on this server. Click Save to publish.',
      )
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Upload failed')
    } finally {
      setUploadKey(null)
    }
  }

  return (
    <div className={cn('max-w-4xl mx-auto px-4 py-12 text-white', isDirty && 'pb-28')}>
      <div className="flex flex-wrap items-center justify-between gap-4 mb-10">
        <div>
          <Link
            href="/admin"
            className="text-[10px] font-bold tracking-widest uppercase text-white/40 hover:text-white/80 transition-colors mb-2 inline-block"
            style={{ fontFamily: 'var(--font-orbitron)' }}
          >
            ← Admin
          </Link>
          <h1 className="text-2xl font-black" style={{ fontFamily: 'var(--font-orbitron)' }}>
            Gallery
          </h1>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => save()}
            disabled={saving}
            className="px-4 py-2 bg-[var(--brand-red)] text-white text-xs font-bold tracking-widest uppercase disabled:opacity-50"
            style={{ fontFamily: 'var(--font-orbitron)' }}
          >
            {saving ? 'Saving...' : isDirty ? 'Save changes' : 'Save'}
          </button>
          <button
            type="button"
            onClick={() => clearPublished()}
            disabled={saving}
            className="px-4 py-2 border border-white/25 text-white/90 text-xs font-bold tracking-widest uppercase hover:bg-white/5 disabled:opacity-50"
            style={{ fontFamily: 'var(--font-orbitron)' }}
          >
            Clear &amp; use defaults
          </button>
          <button
            type="button"
            onClick={() => logout()}
            className="px-4 py-2 border border-white/15 text-white/70 text-xs font-bold tracking-widest uppercase hover:text-white"
            style={{ fontFamily: 'var(--font-orbitron)' }}
          >
            Log out
          </button>
        </div>
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

      {persistenceBackend === 'firestore' ? (
        <div
          className="mb-4 p-4 border border-sky-500/35 bg-sky-500/5 text-sm text-sky-100/90"
          role="status"
        >
          <span className="font-bold tracking-widest uppercase text-xs text-sky-300/95">Firestore</span>
          <p className="mt-2 text-white/85">
            Saving writes gallery data to{' '}
            <code className="text-white/80">
              {cmsCollectionId}/gallery
            </code>{' '}
            in Cloud Firestore (not <code className="text-white/70">data/gallery.json</code>). The public site reads Firestore
            first; if that document is empty it falls back to the JSON file.
          </p>
        </div>
      ) : (
        <div
          className="mb-4 p-4 border border-white/15 bg-white/[0.03] text-sm text-white/70"
          role="status"
        >
          <span className="font-bold tracking-widest uppercase text-xs text-white/50">Local JSON</span>
          <p className="mt-2 text-white/75">
            Saves go to <code className="text-white/70">data/gallery.json</code>. Add Firebase credentials in{' '}
            <code className="text-white/70">.env.local</code> to use Firestore instead (see <code className="text-white/70">.env.example</code>
            ).
          </p>
        </div>
      )}

      <div
        className={
          uploadDestination === 'cloudinary'
            ? 'mb-8 p-4 border border-emerald-500/30 bg-emerald-500/5 text-sm text-emerald-200/90'
            : 'mb-8 p-4 border border-amber-500/25 bg-amber-500/5 text-sm text-amber-100/85'
        }
        role="status"
      >
        {uploadDestination === 'cloudinary' ? (
          <>
            <span className="font-bold tracking-widest uppercase text-xs text-emerald-300/95">Cloudinary</span>
            <p className="mt-2 text-white/80">
              File uploads below go straight to your Cloudinary account (folder{' '}
              <code className="text-white/70">logit/gallery</code>). The image URL field fills with a{' '}
              <code className="text-white/70">res.cloudinary.com</code> link — save the gallery when you are done.
            </p>
          </>
        ) : (
          <>
            <span className="font-bold tracking-widest uppercase text-xs text-amber-200/90">Local uploads</span>
            <p className="mt-2 text-white/80">
              Cloudinary is not configured on this server. Files save under{' '}
              <code className="text-white/70">public/uploads/gallery/</code>. Add{' '}
              <code className="text-white/70">CLOUDINARY_URL</code> to <code className="text-white/70">.env.local</code> and restart
              the dev server to upload directly to Cloudinary instead.
            </p>
          </>
        )}
      </div>

      <section className="mb-12 p-6 border border-[var(--charcoal-light)] bg-[var(--charcoal)]">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
          <h2 className="text-sm font-bold tracking-widest uppercase" style={{ fontFamily: 'var(--font-orbitron)' }}>
            Before / after carousel
          </h2>
          <button
            type="button"
            onClick={addBeforeAfterSlide}
            className="px-3 py-2 border border-[var(--brand-red)] text-[var(--brand-red)] text-xs font-bold tracking-widest uppercase hover:bg-[var(--brand-red)]/10"
            style={{ fontFamily: 'var(--font-orbitron)' }}
          >
            Add comparison
          </button>
        </div>
        <p className="text-white/50 text-sm mb-6">
          Each item is one before/after pair shown as a slider on the site. Add a title to label it in the carousel. Order matches
          the carousel. Paste URLs or upload —{' '}
          <span className="text-white/70">
            {uploadDestination === 'cloudinary' ? 'files go to Cloudinary' : 'files save on this server'}
          </span>
          . Rows without both images are skipped when you save.
        </p>

        {beforeAfterSlides.length === 0 && (
          <p className="text-white/40 text-sm mb-6">
            No comparisons yet. The public site uses the default before/after until you add and save at least one pair with both
            images.
          </p>
        )}

        <ul className="space-y-8">
          {beforeAfterSlides.map((slide, index) => (
            <li key={slide.id} className="p-4 border border-white/10 bg-black/20 space-y-4">
              <div className="flex flex-wrap gap-2 items-center justify-between">
                <span className="text-xs text-white/50">Comparison {index + 1}</span>
                <div className="flex gap-2">
                  <button
                    type="button"
                    className="text-xs px-2 py-1 border border-white/15 uppercase tracking-wider disabled:opacity-30"
                    onClick={() => moveBeforeAfterSlide(index, -1)}
                    disabled={index === 0}
                  >
                    Up
                  </button>
                  <button
                    type="button"
                    className="text-xs px-2 py-1 border border-white/15 uppercase tracking-wider disabled:opacity-30"
                    onClick={() => moveBeforeAfterSlide(index, 1)}
                    disabled={index === beforeAfterSlides.length - 1}
                  >
                    Down
                  </button>
                  <button
                    type="button"
                    className="text-xs px-2 py-1 border border-red-500/50 text-red-300 uppercase tracking-wider"
                    onClick={() => requestRemoveBeforeAfterSlide(slide.id)}
                  >
                    Remove
                  </button>
                </div>
              </div>

              <label className="block space-y-2 max-w-xl">
                <span className="text-xs font-bold tracking-widest uppercase text-white/70">Title (shown above this comparison)</span>
                <input
                  className="w-full px-3 py-2 bg-black/40 border border-white/15 text-sm text-white"
                  value={slide.title}
                  onChange={(e) => patchBeforeAfterSlide(slide.id, { title: e.target.value })}
                  placeholder="e.g. Cylinder sand-down and repaint"
                />
              </label>

              <div className="grid md:grid-cols-2 gap-6">
                <label className="block space-y-2">
                  <span className="text-xs font-bold tracking-widest uppercase text-white/70">Before image URL</span>
                  <input
                    className="w-full px-3 py-2 bg-black/40 border border-white/15 text-sm text-white"
                    value={slide.beforeSrc}
                    onChange={(e) => patchBeforeAfterSlide(slide.id, { beforeSrc: e.target.value })}
                  />
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp,image/gif,image/svg+xml"
                    className="text-xs text-white/70 file:mr-2 file:py-1 file:px-2 file:border file:border-white/20 file:bg-transparent file:text-white"
                    disabled={uploadKey === `before:${slide.id}`}
                    onChange={(e) => onUploadBa(slide.id, 'before', e.target.files?.[0] ?? null)}
                  />
                  <span className="text-[10px] text-white/45">
                    {uploadDestination === 'cloudinary' ? '→ Cloudinary' : '→ /uploads/gallery/'}
                  </span>
                </label>
                <label className="block space-y-2">
                  <span className="text-xs font-bold tracking-widest uppercase text-white/70">After image URL</span>
                  <input
                    className="w-full px-3 py-2 bg-black/40 border border-white/15 text-sm text-white"
                    value={slide.afterSrc}
                    onChange={(e) => patchBeforeAfterSlide(slide.id, { afterSrc: e.target.value })}
                  />
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp,image/gif,image/svg+xml"
                    className="text-xs text-white/70 file:mr-2 file:py-1 file:px-2 file:border file:border-white/20 file:bg-transparent file:text-white"
                    disabled={uploadKey === `after:${slide.id}`}
                    onChange={(e) => onUploadBa(slide.id, 'after', e.target.files?.[0] ?? null)}
                  />
                  <span className="text-[10px] text-white/45">
                    {uploadDestination === 'cloudinary' ? '→ Cloudinary' : '→ /uploads/gallery/'}
                  </span>
                </label>
                <label className="block space-y-2">
                  <span className="text-xs font-bold tracking-widest uppercase text-white/70">Before alt text</span>
                  <input
                    className="w-full px-3 py-2 bg-black/40 border border-white/15 text-sm text-white"
                    value={slide.beforeAlt}
                    onChange={(e) => patchBeforeAfterSlide(slide.id, { beforeAlt: e.target.value })}
                  />
                </label>
                <label className="block space-y-2">
                  <span className="text-xs font-bold tracking-widest uppercase text-white/70">After alt text</span>
                  <input
                    className="w-full px-3 py-2 bg-black/40 border border-white/15 text-sm text-white"
                    value={slide.afterAlt}
                    onChange={(e) => patchBeforeAfterSlide(slide.id, { afterAlt: e.target.value })}
                  />
                </label>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <section className="p-6 border border-[var(--charcoal-light)] bg-[var(--charcoal)]">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <h2 className="text-sm font-bold tracking-widest uppercase" style={{ fontFamily: 'var(--font-orbitron)' }}>
            Image gallery grid
          </h2>
          <button
            type="button"
            onClick={addRow}
            className="px-3 py-2 border border-[var(--brand-red)] text-[var(--brand-red)] text-xs font-bold tracking-widest uppercase hover:bg-[var(--brand-red)]/10"
            style={{ fontFamily: 'var(--font-orbitron)' }}
          >
            Add image row
          </button>
        </div>
        <p className="text-white/50 text-sm mb-6">
          Leave the grid empty to use the four built-in placeholders on the public site. Each row needs a public image URL, alt
          text, and the caption on hover.{' '}
          {uploadDestination === 'cloudinary' ? (
            <span className="text-white/65">Uploads send files to Cloudinary and fill in the URL for you.</span>
          ) : (
            <span className="text-white/65">With Cloudinary configured, uploads go there instead of this server.</span>
          )}
        </p>

        {grid.length === 0 && (
          <p className="text-white/40 text-sm mb-6">No rows yet. The homepage gallery shows default placeholders.</p>
        )}

        <ul className="space-y-8">
          {grid.map((row, index) => (
            <li key={row.id} className="p-4 border border-white/10 bg-black/20 space-y-4">
              <div className="flex flex-wrap gap-2 items-center justify-between">
                <span className="text-xs text-white/50">Row {index + 1}</span>
                <div className="flex gap-2">
                  <button
                    type="button"
                    className="text-xs px-2 py-1 border border-white/15 uppercase tracking-wider disabled:opacity-30"
                    onClick={() => move(index, -1)}
                    disabled={index === 0}
                  >
                    Up
                  </button>
                  <button
                    type="button"
                    className="text-xs px-2 py-1 border border-white/15 uppercase tracking-wider disabled:opacity-30"
                    onClick={() => move(index, 1)}
                    disabled={index === grid.length - 1}
                  >
                    Down
                  </button>
                  <button
                    type="button"
                    className="text-xs px-2 py-1 border border-red-500/50 text-red-300 uppercase tracking-wider"
                    onClick={() => requestRemoveRow(row.id)}
                  >
                    Remove
                  </button>
                </div>
              </div>

              <div className="flex flex-wrap gap-4 items-start">
                <div className="w-28 h-28 shrink-0 border border-white/15 bg-black/40 overflow-hidden">
                  {row.src ? (
                    <img src={row.src} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-[10px] text-white/30 text-center p-1">
                      No image
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-[200px] space-y-3">
                  <label className="block space-y-1">
                    <span className="text-[10px] font-bold tracking-widest uppercase text-white/60">Image URL</span>
                    <input
                      className="w-full px-3 py-2 bg-black/40 border border-white/15 text-sm text-white"
                      value={row.src}
                      onChange={(e) => patchRow(row.id, { src: e.target.value })}
                      placeholder={
                        uploadDestination === 'cloudinary'
                          ? 'https://res.cloudinary.com/.../image/upload/...'
                          : '/uploads/gallery/....jpg'
                      }
                    />
                    <input
                      type="file"
                      accept="image/jpeg,image/png,image/webp,image/gif,image/svg+xml"
                      className="text-xs text-white/70 file:mr-2 file:py-1 file:px-2 file:border file:border-white/20 file:bg-transparent file:text-white"
                      disabled={uploadKey === `grid:${row.id}`}
                      onChange={(e) => onUploadGrid(row.id, e.target.files?.[0] ?? null)}
                    />
                    <span className="text-[10px] text-white/45">
                      {uploadDestination === 'cloudinary' ? '→ Cloudinary' : '→ /uploads/gallery/'}
                    </span>
                  </label>
                  <label className="block space-y-1">
                    <span className="text-[10px] font-bold tracking-widest uppercase text-white/60">Alt text</span>
                    <input
                      className="w-full px-3 py-2 bg-black/40 border border-white/15 text-sm text-white"
                      value={row.alt}
                      onChange={(e) => patchRow(row.id, { alt: e.target.value })}
                    />
                  </label>
                  <label className="block space-y-1">
                    <span className="text-[10px] font-bold tracking-widest uppercase text-white/60">Caption (hover label)</span>
                    <input
                      className="w-full px-3 py-2 bg-black/40 border border-white/15 text-sm text-white"
                      value={row.caption}
                      onChange={(e) => patchRow(row.id, { caption: e.target.value })}
                      placeholder="Placeholder Image - ..."
                    />
                  </label>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </section>
      <AdminSaveBar
        show={isDirty}
        saving={saving}
        onSave={() => save()}
        onDiscard={discardChanges}
        message={
          persistenceBackend === 'firestore'
            ? 'Unsaved gallery edits — Save changes to update Firestore.'
            : 'Unsaved gallery edits — Save changes to write data/gallery.json and update the live site.'
        }
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
