import { promises as fs } from 'fs'
import path from 'path'
import { getCmsCollectionId, getFirestoreDb } from '@/lib/firebase-admin'
import type { FaqData } from '@/lib/faq-types'

const DATA_PATH = path.join(process.cwd(), 'data', 'faq.json')
const DOC_ID = 'faq'

async function readFaqFromDisk(): Promise<Partial<FaqData> | null> {
  try {
    const raw = await fs.readFile(DATA_PATH, 'utf8')
    return JSON.parse(raw) as Partial<FaqData>
  } catch {
    return null
  }
}

async function writeFaqToDisk(data: FaqData): Promise<void> {
  await fs.mkdir(path.dirname(DATA_PATH), { recursive: true })
  await fs.writeFile(DATA_PATH, JSON.stringify(data, null, 2), 'utf8')
}

function faqPartialFromFirestore(
  data: Record<string, unknown> | undefined,
): Partial<FaqData> | null {
  if (!data || typeof data !== 'object') return null
  if (!Array.isArray(data.items)) return null
  return {
    items: data.items as FaqData['items'],
    updatedAt: typeof data.updatedAt === 'string' ? data.updatedAt : undefined,
  }
}

/**
 * Read FAQs: Firestore (`cms/faq`) when configured, otherwise `data/faq.json`.
 */
export async function readFaqFile(): Promise<Partial<FaqData> | null> {
  const db = getFirestoreDb()
  if (db) {
    try {
      const snap = await db.collection(getCmsCollectionId()).doc(DOC_ID).get()
      if (snap.exists) {
        const parsed = faqPartialFromFirestore(snap.data() as Record<string, unknown> | undefined)
        if (parsed && Array.isArray(parsed.items)) return parsed
      }
    } catch (e) {
      console.error('[faq-store] Firestore read failed, falling back to file:', e)
    }
  }
  return readFaqFromDisk()
}

/**
 * Persist FAQs: Firestore when configured, else `data/faq.json`.
 */
export async function writeFaqFile(data: FaqData): Promise<void> {
  const db = getFirestoreDb()
  if (db) {
    await db.collection(getCmsCollectionId()).doc(DOC_ID).set({
      items: data.items,
      updatedAt: data.updatedAt,
    })
    return
  }
  await writeFaqToDisk(data)
}
