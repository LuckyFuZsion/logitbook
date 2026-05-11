import { NextResponse } from 'next/server'
import { getAdminSession } from '@/lib/admin-session'
import { mergeHeroData } from '@/lib/hero-defaults'
import { readHeroFile, writeHeroFile } from '@/lib/hero-store'
import type { HeroData } from '@/lib/hero-types'

export async function GET() {
  if (!await getAdminSession()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  return NextResponse.json({ data: mergeHeroData(await readHeroFile()) })
}

export async function PUT(req: Request) {
  if (!await getAdminSession()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  let body: Partial<HeroData>
  try { body = await req.json() } catch { return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 }) }
  if (!body.subheading) return NextResponse.json({ error: 'subheading required' }, { status: 400 })
  const next = { ...mergeHeroData(body), updatedAt: new Date().toISOString() }
  await writeHeroFile(next)
  return NextResponse.json({ ok: true, data: next })
}
