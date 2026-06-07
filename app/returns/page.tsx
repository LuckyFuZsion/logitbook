'use client'

import Link from 'next/link'

const POLICY_POINTS = [
  'Logitshop.com is happy to exchange or refund your items on presentation of a valid receipt.',
  'Goods must be returned within 30 days of purchase or receipt (whichever is the later) and be in perfect condition in their original packaging.',
  'Your right to an exchange of faulty/damaged items has a return period greater than 30 days in accordance with your statutory rights.',
  'We will refund to your original payment method.',
  'Feel free to contact us to discuss your return, replacement or refund. We are here to help.',
]

export default function ReturnsPage() {
  return (
    <main className="min-h-screen bg-background px-4 pt-24 pb-16">
      <div className="max-w-3xl mx-auto">
        <p className="text-sm text-white/60 mb-6">
          <Link href="/" className="underline underline-offset-4 decoration-white/20 hover:decoration-white/60">
            Back to home
          </Link>
          {' · '}
          <Link href="/shop" className="underline underline-offset-4 decoration-white/20 hover:decoration-white/60">
            Shop
          </Link>
        </p>

        <h1
          className="text-4xl md:text-5xl font-black text-white/90 mb-8 text-balance"
          style={{ fontFamily: 'var(--font-orbitron)' }}
        >
          RETURN &amp; <span className="text-[var(--brand-red)]">REFUND POLICY</span>
        </h1>

        <div className="space-y-6 text-white/65 leading-relaxed text-base">
          <p>
            Logitshop.com must be contacted within 14 days of purchase or receipt (whichever is the later) to hopefully
            remedy any problems.
          </p>

          <ol className="list-decimal pl-6 space-y-4 text-white/70">
            {POLICY_POINTS.map((point) => (
              <li key={point}>{point}</li>
            ))}
          </ol>

          <p className="text-sm text-white/50 pt-4 border-t border-[var(--charcoal-light)]">
            Questions about a return?{' '}
            <a
              href="mailto:info@logitshop.com"
              className="text-[var(--brand-red)] hover:text-red-400 underline underline-offset-4 decoration-[var(--brand-red)]/40"
            >
              Contact us
            </a>
            .
          </p>
        </div>
      </div>
    </main>
  )
}
