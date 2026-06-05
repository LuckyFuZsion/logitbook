import { NextResponse } from 'next/server'
import { recordCmsAuditEntry } from '@/lib/cms-audit'
import { getAdminSession } from '@/lib/admin-session'
import { mergeTestimonialsData } from '@/lib/testimonials-defaults'
import { readTestimonialsFile, writeTestimonialsFile } from '@/lib/testimonials-store'
import type { TestimonialsData } from '@/lib/testimonials-types'

export async function GET() {
  if (!await getAdminSession()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  return NextResponse.json({ data: mergeTestimonialsData(await readTestimonialsFile()) })
}

export async function PUT(req: Request) {
  if (!await getAdminSession()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  let body: Partial<TestimonialsData>
  try { body = await req.json() } catch { return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 }) }
  if (!Array.isArray(body.items)) return NextResponse.json({ error: 'items array required' }, { status: 400 })
  const previous = mergeTestimonialsData(await readTestimonialsFile())
  for (const t of body.items) {
    if (!t.id || !t.name || !t.text) return NextResponse.json({ error: 'Each testimonial needs id, name, and text' }, { status: 400 })
  }
  const next = { ...mergeTestimonialsData(body), updatedAt: new Date().toISOString() }
  await recordCmsAuditEntry('testimonials', previous, next)
  await writeTestimonialsFile(next)
  return NextResponse.json({ ok: true, data: next })
}
