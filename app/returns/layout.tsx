import type { Metadata } from 'next'
import { buildPageMetadata } from '@/lib/seo-page-metadata'

export const metadata: Metadata = buildPageMetadata({
  title: 'Returns | LOGITSHOP',
  description: 'Return and refund policy for LOGITSHOP purchases.',
  path: '/returns',
})

export default function ReturnsRouteLayout({ children }: { children: React.ReactNode }) {
  return children
}
