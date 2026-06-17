import { DIVE_DESTINATIONS, DIVE_DESTINATIONS_INTRO } from '@/lib/dive-destinations'
import { siteUrl } from '@/lib/site-url'
import { DiveDestinationCard } from '@/components/dive-destination-card'
import { SectionHeading } from '@/components/section-heading'

export function DiveDestinationsSection({
  headingLevel = 'h1',
}: {
  headingLevel?: 'h1' | 'h2'
}) {
  const baseUrl = siteUrl()

  const destinationsJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: "Log-It's Trusted Dive Destinations - LOGITSHOP",
    description: DIVE_DESTINATIONS_INTRO.join(' '),
    url: `${baseUrl}/dive-destinations`,
    mainEntity: {
      '@type': 'ItemList',
      name: "Log-It's Trusted Dive Destinations",
      itemListElement: DIVE_DESTINATIONS.map((destination, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        item: {
          '@type': 'SportsActivityLocation',
          name: destination.diveShop,
          address: {
            '@type': 'PostalAddress',
            addressLocality: destination.destination,
          },
          url: destination.website,
        },
      })),
    },
  }

  return (
    <section
      className="bg-background py-16 md:py-24 px-4"
      aria-labelledby="dive-destinations-heading"
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(destinationsJsonLd) }}
      />

      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12 md:mb-16">
          <p
            className="text-sm md:text-base font-semibold tracking-[0.2em] uppercase text-[var(--brand-red)] mb-3"
            style={{ fontFamily: 'var(--font-rajdhani)' }}
          >
            Accessibility-first diving
          </p>
          <SectionHeading
            as={headingLevel}
            id="dive-destinations-heading"
            className="text-4xl md:text-5xl font-black text-white mb-4 text-balance"
            style={{ fontFamily: 'var(--font-orbitron)' }}
          >
            LOG-IT&apos;S TRUSTED{' '}
            <span className="text-[var(--brand-red)]">DIVE DESTINATIONS</span>
          </SectionHeading>
          <div
            className="w-16 h-0.5 bg-[var(--brand-red)] mx-auto mb-6"
            style={{ boxShadow: '0 0 10px var(--brand-red-glow)' }}
            aria-hidden="true"
          />
          <div className="max-w-3xl mx-auto space-y-4 text-center text-white/65 text-base leading-relaxed mb-8 px-4">
            {DIVE_DESTINATIONS_INTRO.map((paragraph, index) => (
              <p key={index} style={{ fontFamily: 'var(--font-rajdhani)' }}>
                {paragraph}
              </p>
            ))}
          </div>
        </div>

        <ul
          className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8"
          role="list"
          aria-label="Trusted accessible dive destinations"
        >
          {DIVE_DESTINATIONS.map((destination) => (
            <li key={destination.id} className="min-h-0">
              <DiveDestinationCard destination={destination} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
