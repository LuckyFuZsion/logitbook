import Link from 'next/link'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { mergeStoreData } from '@/lib/store-defaults'
import { readStoreFile } from '@/lib/store-store'
import type { StoreProduct } from '@/lib/store-types'
import { siteUrl } from '@/lib/site-url'

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
}): Promise<Metadata> {
  const { id } = await params
  const product = await getProduct(id)
  if (!product) {
    return { title: 'Product not found | LOGITSHOP' }
  }

  const canonical = `${siteUrl()}/shop/${encodeURIComponent(product.id)}`

  return {
    title: `${product.name} | Shop | LOGITSHOP`,
    description: product.description,
    alternates: { canonical },
    openGraph: {
      title: product.name,
      description: product.description,
      url: canonical,
      images: product.images[0] ? [{ url: product.images[0] }] : undefined,
    },
  }
}

export default async function ShopProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const product = await getProduct(id)
  if (!product) notFound()

  const image = product.images[0] ?? ''

  return (
    <main className="min-h-screen bg-background px-4 pt-24 pb-16">
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
          {image && (
            <div className="aspect-video bg-black/40 flex items-center justify-center p-6">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={image} alt={product.name} className="max-h-full max-w-full object-contain" />
            </div>
          )}

          <div className="p-6 md:p-8 space-y-4">
            <p className="text-[10px] font-semibold tracking-widest uppercase text-[var(--brand-red)]">
              {product.category}
            </p>
            <h1 className="text-3xl md:text-4xl font-black text-white" style={{ fontFamily: 'var(--font-orbitron)' }}>
              {product.name}
            </h1>
            <p className="text-white/65 leading-relaxed">{product.description}</p>

            <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-[var(--charcoal-light)]">
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-black text-white" style={{ fontFamily: 'var(--font-orbitron)' }}>
                  £{product.price.toFixed(2)}
                </span>
                {product.originalPrice != null && product.originalPrice > product.price && (
                  <span className="text-sm text-white/40 line-through">£{product.originalPrice.toFixed(2)}</span>
                )}
                <span className="text-xs text-white/50">+ VAT &amp; delivery</span>
              </div>
              <a
                href={product.stripeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-2.5 text-xs font-bold tracking-widest uppercase bg-[var(--brand-red)] hover:bg-red-600 text-white transition-colors"
                style={{ fontFamily: 'var(--font-orbitron)' }}
              >
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
    </main>
  )
}
