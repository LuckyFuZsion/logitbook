'use client'

import dynamic from 'next/dynamic'
import { useState } from 'react'
import Navigation from '@/components/navigation'
import HeroSection from '@/components/hero-section'
import SupplierLogosCarousel from '@/components/supplier-logos-carousel'
import ShopSection from '@/components/shop-section'
import ServicesSection from '@/components/services-section'
import BrandStorySection from '@/components/brand-story-section'
import FaqSection from '@/components/faq-section'
import Footer from '@/components/footer'
import type { HomeCmsData } from '@/lib/home-cms'

const TestimonialsSection = dynamic(() => import('@/components/testimonials-section'), {
  loading: () => <div className="min-h-[24rem] section-strip-dark" aria-hidden="true" />,
})

const GallerySection = dynamic(() => import('@/components/gallery-section'), {
  loading: () => <div className="min-h-[32rem] section-strip-dark" aria-hidden="true" />,
})

export default function HomePageClient({ cms }: { cms: HomeCmsData }) {
  const [activeTab, setActiveTab] = useState('home')

  return (
    <>
      <Navigation activeTab={activeTab} onTabChange={setActiveTab} />

      <main id="main-content">
        <HeroSection onTabChange={setActiveTab} initialHero={cms.hero} />
        <SupplierLogosCarousel />
        <ShopSection
          bgClassName="section-strip-dark"
          initialStore={cms.store}
          showReturnsNotice
        />
        <ServicesSection bgClassName="section-strip-blue" initialData={cms.services} />
        <TestimonialsSection
          bgClassName="section-strip-dark"
          layout="home"
          initialData={cms.testimonials}
        />
        <BrandStorySection bgClassName="section-strip-blue" initialStory={cms.story} />
        <GallerySection bgClassName="section-strip-dark" initialData={cms.gallery} />
        <FaqSection bgClassName="section-strip-blue" initialData={cms.faq} />
      </main>

      <Footer
        onTabChange={setActiveTab}
        initialContact={cms.contact}
        initialHours={cms.hours}
      />
    </>
  )
}
