import type { Metadata } from 'next'
import { mergeStoreData } from '@/lib/store-defaults'
import { readStoreFile } from '@/lib/store-store'
import { storeProductPrimaryImageUrl } from '@/lib/store-product-metadata'
import { siteUrl } from '@/lib/site-url'
import ShopPageClient from '@/components/shop-page-client'

export const dynamic = 'force-dynamic'

export async function generateMetadata(): Promise<Metadata> {
  const store = mergeStoreData(await readStoreFile())
  const primaryProduct = store.products[0]
  const ogImage = primaryProduct ? storeProductPrimaryImageUrl(primaryProduct) : undefined
  const canonical = `${siteUrl()}/shop`

  return {
    title: 'Shop | LOGITSHOP',
    description: 'Shop LOG-IT diving logbooks and scuba accessories from LOGITSHOP.',
    alternates: { canonical },
    openGraph: {
      title: 'Shop | LOGITSHOP',
      description: 'Shop LOG-IT diving logbooks and scuba accessories from LOGITSHOP.',
      url: canonical,
      siteName: 'LOGITSHOP',
      type: 'website',
      locale: 'en_GB',
      images: ogImage ? [{ url: ogImage, alt: primaryProduct?.name ?? 'LOGITSHOP shop' }] : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title: 'Shop | LOGITSHOP',
      description: 'Shop LOG-IT diving logbooks and scuba accessories from LOGITSHOP.',
      images: ogImage ? [ogImage] : undefined,
    },
    robots: { index: true, follow: true },
  }
}

export default function ShopPage() {
  return <ShopPageClient />
}
