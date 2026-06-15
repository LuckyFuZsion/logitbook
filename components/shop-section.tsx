'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { ArrowRight, BadgeCheck } from 'lucide-react'
import type { StoreCategory, StoreData, StoreProduct } from '@/lib/store-types'
import { getCategoryTitle } from '@/lib/store-category-utils'
import { productImageAlt } from '@/lib/product-image-alt'
import { ProductImageCarousel } from '@/components/product-image-carousel'
import { useIsDesktop } from '@/hooks/use-is-desktop'
import { publicSiteUrl } from '@/lib/site-url'

/** Normalized for UI (primary image convenience field). */
export type Product = StoreProduct & { image: string }

interface ShopSectionProps {
  bgClassName?: string
  showReturnsNotice?: boolean
  /** Full cards on home; square tiles linking to product pages on /shop */
  layout?: 'cards' | 'tiles'
  /** Show category filter pills (shop page) */
  showCategoryFilter?: boolean
  /** Max products on home cards layout (featured first, then catalog order) */
  homePreviewLimit?: number
  /** Link to full /shop index below home cards */
  showShopAllLink?: boolean
  /** Server-provided catalogue — skips client fetch when set */
  initialStore?: StoreData
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

function homeDisplayProducts(products: Product[], limit: number): Product[] {
  const featured = products.filter((p) => p.featuredOnHome === true)
  const source = featured.length > 0 ? featured : products
  return source.slice(0, limit)
}

export default function ShopSection({
  bgClassName = 'bg-background',
  showReturnsNotice = false,
  layout = 'cards',
  showCategoryFilter = false,
  homePreviewLimit = 3,
  showShopAllLink: showShopAllLinkProp,
  initialStore,
}: ShopSectionProps) {
  const showShopAllLink = showShopAllLinkProp ?? layout === 'cards'
  const isDesktop = useIsDesktop()
  const [categories, setCategories] = useState<StoreCategory[]>(initialStore?.categories ?? [])
  const [products, setProducts] = useState<Product[]>(() =>
    initialStore ? normalizeProducts(initialStore.products) : [],
  )
  const [activeCategoryId, setActiveCategoryId] = useState<string | null>(null)
  const [loadError, setLoadError] = useState<string | null>(null)

  useEffect(() => {
    if (initialStore) return
    let cancelled = false
    fetch('/api/shop')
      .then((r) => {
        if (!r.ok) throw new Error('Could not load shop')
        return r.json()
      })
      .then((json: { products: StoreProduct[]; categories?: StoreCategory[] }) => {
        if (!cancelled) {
          setCategories(json.categories ?? [])
          setProducts(normalizeProducts(json.products ?? []))
        }
      })
      .catch(() => {
        if (!cancelled) setLoadError('Shop catalogue could not be loaded.')
      })
    return () => {
      cancelled = true
    }
  }, [initialStore])

  const filtered = activeCategoryId
    ? products.filter((p) => p.categoryId === activeCategoryId)
    : products

  const displayProducts =
    layout === 'cards' ? homeDisplayProducts(filtered, homePreviewLimit) : filtered

  const jsonLdProducts = displayProducts

  return (
    <section
      id="shop"
      className={`${layout === 'cards' ? 'min-h-0 md:min-h-screen' : 'min-h-screen'} ${bgClassName} py-20 px-4`}
      aria-labelledby="shop-heading"
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'ItemList',
            name: 'Logitshop Products',
            itemListElement: jsonLdProducts.map((p, i) => ({
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
                  url: `${publicSiteUrl()}/shop/${encodeURIComponent(p.id)}`,
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

        {loadError && (
          <p className="text-center text-red-400 text-sm mb-8" role="alert">
            {loadError}
          </p>
        )}

        {!loadError && displayProducts.length === 0 && layout !== 'cards' && (
          <p className="text-center text-white/50 text-sm">
            {activeCategoryId ? 'No products in this category.' : 'No products configured.'}
          </p>
        )}

        {!loadError && displayProducts.length === 0 && layout === 'cards' && (
          <p className="text-center text-white/50 text-sm hidden md:block">
            No products configured.
          </p>
        )}

        {showCategoryFilter && categories.length > 0 && !loadError && (
          <div
            className="flex flex-wrap justify-center gap-2 mb-10"
            role="group"
            aria-label="Filter by category"
          >
            <button
              type="button"
              onClick={() => setActiveCategoryId(null)}
              className={`px-4 py-2 text-xs font-bold tracking-widest uppercase border transition-colors ${
                activeCategoryId === null
                  ? 'border-[var(--brand-red)] bg-[var(--brand-red)] text-white'
                  : 'border-[var(--charcoal-light)] text-white/70 hover:border-[var(--brand-red)]/50 hover:text-white'
              }`}
              style={{ fontFamily: 'var(--font-orbitron)' }}
              aria-pressed={activeCategoryId === null}
            >
              All
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setActiveCategoryId(cat.id)}
                className={`px-4 py-2 text-xs font-bold tracking-widest uppercase border transition-colors ${
                  activeCategoryId === cat.id
                    ? 'border-[var(--brand-red)] bg-[var(--brand-red)] text-white'
                    : 'border-[var(--charcoal-light)] text-white/70 hover:border-[var(--brand-red)]/50 hover:text-white'
                }`}
                style={{ fontFamily: 'var(--font-orbitron)' }}
                aria-pressed={activeCategoryId === cat.id}
              >
                {cat.title}
              </button>
            ))}
          </div>
        )}

        {layout === 'tiles' ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 items-stretch" role="list">
            {filtered.map((product) => (
              <Link
                key={product.id}
                href={`/shop/${product.id}`}
                className="group block h-full"
                role="listitem"
              >
                <article className="glass-card flex flex-col border border-[var(--charcoal-light)] hover:border-[var(--brand-red)]/50 transition-all duration-300 h-full">
                  <div className="relative aspect-square bg-[var(--charcoal)] flex items-center justify-center p-4">
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
                      alt={productImageAlt(product.name)}
                      className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />
                  </div>
                  <div className="flex flex-col gap-1 p-3 sm:p-4 text-center flex-1">
                    <h3
                      className="text-xs sm:text-sm md:text-base font-bold text-white leading-snug break-words"
                      style={{ fontFamily: 'var(--font-orbitron)' }}
                    >
                      {product.name}
                    </h3>
                    <p className="text-lg font-black text-[var(--brand-red)]" style={{ fontFamily: 'var(--font-orbitron)' }}>
                      £{product.price.toFixed(2)}
                    </p>
                  </div>
                </article>
              </Link>
            ))}
          </div>
        ) : (
        <>
        {showShopAllLink && !loadError && (
          <div className="md:hidden text-center px-2">
            <p
              className="text-sm text-white/65 leading-relaxed mb-8 max-w-md mx-auto"
              style={{ fontFamily: 'var(--font-rajdhani)' }}
            >
              Browse our full range of diving logbooks and scuba accessories in the shop.
            </p>
            <Link
              href="/shop"
              className="group inline-flex items-center justify-center gap-2 px-8 py-4 bg-[var(--brand-red)] hover:bg-red-600 text-white font-bold tracking-widest uppercase text-sm transition-all duration-200 hover:glow-red"
              style={{ fontFamily: 'var(--font-orbitron)' }}
            >
              Shop all Items
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" aria-hidden="true" />
            </Link>
          </div>
        )}

        {isDesktop && (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch" role="list">
          {displayProducts.map((product) => {
            const productHref = `/shop/${product.id}`
            const images = product.images.filter(Boolean)

            return (
              <article
                key={product.id}
                className="glass-card group relative flex h-full flex-col overflow-hidden border border-[var(--charcoal-light)] hover:border-[var(--brand-red)]/50 transition-all duration-300"
                role="listitem"
              >
                <div className="relative shrink-0 aspect-video bg-[var(--charcoal)]">
                  <div className="absolute inset-0 min-h-0">
                    {product.badge && (
                      <span
                        className="absolute top-2 left-2 z-20 px-2 py-1 text-[9px] font-bold tracking-widest uppercase bg-[var(--brand-red)] text-white pointer-events-none"
                        style={{ fontFamily: 'var(--font-orbitron)' }}
                      >
                        {product.badge}
                      </span>
                    )}
                    <ProductImageCarousel
                      images={images}
                      alt={product.name}
                      variant="card"
                      linkHref={productHref}
                    />
                    <div
                      className="pointer-events-none absolute inset-x-0 bottom-0 top-1/3 bg-gradient-to-t from-black/40 to-transparent"
                      aria-hidden="true"
                    />
                  </div>
                </div>

                <div className="flex flex-1 flex-col p-4 gap-3">
                  <div className="flex items-start justify-between gap-2 min-h-[3.75rem]">
                    <div className="min-w-0">
                      <p className="text-[10px] font-semibold tracking-widest uppercase text-[var(--brand-red)] mb-1">
                        {getCategoryTitle(categories, product.categoryId)}
                      </p>
                      <h3
                        className="text-base font-bold text-white leading-tight line-clamp-2"
                        style={{ fontFamily: 'var(--font-orbitron)' }}
                      >
                        <Link
                          href={productHref}
                          className="hover:text-[var(--brand-red)] transition-colors"
                        >
                          {product.name}
                        </Link>
                      </h3>
                    </div>
                    <BadgeCheck size={16} className="text-[var(--brand-red)] mt-1 shrink-0" aria-label="Verified product" />
                  </div>

                  <p className="text-sm text-white/60 leading-relaxed line-clamp-3 min-h-[3.75rem]">{product.description}</p>

                  <div className="mt-auto pt-2 border-t border-[var(--charcoal-light)] space-y-2">
                    <p className="text-[10px] text-white/50 min-h-[2.5rem]">
                      {isPrestigiousLogbook(product)
                        ? '20+ books qualify for wholesale pricing. Contact us for details.'
                        : null}
                    </p>
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
                        <span className="text-xs text-white/50">+ delivery</span>
                      </div>
                      <Link
                        href={productHref}
                        className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold tracking-widest uppercase border border-[var(--brand-red)] text-[var(--brand-red)] hover:bg-[var(--brand-red)] hover:text-white transition-all duration-200"
                        style={{ fontFamily: 'var(--font-orbitron)' }}
                      >
                        View product
                        <ArrowRight size={13} aria-hidden="true" />
                      </Link>
                    </div>
                  </div>
                </div>
              </article>
            )
          })}
        </div>
        )}
        </>
        )}

