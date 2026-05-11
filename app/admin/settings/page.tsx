import { redirect } from 'next/navigation'
import { getAdminSession } from '@/lib/admin-session'
import { isFirestorePersistenceEnabled } from '@/lib/firebase-admin'
import { mergeContactData } from '@/lib/contact-defaults'
import { mergeHoursData } from '@/lib/hours-defaults'
import { mergeAnnouncementData } from '@/lib/announcement-defaults'
import { readContactFile } from '@/lib/contact-store'
import { readHoursFile } from '@/lib/hours-store'
import { readAnnouncementFile } from '@/lib/announcement-store'
import AdminSettingsClient from '@/components/admin-settings-client'

export default async function AdminSettingsPage() {
  const session = await getAdminSession()
  if (!session) redirect('/admin/login')

  const [contact, hours, announcement] = await Promise.all([
    readContactFile().then(mergeContactData),
    readHoursFile().then(mergeHoursData),
    readAnnouncementFile().then(mergeAnnouncementData),
  ])

  return (
    <AdminSettingsClient
      initialContact={contact}
      initialHours={hours}
      initialAnnouncement={announcement}
      persistenceBackend={isFirestorePersistenceEnabled() ? 'firestore' : 'file'}
    />
  )
}
