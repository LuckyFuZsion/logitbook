import { redirect } from 'next/navigation'
import { getAdminSession } from '@/lib/admin-session'
import { getCmsCollectionId, isFirestorePersistenceEnabled } from '@/lib/firebase-admin'
import { mergeFaqData } from '@/lib/faq-defaults'
import { readFaqFile } from '@/lib/faq-store'
import AdminFaqClient from '@/components/admin-faq-client'

export default async function AdminFaqPage() {
  const session = await getAdminSession()
  if (!session) redirect('/admin/login')

  const raw = await readFaqFile()
  const data = mergeFaqData(raw)
  const persistenceBackend = isFirestorePersistenceEnabled() ? 'firestore' : 'file'

  return (
    <AdminFaqClient
      key={data.updatedAt}
      initialData={data}
      persistenceBackend={persistenceBackend}
      cmsCollectionId={getCmsCollectionId()}
    />
  )
}
