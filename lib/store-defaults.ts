import type { StoreCategory, StoreData, StoreProduct } from '@/lib/store-types'

export const DEFAULT_CATEGORIES: StoreCategory[] = [
  { id: 'accessories', title: 'Accessories (dust caps)' },
  { id: 'logbook', title: 'Logbook (book)' },
]

export const DEFAULT_PRODUCTS: StoreProduct[] = [
  {
    id: 'logit-book-prestigious',
    name: 'LOG-IT The Prestigious Diving Logbook',
    price: 19.99,
    categoryId: 'logbook',
    badge: 'BESTSELLER',
    images: [
      'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/logit-book-ynPPMUFbMDkSzwdAcYPExi5AosXLz2.webp',
    ],
    description:
      'The professional diving logbook trusted by technical divers worldwide. Premium bound format for recording dives, depth profiles, and expedition notes. 20+ books qualify for wholesale pricing.',
    stripeUrl: 'https://buy.stripe.com/00g8yw5vdaC5bZK3cc',
    featuredOnHome: true,
  },
]

const LEGACY_CATEGORY_IDS: Record<string, string> = {
  logitbooks: 'logbook',
  general: 'accessories',
}

type RawStoreProduct = Partial<StoreProduct> & {
  category?: string
  categoryId?: string
}

function sanitizeCategory(c: StoreCategory): StoreCategory {
  return {
    id: c.id.trim(),
    title: c.title.trim(),
  }
}

function resolveCategoryId(
  raw: RawStoreProduct,
  categories: StoreCategory[],
): string {
  const ids = new Set(categories.map((c) => c.id))

  if (raw.categoryId && ids.has(raw.categoryId)) {
    return raw.categoryId
  }

  const legacy = raw.category?.trim()
  if (legacy) {
    const lower = legacy.toLowerCase()
    const byTitle = categories.find((c) => c.title.toLowerCase() === lower)
    if (byTitle) return byTitle.id
    if (ids.has(lower)) return lower
    const mapped = LEGACY_CATEGORY_IDS[lower]
    if (mapped && ids.has(mapped)) return mapped
  }

  return categories[0]?.id ?? DEFAULT_CATEGORIES[0].id
}

/** Strip legacy fields from older `data/store.json` saves. */
function sanitizeProduct(p: RawStoreProduct, categories: StoreCategory[]): StoreProduct {
  return {
    id: p.id!,
    name: p.name!,
    description: p.description!,
    price: p.price!,
    originalPrice: p.originalPrice,
    categoryId: resolveCategoryId(p, categories),
    badge: p.badge,
    images: p.images ?? [],
    stripeUrl: p.stripeUrl!,
    featuredOnHome: p.featuredOnHome,
  }
}

export function mergeStoreData(raw: Partial<StoreData> | null): StoreData {
  const categories =
    raw?.categories?.length && raw.categories.every((c) => c.id && c.title)
      ? raw.categories.map(sanitizeCategory)
      : DEFAULT_CATEGORIES

  const products = raw?.products?.length
    ? raw.products.map((p) => sanitizeProduct(p, categories))
    : DEFAULT_PRODUCTS.map((p) => sanitizeProduct(p, categories))

  return {
    categories,
    products,
    updatedAt: raw?.updatedAt ?? new Date(0).toISOString(),
  }
}
