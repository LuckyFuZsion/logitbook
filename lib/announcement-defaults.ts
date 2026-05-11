import type { AnnouncementData } from '@/lib/announcement-types'

export const DEFAULT_ANNOUNCEMENT: AnnouncementData = {
  enabled: false,
  message: '',
  link: '',
  linkText: '',
  style: 'info',
  expiresAt: '',
  updatedAt: new Date(0).toISOString(),
}

export function mergeAnnouncementData(
  raw: Partial<AnnouncementData> | null | undefined,
): AnnouncementData {
  if (!raw) return { ...DEFAULT_ANNOUNCEMENT }
  return { ...DEFAULT_ANNOUNCEMENT, ...raw }
}
