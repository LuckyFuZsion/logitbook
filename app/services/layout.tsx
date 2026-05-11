import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Services | LOGITSHOP',
  description:
    'IDEST-accredited scuba equipment servicing, inspection, and repair for regulators, BCDs, cylinders and more.',
  robots: { index: true, follow: true },
}

export default function ServicesRouteLayout({ children }: { children: React.ReactNode }) {
  return children
}
