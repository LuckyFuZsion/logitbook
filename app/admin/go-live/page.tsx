import { redirect } from 'next/navigation'
import Link from 'next/link'
import { getAdminSession } from '@/lib/admin-session'

const SECTIONS: { title: string; items: string[] }[] = [
  {
    title: 'Hosting & domain',
    items: [
      'Pick host (e.g. Vercel, Netlify, Node VPS) and connect the Git repo.',
      'Add production domain (apex + www if needed); enable HTTPS.',
      'Point DNS (A/AAAA/CNAME) per host instructions; wait for propagation.',
      'Set NEXT_PUBLIC_SITE_URL (or your sitemap base URL) to the canonical https URL for SEO/sitemap/OG.',
    ],
  },
  {
    title: 'Environment (production)',
    items: [
      'ADMIN_USERNAME, ADMIN_PASSWORD, ADMIN_SESSION_SECRET — strong password and a long random secret (not dev defaults).',
      'Confirm .env.local is never committed; set vars only in the host dashboard.',
      'Optional: NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME when you wire uploads or widgets.',
    ],
  },
  {
    title: 'Data that must persist on the server',
    items: [
      'data/gallery.json and data/store.json — writable at runtime, or replace with DB/Firestore before scaling.',
      'public/uploads/gallery/ — writable if you still use local admin uploads; otherwise rely on Cloudinary URLs only.',
    ],
  },
  {
    title: 'Payments & shop',
    items: [
      'In Stripe: Payment Links / Checkout URLs per product; paste into admin Shop as stripeUrl.',
      'Test each Buy now link in an incognito window (correct price, success/cancel URLs if you use Checkout).',
    ],
  },
  {
    title: 'Images (Cloudinary)',
    items: [
      'Move gallery/shop images to the live Cloudinary folder/account.',
      'Replace any dev/local /uploads/... URLs with https res.cloudinary.com/... in admin if you drop local uploads in prod.',
    ],
  },
  {
    title: 'Admin & security',
    items: [
      'Change default admin credentials if those were ever shared or committed.',
      'Confirm /admin is noindex (layout metadata); consider IP allowlist or extra auth for sensitive deployments.',
      'Post-launch: rotate ADMIN_SESSION_SECRET if the old one might have leaked.',
    ],
  },
  {
    title: 'SEO & analytics',
    items: [
      'robots.txt / sitemap.xml — verify they use the production URL.',
      'Submit sitemap in Google Search Console (and Bing if you care).',
      'Turn on / verify @vercel/analytics or your analytics pixel.',
      'Quick pass: titles and descriptions on key routes (home + standalone pages).',
    ],
  },
  {
    title: 'Quality checks before announcing',
    items: [
      'npm run build on a clean clone with prod env (or rely on CI).',
      'Mobile: nav, shop cards, gallery, FAQ accordions, footer links.',
      'Forms/links: mail/tel/socials; Stripe opens in a new tab as intended.',
      '404 and error handling acceptable.',
    ],
  },
  {
    title: 'Future (Firestore / CMS)',
    items: [
      'When ready: Firebase project, Firestore rules, migrate gallery + store shapes from JSON files; lock down admin APIs.',
    ],
  },
  {
    title: 'After launch',
    items: [
      'Monitor first orders/links and server logs for 401/500 on /api/*.',
      'Backup data/*.json (and uploads) on a schedule until Firestore replaces files.',
    ],
  },
]

export default async function AdminGoLivePage() {
  const session = await getAdminSession()
  if (!session) redirect('/admin/login')

  return (
    <div className="max-w-3xl mx-auto px-4 py-12 text-white">
      <Link
        href="/admin"
        className="text-[10px] font-bold tracking-widest uppercase text-white/40 hover:text-white/80 transition-colors mb-2 inline-block"
        style={{ fontFamily: 'var(--font-orbitron)' }}
      >
        ← Admin
      </Link>
      <h1 className="text-2xl font-black mb-2" style={{ fontFamily: 'var(--font-orbitron)' }}>
        Go-live checklist
      </h1>
      <p className="text-white/50 text-sm mb-8">
        Work through this before pointing customers at production. Not linked from the public site.
      </p>

      <div className="space-y-10">
        {SECTIONS.map((section) => (
          <section key={section.title}>
            <h2
              className="text-sm font-bold tracking-widest uppercase text-white mb-4 pb-2 border-b border-[var(--charcoal-light)]"
              style={{ fontFamily: 'var(--font-orbitron)' }}
            >
              {section.title}
            </h2>
            <ul className="space-y-3 text-sm text-white/85 leading-relaxed">
              {section.items.map((item) => (
                <li key={item} className="flex gap-3">
                  <span className="text-[var(--brand-red)] shrink-0 mt-0.5 select-none" aria-hidden="true">
                    ○
                  </span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>

      <p className="mt-12 text-xs text-white/40">
        <Link href="/admin" className="text-[var(--brand-red)] hover:underline">
          ← Back to admin dashboard
        </Link>
      </p>
    </div>
  )
}
