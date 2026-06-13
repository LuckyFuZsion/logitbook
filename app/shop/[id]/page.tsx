import { notFound } from 'next/navigation'
import { mergeStoreData } from '@/lib/store-defaults'
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
  const product = await getProduct(id)
  if (!product) return buildStoreProductNotFoundMetadata()
  return buildStoreProductMetadata(product)
}

export default async function ShopProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const raw = await readStoreFile()
  const store = mergeStoreData(raw)
  const product = store.products.find((p) => p.id === id) ?? null
  if (!product) notFound()

  const otherProducts = store.products.filter((p) => p.id !== id)

  return (
    <ShopPageShell>
      <ShopProductView product={product} otherProducts={otherProducts} />
    </ShopPageShell>
  )
}
