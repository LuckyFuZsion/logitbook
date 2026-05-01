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
  title: 'Logitshop | Cyber-Industrial E-Commerce & Services',
  description:
    'Logitshop - your fully accredited, cutting-edge destination for premium products and expert maintenance services. Mobile-first, futuristic, built for performance.',
  keywords: [
    'Logitshop',
    'cyber industrial shop',
    'premium products',
    'maintenance services',
    'accredited services',
  ],
  authors: [{ name: 'Logitshop' }],
  openGraph: {
    title: 'Logitshop | Cyber-Industrial E-Commerce & Services',
    description:
      'Premium products and expert maintenance services from Logitshop.',
    type: 'website',
    url: 'https://logitshop.com',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Logitshop | Cyber-Industrial E-Commerce & Services',
    description: 'Premium products and expert maintenance services.',
  },
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 5,
  },
  themeColor: '#000000',
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
