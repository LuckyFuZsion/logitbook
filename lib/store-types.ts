/** Persisted catalog shape (file or future Firestore). */
export interface StoreProduct {
  id: string
  name: string
  /** Product copy shown on the shop cards */
  description: string
  /** Display price in GBP for UI and schema.org */
  price: number
  originalPrice?: number
  category: string
  badge?: string
  /** Primary + optional extras — use Cloudinary `https://res.cloudinary.com/...` URLs */
  images: string[]
  /** Stripe Payment Link or Checkout URL for this SKU */
  stripeUrl: string
}

export interface StoreData {
  products: StoreProduct[]
  updatedAt: string
}
