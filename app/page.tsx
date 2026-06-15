import type { Metadata } from 'next'
import HomePageClient from '@/components/home-page-client'
import { loadHomeCmsData } from '@/lib/home-cms'
import { buildPageMetadata } from '@/lib/seo-page-metadata'
import { SITE_DESCRIPTION, SITE_TITLE } from '@/lib/site-seo'

/** Regenerate homepage when CMS data changes (shop, FAQ, etc.). */
export const revalidate = 300

export const metadata: Metadata = buildPageMetadata({
  title: SITE_TITLE,
  description: SITE_DESCRIPTION,
  path: '/',
})

export default async function HomePage() {
  const cms = await loadHomeCmsData()
  return <HomePageClient cms={cms} />
}