        {showShopAllLink && layout === 'cards' && !loadError && products.length > 0 && (
          <div className="mt-12 text-center hidden md:block">
            {displayProducts.length < products.length && (
              <p className="text-sm text-white/50 mb-4" style={{ fontFamily: 'var(--font-rajdhani)' }}>
                Browse the full catalogue
              </p>
            )}
            <Link
              href="/shop"
              className="group inline-flex items-center justify-center gap-2 px-8 py-4 bg-[var(--brand-red)] hover:bg-red-600 text-white font-bold tracking-widest uppercase text-sm transition-all duration-200 hover:glow-red"
              style={{ fontFamily: 'var(--font-orbitron)' }}
            >
              Shop all Items
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" aria-hidden="true" />
            </Link>
          </div>
        )}

        {showReturnsNotice && (
          <aside
            className="mt-16 max-w-3xl mx-auto p-6 border border-[var(--charcoal-light)] bg-[var(--charcoal)]/60 text-center"
            aria-labelledby="shop-returns-heading"
          >
            <h3
              id="shop-returns-heading"
              className="text-sm font-black tracking-[0.2em] uppercase text-[var(--brand-red)] mb-3"
              style={{ fontFamily: 'var(--font-orbitron)' }}
            >
              Returns &amp; refunds
            </h3>
            <p className="text-sm text-white/65 leading-relaxed mb-3">
              Contact us within 14 days of purchase or receipt (whichever is later). We&apos;re happy to exchange or
              refund on presentation of a valid receipt — goods must be returned within 30 days in original packaging.
            </p>
            <Link
              href="/returns"
              className="text-sm text-[var(--brand-red)] hover:text-red-400 underline underline-offset-4 decoration-[var(--brand-red)]/40 transition-colors"
              style={{ fontFamily: 'var(--font-rajdhani)' }}
            >
              Read full return and refund policy
            </Link>
          </aside>
        )}
      </div>
    </section>
  )
}
