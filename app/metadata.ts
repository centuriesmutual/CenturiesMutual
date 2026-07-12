import type { Metadata } from 'next'

const description =
  'Your Community Brokerage: A healthcare rewards network that empowers individuals, families, and employers through supplemental wellness initiatives focused on fitness, nutrition, preventive care, and music performance. Powered by blockchain technology, the platform securely tracks participation, verifies achievements, and delivers transparent rewards and incentives that encourage healthier lifestyles while strengthening community engagement.'

export const metadata: Metadata = {
  metadataBase: new URL('https://centuriesmutual.com'),
  title: {
    default: 'Centuries Mutual',
    template: '%s | Centuries Mutual',
  },
  description,
  keywords: [
    'Centuries Mutual',
    'community brokerage',
    'healthcare rewards',
    'wellness',
    'fitness',
    'nutrition',
    'preventive care',
    'music performance',
    'blockchain rewards',
    'Dallas Texas',
  ],
  authors: [{ name: 'Centuries Mutual' }],
  creator: 'Centuries Mutual',
  publisher: 'Centuries Mutual',
  icons: {
    icon: '/favicon.ico',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://centuriesmutual.com',
    siteName: 'Centuries Mutual',
    title: 'Centuries Mutual',
    description,
    images: [
      {
        url: '/cmlogotreesmall-removebg-preview.png',
        width: 512,
        height: 512,
        alt: 'Centuries Mutual',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Centuries Mutual',
    description,
    images: ['/cmlogotreesmall-removebg-preview.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1,
    },
  },
  alternates: {
    canonical: 'https://centuriesmutual.com',
  },
  other: {
    'application/ld+json': JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: 'Centuries Mutual',
      url: 'https://centuriesmutual.com',
      logo: 'https://centuriesmutual.com/cmlogotreesmall-removebg-preview.png',
      description,
      address: {
        '@type': 'PostalAddress',
        addressLocality: 'Dallas',
        addressRegion: 'TX',
        addressCountry: 'US',
      },
    }),
  },
}
