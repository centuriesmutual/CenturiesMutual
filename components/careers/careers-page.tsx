'use client'

import { useEffect, useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { SiteHeader } from '@/components/layout/site-header'
import Footer from '@/components/Footer'
import { staggerContainer, staggerItem } from '@/utils/home-animations'
import {
  CareersApplicationFlow,
  type CareerRole,
} from '@/components/careers/careers-application-form'
import {
  CAREER_DEPARTMENTS,
  FALLBACK_CAREER_LISTINGS,
  type CareerListing,
} from '@/lib/careers/listings'

type Filter = 'All' | (typeof CAREER_DEPARTMENTS)[number]

const FILTERS: Filter[] = ['All', ...CAREER_DEPARTMENTS]
const PAGE_SIZE = 3

function toRole(title: string): CareerRole {
  // Application form accepts these exact titles plus General Interest.
  const known = [
    'Licensed Insurance Agent',
    'Enrollment Coordinator',
    'Member Services Specialist',
    'Community Outreach Associate',
    'Full-Stack Engineer',
    'iOS Engineer',
    'Product Designer',
    'Data/BI Analyst',
    'Compliance Analyst',
    'Operations Associate',
  ] as const
  return (known as readonly string[]).includes(title)
    ? (title as CareerRole)
    : 'General Interest'
}

export function CareersPageView() {
  const [listings, setListings] = useState<CareerListing[]>(() =>
    FALLBACK_CAREER_LISTINGS.map((row, i) => ({
      ...row,
      id: `fallback-${i}`,
      published: true,
    })),
  )
  const [activeFilter, setActiveFilter] = useState<Filter>('All')
  const [page, setPage] = useState(0)
  const [applyOpen, setApplyOpen] = useState(false)
  const [selectedRole, setSelectedRole] = useState<CareerRole>('General Interest')

  useEffect(() => {
    let active = true
    ;(async () => {
      try {
        const res = await fetch('/api/careers/listings', { cache: 'no-store' })
        const data = await res.json().catch(() => ({}))
        if (!active || !data?.ok || !Array.isArray(data.listings)) return
        setListings(data.listings as CareerListing[])
      } catch {
        // Keep fallback seed.
      }
    })()
    return () => {
      active = false
    }
  }, [])

  const counts = useMemo(() => {
    const map: Record<string, number> = { All: listings.length }
    for (const f of CAREER_DEPARTMENTS) {
      map[f] = listings.filter((r) => r.department === f).length
    }
    return map
  }, [listings])

  const visibleListings = useMemo(
    () =>
      activeFilter === 'All'
        ? listings
        : listings.filter((role) => role.department === activeFilter),
    [activeFilter, listings],
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
      <SiteHeader showClientPortal={false} pageTitle="Careers" />
      <main className="m-0 block bg-[#FAFCFB] p-0">
        <section className="relative flex min-h-[calc(100dvh-69px)] flex-col bg-[#0F3D2E]">
          <div className="mx-auto flex w-full max-w-5xl flex-1 flex-col px-4 pb-8 pt-4 sm:px-6 sm:pb-10 sm:pt-5 lg:px-8">
            <div className="mt-auto overflow-hidden rounded-2xl border border-[#C9A53E]/35 bg-[#FAFCFB] shadow-[0_28px_70px_-28px_rgba(0,0,0,0.55),inset_0_1px_0_rgba(255,255,255,0.65)]">
              <div className="border-b border-[#E8DFD6] bg-gradient-to-b from-[#FAFCFB] to-[#F4F1EC] px-5 py-5 sm:px-7 sm:py-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                  <div>
                    <p className="mb-1 font-sans text-[11px] font-semibold uppercase tracking-[0.22em] text-[#C9A53E]">
                      Actively hiring
                    </p>
                    <p className="font-sans text-[0.9375rem] font-medium text-[#55655D]">
                      {visibleListings.length}{' '}
                      {visibleListings.length === 1 ? 'open role' : 'open roles'}
                    </p>
                  </div>

                  <div className="w-full sm:w-auto sm:min-w-[17.5rem]">
                    <label
                      htmlFor="careers-department-filter"
                      className="mb-1.5 block font-sans text-[0.6875rem] font-semibold uppercase tracking-[0.14em] text-[#55655D]"
                    >
                      Filter by department
                    </label>
                    <div className="relative">
                      <select
                        id="careers-department-filter"
                        value={activeFilter}
                        onChange={(e) => setFilter(e.target.value as Filter)}
                        className="w-full appearance-none rounded-[10px] border border-[#14432A]/15 bg-white py-2.5 pl-3.5 pr-10 font-sans text-[0.875rem] font-semibold text-[#14432A] outline-none transition focus:border-[#0F3D2E] focus:ring-2 focus:ring-[#0F3D2E]/15"
                      >
                        {FILTERS.map((filter) => {
                          const count = counts[filter] ?? 0
                          if (filter !== 'All' && count === 0) return null
                          return (
                            <option key={filter} value={filter}>
                              {filter === 'All' ? 'All departments' : `${filter} (${count})`}
                            </option>
                          )
                        })}
                      </select>
                      <span
                        aria-hidden
                        className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-[#55655D]"
                      >
                        <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                          <path
                            d="M4 6l4 4 4-4"
                            stroke="currentColor"
                            strokeWidth="1.75"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <motion.ul
                key={`${activeFilter}-${page}`}
                className="m-0 list-none space-y-0 p-0"
                variants={staggerContainer}
                initial="initial"
                animate="animate"
              >
                {paged.map((role) => (
                  <motion.li
                    key={role.id}
                    variants={staggerItem}
                    className="border-b border-[#E8DFD6] last:border-b-0"
                  >
                    <button
                      type="button"
                      onClick={() => openApply(toRole(role.title))}
                      className="group relative flex w-full flex-col gap-4 px-5 py-6 text-left transition sm:flex-row sm:items-center sm:justify-between sm:gap-10 sm:px-7 sm:py-7"
                    >
                      <div
                        aria-hidden
                        className="pointer-events-none absolute inset-0 bg-gradient-to-r from-[#0F3D2E]/[0.03] via-transparent to-transparent opacity-0 transition duration-300 group-hover:opacity-100"
                      />
                      <div className="relative z-[1] min-w-0 max-w-[42rem]">
                        <h2
                          className="mb-3 font-medium leading-[1.2] tracking-[-0.015em] text-[#0F3D2E] transition duration-300 group-hover:translate-x-0.5"
                          style={{
                            fontFamily: "'Playfair Display', Georgia, serif",
                            fontSize: 'clamp(1.3rem, 2.4vw, 1.65rem)',
                          }}
                        >
                          {role.title}
                        </h2>
                        <div className="mb-3 flex flex-wrap gap-2">
                          <span className="inline-flex rounded-md bg-[#0F3D2E]/[0.06] px-2.5 py-1 font-sans text-[0.6875rem] font-semibold uppercase tracking-[0.08em] text-[#0F3D2E]">
                            {role.department}
                          </span>
                          <span className="inline-flex rounded-md bg-[#14432A]/[0.05] px-2.5 py-1 font-sans text-[0.6875rem] font-semibold uppercase tracking-[0.08em] text-[#55655D]">
                            {role.employment_type}
                          </span>
                          <span className="inline-flex rounded-md bg-[#14432A]/[0.05] px-2.5 py-1 font-sans text-[0.6875rem] font-semibold uppercase tracking-[0.08em] text-[#55655D]">
                            {role.location}
                          </span>
                        </div>
                        <p className="m-0 font-sans text-[0.9375rem] leading-[1.65] text-[#55655D]">
                          {role.description}
                        </p>
                      </div>
                      <span className="relative z-[1] inline-flex shrink-0 items-center gap-2 self-start rounded-[10px] border border-[#0F3D2E]/20 bg-white px-4 py-2.5 font-sans text-[0.8125rem] font-semibold text-[#0F3D2E] shadow-sm transition duration-300 group-hover:border-[#0F3D2E] group-hover:bg-[#0F3D2E] group-hover:text-[#FAFCFB] group-hover:shadow-[0_10px_24px_-12px_rgba(15,61,46,0.55)] sm:self-center">
                        Apply
                        <span aria-hidden className="transition group-hover:translate-x-0.5">
                          →
                        </span>
                      </span>
                    </button>
                  </motion.li>
                ))}
              </motion.ul>

              {pageCount > 1 ? (
                <div className="flex items-center justify-between gap-3 border-t border-[#E8DFD6] bg-[#F7F3EE]/60 px-5 py-4 sm:px-7">
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

              <div className="flex flex-col gap-3 border-t border-[#E8DFD6] bg-[#F4F1EC] px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-7">
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
