import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  robots: { index: false, follow: false },
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[var(--background)]">
      <nav
        className="border-b border-[var(--charcoal-light)] px-4 py-3 flex flex-wrap gap-4 text-[10px] font-bold tracking-[0.2em] uppercase"
        style={{ fontFamily: 'var(--font-orbitron)' }}
        aria-label="Admin sections"
      >
        <Link href="/admin" className="text-white/60 hover:text-white">
          Dashboard
        </Link>
        <Link href="/admin/gallery" className="text-white/60 hover:text-white">
          Gallery
        </Link>
        <Link href="/admin/shop" className="text-white/60 hover:text-white">
          Shop
        </Link>
        <Link href="/admin/services" className="text-white/60 hover:text-white">
          Services
        </Link>
        <Link href="/admin/faq" className="text-white/60 hover:text-white">
          FAQs
        </Link>
        <Link href="/admin/go-live" className="text-white/60 hover:text-white">
          Go-live
        </Link>
      </nav>
      {children}
    </div>
  )
}
