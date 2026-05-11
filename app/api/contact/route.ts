import { NextResponse } from 'next/server'
import { mergeContactData } from '@/lib/contact-defaults'
import { readContactFile } from '@/lib/contact-store'

export async function GET() {
  const data = mergeContactData(await readContactFile())
  return NextResponse.json({ data })
}
