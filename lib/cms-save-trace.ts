import type { CmsAuditResource } from '@/lib/cms-audit-types'
import { cmsDebugLog } from '@/lib/cms-debug-log'
import { getCmsCollectionId, isFirestorePersistenceEnabled } from '@/lib/firebase-admin'
import { revalidateCmsPublicPages } from '@/lib/revalidate-cms'

/** Log after a successful admin CMS write (all resources) and bust public page caches. */
export function traceCmsAdminSave(
  resource: CmsAuditResource,
  updatedAt: string,
  runId = 'post-fix',
): void {
  const revalidatedPaths = revalidateCmsPublicPages(resource)
  cmsDebugLog({
    location: 'lib/cms-save-trace.ts:traceCmsAdminSave',
    message: 'admin-save-complete',
    hypothesisId: 'A',
    runId,
    data: {
      resource,
      updatedAt,
      backend: isFirestorePersistenceEnabled() ? 'firestore' : 'file',
      collection: getCmsCollectionId(),
      revalidatedPaths,
    },
  })
}

/** Log homepage CMS read stamps (detect stale ISR vs fresh Firestore). */
export function traceHomeCmsRead(stamps: Record<string, string>): void {
  cmsDebugLog({
    location: 'lib/cms-save-trace.ts:traceHomeCmsRead',
    message: 'homepage-cms-read',
    hypothesisId: 'A',
    data: {
      stamps,
      backend: isFirestorePersistenceEnabled() ? 'firestore' : 'file',
      homeRendering: 'force-dynamic',
    },
  })
}

/** Log which backend served a CMS read. */
export function traceCmsRead(
  resource: string,
  source: 'firestore' | 'file' | 'none',
  updatedAt: string | undefined,
): void {
  cmsDebugLog({
    location: 'lib/cms-save-trace.ts:traceCmsRead',
    message: 'cms-read',
    hypothesisId: 'E',
    data: { resource, source, updatedAt: updatedAt ?? null },
  })
}
