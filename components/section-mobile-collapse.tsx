'use client'

import { useEffect, useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'

type SectionMobileCollapseProps = {
  children: React.ReactNode
  /** ID for aria-controls */
  id: string
  expandLabel: string
  collapseLabel?: string
  /** Auto-expand when location hash matches one of these IDs */
  expandOnHashIds?: string[]
}

/**
 * Collapses children on mobile behind a toggle. Content stays in the DOM for SEO.
 * Desktop (md+) is always expanded.
 */
export function SectionMobileCollapse({
  children,
  id,
  expandLabel,
  collapseLabel = 'Show less',
  expandOnHashIds,
}: SectionMobileCollapseProps) {
  const [expanded, setExpanded] = useState(false)

  useEffect(() => {
    if (!expandOnHashIds?.length) return
    const targetId = window.location.hash.replace(/^#/, '')
    if (targetId && expandOnHashIds.includes(targetId)) {
      setExpanded(true)
    }
  }, [expandOnHashIds])

  return (
    <div>
      <button
        type="button"
        className="md:hidden w-full flex items-center justify-center gap-2 px-6 py-4 border border-[var(--brand-red)]/50 text-[var(--brand-red)] hover:bg-[var(--brand-red)] hover:text-white font-bold tracking-widest uppercase text-sm transition-all duration-200"
        style={{ fontFamily: 'var(--font-orbitron)' }}
        aria-expanded={expanded}
        aria-controls={id}
        onClick={() => setExpanded((v) => !v)}
      >
        {expanded ? collapseLabel : expandLabel}
        <ChevronDown
          size={16}
          className={cn('transition-transform duration-200', expanded && 'rotate-180')}
          aria-hidden="true"
        />
      </button>

      <div
        id={id}
        className={cn(
          'grid transition-[grid-template-rows] duration-300 ease-in-out',
          'md:grid-rows-[1fr] md:mt-0',
          expanded ? 'grid-rows-[1fr] mt-6' : 'grid-rows-[0fr] mt-0',
        )}
      >
        <div className="min-h-0 overflow-hidden md:overflow-visible">{children}</div>
      </div>
    </div>
  )
}
