import Link from 'next/link'
import type { StoreProduct } from '@/lib/store-types'
import { productImageAlt } from '@/lib/product-image-alt'

export function ShopRelatedProducts({ products }: { products: StoreProduct[] }) {
  if (products.length === 0) return null

  return (
    <section
      className="mt-16 pt-12 border-t border-[var(--charcoal-light)]"
      aria-labelledby="related-products-heading"
    >
      <h2
        id="related-products-heading"
        className="text-xl md:text-2xl font-black text-white text-center mb-8"
        style={{ fontFamily: 'var(--font-orbitron)' }}
      >
        Other products you might like
      </h2>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6" role="list">
        {products.map((product) => {
          const image = product.images[0] ?? ''
          return (
            <Link
              key={product.id}
              href={`/shop/${product.id}`}
              className="group block min-w-0"
              role="listitem"
            >
              <article className="glass-card flex h-full min-w-0 flex-col overflow-hidden border border-[var(--charcoal-light)] transition-all duration-300 hover:border-[var(--brand-red)]/50">
                <div className="relative aspect-square overflow-hidden bg-[var(--charcoal)]">
                  {product.badge && (
                    <span
                      className="absolute top-2 left-2 z-10 px-2 py-1 text-[9px] font-bold tracking-widest uppercase bg-[var(--brand-red)] text-white"
                      style={{ fontFamily: 'var(--font-orbitron)' }}
                    >
                      {product.badge}
                    </span>
                  )}
                  {image ? (
                    <div className="absolute inset-0 flex items-center justify-center p-4">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={image}
                        alt={productImageAlt(product.name)}
                        className="mx-auto block h-auto w-auto max-h-full max-w-full min-h-0 min-w-0 object-contain object-center transition-transform duration-500 group-hover:scale-105"
                        loading="lazy"
                      />
                    </div>
                  ) : (
                    <span className="absolute inset-0 flex items-center justify-center text-xs text-white/40">
                      No image
                    </span>
                  )}
                </div>
                <div className="flex flex-col gap-1 p-4 text-center">
                  <h3
                    className="text-sm md:text-base font-bold text-white leading-tight line-clamp-2"
                    style={{ fontFamily: 'var(--font-orbitron)' }}
                  >
                    {product.name}
                  </h3>
                  <p
                    className="text-lg font-black text-[var(--brand-red)]"
                    style={{ fontFamily: 'var(--font-orbitron)' }}
                  >
                    £{product.price.toFixed(2)}
                  </p>
                </div>
              </article>
            </Link>
          )
        })}
      </div>
    </section>
  )
}
