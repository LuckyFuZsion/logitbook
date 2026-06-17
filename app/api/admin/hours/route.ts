import { NextResponse } from 'next/server'
import { recordCmsAuditEntry } from '@/lib/cms-audit'
import { traceCmsAdminSave } from '@/lib/cms-save-trace'
import { getAdminSession } from '@/lib/admin-session'
import { mergeHoursData } from '@/lib/hours-defaults'
import { readHoursFile, writeHoursFile } from '@/lib/hours-store'
import type { HoursData } from '@/lib/hours-types'

export async function GET() {
  if (!await getAdminSession()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  return NextResponse.json({ data: mergeHoursData(await readHoursFile()) })
}

export async function PUT(req: Request) {
  if (!await getAdminSession()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  let body: Partial<HoursData>
  try { body = await req.json() } catch { return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 }) }
  if (!Array.isArray(body.schedule)) return NextResponse.json({ error: 'schedule array required' }, { status: 400 })
  const previous = mergeHoursData(await readHoursFile())
  const next = { ...mergeHoursData(body), updatedAt: new Date().toISOString() }
  await recordCmsAuditEntry('hours', previous, next)
  await writeHoursFile(next)
  traceCmsAdminSave('hours', next.updatedAt)
  return NextResponse.json({ ok: true, data: next })
}
