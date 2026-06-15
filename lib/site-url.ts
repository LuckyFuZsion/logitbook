/** Staging / preview host until the custom domain is live. */
export const STAGING_SITE_URL = 'https://logitshop.vercel.app'

/** Production custom domain (set NEXT_PUBLIC_SITE_URL when go-live). */
export const PRODUCTION_SITE_URL = 'https://logitshop.com'

function stripTrailingSlash(value: string): string {
  return value.replace(/\/+$/, '')
}

/**
 * Canonical site origin for sitemap, robots, metadata, and JSON-LD (server).
 * Priority: NEXT_PUBLIC_SITE_URL → production staging URL → preview VERCEL_URL.
 */
export function siteUrl(): string {
  const fromEnv = process.env.NEXT_PUBLIC_SITE_URL
  if (fromEnv) return stripTrailingSlash(fromEnv)

  if (process.env.VERCEL_ENV === 'production') {
    return STAGING_SITE_URL
  }

  const vercel = process.env.VERCEL_URL
  if (vercel) return `https://${stripTrailingSlash(vercel)}`

  return STAGING_SITE_URL
}

/**
 * Client-safe canonical origin (inlined at build time from NEXT_PUBLIC_SITE_URL).
 */
export function publicSiteUrl(): string {
  const fromEnv = process.env.NEXT_PUBLIC_SITE_URL
  if (fromEnv) return stripTrailingSlash(fromEnv)
  return STAGING_SITE_URL
}

export function parseLastModified(value: string | undefined): Date {
  if (!value) return new Date()
  const d = new Date(value)
  return Number.isNaN(d.getTime()) ? new Date() : d
}
