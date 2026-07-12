import type { Metadata } from 'next'

const description =
  'Centuries Mutual sells exclusive health insurance for members — plans, rewards wallet, rent and bill pay, wellness through My Brother’s Keeper, Wintergarden music performance, and member-only compounding in one brokerage.'

export const metadata: Metadata = {
  metadataBase: new URL('https://centuriesmutual.com'),
  title: {
    default: 'Centuries Mutual | Exclusive Health Insurance Membership',
    template: '%s | Centuries Mutual',
  },
  description,
  keywords: [
    'health insurance',
    'Centuries Mutual',
    'exclusive health insurance',
    'member rewards',
    'healthcare wallet',
    'individual family plans',
    'Dallas Texas insurance brokerage',
    'My Brother’s Keeper',
    'Wintergarden',
    'member compounding',
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
    title: 'Centuries Mutual | Exclusive Health Insurance Membership',
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
    title: 'Centuries Mutual | Exclusive Health Insurance Membership',
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
      '@type': 'InsuranceAgency',
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
      areaServed: {
        '@type': 'Country',
        name: 'United States',
      },
      sameAs: [
        'https://centuriesmutual.com/individual-family-services',
        'https://centuriesmutual.com/enrollment',
        'https://centuriesmutual.com/downloads',
        'https://centuriesmutual.com/help-desk',
        'https://mybrotherskeeper.cc',
      ],
      hasOfferCatalog: {
        '@type': 'OfferCatalog',
        name: 'Centuries Mutual Member Services',
        itemListElement: [
          {
            '@type': 'Offer',
            itemOffered: {
              '@type': 'Service',
              name: 'Exclusive Health Insurance',
              url: 'https://centuriesmutual.com/individual-family-services',
            },
          },
          {
            '@type': 'Offer',
            itemOffered: {
              '@type': 'Service',
              name: 'Healthcare Rewards Wallet',
              url: 'https://centuriesmutual.com/treasury',
            },
          },
          {
            '@type': 'Offer',
            itemOffered: {
              '@type': 'Service',
              name: 'Rent, Bills & Groceries Pay',
              url: 'https://centuriesmutual.com/pay',
            },
          },
          {
            '@type': 'Offer',
            itemOffered: {
              '@type': 'Service',
              name: 'Fitness & Wellness via My Brother’s Keeper',
              url: 'https://centuriesmutual.com/my-brothers-keeper',
            },
          },
          {
            '@type': 'Offer',
            itemOffered: {
              '@type': 'Service',
              name: 'Wintergarden Music Performance',
              url: 'https://centuriesmutual.com/wintergarden',
            },
          },
          {
            '@type': 'Offer',
            itemOffered: {
              '@type': 'Service',
              name: 'Member-Only Compounding',
              url: 'https://centuriesmutual.com/rentalequity',
            },
          },
        ],
      },
    }),
  },
}
