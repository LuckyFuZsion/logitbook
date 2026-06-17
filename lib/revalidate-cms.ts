import { revalidatePath } from 'next/cache'
import type { CmsAuditResource } from '@/lib/cms-audit-types'

const RESOURCE_PATHS: Record<CmsAuditResource, string[]> = {
  shop: ['/', '/shop'],
  gallery: ['/', '/gallery'],
  services: ['/', '/services'],
  faq: ['/', '/faq'],
  hero: ['/'],
  testimonials: ['/', '/testimonials'],
  story: ['/'],
  contact: ['/'],
  hours: ['/'],
  announcement: ['/'],
}

/** Bust Next.js caches for public pages affected by a CMS resource save. */
export function revalidateCmsPublicPages(resource: CmsAuditResource): string[] {
  const paths = new Set<string>(['/', ...RESOURCE_PATHS[resource]])
  for (const path of paths) {
    revalidatePath(path, path === '/' ? 'layout' : 'page')
  }
  return [...paths]
}
