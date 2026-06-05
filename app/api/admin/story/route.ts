import { NextResponse } from 'next/server'
import { recordCmsAuditEntry } from '@/lib/cms-audit'
import { getAdminSession } from '@/lib/admin-session'
import { mergeStoryData } from '@/lib/story-defaults'
import { readStoryFile, writeStoryFile } from '@/lib/story-store'
import type { StoryData } from '@/lib/story-types'

export async function GET() {
  if (!await getAdminSession()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  return NextResponse.json({ data: mergeStoryData(await readStoryFile()) })
}

export async function PUT(req: Request) {
  if (!await getAdminSession()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  let body: Partial<StoryData>
  try { body = await req.json() } catch { return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 }) }
  if (!body.paragraph1) return NextResponse.json({ error: 'paragraph1 required' }, { status: 400 })
  const previous = mergeStoryData(await readStoryFile())
  const next = { ...mergeStoryData(body), updatedAt: new Date().toISOString() }
  await recordCmsAuditEntry('story', previous, next)
  await writeStoryFile(next)
  return NextResponse.json({ ok: true, data: next })
}
