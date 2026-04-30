'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'
import { motion, useMotionValueEvent, useScroll } from 'framer-motion'
import { Fraunces } from 'next/font/google'
import { cn } from '@/lib/utils'

const fraunces = Fraunces({
  subsets: ['latin'],
  weight: ['500', '600'],
  variable: '--font-fraunces',
})

export const GRAIN_BG =
  'url("data:image/svg+xml,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27 width=%27220%27 height=%27220%27%3E%3Cfilter id=%27n%27%3E%3CfeTurbulence type=%27fractalNoise%27 baseFrequency=%270.82%27 numOctaves=%274%27 stitchTiles=%27stitch%27/%3E%3C/filter%3E%3Crect width=%27220%27 height=%27220%27 filter=%27url(%23n)%27 opacity=%270.52%27/%3E%3C/svg%3E")'

const NAV: { href: string; label: string }[] = [
  { href: '/neighborhood', label: 'Neighborhood' },
  { href: '/treasury', label: 'Treasury' },
  { href: '/shop', label: 'Shop' },
]

/** Primary header row height */
export const SITE_HEADER_BAR_PX = 56
/** Thin gold rule above header */
export const SITE_HEADER_TOP_RULE_PX = 1
/** Reserved for optional promo strip (unused) */
export const SITE_HEADER_DOWNLOAD_STRIP_PX = 0

/** Match scroll-body offset spacer to combined fixed chrome */
export const SITE_HEADER_STACK_PX = SITE_HEADER_TOP_RULE_PX + SITE_HEADER_BAR_PX

function NavLink({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      className="whitespace-nowrap py-2 font-sans text-xs font-medium uppercase tracking-wider text-[#FAF7F0]/90 no-underline transition-colors hover:text-[#FAF7F0]"
    >
      {label}
    </Link>
  )
}

export function SiteHeader() {
  const { scrollY } = useScroll()
  const prevY = useRef(0)
  const [hidden, setHidden] = useState(false)

  useMotionValueEvent(scrollY, 'change', (latest) => {
    const current = latest ?? 0
    if (current < 40) {
      setHidden(false)
    } else if (current > prevY.current + 4) {
      setHidden(true)
    } else if (current < prevY.current - 4) {
      setHidden(false)
    }
    prevY.current = current
  })

  useEffect(() => {
    prevY.current = typeof window !== 'undefined' ? window.scrollY : 0
  }, [])

  const spacerHeight = SITE_HEADER_STACK_PX

  return (
    <div className={`${fraunces.variable} m-0 bg-[#0F3D2E] p-0 font-sans leading-normal`}>
      <motion.div
        className="fixed left-0 right-0 top-0 z-[100]"
        animate={{ y: hidden ? -SITE_HEADER_STACK_PX : 0 }}
        transition={{ duration: 0.26, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="h-px w-full shrink-0 bg-[#C9A961]" aria-hidden />

        <header
          className={cn(
            'relative flex h-[56px] w-full shrink-0 items-stretch bg-[#0F3D2E] px-4 sm:px-6 lg:px-8',
          )}
        >
          <div
            className="pointer-events-none absolute inset-0 opacity-[0.04]"
            style={{
              backgroundImage: GRAIN_BG,
              backgroundRepeat: 'repeat',
              backgroundSize: '220px 220px',
            }}
            aria-hidden
          />

          <div className="relative mx-auto flex h-full w-full max-w-[1600px] items-center justify-between gap-6">
            <Link href="/" className="relative z-[1] flex min-w-0 shrink-0 items-center gap-2.5 no-underline sm:gap-3">
              <div className="relative h-9 w-9 shrink-0 overflow-hidden rounded-md sm:h-10 sm:w-10">
                <Image
                  src="/cmlogotreesmall-removebg-preview.png"
                  alt="Centuries Mutual"
                  width={176}
                  height={176}
                  className="h-full w-full object-contain object-center brightness-105"
                  priority
                />
              </div>
              <span
                className="leading-none text-[#FAF7F0]"
                style={{
                  fontFamily: 'var(--font-fraunces), Fraunces, Georgia, serif',
                  fontWeight: 500,
                  letterSpacing: '-0.02em',
                  fontSize: 'clamp(15px,2.2vw,26px)',
                }}
              >
                Centuries Mutual
              </span>
            </Link>

            <div className="relative z-[1] flex min-w-0 items-center gap-4 xl:gap-6">
              <nav className="hidden min-w-0 items-center gap-5 xl:flex" aria-label="Primary">
                {NAV.map((item) => (
                  <NavLink key={item.href} href={item.href} label={item.label} />
                ))}
              </nav>
              <Link
                href="/login"
                className="ml-auto inline-flex shrink-0 items-center justify-center whitespace-nowrap rounded-md bg-[#FAFCFB] px-4 py-2 font-sans text-[10px] font-semibold uppercase tracking-[0.14em] text-[#0F3D2E] no-underline shadow-sm transition hover:bg-white xl:ml-0"
              >
                Client Portal
              </Link>
            </div>
          </div>
        </header>
      </motion.div>

      <div aria-hidden className="m-0 block shrink-0 bg-[#0F3D2E] p-0 leading-none" style={{ height: spacerHeight }} />
    </div>
  )
}
