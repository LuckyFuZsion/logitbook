'use client'

import { Shield } from 'lucide-react'

const ACCREDITATIONS = [
  { name: 'IDEST Accredited', icon: Shield },
  { name: 'IDEST Accredited', icon: Shield },
  { name: 'IDEST Accredited', icon: Shield },
]

export default function AccreditationStrip() {
  return (
    <section
      className="relative bg-gradient-to-r from-[var(--brand-red-dim)] via-transparent to-[var(--brand-red-dim)] border-y border-[var(--brand-red)]/30 py-4 overflow-hidden"
      aria-label="Industry Accreditations"
    >
      {/* Background cyber grid */}
      <div className="cyber-grid absolute inset-0 opacity-20" aria-hidden="true" />

      {/* Marquee container */}
      <div className="relative z-10 flex overflow-hidden">
        <div className="flex marquee-accreditations whitespace-nowrap gap-12 px-12">
          {ACCREDITATIONS.map((acc, i) => {
            const Icon = acc.icon
            return (
              <div
                key={i}
                className="flex items-center gap-3 min-w-fit"
              >
                <div
                  className="w-8 h-8 rounded-sm flex items-center justify-center bg-[var(--brand-red)]/20 border border-[var(--brand-red)]/40"
                  aria-hidden="true"
                >
                  <Icon size={16} className="text-[var(--brand-red)]" />
                </div>
                <span
                  className="text-sm font-semibold tracking-widest uppercase text-white/80"
                  style={{ fontFamily: 'var(--font-orbitron)' }}
                >
                  {acc.name}
                </span>
                <span className="text-[var(--brand-red)]/40 text-sm">&#9670;</span>
              </div>
            )
          })}
        </div>
      </div>

      {/* Fade edges */}
      <div
        className="absolute left-0 top-0 bottom-0 w-12 bg-gradient-to-r from-background to-transparent z-20 pointer-events-none"
        aria-hidden="true"
      />
      <div
        className="absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-background to-transparent z-20 pointer-events-none"
        aria-hidden="true"
      />

      <style>{`
        @keyframes marquee {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-66.666%);
          }
        }
        .marquee-accreditations {
          animation: marquee 20s linear infinite;
        }
        .marquee-accreditations:hover {
          animation-play-state: paused;
        }
      `}</style>
    </section>
  )
}
