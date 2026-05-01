'use client'

import { useState, useRef, useCallback } from 'react'
import { ZoomIn } from 'lucide-react'

const GALLERY_IMAGES = [
  { src: '/gallery-1.jpg', alt: 'Serviced regulator first stage', caption: 'First Stage Service' },
  { src: '/gallery-2.jpg', alt: 'Technical diving equipment organized', caption: 'Technical Setup' },
  { src: '/gallery-3.jpg', alt: 'Certified divemaster with professional gear', caption: 'Expert Team' },
  { src: '/gallery-4.jpg', alt: 'Cylinder hydrostatic test result', caption: 'Safety Test' },
]

function BeforeAfterSlider() {
  const [sliderPos, setSliderPos] = useState(50)
  const containerRef = useRef<HTMLDivElement>(null)
  const dragging = useRef(false)

  const updatePos = useCallback((clientX: number) => {
    if (!containerRef.current) return
    const rect = containerRef.current.getBoundingClientRect()
    const pos = Math.min(100, Math.max(0, ((clientX - rect.left) / rect.width) * 100))
    setSliderPos(pos)
  }, [])

  const onMouseDown = () => { dragging.current = true }
  const onMouseUp = () => { dragging.current = false }
  const onMouseMove = (e: React.MouseEvent) => { if (dragging.current) updatePos(e.clientX) }
  const onTouchMove = (e: React.TouchEvent) => { updatePos(e.touches[0].clientX) }

  return (
    <div
      ref={containerRef}
      className="relative w-full aspect-[16/9] overflow-hidden cursor-ew-resize select-none"
      onMouseDown={onMouseDown}
      onMouseUp={onMouseUp}
      onMouseLeave={onMouseUp}
      onMouseMove={onMouseMove}
      onTouchMove={onTouchMove}
      role="img"
      aria-label="Before and after comparison slider — drag to reveal the difference"
    >
      {/* After image (full) */}
      <img
        src="/regulator-after.jpg"
        alt="After — serviced regulator"
        className="absolute inset-0 w-full h-full object-cover"
        draggable={false}
      />

      {/* Before image (clipped) */}
      <div
        className="absolute inset-0 overflow-hidden"
        style={{ clipPath: `inset(0 ${100 - sliderPos}% 0 0)` }}
        aria-hidden="true"
      >
        <img
          src="/regulator-before.jpg"
          alt="Before — corroded regulator"
          className="absolute inset-0 w-full h-full object-cover"
          draggable={false}
        />
        {/* Before overlay */}
        <div className="absolute inset-0 bg-black/20" />
      </div>

      {/* Slider Line */}
      <div
        className="absolute top-0 bottom-0 w-0.5 bg-[var(--brand-red)] pointer-events-none"
        style={{ left: `${sliderPos}%`, boxShadow: '0 0 10px var(--brand-red-glow)' }}
        aria-hidden="true"
      >
        {/* Handle */}
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-[var(--brand-red)] flex items-center justify-center"
          style={{ boxShadow: '0 0 15px var(--brand-red-glow)' }}
          aria-hidden="true"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <path d="M5 8l-3-3m0 0l3-3M2 5h12M11 8l3 3m0 0l-3 3M14 11H2" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
      </div>

      {/* Labels */}
      <div
        className="absolute top-3 left-3 px-2 py-1 bg-black/70 border border-white/20 text-[10px] font-bold tracking-widest uppercase text-white"
        style={{ fontFamily: 'var(--font-orbitron)' }}
        aria-hidden="true"
      >
        Before
      </div>
      <div
        className="absolute top-3 right-3 px-2 py-1 bg-[var(--brand-red)] text-[10px] font-bold tracking-widest uppercase text-white"
        style={{ fontFamily: 'var(--font-orbitron)' }}
        aria-hidden="true"
      >
        After
      </div>
    </div>
  )
}

