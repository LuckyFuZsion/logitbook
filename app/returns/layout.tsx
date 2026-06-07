import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Returns | LOGITSHOP',
  description: 'Return and refund policy for LOGITSHOP purchases.',
  robots: { index: true, follow: true },
}

export default function ReturnsRouteLayout({ children }: { children: React.ReactNode }) {
  return children
}
