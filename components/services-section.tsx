'use client'

import { useEffect } from 'react'
import {
  Wrench,
  Zap,
  ArrowRight,
  Droplet,
  LifeBuoy,
} from 'lucide-react'

const SERVICE_CATEGORIES = [
  {
    id: 'cylinders',
    title: 'Cylinder Services',
    icon: Droplet,
    description: 'All cylinder services include valve service. O₂ fills not included. IDEST accredited.',
    services: [
      { name: 'Hydro (PIAT) test + air fill', standard: 64.0, member: 60.0 },
      { name: 'Visual (PI) test + air fill', standard: 55.0, member: 50.0 },
      { name: 'O₂ clean', standard: 25.0, member: 25.0 },
      { name: 'Internal shot blast', standard: 18.0, member: 15.0 },
      { name: 'Chemical clean', standard: 20.0, member: 18.0 },
      { name: 'Twinset manifold surcharge', standard: 15.0, member: 10.0 },
      { name: 'Test failure', standard: 18.0, member: 18.0 },
      { name: 'External shot blast & repaint', standard: null, member: null, note: 'Price on request' },
    ],
  },
  {
    id: 'regulators',
    title: 'Regulator Services',
    icon: Wrench,
    description: 'All regulator services include gauge check. Specialist brands: price on request. IDEST accredited.',
    services: [
      { name: '1st & 2nd stage service', standard: 100.0, member: 95.0 },
      { name: '1st stage, 2nd stage & octo service', standard: 140.0, member: 130.0 },
      { name: 'O₂ clean (mandatory if using 25%+ O₂)', standard: 25.0, member: 25.0 },
      { name: 'SPG conformity check', standard: 10.0, member: 10.0, note: 'Free with gauge purchase' },
      { name: 'Surcharge for heavily soiled equipment', standard: 15.0, member: 15.0 },
      { name: 'Diagnostic fee', standard: 30.0, member: 30.0, note: 'Halved if service completed' },
    ],
  },
  {
    id: 'bcds',
    title: 'BCD Services',
    icon: Zap,
    description: 'Complete BCD maintenance including pressure check and antibacterial bladder clean. IDEST accredited.',
    services: [
      { name: 'BCD service (incl. pressure check & antibacterial clean)', standard: 35.0, member: 31.0 },
    ],
  },
  {
    id: 'repairs',
    title: 'Repairs & Custom Work',
    icon: LifeBuoy,
    description: 'Expert repair work and custom modifications for specialized diving equipment.',
    services: [
      { name: 'Repair work (per hour)', standard: 25.0, member: 20.0 },
      { name: 'Custom work (per hour or individually priced)', standard: 25.0, member: 20.0 },
      { name: 'Out-of-scope / additional hourly rate', standard: 25.0, member: 20.0 },
    ],
  },
]

export default function ServicesSection({ bgClassName = 'bg-background' }: { bgClassName?: string }) {
  useEffect(() => {
    const targetId = window.location.hash.replace(/^#/, '')
    if (!targetId) return
    const el = document.getElementById(targetId)
    if (!el) return
    el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }, [])

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
              url: 'https://logitshop.com',
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
          <div className="w-16 h-0.5 bg-[var(--brand-red)] mx-auto mb-6" style={{ boxShadow: '0 0 10px var(--brand-red-glow)' }} aria-hidden="true" />
          <p className="max-w-xl mx-auto text-white/60 text-base leading-relaxed">
            IDEST accredited servicing for regulators, BCDs, cylinders, and technical diving systems.
          </p>
        </div>

        {/* Service Categories & Pricing */}
        <div className="space-y-16 mb-20">
          {SERVICE_CATEGORIES.map(({ id, title, icon: Icon, description, services }) => (
            <article id={id} key={id} className="border-b border-[var(--charcoal-light)] pb-12">
              <div className="flex items-start gap-4 mb-6">
                <div
                  className="w-12 h-12 rounded-sm flex items-center justify-center bg-[var(--brand-red-dim)] border border-[var(--brand-red)]/30 shrink-0"
                  aria-hidden="true"
                >
                  <Icon size={22} className="text-[var(--brand-red)]" />
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

              {/* Pricing Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-base">
                  <thead>
                    <tr className="border-b border-[var(--charcoal-light)]">
                      <th
                        className="text-left py-3 px-4 font-bold text-white/80"
                        style={{ fontFamily: 'var(--font-rajdhani)' }}
                      >
                        Service
                      </th>
                      <th
                        className="text-right py-3 px-4 font-bold text-[var(--brand-red)]"
                        style={{ fontFamily: 'var(--font-rajdhani)' }}
                      >
                        Standard
                      </th>
                      <th
                        className="text-right py-3 px-4 font-bold text-white/80"
                        style={{ fontFamily: 'var(--font-rajdhani)' }}
                      >
                        Members
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {services.map((svc, idx) => (
                      <tr
                        key={idx}
                        className="border-b border-[var(--charcoal-light)]/40 hover:bg-[var(--charcoal-light)]/5 transition-colors"
                      >
                        <td className="py-4 px-4 text-white/80">
                          {svc.name}
                          {svc.note && (
                            <div className="text-sm text-white/55 mt-1 italic">{svc.note}</div>
                          )}
                        </td>
                        <td className="text-right py-4 px-4 font-bold text-white">
                          {svc.standard ? `£${svc.standard.toFixed(2)}` : '-'}
                        </td>
                        <td className="text-right py-4 px-4 font-bold text-[var(--brand-red)]">
                          {svc.member ? `£${svc.member.toFixed(2)}` : '-'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </article>
          ))}
        </div>

        {/* Pricing Note & CTA Banner */}
        <div
          className="mt-16 relative overflow-hidden border border-[var(--brand-red)]/40 p-8 md:p-12 text-center"
          style={{ background: 'linear-gradient(135deg, var(--brand-red-dim) 0%, transparent 60%)' }}
        >
          <div className="cyber-grid absolute inset-0 opacity-40" aria-hidden="true" />
          <div className="relative z-10">
            <p className="text-white/70 mb-4 max-w-2xl mx-auto text-base">
              <span className="font-bold text-white">All prices include VAT at 20%.</span> Specialist kits or increased kit costs will be confirmed before work begins.
            </p>
            <p className="text-white/65 mb-6 max-w-2xl mx-auto text-base leading-relaxed">
              <span className="font-bold text-white">Members pricing</span> applies to members of our partner dive club, where we are their preferred service provider.
              {' '}
              <a
                href="https://binghamsac.co.uk"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white underline underline-offset-4 decoration-white/30 hover:decoration-white/70 transition-colors"
              >
                binghamsac.co.uk
              </a>
            </p>
            <h3
              className="text-2xl md:text-3xl font-black text-white mb-3"
              style={{ fontFamily: 'var(--font-orbitron)' }}
            >
              BECOME A <span className="text-[var(--brand-red)]">MEMBER</span>
            </h3>
            <p className="text-white/65 mb-6 max-w-md mx-auto text-base">
              Members enjoy discounted servicing rates across all categories and priority 24/7 support for expeditions.
            </p>
            <a
              href="https://binghamsac.co.uk"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-8 py-3.5 bg-[var(--brand-red)] hover:bg-red-600 text-white font-bold tracking-widest uppercase text-sm transition-all duration-200 glow-red"
              style={{ fontFamily: 'var(--font-orbitron)' }}
              aria-label="Join Bingham SAC to access members pricing"
            >
              Join Bingham SAC <ArrowRight size={16} aria-hidden="true" />
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
