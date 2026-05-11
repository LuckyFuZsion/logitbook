'use client'

import { useState } from 'react'
import Link from 'next/link'

import Navigation from '@/components/navigation'
import ServicesSection from '@/components/services-section'
import Footer from '@/components/footer'

export default function ServicesPage() {
  const [activeTab, setActiveTab] = useState('services')

  return (
    <>
      <Navigation
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      <main id="main-content" className="pb-16 md:pb-0">
        <div className="px-4 pt-24">
          <div className="max-w-7xl mx-auto">
            <p className="text-sm text-white/60 mb-6">
              <Link href="/" className="underline underline-offset-4 decoration-white/20 hover:decoration-white/60">
                Back to home
              </Link>
            </p>
          </div>
        </div>

        <ServicesSection bgClassName="bg-background" />
      </main>

      <Footer onTabChange={setActiveTab} />
    </>
  )
}

