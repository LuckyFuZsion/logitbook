'use client'

import { useEffect, useRef, useState } from 'react'
import { Target, TrendingUp, Users, Globe } from 'lucide-react'

const MILESTONES = [
  {
    year: '1988',
    title: 'Kelvin Pearce Creates LOG‑it',
    description: 'A passionate diver from the 1980s created the first LOG‑it logbook to help divers record memories they could look back on for decades.',
  },
  {
    year: '2006',
    title: 'Janet & Justin Take Over',
    description: 'Kelvin passed LOG‑it to Janet and Justin, who modernised the book while keeping its original spirit. They sold across UK, Ireland, and internationally.',
  },
  {
    year: '2023',
    title: 'Dan & Eve Era Begins',
    description: 'On 30 September 2023, LOG‑it was taken over by Dan (Wheelsdan) and his wife Eve. As active divers and instructors, they remain committed to UK manufacturing and premium quality.',
  },
]

const VALUES = [
  { icon: Target, title: 'Long‑Lasting', description: 'Hard‑wearing craftsmanship built to last decades.' },
  { icon: TrendingUp, title: 'Premium Quality', description: 'Uncompromising materials and UK manufacturing.' },
  { icon: Users, title: 'Community‑Driven', description: 'Divers can suggest improvements to the book.' },
  { icon: Globe, title: 'UK Made', description: 'Printed in Dorchester by Henry Ling since day one.' },
]

function useInView(threshold = 0.15) {
  const ref = useRef<HTMLDivElement>(null)
  const [inView, setInView] = useState(false)

  useEffect(() => {
    if (!ref.current) return
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setInView(true) },
      { threshold }
    )
    observer.observe(ref.current)
    return () => observer.disconnect()
  }, [threshold])

  return { ref, inView }
}

