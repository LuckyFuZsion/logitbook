import { promises as fs } from 'fs'
import path from 'path'
import { getCmsCollectionId, getFirestoreDb } from '@/lib/firebase-admin'
import type { DiveDestinationsData } from '@/lib/dive-destinations-types'

const DATA_PATH = path.join(process.cwd(), 'data', 'dive-destinations.json')
const DOC_ID = 'dive-destinations'

async function readFromDisk(): Promise<Partial<DiveDestinationsData> | null> {
  try {
    const raw = await fs.readFile(DATA_PATH, 'utf8')
    return JSON.parse(raw) as Partial<DiveDestinationsData>
  } catch {
    return null
  }
}

async function writeToDisk(data: DiveDestinationsData): Promise<void> {
  await fs.mkdir(path.dirname(DATA_PATH), { recursive: true })
  await fs.writeFile(DATA_PATH, JSON.stringify(data, null, 2), 'utf8')
}

function partialFromFirestore(
  data: Record<string, unknown> | undefined,
): Partial<DiveDestinationsData> | null {
  if (!data || typeof data !== 'object') return null
  if (!Array.isArray(data.destinations)) return null
  return {
    intro: Array.isArray(data.intro) ? (data.intro as string[]) : undefined,
    destinations: data.destinations as DiveDestinationsData['destinations'],
    updatedAt: typeof data.updatedAt === 'string' ? data.updatedAt : undefined,
  }
}

export async function readDiveDestinationsFile(): Promise<Partial<DiveDestinationsData> | null> {
  const db = getFirestoreDb()
  if (db) {
    try {
      const snap = await db.collection(getCmsCollectionId()).doc(DOC_ID).get()
      if (snap.exists) {
        const parsed = partialFromFirestore(snap.data() as Record<string, unknown> | undefined)
        if (parsed && Array.isArray(parsed.destinations)) return parsed
      }
    } catch (e) {
      console.error('[dive-destinations-store] Firestore read failed, falling back to file:', e)
    }
  }
  return readFromDisk()
}

export async function writeDiveDestinationsFile(data: DiveDestinationsData): Promise<void> {
  const db = getFirestoreDb()
  if (db) {
    await db.collection(getCmsCollectionId()).doc(DOC_ID).set({
      intro: data.intro,
      destinations: data.destinations,
      updatedAt: data.updatedAt,
    })
    return
  }
  await writeToDisk(data)
}
