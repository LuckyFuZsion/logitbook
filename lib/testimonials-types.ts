export interface Testimonial {
  id: string
  name: string
  role?: string
  text: string
  /** 1–5 stars */
  rating: number
  featured: boolean
  /** YYYY-MM or free text */
  date?: string
}

export interface TestimonialsData {
  items: Testimonial[]
  updatedAt: string
}
