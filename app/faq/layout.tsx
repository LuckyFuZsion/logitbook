import type { Metadata } from 'next'
import { buildPageMetadata } from '@/lib/seo-page-metadata'

export const metadata: Metadata = buildPageMetadata({
  title: 'FAQ | LOGITSHOP',
  description:
    'Answers to common questions about LOG-IT diving logbooks and IDEST-accredited scuba equipment servicing.',
  path: '/faq',
})

export default function FaqRouteLayout({ children }: { children: React.ReactNode }) {
  return children
}
