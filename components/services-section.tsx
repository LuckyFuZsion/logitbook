'use client'

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

const PROCESS_STEPS = [
  { step: '01', title: 'Contact & Assessment', description: 'Submit a service request. Our team performs an initial assessment within 2 hours.' },
  { step: '02', title: 'Diagnosis & Quote', description: 'On-site or remote diagnosis with transparent pricing and no hidden fees.' },
  { step: '03', title: 'Execution', description: 'Certified technicians execute the service to DIN/ISO specifications.' },
  { step: '04', title: 'Quality Sign-Off', description: 'Rigorous QC checks and a signed completion certificate for your records.' },
]

export default function ServicesSection() {
  return (
    <section
      id="services"
      className="min-h-screen bg-background py-20 px-4"
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
            className="text-xs font-semibold tracking-[0.3em] uppercase text-[var(--brand-red)] mb-3"
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
            <article key={id} className="border-b border-[var(--charcoal-light)] pb-12">
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
                  <p className="text-sm text-white/60">{description}</p>
                </div>
              </div>

              {/* Pricing Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
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
                            <div className="text-xs text-white/50 mt-1 italic">{svc.note}</div>
                          )}
                        </td>
                        <td className="text-right py-4 px-4 font-bold text-white">
                          {svc.standard ? `£${svc.standard.toFixed(2)}` : '—'}
                        </td>
                        <td className="text-right py-4 px-4 font-bold text-[var(--brand-red)]">
                          {svc.member ? `£${svc.member.toFixed(2)}` : '—'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </article>
          ))}
        </div>

        {/* Process Steps */}
        <div className="relative">
          <div className="text-center mb-10">
            <h3
              className="text-2xl md:text-3xl font-black text-white"
              style={{ fontFamily: 'var(--font-orbitron)' }}
            >
              HOW IT <span className="text-[var(--brand-red)]">WORKS</span>
            </h3>
          </div>

          {/* Connecting line */}
          <div
            className="hidden md:block absolute top-[calc(50%+2rem)] left-0 right-0 h-px bg-[var(--charcoal-light)] mx-8"
            aria-hidden="true"
          />

          <ol className="grid grid-cols-1 md:grid-cols-4 gap-6 relative">
            {PROCESS_STEPS.map(({ step, title, description }) => (
              <li
                key={step}
                className="glass-card p-5 border border-[var(--charcoal-light)] flex flex-col gap-3"
              >
                <div className="flex items-center gap-3">
                  <span
                    className="text-3xl font-black text-[var(--brand-red)]/30"
                    style={{ fontFamily: 'var(--font-orbitron)' }}
                    aria-hidden="true"
                  >
                    {step}
                  </span>
                  <div className="w-8 h-0.5 bg-[var(--brand-red)]/30" aria-hidden="true" />
                </div>
                <h4
                  className="text-sm font-bold text-white"
                  style={{ fontFamily: 'var(--font-orbitron)' }}
                >
                  {title}
                </h4>
                <p className="text-xs text-white/55 leading-relaxed">{description}</p>
              </li>
            ))}
          </ol>
        </div>

        {/* Pricing Note & CTA Banner */}
        <div
          className="mt-16 relative overflow-hidden border border-[var(--brand-red)]/40 p-8 md:p-12 text-center"
          style={{ background: 'linear-gradient(135deg, var(--brand-red-dim) 0%, transparent 60%)' }}
        >
          <div className="cyber-grid absolute inset-0 opacity-40" aria-hidden="true" />
          <div className="relative z-10">
            <p className="text-white/70 mb-4 max-w-2xl mx-auto">
              <span className="font-bold text-white">All prices include VAT at 20%.</span> Specialist kits or increased kit costs will be confirmed before work begins.
            </p>
            <h3
              className="text-2xl md:text-3xl font-black text-white mb-3"
              style={{ fontFamily: 'var(--font-orbitron)' }}
            >
              BECOME A <span className="text-[var(--brand-red)]">MEMBER</span>
            </h3>
            <p className="text-white/60 mb-6 max-w-md mx-auto">
              Members enjoy discounted servicing rates across all categories and priority 24/7 support for expeditions.
            </p>
            <button
              className="inline-flex items-center gap-2 px-8 py-3.5 bg-[var(--brand-red)] hover:bg-red-600 text-white font-bold tracking-widest uppercase text-sm transition-all duration-200 glow-red"
              style={{ fontFamily: 'var(--font-orbitron)' }}
              aria-label="Join membership program"
            >
              Join Membership <ArrowRight size={16} aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
