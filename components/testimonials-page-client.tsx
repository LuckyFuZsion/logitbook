'use client'

import Link from 'next/link'
import TestimonialsSection from '@/components/testimonials-section'
import { TestimonialsPageShell } from '@/components/testimonials-page-shell'
import type { TestimonialsData } from '@/lib/testimonials-types'

export default function TestimonialsPageClient({
  initialData,
}: {
  initialData: TestimonialsData
}) {
  return (
    <TestimonialsPageShell>
      <div className="px-4 pt-24">
        <div className="max-w-7xl mx-auto">
          <p className="text-sm text-white/60 mb-6">
            <Link
              href="/"
              className="underline underline-offset-4 decoration-white/20 hover:decoration-white/60"
            >
              Back to home
            </Link>
          </p>
        </div>
      </div>

      <TestimonialsSection bgClassName="bg-background" layout="page" initialData={initialData} showSeoIntro />
    </TestimonialsPageShell>
  )
}
