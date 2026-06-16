import { NextResponse } from 'next/server'
import type { ReturnsData } from '@/lib/returns-types'
import { getAdminSession } from '@/lib/admin-session'
import { mergeReturnsData } from '@/lib/returns-defaults'
import { readReturnsFile, writeReturnsFile } from '@/lib/returns-store'

export async function GET() {
  const session = await getAdminSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const raw = await readReturnsFile()
  return NextResponse.json({ stored: raw ?? {}, merged: mergeReturnsData(raw) })
}

export async function PUT(req: Request) {
  const session = await getAdminSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  let body: Partial<ReturnsData>
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  if (!body.pageTitle?.trim()) {
    return NextResponse.json({ error: 'pageTitle is required' }, { status: 400 })
  }
  if (!body.sectionTitle?.trim()) {
    return NextResponse.json({ error: 'sectionTitle is required' }, { status: 400 })
  }
  if (!Array.isArray(body.points) || body.points.length === 0) {
    return NextResponse.json({ error: 'At least one payment term is required' }, { status: 400 })
  }

  const next: ReturnsData = {
    pageTitle: body.pageTitle.trim(),
    sectionTitle: body.sectionTitle.trim(),
    points: body.points.map((p) => p.trim()).filter(Boolean),
    updatedAt: new Date().toISOString(),
  }

  if (next.points.length === 0) {
    return NextResponse.json({ error: 'At least one payment term is required' }, { status: 400 })
  }

  await writeReturnsFile(next)
  return NextResponse.json({ ok: true, data: next })
}
