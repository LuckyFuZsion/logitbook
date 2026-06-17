import { NextResponse } from 'next/server'
import type { StoreCategory, StoreData, StoreProduct } from '@/lib/store-types'
import { recordCmsAuditEntry } from '@/lib/cms-audit'
import { traceCmsAdminSave } from '@/lib/cms-save-trace'
import { getAdminSession } from '@/lib/admin-session'
import { mergeStoreData } from '@/lib/store-defaults'
import { readStoreFile, writeStoreFile } from '@/lib/store-store'

function isValidImageUrl(u: string) {
  if (u.startsWith('data:')) return false
  return u.startsWith('/') || /^https?:\/\//i.test(u)
}

function isValidStripeUrl(u: string) {
  return /^https:\/\/.+/i.test(u.trim())
}

function isValidCategory(c: StoreCategory): boolean {
  return typeof c.id === 'string' && c.id.trim().length > 0 && typeof c.title === 'string' && c.title.trim().length > 0
}

export async function GET() {
  const session = await getAdminSession()
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const raw = await readStoreFile()
  return NextResponse.json({
    stored: raw ?? {},
    merged: mergeStoreData(raw),
  })
}

export async function PUT(req: Request) {
  const session = await getAdminSession()
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  let body: { categories?: StoreCategory[]; products?: StoreProduct[] }
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  if (!Array.isArray(body.categories) || body.categories.length < 1) {
    return NextResponse.json({ error: 'At least one category is required' }, { status: 400 })
  }

  if (!Array.isArray(body.products)) {
    return NextResponse.json({ error: 'products array required' }, { status: 400 })
  }

  for (const c of body.categories) {
    if (!isValidCategory(c)) {
      return NextResponse.json({ error: 'Each category needs an id and title' }, { status: 400 })
    }
  }

  const categoryIds = new Set(body.categories.map((c) => c.id.trim()))
  if (categoryIds.size !== body.categories.length) {
    return NextResponse.json({ error: 'Category ids must be unique' }, { status: 400 })
  }

  const previous = mergeStoreData(await readStoreFile())

  for (const p of body.products) {
    if (!p.id || typeof p.name !== 'string' || typeof p.description !== 'string') {
      return NextResponse.json({ error: 'Invalid product' }, { status: 400 })
    }
    if (typeof p.price !== 'number' || !Array.isArray(p.images) || p.images.length < 1) {
      return NextResponse.json({ error: 'Each product needs a price and at least one image URL' }, { status: 400 })
    }
    for (const img of p.images) {
      if (typeof img !== 'string' || !isValidImageUrl(img)) {
        return NextResponse.json(
          { error: 'Image URLs must be /... or http(s) (no data URLs). Use Cloudinary delivery URLs.' },
          { status: 400 },
        )
      }
    }
    if (typeof p.stripeUrl !== 'string' || !isValidStripeUrl(p.stripeUrl)) {
      return NextResponse.json(
        { error: 'Each product needs a valid https Stripe link' },
        { status: 400 },
      )
    }
    if (typeof p.categoryId !== 'string' || !categoryIds.has(p.categoryId)) {
      return NextResponse.json({ error: 'Each product must use a valid category' }, { status: 400 })
    }
  }

  const next: StoreData = {
    categories: body.categories.map((c) => ({ id: c.id.trim(), title: c.title.trim() })),
    products: body.products,
    updatedAt: new Date().toISOString(),
  }

  await recordCmsAuditEntry('shop', previous, next)
  await writeStoreFile(next)
  traceCmsAdminSave('shop', next.updatedAt)
  return NextResponse.json({ ok: true, data: mergeStoreData(next) })
}
