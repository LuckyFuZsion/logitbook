import type { Metadata } from 'next'
import { buildPageMetadata } from '@/lib/seo-page-metadata'

export const metadata: Metadata = buildPageMetadata({
  title: 'Service Gallery',
  description:
    'Browse before-and-after scuba servicing photos from LOGITSHOP. IDEST-accredited regulator, BCD and cylinder maintenance, restoration and inspection work.',
  path: '/gallery',
})

export default function GalleryRouteLayout({ children }: { children: React.ReactNode }) {
  return children
}
