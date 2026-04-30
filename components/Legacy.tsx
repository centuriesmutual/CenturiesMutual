'use client'

import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import {
  LockClosedIcon,
  DocumentCheckIcon,
  DocumentTextIcon,
  ClockIcon,
} from '@heroicons/react/24/outline'
import {
  sectionAnimation,
  staggerContainer,
  staggerItem,
  slideInLeft,
  slideInRight,
} from '../utils/home-animations'
import { EDocumentSystemModal } from './illustrations/home-product-modals'
import './illustrations/neighborhood-motion.css'

type Feature = {
  Icon: typeof DocumentTextIcon
  title: string
  blurb: string
}

const DOC_FEATURES: ReadonlyArray<Feature> = [
  {
    Icon: DocumentTextIcon,
    title: 'Digital Leases',
    blurb: 'Electronic lease agreements with versioned audit history.',
  },
  {
    Icon: DocumentCheckIcon,
    title: 'Roommate Contracts',
    blurb: 'Secure roommate agreements signed by every party.',
  },
  {
    Icon: ClockIcon,
    title: 'Property Documents',
    blurb: 'Complete property files, organized and searchable.',
  },
  {
    Icon: LockClosedIcon,
    title: 'Instant Access',
    blurb: '24/7 access for everyone authorized — and only them.',
  },
]

/**
 * EstRibbon — corporate ribbon with angular cut "flag" notch at the bottom
 * and a small folded-over end on the right. Pure CSS via clip-path so it
 * scales cleanly. No raster.
 */
function EstRibbon() {
  return (
    <div className="absolute bottom-5 right-5 z-[2] select-none">
      <div className="relative inline-flex flex-col items-center">
        {/* Folded shadow tail behind the ribbon */}
        <span
          aria-hidden
          className="absolute -bottom-1.5 right-1 h-3 w-3 rotate-45 rounded-[2px] bg-[#003F80]"
        />

        {/* Main ribbon body — angular cut at bottom */}
        <div
          className="relative flex flex-col items-center px-7 pb-6 pt-3.5 text-white shadow-[0_18px_36px_-12px_rgba(0,102,204,0.65),0_4px_10px_rgba(0,0,0,0.18)]"
          style={{
            background: 'linear-gradient(180deg, #1378E0 0%, #0066CC 60%, #004FA6 100%)',
            clipPath:
              'polygon(0% 0%, 100% 0%, 100% 78%, 50% 100%, 0% 78%)',
          }}
        >
          {/* Subtle gold inner rule */}
          <span
            aria-hidden
            className="absolute inset-x-2 top-2 h-px"
            style={{ background: 'rgba(201,165,62,0.55)' }}
          />
          <span
            aria-hidden
            className="absolute inset-x-2 bottom-[28%] h-px"
            style={{ background: 'rgba(201,165,62,0.35)' }}
          />

          <span
            className="font-sans text-[10px] font-semibold uppercase tracking-[0.32em]"
            style={{ color: '#FFD58A' }}
          >
            Est.
          </span>
          <span
            className="font-serif leading-none"
            style={{
              fontFamily: "'Playfair Display', Georgia, serif",
              fontSize: '2rem',
              fontWeight: 700,
              letterSpacing: '0.02em',
              color: '#FFFFFF',
            }}
          >
            2024
          </span>
          <span
            className="mt-1 font-sans text-[8.5px] font-semibold uppercase tracking-[0.36em]"
            style={{ color: 'rgba(255,255,255,0.78)' }}
          >
            Centuries Mutual
          </span>
        </div>
      </div>
    </div>
  )
}

