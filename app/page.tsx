'use client'

import { useState } from 'react'
import Navigation from '@/components/navigation'
import HeroSection from '@/components/hero-section'
import SupplierLogosCarousel from '@/components/supplier-logos-carousel'
import ShopSection from '@/components/shop-section'
import ServicesSection from '@/components/services-section'
import TestimonialsSection from '@/components/testimonials-section'
import BrandStorySection from '@/components/brand-story-section'
import GallerySection from '@/components/gallery-section'
import FaqSection from '@/components/faq-section'
import Footer from '@/components/footer'

export default function LogitshopPage() {
  const [activeTab, setActiveTab] = useState('home')

  return (
    <>
      <Navigation
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      <main id="main-content">
        <HeroSection onTabChange={setActiveTab} />
        <SupplierLogosCarousel />
        <ShopSection bgClassName="section-strip-dark" />
        <ServicesSection bgClassName="section-strip-blue" />
        <TestimonialsSection bgClassName="section-strip-dark" />
        <BrandStorySection bgClassName="section-strip-blue" />
        <GallerySection bgClassName="section-strip-dark" />
        <FaqSection bgClassName="section-strip-blue" />
      </main>

      <Footer onTabChange={setActiveTab} />
    </>
  )
}
