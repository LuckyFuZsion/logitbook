'use client'

import Link from 'next/link'
import FaqSection from '@/components/faq-section'

export default function FaqPage() {
  return (
    <main className="min-h-screen bg-background">
      <div className="px-4 pt-24">
        <div className="max-w-5xl mx-auto">
          <p className="text-sm text-white/60 mb-6">
            <Link href="/" className="underline underline-offset-4 decoration-white/20 hover:decoration-white/60">
              Back to home
            </Link>
          </p>
        </div>
      </div>

      <FaqSection bgClassName="bg-background" />
    </main>
  )
}

