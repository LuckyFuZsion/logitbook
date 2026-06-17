import { NextResponse } from 'next/server'
import { mergeGalleryData } from '@/lib/gallery-defaults'
import { readGalleryFile } from '@/lib/gallery-store'

export const dynamic = 'force-dynamic'

export async function GET() {
  const raw = await readGalleryFile()
  const data = mergeGalleryData(raw)
  return NextResponse.json(data)
}
