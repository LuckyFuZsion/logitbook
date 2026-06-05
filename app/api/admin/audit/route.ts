import { NextResponse } from 'next/server'
import { getAdminSession } from '@/lib/admin-session'
import { CMS_AUDIT_RESOURCE_LABEL, listCmsAuditEntries } from '@/lib/cms-audit'
import { getFirestoreDb } from '@/lib/firebase-admin'

export async function GET() {
  if (!await getAdminSession()) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const auditEnabled = getFirestoreDb() !== null
  if (!auditEnabled) {
    return NextResponse.json({
      auditEnabled: false,
      entries: [],
      resourceLabels: CMS_AUDIT_RESOURCE_LABEL,
    })
  }

  try {
    const entries = await listCmsAuditEntries(100)
    return NextResponse.json({
      auditEnabled: true,
      entries,
      resourceLabels: CMS_AUDIT_RESOURCE_LABEL,
    })
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'Failed to read audit log'
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}
