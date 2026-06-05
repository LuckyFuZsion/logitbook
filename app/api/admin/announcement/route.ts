import { NextResponse } from 'next/server'
import { recordCmsAuditEntry } from '@/lib/cms-audit'
import { getAdminSession } from '@/lib/admin-session'
import { mergeAnnouncementData } from '@/lib/announcement-defaults'
import { readAnnouncementFile, writeAnnouncementFile } from '@/lib/announcement-store'
import type { AnnouncementData } from '@/lib/announcement-types'

export async function GET() {
  if (!await getAdminSession()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  return NextResponse.json({ data: mergeAnnouncementData(await readAnnouncementFile()) })
}

export async function PUT(req: Request) {
  if (!await getAdminSession()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  let body: Partial<AnnouncementData>
  try { body = await req.json() } catch { return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 }) }
  const previous = mergeAnnouncementData(await readAnnouncementFile())
  const next = { ...mergeAnnouncementData(body), updatedAt: new Date().toISOString() }
  await recordCmsAuditEntry('announcement', previous, next)
  await writeAnnouncementFile(next)
  return NextResponse.json({ ok: true, data: next })
}
