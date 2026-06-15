import type { Metadata } from 'next'
import type { StoreProduct } from '@/lib/store-types'
import { metaDescription, ogDescription, pageTitleSegment } from '@/lib/meta-utils'
import { siteUrl } from '@/lib/site-url'

/** Resolve a catalogue image URL to an absolute URL for Open Graph / Twitter cards. */
export function storeProductPrimaryImageUrl(product: StoreProduct, baseUrl = siteUrl()): string | undefined {
  const primary = product.images.find((src) => src.trim().length > 0)
  if (!primary) return undefined
  if (/^https?:\/\//i.test(primary)) return primary
  const path = primary.startsWith('/') ? primary : `/${primary}`
  return `${baseUrl.replace(/\/+$/, '')}${path}`
}

export function buildStoreProductMetadata(product: StoreProduct, categoryTitle?: string): Metadata {
  const baseUrl = siteUrl()
  const canonical = `${baseUrl}/shop/${encodeURIComponent(product.id)}`
  const title = pageTitleSegment(`${product.name} | Shop`, 48)
  const description = metaDescription(product.description)
  const socialDescription = ogDescription(product.description)
  const ogImage = storeProductPrimaryImageUrl(product, baseUrl)
  const categoryKeyword = categoryTitle ?? product.categoryId

  return {
    title,
    description,
    alternates: { canonical },
    keywords: [categoryKeyword, product.name, 'LOGITSHOP', 'shop'].filter(Boolean),
    openGraph: {
      title,
      description: socialDescription,
      url: canonical,
      siteName: 'LOGITSHOP',
      type: 'website',
      locale: 'en_GB',
      images: ogImage
        ? [
            {
              url: ogImage,
              alt: product.name,
            },
          ]
        : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description: socialDescription,
      images: ogImage ? [ogImage] : undefined,
    },
    robots: { index: true, follow: true },
  }
}

export function buildStoreProductNotFoundMetadata(): Metadata {
  return {
    title: 'Product not found',
    robots: { index: false, follow: false },
  }
}
