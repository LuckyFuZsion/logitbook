import { v2 as cloudinary } from 'cloudinary'

/** Trim, drop CR/LF quirks from Windows .env, optional surrounding quotes. */
function stripEnv(value: string | undefined): string {
  if (value == null || value === '') return ''
  let s = value.replace(/\r\n/g, '\n').replace(/\r/g, '').trim()
  if (
    (s.startsWith('"') && s.endsWith('"')) ||
    (s.startsWith("'") && s.endsWith("'"))
  ) {
    s = s.slice(1, -1).trim()
  }
  return s
}

/**
 * Parse cloudinary://API_KEY:API_SECRET@CLOUD_NAME
 * Manual split avoids URL() mangling secrets (e.g. +, :, or encoding issues).
 */
function parseCloudinaryUrl(raw: string) {
  const s = stripEnv(raw)
  const prefix = 'cloudinary://'
  if (!s.toLowerCase().startsWith(prefix)) return null

  const rest = s.slice(prefix.length)
  const at = rest.lastIndexOf('@')
  if (at <= 0 || at === rest.length - 1) return null

  let cloud_name = rest.slice(at + 1)
  const slash = cloud_name.indexOf('/')
  if (slash >= 0) cloud_name = cloud_name.slice(0, slash)
  cloud_name = stripEnv(cloud_name)
  if (!cloud_name) return null

  const userinfo = rest.slice(0, at)
  const colon = userinfo.indexOf(':')
  if (colon <= 0 || colon === userinfo.length - 1) return null

  let api_key = userinfo.slice(0, colon)
  let api_secret = userinfo.slice(colon + 1)

  try {
    api_key = stripEnv(decodeURIComponent(api_key))
  } catch {
    api_key = stripEnv(api_key)
  }
  try {
    api_secret = stripEnv(decodeURIComponent(api_secret))
  } catch {
    api_secret = stripEnv(api_secret)
  }

  if (!api_key || !api_secret) return null

  return { cloud_name, api_key, api_secret }
}

function readConfig() {
  // Prefer discrete vars so a correct secret isn't overridden by a broken CLOUDINARY_URL.
  const cloud_name = stripEnv(
    process.env.CLOUDINARY_CLOUD_NAME ?? process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
  )
  const api_key = stripEnv(process.env.CLOUDINARY_API_KEY)
  const api_secret = stripEnv(process.env.CLOUDINARY_API_SECRET)
  if (cloud_name && api_key && api_secret) {
    return { cloud_name, api_key, api_secret }
  }

  const fromEnvUrl = process.env.CLOUDINARY_URL
  if (fromEnvUrl) {
    const parsed = parseCloudinaryUrl(fromEnvUrl)
    if (parsed) return parsed
  }

  return null
}

export function isCloudinaryConfigured(): boolean {
  return readConfig() !== null
}

function uploadToFolder(buf: Buffer, folder: string): Promise<string> {
  const cfg = readConfig()
  if (!cfg) {
    return Promise.reject(new Error('Cloudinary is not configured'))
  }

  cloudinary.config({
    cloud_name: cfg.cloud_name,
    api_key: cfg.api_key,
    api_secret: cfg.api_secret,
  })

  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: 'image',
      },
      (err, result) => {
        if (err) {
          const http =
            typeof err === 'object' && err !== null && 'http_code' in err
              ? (err as { http_code?: number }).http_code
              : undefined
          if (http === 401) {
            reject(
              new Error(
                'Cloudinary auth failed (invalid signature). Verify CLOUDINARY_API_SECRET or CLOUDINARY_URL matches the dashboard, with no extra spaces or line breaks. Using CLOUDINARY_CLOUD_NAME + CLOUDINARY_API_KEY + CLOUDINARY_API_SECRET avoids URL parsing issues.'
              )
            )
            return
          }
          reject(err)
          return
        }
        const url = result?.secure_url
        if (!url) {
          reject(new Error('Cloudinary upload returned no URL'))
          return
        }
        resolve(url)
      }
    )
    stream.end(buf)
  })
}

/** Upload a gallery image buffer; returns HTTPS delivery URL. Server-only. */
export function uploadGalleryImageFromBuffer(buf: Buffer): Promise<string> {
  return uploadToFolder(buf, 'logit/gallery')
}

/** Upload a product image buffer; returns HTTPS delivery URL. Server-only. */
export function uploadProductImageFromBuffer(buf: Buffer): Promise<string> {
  return uploadToFolder(buf, 'logit/products')
}
