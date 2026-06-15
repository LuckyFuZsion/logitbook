import type { Metadata, Viewport } from 'next'
import { Orbitron, Rajdhani } from 'next/font/google'
import { Analytics } from '@vercel/analytics/react'
import { FirebaseWebInit } from '@/components/firebase-web-init'
import { AnnouncementBanner } from '@/components/announcement-banner'
import { WhatsAppCta } from '@/components/whatsapp-cta'
import { mergeAnnouncementData } from '@/lib/announcement-defaults'
import { readAnnouncementFile } from '@/lib/announcement-store'
import { mergeContactData } from '@/lib/contact-defaults'
import { mergeHoursData } from '@/lib/hours-defaults'
import { readContactFile } from '@/lib/contact-store'
import { readHoursFile } from '@/lib/hours-store'
import { SITE_DESCRIPTION, SITE_OG_IMAGE_ALT, SITE_OG_IMAGE_PATH, SITE_TITLE } from '@/lib/site-seo'
import { siteUrl } from '@/lib/site-url'
import './globals.css'

const canonicalSite = siteUrl()

const orbitron = Orbitron({
  subsets: ['latin'],
  variable: '--font-orbitron',
  weight: ['600', '700', '800'],
  display: 'swap',
})

const rajdhani = Rajdhani({
  subsets: ['latin'],
  variable: '--font-rajdhani',
  weight: ['400', '500', '600', '700'],
  display: 'swap',
})

export const metadata: Metadata = {
  metadataBase: new URL(canonicalSite),
  title: {
    default: SITE_TITLE,
    template: '%s | LOGITSHOP',
  },
  description: SITE_DESCRIPTION,
  manifest: '/favicon_io%20(9)/site.webmanifest',
  icons: {
    icon: [
      { url: '/favicon_io%20(9)/favicon.ico' },
      { url: '/favicon_io%20(9)/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon_io%20(9)/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon_io%20(9)/android-chrome-192x192.png', sizes: '192x192', type: 'image/png' },
      { url: '/favicon_io%20(9)/android-chrome-512x512.png', sizes: '512x512', type: 'image/png' },
    ],
    apple: [{ url: '/favicon_io%20(9)/apple-touch-icon.png', sizes: '180x180', type: 'image/png' }],
  },
  keywords: [
    'LOGITSHOP',
    'IDEST scuba servicing',
    'regulator service UK',
    'cylinder testing',
    'BCD servicing',
    'scuba equipment',
    'diving logbook',
    'dive accessories',
  ],
  authors: [{ name: 'LOGITSHOP' }],
  alternates: { canonical: canonicalSite },
  openGraph: {
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    type: 'website',
    url: canonicalSite,
    siteName: 'LOGITSHOP',
    locale: 'en_GB',
    images: [{ url: SITE_OG_IMAGE_PATH, alt: SITE_OG_IMAGE_ALT }],
  },
  twitter: {
    card: 'summary_large_image',
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    images: [SITE_OG_IMAGE_PATH],
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#061a33',
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const [contact, hours, announcement] = await Promise.all([
    readContactFile().then(mergeContactData),
    readHoursFile().then(mergeHoursData),
    readAnnouncementFile().then(mergeAnnouncementData),
  ])

  const localBusinessJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: contact.businessName,
    url: canonicalSite,
    description: contact.tagline,
    '@id': `${canonicalSite}/#business`,
    priceRange: '££',
    areaServed: 'Worldwide',
    email: contact.email,
    ...(contact.phone ? { telephone: contact.phone } : {}),
    address: {
      '@type': 'PostalAddress',
      streetAddress: contact.address.street,
      addressLocality: contact.address.city,
      addressRegion: contact.address.county,
      postalCode: contact.address.postcode,
      addressCountry: contact.address.country,
    },
    openingHoursSpecification: hours.schedule
      .filter((d) => !d.closed && d.open && d.close)
      .map((d) => ({
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: `https://schema.org/${d.day}`,
        opens: d.open,
        closes: d.close,
      })),
  }

  return (
    <html lang="en" className={`${orbitron.variable} ${rajdhani.variable} bg-background`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessJsonLd) }}
        />
      </head>
      <body
        className="font-sans antialiased bg-background text-foreground"
        style={{ fontFamily: 'var(--font-rajdhani), sans-serif' }}
      >
        <AnnouncementBanner initialData={announcement} />
        <FirebaseWebInit />
        {children}
        <WhatsAppCta variant="floating" />
        <Analytics />
      </body>
    </html>
  )
}
