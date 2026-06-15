import type { Metadata } from 'next'
import { buildPageMetadata } from '@/lib/seo-page-metadata'

export const metadata: Metadata = buildPageMetadata({
  title: 'IDEST Scuba Servicing & Pricing',
  description:
    'IDEST-accredited scuba equipment servicing, inspection and repair for regulators, BCDs, cylinders and technical dive systems. View standard and member pricing.',
  path: '/services',
})

export default function ServicesRouteLayout({ children }: { children: React.ReactNode }) {
  return children
}
