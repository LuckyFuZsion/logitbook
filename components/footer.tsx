import { Zap, Mail, MapPin, Instagram } from 'lucide-react'

interface FooterProps {
  onTabChange: (tab: string) => void
}

export default function Footer({ onTabChange }: FooterProps) {
  const goTo = (tab: string, hash?: string) => {
    onTabChange(tab)
    if (hash) window.location.hash = hash
  }

  return (
    <footer
      className="bg-[var(--charcoal)] border-t border-[var(--charcoal-light)] py-12 px-4"
      role="contentinfo"
    >
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-10">
          {/* Brand */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <Zap size={18} className="text-[var(--brand-red)]" aria-hidden="true" />
              <span
                className="text-lg font-black tracking-widest text-white"
                style={{ fontFamily: 'var(--font-orbitron)' }}
              >
                LOGIT<span className="text-[var(--brand-red)]">SHOP</span>
              </span>
            </div>
            <p className="text-sm text-white/60 leading-relaxed">
              IDEST accredited scuba services and professional diving logbooks. Built for performance. Certified for trust.
            </p>
            <div className="pt-1">
              <img
                src="/IDEST_White-300x99.png"
                alt="IDEST accreditation"
                className="h-8 w-auto opacity-90"
                loading="lazy"
              />
            </div>
          </div>

          {/* Quick Links */}
          <nav aria-label="Footer navigation - quick links">
            <h3
              className="text-sm font-black tracking-[0.2em] uppercase text-[var(--brand-red)] mb-4"
              style={{ fontFamily: 'var(--font-orbitron)' }}
            >
              Quick Links
            </h3>
            <ul className="flex flex-col gap-2">
              <li>
                <button
                  type="button"
                  onClick={() => goTo('home', '#home')}
                  className="text-sm text-white/65 hover:text-white transition-colors tracking-wider"
                  style={{ fontFamily: 'var(--font-rajdhani)' }}
                >
                  Home
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => goTo('shop', '#shop')}
                  className="text-sm text-white/65 hover:text-white transition-colors tracking-wider"
                  style={{ fontFamily: 'var(--font-rajdhani)' }}
                >
                  Shop
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => goTo('services', '#services')}
                  className="text-sm text-white/65 hover:text-white transition-colors tracking-wider"
                  style={{ fontFamily: 'var(--font-rajdhani)' }}
                >
                  Services
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => goTo('story', '#story')}
                  className="text-sm text-white/65 hover:text-white transition-colors tracking-wider"
                  style={{ fontFamily: 'var(--font-rajdhani)' }}
                >
                  Our Story
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => goTo('gallery', '#gallery')}
                  className="text-sm text-white/65 hover:text-white transition-colors tracking-wider"
                  style={{ fontFamily: 'var(--font-rajdhani)' }}
                >
                  Gallery
                </button>
              </li>
            </ul>
          </nav>

          {/* Services Links */}
          <nav aria-label="Footer navigation - services">
            <h3
              className="text-sm font-black tracking-[0.2em] uppercase text-[var(--brand-red)] mb-4"
              style={{ fontFamily: 'var(--font-orbitron)' }}
            >
              Services
            </h3>
            <ul className="flex flex-col gap-2">
              <li>
                <button
                  type="button"
                  onClick={() => goTo('services', '#cylinders')}
                  className="text-sm text-white/65 hover:text-white transition-colors tracking-wider"
                  style={{ fontFamily: 'var(--font-rajdhani)' }}
                >
                  Cylinder Services
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => goTo('services', '#regulators')}
                  className="text-sm text-white/65 hover:text-white transition-colors tracking-wider"
                  style={{ fontFamily: 'var(--font-rajdhani)' }}
                >
                  Regulator Services
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => goTo('services', '#bcds')}
                  className="text-sm text-white/65 hover:text-white transition-colors tracking-wider"
                  style={{ fontFamily: 'var(--font-rajdhani)' }}
                >
                  BCD Services
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => goTo('services', '#repairs')}
                  className="text-sm text-white/65 hover:text-white transition-colors tracking-wider"
                  style={{ fontFamily: 'var(--font-rajdhani)' }}
                >
                  Repairs & Custom Work
                </button>
              </li>
            </ul>
          </nav>

          {/* Contact */}
          <address className="not-italic">
            <h3
              className="text-sm font-black tracking-[0.2em] uppercase text-[var(--brand-red)] mb-4"
              style={{ fontFamily: 'var(--font-orbitron)' }}
            >
              Contact
            </h3>
            <ul className="flex flex-col gap-3">
              <li className="flex items-start gap-2 text-sm text-white/65">
                <Mail size={13} className="text-[var(--brand-red)] mt-0.5 shrink-0" aria-hidden="true" />
                <a href="mailto:info@logitshop.com" className="hover:text-white transition-colors">
                  info@logitshop.com
                </a>
              </li>
              <li className="flex items-start gap-2 text-sm text-white/65">
                <Instagram size={13} className="text-[var(--brand-red)] mt-0.5 shrink-0" aria-hidden="true" />
                <a
                  href="https://www.instagram.com/logit.shop"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors"
                >
                  @logit.shop
                </a>
              </li>
              <li className="flex items-start gap-2 text-sm text-white/65">
                <MapPin size={13} className="text-[var(--brand-red)] mt-0.5 shrink-0" aria-hidden="true" />
                <span>logitshop.com</span>
              </li>
            </ul>
          </address>
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-3 pt-6 border-t border-[var(--charcoal-light)]">
          <div className="text-sm text-white/40 space-y-1 text-center md:text-left" style={{ fontFamily: 'var(--font-rajdhani)' }}>
            <p>Copyright © 1998 LOG-it - All Rights Reserved.</p>
            <p>Copyright © 2026 logitshop.com - All Rights Reserved.</p>
            <p>Logitshop LTD. Registered company 15252219. VAT Registered company 2023.</p>
            <p>Registered address 12 Gloucester Road, Grantham, NG318RJ, UK.</p>
          </div>
          <div className="flex items-center gap-4">
            {['Privacy Policy', 'Terms of Service', 'Cookie Policy'].map((link) => (
              link === 'Privacy Policy' ? (
                <a
                  key={link}
                  href="/privacy-policy"
                  className="text-sm text-white/40 hover:text-white/70 transition-colors"
                  style={{ fontFamily: 'var(--font-rajdhani)' }}
                >
                  {link}
                </a>
              ) : (
                <a
                  key={link}
                  href="#"
                  className="text-sm text-white/40 hover:text-white/70 transition-colors"
                  style={{ fontFamily: 'var(--font-rajdhani)' }}
                >
                  {link}
                </a>
              )
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
