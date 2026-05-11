import { redirect } from 'next/navigation'
import { getAdminSession } from '@/lib/admin-session'
import { getCmsCollectionId, isFirestorePersistenceEnabled } from '@/lib/firebase-admin'
import { mergeStoryData } from '@/lib/story-defaults'
import { readStoryFile } from '@/lib/story-store'
import AdminStoryClient from '@/components/admin-story-client'

export default async function AdminStoryPage() {
  const session = await getAdminSession()
  if (!session) redirect('/admin/login')

  const data = mergeStoryData(await readStoryFile())
  return (
    <AdminStoryClient
      key={data.updatedAt}
      initialData={data}
      persistenceBackend={isFirestorePersistenceEnabled() ? 'firestore' : 'file'}
      cmsCollectionId={getCmsCollectionId()}
    />
  )
}
