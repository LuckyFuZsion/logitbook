import type { MetadataRoute } from 'next'
import { mergeFaqData } from '@/lib/faq-defaults'
import { mergeGalleryData } from '@/lib/gallery-defaults'
import { mergeServicesData } from '@/lib/services-defaults'
import { mergeStoreData } from '@/lib/store-defaults'
import { mergeStoryData } from '@/lib/story-defaults'
import { mergeTestimonialsData } from '@/lib/testimonials-defaults'
import { readFaqFile } from '@/lib/faq-store'
import { readGalleryFile } from '@/lib/gallery-store'
import { readServicesFile } from '@/lib/services-store'
import { readStoreFile } from '@/lib/store-store'
import { readStoryFile } from '@/lib/story-store'
import { readTestimonialsFile } from '@/lib/testimonials-store'
import { parseLastModified, siteUrl } from '@/lib/site-url'

function absoluteHttpsImages(urls: string[]): string[] | undefined {
  const valid = urls.filter((src) => {
    if (!/^https:\/\//i.test(src)) return false
    try {
      new URL(src)
      return true
    } catch {
      return false
    }
  })
  return valid.length > 0 ? valid : undefined
}

export async function buildSitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = siteUrl()

  const [storeRaw, faqRaw, galleryRaw, servicesRaw, storyRaw, testimonialsRaw] = await Promise.all([
    readStoreFile(),
    readFaqFile(),
    readGalleryFile(),
    readServicesFile(),
    readStoryFile(),
    readTestimonialsFile(),
  ])

  const store = mergeStoreData(storeRaw)
  const faq = mergeFaqData(faqRaw)
  const gallery = mergeGalleryData(galleryRaw)
  const services = mergeServicesData(servicesRaw)
  const story = mergeStoryData(storyRaw)
  const testimonials = mergeTestimonialsData(testimonialsRaw)

  const homeUpdated = parseLastModified(
    [store.updatedAt, faq.updatedAt, gallery.updatedAt, services.updatedAt, story.updatedAt, testimonials.updatedAt]
      .filter(Boolean)
      .sort()
      .at(-1),
  )

  const galleryImages = absoluteHttpsImages(gallery.grid.map((item) => item.src))

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
      url: `${baseUrl}/testimonials`,
      lastModified: parseLastModified(testimonials.updatedAt),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/gallery`,
      lastModified: parseLastModified(gallery.updatedAt),
      changeFrequency: 'weekly',
      priority: 0.7,
      ...(galleryImages ? { images: galleryImages } : {}),
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

  const productRoutes: MetadataRoute.Sitemap = store.products.map((product) => {
    const images = absoluteHttpsImages(product.images)
    return {
      url: `${baseUrl}/shop/${encodeURIComponent(product.id)}`,
      lastModified: parseLastModified(store.updatedAt),
      changeFrequency: 'weekly',
      priority: 0.85,
      ...(images ? { images } : {}),
    }
  })

  return [...staticRoutes, ...productRoutes]
}
