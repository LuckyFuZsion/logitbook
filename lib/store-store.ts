/** JSON file or Firestore (when Firebase Admin is configured). */
import { promises as fs } from 'fs'
import path from 'path'
import { getCmsCollectionId, getFirestoreDb } from '@/lib/firebase-admin'
import type { StoreData } from '@/lib/store-types'

const DATA_PATH = path.join(process.cwd(), 'data', 'store.json')
const DOC_ID = 'store'

async function readStoreFromDisk(): Promise<Partial<StoreData> | null> {
  try {
    const raw = await fs.readFile(DATA_PATH, 'utf8')
    return JSON.parse(raw) as Partial<StoreData>
  } catch {
    return null
  }
}

async function writeStoreToDisk(data: StoreData): Promise<void> {
  await fs.mkdir(path.dirname(DATA_PATH), { recursive: true })
  await fs.writeFile(DATA_PATH, JSON.stringify(data, null, 2), 'utf8')
}

function storePartialFromFirestore(data: Record<string, unknown> | undefined): Partial<StoreData> | null {
  if (!data || typeof data !== 'object') return null
  if (!Array.isArray(data.products)) return null
  return {
    products: data.products as StoreData['products'],
    updatedAt: typeof data.updatedAt === 'string' ? data.updatedAt : undefined,
  }
}

/**
 * Read shop CMS: Firestore when configured (`cms/store`), otherwise `data/store.json`.
 * Falls back to file if the Firestore document is missing or invalid.
 */
export async function readStoreFile(): Promise<Partial<StoreData> | null> {
  const db = getFirestoreDb()
  if (db) {
    try {
      const snap = await db.collection(getCmsCollectionId()).doc(DOC_ID).get()
      if (snap.exists) {
        const raw = snap.data() as Record<string, unknown> | undefined
        const parsed = storePartialFromFirestore(raw)
        if (parsed && Array.isArray(parsed.products)) {
          return parsed
        }
      }
    } catch (e) {
      console.error('[store-store] Firestore read failed, falling back to file:', e)
    }
  }
  return readStoreFromDisk()
}

/**
 * Persist shop: Firestore when configured, else `data/store.json`.
 */
export async function writeStoreFile(data: StoreData): Promise<void> {
  const db = getFirestoreDb()
  if (db) {
    await db.collection(getCmsCollectionId()).doc(DOC_ID).set({
      products: data.products,
      updatedAt: data.updatedAt,
    })
    return
  }
  await writeStoreToDisk(data)
}
