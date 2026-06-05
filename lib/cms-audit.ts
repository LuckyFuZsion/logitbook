import { FieldValue, Timestamp } from 'firebase-admin/firestore'
import { mergeAnnouncementData } from '@/lib/announcement-defaults'
import { writeAnnouncementFile } from '@/lib/announcement-store'
import type { AnnouncementData } from '@/lib/announcement-types'
import { mergeContactData } from '@/lib/contact-defaults'
import { writeContactFile } from '@/lib/contact-store'
import type { ContactData } from '@/lib/contact-types'
import { mergeFaqData } from '@/lib/faq-defaults'
import { writeFaqFile } from '@/lib/faq-store'
import type { FaqData } from '@/lib/faq-types'
import {
  type CmsAuditListEntry,
  type CmsAuditResource,
  isCmsAuditResource,
} from '@/lib/cms-audit-types'
import { getAuditCollectionId, getFirestoreDb } from '@/lib/firebase-admin'
import { mergeGalleryData } from '@/lib/gallery-defaults'
import { writeGalleryFile } from '@/lib/gallery-store'
import type { GalleryData } from '@/lib/gallery-types'
import { mergeHeroData } from '@/lib/hero-defaults'
import { writeHeroFile } from '@/lib/hero-store'
import type { HeroData } from '@/lib/hero-types'
import { mergeHoursData } from '@/lib/hours-defaults'
import { writeHoursFile } from '@/lib/hours-store'
import type { HoursData } from '@/lib/hours-types'
import { mergeServicesData } from '@/lib/services-defaults'
import { writeServicesFile } from '@/lib/services-store'
import type { ServicesData } from '@/lib/services-types'
import { mergeStoreData } from '@/lib/store-defaults'
import { writeStoreFile } from '@/lib/store-store'
import type { StoreData } from '@/lib/store-types'
import { mergeStoryData } from '@/lib/story-defaults'
import { writeStoryFile } from '@/lib/story-store'
import type { StoryData } from '@/lib/story-types'
import { mergeTestimonialsData } from '@/lib/testimonials-defaults'
import { writeTestimonialsFile } from '@/lib/testimonials-store'
import type { TestimonialsData } from '@/lib/testimonials-types'

export {
  CMS_AUDIT_RESOURCES,
  CMS_AUDIT_RESOURCE_LABEL,
  isCmsAuditResource,
  type CmsAuditListEntry,
  type CmsAuditResource,
} from '@/lib/cms-audit-types'

function stripUndefinedDeep(v: unknown): unknown {
  if (v === undefined) return undefined
  if (v === null || typeof v !== 'object') return v
  if (Array.isArray(v)) {
    return v.map(stripUndefinedDeep).filter((x) => x !== undefined)
  }
  const out: Record<string, unknown> = {}
  for (const [k, val] of Object.entries(v as Record<string, unknown>)) {
    if (val === undefined) continue
    const next = stripUndefinedDeep(val)
    if (next !== undefined) out[k] = next
  }
  return out
}

function toIso(t: unknown): string | null {
  if (!t) return null
  if (t instanceof Timestamp) return t.toDate().toISOString()
  if (typeof (t as { toDate?: () => Date }).toDate === 'function') {
    try {
      return (t as Timestamp).toDate().toISOString()
    } catch {
      return null
    }
  }
  return null
}

/**
 * Append an audit row (Firestore only). Never throws — failures are logged and CMS saves still succeed.
 */
export async function recordCmsAuditEntry(
  resource: CmsAuditResource,
  previousData: unknown,
  newData: unknown,
): Promise<void> {
  const db = getFirestoreDb()
  if (!db) return
  try {
    const col = db.collection(getAuditCollectionId())
    const prev = stripUndefinedDeep(JSON.parse(JSON.stringify(previousData)))
    const next = stripUndefinedDeep(JSON.parse(JSON.stringify(newData)))
    await col.add({
      createdAt: FieldValue.serverTimestamp(),
      resource,
      previousData: prev,
      newData: next,
      revertedAt: null,
    })
  } catch (e) {
    console.warn('[cms-audit] Failed to record audit entry:', e instanceof Error ? e.message : e)
  }
}

async function applyCmsResourceSnapshot(resource: CmsAuditResource, snapshot: unknown): Promise<void> {
  switch (resource) {
    case 'shop':
      await writeStoreFile(mergeStoreData(snapshot as Partial<StoreData> | null))
      return
    case 'gallery':
      await writeGalleryFile(mergeGalleryData(snapshot as Partial<GalleryData> | null))
      return
    case 'services':
      await writeServicesFile(mergeServicesData(snapshot as Partial<ServicesData> | null))
      return
    case 'faq':
      await writeFaqFile(mergeFaqData(snapshot as Partial<FaqData> | null))
      return
    case 'hero':
      await writeHeroFile(mergeHeroData(snapshot as Partial<HeroData> | null))
      return
    case 'testimonials':
      await writeTestimonialsFile(mergeTestimonialsData(snapshot as Partial<TestimonialsData> | null))
      return
    case 'story':
      await writeStoryFile(mergeStoryData(snapshot as Partial<StoryData> | null))
      return
    case 'contact':
      await writeContactFile(mergeContactData(snapshot as Partial<ContactData> | null))
      return
    case 'hours':
      await writeHoursFile(mergeHoursData(snapshot as Partial<HoursData> | null))
      return
    case 'announcement':
      await writeAnnouncementFile(mergeAnnouncementData(snapshot as Partial<AnnouncementData> | null))
      return
  }
}

export async function listCmsAuditEntries(limit = 100): Promise<CmsAuditListEntry[]> {
  const db = getFirestoreDb()
  if (!db) return []
  const snap = await db
    .collection(getAuditCollectionId())
    .orderBy('createdAt', 'desc')
    .limit(Math.min(Math.max(limit, 1), 200))
    .get()

  return snap.docs.map((doc) => {
    const d = doc.data()
    const resource = typeof d.resource === 'string' && isCmsAuditResource(d.resource) ? d.resource : 'shop'
    return {
      id: doc.id,
      resource,
      createdAt: toIso(d.createdAt),
      revertedAt: toIso(d.revertedAt),
      previousData: d.previousData,
      newData: d.newData,
    }
  })
}

export async function revertCmsAuditEntry(entryId: string): Promise<{ ok: true } | { ok: false; error: string }> {
  const db = getFirestoreDb()
  if (!db) return { ok: false, error: 'Firestore is not configured.' }

  const ref = db.collection(getAuditCollectionId()).doc(entryId)
  const snap = await ref.get()
  if (!snap.exists) return { ok: false, error: 'Audit entry not found.' }

  const data = snap.data()!
  if (data.revertedAt) return { ok: false, error: 'This change was already reverted.' }

  const resourceRaw = data.resource
  if (typeof resourceRaw !== 'string' || !isCmsAuditResource(resourceRaw)) {
    return { ok: false, error: 'Invalid audit resource.' }
  }
  const resource = resourceRaw
  const previous = data.previousData
  if (previous === undefined || previous === null) {
    return { ok: false, error: 'This entry has no stored previous state to restore.' }
  }

  try {
    await applyCmsResourceSnapshot(resource, previous)
    await ref.update({ revertedAt: FieldValue.serverTimestamp() })
    return { ok: true }
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : 'Revert failed.' }
  }
}
