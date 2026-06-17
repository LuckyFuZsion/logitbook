import { NextResponse } from 'next/server'
import { mergeStoreData } from '@/lib/store-defaults'
import { readStoreFile } from '@/lib/store-store'

export const dynamic = 'force-dynamic'

export async function GET() {
  const raw = await readStoreFile()
  const data = mergeStoreData(raw)
  return NextResponse.json(data)
}
