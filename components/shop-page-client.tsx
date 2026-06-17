'use client'

import Link from 'next/link'
import ShopSection from '@/components/shop-section'
import { ShopPageShell } from '@/components/shop-page-shell'

export default function ShopPageClient() {
  return (
    <ShopPageShell>
      <div className="px-4 pt-24">
        <div className="max-w-7xl mx-auto">
          <p className="text-sm text-white/60 mb-6">
            <Link href="/" className="underline underline-offset-4 decoration-white/20 hover:decoration-white/60">
              Back to home
            </Link>
          </p>
        </div>
      </div>

      <ShopSection bgClassName="bg-background" layout="tiles" showCategoryFilter />
    </ShopPageShell>
  )
}
