import { redirect } from 'next/navigation'
import { getAdminSession } from '@/lib/admin-session'
import { getAuditCollectionId, isFirestorePersistenceEnabled } from '@/lib/firebase-admin'
import AdminAuditClient from '@/components/admin-audit-client'

export default async function AdminAuditPage() {
  if (!await getAdminSession()) redirect('/admin/login')

  return (
    <AdminAuditClient
      auditEnabled={isFirestorePersistenceEnabled()}
      auditCollectionId={getAuditCollectionId()}
    />
  )
}
