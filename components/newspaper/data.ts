// Newspaper article dataset for The Centuries Mutual Times.
//
// Data source note: the newspaper's live "Columns" feed is still sourced from
// Box.com via /api/box-news (see BoxNewsColumns). The evergreen front-page and
// article-page stories below mirror the slugs the site already links to
// (/article/<slug>) so existing routing keeps working after the presentation
// redesign. If/when the Box pipeline is populated, that feed renders alongside
// these stories.

export interface NewspaperArticle {
  slug: string
  section: string
  kicker: string
  title: string
  deck: string
  author: string
  role: string
  date: string
  image: string
  imageCaption: string
  imageCredit: string
  body: string[]
}

export const SECTIONS = [
  'World',
  'Business',
  'Health',
  'Coverage',
  'Community',
  'Rewards',
  'Opinion',
] as const

export const articles: NewspaperArticle[] = [
  {
    slug: 'edocument-system-launch',
    section: 'Technology',
    kicker: 'The Lead',
    title:
      'Centuries Mutual Launches Revolutionary eDocument System for Real Estate',
    deck:
      'The company unveils a digital platform that promises to compress days of paperwork into minutes, reshaping how renters and roommates close a deal.',
    author: 'The Financial News Desk',
    role: 'Financial News Desk',
    date: 'Friday, July 17, 2026',
    image:
      'https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80',
    imageCaption:
      'The new eDocument workspace lets applicants sign, verify and store lease paperwork without leaving the platform.',
    imageCredit: 'Centuries Mutual',
    body: [
      'Centuries Mutual has unveiled its groundbreaking eDocument system, revolutionizing how individuals find and rent real estate with roommates. This new platform integrates seamlessly with the company’s existing services to provide a comprehensive digital solution for property transactions.',
      'The eDocument system automates the entire documentation process, from initial lease agreements to roommate contracts and verification documents. Users can now complete all necessary paperwork in minutes rather than days.',
      '“This system represents a significant leap forward in digital real estate transactions,” said the company’s chief executive. “We’re making the rental process faster, more secure, and more accessible for everyone.”',
      'The platform features advanced security measures including encryption, digital signatures, and automated verification to ensure document authenticity and user protection. Early adopters have praised the system’s ease of use and efficiency.',
    ],
  },
  {
    slug: 'real-estate-strong-growth-q4',
    section: 'Real Estate',
    kicker: 'Markets',
    title: 'Real Estate Market Shows Strong Growth in Q4',
    deck:
      'Rental prices climbed 8.5% year over year, marking a third straight quarter of gains across both urban and suburban markets.',
    author: 'Market Analysis Team',
    role: 'Market Analysis Team',
    date: 'Friday, July 17, 2026',
    image:
      'https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
    imageCaption:
      'Demand for flexible, roommate-based rentals has fueled a sustained run of price growth.',
    imageCredit: 'Getty Images',
    body: [
      'The real estate market continues to show robust growth with rental prices increasing by 8.5% year-over-year. This marks the third consecutive quarter of significant growth, reflecting strong demand in both urban and suburban markets.',
      'Analysts point to several factors driving this growth, including increased remote work flexibility, changing housing preferences, and improved digital platforms that make rental processes more accessible. The shift towards flexible living arrangements has particularly benefited roommate-based rental models.',
      '“The market is demonstrating remarkable resilience,” commented the lead market analyst. “We’re seeing sustained strength across multiple property types and price points.”',
      'Digital platforms like Centuries Mutual have contributed significantly to this growth by streamlining the rental process and reducing barriers to entry for both tenants and landlords. The integration of technology has made property transactions more efficient and transparent.',
    ],
  },
  {
    slug: 'credit-rating-widespread-adoption',
    section: 'Technology',
    kicker: 'Trust & Safety',
    title: 'In-House Trust Score System Gains Widespread Adoption',
    deck:
      'More than 5,000 verified members and 2,100 successful matches signal growing confidence in algorithmic vetting.',
    author: 'Technology Reporter',
    role: 'Technology Desk',
    date: 'Friday, July 17, 2026',
    image:
      'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
    imageCaption:
      'The recommendation engine weighs lifestyle, financial and compatibility signals to rank potential matches.',
    imageCredit: 'Centuries Mutual',
    body: [
      'The new member in-house trust score system based on our recommendation engine has seen widespread adoption, with over 5,000 verified members and 2,100 successful matches. This milestone demonstrates the platform’s effectiveness in connecting compatible roommates and property seekers.',
      'The system uses advanced algorithms to assess user compatibility, verify credentials, and match individuals based on lifestyle preferences, financial profiles, and living requirements. This data-driven approach has significantly improved matching success rates.',
      '“The adoption rate has exceeded our expectations,” said the platform’s technology director. “Users appreciate the transparency and reliability that our verification system provides.”',
      'The in-house trust score system includes automated background checks, financial verification, and compatibility scoring. This comprehensive approach helps users make informed decisions and reduces risks associated with roommate matching and property rentals.',
    ],
  },
  {
    slug: 'document-processing-million-milestone',
    section: 'Business',
    kicker: 'Operations',
    title: 'Document Processing Reaches 1 Million Milestone',
    deck:
      'A 99.8% accuracy rate across a million processed documents sets a new benchmark for automated verification.',
    author: 'Business Reporter',
    role: 'Business Desk',
    date: 'Friday, July 17, 2026',
    image:
      'https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
    imageCaption:
      'Automated pipelines now handle leases, contracts and verification materials at scale.',
    imageCredit: 'Getty Images',
    body: [
      'Centuries Mutual’s document processing system has successfully handled over 1 million documents with a 99.8% accuracy rate. This achievement sets new industry standards for digital document management and automated processing.',
      'The system can process various document types including lease agreements, roommate contracts, property documentation, verification materials, and legal forms. Automated verification ensures accuracy and compliance with regulatory requirements.',
      '“This milestone reflects our commitment to excellence and innovation,” commented the company’s operations manager. “Our automated processing capabilities have transformed how documents are handled in real estate transactions.”',
      'The high accuracy rate is attributed to advanced OCR technology, machine learning algorithms, and rigorous quality control measures. The system continues to improve through continuous learning and user feedback.',
    ],
  },
  {
    slug: 'ai-powered-features-enhance',
    section: 'Technology',
    kicker: 'Product',
    title: 'AI-Powered Features Enhance User Experience',
    deck:
      'New machine-learning tools sharpen compatibility scores and personalize the search for a roommate.',
    author: 'Technology Editor',
    role: 'Technology Desk',
    date: 'Friday, July 17, 2026',
    image:
      'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
    imageCaption:
      'Natural-language tools help members build richer profiles and find better matches.',
    imageCredit: 'Centuries Mutual',
    body: [
      'New artificial intelligence features have been integrated into the platform, improving matching algorithms and providing more accurate roommate compatibility assessments. These AI-powered enhancements personalize the user experience and increase match success rates.',
      'The system now uses machine learning to analyze user preferences, behavior patterns, and successful matches to continuously improve its recommendations. Natural language processing capabilities help users create detailed profiles and search for compatible roommates more effectively.',
      '“AI technology is revolutionizing how we approach roommate matching,” explained the chief technology officer. “These features make our platform more intuitive and help users find better matches faster.”',
      'Key AI features include intelligent property recommendations, automated compatibility scoring, predictive search, and personalized content delivery. Users report significantly improved experiences and higher satisfaction rates with these new capabilities.',
    ],
  },
  {
    slug: 'digital-lease-agreements-adoption',
    section: 'Real Estate',
    kicker: 'Housing',
    title: 'Digital Lease Agreements See 300% Adoption',
    deck:
      'Tenants and landlords are trading paper for electronic signatures at a record pace.',
    author: 'Real Estate Correspondent',
    role: 'Real Estate Desk',
    date: 'Friday, July 17, 2026',
    image:
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
    imageCaption:
      'Electronic leases can be reviewed, signed and stored without a single sheet of paper.',
    imageCredit: 'Getty Images',
    body: [
      'The adoption of digital lease agreements has increased by 300% in the past quarter, with tenants and landlords embracing the streamlined process. This dramatic growth reflects the real estate industry’s shift towards digital transformation.',
      'Digital lease agreements offer numerous advantages including instant accessibility, automated reminders, easy updates, and secure storage. Both parties can review, sign, and store documents electronically without traditional paperwork.',
      '“The shift to digital agreements has been transformative,” noted the real estate correspondent. “Landlords and tenants appreciate the efficiency and convenience of electronic document management.”',
      'The platform’s digital lease system includes automated compliance checking, electronic signature verification, and cloud-based storage. These features ensure document security while making the leasing process faster and more convenient for all parties involved.',
    ],
  },
  {
    slug: 'roommate-matching-95-success',
    section: 'Community',
    kicker: 'Community',
    title: 'Roommate Matching Success Rate Hits 95%',
    deck:
      'More than 2,100 matches in a single quarter point to the strength of a data-driven pairing model.',
    author: 'Community Affairs Reporter',
    role: 'Community Desk',
    date: 'Friday, July 17, 2026',
    image:
      'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
    imageCaption:
      'Compatibility scoring weighs habits, budgets and interests to pair roommates.',
    imageCredit: 'Getty Images',
    body: [
      'The platform’s roommate matching system has achieved a 95% success rate, with over 2,100 successful matches recorded in the first quarter. This high success rate demonstrates the effectiveness of the platform’s algorithmic approach to roommate compatibility assessment.',
      'The matching system considers multiple factors including lifestyle preferences, living habits, financial situations, and personal interests. Advanced algorithms analyze these factors to create highly compatible roommate pairings.',
      '“This success rate is unprecedented in the industry,” said the community affairs reporter. “Users are finding compatible roommates faster and with better long-term outcomes.”',
      'The system includes user feedback mechanisms and continuous improvement algorithms that learn from successful matches. This data-driven approach ensures that the matching system becomes more effective over time, leading to even higher success rates.',
    ],
  },
  {
    slug: 'centuries-mutual-bbb-rating',
    section: 'Business',
    kicker: 'Reputation',
    title: 'Centuries Mutual Maintains BBB A Rating',
    deck:
      'The company’s sustained mark reflects a record of transparency and customer service.',
    author: 'Financial News Desk',
    role: 'Financial News Desk',
    date: 'Friday, July 17, 2026',
    image:
      'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
    imageCaption:
      'The Better Business Bureau weighs complaint history and transparency in its ratings.',
    imageCredit: 'Getty Images',
    body: [
      'Centuries Mutual has successfully maintained its A rating from the Better Business Bureau, reflecting the company’s commitment to ethical business practices and customer satisfaction.',
      'The BBB rating is based on several factors including complaint history, transparency of business practices, and time in business. Centuries Mutual’s consistent A rating demonstrates the company’s dedication to maintaining high standards in the real estate and financial services sector.',
      '“This rating reflects our ongoing commitment to transparency and customer service excellence,” said the company’s chief executive. “We’re proud to maintain this standard as we continue to expand our digital real estate platform.”',
      'The company’s digital document management system and roommate matching platform have contributed to positive customer feedback, helping maintain the prestigious rating.',
    ],
  },
  {
    slug: 'document-auditing-expansion',
    section: 'Business',
    kicker: 'Expansion',
    title: 'Document Auditing Services Expand Nationwide',
    deck:
      'New regional offices bring verification and fraud detection to a wider customer base.',
    author: 'Business Reporter',
    role: 'Business Desk',
    date: 'Friday, July 17, 2026',
    image:
      'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
    imageCaption:
      'Regional partnerships extend document auditing coverage across the country.',
    imageCredit: 'Centuries Mutual',
    body: [
      'Centuries Mutual has announced the nationwide expansion of its document auditing services, bringing enhanced security and verification capabilities to users across the United States.',
      'The expansion includes new regional offices and partnerships with local real estate professionals to ensure comprehensive coverage of document verification services.',
      '“This expansion allows us to provide our document auditing services to a broader customer base while maintaining the high quality standards our users expect,” explained the company’s operations director.',
      'The service includes automated document verification, fraud detection, and compliance checking for lease agreements, roommate contracts, and property documentation.',
    ],
  },
  {
    slug: 'community-standards-update',
    section: 'Community',
    kicker: 'Trust & Safety',
    title: 'Community Standards Update Enhances Safety',
    deck:
      'Stronger verification and clearer reporting tools aim to keep the platform secure.',
    author: 'Community Affairs Reporter',
    role: 'Community Desk',
    date: 'Friday, July 17, 2026',
    image:
      'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
    imageCaption:
      'Updated guidelines add background verification and clearer reporting paths.',
    imageCredit: 'Getty Images',
    body: [
      'Centuries Mutual has implemented comprehensive updates to its community standards, enhancing safety protocols and user protection across all platform services.',
      'The new standards include enhanced background verification processes, improved reporting mechanisms, and stricter enforcement of community guidelines.',
      '“User safety is our top priority,” stated the company’s community manager. “These updates ensure that our platform remains a secure environment for all users seeking roommate matches and property services.”',
      'The updates also include new educational resources to help users understand their rights and responsibilities when using the platform.',
    ],
  },
  {
    slug: 'real-estate-market-growth',
    section: 'Real Estate',
    kicker: 'Markets',
    title: 'Real Estate Market Shows 8.5% Growth in Q4',
    deck:
      'Analysts credit remote work and digital platforms for reshaping housing demand.',
    author: 'Market Analysis Team',
    role: 'Market Analysis Team',
    date: 'Friday, July 17, 2026',
    image:
      'https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
    imageCaption:
      'Urban rental demand has been a leading driver of fourth-quarter gains.',
    imageCredit: 'Getty Images',
    body: [
      'The real estate market continues to show robust growth with rental prices increasing by 8.5% year-over-year in the fourth quarter, according to the latest market analysis.',
      'Analysts attribute this growth to increased demand for rental properties, particularly in urban areas where remote work has changed housing preferences.',
      '“The market is showing remarkable resilience,” noted the lead market analyst. “We’re seeing continued strength in both traditional rental markets and emerging digital platforms.”',
      'Digital platforms like Centuries Mutual are contributing to this growth by streamlining the rental process and making property transactions more accessible to users.',
    ],
  },
  {
    slug: 'credit-rating-5000-members',
    section: 'Technology',
    kicker: 'Trust & Safety',
    title: 'In-House Trust Score System Reaches 5,000 Members',
    deck:
      'A milestone quarter underscores growing trust in digital verification.',
    author: 'Technology Reporter',
    role: 'Technology Desk',
    date: 'Friday, July 17, 2026',
    image:
      'https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
    imageCaption:
      'The trust score model has recorded 2,100 successful matches to date.',
    imageCredit: 'Centuries Mutual',
    body: [
      'The member in-house trust score system based on our recommendation engine has reached a significant milestone with over 5,000 verified members and 2,100 successful matches in the first quarter.',
      'This achievement demonstrates the growing trust in digital verification systems and the effectiveness of the platform’s matching algorithms.',
      '“Reaching 5,000 members is a testament to the value our in-house trust score system provides,” said the platform’s technology director. “Users are finding it increasingly valuable for making informed decisions about roommate matches.”',
      'The system uses advanced algorithms to assess compatibility and provide users with detailed insights about potential roommates and property matches.',
    ],
  },
  {
    slug: 'platform-million-documents',
    section: 'Business',
    kicker: 'Operations',
    title: 'Platform Reaches 1 Million Document Milestone',
    deck:
      'The processing engine clears a million documents while holding a 99.8% accuracy rate.',
    author: 'Business Reporter',
    role: 'Business Desk',
    date: 'Friday, July 17, 2026',
    image:
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
    imageCaption:
      'The milestone spans leases, contracts and verification materials.',
    imageCredit: 'Getty Images',
    body: [
      'Centuries Mutual’s document processing system has successfully handled over 1 million documents with a 99.8% accuracy rate, setting new industry standards for digital document management.',
      'This milestone represents a significant achievement in automated document processing and verification, demonstrating the platform’s reliability and efficiency.',
      '“Processing 1 million documents with such high accuracy is a remarkable achievement,” commented the company’s operations manager. “It shows our commitment to providing reliable, efficient services to our users.”',
      'The system handles various document types including lease agreements, roommate contracts, property documentation, and verification materials.',
    ],
  },
]

