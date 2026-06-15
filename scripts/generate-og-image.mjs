import sharp from 'sharp'
import { readFileSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const source = join(root, 'public', 'Opengraph (31).png')
const output = join(root, 'public', 'og-image.jpg')

const WIDTH = 1200
const HEIGHT = 630

const overlaySvg = `
<svg width="${WIDTH}" height="${HEIGHT}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="shade" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#000000" stop-opacity="0"/>
      <stop offset="62%" stop-color="#000000" stop-opacity="0"/>
      <stop offset="78%" stop-color="#000000" stop-opacity="0.55"/>
      <stop offset="100%" stop-color="#000000" stop-opacity="0.82"/>
    </linearGradient>
  </defs>
  <rect width="${WIDTH}" height="${HEIGHT}" fill="url(#shade)"/>
  <text x="600" y="502" text-anchor="middle" fill="#ffffff" font-family="Arial, Helvetica, sans-serif" font-size="34" font-weight="700" letter-spacing="3">IDEST ACCREDITED SCUBA SERVICING</text>
  <text x="600" y="542" text-anchor="middle" fill="#e5e7eb" font-family="Arial, Helvetica, sans-serif" font-size="20" font-weight="500" letter-spacing="1.5">Logbooks · Regulators · Cylinders · Dive Gear</text>
  <rect x="420" y="562" width="360" height="48" rx="4" fill="#dc2626"/>
  <text x="600" y="593" text-anchor="middle" fill="#ffffff" font-family="Arial, Helvetica, sans-serif" font-size="20" font-weight="700" letter-spacing="2.5">VISIT LOGITSHOP.COM</text>
</svg>`

const base = await sharp(source)
  .resize(WIDTH, HEIGHT, { fit: 'cover', position: 'centre' })
  .jpeg({ quality: 82, mozjpeg: true })
  .toBuffer()

const composed = await sharp(base)
  .composite([{ input: Buffer.from(overlaySvg), top: 0, left: 0 }])
  .jpeg({ quality: 82, mozjpeg: true })
  .toBuffer()

writeFileSync(output, composed)

const meta = await sharp(composed).metadata()
const sizeKb = Math.round(composed.length / 1024)
console.log(`Wrote ${output}`)
console.log(`Dimensions: ${meta.width}x${meta.height}, size: ${sizeKb} KB`)
