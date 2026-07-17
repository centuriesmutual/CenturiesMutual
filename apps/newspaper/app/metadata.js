export const metadata = {
  title: 'Centuries Mutual',
  description: 'Your Community Brokerage: Providing a secure network for digital payments and travel services powered by blockchain technology.',
  icons: {
    icon: '/favicon.ico',
  },
  other: {
    'application/ld+json': JSON.stringify({
      "@context": "https://schema.org",
      "@type": "Organization",
      "name": "Centuries Mutual",
      "url": "https://centuriesmutual.com",
      "logo": "https://centuriesmutual.com/cmlogotreesmall-removebg-preview.png",
      "description": "Your Community Brokerage: Providing a secure network for digital payments and travel services powered by blockchain technology.",
      "sameAs": [
        "https://centuriesmutual.com/newspaper",
        "https://centuriesmutual.com/contact",
        "https://centuriesmutual.com/partners",
        "https://centuriesmutual.com/investor-relations",
        "https://centuriesmutual.com/careers"
      ],
      "mainEntity": {
        "@type": "WebSite",
        "name": "Centuries Mutual",
        "url": "https://centuriesmutual.com",
        "potentialAction": {
          "@type": "SearchAction",
          "target": "https://centuriesmutual.com/community?search={search_term_string}",
          "query-input": "required name=search_term_string"
        }
      },
      "hasOfferCatalog": {
        "@type": "OfferCatalog",
        "name": "Centuries Mutual Services",
        "itemListElement": [
          {
            "@type": "Offer",
            "itemOffered": {
              "@type": "Service",
              "name": "Newspaper",
              "url": "https://centuriesmutual.com/newspaper"
            }
          },
          {
            "@type": "Offer",
            "itemOffered": {
              "@type": "Service",
              "name": "Help Desk",
              "url": "https://centuriesmutual.com/contact"
            }
          },
          {
            "@type": "Offer",
            "itemOffered": {
              "@type": "Service",
              "name": "Subsidiaries",
              "url": "https://centuriesmutual.com/partners"
            }
          },
          {
            "@type": "Offer",
            "itemOffered": {
              "@type": "Service",
              "name": "Investor Relations",
              "url": "https://centuriesmutual.com/investor-relations"
            }
          },
          {
            "@type": "Offer",
            "itemOffered": {
              "@type": "Service",
              "name": "Careers",
              "url": "https://centuriesmutual.com/careers"
            }
          }
        ]
      },
      "potentialAction": {
        "@type": "SearchAction",
        "target": "https://centuriesmutual.com/community?search={search_term_string}",
        "query-input": "required name=search_term_string"
      }
    })
  }
} 