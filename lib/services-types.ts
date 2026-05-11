export interface ServiceItem {
  id: string
  name: string
  /** null = "Price on request" */
  standard: number | null
  /** null = "Price on request" */
  member: number | null
  note?: string
}

export interface ServiceCategory {
  id: string
  title: string
  /**
   * Lucide icon name: 'Droplet' | 'Wrench' | 'Zap' | 'LifeBuoy' | 'Shield' |
   * 'Cpu' | 'Settings' | 'Anchor' | 'Compass' | 'Star'
   */
  icon: string
  description: string
  services: ServiceItem[]
}

export interface ServicesData {
  categories: ServiceCategory[]
  vatNote: string
  membersNote: string
  clubUrl: string
  clubName: string
  updatedAt: string
}