export default function Legacy() {
  return (
    <>
      {/* eDocument System */}
      <section className="relative overflow-hidden border-t border-[#E8EBEA] bg-[#F4F1EC] py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div className="mx-auto max-w-3xl text-center" {...sectionAnimation}>
            <p className="mb-3 font-sans text-[11px] font-semibold uppercase tracking-[0.22em] text-[#C9A53E]">
              — Documents
            </p>
            <h2
              className="mb-3 font-medium leading-[1.15] tracking-[-0.01em] text-[#14432A]"
              style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: 'clamp(2rem, 4.2vw, 3rem)',
              }}
            >
              eDocument System
            </h2>
            <p className="mx-auto max-w-[640px] font-sans text-[1.0625rem] leading-[1.6] text-[#55655D]">
              Find and rent real estate with roommates through a comprehensive
              eDocument system. Lease agreements, roommate contracts, and
              property files — all in one place.
            </p>
          </motion.div>

          <div className="mt-12 grid grid-cols-1 items-center gap-10 lg:grid-cols-2">
            <motion.div {...slideInLeft}>
              <EDocumentSystemModal />
            </motion.div>

            <motion.div {...slideInRight}>
              <motion.div
                className="grid grid-cols-1 gap-3 sm:grid-cols-2"
                variants={staggerContainer}
                initial="initial"
                whileInView="animate"
                viewport={{ once: true, margin: '-50px' }}
              >
                {DOC_FEATURES.map(({ Icon, title, blurb }) => (
                  <motion.div
                    key={title}
                    variants={staggerItem}
                    className="rounded-[14px] border border-[#E8EBEA] bg-white px-5 py-[1.1rem]"
                  >
                    <div className="flex items-start gap-3">
                      <div className="rounded-[10px] bg-[#14432A]/[0.06] p-2.5">
                        <Icon className="h-5 w-5 text-[#14432A]" />
                      </div>
                      <div>
                        <h3 className="mb-1 font-sans text-[0.95rem] font-semibold leading-tight tracking-[-0.005em] text-[#14432A]">
                          {title}
                        </h3>
                        <p className="font-sans text-[0.8125rem] leading-[1.5] text-[#55655D]">
                          {blurb}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>

              <motion.div
                className="mt-6 flex flex-wrap items-center gap-3"
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <Link
                  href="/edocument-system"
                  className="inline-flex items-center justify-center rounded-[10px] bg-[#14432A] px-4 py-2 font-sans text-[0.875rem] font-semibold tracking-[0.01em] text-[#FAFCFB] shadow-[0_8px_24px_-10px_rgba(20,67,42,0.45)] transition hover:bg-[#0F3321] no-underline"
                >
                  Access Documents
                </Link>
                <Link
                  href="/edocuments-audit-tracking"
                  className="inline-flex items-center justify-center rounded-[10px] border border-[#14432A] bg-transparent px-4 py-2 font-sans text-[0.875rem] font-semibold tracking-[0.01em] text-[#14432A] transition hover:bg-[#14432A]/[0.06] no-underline"
                >
                  Learn More
                </Link>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* A Legacy of Trust — Est. 2024 */}
      <section
        id="legacy-of-trust"
        aria-label="A Legacy of Trust — Established 2024"
        className="relative overflow-hidden border-t border-[#E8EBEA] bg-[#FAFCFB] py-20"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-2">
            <motion.div
              initial={{ opacity: 0, x: -32 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-100px' }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
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

              {/* tiny anchor caption beneath the photo so it's impossible to miss */}
              <p className="mt-3 text-center font-sans text-[10.5px] font-semibold uppercase tracking-[0.22em] text-[#C9A53E]">
                Est. 2024 · Centuries Mutual
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 32 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-100px' }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            >
              <p className="mb-3 font-sans text-[11px] font-semibold uppercase tracking-[0.22em] text-[#C9A53E]">
                — Our Story · Est. 2024
              </p>
              <h2
                className="mb-4 font-medium leading-[1.15] tracking-[-0.01em] text-[#14432A]"
                style={{
                  fontFamily: "'Playfair Display', serif",
                  fontSize: 'clamp(2rem, 4.4vw, 3rem)',
                }}
              >
                A Legacy of Trust
              </h2>
              <p className="mb-3 font-sans text-[1.0625rem] leading-[1.7] text-[#55655D]">
                Centuries Mutual is built on a foundation of trust, expertise,
                and unwavering commitment to our clients&apos; financial
                success — through secure, reliable systems and proven
                credibility.
              </p>
              <p className="mb-0 font-sans text-[1.0625rem] leading-[1.7] text-[#55655D]">
                Our security infrastructure ensures every family receives the
                highest level of protection. State-of-the-art encryption,
                secure data handling, and transparent practices guide families
                toward financial security with confidence.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* About Centuries Mutual */}
      <section className="relative overflow-hidden bg-[#14432A] py-16 text-[#FAFCFB]">
        {/* gold rule */}
        <div
          aria-hidden
          className="absolute inset-x-0 top-0 h-px"
          style={{
            background:
              'linear-gradient(90deg, transparent 0%, rgba(201,165,62,0.45) 35%, rgba(201,165,62,0.45) 65%, transparent 100%)',
          }}
        />
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-12">
            <motion.div
              className="lg:col-span-8"
              initial={{ opacity: 0, x: -32 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-100px' }}
              transition={{ duration: 0.7 }}
            >
              <p className="mb-3 font-sans text-[11px] font-semibold uppercase tracking-[0.22em] text-[#C9A53E]">
                — About
              </p>
              <h2
                className="mb-3 font-medium leading-[1.2] tracking-[-0.005em] text-[#FAFCFB]"
                style={{
                  fontFamily: "'Playfair Display', serif",
                  fontSize: 'clamp(1.75rem, 3.6vw, 2.5rem)',
                }}
              >
                About Centuries Mutual
              </h2>
              <p className="max-w-[640px] font-sans text-[1.0625rem] leading-[1.7] text-[#FAFCFB]/85">
                A trusted financial services company dedicated to
                comprehensive solutions and lasting relationships with our
                members.
              </p>
            </motion.div>

            <motion.div
              className="lg:col-span-4 lg:text-right"
              initial={{ opacity: 0, x: 32 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-100px' }}
              transition={{ duration: 0.7 }}
            >
              <Link
                href="/about"
                className="inline-flex items-center justify-center rounded-[10px] border border-white/[0.18] bg-[#FAFCFB] px-4 py-2 font-sans text-[0.875rem] font-semibold tracking-[0.01em] text-[#14432A] shadow-[0_12px_28px_-12px_rgba(0,0,0,0.4)] transition hover:bg-white no-underline"
              >
                Learn More About Us
              </Link>
            </motion.div>
          </div>
        </div>
      </section>
    </>
  )
}
