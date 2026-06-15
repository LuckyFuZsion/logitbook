import type { Metadata } from 'next'
import { buildPageMetadata } from '@/lib/seo-page-metadata'

export const metadata: Metadata = buildPageMetadata({
  title: 'FAQ — Logbooks, Servicing & Orders',
  description:
    'Answers to common questions about LOG-IT diving logbooks, IDEST-accredited scuba servicing, orders, mail-in repairs and cylinder testing at LOGITSHOP.',
  path: '/faq',
})

export default function FaqRouteLayout({ children }: { children: React.ReactNode }) {
  return children
}
