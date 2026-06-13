import type { Metadata } from 'next'
import type { StoreProduct } from '@/lib/store-types'
import { siteUrl } from '@/lib/site-url'

/** Resolve a catalogue image URL to an absolute URL for Open Graph / Twitter cards. */
export function storeProductPrimaryImageUrl(product: StoreProduct, baseUrl = siteUrl()): string | undefined {
  const primary = product.images.find((src) => src.trim().length > 0)
  if (!primary) return undefined
  if (/^https?:\/\//i.test(primary)) return primary
  const path = primary.startsWith('/') ? primary : `/${primary}`
  return `${baseUrl.replace(/\/+$/, '')}${path}`
}

export function buildStoreProductMetadata(product: StoreProduct): Metadata {
  const baseUrl = siteUrl()
  const canonical = `${baseUrl}/shop/${encodeURIComponent(product.id)}`
  const title = product.name.trim()
  const description = product.description.trim()
  const ogImage = storeProductPrimaryImageUrl(product, baseUrl)

  return {
    title: `${title} | Shop | LOGITSHOP`,
    description,
    alternates: { canonical },
    keywords: [product.category, product.name, 'LOGITSHOP', 'shop'].filter(Boolean),
    openGraph: {
      title,
      description,
      url: canonical,
      siteName: 'LOGITSHOP',
      type: 'website',
      locale: 'en_GB',
      images: ogImage
        ? [
            {
              url: ogImage,
              alt: title,
            },
          ]
        : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: ogImage ? [ogImage] : undefined,
    },
    robots: { index: true, follow: true },
  }
}

export function buildStoreProductNotFoundMetadata(): Metadata {
  return {
    title: 'Product not found | LOGITSHOP',
    robots: { index: false, follow: false },
  }
}
