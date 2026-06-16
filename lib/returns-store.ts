import { promises as fs } from 'fs'
import path from 'path'
import { getCmsCollectionId, getFirestoreDb } from '@/lib/firebase-admin'
import type { ReturnsData } from '@/lib/returns-types'

const DATA_PATH = path.join(process.cwd(), 'data', 'returns.json')
const DOC_ID = 'returns'

async function readReturnsFromDisk(): Promise<Partial<ReturnsData> | null> {
  try {
    const raw = await fs.readFile(DATA_PATH, 'utf8')
    return JSON.parse(raw) as Partial<ReturnsData>
  } catch {
    return null
  }
}

async function writeReturnsToDisk(data: ReturnsData): Promise<void> {
  await fs.mkdir(path.dirname(DATA_PATH), { recursive: true })
  await fs.writeFile(DATA_PATH, JSON.stringify(data, null, 2), 'utf8')
}

function returnsPartialFromFirestore(
  data: Record<string, unknown> | undefined,
): Partial<ReturnsData> | null {
  if (!data || typeof data !== 'object') return null
  if (!Array.isArray(data.points)) return null
  return {
    pageTitle: typeof data.pageTitle === 'string' ? data.pageTitle : undefined,
    sectionTitle: typeof data.sectionTitle === 'string' ? data.sectionTitle : undefined,
    points: data.points as ReturnsData['points'],
    updatedAt: typeof data.updatedAt === 'string' ? data.updatedAt : undefined,
  }
}

export async function readReturnsFile(): Promise<Partial<ReturnsData> | null> {
  const db = getFirestoreDb()
  if (db) {
    try {
      const snap = await db.collection(getCmsCollectionId()).doc(DOC_ID).get()
      if (snap.exists) {
        const parsed = returnsPartialFromFirestore(snap.data() as Record<string, unknown> | undefined)
        if (parsed && Array.isArray(parsed.points)) return parsed
      }
    } catch (e) {
      console.error('[returns-store] Firestore read failed, falling back to file:', e)
    }
  }
  return readReturnsFromDisk()
}

export async function writeReturnsFile(data: ReturnsData): Promise<void> {
  const db = getFirestoreDb()
  if (db) {
    await db.collection(getCmsCollectionId()).doc(DOC_ID).set({
      pageTitle: data.pageTitle,
      sectionTitle: data.sectionTitle,
      points: data.points,
      updatedAt: data.updatedAt,
    })
    return
  }
  await writeReturnsToDisk(data)
}
