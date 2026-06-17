import Image from 'next/image'
import { User } from 'lucide-react'
import type { TeamMember } from '@/lib/team-types'
import { teamMemberImageAlt } from '@/lib/team-members'

export function TeamMemberCard({ member }: { member: TeamMember }) {
  const alt = teamMemberImageAlt(member.name, member.placeholder)

  return (
    <article className="contents" aria-labelledby={`team-member-${member.id}-name`}>
      <div className="relative aspect-[4/5] bg-[var(--charcoal)] overflow-hidden sm:aspect-[3/4]">
        {member.imageSrc ? (
          <Image
            src={member.imageSrc}
            alt={alt}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 480px"
            className="object-cover object-top"
            priority={member.id === 'eve' || member.id === 'dan'}
          />
        ) : (
          <div
            className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-gradient-to-b from-[var(--charcoal)] to-black/80"
            role="img"
            aria-label={alt}
          >
            <div
              className="flex h-24 w-24 items-center justify-center rounded-full border-2 border-[var(--brand-red)]/50 bg-[var(--brand-red)]/10"
              aria-hidden="true"
            >
              <User size={40} className="text-[var(--brand-red)]/80" strokeWidth={1.5} />
            </div>
            <p
              className="text-[10px] font-bold tracking-[0.25em] uppercase text-white/45 px-4 text-center"
              style={{ fontFamily: 'var(--font-orbitron)' }}
            >
              Photo coming soon
            </p>
          </div>
        )}
        <div
          className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/70 to-transparent"
          aria-hidden="true"
        />
        <h2
          id={`team-member-${member.id}-name`}
          className="absolute bottom-0 left-0 right-0 px-5 pb-4 pt-8 text-2xl md:text-3xl font-black text-white"
          style={{ fontFamily: 'var(--font-orbitron)' }}
        >
          {member.name}
        </h2>
      </div>

      <div className="px-5 pt-5 md:px-6 md:pt-6">
        {member.qualifications.length > 0 && (
          <>
            <h3
              className="text-[10px] font-bold tracking-[0.25em] uppercase text-[var(--brand-red)] mb-3"
              style={{ fontFamily: 'var(--font-orbitron)' }}
            >
              Qualifications -
            </h3>
            <ul className="space-y-2" role="list">
              {member.qualifications.map((item) => (
                <li
                  key={item}
                  className="flex gap-2 text-sm text-white/75 leading-snug"
                  style={{ fontFamily: 'var(--font-rajdhani)' }}
                >
                  <span className="text-[var(--brand-red)] shrink-0 mt-0.5" aria-hidden="true">
                    ◆
                  </span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </>
        )}
      </div>

      <div className="px-5 pt-5 pb-5 md:px-6 md:pb-6">
        <h3
          className="text-[10px] font-bold tracking-[0.25em] uppercase text-[var(--brand-red)] mb-3"
          style={{ fontFamily: 'var(--font-orbitron)' }}
        >
          About Me -
        </h3>
        <div className="space-y-3">
          {member.aboutParagraphs.map((paragraph, index) => (
            <p
              key={index}
              className={`text-sm leading-relaxed ${member.placeholder ? 'text-white/50 italic' : 'text-white/70'}`}
              style={{ fontFamily: 'var(--font-rajdhani)' }}
            >
              {paragraph}
            </p>
          ))}
        </div>
      </div>
    </article>
  )
}
