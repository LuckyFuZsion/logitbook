import type { Metadata } from 'next'
import { buildPageMetadata } from '@/lib/seo-page-metadata'

export const metadata: Metadata = buildPageMetadata({
  title: 'Privacy Policy | LOGITSHOP',
  description: 'How LOGITSHOP collects, uses, and protects your personal information.',
  path: '/privacy-policy',
})

export default function PrivacyPolicyLayout({ children }: { children: React.ReactNode }) {
  return children
}
