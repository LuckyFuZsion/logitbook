import { promises as fs } from 'fs'
import path from 'path'
import type { GalleryData, GalleryDataFile } from '@/lib/gallery-types'
import { getCmsCollectionId, getFirestoreDb } from '@/lib/firebase-admin'

const DATA_PATH = path.join(process.cwd(), 'data', 'gallery.json')
const DOC_ID = 'gallery'

async function readGalleryFromDisk(): Promise<GalleryDataFile | null> {
  try {
    const raw = await fs.readFile(DATA_PATH, 'utf8')
    return JSON.parse(raw) as GalleryDataFile
  } catch {
    return null
  }
}

async function writeGalleryToDisk(data: GalleryData): Promise<void> {
  await fs.mkdir(path.dirname(DATA_PATH), { recursive: true })
  await fs.writeFile(DATA_PATH, JSON.stringify(data, null, 2), 'utf8')
}

function firestorePayloadFromGalleryData(data: GalleryData): Record<string, unknown> {
  return {
    grid: data.grid,
    beforeAfterSlides: data.beforeAfterSlides,
    updatedAt: data.updatedAt,
  }
}

function galleryDataFileFromFirestore(data: Record<string, unknown> | undefined): GalleryDataFile | null {
  if (!data || typeof data !== 'object') return null
  const o = data
  if (!Array.isArray(o.grid) && o.beforeAfterSlides === undefined && o.beforeAfter === undefined) {
    return null
  }
  return {
    grid: Array.isArray(o.grid) ? (o.grid as GalleryDataFile['grid']) : undefined,
    beforeAfterSlides: o.beforeAfterSlides as GalleryDataFile['beforeAfterSlides'],
    beforeAfter: o.beforeAfter as GalleryDataFile['beforeAfter'],
    updatedAt: typeof o.updatedAt === 'string' ? o.updatedAt : undefined,
  }
}

/**
 * Read gallery CMS: Firestore when configured (doc `cms/gallery`), otherwise `data/gallery.json`.
 * If Firestore is enabled but the document is missing, falls back to the JSON file.
 */
export async function readGalleryFile(): Promise<GalleryDataFile | null> {
  const db = getFirestoreDb()
  if (db) {
    try {
      const snap = await db.collection(getCmsCollectionId()).doc(DOC_ID).get()
      if (snap.exists) {
        const parsed = galleryDataFileFromFirestore(snap.data() ?? {})
        if (parsed && (parsed.grid !== undefined || parsed.beforeAfterSlides !== undefined || parsed.beforeAfter)) {
          return parsed
        }
      }
    } catch (e) {
      console.error('[gallery-store] Firestore read failed, falling back to file:', e)
    }
  }
  return readGalleryFromDisk()
}

/**
 * Persist gallery: writes to Firestore when configured, else `data/gallery.json`.
 */
export async function writeGalleryFile(data: GalleryData): Promise<void> {
  const db = getFirestoreDb()
  if (db) {
    await db.collection(getCmsCollectionId()).doc(DOC_ID).set(firestorePayloadFromGalleryData(data))
    return
  }
  await writeGalleryToDisk(data)
}
