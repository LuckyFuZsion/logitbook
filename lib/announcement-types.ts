export type AnnouncementStyle = 'info' | 'warning' | 'promo'

export interface AnnouncementData {
  enabled: boolean
  message: string
  link: string
  linkText: string
  style: AnnouncementStyle
  /** ISO date string or empty — banner auto-hides after this date */
  expiresAt: string
  updatedAt: string
}
