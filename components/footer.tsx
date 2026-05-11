'use client'

import { useEffect, useState } from 'react'
import { Zap, Mail, MapPin, Instagram, Phone, Clock } from 'lucide-react'
import type { ContactData } from '@/lib/contact-types'
import type { HoursData } from '@/lib/hours-types'
import { DEFAULT_CONTACT } from '@/lib/contact-defaults'
import { DEFAULT_HOURS } from '@/lib/hours-defaults'

interface FooterProps {
  onTabChange: (tab: string) => void
}

export default function Footer({ onTabChange }: FooterProps) {
  const [contact, setContact] = useState<ContactData>(DEFAULT_CONTACT)
  const [hours, setHours] = useState<HoursData>(DEFAULT_HOURS)

  useEffect(() => {
    fetch('/api/contact').then(r => r.json()).then((j: { data: ContactData }) => setContact(j.data)).catch(() => {})
    fetch('/api/hours').then(r => r.json()).then((j: { data: HoursData }) => setHours(j.data)).catch(() => {})
  }, [])

  const goTo = (tab: string, hash?: string) => {
    onTabChange(tab)
    if (typeof window === 'undefined') return
    const path = window.location.pathname
    const onHome = path === '/' || path === ''
    if (!onHome) {
      window.location.assign(tab === 'home' ? '/' : hash || `/#${tab}`)
      return
    }
    if (hash) window.location.hash = hash
  }

  const fullAddress = [
    contact.address.street,
    contact.address.city,
    contact.address.county,
    contact.address.postcode,
  ].filter(Boolean).join(', ')

  const openDays = hours.schedule.filter((d) => !d.closed)

  return (
    <footer
      className="bg-[var(--charcoal)] border-t border-[var(--charcoal-light)] py-12 px-4"
      role="contentinfo"
    >
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 mb-10">

          {/* Brand — spans 2 cols on lg */}
          <div className="lg:col-span-2 flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <Zap size={18} className="text-[var(--brand-red)]" aria-hidden="true" />
              <span
                className="text-lg font-black tracking-widest text-white"
                style={{ fontFamily: 'var(--font-orbitron)' }}
              >
                LOGIT<span className="text-[var(--brand-red)]">SHOP</span>
              </span>
            </div>
            <p className="text-sm text-white/60 leading-relaxed">{contact.tagline}</p>
            <div className="pt-1">
              <img src="/IDEST_White-300x99.png" alt="IDEST accreditation" className="h-8 w-auto opacity-90" loading="lazy" />
            </div>
          </div>

          {/* Quick Links */}
          <nav aria-label="Footer navigation - quick links">
            <h3 className="text-sm font-black tracking-[0.2em] uppercase text-[var(--brand-red)] mb-4" style={{ fontFamily: 'var(--font-orbitron)' }}>Quick Links</h3>
            <ul className="flex flex-col gap-2">
              {[
                { tab: 'home', hash: '#home', label: 'Home' },
                { tab: 'shop', hash: '#shop', label: 'Shop' },
                { tab: 'services', hash: '#services', label: 'Services' },
                { tab: 'testimonials', hash: '#testimonials', label: 'Testimonials' },
                { tab: 'story', hash: '#story', label: 'Our Story' },
                { tab: 'gallery', hash: '#gallery', label: 'Gallery' },
              ].map(({ tab, hash, label }) => (
                <li key={tab}>
                  <button type="button" onClick={() => goTo(tab, hash)} className="text-sm text-white/65 hover:text-white transition-colors tracking-wider" style={{ fontFamily: 'var(--font-rajdhani)' }}>
                    {label}
                  </button>
                </li>
              ))}
            </ul>
          </nav>

          {/* Hours */}
          <div>
            <h3 className="text-sm font-black tracking-[0.2em] uppercase text-[var(--brand-red)] mb-4" style={{ fontFamily: 'var(--font-orbitron)' }}>
              <Clock size={12} className="inline mr-1" aria-hidden="true" />Hours
            </h3>
            <ul className="flex flex-col gap-1.5">
              {hours.schedule.map((row) => (
                <li key={row.day} className="flex justify-between text-xs text-white/60 gap-3">
                  <span className="text-white/50 w-8">{row.day.slice(0, 3)}</span>
                  {row.closed
                    ? <span className="text-white/30 italic">Closed</span>
                    : <span className="tabular-nums">{row.open}–{row.close}</span>
                  }
                </li>
              ))}
            </ul>
            {hours.notes && <p className="text-xs text-white/40 mt-2 leading-relaxed">{hours.notes}</p>}
          </div>

          {/* Contact */}
          <address className="not-italic">
            <h3 className="text-sm font-black tracking-[0.2em] uppercase text-[var(--brand-red)] mb-4" style={{ fontFamily: 'var(--font-orbitron)' }}>Contact</h3>
            <ul className="flex flex-col gap-3">
              <li className="flex items-start gap-2 text-sm text-white/65">
                <Mail size={13} className="text-[var(--brand-red)] mt-0.5 shrink-0" aria-hidden="true" />
                <a href={`mailto:${contact.email}`} className="hover:text-white transition-colors break-all">{contact.email}</a>
              </li>
              {contact.phone && (
                <li className="flex items-start gap-2 text-sm text-white/65">
                  <Phone size={13} className="text-[var(--brand-red)] mt-0.5 shrink-0" aria-hidden="true" />
                  <a href={`tel:${contact.phone.replace(/\s/g, '')}`} className="hover:text-white transition-colors">{contact.phone}</a>
                </li>
              )}
              {contact.instagram && (
                <li className="flex items-start gap-2 text-sm text-white/65">
                  <Instagram size={13} className="text-[var(--brand-red)] mt-0.5 shrink-0" aria-hidden="true" />
                  <a href={contact.instagramUrl} target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">{contact.instagram}</a>
                </li>
              )}
              {fullAddress && (
                <li className="flex items-start gap-2 text-sm text-white/65">
                  <MapPin size={13} className="text-[var(--brand-red)] mt-0.5 shrink-0" aria-hidden="true" />
                  <span>{fullAddress}</span>
                </li>
              )}
            </ul>
          </address>
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-3 pt-6 border-t border-[var(--charcoal-light)]">
          <div className="text-sm text-white/40 space-y-1 text-center md:text-left" style={{ fontFamily: 'var(--font-rajdhani)' }}>
            <p>{contact.copyrightLine1}</p>
            <p>{contact.copyrightLine2}</p>
            <p>{contact.companyName}. Registered company {contact.companyRegNumber}. {contact.vatInfo}.</p>
            {fullAddress && <p>Registered address {fullAddress}.</p>}
          </div>
          <div className="flex items-center gap-4">
            <a href="/privacy-policy" className="text-sm text-white/40 hover:text-white/70 transition-colors" style={{ fontFamily: 'var(--font-rajdhani)' }}>Privacy Policy</a>
            <a href="#" className="text-sm text-white/40 hover:text-white/70 transition-colors" style={{ fontFamily: 'var(--font-rajdhani)' }}>Terms of Service</a>
            <a href="#" className="text-sm text-white/40 hover:text-white/70 transition-colors" style={{ fontFamily: 'var(--font-rajdhani)' }}>Cookie Policy</a>
          </div>
        </div>
      </div>
    </footer>
  )
}
