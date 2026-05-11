import { promises as fs } from 'fs'
import path from 'path'
import { getCmsCollectionId, getFirestoreDb } from '@/lib/firebase-admin'
import type { ServicesData } from '@/lib/services-types'

const DATA_PATH = path.join(process.cwd(), 'data', 'services.json')
const DOC_ID = 'services'

async function readServicesFromDisk(): Promise<Partial<ServicesData> | null> {
  try {
    const raw = await fs.readFile(DATA_PATH, 'utf8')
    return JSON.parse(raw) as Partial<ServicesData>
  } catch {
    return null
  }
}

async function writeServicesToDisk(data: ServicesData): Promise<void> {
  await fs.mkdir(path.dirname(DATA_PATH), { recursive: true })
  await fs.writeFile(DATA_PATH, JSON.stringify(data, null, 2), 'utf8')
}

function servicesPartialFromFirestore(
  data: Record<string, unknown> | undefined,
): Partial<ServicesData> | null {
  if (!data || typeof data !== 'object') return null
  if (!Array.isArray(data.categories)) return null
  return {
    categories: data.categories as ServicesData['categories'],
    vatNote: typeof data.vatNote === 'string' ? data.vatNote : undefined,
    membersNote: typeof data.membersNote === 'string' ? data.membersNote : undefined,
    clubUrl: typeof data.clubUrl === 'string' ? data.clubUrl : undefined,
    clubName: typeof data.clubName === 'string' ? data.clubName : undefined,
    updatedAt: typeof data.updatedAt === 'string' ? data.updatedAt : undefined,
  }
}

/**
 * Read services CMS: Firestore when configured (`cms/services`), otherwise `data/services.json`.
 * Falls back to file if the Firestore document is missing or invalid.
 */
export async function readServicesFile(): Promise<Partial<ServicesData> | null> {
  const db = getFirestoreDb()
  if (db) {
    try {
      const snap = await db.collection(getCmsCollectionId()).doc(DOC_ID).get()
      if (snap.exists) {
        const raw = snap.data() as Record<string, unknown> | undefined
        const parsed = servicesPartialFromFirestore(raw)
        if (parsed && Array.isArray(parsed.categories)) {
          return parsed
        }
      }
    } catch (e) {
      console.error('[services-store] Firestore read failed, falling back to file:', e)
    }
  }
  return readServicesFromDisk()
}

/**
 * Persist services: Firestore when configured, else `data/services.json`.
 */
export async function writeServicesFile(data: ServicesData): Promise<void> {
  const db = getFirestoreDb()
  if (db) {
    await db.collection(getCmsCollectionId()).doc(DOC_ID).set({
      categories: data.categories,
      vatNote: data.vatNote,
      membersNote: data.membersNote,
      clubUrl: data.clubUrl,
      clubName: data.clubName,
      updatedAt: data.updatedAt,
    })
    return
  }
  await writeServicesToDisk(data)
}
