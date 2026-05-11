import { promises as fs } from 'fs'
import path from 'path'
import { getCmsCollectionId, getFirestoreDb } from '@/lib/firebase-admin'
import type { ContactData } from '@/lib/contact-types'

const DATA_PATH = path.join(process.cwd(), 'data', 'contact.json')
const DOC_ID = 'contact'

export async function readContactFile(): Promise<Partial<ContactData> | null> {
  const db = getFirestoreDb()
  if (db) {
    try {
      const snap = await db.collection(getCmsCollectionId()).doc(DOC_ID).get()
      if (snap.exists) return snap.data() as Partial<ContactData>
    } catch (e) {
      console.error('[contact-store] Firestore read failed, falling back to file:', e)
    }
  }
  try {
    const raw = await fs.readFile(DATA_PATH, 'utf8')
    return JSON.parse(raw) as Partial<ContactData>
  } catch {
    return null
  }
}

export async function writeContactFile(data: ContactData): Promise<void> {
  const db = getFirestoreDb()
  if (db) {
    await db.collection(getCmsCollectionId()).doc(DOC_ID).set(data)
    return
  }
  await fs.mkdir(path.dirname(DATA_PATH), { recursive: true })
  await fs.writeFile(DATA_PATH, JSON.stringify(data, null, 2), 'utf8')
}
