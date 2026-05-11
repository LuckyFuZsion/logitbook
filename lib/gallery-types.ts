export interface GalleryGridItem {
  id: string
  src: string
  alt: string
  caption: string
}

/** One before/after pair in the carousel. */
export interface GalleryBeforeAfter {
  id: string
  /** Shown above the comparison on the site (optional). */
  title: string
  beforeSrc: string
  afterSrc: string
  beforeAlt: string
  afterAlt: string
}

export interface GalleryData {
  grid: GalleryGridItem[]
  beforeAfterSlides: GalleryBeforeAfter[] | null
  updatedAt: string
}

/** Raw file may still contain legacy `beforeAfter` until re-saved. */
export type GalleryDataFile = Partial<GalleryData> & {
  /** @deprecated use beforeAfterSlides */
  beforeAfter?: Omit<GalleryBeforeAfter, 'id'> | null
}

/** Fully resolved gallery for rendering (defaults applied). */
export interface ResolvedGalleryData {
  grid: GalleryGridItem[]
  beforeAfterSlides: GalleryBeforeAfter[]
  updatedAt: string
}
