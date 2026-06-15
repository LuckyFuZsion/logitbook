import type { Metadata } from 'next'
import { buildPageMetadata } from '@/lib/seo-page-metadata'

export const metadata: Metadata = buildPageMetadata({
  title: 'Privacy Policy',
  description:
    'How LOGITSHOP collects, uses, stores and protects your personal information when you shop, book servicing or contact us online or by phone.',
  path: '/privacy-policy',
})

export default function PrivacyPolicyLayout({ children }: { children: React.ReactNode }) {
  return children
}
