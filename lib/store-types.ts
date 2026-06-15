/** Shop catalogue category (managed in admin, stored in Firestore/file). */
export interface StoreCategory {
  id: string
  title: string
}

/** Persisted catalog shape (file or Firestore). */
export interface StoreProduct {
  id: string
  name: string
  /** Product copy shown on the shop cards */
  description: string
  /** Display price in GBP for UI and schema.org */
  price: number
  originalPrice?: number
  categoryId: string
  badge?: string
  /** Primary + optional extras — use Cloudinary `https://res.cloudinary.com/...` URLs */
  images: string[]
  /** Stripe Payment Link or Checkout URL for this SKU */
  stripeUrl: string
}

export interface StoreData {
  categories: StoreCategory[]
  products: StoreProduct[]
  updatedAt: string
}