export default function BrandStorySection() {
  const { ref: storyRef, inView: storyInView } = useInView()
  const { ref: timelineRef, inView: timelineInView } = useInView()
  const { ref: valuesRef, inView: valuesInView } = useInView()

  return (
    <section
      id="story"
      className="min-h-screen bg-background py-20 px-4 overflow-hidden"
      aria-labelledby="story-heading"
    >
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <p
            className="text-xs font-semibold tracking-[0.3em] uppercase text-[var(--brand-red)] mb-3"
            style={{ fontFamily: 'var(--font-rajdhani)' }}
          >
            Who We Are
          </p>
          <h2
            id="story-heading"
            className="text-4xl md:text-5xl font-black text-white mb-4 text-balance"
            style={{ fontFamily: 'var(--font-orbitron)' }}
          >
            OUR <span className="text-[var(--brand-red)]">STORY</span>
          </h2>
          <div className="w-16 h-0.5 bg-[var(--brand-red)] mx-auto" style={{ boxShadow: '0 0 10px var(--brand-red-glow)' }} aria-hidden="true" />
        </div>

        {/* Main Story Block */}
        <div
          ref={storyRef}
          className={`grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-24 transition-all duration-700 ${
            storyInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <div className="order-2 md:order-1 flex flex-col gap-6">
            <h3
              className="text-2xl md:text-3xl font-black text-white leading-tight"
              style={{ fontFamily: 'var(--font-orbitron)' }}
            >
              THE <span className="text-[var(--brand-red)]">LOG‑IT</span>
              <br />
              <span className="text-[var(--brand-red)]">LOGBOOK</span>
            </h3>
            <p className="text-white/65 leading-relaxed text-base">
              Since 1988, LOG‑it has been the prestigious logbook for divers who value quality, durability, and heritage. Created by Kelvin Pearce, a passionate diver who believed every dive deserved to be remembered with pride.
            </p>
            <p className="text-white/65 leading-relaxed text-base">
              For over three decades, LOG‑it has been trusted by divers across the UK, Ireland, Europe, the USA, New Zealand, and Antarctica. Each edition is printed in the UK by Henry Ling in Dorchester—a commitment to craftsmanship that remains uncompromising.
            </p>
            <div className="flex flex-col gap-3 pt-2">
              {['Navy ink pages', 'Leather‑effect cover', 'UK manufactured', 'Proudly British'].map((point) => (
                <div key={point} className="flex items-center gap-3 text-sm text-white/70">
                  <span
                    className="w-1.5 h-1.5 rounded-full bg-[var(--brand-red)] shrink-0"
                    style={{ boxShadow: '0 0 6px var(--brand-red-glow)' }}
                    aria-hidden="true"
                  />
                  {point}
                </div>
              ))}
            </div>
          </div>

          <div className="order-1 md:order-2 relative">
            <div className="relative overflow-hidden" style={{ clipPath: 'polygon(0 0, 96% 0, 100% 4%, 100% 100%, 4% 100%, 0 96%)' }}>
              <img
                src="/story-bg.jpg"
                alt="Logitshop workshop — technicians at work"
                className="w-full aspect-[4/3] object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-tr from-black/50 to-transparent" aria-hidden="true" />
            </div>
            {/* Corner accent */}
            <div
              className="absolute -top-2 -right-2 w-12 h-12 border-t-2 border-r-2 border-[var(--brand-red)]"
              aria-hidden="true"
            />
            <div
              className="absolute -bottom-2 -left-2 w-12 h-12 border-b-2 border-l-2 border-[var(--brand-red)]"
              aria-hidden="true"
            />
          </div>
        </div>

        {/* Timeline */}
        <div ref={timelineRef}>
          <h3
            className={`text-xl md:text-2xl font-black text-white text-center mb-10 transition-all duration-700 ${
              timelineInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
            style={{ fontFamily: 'var(--font-orbitron)' }}
          >
            THE <span className="text-[var(--brand-red)]">JOURNEY</span>
          </h3>

          <ol className="relative flex flex-col md:flex-row gap-0 md:gap-0" aria-label="Company timeline">
            {/* Horizontal line on desktop */}
            <div className="hidden md:block absolute top-6 left-0 right-0 h-px bg-[var(--charcoal-light)]" aria-hidden="true" />

            {MILESTONES.map(({ year, title, description }, i) => (
              <li
                key={year}
                className={`flex-1 relative pl-0 md:pl-0 transition-all duration-700 ${
                  timelineInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
                }`}
                style={{ transitionDelay: `${i * 100}ms` }}
              >
                {/* Dot */}
                <div className="flex md:flex-col items-start md:items-center gap-4 md:gap-0">
                  <div
                    className="relative z-10 w-3 h-3 rounded-full bg-[var(--brand-red)] border-2 border-black md:mx-auto md:mb-4 mt-1 md:mt-0 shrink-0"
                    style={{ boxShadow: '0 0 8px var(--brand-red-glow)' }}
                    aria-hidden="true"
                  />
                  {/* Content */}
                  <div className="md:text-center flex flex-col gap-1 mb-8 md:mb-0 md:px-4">
                    <span
                      className="text-xs font-black tracking-widest text-[var(--brand-red)]"
                      style={{ fontFamily: 'var(--font-orbitron)' }}
                    >
                      {year}
                    </span>
                    <span
                      className="text-sm font-bold text-white"
                      style={{ fontFamily: 'var(--font-orbitron)' }}
                    >
                      {title}
                    </span>
                    <p className="text-xs text-white/55 leading-relaxed">{description}</p>
                  </div>
                </div>
                {/* Vertical connector on mobile */}
                {i < MILESTONES.length - 1 && (
                  <div className="md:hidden absolute left-[5px] top-5 bottom-0 w-px bg-[var(--charcoal-light)]" aria-hidden="true" />
                )}
              </li>
            ))}
          </ol>
        </div>

        {/* Values */}
        <div ref={valuesRef} className="mt-24">
          <h3
            className={`text-xl md:text-2xl font-black text-white text-center mb-10 transition-all duration-700 ${
              valuesInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
            style={{ fontFamily: 'var(--font-orbitron)' }}
          >
            WHAT WE <span className="text-[var(--brand-red)]">STAND FOR</span>
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {VALUES.map(({ icon: Icon, title, description }, i) => (
              <div
                key={title}
                className={`glass-card p-5 border border-[var(--charcoal-light)] hover:border-[var(--brand-red)]/40 flex flex-col items-center text-center gap-3 transition-all duration-700 ${
                  valuesInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
                }`}
                style={{ transitionDelay: `${i * 80}ms` }}
              >
                <div
                  className="w-10 h-10 rounded-sm flex items-center justify-center bg-[var(--brand-red-dim)] border border-[var(--brand-red)]/30"
                  aria-hidden="true"
                >
                  <Icon size={18} className="text-[var(--brand-red)]" />
                </div>
                <h4
                  className="text-sm font-bold text-white"
                  style={{ fontFamily: 'var(--font-orbitron)' }}
                >
                  {title}
                </h4>
                <p className="text-xs text-white/55 leading-relaxed">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
