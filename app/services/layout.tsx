import type { Metadata } from 'next'
import { buildPageMetadata } from '@/lib/seo-page-metadata'

export const metadata: Metadata = buildPageMetadata({
  title: 'Services | LOGITSHOP',
  description:
    'IDEST-accredited scuba equipment servicing, inspection, and repair for regulators, BCDs, cylinders and more.',
  path: '/services',
})

export default function ServicesRouteLayout({ children }: { children: React.ReactNode }) {
  return children
}
