import { mergeAnnouncementData } from '@/lib/announcement-defaults'
import { readAnnouncementFile } from '@/lib/announcement-store'
import { mergeContactData } from '@/lib/contact-defaults'
import { readContactFile } from '@/lib/contact-store'
import type { AnnouncementData } from '@/lib/announcement-types'
import type { ContactData } from '@/lib/contact-types'
import type { FaqData } from '@/lib/faq-types'
import type { ResolvedGalleryData } from '@/lib/gallery-types'
import type { HeroData } from '@/lib/hero-types'
import type { HoursData } from '@/lib/hours-types'
import type { ServicesData } from '@/lib/services-types'
import type { StoreData } from '@/lib/store-types'
import type { StoryData } from '@/lib/story-types'
import type { TestimonialsData } from '@/lib/testimonials-types'
import { mergeFaqData } from '@/lib/faq-defaults'
import { readFaqFile } from '@/lib/faq-store'
import { mergeGalleryData } from '@/lib/gallery-defaults'
import { readGalleryFile } from '@/lib/gallery-store'
import { mergeHeroData } from '@/lib/hero-defaults'
import { readHeroFile } from '@/lib/hero-store'
import { mergeHoursData } from '@/lib/hours-defaults'
import { readHoursFile } from '@/lib/hours-store'
import { mergeServicesData } from '@/lib/services-defaults'
import { readServicesFile } from '@/lib/services-store'
import { mergeStoreData } from '@/lib/store-defaults'
import { readStoreFile } from '@/lib/store-store'
import { mergeStoryData } from '@/lib/story-defaults'
import { readStoryFile } from '@/lib/story-store'
import { mergeTestimonialsData } from '@/lib/testimonials-defaults'
import { readTestimonialsFile } from '@/lib/testimonials-store'

export interface HomeCmsData {
  hero: HeroData
  store: StoreData
  services: ServicesData
  testimonials: TestimonialsData
  story: StoryData
  gallery: ResolvedGalleryData
  faq: FaqData
  contact: ContactData
  hours: HoursData
  announcement: AnnouncementData
}

/** Single server-side read for the homepage (Firestore/file with defaults). */
export async function loadHomeCmsData(): Promise<HomeCmsData> {
  const [
    heroRaw,
    storeRaw,
    servicesRaw,
    testimonialsRaw,
    storyRaw,
    galleryRaw,
    faqRaw,
    contactRaw,
    hoursRaw,
    announcementRaw,
  ] = await Promise.all([
    readHeroFile(),
    readStoreFile(),
    readServicesFile(),
    readTestimonialsFile(),
    readStoryFile(),
    readGalleryFile(),
    readFaqFile(),
    readContactFile(),
    readHoursFile(),
    readAnnouncementFile(),
  ])

  return {
    hero: mergeHeroData(heroRaw),
    store: mergeStoreData(storeRaw),
    services: mergeServicesData(servicesRaw),
    testimonials: mergeTestimonialsData(testimonialsRaw),
    story: mergeStoryData(storyRaw),
    gallery: mergeGalleryData(galleryRaw),
    faq: mergeFaqData(faqRaw),
    contact: mergeContactData(contactRaw),
    hours: mergeHoursData(hoursRaw),
    announcement: mergeAnnouncementData(announcementRaw),
  }
}
