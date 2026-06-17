import { NextResponse } from 'next/server'
import { mergeStoryData } from '@/lib/story-defaults'
import { readStoryFile } from '@/lib/story-store'

export const dynamic = 'force-dynamic'

export async function GET() {
  const data = mergeStoryData(await readStoryFile())
  return NextResponse.json({ data })
}
