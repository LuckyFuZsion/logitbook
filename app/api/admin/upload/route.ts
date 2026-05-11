import { randomUUID } from 'crypto'
import { promises as fs } from 'fs'
import path from 'path'
import { NextResponse } from 'next/server'
import { getAdminSession } from '@/lib/admin-session'
import {
  isCloudinaryConfigured,
  uploadGalleryImageFromBuffer,
  uploadProductImageFromBuffer,
} from '@/lib/cloudinary-server'

const ALLOWED = new Set(['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml'])

function extForMime(mime: string): string {
  if (mime === 'image/jpeg') return '.jpg'
  if (mime === 'image/png') return '.png'
  if (mime === 'image/webp') return '.webp'
  if (mime === 'image/gif') return '.gif'
  if (mime === 'image/svg+xml') return '.svg'
  return ''
}

export async function POST(req: Request) {
  const session = await getAdminSession()
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { searchParams } = new URL(req.url)
  const uploadType = searchParams.get('type') === 'product' ? 'product' : 'gallery'

  const form = await req.formData()
  const file = form.get('file')
  if (!(file instanceof File)) {
    return NextResponse.json({ error: 'Missing file' }, { status: 400 })
  }

  const mime = file.type || 'application/octet-stream'
  if (!ALLOWED.has(mime)) {
    return NextResponse.json({ error: 'Unsupported file type' }, { status: 400 })
  }

  const ext = extForMime(mime)
  if (!ext) {
    return NextResponse.json({ error: 'Unsupported file type' }, { status: 400 })
  }

  const buf = Buffer.from(await file.arrayBuffer())
  if (buf.length > 12 * 1024 * 1024) {
    return NextResponse.json({ error: 'File too large (max 12MB)' }, { status: 400 })
  }

  if (isCloudinaryConfigured()) {
    try {
      const url =
        uploadType === 'product'
          ? await uploadProductImageFromBuffer(buf)
          : await uploadGalleryImageFromBuffer(buf)
      return NextResponse.json({ url, destination: 'cloudinary' as const })
    } catch (e) {
      console.error(e)
      return NextResponse.json({ error: 'Cloudinary upload failed' }, { status: 502 })
    }
  }

  const subDir = uploadType === 'product' ? 'products' : 'gallery'
  const uploadDir = path.join(process.cwd(), 'public', 'uploads', subDir)
  await fs.mkdir(uploadDir, { recursive: true })
  const name = `${randomUUID()}${ext}`
  const diskPath = path.join(uploadDir, name)
  await fs.writeFile(diskPath, buf)

  const publicPath = `/uploads/${subDir}/${name}`
  return NextResponse.json({ url: publicPath, destination: 'local' as const })
}
