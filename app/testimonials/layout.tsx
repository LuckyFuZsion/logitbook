import type { Metadata } from 'next'
import { buildPageMetadata } from '@/lib/seo-page-metadata'

export const metadata: Metadata = buildPageMetadata({
  title: 'Customer Reviews | LOGITSHOP',
  description:
    'Read what divers say about LOG-IT logbooks and IDEST-accredited scuba servicing from LOGITSHOP.',
  path: '/testimonials',
})

export default function TestimonialsRouteLayout({ children }: { children: React.ReactNode }) {
  return children
}
