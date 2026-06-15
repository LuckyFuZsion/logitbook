import { notFound } from 'next/navigation'
import { mergeStoreData } from '@/lib/store-defaults'
import { getCategoryTitle } from '@/lib/store-category-utils'
import { readStoreFile } from '@/lib/store-store'
import type { StoreProduct } from '@/lib/store-types'
import {
  buildStoreProductMetadata,
  buildStoreProductNotFoundMetadata,
} from '@/lib/store-product-metadata'
import { ShopPageShell } from '@/components/shop-page-shell'
import { ShopProductView } from '@/components/shop-product-view'

export const dynamic = 'force-dynamic'

async function getProduct(id: string): Promise<StoreProduct | null> {
  const raw = await readStoreFile()
  const store = mergeStoreData(raw)
  return store.products.find((p) => p.id === id) ?? null
}

export async function generateStaticParams() {
  const raw = await readStoreFile()
  const store = mergeStoreData(raw)
  return store.products.map((p) => ({ id: p.id }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const raw = await readStoreFile()
  const store = mergeStoreData(raw)
  const product = store.products.find((p) => p.id === id) ?? null
  if (!product) return buildStoreProductNotFoundMetadata()
  const categoryTitle = getCategoryTitle(store.categories, product.categoryId)
  return buildStoreProductMetadata(product, categoryTitle)
}

export default async function ShopProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const raw = await readStoreFile()
  const store = mergeStoreData(raw)
  const product = store.products.find((p) => p.id === id) ?? null
  if (!product) notFound()

  const otherProducts = store.products.filter((p) => p.id !== id)
  const categoryTitle = getCategoryTitle(store.categories, product.categoryId)

  return (
    <ShopPageShell>
      <ShopProductView product={product} categoryTitle={categoryTitle} otherProducts={otherProducts} />
    </ShopPageShell>
  )
}
