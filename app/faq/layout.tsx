import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'FAQ | LOGITSHOP',
  description:
    'Answers to common questions about LOG-IT diving logbooks and IDEST-accredited scuba equipment servicing.',
  robots: {
    index: true,
    follow: true,
  },
}

export default function FaqRouteLayout({ children }: { children: React.ReactNode }) {
  return children
}
