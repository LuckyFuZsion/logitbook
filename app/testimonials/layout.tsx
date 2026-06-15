import type { Metadata } from 'next'
import { buildPageMetadata } from '@/lib/seo-page-metadata'

export const metadata: Metadata = buildPageMetadata({
  title: 'Customer Reviews',
  description:
    'Read what divers say about LOG-IT logbooks, IDEST-accredited regulator servicing and cylinder testing from LOGITSHOP. Real customer reviews and testimonials.',
  path: '/testimonials',
})

export default function TestimonialsRouteLayout({ children }: { children: React.ReactNode }) {
  return children
}
