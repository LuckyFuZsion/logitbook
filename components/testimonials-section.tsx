'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { ArrowRight } from 'lucide-react'
import type { TestimonialsData } from '@/lib/testimonials-types'
import { getHomeFeaturedReviews } from '@/lib/testimonials-utils'
import { useIsDesktop } from '@/hooks/use-is-desktop'
import { TestimonialCard } from '@/components/testimonial-card'
import { TestimonialsCarousel } from '@/components/testimonials-carousel'
import { SectionHeading } from '@/components/section-heading'
import { SeoPageIntro } from '@/components/seo-page-intro'

export default function TestimonialsSection({
  bgClassName = 'bg-background',
  layout = 'home',
  initialData,
  showSeoIntro = false,
}: {
  bgClassName?: string
  /** Home: mobile CTA + desktop featured grid. Page: full carousel. */
  layout?: 'home' | 'page'
  initialData?: TestimonialsData
  showSeoIntro?: boolean
}) {
  const isDesktop = useIsDesktop()
  const [data, setData] = useState<TestimonialsData | null>(initialData ?? null)

  useEffect(() => {
    if (initialData) return
    fetch('/api/testimonials')
      .then((r) => r.json())
      .then((j: { data: TestimonialsData }) => setData(j.data))
      .catch(() => {})
  }, [initialData])

  const items = data?.items ?? []
  const featuredHome = getHomeFeaturedReviews(items)

  const showHomeDesktop = layout === 'home' && isDesktop && featuredHome.length > 0
  const showHomeMobileCta = layout === 'home' && !isDesktop
  const showPageCarousel = layout === 'page' && items.length > 0
  const headingLevel = layout === 'page' ? 'h1' : 'h2'

  if (layout === 'home' && data !== null && !showHomeDesktop && !showHomeMobileCta) {
    return null
  }

  if (layout === 'page' && data !== null && items.length === 0) {
    return (
      <section className={`${bgClassName} py-20 px-4`} aria-labelledby="testimonials-heading">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-white/50 text-sm">No reviews published yet.</p>
        </div>
      </section>
    )
  }

  return (
    <section
      id={layout === 'home' ? 'testimonials' : undefined}
      className={`${layout === 'home' ? 'min-h-0 md:min-h-0' : 'min-h-screen'} ${bgClassName} py-20 px-4`}
      aria-labelledby="testimonials-heading"
    >
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <p
            className="text-xs font-semibold tracking-[0.3em] uppercase text-[var(--brand-red)] mb-3"
            style={{ fontFamily: 'var(--font-rajdhani)' }}
          >
            What Divers Say
          </p>
          <SectionHeading
            as={headingLevel}
            id="testimonials-heading"
            className="text-4xl md:text-5xl font-black text-white mb-4 text-balance"
            style={{ fontFamily: 'var(--font-orbitron)' }}
          >
            CUSTOMER <span className="text-[var(--brand-red)]">REVIEWS</span>
          </SectionHeading>
          <div
            className="w-16 h-0.5 bg-[var(--brand-red)] mx-auto"
            style={{ boxShadow: '0 0 10px var(--brand-red-glow)' }}
            aria-hidden="true"
          />
        </div>

        {showSeoIntro && (
          <SeoPageIntro>
            Read genuine reviews from divers who trust LOGITSHOP for IDEST-accredited regulator servicing,
            cylinder testing and premium LOG-IT diving logbooks. Discover why recreational and technical
            divers choose us for equipment care and UK-made dive logbooks.
          </SeoPageIntro>
        )}

        {data === null && layout === 'home' && isDesktop && (
          <div className="hidden md:grid md:grid-cols-3 gap-6 animate-pulse">
            {[1, 2, 3].map((k) => (
              <div key={k} className="border border-[var(--charcoal-light)] p-6 h-48 bg-white/3" />
            ))}
          </div>
        )}

        {showHomeMobileCta && (
          <div className="md:hidden text-center px-2">
            <p
              className="text-sm text-white/65 leading-relaxed mb-8 max-w-md mx-auto"
              style={{ fontFamily: 'var(--font-rajdhani)' }}
            >
              {items.length > 0
                ? 'Read what divers say about our logbooks and IDEST-accredited servicing.'
                : 'Customer reviews will appear here soon.'}
            </p>
            {items.length > 0 && (
              <Link
                href="/testimonials"
                className="group inline-flex items-center justify-center gap-2 px-8 py-4 bg-[var(--brand-red)] hover:bg-red-600 text-white font-bold tracking-widest uppercase text-sm transition-all duration-200 hover:glow-red"
                style={{ fontFamily: 'var(--font-orbitron)' }}
              >
                Read all reviews
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" aria-hidden="true" />
              </Link>
            )}
          </div>
        )}

        {showHomeDesktop && (
          <>
            <div className="hidden md:grid md:grid-cols-3 gap-6">
              {featuredHome.map((item) => (
                <TestimonialCard key={item.id} item={item} />
              ))}
            </div>
            {items.length > featuredHome.length && (
              <div className="mt-12 text-center hidden md:block">
                <Link
                  href="/testimonials"
                  className="group inline-flex items-center justify-center gap-2 px-8 py-4 border border-[var(--brand-red)] text-[var(--brand-red)] hover:bg-[var(--brand-red)] hover:text-white font-bold tracking-widest uppercase text-sm transition-all duration-200"
                  style={{ fontFamily: 'var(--font-orbitron)' }}
                >
                  Read all reviews
                  <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" aria-hidden="true" />
                </Link>
              </div>
            )}
          </>
        )}

        {showPageCarousel && <TestimonialsCarousel items={items} />}
      </div>
    </section>
  )
}
