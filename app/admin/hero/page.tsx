import { redirect } from 'next/navigation'
import { getAdminSession } from '@/lib/admin-session'
import { getCmsCollectionId, isFirestorePersistenceEnabled } from '@/lib/firebase-admin'
import { mergeHeroData } from '@/lib/hero-defaults'
import { readHeroFile } from '@/lib/hero-store'
import AdminHeroClient from '@/components/admin-hero-client'

export default async function AdminHeroPage() {
  const session = await getAdminSession()
  if (!session) redirect('/admin/login')

  const data = mergeHeroData(await readHeroFile())
  return (
    <AdminHeroClient
      key={data.updatedAt}
      initialData={data}
      persistenceBackend={isFirestorePersistenceEnabled() ? 'firestore' : 'file'}
      cmsCollectionId={getCmsCollectionId()}
    />
  )
}
