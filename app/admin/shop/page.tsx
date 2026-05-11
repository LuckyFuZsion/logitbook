import { redirect } from 'next/navigation'
import { getAdminSession } from '@/lib/admin-session'
import { getCmsCollectionId, isFirestorePersistenceEnabled } from '@/lib/firebase-admin'
import { mergeStoreData } from '@/lib/store-defaults'
import { readStoreFile } from '@/lib/store-store'
import AdminShopClient from '@/components/admin-shop-client'

export default async function AdminShopPage() {
  const session = await getAdminSession()
  if (!session) redirect('/admin/login')

  const raw = await readStoreFile()
  const merged = mergeStoreData(raw)
  const initialProducts = merged.products
  const stamp = raw?.updatedAt ?? merged.updatedAt
  const persistenceBackend = isFirestorePersistenceEnabled() ? 'firestore' : 'file'

  return (
    <AdminShopClient
      key={stamp}
      initialProducts={initialProducts}
      persistenceBackend={persistenceBackend}
      cmsCollectionId={getCmsCollectionId()}
    />
  )
}
