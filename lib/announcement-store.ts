import { promises as fs } from 'fs'
import path from 'path'
import { getCmsCollectionId, getFirestoreDb } from '@/lib/firebase-admin'
import type { AnnouncementData } from '@/lib/announcement-types'

const DATA_PATH = path.join(process.cwd(), 'data', 'announcement.json')
const DOC_ID = 'announcement'

export async function readAnnouncementFile(): Promise<Partial<AnnouncementData> | null> {
  const db = getFirestoreDb()
  if (db) {
    try {
      const snap = await db.collection(getCmsCollectionId()).doc(DOC_ID).get()
      if (snap.exists) return snap.data() as Partial<AnnouncementData>
    } catch (e) {
      console.error('[announcement-store] Firestore read failed, falling back to file:', e)
    }
  }
  try {
    const raw = await fs.readFile(DATA_PATH, 'utf8')
    return JSON.parse(raw) as Partial<AnnouncementData>
  } catch {
    return null
  }
}

export async function writeAnnouncementFile(data: AnnouncementData): Promise<void> {
  const db = getFirestoreDb()
  if (db) {
    await db.collection(getCmsCollectionId()).doc(DOC_ID).set(data)
    return
  }
  await fs.mkdir(path.dirname(DATA_PATH), { recursive: true })
  await fs.writeFile(DATA_PATH, JSON.stringify(data, null, 2), 'utf8')
}
