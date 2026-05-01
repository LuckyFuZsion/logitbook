'use client'

import { useState, useEffect } from 'react'
import { ShoppingCart, Menu, X, Zap } from 'lucide-react'

interface NavigationProps {
  activeTab: string
  onTabChange: (tab: string) => void
  cartCount: number
  onCartOpen: () => void
}

const TABS = [
  { id: 'home', label: 'Home' },
  { id: 'shop', label: 'Shop' },
  { id: 'services', label: 'Services' },
  { id: 'story', label: 'Our Story' },
  { id: 'gallery', label: 'Gallery' },
]

export default function Navigation({ activeTab, onTabChange, cartCount, onCartOpen }: NavigationProps) {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleTab = (id: string) => {
    onTabChange(id)
    setMenuOpen(false)
    if (typeof window === 'undefined') return
    const el = document.getElementById(id)
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' })
      window.location.hash = `#${id}`
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' })
      window.location.hash = '#home'
    }
  }

  return (
    <>
      {/* ── Desktop / Top Navigation ── */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 hidden md:block ${
          scrolled
            ? 'bg-black/95 backdrop-blur-md border-b border-[var(--brand-red)]/30'
            : 'bg-transparent'
        }`}
        role="banner"
      >
        <nav className="max-w-7xl mx-auto px-6 flex items-center justify-between h-16" aria-label="Main navigation">
          {/* Logo */}
          <button
            onClick={() => handleTab('home')}
            className="flex items-center gap-2 group"
            aria-label="Logitshop Home"
          >
            <Zap
              size={22}
              className="text-[var(--brand-red)] group-hover:drop-shadow-[0_0_8px_var(--brand-red)] transition-all"
              aria-hidden="true"
            />
            <span
              className="text-xl font-black tracking-widest text-white"
              style={{ fontFamily: 'var(--font-orbitron)' }}
            >
              LOGIT<span className="text-[var(--brand-red)]">SHOP</span>
            </span>
          </button>

          {/* Tabs */}
          <ul className="flex items-center gap-1" role="list">
            {TABS.map((tab) => (
              <li key={tab.id}>
                <button
                  onClick={() => handleTab(tab.id)}
                  className={`relative px-4 py-2 text-sm font-semibold tracking-widest uppercase transition-all duration-200 ${
                    activeTab === tab.id
                      ? 'text-[var(--brand-red)]'
                      : 'text-white/70 hover:text-white'
                  }`}
                  aria-current={activeTab === tab.id ? 'true' : undefined}
                  style={{ fontFamily: 'var(--font-rajdhani)' }}
                >
                  {tab.label}
                  {activeTab === tab.id && (
                    <span
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-[var(--brand-red)]"
                      style={{ boxShadow: '0 0 8px var(--brand-red-glow)' }}
                      aria-hidden="true"
                    />
                  )}
                </button>
              </li>
            ))}
          </ul>

          {/* Cart */}
          <button
            onClick={onCartOpen}
            className="relative p-2 text-white hover:text-[var(--brand-red)] transition-colors"
            aria-label={`Shopping cart, ${cartCount} items`}
          >
            <ShoppingCart size={22} aria-hidden="true" />
            {cartCount > 0 && (
              <span
                className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-[var(--brand-red)] text-white text-xs flex items-center justify-center font-bold badge-pulse"
                aria-hidden="true"
              >
                {cartCount}
              </span>
            )}
          </button>
        </nav>
      </header>

      {/* ── Mobile Top Bar ── */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 md:hidden transition-all duration-300 ${
          scrolled || menuOpen
            ? 'bg-black/98 backdrop-blur-md border-b border-[var(--brand-red)]/30'
            : 'bg-transparent'
        }`}
        role="banner"
      >
        <div className="flex items-center justify-between px-4 h-14">
          <button
            onClick={() => handleTab('home')}
            className="flex items-center gap-1.5"
            aria-label="Logitshop Home"
          >
            <Zap size={18} className="text-[var(--brand-red)]" aria-hidden="true" />
            <span
              className="text-base font-black tracking-widest text-white"
              style={{ fontFamily: 'var(--font-orbitron)' }}
            >
              LOGIT<span className="text-[var(--brand-red)]">SHOP</span>
            </span>
          </button>

          <div className="flex items-center gap-3">
            <button
              onClick={onCartOpen}
              className="relative p-1.5 text-white"
              aria-label={`Cart, ${cartCount} items`}
            >
              <ShoppingCart size={20} aria-hidden="true" />
              {cartCount > 0 && (
                <span
                  className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[var(--brand-red)] text-white text-[10px] flex items-center justify-center font-bold"
                  aria-hidden="true"
                >
                  {cartCount}
                </span>
              )}
            </button>
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="p-1.5 text-white"
              aria-label={menuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={menuOpen}
            >
              {menuOpen ? <X size={22} aria-hidden="true" /> : <Menu size={22} aria-hidden="true" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {menuOpen && (
          <nav aria-label="Mobile navigation">
            <ul className="border-t border-[var(--charcoal-light)] py-2" role="list">
              {TABS.map((tab) => (
                <li key={tab.id}>
                  <button
                    onClick={() => handleTab(tab.id)}
                    className={`w-full text-left px-6 py-3 text-base font-semibold tracking-widest uppercase transition-colors ${
                      activeTab === tab.id
                        ? 'text-[var(--brand-red)] bg-[var(--brand-red-dim)]'
                        : 'text-white/80 hover:text-white hover:bg-white/5'
                    }`}
                    aria-current={activeTab === tab.id ? 'true' : undefined}
                    style={{ fontFamily: 'var(--font-rajdhani)' }}
                  >
                    {tab.label}
                  </button>
                </li>
              ))}
            </ul>
          </nav>
        )}
      </header>

      {/* ── Mobile Bottom Nav Bar ── */}
      <nav
        className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-black/95 backdrop-blur-md border-t border-[var(--charcoal-light)]"
        aria-label="Bottom navigation"
      >
        <ul className="flex items-center justify-around" role="list">
          {TABS.map((tab) => (
            <li key={tab.id} className="flex-1">
              <button
                onClick={() => handleTab(tab.id)}
                className={`w-full py-3 flex flex-col items-center gap-0.5 text-[10px] font-semibold tracking-widest uppercase transition-colors ${
                  activeTab === tab.id
                    ? 'text-[var(--brand-red)]'
                    : 'text-white/50 hover:text-white/80'
                }`}
                aria-current={activeTab === tab.id ? 'true' : undefined}
                style={{ fontFamily: 'var(--font-rajdhani)' }}
              >
                {activeTab === tab.id && (
                  <span
                    className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-[var(--brand-red)]"
                    style={{ boxShadow: '0 0 6px var(--brand-red-glow)' }}
                    aria-hidden="true"
                  />
                )}
                <span className="relative">{tab.label}</span>
              </button>
            </li>
          ))}
        </ul>
      </nav>
    </>
  )
}
