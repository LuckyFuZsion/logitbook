'use client'

import { useEffect, useState } from 'react'
import { Star, Quote } from 'lucide-react'
import type { TestimonialsData, Testimonial } from '@/lib/testimonials-types'

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5" aria-label={`${rating} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((n) => (
        <Star
          key={n}
          size={14}
          className={n <= rating ? 'text-amber-400 fill-amber-400' : 'text-white/20'}
          aria-hidden="true"
        />
      ))}
    </div>
  )
}

function TestimonialCard({ item }: { item: Testimonial }) {
  const dateLabel = item.date
    ? (() => {
        const [y, m] = item.date.split('-')
        if (y && m) return new Date(parseInt(y), parseInt(m) - 1).toLocaleDateString('en-GB', { month: 'long', year: 'numeric' })
        return item.date
      })()
    : null

  return (
    <article className="glass-card border border-[var(--charcoal-light)] p-6 flex flex-col gap-4 hover:border-[var(--brand-red)]/30 transition-colors duration-300">
      <Quote size={20} className="text-[var(--brand-red)] opacity-60 shrink-0" aria-hidden="true" />
      <p className="text-white/75 leading-relaxed text-sm flex-1" style={{ fontFamily: 'var(--font-rajdhani)' }}>
        &ldquo;{item.text}&rdquo;
      </p>
      <div className="flex items-end justify-between gap-3 mt-auto pt-2 border-t border-white/10">
        <div>
          <p className="text-white font-bold text-sm" style={{ fontFamily: 'var(--font-orbitron)' }}>{item.name}</p>
          {item.role && <p className="text-white/50 text-xs mt-0.5">{item.role}</p>}
          {dateLabel && <p className="text-white/35 text-xs mt-0.5">{dateLabel}</p>}
        </div>
        <StarRating rating={item.rating} />
      </div>
    </article>
  )
}

export default function TestimonialsSection({ bgClassName = 'bg-background' }: { bgClassName?: string }) {
  const [data, setData] = useState<TestimonialsData | null>(null)

  useEffect(() => {
    fetch('/api/testimonials')
      .then((r) => r.json())
      .then((j: { data: TestimonialsData }) => setData(j.data))
      .catch(() => {})
  }, [])

  const featured = data?.items.filter((t) => t.featured) ?? []
  if (data !== null && featured.length === 0) return null

  return (
    <section
      id="testimonials"
      className={`${bgClassName} py-20 px-4`}
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
          <h2
            id="testimonials-heading"
            className="text-4xl md:text-5xl font-black text-white mb-4 text-balance"
            style={{ fontFamily: 'var(--font-orbitron)' }}
          >
            CUSTOMER <span className="text-[var(--brand-red)]">REVIEWS</span>
          </h2>
          <div
            className="w-16 h-0.5 bg-[var(--brand-red)] mx-auto"
            style={{ boxShadow: '0 0 10px var(--brand-red-glow)' }}
            aria-hidden="true"
          />
        </div>

        {/* Skeleton while loading */}
        {data === null && (
          <div className="grid md:grid-cols-3 gap-6 animate-pulse">
            {[1, 2, 3].map((k) => (
              <div key={k} className="border border-[var(--charcoal-light)] p-6 h-48 bg-white/3" />
            ))}
          </div>
        )}

        {data !== null && (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featured.map((item) => (
              <TestimonialCard key={item.id} item={item} />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