export const articlesBySlug: Record<string, NewspaperArticle> = articles.reduce(
  (acc, article) => {
    acc[article.slug] = article
    return acc
  },
  {} as Record<string, NewspaperArticle>,
)

export function getArticle(slug: string): NewspaperArticle | undefined {
  return articlesBySlug[slug]
}

// Short "Opinion" items and "Business Briefs" used in the right rail of the
// front page. These are editorial standing items, not full articles.
export const opinionItems = [
  {
    title: 'The Future of Digital Real Estate',
    author: 'By The Editorial Board',
    excerpt:
      'As technology continues to reshape the real estate landscape, platforms like Centuries Mutual are leading the charge in digital transformation and user protection.',
  },
  {
    title: 'Community Standards Matter',
    author: 'By a Guest Columnist',
    excerpt:
      'The implementation of comprehensive community standards demonstrates the company’s commitment to creating safe, secure environments for all users.',
  },
  {
    title: 'Market Outlook 2026',
    author: 'By a Financial Analyst',
    excerpt:
      'Industry experts predict continued growth in digital real estate services, with user safety and document security remaining top priorities.',
  },
]

export const businessBriefs = [
  {
    title: 'Document Processing Milestone',
    excerpt:
      'Centuries Mutual has processed over 1 million documents with a 99.8% accuracy rate, setting new industry standards for digital document management.',
  },
  {
    title: 'In-House Trust Score Expansion',
    excerpt:
      'The recommendation engine now serves over 5,000 verified users with a 95% successful matching rate for roommate compatibility.',
  },
  {
    title: 'Security Enhancement',
    excerpt:
      'Enhanced security protocols have been implemented across all platform services, ensuring maximum protection for user data and transactions.',
  },
]
