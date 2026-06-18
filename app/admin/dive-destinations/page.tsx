import { redirect } from 'next/navigation'
import { getAdminSession } from '@/lib/admin-session'
import { getCmsCollectionId, isFirestorePersistenceEnabled } from '@/lib/firebase-admin'
import { mergeDiveDestinationsData } from '@/lib/dive-destinations-defaults'
import { readDiveDestinationsFile } from '@/lib/dive-destinations-store'
import AdminDiveDestinationsClient from '@/components/admin-dive-destinations-client'

export default async function AdminDiveDestinationsPage() {
  const session = await getAdminSession()
  if (!session) redirect('/admin/login')

  const raw = await readDiveDestinationsFile()
  const data = mergeDiveDestinationsData(raw)
  const persistenceBackend = isFirestorePersistenceEnabled() ? 'firestore' : 'file'

  return (
    <AdminDiveDestinationsClient
      key={data.updatedAt}
      initialData={data}
      persistenceBackend={persistenceBackend}
      cmsCollectionId={getCmsCollectionId()}
    />
  )
}
