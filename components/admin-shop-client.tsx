'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useCallback, useMemo, useRef, useState } from 'react'
import type { StoreProduct } from '@/lib/store-types'
import { AdminSaveBar } from '@/components/admin-save-bar'
import { ConfirmModal, type ConfirmModalProps } from '@/components/admin-confirm-modal'
import { cn } from '@/lib/utils'

function parseImageLines(text: string): string[] {
  return text
    .split(/\r?\n/)
    .map((s) => s.trim())
    .filter(Boolean)
}

function imagesToText(images: string[]): string {
  return images.join('\n')
}

function newProduct(): StoreProduct {
  const id =
    typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : `sku-${Date.now()}`
  return {
    id,
    name: '',
    description: '',
    price: 0,
    category: 'General',
    images: [],
    stripeUrl: '',
  }
}

export default function AdminShopClient({
  initialProducts,
  persistenceBackend,
  cmsCollectionId,
}: {
  initialProducts: StoreProduct[]
  persistenceBackend: 'firestore' | 'file'
  cmsCollectionId: string
}) {
  const router = useRouter()
  const [products, setProducts] = useState<StoreProduct[]>(initialProducts)
  const [imageTextById, setImageTextById] = useState<Record<string, string>>(() => {
    const m: Record<string, string> = {}
    for (const p of initialProducts) {
      m[p.id] = imagesToText(p.images)
    }
    return m
  })
  const [message, setMessage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [confirm, setConfirm] = useState<Omit<ConfirmModalProps, 'onCancel'> | null>(null)
  const [uploadingById, setUploadingById] = useState<Record<string, boolean>>({})
  const [uploadErrById, setUploadErrById] = useState<Record<string, string | null>>({})
  const fileInputRefs = useRef<Record<string, HTMLInputElement | null>>({})

  const baseline = useMemo(() => {
    const imageMap: Record<string, string> = {}
    for (const p of initialProducts) {
      imageMap[p.id] = imagesToText(p.images)
    }
    return {
      products: JSON.parse(JSON.stringify(initialProducts)) as StoreProduct[],
      imageMap,
    }
  }, [initialProducts])

  const assembledSnapshot = useCallback((prods: StoreProduct[], imgMap: Record<string, string>) => {
    return prods.map((p) => ({
      ...p,
      images: parseImageLines(imgMap[p.id] ?? ''),
    }))
  }, [])

  const isDirty =
    JSON.stringify(assembledSnapshot(products, imageTextById)) !==
    JSON.stringify(assembledSnapshot(baseline.products, baseline.imageMap))

  const discardChanges = useCallback(() => {
    if (!window.confirm('Discard all unsaved changes? This will restore the last saved catalogue.')) {
      return
    }
    setProducts(JSON.parse(JSON.stringify(baseline.products)))
    setImageTextById({ ...baseline.imageMap })
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

    const assembled: StoreProduct[] = products.map((p) => ({
      ...p,
      images: parseImageLines(imageTextById[p.id] ?? ''),
    }))

    for (const p of assembled) {
      if (!p.name.trim()) {
        setError('Each product needs a name.')
        setSaving(false)
        return
      }
      if (!p.stripeUrl.trim() || !/^https:\/\//i.test(p.stripeUrl.trim())) {
        setError(`"${p.name}" needs a full https Stripe payment or checkout link.`)
        setSaving(false)
        return
      }
      if (p.images.length < 1) {
        setError(`"${p.name}" needs at least one image URL (Cloudinary or other https URL).`)
        setSaving(false)
        return
      }
    }

    try {
      const res = await fetch('/api/admin/shop', {
        method: 'PUT',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ products: assembled }),
      })
      const json = await res.json()
      if (!res.ok) {
        setError(typeof json.error === 'string' ? json.error : 'Save failed')
        return
      }
      setMessage('Saved. The shop and JSON-LD catalogue will use these products.')
      router.refresh()
    } catch {
      setError('Save failed')
    } finally {
      setSaving(false)
    }
  }, [imageTextById, products, router])

  const clearPublished = useCallback(async () => {
    if (
      !window.confirm(
        'Remove all saved products from disk? The site will fall back to built-in default catalogue.',
      )
    ) {
      return
    }
    setSaving(true)
    setMessage(null)
    setError(null)
    try {
      const res = await fetch('/api/admin/shop', {
        method: 'PUT',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ products: [] }),
      })
      const json = await res.json()
      if (!res.ok) {
        setError(typeof json.error === 'string' ? json.error : 'Could not reset')
        return
      }
      setMessage('Cleared saved products.')
      router.refresh()
    } catch {
      setError('Could not reset')
    } finally {
      setSaving(false)
    }
  }, [router])

  const addProduct = () => {
    const p = newProduct()
    setProducts((list) => [...list, p])
    setImageTextById((prev) => ({ ...prev, [p.id]: '' }))
  }

  const removeProduct = (id: string) => {
    setProducts((list) => list.filter((x) => x.id !== id))
    setImageTextById((prev) => {
      const next = { ...prev }
      delete next[id]
      return next
    })
  }

  const requestRemoveProduct = (id: string) => {
    const product = products.find((x) => x.id === id)
    setConfirm({
      title: 'Remove product?',
      description: product?.name
        ? `"${product.name}" will be removed. Changes won\u2019t apply until you save.`
        : `This product will be removed. Changes won\u2019t apply until you save.`,
      confirmLabel: 'Remove',
      onConfirm: () => removeProduct(id),
    })
  }

  const move = (index: number, dir: -1 | 1) => {
    setProducts((list) => {
      const next = [...list]
      const j = index + dir
      if (j < 0 || j >= next.length) return list
      ;[next[index], next[j]] = [next[j], next[index]]
      return next
    })
  }

  const patch = (id: string, patch: Partial<StoreProduct>) => {
    setProducts((list) => list.map((p) => (p.id === id ? { ...p, ...patch } : p)))
  }

  const removeImage = (productId: string, index: number) => {
    setImageTextById((prev) => {
      const lines = parseImageLines(prev[productId] ?? '')
      lines.splice(index, 1)
      return { ...prev, [productId]: lines.join('\n') }
    })
  }

  const moveImage = (productId: string, index: number, dir: -1 | 1) => {
    setImageTextById((prev) => {
      const lines = parseImageLines(prev[productId] ?? '')
      const nextIndex = index + dir
      if (nextIndex < 0 || nextIndex >= lines.length) return prev
      ;[lines[index], lines[nextIndex]] = [lines[nextIndex], lines[index]]
      return { ...prev, [productId]: lines.join('\n') }
    })
  }

  const setPrimaryImage = (productId: string, index: number) => {
    if (index === 0) return
    setImageTextById((prev) => {
      const lines = parseImageLines(prev[productId] ?? '')
      const [selected] = lines.splice(index, 1)
      lines.unshift(selected)
      return { ...prev, [productId]: lines.join('\n') }
    })
  }

  const handleImageFiles = useCallback(
    async (productId: string, files: FileList | null) => {
      if (!files || files.length === 0) return
      setUploadingById((prev) => ({ ...prev, [productId]: true }))
      setUploadErrById((prev) => ({ ...prev, [productId]: null }))

      const uploaded: string[] = []
      const errors: string[] = []

      for (const file of Array.from(files)) {
        const fd = new FormData()
        fd.append('file', file)
        try {
          const res = await fetch('/api/admin/upload?type=product', {
            method: 'POST',
            credentials: 'include',
            body: fd,
          })
          const json = (await res.json()) as { url?: string; error?: string }
          if (!res.ok) throw new Error(json.error ?? 'Upload failed')
          if (json.url) uploaded.push(json.url)
        } catch (e) {
          errors.push(e instanceof Error ? e.message : 'Upload failed')
        }
      }

      if (uploaded.length > 0) {
        setImageTextById((prev) => {
          const existing = (prev[productId] ?? '').trim()
          const joined = existing ? existing + '\n' + uploaded.join('\n') : uploaded.join('\n')
          return { ...prev, [productId]: joined }
        })
      }

      setUploadErrById((prev) => ({
        ...prev,
        [productId]: errors.length > 0 ? errors.join(' · ') : null,
      }))
      setUploadingById((prev) => ({ ...prev, [productId]: false }))

      // Reset the file input so the same files can be re-selected if needed
      const input = fileInputRefs.current[productId]
      if (input) input.value = ''
    },
    [],
  )

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
            Hybrid shop
          </h1>
          <p className="text-white/50 text-sm mt-2 max-w-xl">
            Upload images directly to Cloudinary or paste URLs manually. Each product has its own Stripe checkout or
            Payment Link for a lightweight storefront without full ecommerce.
          </p>
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
            Clear saved products
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
          className="mb-6 p-4 border border-sky-500/35 bg-sky-500/5 text-sm text-sky-100/90"
          role="status"
        >
          <span className="font-bold tracking-widest uppercase text-xs text-sky-300/95">Firestore</span>
          <p className="mt-2 text-white/85">
            Saving writes the catalogue to{' '}
            <code className="text-white/80">{cmsCollectionId}/store</code> in Cloud Firestore (not{' '}
            <code className="text-white/70">data/store.json</code>). The shop API reads Firestore first, then falls back to JSON if
            that document is missing.
          </p>
        </div>
      ) : (
        <div
          className="mb-6 p-4 border border-white/15 bg-white/[0.03] text-sm text-white/70"
          role="status"
        >
          <span className="font-bold tracking-widest uppercase text-xs text-white/50">Local JSON</span>
          <p className="mt-2 text-white/75">
            Saves go to <code className="text-white/70">data/store.json</code>. Add Firebase Admin env vars to use Firestore (see{' '}
            <code className="text-white/70">.env.example</code>).
          </p>
        </div>
      )}

      <div className="flex justify-end mb-6">
        <button
          type="button"
          onClick={addProduct}
          className="px-3 py-2 border border-[var(--brand-red)] text-[var(--brand-red)] text-xs font-bold tracking-widest uppercase hover:bg-[var(--brand-red)]/10"
          style={{ fontFamily: 'var(--font-orbitron)' }}
        >
          Add product
        </button>
      </div>

      <ul className="space-y-10">
        {products.map((p, index) => (
          <li key={p.id} className="p-6 border border-[var(--charcoal-light)] bg-[var(--charcoal)] space-y-4">
            <div className="flex flex-wrap gap-2 items-center justify-between">
              <span className="text-xs text-white/50">Product {index + 1}</span>
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
                  disabled={index === products.length - 1}
                >
                  Down
                </button>
                <button
                  type="button"
                  className="text-xs px-2 py-1 border border-red-500/50 text-red-300 uppercase tracking-wider"
                  onClick={() => requestRemoveProduct(p.id)}
                >
                  Remove
                </button>
              </div>
            </div>

            <label className="block space-y-1">
              <span className="text-[10px] font-bold tracking-widest uppercase text-white/60">Internal id</span>
              <input
                className="w-full px-3 py-2 bg-black/40 border border-white/15 text-sm text-white/70"
                value={p.id}
                readOnly
              />
            </label>

            <label className="block space-y-1">
              <span className="text-[10px] font-bold tracking-widest uppercase text-white/60">Name</span>
              <input
                className="w-full px-3 py-2 bg-black/40 border border-white/15 text-sm text-white"
                value={p.name}
                onChange={(e) => patch(p.id, { name: e.target.value })}
              />
            </label>

            <label className="block space-y-1">
              <span className="text-[10px] font-bold tracking-widest uppercase text-white/60">Description / info</span>
              <textarea
                className="w-full min-h-[100px] px-3 py-2 bg-black/40 border border-white/15 text-sm text-white"
                value={p.description}
                onChange={(e) => patch(p.id, { description: e.target.value })}
              />
            </label>

            <div className="grid sm:grid-cols-2 gap-4">
              <label className="block space-y-1">
                <span className="text-[10px] font-bold tracking-widest uppercase text-white/60">Price (GBP)</span>
                <input
                  type="number"
                  step="0.01"
                  min={0}
                  className="w-full px-3 py-2 bg-black/40 border border-white/15 text-sm text-white"
                  value={p.price || ''}
                  onChange={(e) => patch(p.id, { price: parseFloat(e.target.value) || 0 })}
                />
              </label>
              <label className="block space-y-1">
                <span className="text-[10px] font-bold tracking-widest uppercase text-white/60">
                  Original price (optional)
                </span>
                <input
                  type="number"
                  step="0.01"
                  min={0}
                  className="w-full px-3 py-2 bg-black/40 border border-white/15 text-sm text-white"
                  value={p.originalPrice ?? ''}
                  onChange={(e) =>
                    patch(p.id, {
                      originalPrice: e.target.value === '' ? undefined : parseFloat(e.target.value) || undefined,
                    })
                  }
                />
              </label>
              <label className="block space-y-1">
                <span className="text-[10px] font-bold tracking-widest uppercase text-white/60">Category</span>
                <input
                  className="w-full px-3 py-2 bg-black/40 border border-white/15 text-sm text-white"
                  value={p.category}
                  onChange={(e) => patch(p.id, { category: e.target.value })}
                />
              </label>
              <label className="block space-y-1">
                <span className="text-[10px] font-bold tracking-widest uppercase text-white/60">Badge (optional)</span>
                <input
                  className="w-full px-3 py-2 bg-black/40 border border-white/15 text-sm text-white"
                  value={p.badge ?? ''}
                  onChange={(e) => patch(p.id, { badge: e.target.value || undefined })}
                  placeholder="BESTSELLER"
                />
              </label>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <span className="text-[10px] font-bold tracking-widest uppercase text-white/60 block">
                    Product images
                  </span>
                  <span className="text-[10px] text-white/40 tracking-wide">
                    Upload multiple images — they appear in order on the product page carousel. First image is the shop tile.
                  </span>
                </div>
                <label className="cursor-pointer">
                  <input
                    ref={(el) => { fileInputRefs.current[p.id] = el }}
                    type="file"
                    accept="image/jpeg,image/png,image/webp,image/gif"
                    multiple
                    className="sr-only"
                    onChange={(e) => handleImageFiles(p.id, e.target.files)}
                  />
                  <span
                    className={cn(
                      'inline-flex items-center gap-1.5 px-3 py-1.5 border text-[10px] font-bold tracking-widest uppercase transition-colors',
                      uploadingById[p.id]
                        ? 'border-white/15 text-white/40 cursor-wait'
                        : 'border-[var(--brand-red)]/60 text-[var(--brand-red)] hover:bg-[var(--brand-red)]/10 cursor-pointer',
                    )}
                    style={{ fontFamily: 'var(--font-orbitron)' }}
                  >
                    {uploadingById[p.id] ? (
                      <>
                        <svg className="w-3 h-3 animate-spin" viewBox="0 0 24 24" fill="none">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                        </svg>
                        Uploading…
                      </>
                    ) : (
                      <>
                        <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                          <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
                          <polyline points="17 8 12 3 7 8" />
                          <line x1="12" y1="3" x2="12" y2="15" />
                        </svg>
                        Upload images
                      </>
                    )}
                  </span>
                </label>
              </div>

              {uploadErrById[p.id] && (
                <p className="text-xs text-red-400">{uploadErrById[p.id]}</p>
              )}

              {/* Thumbnail preview strip */}
              {parseImageLines(imageTextById[p.id] ?? '').length > 0 && (
                <div className="flex flex-wrap gap-3 p-3 bg-black/20 border border-white/10">
                  {parseImageLines(imageTextById[p.id] ?? '').map((url, imgIdx) => (
                    <div key={imgIdx} className="relative group w-24 space-y-1.5">
                      <div className="relative h-24 w-24">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={url}
                          alt={`Product image ${imgIdx + 1}`}
                          className="h-full w-full object-cover border border-white/15"
                          onError={(e) => {
                            ;(e.currentTarget as HTMLImageElement).style.display = 'none'
                          }}
                        />
                        {imgIdx === 0 && (
                          <span className="absolute bottom-0 left-0 right-0 text-[8px] font-bold tracking-widest uppercase bg-black/70 text-white/70 text-center py-0.5">
                            Shop tile
                          </span>
                        )}
                        <button
                          type="button"
                          onClick={() => removeImage(p.id, imgIdx)}
                          className="absolute top-0.5 right-0.5 w-5 h-5 bg-red-600 text-white text-xs font-bold leading-none rounded-sm opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                          title="Remove image"
                        >
                          ×
                        </button>
                      </div>
                      <div className="flex flex-wrap gap-1">
                        <button
                          type="button"
                          onClick={() => moveImage(p.id, imgIdx, -1)}
                          disabled={imgIdx === 0}
                          className="text-[9px] px-1.5 py-0.5 border border-white/15 uppercase disabled:opacity-30"
                        >
                          ←
                        </button>
                        <button
                          type="button"
                          onClick={() => moveImage(p.id, imgIdx, 1)}
                          disabled={imgIdx === parseImageLines(imageTextById[p.id] ?? '').length - 1}
                          className="text-[9px] px-1.5 py-0.5 border border-white/15 uppercase disabled:opacity-30"
                        >
                          →
                        </button>
                        {imgIdx > 0 && (
                          <button
                            type="button"
                            onClick={() => setPrimaryImage(p.id, imgIdx)}
                            className="text-[9px] px-1.5 py-0.5 border border-[var(--brand-red)]/40 text-[var(--brand-red)] uppercase"
                          >
                            Set primary
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Manual URL textarea */}
              <div className="space-y-1">
                <span className="text-[10px] text-white/40 tracking-wide">
                  Or paste URLs directly (one per line)
                </span>
                <textarea
                  className="w-full min-h-[72px] px-3 py-2 bg-black/40 border border-white/15 text-sm text-white font-mono"
                  placeholder={'https://res.cloudinary.com/...'}
                  value={imageTextById[p.id] ?? ''}
                  onChange={(e) => setImageTextById((prev) => ({ ...prev, [p.id]: e.target.value }))}
                />
              </div>
            </div>

            <label className="block space-y-1">
              <span className="text-[10px] font-bold tracking-widest uppercase text-white/60">
                Stripe Payment Link or Checkout URL (https)
              </span>
              <input
                className="w-full px-3 py-2 bg-black/40 border border-white/15 text-sm text-white font-mono"
                value={p.stripeUrl}
                onChange={(e) => patch(p.id, { stripeUrl: e.target.value })}
                placeholder="https://buy.stripe.com/..."
              />
            </label>
          </li>
        ))}
      </ul>

      {products.length === 0 && (
        <p className="text-white/40 text-sm text-center py-8">
          No rows yet. Add a product or leave cleared to use the built-in default catalogue on the site.
        </p>
      )}

      <AdminSaveBar
        show={isDirty}
        saving={saving}
        onSave={() => save()}
        onDiscard={discardChanges}
        message={
          persistenceBackend === 'firestore'
            ? 'Unsaved shop edits — Save changes to update Firestore.'
            : 'Unsaved shop edits — Save changes to write data/store.json and update the live catalogue.'
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
