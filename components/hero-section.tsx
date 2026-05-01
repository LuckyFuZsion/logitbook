'use client'

import { useEffect, useRef, useState } from 'react'
import { ChevronDown, ShoppingBag, Wrench, ArrowRight } from 'lucide-react'

interface HeroSectionProps {
  onTabChange: (tab: string) => void
}

const TICKER_ITEMS = [
  'PROFESSIONAL GRADE LOGITBOOK',
  'IDEST ACCREDITED',
  'CERTIFIED DIVING TECHNICIANS',
  'REGULATOR & BCD SERVICING',
  'UNDERWATER EQUIPMENT EXPERTS',
  'DEEP WATER TESTED',
]

export default function HeroSection({ onTabChange }: HeroSectionProps) {
  const [loaded, setLoaded] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const timer = setTimeout(() => setLoaded(true), 100)
    return () => clearTimeout(timer)
  }, [])

  return (
    <section
      className="relative min-h-screen flex flex-col overflow-hidden scanlines"
      aria-label="Hero - Welcome to Logitshop"
    >
      {/* Background video placeholder / fallback image */}
      <div className="absolute inset-0 z-0">
        <video
          ref={videoRef}
          className="w-full h-full object-cover opacity-40"
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          aria-hidden="true"
          poster="/hero-bg.jpg"
        >
          <source src="/download%20(3).mp4" type="video/mp4" />
        </video>
        {/* Static fallback if no video */}
        <img
          src="/hero-dive-scene.jpg"
          alt=""
          className="absolute inset-0 w-full h-full object-cover opacity-50"
          aria-hidden="true"
        />
        {/* Dark overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black" aria-hidden="true" />
        {/* Cyber grid overlay */}
        <div className="absolute inset-0 cyber-grid opacity-60" aria-hidden="true" />
        {/* Red corner accent */}
        <div
          className="absolute top-0 right-0 w-96 h-96 opacity-10"
          style={{
            background: 'radial-gradient(circle at top right, var(--brand-red) 0%, transparent 70%)',
          }}
          aria-hidden="true"
        />
      </div>

      {/* Main Hero Content */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-4 pt-24 pb-16 md:pt-32 text-center">
        {/* Pre-heading badge */}
        <div
          className={`inline-flex items-center gap-2 px-3 py-1.5 mb-6 border border-[var(--brand-red)]/50 bg-[var(--brand-red-dim)] rounded-sm transition-all duration-700 ${
            loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
        >
          <span
            className="w-2 h-2 rounded-full bg-[var(--brand-red)] border-pulse"
            aria-hidden="true"
            style={{ boxShadow: '0 0 6px var(--brand-red-glow)' }}
          />
          <span
            className="text-xs font-semibold tracking-[0.2em] uppercase text-[var(--brand-red)]"
            style={{ fontFamily: 'var(--font-orbitron)' }}
          >
            Professional Diving Platform
          </span>
        </div>

        {/* Main Headline */}
        <h1
          className={`text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-tight text-white leading-none mb-4 text-balance transition-all duration-700 delay-100 ${
            loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
          }`}
          style={{ fontFamily: 'var(--font-orbitron)' }}
        >
          <span className="block">THE LOGITBOOK</span>
          <span
            className="block text-[var(--brand-red)] glow-red-text"
          >
            EXPERIENCE
          </span>
        </h1>

        {/* Sub-heading */}
        <p
          className={`max-w-xl mx-auto text-lg md:text-xl text-white/70 leading-relaxed mb-10 font-medium text-balance transition-all duration-700 delay-200 ${
            loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
          }`}
          style={{ fontFamily: 'var(--font-rajdhani)' }}
        >
          Professional-grade diving log, accredited servicing, and expert technical support for technical divers worldwide.
        </p>

        {/* CTA Buttons */}
        <div
          className={`flex flex-col sm:flex-row gap-4 justify-center transition-all duration-700 delay-300 ${
            loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
          }`}
        >
          <button
            onClick={() => onTabChange('shop')}
            className="group flex items-center justify-center gap-2 px-8 py-4 bg-[var(--brand-red)] hover:bg-red-600 text-white font-bold tracking-widest uppercase text-sm transition-all duration-200 hover:glow-red"
            style={{ fontFamily: 'var(--font-orbitron)' }}
          >
            <ShoppingBag size={18} aria-hidden="true" />
            Shop Now
            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" aria-hidden="true" />
          </button>
          <button
            onClick={() => onTabChange('services')}
            className="group flex items-center justify-center gap-2 px-8 py-4 bg-transparent border border-white/30 hover:border-white/80 text-white font-bold tracking-widest uppercase text-sm transition-all duration-200"
            style={{ fontFamily: 'var(--font-orbitron)' }}
          >
            <Wrench size={18} aria-hidden="true" />
            Our Services
          </button>
        </div>

        {/* Stats */}
        <div
          className={`grid grid-cols-3 gap-8 mt-16 max-w-lg mx-auto w-full transition-all duration-700 delay-500 ${
            loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
          }`}
        >
          {[
            { value: '500+', label: 'Dives Logged' },
            { value: '10K+', label: 'Divers' },
            { value: '20 Yrs', label: 'Accredited' },
          ].map((stat) => (
            <div key={stat.label} className="flex flex-col items-center gap-1">
              <span
                className="text-3xl md:text-4xl font-black text-[var(--brand-red)]"
                style={{ fontFamily: 'var(--font-orbitron)' }}
              >
                {stat.value}
              </span>
              <span className="text-xs font-semibold tracking-widest uppercase text-white/50">
                {stat.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Ticker Tape */}
      <div
        className="relative z-10 border-t border-b border-[var(--brand-red)]/30 bg-[var(--brand-red-dim)] overflow-hidden py-2.5"
        aria-hidden="true"
      >
        <div className="flex ticker-tape whitespace-nowrap">
          {[...TICKER_ITEMS, ...TICKER_ITEMS].map((item, i) => (
            <span key={i} className="flex items-center gap-6 px-6">
              <span
                className="text-xs font-semibold tracking-[0.2em] uppercase text-[var(--brand-red)]"
                style={{ fontFamily: 'var(--font-rajdhani)' }}
              >
                {item}
              </span>
              <span className="text-[var(--brand-red)]/50 text-xs">&#9670;</span>
            </span>
          ))}
        </div>
      </div>

      {/* Scroll indicator */}
      <button
        onClick={() => onTabChange('shop')}
        className="absolute bottom-20 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-1 text-white/40 hover:text-white/80 transition-colors md:bottom-8"
        aria-label="Scroll down to shop"
      >
        <span className="text-xs tracking-widest uppercase" style={{ fontFamily: 'var(--font-rajdhani)' }}>
          Explore
        </span>
        <ChevronDown size={18} className="animate-bounce" aria-hidden="true" />
      </button>
    </section>
  )
}
