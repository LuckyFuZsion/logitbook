import { Zap, Mail, Phone, MapPin } from 'lucide-react'

export default function Footer() {
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
            <p className="text-xs text-white/50 leading-relaxed">
              IDEST accredited scuba services and professional diving logbooks. Built for performance. Certified for trust.
            </p>
          </div>

          {/* Quick Links */}
          <nav aria-label="Footer navigation — quick links">
            <h3
              className="text-xs font-black tracking-[0.2em] uppercase text-[var(--brand-red)] mb-4"
              style={{ fontFamily: 'var(--font-orbitron)' }}
            >
              Quick Links
            </h3>
            <ul className="flex flex-col gap-2">
              {['Home', 'Shop', 'Services', 'Our Story', 'Gallery'].map((link) => (
                <li key={link}>
                  <a
                    href="#"
                    className="text-xs text-white/55 hover:text-white transition-colors tracking-wider"
                    style={{ fontFamily: 'var(--font-rajdhani)' }}
                  >
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          {/* Services Links */}
          <nav aria-label="Footer navigation — services">
            <h3
              className="text-xs font-black tracking-[0.2em] uppercase text-[var(--brand-red)] mb-4"
              style={{ fontFamily: 'var(--font-orbitron)' }}
            >
              Services
            </h3>
            <ul className="flex flex-col gap-2">
              {['Maintenance', 'Diagnostics', 'Technical Support', 'Emergency Response', 'Accreditation'].map((s) => (
                <li key={s}>
                  <a
                    href="#"
                    className="text-xs text-white/55 hover:text-white transition-colors tracking-wider"
                    style={{ fontFamily: 'var(--font-rajdhani)' }}
                  >
                    {s}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          {/* Contact */}
          <address className="not-italic">
            <h3
              className="text-xs font-black tracking-[0.2em] uppercase text-[var(--brand-red)] mb-4"
              style={{ fontFamily: 'var(--font-orbitron)' }}
            >
              Contact
            </h3>
            <ul className="flex flex-col gap-3">
              <li className="flex items-start gap-2 text-xs text-white/55">
                <Mail size={13} className="text-[var(--brand-red)] mt-0.5 shrink-0" aria-hidden="true" />
                <a href="mailto:info@logitshop.com" className="hover:text-white transition-colors">
                  info@logitshop.com
                </a>
              </li>
              <li className="flex items-start gap-2 text-xs text-white/55">
                <Phone size={13} className="text-[var(--brand-red)] mt-0.5 shrink-0" aria-hidden="true" />
                <a href="tel:+1800000000" className="hover:text-white transition-colors">
                  +1 (800) 000-0000
                </a>
              </li>
              <li className="flex items-start gap-2 text-xs text-white/55">
                <MapPin size={13} className="text-[var(--brand-red)] mt-0.5 shrink-0" aria-hidden="true" />
                <span>logitshop.com</span>
              </li>
            </ul>
          </address>
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-3 pt-6 border-t border-[var(--charcoal-light)]">
          <p className="text-xs text-white/30" style={{ fontFamily: 'var(--font-rajdhani)' }}>
            &copy; {new Date().getFullYear()} Logitshop. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            {['Privacy Policy', 'Terms of Service', 'Cookie Policy'].map((link) => (
              <a
                key={link}
                href="#"
                className="text-xs text-white/30 hover:text-white/60 transition-colors"
                style={{ fontFamily: 'var(--font-rajdhani)' }}
              >
                {link}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
