import { NextResponse } from 'next/server'
import { mergeReturnsData } from '@/lib/returns-defaults'
import { readReturnsFile } from '@/lib/returns-store'

export async function GET() {
  const raw = await readReturnsFile()
  const data = mergeReturnsData(raw)
  return NextResponse.json({ data })
}
