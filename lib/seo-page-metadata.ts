import type { Metadata } from 'next'
import { SITE_OG_IMAGE_ALT, SITE_OG_IMAGE_PATH } from '@/lib/site-seo'
import { siteUrl } from '@/lib/site-url'

export function buildPageMetadata({
  title,
  description,
  path,
  ogImagePath = SITE_OG_IMAGE_PATH,
}: {
  title: string
  description: string
  path: string
  ogImagePath?: string
}): Metadata {
  const baseUrl = siteUrl()
  const canonical = `${baseUrl}${path.startsWith('/') ? path : `/${path}`}`
  const ogImage = ogImagePath.startsWith('http')
    ? ogImagePath
    : `${baseUrl}${ogImagePath.startsWith('/') ? ogImagePath : `/${ogImagePath}`}`

  return {
    title,
    description,
    alternates: { canonical },
    openGraph: {
      title,
      description,
      url: canonical,
      siteName: 'LOGITSHOP',
      type: 'website',
      locale: 'en_GB',
      images: [{ url: ogImage, alt: SITE_OG_IMAGE_ALT }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [ogImage],
    },
    robots: { index: true, follow: true },
  }
}
