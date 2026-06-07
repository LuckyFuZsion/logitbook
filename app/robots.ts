import type { MetadataRoute } from 'next'
import { siteUrl } from '@/lib/site-url'

export default function robots(): MetadataRoute.Robots {
  const baseUrl = siteUrl()
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/_next/', '/admin/'],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  }
}
