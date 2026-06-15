'use client'

import { useEffect, useState } from 'react'
import type { FaqData } from '@/lib/faq-types'
import { mergeFaqData } from '@/lib/faq-defaults'
import { SectionMobileCollapse } from '@/components/section-mobile-collapse'
import { SectionHeading } from '@/components/section-heading'
import { SeoPageIntro } from '@/components/seo-page-intro'

/* ──────── Answer renderer ──────── */

function formatAnswer(text: string) {
  const lines = text.split('\n')
  const nodes: React.ReactNode[] = []
  let listItems: string[] = []

  const flushList = (keyBase: string) => {
    if (listItems.length === 0) return
    nodes.push(
      <ul key={`${keyBase}-ul-${nodes.length}`} className="list-disc pl-5 space-y-1">
        {listItems.map((li, i) => (
          <li key={i}>{li}</li>
        ))}
      </ul>,
    )
    listItems = []
  }

  lines.forEach((line, idx) => {
    const trimmed = line.trim()
    if (!trimmed) {
      flushList(`l${idx}`)
      return
    }
    if (trimmed.startsWith('- ')) {
      listItems.push(trimmed.slice(2))
      return
    }
    flushList(`l${idx}`)
    nodes.push(<p key={`p-${idx}`}>{trimmed}</p>)
  })
  flushList('end')

  return <div className="space-y-2">{nodes}</div>
}

/* ──────── Skeleton ──────── */

function FaqSkeleton() {
  return (
    <div className="space-y-3 animate-pulse" aria-hidden="true">
      {[1, 2, 3, 4, 5].map((k) => (
        <div key={k} className="border border-[var(--charcoal-light)] p-5 h-16 bg-white/3" />
      ))}
    </div>
  )
}

/* ──────── Main section ──────── */

export default function FaqSection({
  bgClassName = 'bg-background',
  initialData,
  headingLevel = 'h2',
  showSeoIntro = false,
}: {
  bgClassName?: string
  initialData?: FaqData
  headingLevel?: 'h1' | 'h2'
  showSeoIntro?: boolean
}) {
  const [data, setData] = useState<FaqData | null>(initialData ?? null)

  useEffect(() => {
    if (initialData) return
    fetch('/api/faq')
      .then((r) => r.json())
      .then((j: { data: FaqData }) => setData(j.data))
      .catch(() => setData(mergeFaqData(null)))
  }, [initialData])

  const items = data?.items ?? []

  /**
   * Build the FAQPage schema.org JSON-LD from live data.
   * This is injected as a <script> tag whenever `items` updates,
   * so Google sees the current FAQ content on every page load.
   */
  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((f) => ({
      '@type': 'Question',
      name: f.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: f.answer.replace(/\n/g, '<br/>'),
      },
    })),
  }

  return (
    <section
      id="faq"
      className={`min-h-0 md:min-h-screen ${bgClassName} py-20 px-4`}
      aria-labelledby="faq-heading"
    >
      {/* Live FAQPage schema — updates whenever CMS data changes */}
      {items.length > 0 && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
        />
      )}

      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <p
            className="text-sm font-semibold tracking-[0.3em] uppercase text-[var(--brand-red)] mb-3"
            style={{ fontFamily: 'var(--font-rajdhani)' }}
          >
            Helpful Answers
          </p>
          <SectionHeading
            as={headingLevel}
            id="faq-heading"
            className="text-4xl md:text-5xl font-black text-white mb-4 text-balance"
            style={{ fontFamily: 'var(--font-orbitron)' }}
          >
            FREQUENTLY ASKED <span className="text-[var(--brand-red)]">QUESTIONS</span>
          </SectionHeading>
          <div
            className="w-16 h-0.5 bg-[var(--brand-red)] mx-auto"
            style={{ boxShadow: '0 0 10px var(--brand-red-glow)' }}
            aria-hidden="true"
          />
        </div>

        {showSeoIntro && (
          <SeoPageIntro>
            Find answers about LOG-IT diving logbooks, IDEST-accredited regulator and cylinder servicing,
            mail-in repairs, order delivery, wholesale logbook pricing and how to prepare your scuba
            equipment before sending it to our Grantham workshop.
          </SeoPageIntro>
        )}

        {!data ? (
          <SectionMobileCollapse id="faq-content" expandLabel="View all questions">
            <FaqSkeleton />
          </SectionMobileCollapse>
        ) : (
          <SectionMobileCollapse id="faq-content" expandLabel="View all questions">
            <div className="space-y-3">
              {items.map((f) => (
                <details
                  key={f.id}
                  className="glass-card border border-[var(--charcoal-light)] p-5 group"
                >
                  <summary
                    className="cursor-pointer list-none flex items-start justify-between gap-6 text-white font-bold"
                    style={{ fontFamily: 'var(--font-orbitron)' }}
                  >
                    <span className="text-base md:text-lg">{f.question}</span>
                    <span
                      className="text-[var(--brand-red)] group-open:rotate-45 transition-transform select-none"
                      aria-hidden="true"
                    >
                      +
                    </span>
                  </summary>
                  <div
                    className="mt-4 text-white/70 text-base leading-relaxed"
                    style={{ fontFamily: 'var(--font-rajdhani)' }}
                  >
                    {formatAnswer(f.answer)}
                  </div>
                </details>
              ))}
            </div>
          </SectionMobileCollapse>
        )}
      </div>
    </section>
  )
}
