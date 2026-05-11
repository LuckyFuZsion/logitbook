import type { MetadataRoute } from 'next'

function siteUrl() {
  return process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/+$/, '') || 'https://logitshop.com'
}

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = siteUrl()
  const lastModified = new Date()

  const routes: MetadataRoute.Sitemap = [
    { url: `${baseUrl}/`, lastModified },
    { url: `${baseUrl}/privacy-policy`, lastModified },
    { url: `${baseUrl}/faq`, lastModified },
    { url: `${baseUrl}/shop`, lastModified },
    { url: `${baseUrl}/services`, lastModified },
    { url: `${baseUrl}/story`, lastModified },
    { url: `${baseUrl}/gallery`, lastModified },
  ]

  return routes
}

