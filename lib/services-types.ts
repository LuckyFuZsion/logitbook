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
   * Category icon image — site path (e.g. /icons/cylinder.webp) or https URL.
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
