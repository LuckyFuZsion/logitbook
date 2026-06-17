import { NextResponse } from 'next/server'
import { mergeContactData } from '@/lib/contact-defaults'
import { readContactFile } from '@/lib/contact-store'

export const dynamic = 'force-dynamic'

export async function GET() {
  const data = mergeContactData(await readContactFile())
  return NextResponse.json({ data })
}
