import { NextResponse } from 'next/server'
import type { GalleryBeforeAfter, GalleryData } from '@/lib/gallery-types'
import { getAdminSession } from '@/lib/admin-session'
import { mergeGalleryData } from '@/lib/gallery-defaults'
import { readGalleryFile, writeGalleryFile } from '@/lib/gallery-store'

function validateSlide(s: unknown): s is GalleryBeforeAfter {
  if (!s || typeof s !== 'object') return false
  const o = s as Record<string, unknown>
  return (
    typeof o.id === 'string' &&
    o.id.length > 0 &&
    typeof o.title === 'string' &&
    typeof o.beforeSrc === 'string' &&
    typeof o.afterSrc === 'string' &&
    typeof o.beforeAlt === 'string' &&
    typeof o.afterAlt === 'string'
  )
}

export async function GET() {
  const session = await getAdminSession()
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const raw = await readGalleryFile()
  const merged = mergeGalleryData(raw)
  return NextResponse.json({
    stored: raw ?? {},
    merged,
  })
}

export async function PUT(req: Request) {
  const session = await getAdminSession()
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  let body: Partial<GalleryData> & { beforeAfter?: unknown }
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  if (!Array.isArray(body.grid)) {
    return NextResponse.json({ error: 'grid array required' }, { status: 400 })
  }

  for (const item of body.grid) {
    if (
      !item.id ||
      typeof item.src !== 'string' ||
      typeof item.alt !== 'string' ||
      typeof item.caption !== 'string'
    ) {
      return NextResponse.json({ error: 'Invalid grid item' }, { status: 400 })
    }
    if (item.src.startsWith('data:')) {
      return NextResponse.json(
        { error: 'Upload images instead of saving placeholder data URLs.' },
        { status: 400 },
      )
    }
    if (!item.src.startsWith('/') && !/^https?:\/\//i.test(item.src)) {
      return NextResponse.json(
        { error: 'Each image must use a site path (/...) or http(s) URL.' },
        { status: 400 },
      )
    }
  }

  let beforeAfterSlides: GalleryBeforeAfter[] | null = null
  if (body.beforeAfterSlides !== undefined && body.beforeAfterSlides !== null) {
    if (!Array.isArray(body.beforeAfterSlides)) {
      return NextResponse.json({ error: 'beforeAfterSlides must be an array' }, { status: 400 })
    }
    for (const slide of body.beforeAfterSlides) {
      if (!validateSlide(slide)) {
        return NextResponse.json({ error: 'Invalid before/after slide' }, { status: 400 })
      }
      for (const url of [slide.beforeSrc, slide.afterSrc]) {
        if (url.startsWith('data:')) {
          return NextResponse.json(
            { error: 'Upload before/after images instead of data URLs.' },
            { status: 400 },
          )
        }
        if (!url.startsWith('/') && !/^https?:\/\//i.test(url)) {
          return NextResponse.json({ error: 'Invalid before/after image URL.' }, { status: 400 })
        }
      }
    }
    beforeAfterSlides = body.beforeAfterSlides
  }

  const next: GalleryData = {
    grid: body.grid,
    beforeAfterSlides,
    updatedAt: new Date().toISOString(),
  }

  await writeGalleryFile(next)
  return NextResponse.json({ ok: true, data: mergeGalleryData(next) })
}
