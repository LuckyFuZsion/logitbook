import { NextResponse } from 'next/server'
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
  const next = { ...mergeContactData(body), updatedAt: new Date().toISOString() }
  await writeContactFile(next)
  return NextResponse.json({ ok: true, data: next })
}
