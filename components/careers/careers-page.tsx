'use client'

import { useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { SiteHeader } from '@/components/layout/site-header'
import Footer from '@/components/Footer'
import { sectionAnimation, staggerContainer, staggerItem } from '@/utils/home-animations'
import {
  CareersApplicationFlow,
  type CareerRole,
} from '@/components/careers/careers-application-form'

type Department =
  | 'Insurance & Enrollment'
  | 'Member Services'
  | 'Engineering'
  | 'Design'
  | 'Data'
  | 'Compliance'
  | 'Operations'

type Listing = {
  title: Exclude<CareerRole, 'General Interest'>
  department: Department
  type: string
  location: string
  description: string
}

const LISTINGS: ReadonlyArray<Listing> = [
  {
    title: 'Licensed Insurance Agent',
    department: 'Insurance & Enrollment',
    type: 'Full-Time',
    location: 'Remote — US',
    description:
      'Guide members through health and life coverage decisions with clarity and care, matching each family to the plan that protects them best.',
  },
  {
    title: 'Enrollment Coordinator',
    department: 'Insurance & Enrollment',
    type: 'Full-Time',
    location: 'Remote — US',
    description:
      'Own the enrollment journey end to end — verifying eligibility, shepherding applications, and keeping every member informed along the way.',
  },
  {
    title: 'Member Services Specialist',
    department: 'Member Services',
    type: 'Full-Time',
    location: 'Remote — US',
    description:
      'Be the trusted voice members reach for, resolving questions about benefits, rewards, and claims with patience and precision.',
  },
  {
    title: 'Community Outreach Associate',
    department: 'Member Services',
    type: 'Full-Time',
    location: 'Hybrid — US',
    description:
      'Build relationships with neighborhoods, clinics, and local partners to bring the membership to the families who need it most.',
  },
  {
    title: 'Full-Stack Engineer',
    department: 'Engineering',
    type: 'Full-Time',
    location: 'Remote — US',
    description:
      'Design and ship the membership platform end to end, from secure member data services to the experiences families use every day.',
  },
  {
    title: 'iOS Engineer',
    department: 'Engineering',
    type: 'Full-Time',
    location: 'Remote — US',
    description:
      'Craft a fast, accessible native app that puts coverage, rewards, and everyday savings in every member’s pocket.',
  },
  {
    title: 'Product Designer',
    department: 'Design',
    type: 'Full-Time',
    location: 'Remote — US',
    description:
      'Shape calm, trustworthy interfaces for complex insurance and rewards flows, turning dense benefits into clear decisions.',
  },
  {
    title: 'Data/BI Analyst',
    department: 'Data',
    type: 'Full-Time',
    location: 'Remote — US',
    description:
      'Turn membership, claims, and rewards data into the insights that steer product, operations, and member outcomes.',
  },
  {
    title: 'Compliance Analyst',
    department: 'Compliance',
    type: 'Full-Time',
    location: 'Remote — US',
    description:
      'Safeguard members and the organization by keeping our practices aligned with insurance, privacy, and healthcare regulation.',
  },
  {
    title: 'Operations Associate',
    department: 'Operations',
    type: 'Full-Time',
    location: 'Remote — US',
    description:
      'Keep the engine running — refining processes across enrollment, servicing, and rewards so the whole team can move faster.',
  },
]

const FILTERS = [
  'All',
  'Insurance & Enrollment',
  'Member Services',
  'Engineering',
  'Design',
  'Data',
  'Compliance',
  'Operations',
] as const

type Filter = (typeof FILTERS)[number]

const PAGE_SIZE = 3

export function CareersPageView() {
  const [activeFilter, setActiveFilter] = useState<Filter>('All')
  const [page, setPage] = useState(0)
  const [applyOpen, setApplyOpen] = useState(false)
  const [selectedRole, setSelectedRole] = useState<CareerRole>('General Interest')

  const counts = useMemo(() => {
    const map: Record<string, number> = { All: LISTINGS.length }
    for (const f of FILTERS) {
      if (f === 'All') continue
      map[f] = LISTINGS.filter((r) => r.department === f).length
    }
    return map
  }, [])

  const visibleListings = useMemo(
    () =>
      activeFilter === 'All'
        ? LISTINGS
        : LISTINGS.filter((role) => role.department === activeFilter),
    [activeFilter],
  )

  const pageCount = Math.max(1, Math.ceil(visibleListings.length / PAGE_SIZE))
  const paged = visibleListings.slice(page * PAGE_SIZE, page * PAGE_SIZE + PAGE_SIZE)

  const openApply = (role: CareerRole) => {
    setSelectedRole(role)
    setApplyOpen(true)
  }

  const setFilter = (filter: Filter) => {
    setActiveFilter(filter)
    setPage(0)
  }

  return (
    <>
      <SiteHeader />
      <main className="m-0 block bg-[#FAFCFB] p-0">
        {/* Full-viewport solid hero + roles (HBM-style, no gradient) */}
        <section className="relative flex min-h-[calc(100dvh-69px)] flex-col bg-[#0F3D2E]">
          <div className="mx-auto flex w-full max-w-5xl flex-1 flex-col px-4 pb-10 pt-14 sm:px-6 sm:pt-16 lg:px-8 lg:pt-20">
            <motion.div className="mb-10 max-w-3xl" {...sectionAnimation}>
              <h1
                className="mb-3 font-medium leading-[1.08] tracking-[-0.02em] text-[#FAFCFB]"
                style={{
                  fontFamily: "'Playfair Display', Georgia, serif",
                  fontSize: 'clamp(2.75rem, 7vw, 4.5rem)',
                }}
              >
                Careers
              </h1>
              <p className="max-w-[36rem] font-sans text-[1.05rem] leading-[1.65] text-[#FAFCFB]/82">
                Actively hiring people who want their work to compound — health coverage,
                rewards, and community infrastructure built for lasting value.
              </p>
            </motion.div>

            <div className="mt-auto rounded-2xl border border-white/10 bg-[#FAFCFB] p-5 shadow-[0_24px_60px_-28px_rgba(0,0,0,0.55)] sm:p-7">
              <div className="flex flex-wrap items-end justify-between gap-3">
                <div>
                  <p className="mb-1.5 flex items-center gap-2 font-sans text-[11px] font-semibold uppercase tracking-[0.22em] text-[#C9A53E]">
                    <span className="inline-block h-2 w-2 rounded-full bg-[#C9A53E]" aria-hidden />
                    Actively hiring
                  </p>
                  <p className="font-sans text-[0.9375rem] font-medium text-[#55655D]">
                    {visibleListings.length}{' '}
                    {visibleListings.length === 1 ? 'role' : 'roles'}
                  </p>
                </div>
              </div>

              {/* Filters with counts */}
              <div className="mt-5 -mx-1 overflow-x-auto px-1 pb-1">
                <div className="flex min-w-max items-center gap-2">
                  {FILTERS.map((filter) => {
                    const active = filter === activeFilter
                    const count = counts[filter] ?? 0
                    if (filter !== 'All' && count === 0) return null
                    return (
                      <button
                        key={filter}
                        type="button"
                        onClick={() => setFilter(filter)}
                        aria-pressed={active}
                        className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border px-3.5 py-2 font-sans text-[0.8125rem] font-semibold transition ${
                          active
                            ? 'border-[#0F3D2E] bg-[#0F3D2E] text-[#FAFCFB]'
                            : 'border-[#14432A]/15 bg-white text-[#14432A] hover:border-[#0F3D2E]/40'
                        }`}
                      >
                        {filter}
                        {filter !== 'All' ? (
                          <span className={active ? 'text-[#C9A53E]' : 'text-[#55655D]'}>
                            {count}
                          </span>
                        ) : null}
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Role list */}
              <motion.ul
                key={`${activeFilter}-${page}`}
                className="mt-4 divide-y divide-[#E8DFD6] border-y border-[#E8DFD6]"
                variants={staggerContainer}
                initial="initial"
                animate="animate"
              >
                {paged.map((role) => (
                  <motion.li key={role.title} variants={staggerItem}>
                    <button
                      type="button"
                      onClick={() => openApply(role.title)}
                      className="group flex w-full flex-col gap-3 py-5 text-left transition sm:flex-row sm:items-start sm:justify-between sm:gap-8"
                    >
                      <div className="max-w-[640px]">
                        <h2
                          className="mb-1.5 font-medium leading-[1.25] tracking-[-0.01em] text-[#14432A] transition group-hover:text-[#0F3D2E]"
                          style={{
                            fontFamily: "'Playfair Display', Georgia, serif",
                            fontSize: 'clamp(1.2rem, 2.2vw, 1.5rem)',
                          }}
                        >
                          {role.title}
                        </h2>
                        <p className="mb-2 font-sans text-[0.75rem] font-semibold uppercase tracking-[0.1em] text-[#55655D]">
                          {role.department}
                          <span className="mx-1.5 text-[#C9A53E]">·</span>
                          {role.type}
                          <span className="mx-1.5 text-[#C9A53E]">·</span>
                          {role.location}
                        </p>
                        <p className="font-sans text-[0.9rem] leading-[1.6] text-[#55655D]">
                          {role.description}
                        </p>
                      </div>
                      <span className="inline-flex shrink-0 items-center self-start rounded-full border border-[#0F3D2E]/25 px-4 py-2 font-sans text-[0.8125rem] font-semibold text-[#0F3D2E] transition group-hover:border-[#0F3D2E] group-hover:bg-[#0F3D2E] group-hover:text-[#FAFCFB]">
                        Apply →
                      </span>
                    </button>
                  </motion.li>
                ))}
              </motion.ul>

              {/* Pagination */}
              {pageCount > 1 ? (
                <div className="mt-5 flex items-center justify-between gap-3">
                  <button
                    type="button"
                    disabled={page === 0}
                    onClick={() => setPage((p) => Math.max(0, p - 1))}
                    className="font-sans text-[0.8125rem] font-semibold text-[#14432A] disabled:opacity-35"
                  >
                    Prev
                  </button>
                  <div className="flex items-center gap-1.5">
                    {Array.from({ length: pageCount }).map((_, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => setPage(i)}
                        className={`flex h-8 w-8 items-center justify-center rounded-full font-sans text-[0.8125rem] font-semibold transition ${
                          i === page
                            ? 'bg-[#0F3D2E] text-white'
                            : 'text-[#14432A] hover:bg-[#0F3D2E]/[0.08]'
                        }`}
                      >
                        {i + 1}
                      </button>
                    ))}
                  </div>
                  <button
                    type="button"
                    disabled={page >= pageCount - 1}
                    onClick={() => setPage((p) => Math.min(pageCount - 1, p + 1))}
                    className="font-sans text-[0.8125rem] font-semibold text-[#14432A] disabled:opacity-35"
                  >
                    Next
                  </button>
                </div>
              ) : null}

              <div className="mt-6 flex flex-col gap-3 border-t border-[#E8DFD6] pt-5 sm:flex-row sm:items-center sm:justify-between">
                <p className="m-0 max-w-xl font-sans text-[0.875rem] leading-[1.55] text-[#55655D]">
                  No role that fits? Send a general introduction — we hire for judgment, not
                  job-description alignment.
                </p>
                <button
                  type="button"
                  onClick={() => openApply('General Interest')}
                  className="inline-flex shrink-0 items-center justify-center rounded-[10px] border border-[#0F3D2E] px-4 py-2.5 font-sans text-[0.875rem] font-semibold text-[#0F3D2E] transition hover:bg-[#0F3D2E] hover:text-[#FAFCFB]"
                >
                  Send an introduction
                </button>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer variant="legal" />

      <AnimatePresence>
        {applyOpen ? (
          <CareersApplicationFlow
            initialPosition={selectedRole}
            onClose={() => setApplyOpen(false)}
          />
        ) : null}
      </AnimatePresence>
    </>
  )
}
