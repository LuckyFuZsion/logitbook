import { redirect } from 'next/navigation'
import { getAdminSession } from '@/lib/admin-session'
import { getCmsCollectionId, isFirestorePersistenceEnabled } from '@/lib/firebase-admin'
import { mergeReturnsData } from '@/lib/returns-defaults'
import { readReturnsFile } from '@/lib/returns-store'
import AdminReturnsClient from '@/components/admin-returns-client'

export default async function AdminReturnsPage() {
  const session = await getAdminSession()
  if (!session) redirect('/admin/login')

  const raw = await readReturnsFile()
  const data = mergeReturnsData(raw)
  const persistenceBackend = isFirestorePersistenceEnabled() ? 'firestore' : 'file'

  return (
    <AdminReturnsClient
      key={data.updatedAt}
      initialData={data}
      persistenceBackend={persistenceBackend}
      cmsCollectionId={getCmsCollectionId()}
    />
  )
}
