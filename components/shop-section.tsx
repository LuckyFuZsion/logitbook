'use client'

import { useState, useEffect } from 'react'
import { ShoppingCart, BadgeCheck } from 'lucide-react'
import type { StoreProduct } from '@/lib/store-types'

/** Normalized for UI (primary image convenience field). */
export type Product = StoreProduct & { image: string }

interface ShopSectionProps {
  bgClassName?: string
}

function normalizeProducts(raw: StoreProduct[]): Product[] {
  return raw.map((p) => ({
    ...p,
    image: p.images[0] ?? '',
  }))
}

function isPrestigiousLogbook(product: Product): boolean {
  return product.id === 'logit-book-prestigious'
}

export default function ShopSection({ bgClassName = 'bg-background' }: ShopSectionProps) {
  const [products, setProducts] = useState<Product[]>([])
  const [loadError, setLoadError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    fetch('/api/shop')
      .then((r) => {
        if (!r.ok) throw new Error('Could not load shop')
        return r.json()
      })
      .then((json: { products: StoreProduct[] }) => {
        if (!cancelled) setProducts(normalizeProducts(json.products ?? []))
      })
      .catch(() => {
        if (!cancelled) setLoadError('Shop catalogue could not be loaded.')
      })
    return () => {
      cancelled = true
    }
  }, [])

  const filtered = products

  return (
    <section
      id="shop"
      className={`min-h-screen ${bgClassName} py-20 px-4`}
      aria-labelledby="shop-heading"
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'ItemList',
            name: 'Logitshop Products',
            itemListElement: filtered.map((p, i) => ({
              '@type': 'ListItem',
              position: i + 1,
              item: {
                '@type': 'Product',
                name: p.name,
                description: p.description,
                image: p.images,
                offers: {
                  '@type': 'Offer',
                  price: p.price,
                  priceCurrency: 'GBP',
                  availability: 'https://schema.org/InStock',
                  url: p.stripeUrl,
                },
              },
            })),
          }),
        }}
      />

      <div className="max-w-7xl mx-auto">
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

        <div className="text-center mb-10">
          <p className="text-white/60 text-sm">Available exclusively through Logitshop</p>
        </div>

        {loadError && (
          <p className="text-center text-red-400 text-sm mb-8" role="alert">
            {loadError}
          </p>
        )}

        {!loadError && filtered.length === 0 && (
          <p className="text-center text-white/50 text-sm">No products configured.</p>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6" role="list">
          {filtered.map((product) => (
              <article
                key={product.id}
                className="glass-card group relative flex flex-col overflow-hidden border border-[var(--charcoal-light)] hover:border-[var(--brand-red)]/50 transition-all duration-300"
                role="listitem"
              >
                <div className="relative overflow-hidden aspect-video bg-[var(--charcoal)] flex items-center justify-center">
                  {product.badge && (
                    <span
                      className="absolute top-2 left-2 z-10 px-2 py-1 text-[9px] font-bold tracking-widest uppercase bg-[var(--brand-red)] text-white"
                      style={{ fontFamily: 'var(--font-orbitron)' }}
                    >
                      {product.badge}
                    </span>
                  )}
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" aria-hidden="true" />
                  {product.images.length > 1 && (
                    <span
                      className="absolute bottom-2 right-2 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-black/70 text-white/90 border border-white/10"
                      style={{ fontFamily: 'var(--font-orbitron)' }}
                      aria-hidden="true"
                    >
                      +{product.images.length - 1} photos
                    </span>
                  )}
                </div>

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

                  <div className="mt-auto pt-2 border-t border-[var(--charcoal-light)] space-y-2">
                    {isPrestigiousLogbook(product) && (
                      <p className="text-[10px] text-white/50">
                        20+ books qualify for wholesale pricing. Contact us for details.
                      </p>
                    )}
                    <div className="flex items-center justify-between flex-wrap gap-2">
                      <div className="flex items-baseline gap-2">
                        <span className="text-xl font-black text-white" style={{ fontFamily: 'var(--font-orbitron)' }}>
                          £{product.price.toFixed(2)}
                        </span>
                        {product.originalPrice != null && product.originalPrice > product.price && (
                          <span className="text-xs text-white/40 line-through">
                            £{product.originalPrice.toFixed(2)}
                          </span>
                        )}
                        <span className="text-xs text-white/50">+ VAT & delivery</span>
                      </div>
                      <a
                        href={product.stripeUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold tracking-widest uppercase bg-[var(--brand-red)] hover:bg-red-600 text-white transition-all duration-200 hover:glow-red"
                        style={{ fontFamily: 'var(--font-orbitron)' }}
                        aria-label={`Buy ${product.name} on Stripe`}
                      >
                        <ShoppingCart size={13} aria-hidden="true" />
                        Buy now
                      </a>
                    </div>
                  </div>
                </div>
              </article>
          ))}
        </div>
      </div>
    </section>
  )
}
