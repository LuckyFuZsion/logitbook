'use client'

import Link from 'next/link'
import { DiveDestinationsPageShell } from '@/components/dive-destinations-page-shell'
import { DiveDestinationsSection } from '@/components/dive-destinations-section'

export default function DiveDestinationsPageClient() {
  return (
    <DiveDestinationsPageShell>
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

      <DiveDestinationsSection headingLevel="h1" />
    </DiveDestinationsPageShell>
  )
}
