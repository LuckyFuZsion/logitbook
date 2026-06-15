import { Star, Quote } from 'lucide-react'
import type { Testimonial } from '@/lib/testimonials-types'

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

export function TestimonialCard({ item }: { item: Testimonial }) {
  const dateLabel = item.date
    ? (() => {
        const [y, m] = item.date.split('-')
        if (y && m) {
          return new Date(parseInt(y), parseInt(m) - 1).toLocaleDateString('en-GB', {
            month: 'long',
            year: 'numeric',
          })
        }
        return item.date
      })()
    : null

  return (
    <article className="glass-card border border-[var(--charcoal-light)] p-6 flex flex-col gap-4 hover:border-[var(--brand-red)]/30 transition-colors duration-300 h-full">
      <Quote size={20} className="text-[var(--brand-red)] opacity-60 shrink-0" aria-hidden="true" />
      <p
        className="text-white/75 leading-relaxed text-sm flex-1"
        style={{ fontFamily: 'var(--font-rajdhani)' }}
      >
        &ldquo;{item.text}&rdquo;
      </p>
      <div className="flex items-end justify-between gap-3 mt-auto pt-2 border-t border-white/10">
        <div>
          <p className="text-white font-bold text-sm" style={{ fontFamily: 'var(--font-orbitron)' }}>
            {item.name}
          </p>
          {item.role && <p className="text-white/50 text-xs mt-0.5">{item.role}</p>}
          {dateLabel && <p className="text-white/35 text-xs mt-0.5">{dateLabel}</p>}
        </div>
        <StarRating rating={item.rating} />
      </div>
    </article>
  )
}
