import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Gallery | LOGITSHOP',
  description: 'Gallery of recent scuba servicing and restoration work by LOGITSHOP.',
  robots: { index: true, follow: true },
}

export default function GalleryRouteLayout({ children }: { children: React.ReactNode }) {
  return children
}
