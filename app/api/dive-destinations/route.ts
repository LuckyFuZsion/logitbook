import { NextResponse } from 'next/server'
import { mergeDiveDestinationsData } from '@/lib/dive-destinations-defaults'
import { readDiveDestinationsFile } from '@/lib/dive-destinations-store'

export async function GET() {
  const raw = await readDiveDestinationsFile()
  const data = mergeDiveDestinationsData(raw)
  return NextResponse.json({ data })
}
