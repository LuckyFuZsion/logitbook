import type { StoreData, StoreProduct } from '@/lib/store-types'

export const DEFAULT_PRODUCTS: StoreProduct[] = [
  {
    id: 'logit-book-prestigious',
    name: 'LOG-IT The Prestigious Diving Logbook',
    price: 19.99,
    category: 'Logitbooks',
    badge: 'BESTSELLER',
    images: [
      'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/logit-book-ynPPMUFbMDkSzwdAcYPExi5AosXLz2.webp',
    ],
    description:
      'The professional diving logbook trusted by technical divers worldwide. Premium bound format for recording dives, depth profiles, and expedition notes. 20+ books qualify for wholesale pricing.',
    stripeUrl: 'https://buy.stripe.com/00g8yw5vdaC5bZK3cc',
  },
]

/** Strip legacy fields from older `data/store.json` saves. */
function sanitizeProduct(p: StoreProduct): StoreProduct {
  return {
    id: p.id,
    name: p.name,
    description: p.description,
    price: p.price,
    originalPrice: p.originalPrice,
    category: p.category,
    badge: p.badge,
    images: p.images,
    stripeUrl: p.stripeUrl,
  }
}

export function mergeStoreData(raw: Partial<StoreData> | null): StoreData {
  const products = raw?.products?.length ? raw.products.map(sanitizeProduct) : DEFAULT_PRODUCTS
  return {
    products,
    updatedAt: raw?.updatedAt ?? new Date(0).toISOString(),
  }
}
