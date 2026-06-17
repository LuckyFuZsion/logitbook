import { NextResponse } from 'next/server'
import { recordCmsAuditEntry } from '@/lib/cms-audit'
import { traceCmsAdminSave } from '@/lib/cms-save-trace'
import { getAdminSession } from '@/lib/admin-session'
import { mergeContactData } from '@/lib/contact-defaults'
import { readContactFile, writeContactFile } from '@/lib/contact-store'
import type { ContactData } from '@/lib/contact-types'

export async function GET() {
  if (!await getAdminSession()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const raw = await readContactFile()
  return NextResponse.json({ data: mergeContactData(raw) })
}

export async function PUT(req: Request) {
  if (!await getAdminSession()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  let body: Partial<ContactData>
  try { body = await req.json() } catch { return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 }) }
  if (!body.email || typeof body.email !== 'string') return NextResponse.json({ error: 'email required' }, { status: 400 })
  const previous = mergeContactData(await readContactFile())
  const next = { ...mergeContactData(body), updatedAt: new Date().toISOString() }
  await recordCmsAuditEntry('contact', previous, next)
  await writeContactFile(next)
  traceCmsAdminSave('contact', next.updatedAt)
  return NextResponse.json({ ok: true, data: next })
}
