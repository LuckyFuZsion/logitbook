import type { Metadata } from 'next'
import { buildPageMetadata } from '@/lib/seo-page-metadata'

export const metadata: Metadata = buildPageMetadata({
  title: 'Returns & Refunds',
  description:
    'Read the LOGITSHOP return and refund policy for logbooks and shop purchases. Eligibility, timeframes, and how to request a return or exchange for dive gear.',
  path: '/returns',
})

export default function ReturnsRouteLayout({ children }: { children: React.ReactNode }) {
  return children
}
