import Image from 'next/image'
import { ExternalLink, Star } from 'lucide-react'
import type { DiveDestination } from '@/lib/dive-destinations'
import { diveDestinationMapImageSrc, diveDestinationWebsiteLabel } from '@/lib/dive-destinations'
import { CountryFlag, countryFlagLabel } from '@/components/country-flag'

export function DiveDestinationCard({ destination }: { destination: DiveDestination }) {
  const websiteLabel = diveDestinationWebsiteLabel(destination.website)
  const countryLabel = countryFlagLabel(destination.countryCode)
  const locationLabel = `${destination.destination}, ${countryLabel}`
  const mapSrc = diveDestinationMapImageSrc(destination.id)

  return (
    <article
      className="glass-card flex h-full flex-col border border-[var(--charcoal-light)] p-5 md:p-6 transition-colors duration-300 hover:border-[var(--brand-red)]/40"
      aria-labelledby={`dive-destination-${destination.id}-name`}
    >
      <div className="relative mb-5 aspect-[8/5] overflow-hidden rounded-lg border border-[var(--charcoal-light)] bg-[var(--charcoal)] shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]">
        <Image
          src={mapSrc}
          alt={`Map of ${locationLabel}`}
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-cover"
        />
        <div
          className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-white/[0.03]"
          aria-hidden="true"
        />
      </div>

      <h2
        id={`dive-destination-${destination.id}-name`}
        className="flex items-center gap-2.5 text-xl md:text-2xl font-black text-white mb-4"
        style={{ fontFamily: 'var(--font-orbitron)' }}
      >
        <CountryFlag code={destination.countryCode} className="h-6 w-8 shrink-0 rounded-sm object-cover shadow-[0_1px_4px_rgba(0,0,0,0.35)] ring-1 ring-white/15" />
        <span>
          <span className="sr-only">Destination: </span>
          {destination.destination}
        </span>
      </h2>

      <dl className="flex flex-1 flex-col gap-4 text-base" style={{ fontFamily: 'var(--font-rajdhani)' }}>
        <div>
          <dt className="text-sm md:text-base font-bold tracking-[0.15em] uppercase text-[var(--brand-red)] mb-1.5">
            Dive Shop
          </dt>
          <dd className="text-white/80 leading-snug">{destination.diveShop}</dd>
        </div>

        <div>
          <dt className="text-sm md:text-base font-bold tracking-[0.15em] uppercase text-[var(--brand-red)] mb-1.5">
            Website
          </dt>
          <dd>
            <a
              href={destination.website}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-white/80 underline underline-offset-4 decoration-white/25 transition-colors hover:text-[var(--brand-red)] hover:decoration-[var(--brand-red)]/50"
            >
              {websiteLabel}
              <ExternalLink size={14} className="shrink-0 opacity-70" aria-hidden="true" />
              <span className="sr-only"> (opens in new tab)</span>
            </a>
          </dd>
        </div>

        <div className="mt-auto pt-2">
          <dt className="text-sm md:text-base font-bold tracking-[0.15em] uppercase text-[var(--brand-red)] mb-2.5">
            Accessibility Rating
          </dt>
          <dd>
            <div
              className="flex items-center gap-1.5"
              role="img"
              aria-label={`${destination.accessibilityRating} out of 5 stars`}
            >
              {Array.from({ length: 5 }, (_, index) => (
                <Star
                  key={index}
                  size={22}
                  className={
                    index < destination.accessibilityRating
                      ? 'fill-[var(--brand-red)] text-[var(--brand-red)]'
                      : 'text-white/20'
                  }
                  aria-hidden="true"
                />
              ))}
            </div>
          </dd>
        </div>
      </dl>
    </article>
  )
}
