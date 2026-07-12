'use client'

import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Fraunces } from 'next/font/google'
import { fadeUp } from '@/lib/animations'
import { GRAIN_BG } from '@/components/layout/site-header'

const editorial = Fraunces({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-hero-editorial',
})

function TopoPattern({ className = '' }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 420 260"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <path
        d="M0 180c42-58 118-92 198-78 80 14 142 68 168 132M12 220c48-102 160-168 280-152M40 60c22 38 68 58 120 52 52-6 96-34 118-72"
        stroke="currentColor"
        strokeWidth="0.6"
        strokeLinecap="round"
        opacity="0.35"
      />
      <path
        d="M80 240c28-22 62-34 100-30 38 4 72 22 98 48M120 20c18 22 48 36 82 34 34-2 64-20 78-44"
        stroke="currentColor"
        strokeWidth="0.45"
        strokeLinecap="round"
        opacity="0.25"
      />
    </svg>
  )
}

const portalShadow = 'shadow-[0_8px_32px_-8px_rgba(0,0,0,0.25)]'

export function CommunityHero() {
  return (
    <section className={`relative mt-0 w-full overflow-hidden bg-[#0F3D2E] pb-8 pt-0 lg:pb-12 ${editorial.variable}`}>
      <div className="relative z-[1] grid min-h-[94vh] w-full grid-cols-1 gap-0 lg:min-h-[98vh] lg:grid-cols-12 lg:gap-0">
        <div className="relative col-span-full min-h-[min(52vh,520px)] overflow-hidden lg:col-span-7 lg:col-start-1 lg:min-h-[88vh]">
          <div className="absolute inset-0">
            <Image
              src="/buffalo2.png"
              alt="Centuries Mutual — American bison on the Texas plains"
              fill
              priority
              quality={95}
              sizes="(max-width: 1023px) 100vw, 62vw"
              className="h-full w-full object-cover object-[center_58%]"
            />
          </div>
          <div
            className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,transparent_0%,transparent_45%,rgba(232,223,214,0.42)_74%,rgba(232,223,214,0.92)_93%,rgb(232_223_214)_100%)] lg:bg-[linear-gradient(90deg,transparent_0%,transparent_50%,rgba(232,223,214,0.34)_62%,rgba(232,223,214,0.74)_82%,rgb(232_223_214)_100%)]"
            aria-hidden
          />
        </div>

        <div className="relative col-span-full flex min-h-0 flex-col bg-[#E8DFD6] lg:col-span-5 lg:col-start-8 lg:min-h-[88vh]">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_100%_0%,rgba(201,169,97,0.18)_0%,transparent_50%)]"
          />
          <div
            className="pointer-events-none absolute inset-0 opacity-[0.035]"
            style={{
              backgroundImage: GRAIN_BG,
              backgroundRepeat: 'repeat',
              backgroundSize: '220px 220px',
            }}
            aria-hidden
          />
          <TopoPattern className="pointer-events-none absolute bottom-0 left-0 z-[2] h-48 w-[min(100%,340px)] text-[#0F3D2E] opacity-[0.07]" />

          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="show"
            className="relative z-[1] flex flex-1 flex-col justify-center px-8 py-8 lg:px-12 lg:py-12"
          >
            <p className="mb-4 font-sans text-[10px] font-medium uppercase tracking-[0.25em] text-[#C9A961]">
              — Est. 2024 · USA
            </p>

            <div
              className={`relative overflow-hidden rounded-2xl border border-[#E5E0D5] bg-[#F7F3EE] ${portalShadow}`}
            >
              <div className="relative z-[1] px-6 py-7 sm:px-8 sm:py-8">
                <p className="mb-2 font-sans text-[10px] font-semibold uppercase tracking-[0.22em] text-[#C9A961]">
                  Centuries Mutual
                </p>
                <h1
                  className="mb-3 max-w-md font-medium tracking-tight text-[#0F3D2E]"
                  style={{
                    fontFamily: 'var(--font-hero-editorial), Fraunces, Georgia, serif',
                    fontSize: 'clamp(1.75rem, 3.2vw, 2.35rem)',
                    lineHeight: 1.18,
                  }}
                >
                  Your Community Brokerage
                </h1>
                <h2
                  className="mb-3 font-medium tracking-tight text-[#0F3D2E]"
                  style={{
                    fontFamily: 'var(--font-hero-editorial), Fraunces, Georgia, serif',
                    fontSize: 'clamp(1.1rem, 2vw, 1.35rem)',
                    lineHeight: 1.3,
                  }}
                >
                  Coverage that works for you
                </h2>
                <p className="mb-5 max-w-md font-sans text-[0.9375rem] leading-[1.6] text-[#3d4a41]">
                  Download the Centuries Mutual app for exclusive health insurance —
                  plans, member rewards, and care access in one place.
                </p>
                <div className="flex flex-nowrap items-center gap-2">
                  <Link
                    href="/downloads"
                    className="inline-flex shrink-0 items-center justify-center rounded-lg bg-[#0F3D2E] px-3 py-1.5 font-sans text-[0.75rem] font-semibold tracking-[0.01em] text-[#FAFCFB] shadow-[0_6px_18px_-8px_rgba(15,61,46,0.5)] transition hover:bg-[#0A2E22] no-underline"
                  >
                    Download App
                  </Link>
                  <Link
                    href="/individual-family-services"
                    className="inline-flex shrink-0 items-center justify-center rounded-lg border border-[#0F3D2E] bg-transparent px-3 py-1.5 font-sans text-[0.75rem] font-semibold tracking-[0.01em] text-[#0F3D2E] transition hover:bg-[#0F3D2E]/[0.06] no-underline"
                  >
                    Learn More
                  </Link>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
