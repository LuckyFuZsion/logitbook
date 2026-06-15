import type { StoreProduct } from '@/lib/store-types'
import { siteUrl } from '@/lib/site-url'

export function absoluteAssetUrl(src: string, base = siteUrl()): string {
  if (/^https?:\/\//i.test(src)) return src
  const path = src.startsWith('/') ? src : `/${src}`
  return `${base.replace(/\/+$/, '')}${path}`
}

export function productSchemaOffer(product: StoreProduct, offerUrl: string) {
  return {
    '@type': 'Offer',
    price: product.price.toFixed(2),
    priceCurrency: 'GBP',
    availability: 'https://schema.org/InStock',
    url: offerUrl,
  }
}

export function buildProductSchemaItem(
  product: StoreProduct,
  pageUrl: string,
  offerUrl = pageUrl,
) {
  const images = product.images.filter(Boolean).map((src) => absoluteAssetUrl(src))
  return {
    '@type': 'Product',
    name: product.name,
    description: product.description,
    ...(images.length > 0 ? { image: images } : {}),
    url: pageUrl,
    offers: productSchemaOffer(product, offerUrl),
  }
}

export function buildProductSchema(
  product: StoreProduct,
  pageUrl: string,
  offerUrl = pageUrl,
) {
  return {
    '@context': 'https://schema.org',
    ...buildProductSchemaItem(product, pageUrl, offerUrl),
  }
}

export function buildServiceCatalogSchema(base = siteUrl()) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: 'IDEST Accredited Scuba Equipment Servicing',
    serviceType: 'Scuba Equipment Maintenance and Servicing',
    url: `${base}/services`,
    provider: {
      '@type': 'LocalBusiness',
      name: 'LOGITSHOP',
      url: base,
    },
    areaServed: {
      '@type': 'Country',
      name: 'United Kingdom',
    },
  }
}
