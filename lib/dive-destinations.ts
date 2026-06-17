export type DiveDestinationCountryCode = 'gb' | 'eg' | 'gd' | 'jm'

export interface DiveDestination {
  id: string
  destination: string
  countryCode: DiveDestinationCountryCode
  diveShop: string
  website: string
  accessibilityRating: 1 | 2 | 3 | 4 | 5
}

export const DIVE_DESTINATIONS_INTRO = [
  'The Log-It family has been lucky enough to dive in a wide range of locations around the world. Accessibility is incredibly important to us, and while many dive destinations claim to be accessible, the reality often doesn’t match the promise.',
  'That’s why we’re proud to share a list of UK and international dive destinations that genuinely deliver on accessibility. These are places that not only provide suitable facilities, but are also run by fantastic teams with a true ‘can-do’ attitude and a commitment to making diving open to everyone!',
] as const

export const DIVE_DESTINATIONS: DiveDestination[] = [
  {
    id: 'plymouth',
    destination: 'Plymouth',
    countryCode: 'gb',
    diveShop: 'In Deep Dive Centre',
    website: 'https://www.indeep.co.uk',
    accessibilityRating: 4,
  },
  {
    id: 'sharm-el-sheikh',
    destination: 'Sharm El Sheikh',
    countryCode: 'eg',
    diveShop: 'Camel Dive Club and Hotel',
    website: 'https://www.cameldive.com',
    accessibilityRating: 5,
  },
  {
    id: 'grenada',
    destination: 'Grenada',
    countryCode: 'gd',
    diveShop: 'Aquanauts',
    website: 'https://www.aquanautsgrenada.com',
    accessibilityRating: 5,
  },
  {
    id: 'negril',
    destination: 'Negril',
    countryCode: 'jm',
    diveShop: 'Scuba Caribe',
    website: 'https://www.scubacaribe.com/watersport-centers/scubacaribe-riu-tropical-bay/',
    accessibilityRating: 4,
  },
]

export function diveDestinationWebsiteLabel(url: string): string {
  return url.replace(/^https?:\/\/(www\.)?/i, '').replace(/\/$/, '')
}

export function diveDestinationMapImageSrc(id: string): string {
  return `/dive-destinations/${id}.webp`
}
