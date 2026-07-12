'use client'

import Image from 'next/image'
import dynamic from 'next/dynamic'
import { motion } from 'framer-motion'
import {
  sectionAnimation,
  slideInLeft,
  slideInRight,
} from '../utils/home-animations'
import { UnifiedBenefitCard } from './ui/figma-feature-cards'
import './illustrations/neighborhood-motion.css'

type Partner = {
  name: string
  category: string
  blurb: string
  logo: string
  href?: string
}

const PARTNERS: ReadonlyArray<Partner> = [
  {
    name: 'Intuit',
    category: 'Business Data',
    blurb: 'Business data that keeps member accounts and ledgers in sync.',
    logo: '/partners/intuit.svg',
  },
  {
    name: 'HealthEquity',
    category: 'Health Money Wallet',
    blurb: 'Health money wallet for HSAs and member balances that earn.',
    logo: '/partners/healthequity.svg',
  },
  {
    name: 'WEX',
    category: 'Payment Rails',
    blurb: 'Payment rails behind wallets, rent, bills, and benefits spend.',
    logo: '/partners/wex.svg',
  },
  {
    name: 'CVS',
    category: 'Healthcare Access',
    blurb: 'Pharmacy and clinic access for members at the counter.',
    logo: '/partners/cvs.svg',
  },
  {
    name: 'Walgreens',
    category: 'Healthcare Access',
    blurb: 'Retail pharmacy access woven into the membership network.',
    logo: '/partners/walgreens.svg',
  },
  {
    name: 'Amazon',
    category: 'Distribution & Logistics',
    blurb: 'Consumer distribution and logistics for member delivery.',
    logo: '/partners/amazon.svg',
  },
]

const NySkyline3D = dynamic(
  () => import('./illustrations/ny-skyline-3d').then((m) => m.NySkyline3D),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-[300px] w-full items-center justify-center rounded-[20px] border border-[#1E3A2B] bg-[#0B1D13] font-sans text-sm text-[#8FB39E]">
        Loading…
      </div>
    ),
  },
)

/**
 * EstRibbon — simple blue badge for Est. 2024.
 */
function EstRibbon() {
  return (
    <div className="absolute bottom-5 right-5 z-[2] select-none">
      <div
        className="flex flex-col items-center rounded-md px-6 py-3.5 text-white shadow-[0_10px_24px_-10px_rgba(0,70,160,0.45)]"
        style={{ background: '#0066CC' }}
      >
        <span className="font-sans text-[10px] font-semibold uppercase tracking-[0.32em] text-white/90">
          Est.
        </span>
        <span
          className="font-serif leading-none"
          style={{
            fontFamily: "'Playfair Display', Georgia, serif",
            fontSize: '1.75rem',
            fontWeight: 700,
            letterSpacing: '0.02em',
            color: '#FFFFFF',
          }}
        >
          2024
        </span>
        <span className="mt-1 font-sans text-[8.5px] font-semibold uppercase tracking-[0.28em] text-white/80">
          Centuries Mutual
        </span>
      </div>
    </div>
  )
}