export default function GallerySection() {
  const [lightbox, setLightbox] = useState<null | (typeof GALLERY_IMAGES)[0]>(null)

  return (
    <section
      id="gallery"
      className="min-h-screen bg-background py-20 px-4"
      aria-labelledby="gallery-heading"
    >
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <p
            className="text-xs font-semibold tracking-[0.3em] uppercase text-[var(--brand-red)] mb-3"
            style={{ fontFamily: 'var(--font-rajdhani)' }}
          >
            Proven Results
          </p>
          <h2
            id="gallery-heading"
            className="text-4xl md:text-5xl font-black text-white mb-4 text-balance"
            style={{ fontFamily: 'var(--font-orbitron)' }}
          >
            SERVICE <span className="text-[var(--brand-red)]">SHOWCASE</span>
          </h2>
          <div className="w-16 h-0.5 bg-[var(--brand-red)] mx-auto mb-6" style={{ boxShadow: '0 0 10px var(--brand-red-glow)' }} aria-hidden="true" />
        </div>

        {/* Before / After Slider */}
        <div className="mb-16">
          <h3
            className="text-lg font-bold text-white text-center mb-4"
            style={{ fontFamily: 'var(--font-orbitron)' }}
          >
            REGULATOR <span className="text-[var(--brand-red)]">RESTORATION</span>
          </h3>
          <p className="text-center text-white/50 text-sm mb-6">Drag the slider to see how we restore corroded regulators</p>
          <div className="max-w-3xl mx-auto border border-[var(--charcoal-light)] overflow-hidden">
            <BeforeAfterSlider />
          </div>
        </div>

        {/* Grid Gallery */}
        <h3
          className="text-lg font-bold text-white text-center mb-8"
          style={{ fontFamily: 'var(--font-orbitron)' }}
        >
          RECENT <span className="text-[var(--brand-red)]">PROJECTS</span>
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4" role="list" aria-label="Gallery images">
          {GALLERY_IMAGES.map((img, i) => (
            <button
              key={i}
              onClick={() => setLightbox(img)}
              className="group relative overflow-hidden aspect-square bg-[var(--charcoal)] border border-[var(--charcoal-light)] hover:border-[var(--brand-red)]/50 transition-all duration-300"
              aria-label={`View full size: ${img.caption}`}
              role="listitem"
            >
              <img
                src={img.src}
                alt={img.alt}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-300 flex items-center justify-center" aria-hidden="true">
                <ZoomIn size={24} className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
              </div>
              <div
                className="absolute bottom-0 left-0 right-0 py-2 px-3 bg-black/70 translate-y-full group-hover:translate-y-0 transition-transform duration-300"
                aria-hidden="true"
              >
                <span
                  className="text-[10px] font-bold tracking-widest uppercase text-white"
                  style={{ fontFamily: 'var(--font-orbitron)' }}
                >
                  {img.caption}
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Lightbox */}
      {lightbox && (
        <div
          className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center p-4"
          onClick={() => setLightbox(null)}
          role="dialog"
          aria-modal="true"
          aria-label={`Image: ${lightbox.caption}`}
        >
          <button
            className="absolute top-4 right-4 text-white/60 hover:text-white text-sm font-bold tracking-widest uppercase"
            onClick={() => setLightbox(null)}
            style={{ fontFamily: 'var(--font-orbitron)' }}
            aria-label="Close lightbox"
          >
            Close &#x2715;
          </button>
          <img
            src={lightbox.src}
            alt={lightbox.alt}
            className="max-w-full max-h-[85vh] object-contain border border-[var(--charcoal-light)]"
            onClick={(e) => e.stopPropagation()}
          />
          <p
            className="absolute bottom-6 text-white/60 text-xs font-bold tracking-widest uppercase"
            style={{ fontFamily: 'var(--font-orbitron)' }}
            aria-hidden="true"
          >
            {lightbox.caption}
          </p>
        </div>
      )}
    </section>
  )
}
