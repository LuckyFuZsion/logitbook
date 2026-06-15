import type { Metadata } from 'next'
import { buildPageMetadata } from '@/lib/seo-page-metadata'

export const metadata: Metadata = buildPageMetadata({
  title: 'Our Story',
  description:
    'Learn the LOG-IT story: a UK diving logbook heritage since 1988, IDEST-accredited servicing, and the people behind LOGITSHOP in Grantham, Lincolnshire.',
  path: '/story',
})

export default function StoryRouteLayout({ children }: { children: React.ReactNode }) {
  return children
}
