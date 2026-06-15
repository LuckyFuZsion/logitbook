import type { Metadata } from 'next'
import {
  SITE_OG_DESCRIPTION,
  SITE_OG_IMAGE_ALT,
  SITE_OG_IMAGE_HEIGHT,
  SITE_OG_IMAGE_PATH,
  SITE_OG_IMAGE_WIDTH,
} from '@/lib/site-seo'
import { siteUrl } from '@/lib/site-url'

export function buildPageMetadata({
  title,
  description,
  ogDescription,
  path,
  ogImagePath = SITE_OG_IMAGE_PATH,
}: {
  title: string
  /** Meta description for search (≤ ~155 chars). */
  description: string
  /** Open Graph / Twitter description (≤ ~125 chars). Defaults to trimmed meta description. */
  ogDescription?: string
  path: string
  ogImagePath?: string
}): Metadata {
  const baseUrl = siteUrl()
  const canonical = `${baseUrl}${path.startsWith('/') ? path : `/${path}`}`
  const ogImage = ogImagePath.startsWith('http')
    ? ogImagePath
    : `${baseUrl}${ogImagePath.startsWith('/') ? ogImagePath : `/${ogImagePath}`}`
  const socialDescription = ogDescription ?? description

  return {
    title,
    description,
    alternates: { canonical },
    openGraph: {
      title,
      description: socialDescription,
      url: canonical,
      siteName: 'LOGITSHOP',
      type: 'website',
      locale: 'en_GB',
      images: [
        {
          url: ogImage,
          width: SITE_OG_IMAGE_WIDTH,
          height: SITE_OG_IMAGE_HEIGHT,
          alt: SITE_OG_IMAGE_ALT,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description: socialDescription,
      images: [ogImage],
    },
    robots: { index: true, follow: true },
  }
}