export default function HealthInsuranceLegacy() {
  return (
    <>
      {/* Health insurance earnings — member compounding */}
      <section className="relative overflow-hidden border-t border-[#E8EBEA] bg-[#F4F1EC] py-12 sm:py-16 lg:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div className="mx-auto max-w-3xl text-center" {...sectionAnimation}>
            <p className="mb-3 font-sans text-[11px] font-semibold uppercase tracking-[0.22em] text-[#C9A53E]">
              — Compound Interest
            </p>
            <h2
              className="mb-3 font-medium leading-[1.15] tracking-[-0.01em] text-[#14432A]"
              style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: 'clamp(1.75rem, 4.2vw, 3rem)',
              }}
            >
              Centuries Mutual: Exclusive
            </h2>
          </motion.div>

          <div className="mt-8 grid grid-cols-1 items-center gap-8 sm:mt-10 lg:mt-12 lg:grid-cols-2 lg:gap-10">
            <motion.div {...slideInLeft}>
              <NySkyline3D />
            </motion.div>

            <motion.div {...slideInRight}>
              <UnifiedBenefitCard
                eyebrow="Membership"
                title="Compounding that stays inside Centuries Mutual"
                body={
                  <p className="m-0">
                    Centuries Mutual&apos;s compounding program is a member benefit
                    defined in your applicable program terms and plan documents —
                    not a third-party investment product and not an offer of
                    securities. Eligible supplemental credits may be applied to
                    member balances under disclosed rates, schedules, and
                    eligibility rules; principal, rate, and projected value appear
                    on a dated member surface tied to your verified identity.
                    Outcomes vary by participation and governing documents, and
                    nothing on this site guarantees any return.
                  </p>
                }
                points={[
                  'Compounding defined by member program terms and plan documents',
                  'Eligible credits applied under disclosed rates and schedules',
                  'Rate, principal, and projected value on one dated surface',
                  'Not an offer of securities; outcomes are not guaranteed',
                ]}
              />
            </motion.div>
          </div>

          {/* Partners */}
          <motion.div
            className="mx-auto mt-12 max-w-3xl text-center sm:mt-16 lg:mt-20"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 1.15, ease: [0.22, 1, 0.36, 1] }}
          >
            <p className="mb-3 font-sans text-[11px] font-semibold uppercase tracking-[0.22em] text-[#C9A53E]">
              — Partners
            </p>
            <h3
              className="mb-0 font-medium leading-[1.2] tracking-[-0.01em] text-[#14432A]"
              style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: 'clamp(1.6rem, 3.2vw, 2.25rem)',
              }}
            >
              The Company We Keep
            </h3>
          </motion.div>

          <motion.div
            className="mt-10 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 1.05, ease: [0.22, 1, 0.36, 1] }}
          >
            {PARTNERS.map(({ name, category, blurb, logo, href }) => {
              const inner = (
                <>
                  <div className="mb-3 flex items-center gap-3">
                    <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-[12px] bg-white shadow-[0_1px_2px_rgba(15,61,46,0.08)] ring-1 ring-[#14432A]/10">
                      <Image
                        src={logo}
                        alt={`${name} logo`}
                        width={44}
                        height={44}
                        className="h-full w-full object-cover"
                        unoptimized
                      />
                    </div>
                    <div className="min-w-0">
                      <h4 className="truncate font-sans text-[0.95rem] font-semibold leading-tight tracking-[-0.005em] text-[#14432A]">
                        {name}
                      </h4>
                      <p className="m-0 font-sans text-[10.5px] font-semibold uppercase tracking-[0.16em] text-[#C9A53E]">
                        {category}
                      </p>
                    </div>
                  </div>
                  <p className="m-0 font-sans text-[0.8125rem] leading-[1.55] text-[#55655D]">
                    {blurb}
                  </p>
                </>
              )
              return href ? (
                <a
                  key={name}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block rounded-2xl bg-[#14432A]/[0.06] p-5 no-underline transition hover:bg-[#14432A]/[0.1]"
                >
                  {inner}
                </a>
              ) : (
                <div key={name} className="rounded-2xl bg-[#14432A]/[0.06] p-5">
                  {inner}
                </div>
              )
            })}
          </motion.div>
        </div>
      </section>

      {/* A Legacy of Trust — Est. 2024 */}
      <section
        id="legacy-of-trust"
        aria-label="A Legacy of Trust — Established 2024"
        className="relative overflow-hidden border-t border-[#E8EBEA] bg-[#FAFCFB] py-12 sm:py-16 lg:py-20"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-2">
            <motion.div
              initial={{ opacity: 0, x: -32 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-100px' }}
              transition={{ duration: 1.15, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="relative w-full overflow-hidden rounded-[20px] border border-[#E8EBEA] bg-[#F4F1EC] shadow-[0_16px_40px_-20px_rgba(15,61,46,0.16)] aspect-[4/3]">
                <Image
                  src="/deer.jpeg"
                  alt="Buck on the Texas plains — A Legacy of Trust"
                  fill
                  sizes="(max-width: 991px) 100vw, 42vw"
                  className="object-cover"
                  priority={false}
                />

                {/* atmospheric tint to anchor the ribbon */}
                <div
                  aria-hidden
                  className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#14432A]/[0.22]"
                />

                <EstRibbon />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 32 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-100px' }}
              transition={{ duration: 1.15, ease: [0.22, 1, 0.36, 1] }}
            >
              <p className="mb-3 font-sans text-[11px] font-semibold uppercase tracking-[0.22em] text-[#C9A53E]">
                — Our Story
              </p>
              <h2
                className="mb-4 font-medium leading-[1.15] tracking-[-0.01em] text-[#14432A]"
                style={{
                  fontFamily: "'Playfair Display', serif",
                  fontSize: 'clamp(1.75rem, 4.4vw, 3rem)',
                }}
              >
                A Legacy of Trust
              </h2>
              <p className="mb-3 font-sans text-[1.0625rem] leading-[1.7] text-[#55655D]">
                Centuries Mutual sells health insurance exclusively — built on
                trust, expertise, and an unwavering commitment to members&apos;
                coverage and long-term security.
              </p>
              <p className="mb-0 font-sans text-[1.0625rem] leading-[1.7] text-[#55655D]">
                Our systems protect every family&apos;s health insurance
                relationship with encryption, secure data handling, and
                transparent practices that keep coverage clear and credible.
              </p>
            </motion.div>
          </div>
        </div>
      </section>
    </>
  )
}
