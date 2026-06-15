import type { MetadataRoute } from 'next'
import { buildSitemap } from '@/lib/sitemap-data'
import { siteUrl } from '@/lib/site-url'

export const dynamic = 'force-dynamic'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  try {
    return await buildSitemap()
  } catch (error) {
    console.error('[sitemap] build failed:', error)
    const baseUrl = siteUrl()
    return [
      {
        url: `${baseUrl}/`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: 1,
      },
    ]
  }
}
