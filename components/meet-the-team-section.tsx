import { TEAM_MEMBERS, teamMemberAboutPlain } from '@/lib/team-members'
import { siteUrl } from '@/lib/site-url'
import { TeamMemberCard } from '@/components/team-member-card'
import { SectionHeading } from '@/components/section-heading'
import { SeoPageIntro } from '@/components/seo-page-intro'

export function MeetTheTeamSection({
  headingLevel = 'h1',
  showSeoIntro = false,
}: {
  headingLevel?: 'h1' | 'h2'
  showSeoIntro?: boolean
}) {
  const baseUrl = siteUrl()

  const teamJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: 'Meet the Team - LOGITSHOP',
    description:
      'Meet the people behind LOG-IT and LOGITSHOP - IDEST-accredited diving services, logbooks, and workshop team in the UK.',
    url: `${baseUrl}/meet-the-team`,
    mainEntity: {
      '@type': 'ItemList',
      name: 'LOG-IT Team',
      itemListElement: TEAM_MEMBERS.map((member, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        item: {
          '@type': 'Person',
          name: member.name,
          description: teamMemberAboutPlain(member),
          ...(member.imageSrc
            ? { image: `${baseUrl}${member.imageSrc}` }
            : {}),
          worksFor: {
            '@type': 'Organization',
            name: 'LOG-IT / LOGITSHOP',
            url: baseUrl,
          },
        },
      })),
    },
  }

  return (
    <section
      className="bg-background py-16 md:py-24 px-4"
      aria-labelledby="meet-the-team-heading"
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(teamJsonLd) }}
      />

      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12 md:mb-16">
          <p
            className="text-xs font-semibold tracking-[0.3em] uppercase text-[var(--brand-red)] mb-3"
            style={{ fontFamily: 'var(--font-rajdhani)' }}
          >
            The people behind Log-It
          </p>
          <SectionHeading
            as={headingLevel}
            id="meet-the-team-heading"
            className="text-4xl md:text-5xl font-black text-white mb-4 text-balance"
            style={{ fontFamily: 'var(--font-orbitron)' }}
          >
            MEET THE <span className="text-[var(--brand-red)]">TEAM</span>
          </SectionHeading>
          <div
            className="w-16 h-0.5 bg-[var(--brand-red)] mx-auto mb-6"
            style={{ boxShadow: '0 0 10px var(--brand-red-glow)' }}
            aria-hidden="true"
          />
          {showSeoIntro && (
            <SeoPageIntro>
              From IDEST-accredited workshop expertise to the family (and four-legged colleagues) keeping LOG-IT
              running - get to know who you&apos;ll meet when you shop, service kit, or visit us in person.
            </SeoPageIntro>
          )}
        </div>

        <ul
          className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8"
          role="list"
          aria-label="LOG-IT team members"
        >
          {TEAM_MEMBERS.map((member) => (
            <li
              key={member.id}
              className="glass-card min-h-0 overflow-hidden border border-[var(--charcoal-light)] transition-colors duration-300 hover:border-[var(--brand-red)]/40 grid md:row-span-3 md:grid-rows-subgrid"
            >
              <TeamMemberCard member={member} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
