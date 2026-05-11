import { redirect } from 'next/navigation'
import { getAdminSession } from '@/lib/admin-session'
import { getCmsCollectionId, isFirestorePersistenceEnabled } from '@/lib/firebase-admin'
import { mergeTestimonialsData } from '@/lib/testimonials-defaults'
import { readTestimonialsFile } from '@/lib/testimonials-store'
import AdminTestimonialsClient from '@/components/admin-testimonials-client'

export default async function AdminTestimonialsPage() {
  const session = await getAdminSession()
  if (!session) redirect('/admin/login')

  const data = mergeTestimonialsData(await readTestimonialsFile())
  return (
    <AdminTestimonialsClient
      key={data.updatedAt}
      initialData={data}
      persistenceBackend={isFirestorePersistenceEnabled() ? 'firestore' : 'file'}
      cmsCollectionId={getCmsCollectionId()}
    />
  )
}
