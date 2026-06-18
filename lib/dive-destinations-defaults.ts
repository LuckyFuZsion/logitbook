import type { DiveDestinationsData } from '@/lib/dive-destinations-types'

export const DEFAULT_DIVE_DESTINATIONS_DATA: DiveDestinationsData = {
  intro: [
    'The Log-It family has been lucky enough to dive in a wide range of locations around the world. Accessibility is incredibly important to us, and while many dive destinations claim to be accessible, the reality often doesn’t match the promise.',
    'That’s why we’re proud to share a list of UK and international dive destinations that genuinely deliver on accessibility. These are places that not only provide suitable facilities, but are also run by fantastic teams with a true ‘can-do’ attitude and a commitment to making diving open to everyone!',
  ],
  destinations: [
    {
      id: 'plymouth',
      destination: 'Plymouth',
      countryCode: 'gb',
      diveShop: 'In Deep Dive Centre',
      website: 'https://www.indeep.co.uk',
      accessibilityRating: 4,
      narrative: '',
    },
    {
      id: 'sharm-el-sheikh',
      destination: 'Sharm El Sheikh',
      countryCode: 'eg',
      diveShop: 'Camel Dive Club and Hotel',
      website: 'https://www.cameldive.com',
      accessibilityRating: 5,
      narrative: '',
    },
    {
      id: 'grenada',
      destination: 'Grenada',
      countryCode: 'gd',
      diveShop: 'Aquanauts',
      website: 'https://www.aquanautsgrenada.com',
      accessibilityRating: 5,
      narrative: '',
    },
    {
      id: 'negril',
      destination: 'Negril',
      countryCode: 'jm',
      diveShop: 'Scuba Caribe',
      website: 'https://www.scubacaribe.com/watersport-centers/scubacaribe-riu-tropical-bay/',
      accessibilityRating: 4,
      narrative: '',
    },
  ],
  updatedAt: new Date(0).toISOString(),
}

function mergeDestination(
  base: DiveDestinationsData['destinations'][number],
  raw: Partial<DiveDestinationsData['destinations'][number]> | undefined,
) {
  if (!raw) return { ...base }
  return {
    ...base,
    ...raw,
    id: base.id,
    narrative: typeof raw.narrative === 'string' ? raw.narrative : base.narrative,
  }
}

export function mergeDiveDestinationsData(
  raw: Partial<DiveDestinationsData> | null | undefined,
): DiveDestinationsData {
  const defaults = DEFAULT_DIVE_DESTINATIONS_DATA
  const rawById = new Map((raw?.destinations ?? []).map((d) => [d.id, d]))

  return {
    intro:
      Array.isArray(raw?.intro) && raw.intro.length > 0
        ? raw.intro.map((p) => p.trim()).filter(Boolean)
        : [...defaults.intro],
    destinations: defaults.destinations.map((base) => mergeDestination(base, rawById.get(base.id))),
    updatedAt: raw?.updatedAt ?? defaults.updatedAt,
  }
}
