import type { Metadata, Viewport } from 'next'
import { Orbitron, Rajdhani } from 'next/font/google'
import { FirebaseWebInit } from '@/components/firebase-web-init'
import { AnnouncementBanner } from '@/components/announcement-banner'
import { mergeContactData } from '@/lib/contact-defaults'
import { mergeHoursData } from '@/lib/hours-defaults'
import { readContactFile } from '@/lib/contact-store'
import { readHoursFile } from '@/lib/hours-store'
import './globals.css'

const orbitron = Orbitron({
  subsets: ['latin'],
  variable: '--font-orbitron',
  weight: ['400', '500', '600', '700', '800', '900'],
})

const rajdhani = Rajdhani({
  subsets: ['latin'],
  variable: '--font-rajdhani',
  weight: ['300', '400', '500', '600', '700'],
})

export const metadata: Metadata = {
  title: 'LOGITSHOP',
  description:
    'Logitshop - your fully accredited, cutting-edge destination for premium products and expert maintenance services. Mobile-first, futuristic, built for performance.',
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
    'Logitshop',
    'cyber industrial shop',
    'premium products',
    'maintenance services',
    'accredited services',
  ],
  authors: [{ name: 'Logitshop' }],
  openGraph: {
    title: 'LOG‑it Diving Logbook & IDEST Accredited Scuba Services | LOGITSHOP',
    description:
      'Since 1988, LOG‑it has been the prestigious UK diving logbook trusted by divers worldwide. Premium UK‑printed logbooks, IDEST‑accredited regulator & cylinder servicing, and expert scuba equipment care.',
    type: 'website',
    url: 'https://logitshop.com',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'LOG‑it Diving Logbook & IDEST Accredited Scuba Services | LOGITSHOP',
    description:
      'Since 1988, LOG‑it has been the prestigious UK diving logbook trusted by divers worldwide. Premium UK‑printed logbooks, IDEST‑accredited regulator & cylinder servicing, and expert scuba equipment care.',
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
  const [contact, hours] = await Promise.all([
    readContactFile().then(mergeContactData),
    readHoursFile().then(mergeHoursData),
  ])

  const localBusinessJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: contact.businessName,
    url: contact.siteUrl,
    description: contact.tagline,
    '@id': `${contact.siteUrl}/#business`,
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
        <AnnouncementBanner />
        <FirebaseWebInit />
        {children}
      </body>
    </html>
  )
}
