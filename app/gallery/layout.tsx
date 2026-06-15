import type { Metadata } from 'next'
import { buildPageMetadata } from '@/lib/seo-page-metadata'

export const metadata: Metadata = buildPageMetadata({
  title: 'Gallery | LOGITSHOP',
  description: 'Gallery of recent scuba servicing and restoration work by LOGITSHOP.',
  path: '/gallery',
})

export default function GalleryRouteLayout({ children }: { children: React.ReactNode }) {
  return children
}
