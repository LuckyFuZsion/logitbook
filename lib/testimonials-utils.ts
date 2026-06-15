import type { Testimonial } from '@/lib/testimonials-types'

/** Max reviews shown on the homepage (desktop). */
export const HOME_FEATURED_REVIEWS_LIMIT = 3

export function getHomeFeaturedReviews(items: Testimonial[]): Testimonial[] {
  return items.filter((t) => t.featured).slice(0, HOME_FEATURED_REVIEWS_LIMIT)
}

export function countFeaturedReviews(items: Testimonial[]): number {
  return items.filter((t) => t.featured).length
}
