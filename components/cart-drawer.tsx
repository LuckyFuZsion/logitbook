'use client'

import { X, Trash2, ShoppingBag, ArrowRight } from 'lucide-react'
import type { Product } from './shop-section'

interface CartItem extends Product {
  qty: number
}

interface CartDrawerProps {
  open: boolean
  onClose: () => void
  items: CartItem[]
  onRemove: (id: number) => void
  onQtyChange: (id: number, delta: number) => void
}

export default function CartDrawer({ open, onClose, items, onRemove, onQtyChange }: CartDrawerProps) {
  const total = items.reduce((sum, item) => sum + item.price * item.qty, 0)

  return (
    <>
      {/* Backdrop */}
      {open && (
        <div
          className="fixed inset-0 z-[60] bg-black/70 backdrop-blur-sm"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Drawer */}
      <aside
        className={`fixed top-0 right-0 bottom-0 z-[70] w-full max-w-sm bg-[var(--charcoal)] border-l border-[var(--charcoal-light)] flex flex-col transition-transform duration-300 ${
          open ? 'translate-x-0' : 'translate-x-full'
        }`}
        role="dialog"
        aria-modal="true"
        aria-label="Shopping cart"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[var(--charcoal-light)]">
          <div className="flex items-center gap-2">
            <ShoppingBag size={18} className="text-[var(--brand-red)]" aria-hidden="true" />
            <h2
              className="text-sm font-black tracking-widest uppercase text-white"
              style={{ fontFamily: 'var(--font-orbitron)' }}
            >
              Cart
              {items.length > 0 && (
                <span className="ml-2 text-[var(--brand-red)]">({items.reduce((s, i) => s + i.qty, 0)})</span>
              )}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-white/50 hover:text-white transition-colors"
            aria-label="Close cart"
          >
            <X size={18} aria-hidden="true" />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto py-4 px-5">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-4 text-center">
              <ShoppingBag size={40} className="text-white/20" aria-hidden="true" />
              <p
                className="text-sm font-bold tracking-widest uppercase text-white/40"
                style={{ fontFamily: 'var(--font-orbitron)' }}
              >
                Your cart is empty
              </p>
              <button
                onClick={onClose}
                className="text-xs text-[var(--brand-red)] font-semibold tracking-widest uppercase hover:underline"
                style={{ fontFamily: 'var(--font-rajdhani)' }}
              >
                Continue Shopping
              </button>
            </div>
          ) : (
            <ul className="flex flex-col gap-4" aria-label="Cart items">
              {items.map((item) => (
                <li
                  key={item.id}
                  className="flex gap-3 pb-4 border-b border-[var(--charcoal-light)] last:border-0"
                >
                  <div className="w-16 h-16 shrink-0 overflow-hidden bg-[var(--charcoal-mid)]">
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 flex flex-col gap-1 min-w-0">
                    <h3
                      className="text-xs font-bold text-white truncate"
                      style={{ fontFamily: 'var(--font-orbitron)' }}
                    >
                      {item.name}
                    </h3>
                    <span
                      className="text-sm font-black text-[var(--brand-red)]"
                      style={{ fontFamily: 'var(--font-orbitron)' }}
                    >
                      ${(item.price * item.qty).toFixed(2)}
                    </span>
                    <div className="flex items-center gap-3 mt-1">
                      {/* Qty */}
                      <div className="flex items-center gap-2 border border-[var(--charcoal-light)]">
                        <button
                          onClick={() => onQtyChange(item.id, -1)}
                          className="w-7 h-7 flex items-center justify-center text-white/60 hover:text-white hover:bg-white/10 transition-colors text-sm"
                          aria-label={`Decrease quantity of ${item.name}`}
                        >
                          −
                        </button>
                        <span className="text-xs font-bold text-white w-4 text-center" aria-label={`Quantity: ${item.qty}`}>
                          {item.qty}
                        </span>
                        <button
                          onClick={() => onQtyChange(item.id, 1)}
                          className="w-7 h-7 flex items-center justify-center text-white/60 hover:text-white hover:bg-white/10 transition-colors text-sm"
                          aria-label={`Increase quantity of ${item.name}`}
                        >
                          +
                        </button>
                      </div>
                      <button
                        onClick={() => onRemove(item.id)}
                        className="p-1 text-white/30 hover:text-[var(--brand-red)] transition-colors"
                        aria-label={`Remove ${item.name} from cart`}
                      >
                        <Trash2 size={13} aria-hidden="true" />
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t border-[var(--charcoal-light)] px-5 py-5 flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold tracking-widest uppercase text-white/60">Subtotal</span>
              <span
                className="text-xl font-black text-white"
                style={{ fontFamily: 'var(--font-orbitron)' }}
              >
                ${total.toFixed(2)}
              </span>
            </div>
            <p className="text-xs text-white/40">Taxes and shipping calculated at checkout.</p>
            <button
              className="w-full flex items-center justify-center gap-2 py-4 bg-[var(--brand-red)] hover:bg-red-600 text-white font-bold tracking-widest uppercase text-sm transition-all duration-200 glow-red"
              style={{ fontFamily: 'var(--font-orbitron)' }}
              aria-label="Proceed to checkout"
            >
              Checkout <ArrowRight size={16} aria-hidden="true" />
            </button>
          </div>
        )}
      </aside>
    </>
  )
}
