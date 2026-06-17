import { NextResponse } from 'next/server'
import { mergeHoursData } from '@/lib/hours-defaults'
import { readHoursFile } from '@/lib/hours-store'

export const dynamic = 'force-dynamic'

export async function GET() {
  const data = mergeHoursData(await readHoursFile())
  return NextResponse.json({ data })
}
