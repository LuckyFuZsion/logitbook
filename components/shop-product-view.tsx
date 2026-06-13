import Link from 'next/link'
import { ShoppingCart } from 'lucide-react'
import type { StoreProduct } from '@/lib/store-types'
import { ProductImageCarousel } from '@/components/product-image-carousel'
import { ShopRelatedProducts } from '@/components/shop-related-products'

function isPrestigiousLogbook(product: StoreProduct): boolean {
  return product.id === 'logit-book-prestigious'
}

export function ShopProductView({
  product,
  otherProducts = [],
}: {
  product: StoreProduct
  otherProducts?: StoreProduct[]
}) {
  const images = product.images.filter(Boolean)

  return (
    <div className="px-4 pt-24 pb-16">
      <div className="max-w-3xl mx-auto">
        <p className="text-sm text-white/60 mb-8">
          <Link href="/" className="underline underline-offset-4 decoration-white/20 hover:decoration-white/60">
            Home
          </Link>
          {' · '}
          <Link href="/shop" className="underline underline-offset-4 decoration-white/20 hover:decoration-white/60">
            Shop
          </Link>
        </p>

        <article className="border border-[var(--charcoal-light)] bg-[var(--charcoal)] overflow-hidden">
          <ProductImageCarousel images={images} alt={product.name} />

          <div className="p-6 md:p-8 space-y-4">
            {product.badge && (
              <p
                className="inline-block px-2 py-1 text-[9px] font-bold tracking-widest uppercase bg-[var(--brand-red)] text-white"
                style={{ fontFamily: 'var(--font-orbitron)' }}
              >
                {product.badge}
              </p>
            )}
            <p className="text-[10px] font-semibold tracking-widest uppercase text-[var(--brand-red)]">
              {product.category}
            </p>
            <h1 className="text-3xl md:text-4xl font-black text-white" style={{ fontFamily: 'var(--font-orbitron)' }}>
              {product.name}
            </h1>
            <p className="text-white/65 leading-relaxed">{product.description}</p>

            {isPrestigiousLogbook(product) && (
              <p className="text-sm text-white/50">
                20+ books qualify for wholesale pricing. Contact us for details.
              </p>
            )}

            <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-[var(--charcoal-light)]">
              <div className="flex items-baseline gap-2 flex-wrap">
                <span className="text-2xl font-black text-white" style={{ fontFamily: 'var(--font-orbitron)' }}>
                  £{product.price.toFixed(2)}
                </span>
                {product.originalPrice != null && product.originalPrice > product.price && (
                  <span className="text-sm text-white/40 line-through">£{product.originalPrice.toFixed(2)}</span>
                )}
                <span className="text-xs text-white/50">+ delivery</span>
              </div>
              <a
                href={product.stripeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-bold tracking-widest uppercase bg-[var(--brand-red)] hover:bg-red-600 text-white transition-colors hover:glow-red"
                style={{ fontFamily: 'var(--font-orbitron)' }}
              >
                <ShoppingCart size={14} aria-hidden="true" />
                Buy now
              </a>
            </div>
          </div>
        </article>

        <p className="mt-8 text-sm text-white/50 text-center">
          <Link href="/returns" className="text-[var(--brand-red)] hover:text-red-400 underline underline-offset-4">
            Return and refund policy
          </Link>
        </p>
      </div>

      {otherProducts.length > 0 && (
        <div className="max-w-7xl mx-auto">
          <ShopRelatedProducts products={otherProducts} />
        </div>
      )}

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Product',
            name: product.name,
            description: product.description,
            image: product.images,
            offers: {
              '@type': 'Offer',
              price: product.price,
              priceCurrency: 'GBP',
              availability: 'https://schema.org/InStock',
              url: product.stripeUrl,
            },
          }),
        }}
      />
    </div>
  )
}
