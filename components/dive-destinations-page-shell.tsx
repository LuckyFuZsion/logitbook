'use client'

import { useState } from 'react'
import Navigation from '@/components/navigation'
import Footer from '@/components/footer'

export function DiveDestinationsPageShell({ children }: { children: React.ReactNode }) {
  const [activeTab, setActiveTab] = useState('destinations')

  return (
    <>
      <Navigation activeTab={activeTab} onTabChange={setActiveTab} />
      <main id="main-content" className="pb-16 md:pb-0">
        {children}
      </main>
      <Footer onTabChange={setActiveTab} />
    </>
  )
}
