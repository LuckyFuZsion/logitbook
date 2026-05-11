import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Shop | LOGITSHOP',
  description: 'Shop LOG-IT diving logbooks and scuba accessories from LOGITSHOP.',
  robots: { index: true, follow: true },
}

export default function ShopRouteLayout({ children }: { children: React.ReactNode }) {
  return children
}
