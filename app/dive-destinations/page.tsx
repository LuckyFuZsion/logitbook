import type { Metadata } from 'next'
import DiveDestinationsPageClient from '@/components/dive-destinations-page-client'
import { mergeDiveDestinationsData } from '@/lib/dive-destinations-defaults'
import { readDiveDestinationsFile } from '@/lib/dive-destinations-store'
import { buildPageMetadata } from '@/lib/seo-page-metadata'
import { metaDescription, ogDescription } from '@/lib/meta-utils'

export const dynamic = 'force-dynamic'

const DESTINATIONS_META =
  "Log-It's trusted accessible dive destinations - UK and international dive centres that genuinely deliver on accessibility, with fantastic teams and a true can-do attitude."

export const metadata: Metadata = buildPageMetadata({
  title: "Log-It's Trusted Dive Destinations",
  description: metaDescription(DESTINATIONS_META),
  ogDescription: ogDescription(DESTINATIONS_META),
  path: '/dive-destinations',
})

export default async function DiveDestinationsPage() {
  const raw = await readDiveDestinationsFile()
  const data = mergeDiveDestinationsData(raw)

  return <DiveDestinationsPageClient data={data} />
}
