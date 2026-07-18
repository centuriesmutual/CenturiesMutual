'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from 'framer-motion'
import { Fraunces } from 'next/font/google'
import { cn } from '@/lib/utils'
import { ensurePublicSiteLoggedOut } from '@/lib/member-profile'

const fraunces = Fraunces({
  subsets: ['latin'],
  weight: ['500', '600'],
  variable: '--font-fraunces',
})

export const GRAIN_BG =
  'url("data:image/svg+xml,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27 width=%27220%27 height=%27220%27%3E%3Cfilter id=%27n%27%3E%3CfeTurbulence type=%27fractalNoise%27 baseFrequency=%270.82%27 numOctaves=%274%27 stitchTiles=%27stitch%27/%3E%3C/filter%3E%3Crect width=%27220%27 height=%27220%27 filter=%27url(%23n)%27 opacity=%270.52%27/%3E%3C/svg%3E")'

/** Primary header row height */
export const SITE_HEADER_BAR_PX = 68
/** Thin gold rule above header */
export const SITE_HEADER_TOP_RULE_PX = 1
/** Reserved for optional promo strip (unused) */
export const SITE_HEADER_DOWNLOAD_STRIP_PX = 0

/** Match scroll-body offset spacer to combined fixed chrome */
export const SITE_HEADER_STACK_PX = SITE_HEADER_TOP_RULE_PX + SITE_HEADER_BAR_PX

export function SiteHeader({
  showClientPortal = true,
  pageTitle,
}: {
  showClientPortal?: boolean
  /** Optional page label shown in the header (e.g. Careers). */
  pageTitle?: string
} = {}) {
  const { scrollY } = useScroll()
  const pathname = usePathname()
  const prevY = useRef(0)
  const [hidden, setHidden] = useState(false)

  useEffect(() => {
    // Public marketing surfaces are always logged out. Keep auth/entry pages intact.
    if (
      !pathname ||
      pathname.startsWith('/wallet') ||
      pathname === '/login' ||
      pathname.startsWith('/createaccount') ||
      pathname.startsWith('/create-account')
    ) {
      return
    }
    ensurePublicSiteLoggedOut()
  }, [pathname])

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
            'relative flex h-[68px] w-full shrink-0 items-stretch bg-[#0F3D2E] px-4 sm:px-6 lg:px-8',
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
            <div className="relative z-[1] flex min-w-0 shrink items-center gap-2 sm:gap-3">
              <Link href="/" className="flex min-w-0 shrink items-center gap-2 no-underline sm:gap-3">
                <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-md sm:h-12 sm:w-12">
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
                  className="truncate leading-none text-[#FAF7F0]"
                  style={{
                    fontFamily: 'var(--font-fraunces), Fraunces, Georgia, serif',
                    fontWeight: 500,
                    letterSpacing: '-0.02em',
                    fontSize: 'clamp(16px,4.2vw,30px)',
                  }}
                >
                  Centuries Mutual
                </span>
              </Link>
              {pageTitle ? (
                <>
                  <span
                    aria-hidden
                    className="hidden h-4 w-px shrink-0 bg-[#FAF7F0]/25 sm:block"
                  />
                  <h1
                    className="m-0 truncate font-medium leading-none tracking-[0.02em] text-[#C9A961]"
                    style={{
                      fontFamily: 'var(--font-fraunces), Fraunces, Georgia, serif',
                      fontSize: 'clamp(0.8rem, 1.8vw, 0.95rem)',
                    }}
                  >
                    {pageTitle}
                  </h1>
                </>
              ) : null}
            </div>

            <div className="relative z-[1] flex shrink-0 items-center gap-3 sm:gap-4">
              {showClientPortal ? <ClientPortalButton /> : null}
            </div>
          </div>
        </header>
      </motion.div>

      <div aria-hidden className="m-0 block shrink-0 bg-[#0F3D2E] p-0 leading-none" style={{ height: spacerHeight }} />
    </div>
  )
}

function ClientPortalButton() {
  const router = useRouter()
  const [transitioning, setTransitioning] = useState(false)

  const go = () => {
    if (transitioning) return
    setTransitioning(true)
  }

  return (
    <>
      <motion.button
        type="button"
        onClick={go}
        whileHover={{ scale: 1.03, y: -1 }}
        whileTap={{ scale: 0.97 }}
        transition={{ type: 'spring', stiffness: 420, damping: 28 }}
        className="inline-flex items-center justify-center rounded-[10px] border-0 bg-[#FAFCFB] px-3 py-2 font-sans text-[9px] font-semibold uppercase tracking-[0.12em] text-[#0F3D2E] shadow-sm sm:px-3.5 sm:text-[10px] sm:tracking-[0.14em]"
      >
        Client Portal
      </motion.button>

      <AnimatePresence>
        {transitioning ? (
          <motion.div
            className="fixed inset-0 z-[200] flex items-center justify-center bg-[#0F3D2E]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            onAnimationComplete={() => {
              router.push('/login')
            }}
          >
            <motion.div
              initial={{ opacity: 0, y: 12, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ delay: 0.08, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="text-center"
            >
              <p className="m-0 font-sans text-[11px] font-semibold uppercase tracking-[0.22em] text-[#C9A53E]">
                Client Portal
              </p>
              <p
                className="mt-2 font-medium text-[#FAF7F0]"
                style={{
                  fontFamily: 'var(--font-fraunces), Fraunces, Georgia, serif',
                  fontSize: '1.35rem',
                }}
              >
                Opening secure sign-in…
              </p>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  )
}
