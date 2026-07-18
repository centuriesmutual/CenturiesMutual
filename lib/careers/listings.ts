/** Shared career listing types + fallback seed for the public careers page. */

export const CAREER_DEPARTMENTS = [
  'Insurance & Enrollment',
  'Member Services',
  'Engineering',
  'Design',
  'Data',
  'Compliance',
  'Operations',
] as const

export type CareerDepartment = (typeof CAREER_DEPARTMENTS)[number]

export type CareerListing = {
  id: string
  title: string
  department: string
  employment_type: string
  location: string
  description: string
  sort_order: number
  published: boolean
}

export const FALLBACK_CAREER_LISTINGS: Omit<CareerListing, 'id' | 'published'>[] = [
  {
    title: 'Licensed Insurance Agent',
    department: 'Insurance & Enrollment',
    employment_type: 'Full-Time',
    location: 'Remote — US',
    description:
      'Guide members through health and life coverage decisions with clarity and care, matching each family to the plan that protects them best.',
    sort_order: 10,
  },
  {
    title: 'Enrollment Coordinator',
    department: 'Insurance & Enrollment',
    employment_type: 'Full-Time',
    location: 'Remote — US',
    description:
      'Own the enrollment journey end to end — verifying eligibility, shepherding applications, and keeping every member informed along the way.',
    sort_order: 20,
  },
  {
    title: 'Member Services Specialist',
    department: 'Member Services',
    employment_type: 'Full-Time',
    location: 'Remote — US',
    description:
      'Be the trusted voice members reach for, resolving questions about benefits, rewards, and claims with patience and precision.',
    sort_order: 30,
  },
  {
    title: 'Community Outreach Associate',
    department: 'Member Services',
    employment_type: 'Full-Time',
    location: 'Hybrid — US',
    description:
      'Build relationships with neighborhoods, clinics, and local partners to bring the membership to the families who need it most.',
    sort_order: 40,
  },
  {
    title: 'Full-Stack Engineer',
    department: 'Engineering',
    employment_type: 'Full-Time',
    location: 'Remote — US',
    description:
      'Design and ship the membership platform end to end, from secure member data services to the experiences families use every day.',
    sort_order: 50,
  },
  {
    title: 'iOS Engineer',
    department: 'Engineering',
    employment_type: 'Full-Time',
    location: 'Remote — US',
    description:
      'Craft a fast, accessible native app that puts coverage, rewards, and everyday savings in every member’s pocket.',
    sort_order: 60,
  },
  {
    title: 'Product Designer',
    department: 'Design',
    employment_type: 'Full-Time',
    location: 'Remote — US',
    description:
      'Shape calm, trustworthy interfaces for complex insurance and rewards flows, turning dense benefits into clear decisions.',
    sort_order: 70,
  },
  {
    title: 'Data/BI Analyst',
    department: 'Data',
    employment_type: 'Full-Time',
    location: 'Remote — US',
    description:
      'Turn membership, claims, and rewards data into the insights that steer product, operations, and member outcomes.',
    sort_order: 80,
  },
  {
    title: 'Compliance Analyst',
    department: 'Compliance',
    employment_type: 'Full-Time',
    location: 'Remote — US',
    description:
      'Safeguard members and the organization by keeping our practices aligned with insurance, privacy, and healthcare regulation.',
    sort_order: 90,
  },
  {
    title: 'Operations Associate',
    department: 'Operations',
    employment_type: 'Full-Time',
    location: 'Remote — US',
    description:
      'Keep the engine running — refining processes across enrollment, servicing, and rewards so the whole team can move faster.',
    sort_order: 100,
  },
]
