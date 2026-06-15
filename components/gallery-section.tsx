'use client'

import { useState, useRef, useCallback, useEffect } from 'react'
import { ZoomIn, ChevronLeft, ChevronRight, X } from 'lucide-react'
import type { GalleryGridItem, GalleryBeforeAfter, ResolvedGalleryData } from '@/lib/gallery-types'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from '@/components/ui/carousel'

function BeforeAfterSlider({
  beforeSrc,
  afterSrc,
  beforeAlt,
  afterAlt,
}: Omit<GalleryBeforeAfter, 'id' | 'title'>) {
  const [sliderPos, setSliderPos] = useState(50)
  const [frame, setFrame] = useState<{ width: number; height: number } | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const dragging = useRef(false)

  /** Fit both images without cropping: shared frame, max aspect = wider of the two (letterbox the other). */
  useEffect(() => {
    let cancelled = false
    const before = new window.Image()
    const after = new window.Image()

    const compute = () => {
      if (cancelled) return
      if (!before.naturalWidth || !after.naturalWidth) return
      const ar1 = before.naturalWidth / before.naturalHeight
      const ar2 = after.naturalWidth / after.naturalHeight
      const ar = Math.max(ar1, ar2)

      const parentW = containerRef.current?.parentElement?.clientWidth
      const maxW = Math.min(
        parentW && parentW > 0 ? parentW : 896,
        typeof window !== 'undefined' ? window.innerWidth - 32 : 896,
      )
      const maxH = typeof window !== 'undefined' ? window.innerHeight * 0.72 : 520

      let w = maxW
      let h = w / ar
      if (h > maxH) {
        h = maxH
        w = h * ar
      }
      setFrame({ width: Math.round(w), height: Math.round(h) })
    }

    let pending = 0
    const onOneLoad = () => {
      pending++
      if (pending >= 2) compute()
    }

    before.onload = onOneLoad
    after.onload = onOneLoad
    before.onerror = onOneLoad
    after.onerror = onOneLoad
    before.src = beforeSrc
    after.src = afterSrc

    const onResize = () => compute()
    window.addEventListener('resize', onResize)

    const parent = containerRef.current?.parentElement
    const ro =
      typeof ResizeObserver !== 'undefined' && parent
        ? new ResizeObserver(() => compute())
        : null
    if (ro && parent) ro.observe(parent)

    return () => {
      cancelled = true
      ro?.disconnect()
      window.removeEventListener('resize', onResize)
    }
  }, [beforeSrc, afterSrc])

  const updatePos = useCallback((clientX: number) => {
    if (!containerRef.current) return
    const rect = containerRef.current.getBoundingClientRect()
    const pos = Math.min(100, Math.max(0, ((clientX - rect.left) / rect.width) * 100))
    setSliderPos(pos)
  }, [])

  const onMouseDown = () => {
    dragging.current = true
  }
  const onMouseUp = () => {
    dragging.current = false
  }
  const onMouseMove = (e: React.MouseEvent) => {
    if (dragging.current) updatePos(e.clientX)
  }
  const onTouchMove = (e: React.TouchEvent) => {
    updatePos(e.touches[0].clientX)
  }

  return (
    <div
      ref={containerRef}
      className="relative mx-auto w-full overflow-hidden cursor-ew-resize select-none bg-black touch-pan-y"
      style={
        frame
          ? { width: frame.width, height: frame.height, maxWidth: '100%' }
          : { aspectRatio: '16 / 9' }
      }
      onMouseDown={onMouseDown}
      onMouseUp={onMouseUp}
      onMouseLeave={onMouseUp}
      onMouseMove={onMouseMove}
      onTouchMove={onTouchMove}
      role="img"
      aria-label="Before and after comparison slider - drag to reveal the difference"
    >
      <img
        src={afterSrc}
        alt={afterAlt}
        className="absolute inset-0 w-full h-full object-contain object-center"
        draggable={false}
      />

      <div
        className="absolute inset-0 overflow-hidden"
        style={{ clipPath: `inset(0 ${100 - sliderPos}% 0 0)` }}
        aria-hidden="true"
      >
        <img
          src={beforeSrc}
          alt={beforeAlt}
          className="absolute inset-0 w-full h-full object-contain object-center"
          draggable={false}
        />
        <div className="absolute inset-0 bg-black/20" />
      </div>

      <div
        className="absolute top-0 bottom-0 w-0.5 bg-[var(--brand-red)] pointer-events-none"
        style={{ left: `${sliderPos}%`, boxShadow: '0 0 10px var(--brand-red-glow)' }}
        aria-hidden="true"
      >
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-[var(--brand-red)] flex items-center justify-center"
          style={{ boxShadow: '0 0 15px var(--brand-red-glow)' }}
          aria-hidden="true"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <path
              d="M5 8l-3-3m0 0l3-3M2 5h12M11 8l3 3m0 0l-3 3M14 11H2"
              stroke="white"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </div>

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

function BeforeAfterCarousel({ slides }: { slides: GalleryBeforeAfter[] }) {
  const [api, setApi] = useState<CarouselApi | null>(null)
  const [current, setCurrent] = useState(0)

  useEffect(() => {
    if (!api) return
    setCurrent(api.selectedScrollSnap())
    const onSelect = () => setCurrent(api.selectedScrollSnap())
    api.on('select', onSelect)
    return () => {
      api.off('select', onSelect)
    }
  }, [api])

  const loop = slides.length > 1

  if (slides.length === 0) {
    return (
      <div className="max-w-3xl mx-auto aspect-video bg-[var(--charcoal)] animate-pulse border border-[var(--charcoal-light)]" />
    )
  }

  return (
    <div className="relative w-full max-w-3xl mx-auto">
      <Carousel
        opts={{
          loop,
          align: 'center',
          duration: 22,
          watchDrag: false,
        }}
        setApi={setApi}
        className="w-full"
      >
        <CarouselContent className="-ml-2 sm:-ml-3">
          {slides.map((slide) => (
            <CarouselItem key={slide.id} className="pl-2 sm:pl-3 basis-full">
              <div className="rounded-sm border border-[var(--charcoal-light)] bg-gradient-to-b from-black/50 to-black/80 overflow-hidden shadow-[0_12px_48px_rgba(0,0,0,0.45)] ring-1 ring-white/5 p-1.5 sm:p-2.5">
                {slide.title.trim() ? (
                  <h4
                    className="text-center text-sm sm:text-base font-bold text-white mb-2 sm:mb-3 px-1 tracking-wide text-balance"
                    style={{ fontFamily: 'var(--font-orbitron)' }}
                  >
                    {slide.title.trim()}
                  </h4>
                ) : null}
                <BeforeAfterSlider
                  beforeSrc={slide.beforeSrc}
                  afterSrc={slide.afterSrc}
                  beforeAlt={slide.beforeAlt}
                  afterAlt={slide.afterAlt}
                />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        {slides.length > 1 && (
          <>
            <CarouselPrevious
              variant="outline"
              className="size-9 sm:size-10 z-10 border-white/30 bg-black/85 text-white shadow-lg shadow-black/40 hover:bg-black hover:text-white hover:border-[var(--brand-red)]/60 disabled:opacity-25 left-1 sm:left-0 md:-left-1"
            />
            <CarouselNext
              variant="outline"
              className="size-9 sm:size-10 z-10 border-white/30 bg-black/85 text-white shadow-lg shadow-black/40 hover:bg-black hover:text-white hover:border-[var(--brand-red)]/60 disabled:opacity-25 right-1 sm:right-0 md:-right-1"
            />
          </>
        )}
      </Carousel>

      {slides.length > 1 && (
        <div
          className="flex flex-wrap justify-center gap-2 sm:gap-2.5 mt-6 px-2"
          role="tablist"
          aria-label="Choose a before and after comparison"
        >
          {slides.map((s, i) => (
            <button
              key={s.id}
              type="button"
              role="tab"
              aria-selected={i === current}
              className={`h-2 sm:h-2.5 rounded-full transition-all duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--brand-red)] ${
                i === current
                  ? 'w-9 sm:w-10 bg-[var(--brand-red)] shadow-[0_0_12px_var(--brand-red-glow)]'
                  : 'w-2 sm:w-2.5 bg-white/20 hover:bg-white/45'
              }`}
              onClick={() => api?.scrollTo(i)}
              aria-label={
                slides[i]?.title.trim()
                  ? `${slides[i].title.trim()} — slide ${i + 1} of ${slides.length}`
                  : `Show comparison ${i + 1} of ${slides.length}`
              }
            />
          ))}
        </div>
      )}
    </div>
  )
}

function GalleryMediaCarousel({
  items,
  onOpen,
}: {
  items: GalleryGridItem[]
  onOpen: (img: GalleryGridItem) => void
}) {
  if (items.length === 0) return null

  const loop = items.length > 4

  return (
    <div className="relative w-full">
      <Carousel
        opts={{
          align: 'start',
          loop,
          duration: 22,
          watchDrag: true,
        }}
        className="w-full"
        aria-label="Image gallery carousel"
      >
        <CarouselContent className="-ml-3 sm:-ml-4">
          {items.map((img) => (
            <CarouselItem
              key={img.id}
              className="pl-3 sm:pl-4 basis-[48%] sm:basis-[32%] md:basis-1/4 min-w-0"
            >
              <button
                type="button"
                onClick={() => onOpen(img)}
                className="group relative overflow-hidden aspect-square w-full bg-[var(--charcoal)] border border-[var(--charcoal-light)] hover:border-[var(--brand-red)]/50 transition-all duration-300"
                aria-label={`View full size: ${img.caption}`}
              >
                <img
                  src={img.src}
                  alt={img.alt}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  loading="lazy"
                  draggable={false}
                />
                <div
                  className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-300 flex items-center justify-center"
                  aria-hidden="true"
                >
                  <ZoomIn
                    size={24}
                    className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                  />
                </div>
                <div
                  className="absolute bottom-0 left-0 right-0 py-2 px-3 bg-black/70 translate-y-full group-hover:translate-y-0 transition-transform duration-300"
                  aria-hidden="true"
                >
                  <span
                    className="text-[10px] font-bold tracking-widest uppercase text-white line-clamp-2 text-left"
                    style={{ fontFamily: 'var(--font-orbitron)' }}
                  >
                    {img.caption}
                  </span>
                </div>
              </button>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious
          variant="outline"
          className="flex size-8 sm:size-9 md:size-10 z-10 border-white/30 bg-black/85 text-white shadow-lg shadow-black/40 hover:bg-black hover:text-white hover:border-[var(--brand-red)]/60 disabled:opacity-25 -left-1 sm:left-0 md:-left-4"
        />
        <CarouselNext
          variant="outline"
          className="flex size-8 sm:size-9 md:size-10 z-10 border-white/30 bg-black/85 text-white shadow-lg shadow-black/40 hover:bg-black hover:text-white hover:border-[var(--brand-red)]/60 disabled:opacity-25 -right-1 sm:right-0 md:-right-4"
        />
      </Carousel>
      <p className="text-center text-white/45 text-xs mt-4 tracking-wide">
        Swipe, drag, or use the arrows to browse
      </p>
    </div>
  )
}

/* ──────── Lightbox ──────── */

function Lightbox({
  items,
  index,
  onClose,
  onNav,
}: {
  items: GalleryGridItem[]
  index: number
  onClose: () => void
  onNav: (next: number) => void
}) {
  const item = items[index]
  const total = items.length
  const touchStartX = useRef<number | null>(null)

  /* Keyboard navigation */
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowRight') onNav((index + 1) % total)
      if (e.key === 'ArrowLeft') onNav((index - 1 + total) % total)
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [index, total, onClose, onNav])

  /* Prevent background scroll */
  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [])

  /* Touch swipe */
  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX
  }
  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return
    const dx = e.changedTouches[0].clientX - touchStartX.current
    touchStartX.current = null
    if (Math.abs(dx) < 40) return
    if (dx < 0) onNav((index + 1) % total)
    else onNav((index - 1 + total) % total)
  }

  if (!item) return null

  return (
    <div
      className="fixed inset-0 z-[100] bg-black/96 flex flex-col items-center justify-center"
      role="dialog"
      aria-modal="true"
      aria-label={`Image ${index + 1} of ${total}: ${item.caption}`}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      {/* Top bar */}
      <div className="absolute top-0 left-0 right-0 flex items-center justify-between px-4 py-3 z-10">
        <span
          className="text-white/50 text-xs font-bold tracking-widest"
          style={{ fontFamily: 'var(--font-orbitron)' }}
        >
          {index + 1} / {total}
        </span>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close lightbox"
          className="flex items-center justify-center w-9 h-9 border border-white/20 bg-white/5 hover:bg-white/15 text-white/70 hover:text-white transition-colors"
        >
          <X size={18} />
        </button>
      </div>

      {/* Prev arrow */}
      {total > 1 && (
        <button
          type="button"
          onClick={() => onNav((index - 1 + total) % total)}
          aria-label="Previous image"
          className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 z-10 flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 border border-white/25 bg-black/70 hover:bg-black hover:border-[var(--brand-red)]/60 text-white transition-colors"
        >
          <ChevronLeft size={22} />
        </button>
      )}

      {/* Image */}
      <div className="relative flex items-center justify-center w-full h-full px-14 sm:px-20 py-16">
        <img
          key={item.id}
          src={item.src}
          alt={item.alt}
          className="max-w-full max-h-[80vh] object-contain border border-[var(--charcoal-light)] shadow-[0_0_60px_rgba(0,0,0,0.8)]"
          draggable={false}
        />
      </div>

      {/* Next arrow */}
      {total > 1 && (
        <button
          type="button"
          onClick={() => onNav((index + 1) % total)}
          aria-label="Next image"
          className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 z-10 flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 border border-white/25 bg-black/70 hover:bg-black hover:border-[var(--brand-red)]/60 text-white transition-colors"
        >
          <ChevronRight size={22} />
        </button>
      )}

      {/* Bottom caption + dot strip */}
      <div className="absolute bottom-0 left-0 right-0 flex flex-col items-center gap-3 pb-4 px-4 z-10">
        {item.caption && (
          <p
            className="text-white/60 text-xs font-bold tracking-widest uppercase text-center"
            style={{ fontFamily: 'var(--font-orbitron)' }}
          >
            {item.caption}
          </p>
        )}
        {total > 1 && (
          <div className="flex gap-1.5 flex-wrap justify-center" aria-hidden="true">
            {items.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => onNav(i)}
                aria-label={`Go to image ${i + 1}`}
                className={`rounded-full transition-all duration-200 ${
                  i === index
                    ? 'w-5 h-2 bg-[var(--brand-red)] shadow-[0_0_8px_var(--brand-red-glow)]'
                    : 'w-2 h-2 bg-white/25 hover:bg-white/50'
                }`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

/* ──────── Main section ──────── */

export default function GallerySection({
  bgClassName = 'bg-background',
  initialData,
}: {
  bgClassName?: string
  initialData?: ResolvedGalleryData
}) {
  const [data, setData] = useState<ResolvedGalleryData | null>(initialData ?? null)
  const [loadError, setLoadError] = useState<string | null>(null)

  useEffect(() => {
    if (initialData) return
    let cancelled = false
    fetch('/api/gallery')
      .then((r) => {
        if (!r.ok) throw new Error('Could not load gallery')
        return r.json()
      })
      .then((json: ResolvedGalleryData) => {
        if (!cancelled) setData(json)
      })
      .catch(() => {
        if (!cancelled) setLoadError('Gallery could not be loaded.')
      })
    return () => { cancelled = true }
  }, [initialData])

  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)

  const grid = data?.grid ?? []
  const beforeAfterSlides = data?.beforeAfterSlides ?? []

  return (
    <section
      id="gallery"
      className={`min-h-screen ${bgClassName} py-20 px-4`}
      aria-labelledby="gallery-heading"
    >
      <div className="max-w-7xl mx-auto">
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
          <div
            className="w-16 h-0.5 bg-[var(--brand-red)] mx-auto mb-6"
            style={{ boxShadow: '0 0 10px var(--brand-red-glow)' }}
            aria-hidden="true"
          />
        </div>

        <div className="mb-16 md:mb-20">
          <h3
            className="text-lg md:text-xl font-bold text-white text-center mb-3"
            style={{ fontFamily: 'var(--font-orbitron)' }}
          >
            Before and After{' '}
            <span className="text-[var(--brand-red)]">Pictures</span>
          </h3>
          <p className="text-center text-white/50 text-sm mb-8 max-w-lg mx-auto leading-relaxed">
            Use the arrow buttons or dots to switch comparisons. Drag on each image to compare before and after.
          </p>
          {!data && !loadError ? (
            <div
              className="max-w-3xl mx-auto aspect-video bg-[var(--charcoal)] animate-pulse border border-[var(--charcoal-light)] rounded-sm"
              aria-hidden="true"
            />
          ) : (
            <BeforeAfterCarousel slides={beforeAfterSlides} />
          )}
        </div>

        <h3
          className="text-lg md:text-xl font-bold text-white text-center mb-3"
          style={{ fontFamily: 'var(--font-orbitron)' }}
        >
          IMAGE <span className="text-[var(--brand-red)]">GALLERY</span>
        </h3>
        <p className="text-center text-white/50 text-sm mb-8 max-w-xl mx-auto">
          Swipe, drag, or use the arrows to browse. Click any photo to view full size.
        </p>

        {loadError && (
          <p className="text-center text-red-400 text-sm mb-6" role="alert">
            {loadError}
          </p>
        )}

        {!data && !loadError && (
          <div className="flex gap-3 -ml-3 pl-3 overflow-hidden mb-8" aria-hidden="true">
            {[1, 2, 3, 4].map((k) => (
              <div
                key={k}
                className="min-w-[48%] md:min-w-[23%] aspect-square bg-[var(--charcoal)] animate-pulse border border-[var(--charcoal-light)] shrink-0"
              />
            ))}
          </div>
        )}

        <GalleryMediaCarousel
          items={grid}
          onOpen={(img) => setLightboxIndex(grid.findIndex((g) => g.id === img.id))}
        />
      </div>

      {lightboxIndex !== null && grid.length > 0 && (
        <Lightbox
          items={grid}
          index={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
          onNav={setLightboxIndex}
        />
      )}
    </section>
  )
}
