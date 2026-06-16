import type { Metadata } from 'next'
import { buildPageMetadata } from '@/lib/seo-page-metadata'

export const metadata: Metadata = buildPageMetadata({
  title: 'Returns & Refunds',
  description:
    'Payment terms and returns policy for LOGITSHOP invoices, shop purchases, and scuba servicing. Read due dates, late fees, disputes, and return postage terms.',
  path: '/returns',
})

export default function ReturnsRouteLayout({ children }: { children: React.ReactNode }) {
  return children
}
