import { NextResponse } from 'next/server'
import { mergeAnnouncementData } from '@/lib/announcement-defaults'
import { readAnnouncementFile } from '@/lib/announcement-store'

export const dynamic = 'force-dynamic'

export async function GET() {
  const data = mergeAnnouncementData(await readAnnouncementFile())
  return NextResponse.json({ data })
}
