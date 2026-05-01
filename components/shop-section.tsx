'use client'

import { useState } from 'react'
import { ShoppingCart, Star, BadgeCheck, Filter } from 'lucide-react'

export interface Product {
  id: number
  name: string
  price: number
  originalPrice?: number
  rating: number
  reviews: number
  category: string
  badge?: string
  image: string
  description: string
}

const PRODUCTS: Product[] = [
  {
    id: 1,
    name: 'LOG-IT The Prestigious Diving Logbook',
    price: 19.99,
    rating: 5.0,
    reviews: 387,
    category: 'Logitbooks',
    badge: 'BESTSELLER',
    image: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/logit-book-ynPPMUFbMDkSzwdAcYPExi5AosXLz2.webp',
    description: 'The professional diving logbook trusted by technical divers worldwide. Premium bound format for recording dives, depth profiles, and expedition notes. 20+ books qualify for wholesale pricing.',
  },
]

const CATEGORIES = ['Logitbooks']

interface ShopSectionProps {
  onAddToCart: (product: Product) => void
  cartItems: number[]
  bgClassName?: string
}

export default function ShopSection({ onAddToCart, cartItems, bgClassName = 'bg-background' }: ShopSectionProps) {
  const [addedIds, setAddedIds] = useState<number[]>([])

  const filtered = PRODUCTS

  const handleAdd = (product: Product) => {
    onAddToCart(product)
    setAddedIds((prev) => [...prev, product.id])
    setTimeout(() => {
      setAddedIds((prev) => prev.filter((id) => id !== product.id))
    }, 1500)
  }

  return (
    <section
      id="shop"
      className={`min-h-screen ${bgClassName} py-20 px-4`}
      aria-labelledby="shop-heading"
    >
      {/* JSON-LD: ItemList */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'ItemList',
            name: 'Logitshop Products',
            itemListElement: PRODUCTS.map((p, i) => ({
              '@type': 'ListItem',
              position: i + 1,
              item: {
                '@type': 'Product',
                name: p.name,
                description: p.description,
                offers: {
                  '@type': 'Offer',
                  price: p.price,
                  priceCurrency: 'GBP',
                  availability: 'https://schema.org/InStock',
                  url: 'https://buy.stripe.com/00g8yw5vdaC5bZK3cc',
                },
              },
            })),
          }),
        }}
      />

      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-12">
          <p
            className="text-xs font-semibold tracking-[0.3em] uppercase text-[var(--brand-red)] mb-3"
            style={{ fontFamily: 'var(--font-rajdhani)' }}
          >
            Premium Catalogue
          </p>
          <h2
            id="shop-heading"
            className="text-4xl md:text-5xl font-black text-white mb-4 text-balance"
            style={{ fontFamily: 'var(--font-orbitron)' }}
          >
            DIVING <span className="text-[var(--brand-red)]">GEAR</span>
          </h2>
          <div className="w-16 h-0.5 bg-[var(--brand-red)] mx-auto" style={{ boxShadow: '0 0 10px var(--brand-red-glow)' }} aria-hidden="true" />
        </div>

        {/* Category Filter */}
        <div className="text-center mb-10">
          <p className="text-white/60 text-sm">Available exclusively through Logitshop</p>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6" role="list">
          {filtered.map((product) => {
            return (
              <article
                key={product.id}
                className="glass-card group relative flex flex-col overflow-hidden border border-[var(--charcoal-light)] hover:border-[var(--brand-red)]/50 transition-all duration-300"
                role="listitem"
              >

                {/* Image */}
                <div className="relative overflow-hidden aspect-video bg-[var(--charcoal)] flex items-center justify-center">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" aria-hidden="true" />
                </div>

                {/* Info */}
                <div className="flex flex-col flex-1 p-4 gap-3">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="text-[10px] font-semibold tracking-widest uppercase text-[var(--brand-red)] mb-1">
                        {product.category}
                      </p>
                      <h3
                        className="text-base font-bold text-white leading-tight"
                        style={{ fontFamily: 'var(--font-orbitron)' }}
                      >
                        {product.name}
                      </h3>
                    </div>
                    <BadgeCheck size={16} className="text-[var(--brand-red)] mt-1 shrink-0" aria-label="Verified product" />
                  </div>

                  <p className="text-sm text-white/60 leading-relaxed">{product.description}</p>

                  {/* Rating */}
                  <div className="flex items-center gap-1.5" aria-label={`Rating: ${product.rating} out of 5`}>
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        size={12}
                        className={i < Math.floor(product.rating) ? 'text-[var(--brand-red)] fill-[var(--brand-red)]' : 'text-white/20'}
                        aria-hidden="true"
                      />
                    ))}
                    <span className="text-xs text-white/50 ml-1">({product.reviews})</span>
                  </div>

                  {/* Price & CTA */}
                  <div className="flex items-center justify-between mt-auto pt-2 border-t border-[var(--charcoal-light)]">
                    <div className="flex items-baseline gap-2">
                      <span
                        className="text-xl font-black text-white"
                        style={{ fontFamily: 'var(--font-orbitron)' }}
                      >
                        £{product.price.toFixed(2)}
                      </span>
                      <span className="text-xs text-white/50">+ VAT & delivery</span>
                    </div>
                    <a
                      href="https://buy.stripe.com/00g8yw5vdaC5bZK3cc"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold tracking-widest uppercase bg-[var(--brand-red)] hover:bg-red-600 text-white transition-all duration-200 hover:glow-red"
                      style={{ fontFamily: 'var(--font-orbitron)' }}
                      aria-label={`Buy ${product.name}`}
                    >
                      <ShoppingCart size={13} aria-hidden="true" />
                      Buy Now
                    </a>
                  </div>

                  {/* Wholesale Note */}
                  <p className="text-[10px] text-white/50 pt-2 border-t border-[var(--charcoal-light)]">
                    20+ books qualify for wholesale pricing. Contact us for details.
                  </p>
                </div>
              </article>
            )
          })}
        </div>
      </div>
    </section>
  )
}
