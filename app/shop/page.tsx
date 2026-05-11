'use client'

import { useCallback, useState } from 'react'
import Link from 'next/link'

import Navigation from '@/components/navigation'
import ShopSection, { type Product } from '@/components/shop-section'
import CartDrawer from '@/components/cart-drawer'
import Footer from '@/components/footer'

interface CartItem extends Product {
  qty: number
}

export default function ShopPage() {
  const [activeTab, setActiveTab] = useState('shop')
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
    setCartOpen(true)
  }, [])

  const handleRemove = useCallback((id: string) => {
    setCartItems((prev) => prev.filter((i) => i.id !== id))
  }, [])

  const handleQtyChange = useCallback((id: string, delta: number) => {
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
        <div className="px-4 pt-24">
          <div className="max-w-7xl mx-auto">
            <p className="text-sm text-white/60 mb-6">
              <Link href="/" className="underline underline-offset-4 decoration-white/20 hover:decoration-white/60">
                Back to home
              </Link>
            </p>
          </div>
        </div>

        <ShopSection onAddToCart={handleAddToCart} cartItems={cartProductIds} bgClassName="bg-background" />
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

