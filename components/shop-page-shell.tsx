'use client'

import { useState } from 'react'
import Navigation from '@/components/navigation'
import Footer from '@/components/footer'

export function ShopPageShell({ children }: { children: React.ReactNode }) {
  const [activeTab, setActiveTab] = useState('shop')

  return (
    <>
      <Navigation activeTab={activeTab} onTabChange={setActiveTab} />
      <main id="main-content">{children}</main>
      <Footer onTabChange={setActiveTab} />
    </>
  )
}
