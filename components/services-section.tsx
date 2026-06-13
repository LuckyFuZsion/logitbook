'use client'

import { useEffect, useState } from 'react'
import { ArrowRight } from 'lucide-react'
import type { ServicesData } from '@/lib/services-types'
import { CATEGORY_ICON_BY_ID, mergeServicesData } from '@/lib/services-defaults'
import { publicSiteUrl } from '@/lib/site-url'

function getCategoryIconSrc(categoryId: string, icon?: string): string {
  return CATEGORY_ICON_BY_ID[categoryId] ?? icon ?? '/icons/repairs.webp'
}

export default function ServicesSection({ bgClassName = 'bg-background' }: { bgClassName?: string }) {
  const [data, setData] = useState<ServicesData | null>(null)

  useEffect(() => {
    fetch('/api/services')
      .then((r) => r.json())
      .then((j: { data: ServicesData }) => setData(j.data))
      .catch(() => setData(mergeServicesData(null)))
  }, [])

  useEffect(() => {
    if (!data) return
    const targetId = window.location.hash.replace(/^#/, '')
    if (!targetId) return
    const el = document.getElementById(targetId)
    if (!el) return
    el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }, [data])

  const categories = data?.categories ?? []

  return (
    <section
      id="services"
      className={`min-h-screen ${bgClassName} py-20 px-4`}
      aria-labelledby="services-heading"
    >
      {/* JSON-LD: Service Catalog */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Service',
            provider: {
              '@type': 'Organization',
              name: 'Logitshop',
              url: publicSiteUrl(),
            },
            serviceType: 'Scuba Equipment Maintenance and Servicing',
            areaServed: 'Worldwide',
          }),
        }}
      />

      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <p
            className="text-sm font-semibold tracking-[0.3em] uppercase text-[var(--brand-red)] mb-3"
            style={{ fontFamily: 'var(--font-rajdhani)' }}
          >
            Expert Solutions
          </p>
          <h2
            id="services-heading"
            className="text-4xl md:text-5xl font-black text-white mb-4 text-balance"
            style={{ fontFamily: 'var(--font-orbitron)' }}
          >
            ACCREDITED <span className="text-[var(--brand-red)]">SERVICES</span>
          </h2>
          <div
            className="w-16 h-0.5 bg-[var(--brand-red)] mx-auto mb-6"
            style={{ boxShadow: '0 0 10px var(--brand-red-glow)' }}
            aria-hidden="true"
          />
          <p className="max-w-xl mx-auto text-white/60 text-base leading-relaxed">
            IDEST accredited servicing for regulators, BCDs, cylinders, and technical diving systems.
          </p>
        </div>

        {/* Skeleton while loading */}
        {!data && (
          <div className="space-y-16 mb-20 animate-pulse">
            {[1, 2, 3, 4].map((n) => (
              <div key={n} className="border-b border-[var(--charcoal-light)] pb-12">
                <div className="flex items-start gap-4 mb-6">
                  <div className="w-12 h-12 bg-white/10 rounded-sm shrink-0" />
                  <div className="flex-1 space-y-2">
                    <div className="h-6 bg-white/10 rounded w-48" />
                    <div className="h-4 bg-white/5 rounded w-72" />
                  </div>
                </div>
                <div className="space-y-2">
                  {[1, 2, 3].map((m) => (
                    <div key={m} className="h-12 bg-white/5 rounded" />
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Service Categories & Pricing */}
        {data && (
          <div className="space-y-16 mb-20">
            {categories.map(({ id, title, icon, description, services }) => (
                <article key={id} id={id} className="border-b border-[var(--charcoal-light)] pb-12">
                  <div className="flex items-start gap-4 mb-6">
                    <div
                      className="w-12 h-12 rounded-sm flex items-center justify-center bg-[var(--brand-red-dim)] border border-[var(--brand-red)]/30 shrink-0 p-2"
                      aria-hidden="true"
                    >
                      <img
                        src={getCategoryIconSrc(id, icon)}
                        alt=""
                        className="h-full w-full object-contain"
                      />
                    </div>
                    <div>
                      <h3
                        className="text-2xl font-black text-white mb-1"
                        style={{ fontFamily: 'var(--font-orbitron)' }}
                      >
                        {title}
                      </h3>
                      <p className="text-base text-white/65">{description}</p>
                    </div>
                  </div>

                  {/* Mobile list */}
                  <div className="space-y-3 md:hidden">
                    {services.map((svc) => (
                      <div
                        key={svc.id}
                        className="glass-card border border-[var(--charcoal-light)] p-4 flex flex-col gap-3"
                      >
                        <div>
                          <p className="text-white/90 font-bold">{svc.name}</p>
                          {svc.note && (
                            <p className="text-sm text-white/55 mt-1 italic">{svc.note}</p>
                          )}
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <div className="rounded-sm border border-[var(--charcoal-light)] p-3">
                            <p className="text-xs tracking-widest uppercase text-white/60 mb-1">
                              Standard
                            </p>
                            <p className="text-white font-black tabular-nums">
                              {svc.standard != null ? `£${svc.standard.toFixed(2)}` : '-'}
                            </p>
                          </div>
                          <div className="rounded-sm border border-[var(--charcoal-light)] p-3">
                            <p className="text-xs tracking-widest uppercase text-white/60 mb-1">
                              Members
                            </p>
                            <p className="text-[var(--brand-red)] font-black tabular-nums">
                              {svc.member != null ? `£${svc.member.toFixed(2)}` : '-'}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Desktop table */}
                  <div className="overflow-x-auto hidden md:block">
                    <table className="w-full text-base min-w-[640px]">
                      <colgroup>
                        <col />
                        <col className="w-36" />
                        <col className="w-36" />
                      </colgroup>
                      <thead>
                        <tr className="border-b border-[var(--charcoal-light)]">
                          <th
                            className="text-left py-3 px-4 font-bold text-white/80"
                            style={{ fontFamily: 'var(--font-rajdhani)' }}
                          >
                            Service
                          </th>
                          <th
                            className="text-right py-3 px-4 font-bold text-[var(--brand-red)] whitespace-nowrap tabular-nums"
                            style={{ fontFamily: 'var(--font-rajdhani)' }}
                          >
                            Standard
                          </th>
                          <th
                            className="text-right py-3 px-4 font-bold text-white/80 whitespace-nowrap tabular-nums"
                            style={{ fontFamily: 'var(--font-rajdhani)' }}
                          >
                            Members
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {services.map((svc) => (
                          <tr
                            key={svc.id}
                            className="border-b border-[var(--charcoal-light)]/40 hover:bg-[var(--charcoal-light)]/5 transition-colors"
                          >
                            <td className="py-4 px-4 text-white/80">
                              {svc.name}
                              {svc.note && (
                                <div className="text-sm text-white/55 mt-1 italic">{svc.note}</div>
                              )}
                            </td>
                            <td className="text-right py-4 px-4 font-bold text-white whitespace-nowrap tabular-nums">
                              {svc.standard != null ? `£${svc.standard.toFixed(2)}` : '-'}
                            </td>
                            <td className="text-right py-4 px-4 font-bold text-[var(--brand-red)] whitespace-nowrap tabular-nums">
                              {svc.member != null ? `£${svc.member.toFixed(2)}` : '-'}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </article>
            ))}
          </div>
        )}

        {/* Pricing Note & CTA Banner */}
        <div
          className="mt-16 relative overflow-hidden border border-[var(--brand-red)]/40 p-8 md:p-12 text-center"
          style={{ background: 'linear-gradient(135deg, var(--brand-red-dim) 0%, transparent 60%)' }}
        >
          <div className="cyber-grid absolute inset-0 opacity-40" aria-hidden="true" />
          <div className="relative z-10">
            <p className="text-white/70 mb-4 max-w-2xl mx-auto text-base">
              <span className="font-bold text-white">
                {data?.vatNote ??
                  'All prices include VAT at 20%. Specialist kits or increased kit costs will be confirmed before work begins.'}
              </span>
            </p>
            <p className="text-white/65 mb-6 max-w-2xl mx-auto text-base leading-relaxed">
              <span className="font-bold text-white">Members pricing</span>{' '}
              {data?.membersNote ??
                'applies to members of our partner dive club, where we are their preferred service provider.'}
              {data?.clubUrl && (
                <>
                  {' '}
                  <a
                    href={data.clubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-white underline underline-offset-4 decoration-white/30 hover:decoration-white/70 transition-colors"
                  >
                    {data.clubUrl.replace(/^https?:\/\//, '')}
                  </a>
                </>
              )}
            </p>
            <h3
              className="text-2xl md:text-3xl font-black text-white mb-3"
              style={{ fontFamily: 'var(--font-orbitron)' }}
            >
              BECOME A <span className="text-[var(--brand-red)]">MEMBER</span>
            </h3>
            <p className="text-white/65 mb-6 max-w-md mx-auto text-base">
              Members enjoy discounted servicing rates across all categories and priority 24/7 support
              for expeditions.
            </p>
            <a
              href={data?.clubUrl ?? 'https://binghamsac.co.uk'}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-8 py-3.5 bg-[var(--brand-red)] hover:bg-red-600 text-white font-bold tracking-widest uppercase text-sm transition-all duration-200 glow-red"
              style={{ fontFamily: 'var(--font-orbitron)' }}
              aria-label={`Join ${data?.clubName ?? 'the club'} to access members pricing`}
            >
              Join {data?.clubName ?? 'Bingham SAC'} <ArrowRight size={16} aria-hidden="true" />
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
