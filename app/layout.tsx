import type { Metadata } from 'next'
import { Orbitron, Rajdhani } from 'next/font/google'
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
  manifest: '/favicon_io%20(6)/site.webmanifest',
  icons: {
    icon: [
      { url: '/favicon_io%20(6)/favicon.ico' },
      { url: '/favicon_io%20(6)/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon_io%20(6)/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon_io%20(6)/android-chrome-192x192.png', sizes: '192x192', type: 'image/png' },
      { url: '/favicon_io%20(6)/android-chrome-512x512.png', sizes: '512x512', type: 'image/png' },
    ],
    apple: [{ url: '/favicon_io%20(6)/apple-touch-icon.png', sizes: '180x180', type: 'image/png' }],
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
    title: 'LOGITSHOP',
    description:
      'Premium products and expert maintenance services from Logitshop.',
    type: 'website',
    url: 'https://logitshop.com',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'LOGITSHOP',
    description: 'Premium products and expert maintenance services.',
  },
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 5,
  },
  themeColor: '#061a33',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${orbitron.variable} ${rajdhani.variable} bg-background`}>
      <head>
        {/* JSON-LD: LocalBusiness */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'LocalBusiness',
              name: 'Logitshop',
              url: 'https://logitshop.com',
              description:
                'Fully accredited e-commerce and maintenance services platform.',
              '@id': 'https://logitshop.com/#business',
              priceRange: '$$',
              areaServed: 'Worldwide',
            }),
          }}
        />
      </head>
      <body
        className="font-sans antialiased bg-background text-foreground"
        style={{ fontFamily: 'var(--font-rajdhani), sans-serif' }}
      >
        {children}
      </body>
    </html>
  )
}
