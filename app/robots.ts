import type { MetadataRoute } from 'next'

function siteUrl() {
  return process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/+$/, '') || 'https://logitshop.com'
}

export default function robots(): MetadataRoute.Robots {
  const baseUrl = siteUrl()
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/_next/'],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  }
}

