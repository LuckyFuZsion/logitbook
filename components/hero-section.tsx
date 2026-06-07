'use client'

import { useEffect, useRef, useState } from 'react'
import { ChevronDown, ShoppingBag, Wrench, ArrowRight } from 'lucide-react'
import type { HeroData } from '@/lib/hero-types'
import { DEFAULT_HERO } from '@/lib/hero-defaults'
import { HERO_LOGO_SRC, SITE_LOGO_ALT } from '@/lib/site-logo'

interface HeroSectionProps {
  onTabChange: (tab: string) => void
}

export default function HeroSection({ onTabChange }: HeroSectionProps) {
  const [loaded, setLoaded] = useState(false)
  const [heroData, setHeroData] = useState<HeroData>(DEFAULT_HERO)
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    fetch('/api/hero').then(r => r.json()).then((j: { data: HeroData }) => setHeroData(j.data)).catch(() => {})
  }, [])

  const goTo = (id: string) => {
    onTabChange(id)
    if (typeof window === 'undefined') return
    if (id === 'shop') {
      window.location.assign('/shop')
      return
    }
    const el = document.getElementById(id)
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' })
      window.location.hash = `#${id}`
    }
  }

  useEffect(() => {
    const timer = setTimeout(() => setLoaded(true), 100)
    return () => clearTimeout(timer)
  }, [])

  return (
    <section
      id="home"
      className="relative min-h-screen flex flex-col overflow-hidden scanlines"
      aria-label="Hero - Welcome to Logitshop"
    >
      {/* Background video placeholder / fallback image */}
      <div className="absolute inset-0 z-0">
        <video
          ref={videoRef}
          className="w-full h-full object-cover opacity-[0.30]"
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
          className="absolute inset-0 w-full h-full object-cover opacity-25"
          aria-hidden="true"
        />
        {/* Dark overlay */}
        <div
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(to bottom, rgba(11, 43, 91, 0.35) 0%, rgba(11, 43, 91, 0.15) 45%, rgba(0, 0, 0, 0.45) 100%)',
          }}
          aria-hidden="true"
        />
        {/* Cyber grid overlay */}
        <div className="absolute inset-0 cyber-grid opacity-45" aria-hidden="true" />
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
        {/* Main Headline */}
        <h1
          className={`mb-4 transition-all duration-700 delay-100 ${
            loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
          }`}
        >
          <img
            src={HERO_LOGO_SRC}
            alt={SITE_LOGO_ALT}
            className="mx-auto h-[17.6rem] sm:h-[22rem] md:h-[26.5rem] lg:h-[31rem] w-auto max-w-[min(100%,56rem)]"
          />
        </h1>

        {/* Sub-heading */}
        <p
          className={`max-w-xl mx-auto text-lg md:text-xl text-white/70 leading-relaxed mb-10 font-medium text-balance transition-all duration-700 delay-200 ${
            loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
          }`}
          style={{ fontFamily: 'var(--font-rajdhani)' }}
        >
          {heroData.subheading}
        </p>

        <div
          className={`flex justify-center mb-8 transition-all duration-700 delay-250 ${
            loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
          }`}
        >
          <img
            src="/IDEST_White-300x99.png"
            alt="IDEST accredited"
            className="h-8 sm:h-9 w-auto opacity-90"
            loading="lazy"
          />
        </div>

        {/* CTA Buttons */}
        <div
          className={`flex flex-col sm:flex-row gap-4 justify-center transition-all duration-700 delay-300 ${
            loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
          }`}
        >
          <button
            onClick={() => goTo(heroData.cta1Target)}
            className="group flex items-center justify-center gap-2 px-8 py-4 bg-[var(--brand-red)] hover:bg-red-600 text-white font-bold tracking-widest uppercase text-sm transition-all duration-200 hover:glow-red"
            style={{ fontFamily: 'var(--font-orbitron)' }}
          >
            <ShoppingBag size={18} aria-hidden="true" />
            {heroData.cta1Label}
            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" aria-hidden="true" />
          </button>
          <button
            onClick={() => goTo(heroData.cta2Target)}
            className="group flex items-center justify-center gap-2 px-8 py-4 bg-transparent border border-white/30 hover:border-white/80 text-white font-bold tracking-widest uppercase text-sm transition-all duration-200"
            style={{ fontFamily: 'var(--font-orbitron)' }}
          >
            <Wrench size={18} aria-hidden="true" />
            {heroData.cta2Label}
          </button>
        </div>

      </div>

      {/* Ticker Tape */}
      <div
        className="relative z-10 border-t border-b border-[var(--brand-red)]/30 bg-[var(--brand-red-dim)] overflow-hidden py-2.5"
        aria-hidden="true"
      >
        <div className="flex ticker-tape whitespace-nowrap">
          {[...heroData.tickerItems, ...heroData.tickerItems].map((item, i) => (
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
        onClick={() => goTo('shop')}
        className="absolute bottom-20 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-1 text-white/40 hover:text-white/80 transition-colors md:bottom-8"
        aria-label="Explore - jump to shop section"
      >
        <span className="text-xs tracking-widest uppercase" style={{ fontFamily: 'var(--font-rajdhani)' }}>
          Explore
        </span>
        <ChevronDown size={18} className="animate-bounce" aria-hidden="true" />
      </button>
    </section>
  )
}
