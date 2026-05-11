import { promises as fs } from 'fs'
import path from 'path'
import { getCmsCollectionId, getFirestoreDb } from '@/lib/firebase-admin'
import type { HoursData } from '@/lib/hours-types'

const DATA_PATH = path.join(process.cwd(), 'data', 'hours.json')
const DOC_ID = 'hours'

export async function readHoursFile(): Promise<Partial<HoursData> | null> {
  const db = getFirestoreDb()
  if (db) {
    try {
      const snap = await db.collection(getCmsCollectionId()).doc(DOC_ID).get()
      if (snap.exists) return snap.data() as Partial<HoursData>
    } catch (e) {
      console.error('[hours-store] Firestore read failed, falling back to file:', e)
    }
  }
  try {
    const raw = await fs.readFile(DATA_PATH, 'utf8')
    return JSON.parse(raw) as Partial<HoursData>
  } catch {
    return null
  }
}

export async function writeHoursFile(data: HoursData): Promise<void> {
  const db = getFirestoreDb()
  if (db) {
    await db.collection(getCmsCollectionId()).doc(DOC_ID).set(data)
    return
  }
  await fs.mkdir(path.dirname(DATA_PATH), { recursive: true })
  await fs.writeFile(DATA_PATH, JSON.stringify(data, null, 2), 'utf8')
}
