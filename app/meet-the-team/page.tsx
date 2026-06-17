import type { Metadata } from 'next'
import MeetTheTeamPageClient from '@/components/meet-the-team-page-client'
import { buildPageMetadata } from '@/lib/seo-page-metadata'
import { metaDescription, ogDescription } from '@/lib/meta-utils'

export const dynamic = 'force-dynamic'

const TEAM_META =
  'Meet the LOG-IT team at LOGITSHOP - IDEST-accredited diving services, logbook specialists, and the people behind our UK workshop and online shop.'

export const metadata: Metadata = buildPageMetadata({
  title: 'Meet the Team',
  description: metaDescription(TEAM_META),
  ogDescription: ogDescription(TEAM_META),
  path: '/meet-the-team',
  ogImagePath: '/Meet-The-Team/Eve.webp?v=2',
})

export default function MeetTheTeamPage() {
  return <MeetTheTeamPageClient />
}
