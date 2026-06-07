import type { MetadataRoute } from 'next'
import { mergeFaqData } from '@/lib/faq-defaults'
import { mergeGalleryData } from '@/lib/gallery-defaults'
import { mergeServicesData } from '@/lib/services-defaults'
import { mergeStoreData } from '@/lib/store-defaults'
import { mergeStoryData } from '@/lib/story-defaults'
import { readFaqFile } from '@/lib/faq-store'
import { readGalleryFile } from '@/lib/gallery-store'
import { readServicesFile } from '@/lib/services-store'
import { readStoreFile } from '@/lib/store-store'
import { readStoryFile } from '@/lib/story-store'
import { parseLastModified, siteUrl } from '@/lib/site-url'

export async function buildSitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = siteUrl()

  const [storeRaw, faqRaw, galleryRaw, servicesRaw, storyRaw] = await Promise.all([
    readStoreFile(),
    readFaqFile(),
    readGalleryFile(),
    readServicesFile(),
    readStoryFile(),
  ])

  const store = mergeStoreData(storeRaw)
  const faq = mergeFaqData(faqRaw)
  const gallery = mergeGalleryData(galleryRaw)
  const services = mergeServicesData(servicesRaw)
  const story = mergeStoryData(storyRaw)

  const homeUpdated = parseLastModified(
    [store.updatedAt, faq.updatedAt, gallery.updatedAt, services.updatedAt, story.updatedAt]
      .filter(Boolean)
      .sort()
      .at(-1),
  )

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${baseUrl}/`, lastModified: homeUpdated, changeFrequency: 'weekly', priority: 1 },
    {
      url: `${baseUrl}/shop`,
      lastModified: parseLastModified(store.updatedAt),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/faq`,
      lastModified: parseLastModified(faq.updatedAt),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/services`,
      lastModified: parseLastModified(services.updatedAt),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/story`,
      lastModified: parseLastModified(story.updatedAt),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/gallery`,
      lastModified: parseLastModified(gallery.updatedAt),
      changeFrequency: 'weekly',
      priority: 0.7,
      images: gallery.grid.map((item) => item.src).filter((src) => /^https?:\/\//.test(src)),
    },
    {
      url: `${baseUrl}/returns`,
      lastModified: homeUpdated,
      changeFrequency: 'yearly',
      priority: 0.4,
    },
    {
      url: `${baseUrl}/privacy-policy`,
      lastModified: homeUpdated,
      changeFrequency: 'yearly',
      priority: 0.3,
    },
  ]

  const productRoutes: MetadataRoute.Sitemap = store.products.map((product) => ({
    url: `${baseUrl}/shop/${encodeURIComponent(product.id)}`,
    lastModified: parseLastModified(store.updatedAt),
    changeFrequency: 'weekly',
    priority: 0.85,
    images: product.images.filter((src) => /^https?:\/\//.test(src)),
  }))

  return [...staticRoutes, ...productRoutes]
}
