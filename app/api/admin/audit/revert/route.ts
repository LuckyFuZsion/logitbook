import { NextResponse } from 'next/server'
import { getAdminSession } from '@/lib/admin-session'
import { revertCmsAuditEntry } from '@/lib/cms-audit'
import { getFirestoreDb } from '@/lib/firebase-admin'

export async function POST(req: Request) {
  if (!await getAdminSession()) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  if (!getFirestoreDb()) {
    return NextResponse.json({ error: 'Firestore is not configured.' }, { status: 503 })
  }

  let body: { id?: string }
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }
  if (!body.id || typeof body.id !== 'string') {
    return NextResponse.json({ error: 'id required' }, { status: 400 })
  }

  const result = await revertCmsAuditEntry(body.id)
  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: 400 })
  }
  return NextResponse.json({ ok: true })
}
