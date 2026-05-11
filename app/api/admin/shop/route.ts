import { NextResponse } from 'next/server'
import type { StoreData, StoreProduct } from '@/lib/store-types'
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

  let body: { products?: StoreProduct[] }
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  if (!Array.isArray(body.products)) {
    return NextResponse.json({ error: 'products array required' }, { status: 400 })
  }

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
    if (typeof p.category !== 'string') {
      return NextResponse.json({ error: 'Invalid product fields' }, { status: 400 })
    }
  }

  const next: StoreData = {
    products: body.products,
    updatedAt: new Date().toISOString(),
  }

  await writeStoreFile(next)
  return NextResponse.json({ ok: true, data: mergeStoreData(next) })
}
