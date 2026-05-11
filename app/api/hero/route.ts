import { NextResponse } from 'next/server'
import { mergeHeroData } from '@/lib/hero-defaults'
import { readHeroFile } from '@/lib/hero-store'

export async function GET() {
  const data = mergeHeroData(await readHeroFile())
  return NextResponse.json({ data })
}
