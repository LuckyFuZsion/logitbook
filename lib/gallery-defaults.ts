import type {
  GalleryBeforeAfter,
  GalleryData,
  GalleryDataFile,
  GalleryGridItem,
  ResolvedGalleryData,
} from '@/lib/gallery-types'

/** Inline SVG placeholders — same pattern as gallery-section */
export function placeholderSrc(label: string) {
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="1200" height="800">
      <defs>
        <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stop-color="#061a33"/>
          <stop offset="1" stop-color="#0b2b5b"/>
        </linearGradient>
      </defs>
      <rect width="100%" height="100%" fill="url(#g)"/>
      <rect x="48" y="48" width="1104" height="704" fill="none" stroke="rgba(255,255,255,0.18)" stroke-width="3"/>
      <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle"
            font-family="system-ui, -apple-system, Segoe UI, Roboto, Arial" font-size="56"
            fill="rgba(255,255,255,0.85)" letter-spacing="2">${label}</text>
      <text x="50%" y="58%" dominant-baseline="middle" text-anchor="middle"
            font-family="system-ui, -apple-system, Segoe UI, Roboto, Arial" font-size="24"
            fill="rgba(255,255,255,0.55)" letter-spacing="4">PLACEHOLDER IMAGE</text>
    </svg>
  `.trim()

  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`
}

export const DEFAULT_GRID: GalleryGridItem[] = [
  {
    id: 'default-1',
    src: placeholderSrc('FIRST STAGE SERVICE'),
    alt: 'First stage service placeholder',
    caption: 'Placeholder Image - First Stage Service',
  },
  {
    id: 'default-2',
    src: placeholderSrc('TECHNICAL SETUP'),
    alt: 'Technical setup placeholder',
    caption: 'Placeholder Image - Technical Setup',
  },
  {
    id: 'default-3',
    src: placeholderSrc('EXPERT TEAM'),
    alt: 'Expert team placeholder',
    caption: 'Placeholder Image - Expert Team',
  },
  {
    id: 'default-4',
    src: placeholderSrc('SAFETY TEST'),
    alt: 'Safety test placeholder',
    caption: 'Placeholder Image - Safety Test',
  },
]

export const DEFAULT_BEFORE_AFTER_SLIDES: GalleryBeforeAfter[] = [
  {
    id: 'default-ba',
    title: 'Regulator restoration',
    beforeSrc: '/regulator-before.jpg',
    afterSrc: '/regulator-after.jpg',
    beforeAlt: 'Before - corroded regulator',
    afterAlt: 'After - serviced regulator',
  },
]

function normalizeSlide(s: Partial<GalleryBeforeAfter>, fallbackId: string): GalleryBeforeAfter {
  return {
    id: typeof s.id === 'string' && s.id.trim() ? s.id : fallbackId,
    title: typeof s.title === 'string' ? s.title : '',
    beforeSrc: typeof s.beforeSrc === 'string' ? s.beforeSrc : '',
    afterSrc: typeof s.afterSrc === 'string' ? s.afterSrc : '',
    beforeAlt: typeof s.beforeAlt === 'string' ? s.beforeAlt : '',
    afterAlt: typeof s.afterAlt === 'string' ? s.afterAlt : '',
  }
}

function resolvedBeforeAfterSlides(raw: GalleryDataFile | null): GalleryBeforeAfter[] {
  if (raw?.beforeAfterSlides && raw.beforeAfterSlides.length > 0) {
    return raw.beforeAfterSlides.map((s, i) => normalizeSlide(s, `slide-${i}`))
  }
  const legacy = raw?.beforeAfter
  if (legacy && typeof legacy.beforeSrc === 'string' && legacy.beforeSrc.trim()) {
    return [
      normalizeSlide(
        { ...legacy, id: 'legacy' },
        'legacy',
      ),
    ]
  }
  return DEFAULT_BEFORE_AFTER_SLIDES.map((s) => ({ ...s }))
}

export function mergeGalleryData(raw: GalleryDataFile | null): ResolvedGalleryData {
  const grid = raw?.grid?.length ? raw.grid : DEFAULT_GRID
  const beforeAfterSlides = resolvedBeforeAfterSlides(raw)
  return {
    grid,
    beforeAfterSlides,
    updatedAt: raw?.updatedAt ?? new Date(0).toISOString(),
  }
}
