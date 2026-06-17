import { NextResponse } from 'next/server'
import type { ServicesData, ServiceCategory, ServiceItem } from '@/lib/services-types'
import { recordCmsAuditEntry } from '@/lib/cms-audit'
import { traceCmsAdminSave } from '@/lib/cms-save-trace'
import { getAdminSession } from '@/lib/admin-session'
import { mergeServicesData } from '@/lib/services-defaults'
import { readServicesFile, writeServicesFile } from '@/lib/services-store'

function isValidServiceIcon(icon: string): boolean {
  if (icon.startsWith('/')) return true
  if (/^https?:\/\//i.test(icon)) return true
  return false
}

function validateCategory(cat: ServiceCategory): string | null {
  if (!cat.id || typeof cat.id !== 'string') return 'Category missing id'
  if (!cat.title || typeof cat.title !== 'string') return 'Category missing title'
  if (typeof cat.icon !== 'string' || !isValidServiceIcon(cat.icon)) {
    return `Invalid icon: ${cat.icon}. Use a site path (/icons/...) or https URL.`
  }
  if (typeof cat.description !== 'string') return 'Category missing description'
  if (!Array.isArray(cat.services)) return 'Category missing services array'
  for (const svc of cat.services) {
    const err = validateServiceItem(svc)
    if (err) return err
  }
  return null
}

function validateServiceItem(svc: ServiceItem): string | null {
  if (!svc.id || typeof svc.id !== 'string') return 'Service item missing id'
  if (!svc.name || typeof svc.name !== 'string') return 'Service item missing name'
  if (svc.standard !== null && typeof svc.standard !== 'number') return 'Service standard must be number or null'
  if (svc.member !== null && typeof svc.member !== 'number') return 'Service member must be number or null'
  return null
}

export async function GET() {
  const session = await getAdminSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const raw = await readServicesFile()
  return NextResponse.json({ stored: raw ?? {}, merged: mergeServicesData(raw) })
}

export async function PUT(req: Request) {
  const session = await getAdminSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  let body: Partial<ServicesData>
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  if (!Array.isArray(body.categories)) {
    return NextResponse.json({ error: 'categories array required' }, { status: 400 })
  }

  const previous = mergeServicesData(await readServicesFile())

  for (const cat of body.categories) {
    const err = validateCategory(cat)
    if (err) return NextResponse.json({ error: err }, { status: 400 })
  }

  if (body.vatNote !== undefined && typeof body.vatNote !== 'string') {
    return NextResponse.json({ error: 'vatNote must be a string' }, { status: 400 })
  }
  if (body.membersNote !== undefined && typeof body.membersNote !== 'string') {
    return NextResponse.json({ error: 'membersNote must be a string' }, { status: 400 })
  }
  if (body.clubUrl !== undefined && typeof body.clubUrl !== 'string') {
    return NextResponse.json({ error: 'clubUrl must be a string' }, { status: 400 })
  }
  if (body.clubName !== undefined && typeof body.clubName !== 'string') {
    return NextResponse.json({ error: 'clubName must be a string' }, { status: 400 })
  }

  const merged = mergeServicesData(body)
  const next: ServicesData = {
    ...merged,
    updatedAt: new Date().toISOString(),
  }

  await recordCmsAuditEntry('services', previous, next)
  await writeServicesFile(next)
  traceCmsAdminSave('services', next.updatedAt)
  return NextResponse.json({ ok: true, data: next })
}
