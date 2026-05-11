import { NextResponse } from 'next/server'
import { mergeFaqData } from '@/lib/faq-defaults'
import { readFaqFile } from '@/lib/faq-store'

export async function GET() {
  const raw = await readFaqFile()
  const data = mergeFaqData(raw)
  return NextResponse.json({ data })
}
