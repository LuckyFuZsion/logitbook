export type { DiveDestination, DiveDestinationCountryCode, DiveDestinationsData } from '@/lib/dive-destinations-types'
export { DEFAULT_DIVE_DESTINATIONS_DATA, mergeDiveDestinationsData } from '@/lib/dive-destinations-defaults'

export function diveDestinationWebsiteLabel(url: string): string {
  return url.replace(/^https?:\/\/(www\.)?/i, '').replace(/\/$/, '')
}

export function diveDestinationMapImageSrc(id: string): string {
  return `/dive-destinations/${id}.webp`
}
