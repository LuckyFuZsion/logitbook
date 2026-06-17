'use client'

import Link from 'next/link'
import { MeetTheTeamPageShell } from '@/components/meet-the-team-page-shell'
import { MeetTheTeamSection } from '@/components/meet-the-team-section'

export default function MeetTheTeamPageClient() {
  return (
    <MeetTheTeamPageShell>
      <div className="px-4 pt-24">
        <div className="max-w-7xl mx-auto">
          <p className="text-sm text-white/60 mb-6">
            <Link
              href="/"
              className="underline underline-offset-4 decoration-white/20 hover:decoration-white/60"
            >
              Back to home
            </Link>
          </p>
        </div>
      </div>

      <MeetTheTeamSection headingLevel="h1" showSeoIntro />
    </MeetTheTeamPageShell>
  )
}
