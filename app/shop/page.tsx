import type { Metadata } from 'next'
import { mergeStoreData } from '@/lib/store-defaults'
import { readStoreFile } from '@/lib/store-store'
import { storeProductPrimaryImageUrl } from '@/lib/store-product-metadata'
import { buildPageMetadata } from '@/lib/seo-page-metadata'
import { metaDescription, ogDescription } from '@/lib/meta-utils'
import ShopPageClient from '@/components/shop-page-client'

export const dynamic = 'force-dynamic'

const SHOP_META =
  'Shop premium UK diving logbooks, regulator dust caps and scuba accessories at LOGITSHOP. IDEST-accredited servicing and dive gear shipped nationwide.'

export async function generateMetadata(): Promise<Metadata> {
  const store = mergeStoreData(await readStoreFile())
  const primaryProduct = store.products[0]
  const ogImage = primaryProduct ? storeProductPrimaryImageUrl(primaryProduct) : undefined

  return buildPageMetadata({
    title: 'Shop Diving Logbooks & Gear',
    description: metaDescription(SHOP_META),
    ogDescription: ogDescription(SHOP_META),
    path: '/shop',
    ogImagePath: ogImage,
  })
}

export default function ShopPage() {
  return <ShopPageClient />
}
