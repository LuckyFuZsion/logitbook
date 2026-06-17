import { NextResponse } from 'next/server'
import { mergeTestimonialsData } from '@/lib/testimonials-defaults'
import { readTestimonialsFile } from '@/lib/testimonials-store'

export const dynamic = 'force-dynamic'

export async function GET() {
  const data = mergeTestimonialsData(await readTestimonialsFile())
  return NextResponse.json({ data })
}
