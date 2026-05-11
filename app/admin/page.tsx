import Link from 'next/link'
import { redirect } from 'next/navigation'
import { ArrowRight } from 'lucide-react'
import { getAdminSession } from '@/lib/admin-session'
import AdminLogoutButton from '@/components/admin-logout-button'

const AREAS = [
  {
    href: '/admin/gallery',
    title: 'Gallery',
    description: 'Grid images, before/after slider, alt text, and captions for the public gallery.',
  },
  {
    href: '/admin/shop',
    title: 'Shop',
    description: 'Product copy, images, prices, and per-item Stripe links for the hybrid catalogue.',
  },
  {
    href: '/admin/services',
    title: 'Services',
    description: 'Service categories, pricing (standard & members), notes, and club details.',
  },
  {
    href: '/admin/faq',
    title: 'FAQs',
    description: 'Add, edit, reorder, or delete FAQ questions. Updates the live page and schema.org JSON-LD instantly.',
  },
  {
    href: '/admin/go-live',
    title: 'Go-live',
    description: 'Checklist for domain, env, data, Stripe, Cloudinary, and launch QA.',
  },
] as const

export default async function AdminIndexPage() {
  const session = await getAdminSession()
  if (!session) redirect('/admin/login')

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 text-white">
      <div className="flex flex-wrap items-start justify-between gap-6 mb-12">
        <div>
          <p
            className="text-xs font-semibold tracking-[0.3em] uppercase text-[var(--brand-red)] mb-2"
            style={{ fontFamily: 'var(--font-rajdhani)' }}
          >
            Admin
          </p>
          <h1 className="text-2xl font-black mb-1" style={{ fontFamily: 'var(--font-orbitron)' }}>
            Dashboard
          </h1>
          <p className="text-white/50 text-sm">Choose an area to manage.</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <Link
            href="/"
            className="text-xs font-bold tracking-widest uppercase text-white/60 hover:text-white border border-white/15 px-4 py-2 transition-colors"
            style={{ fontFamily: 'var(--font-orbitron)' }}
          >
            View site
          </Link>
          <AdminLogoutButton />
        </div>
      </div>

      <ul className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6" role="list">
        {AREAS.map((area) => (
          <li key={area.href}>
            <Link
              href={area.href}
              className="group block h-full p-6 border border-[var(--charcoal-light)] bg-[var(--charcoal)] hover:border-[var(--brand-red)]/60 hover:bg-[var(--charcoal)]/90 transition-all duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--brand-red)]"
            >
              <div className="flex items-start justify-between gap-3 mb-4">
                <h2
                  className="text-lg font-black text-white group-hover:text-[var(--brand-red)] transition-colors"
                  style={{ fontFamily: 'var(--font-orbitron)' }}
                >
                  {area.title}
                </h2>
                <ArrowRight
                  size={20}
                  className="text-[var(--brand-red)] shrink-0 opacity-80 group-hover:translate-x-0.5 transition-transform"
                  aria-hidden="true"
                />
              </div>
              <p className="text-sm text-white/55 leading-relaxed">{area.description}</p>
              <span className="sr-only">Open {area.title}</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
