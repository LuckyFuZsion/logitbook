export const CMS_AUDIT_RESOURCES = [
  'shop',
  'gallery',
  'services',
  'faq',
  'hero',
  'testimonials',
  'story',
  'contact',
  'hours',
  'announcement',
] as const

export type CmsAuditResource = (typeof CMS_AUDIT_RESOURCES)[number]

export function isCmsAuditResource(s: string): s is CmsAuditResource {
  return (CMS_AUDIT_RESOURCES as readonly string[]).includes(s)
}

export const CMS_AUDIT_RESOURCE_LABEL: Record<CmsAuditResource, string> = {
  shop: 'Shop',
  gallery: 'Gallery',
  services: 'Services',
  faq: 'FAQs',
  hero: 'Hero',
  testimonials: 'Reviews',
  story: 'Our story',
  contact: 'Contact',
  hours: 'Business hours',
  announcement: 'Announcement',
}

export interface CmsAuditListEntry {
  id: string
  resource: CmsAuditResource
  createdAt: string | null
  revertedAt: string | null
  previousData: unknown
  newData: unknown
}
