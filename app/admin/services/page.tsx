import { redirect } from 'next/navigation'
import { getAdminSession } from '@/lib/admin-session'
import { getCmsCollectionId, isFirestorePersistenceEnabled } from '@/lib/firebase-admin'
import { mergeServicesData } from '@/lib/services-defaults'
import { readServicesFile } from '@/lib/services-store'
import AdminServicesClient from '@/components/admin-services-client'

export default async function AdminServicesPage() {
  const session = await getAdminSession()
  if (!session) redirect('/admin/login')

  const raw = await readServicesFile()
  const data = mergeServicesData(raw)
  const persistenceBackend = isFirestorePersistenceEnabled() ? 'firestore' : 'file'

  return (
    <AdminServicesClient
      key={data.updatedAt}
      initialData={data}
      persistenceBackend={persistenceBackend}
      cmsCollectionId={getCmsCollectionId()}
    />
  )
}
