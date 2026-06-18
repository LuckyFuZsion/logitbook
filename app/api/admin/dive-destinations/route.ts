import { revalidatePath } from 'next/cache'
import { NextResponse } from 'next/server'
import type { DiveDestinationsData } from '@/lib/dive-destinations-types'
import { getAdminSession } from '@/lib/admin-session'
import { mergeDiveDestinationsData } from '@/lib/dive-destinations-defaults'
import { readDiveDestinationsFile, writeDiveDestinationsFile } from '@/lib/dive-destinations-store'

export async function GET() {
  const session = await getAdminSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const raw = await readDiveDestinationsFile()
  return NextResponse.json({ stored: raw ?? {}, merged: mergeDiveDestinationsData(raw) })
}

export async function PUT(req: Request) {
  const session = await getAdminSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  let body: Partial<DiveDestinationsData>
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  if (!Array.isArray(body.destinations) || body.destinations.length === 0) {
    return NextResponse.json({ error: 'destinations array is required' }, { status: 400 })
  }

  const merged = mergeDiveDestinationsData(body)
  const narrativesById = new Map(body.destinations.map((d) => [d.id, d.narrative ?? '']))

  const next: DiveDestinationsData = {
    intro: merged.intro,
    destinations: merged.destinations.map((d) => ({
      ...d,
      narrative: typeof narrativesById.get(d.id) === 'string' ? narrativesById.get(d.id)! : d.narrative,
    })),
    updatedAt: new Date().toISOString(),
  }

  await writeDiveDestinationsFile(next)
  revalidatePath('/dive-destinations')
  return NextResponse.json({ ok: true, data: next })
}
