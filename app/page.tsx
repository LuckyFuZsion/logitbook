'use client'

import { useState, useCallback } from 'react'
import Navigation from '@/components/navigation'
import HeroSection from '@/components/hero-section'
import ShopSection, { type Product } from '@/components/shop-section'
import ServicesSection from '@/components/services-section'
import BrandStorySection from '@/components/brand-story-section'
import GallerySection from '@/components/gallery-section'
import CartDrawer from '@/components/cart-drawer'
import Footer from '@/components/footer'

interface CartItem extends Product {
  qty: number
}

export default function LogitshopPage() {
  const [activeTab, setActiveTab] = useState('home')
  const [cartOpen, setCartOpen] = useState(false)
  const [cartItems, setCartItems] = useState<CartItem[]>([])

  const cartCount = cartItems.reduce((sum, item) => sum + item.qty, 0)
  const cartProductIds = cartItems.map((i) => i.id)

  const handleAddToCart = useCallback((product: Product) => {
    setCartItems((prev) => {
      const existing = prev.find((i) => i.id === product.id)
      if (existing) {
        return prev.map((i) => (i.id === product.id ? { ...i, qty: i.qty + 1 } : i))
      }
      return [...prev, { ...product, qty: 1 }]
    })
  }, [])

  const handleRemove = useCallback((id: number) => {
    setCartItems((prev) => prev.filter((i) => i.id !== id))
  }, [])

  const handleQtyChange = useCallback((id: number, delta: number) => {
    setCartItems((prev) =>
      prev
        .map((i) => (i.id === id ? { ...i, qty: Math.max(0, i.qty + delta) } : i))
        .filter((i) => i.qty > 0)
    )
  }, [])

  return (
    <>
      <Navigation
        activeTab={activeTab}
        onTabChange={setActiveTab}
        cartCount={cartCount}
        onCartOpen={() => setCartOpen(true)}
      />

      <main id="main-content" className="pb-16 md:pb-0">
        <HeroSection onTabChange={setActiveTab} />
        <ShopSection
          onAddToCart={handleAddToCart}
          cartItems={cartProductIds}
          bgClassName="bg-[var(--charcoal)]"
        />
        <ServicesSection bgClassName="bg-background" />
        <BrandStorySection bgClassName="bg-[var(--charcoal)]" />
        <GallerySection bgClassName="bg-background" />
      </main>

      <Footer onTabChange={setActiveTab} />

      <CartDrawer
        open={cartOpen}
        onClose={() => setCartOpen(false)}
        items={cartItems}
        onRemove={handleRemove}
        onQtyChange={handleQtyChange}
      />
    </>
  )
}
