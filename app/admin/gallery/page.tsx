import { randomUUID } from 'crypto'
import { redirect } from 'next/navigation'
import { getAdminSession } from '@/lib/admin-session'
import { getCmsCollectionId, isFirestorePersistenceEnabled } from '@/lib/firebase-admin'
import { isCloudinaryConfigured } from '@/lib/cloudinary-server'
import { mergeGalleryData } from '@/lib/gallery-defaults'
import type { GalleryBeforeAfter, GalleryDataFile } from '@/lib/gallery-types'
import { readGalleryFile } from '@/lib/gallery-store'
import AdminGalleryClient from '@/components/admin-gallery-client'

function initialBeforeAfterSlidesForAdmin(raw: GalleryDataFile | null): GalleryBeforeAfter[] {
  if (!raw) return []
  if (raw.beforeAfterSlides && raw.beforeAfterSlides.length > 0) {
    return raw.beforeAfterSlides.map((s) => ({
      ...s,
      id: s.id?.trim() ? s.id : randomUUID(),
      title: typeof s.title === 'string' ? s.title : '',
    }))
  }
  const b = raw.beforeAfter
  if (b && typeof b.beforeSrc === 'string' && b.beforeSrc.trim()) {
    return [
      {
        id: randomUUID(),
        title: '',
        beforeSrc: b.beforeSrc,
        afterSrc: typeof b.afterSrc === 'string' ? b.afterSrc : '',
        beforeAlt: typeof b.beforeAlt === 'string' ? b.beforeAlt : '',
        afterAlt: typeof b.afterAlt === 'string' ? b.afterAlt : '',
      },
    ]
  }
  return []
}

export default async function AdminGalleryPage() {
  const session = await getAdminSession()
  if (!session) redirect('/admin/login')

  const raw = await readGalleryFile()
  const merged = mergeGalleryData(raw)
  const initialGrid = raw?.grid?.length ? raw.grid : []
  const initialBeforeAfterSlides = initialBeforeAfterSlidesForAdmin(raw)
  const stamp = raw?.updatedAt ?? merged.updatedAt
  const uploadDestination = isCloudinaryConfigured() ? 'cloudinary' : 'local'
  const persistenceBackend = isFirestorePersistenceEnabled() ? 'firestore' : 'file'

  return (
    <AdminGalleryClient
      key={stamp}
      initialGrid={initialGrid}
      initialBeforeAfterSlides={initialBeforeAfterSlides}
      uploadDestination={uploadDestination}
      persistenceBackend={persistenceBackend}
      cmsCollectionId={getCmsCollectionId()}
    />
  )
}
