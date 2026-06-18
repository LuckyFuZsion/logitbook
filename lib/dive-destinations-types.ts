export type DiveDestinationCountryCode = 'gb' | 'eg' | 'gd' | 'jm'

export interface DiveDestination {
  id: string
  destination: string
  countryCode: DiveDestinationCountryCode
  diveShop: string
  website: string
  accessibilityRating: 1 | 2 | 3 | 4 | 5
  /** Brief narrative shown below the accessibility star rating. */
  narrative: string
}

export interface DiveDestinationsData {
  intro: string[]
  destinations: DiveDestination[]
  updatedAt: string
}
