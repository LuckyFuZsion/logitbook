import { NextResponse } from 'next/server'
import type { FaqData, FaqItem } from '@/lib/faq-types'
import { recordCmsAuditEntry } from '@/lib/cms-audit'
import { traceCmsAdminSave } from '@/lib/cms-save-trace'
import { getAdminSession } from '@/lib/admin-session'
import { mergeFaqData } from '@/lib/faq-defaults'
import { readFaqFile, writeFaqFile } from '@/lib/faq-store'

function validateItem(item: FaqItem): string | null {
  if (!item.id || typeof item.id !== 'string') return 'FAQ item missing id'
  if (!item.question || typeof item.question !== 'string') return 'FAQ item missing question'
  if (typeof item.answer !== 'string') return 'FAQ item missing answer'
  return null
}

export async function GET() {
  const session = await getAdminSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const raw = await readFaqFile()
  return NextResponse.json({ stored: raw ?? {}, merged: mergeFaqData(raw) })
}

export async function PUT(req: Request) {
  const session = await getAdminSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  let body: Partial<FaqData>
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  if (!Array.isArray(body.items)) {
    return NextResponse.json({ error: 'items array required' }, { status: 400 })
  }

  const previous = mergeFaqData(await readFaqFile())

  for (const item of body.items) {
    const err = validateItem(item)
    if (err) return NextResponse.json({ error: err }, { status: 400 })
  }

  const next: FaqData = {
    items: body.items,
    updatedAt: new Date().toISOString(),
  }

  await recordCmsAuditEntry('faq', previous, next)
  await writeFaqFile(next)
  traceCmsAdminSave('faq', next.updatedAt)
  return NextResponse.json({ ok: true, data: next })
}
