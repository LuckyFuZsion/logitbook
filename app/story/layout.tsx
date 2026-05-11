import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Our Story | LOGITSHOP',
  description:
    'Learn the LOG-IT story: a UK diving logbook heritage since 1988 and the people behind LOGITSHOP.',
  robots: { index: true, follow: true },
}

export default function StoryRouteLayout({ children }: { children: React.ReactNode }) {
  return children
}
