import { NextResponse } from 'next/server'
import { mergeServicesData } from '@/lib/services-defaults'
import { readServicesFile } from '@/lib/services-store'

export async function GET() {
  const raw = await readServicesFile()
  const data = mergeServicesData(raw)
  return NextResponse.json({ data })
}
