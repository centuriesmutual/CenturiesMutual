'use client'

import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Fraunces } from 'next/font/google'
import { cardFloat, fadeUp, stagger } from '@/lib/animations'
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

export function CommunityHero() {
  return (
    <section className={`relative mt-0 w-full overflow-hidden bg-[#0F3D2E] pb-6 pt-0 sm:pb-8 lg:pb-12 ${editorial.variable}`}>
      <div className="relative z-[1] grid min-h-0 w-full grid-cols-1 gap-0 lg:min-h-[98vh] lg:grid-cols-12 lg:gap-0">
        <div className="relative col-span-full min-h-[min(42vh,380px)] overflow-hidden sm:min-h-[min(48vh,460px)] lg:col-span-7 lg:col-start-1 lg:min-h-[88vh]">
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
            className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,transparent_0%,transparent_55%,rgba(232,223,214,0.55)_82%,rgb(232_223_214)_100%)] lg:bg-[linear-gradient(90deg,transparent_0%,transparent_50%,rgba(232,223,214,0.34)_62%,rgba(232,223,214,0.74)_82%,rgb(232_223_214)_100%)]"
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
          <TopoPattern className="pointer-events-none absolute bottom-0 left-0 z-[2] h-36 w-[min(100%,280px)] text-[#0F3D2E] opacity-[0.07] sm:h-48 sm:w-[min(100%,340px)]" />

          <motion.div
            variants={stagger}
            initial="hidden"
            animate="show"
            className="relative z-[1] flex flex-1 flex-col justify-center px-5 py-7 sm:px-8 sm:py-8 lg:px-12 lg:py-12"
          >
            <motion.p
              variants={fadeUp}
              className="mb-3 font-sans text-[10px] font-medium uppercase tracking-[0.28em] text-[#C9A961] sm:mb-4"
            >
              — Est. 2024
            </motion.p>

            <motion.div
              variants={cardFloat}
              className="relative overflow-hidden rounded-2xl border border-white/40 bg-[#F7F3EE]/[0.96] shadow-[0_20px_50px_-20px_rgba(15,61,46,0.28),0_0_0_1px_rgba(201,169,97,0.12)] backdrop-blur-sm"
            >
              <div
                aria-hidden
                className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_0%_0%,rgba(201,169,97,0.16)_0%,transparent_55%)]"
              />
              <TopoPattern className="pointer-events-none absolute -bottom-2 -right-2 z-[1] h-28 w-44 text-[#0F3D2E] opacity-[0.06] sm:h-32 sm:w-52" />

              <div className="relative z-[2] px-6 py-7 sm:px-8 sm:py-8">
                <p className="mb-2.5 text-center font-sans text-[10px] font-semibold uppercase tracking-[0.22em] text-[#C9A961]">
                  Centuries Mutual
                </p>

                <div className="mx-auto mb-4 h-px w-12 bg-[#C9A961]/70" aria-hidden />

                <h1
                  className="mb-2 text-center font-medium tracking-tight text-[#0F3D2E]"
                  style={{
                    fontFamily: 'var(--font-hero-editorial), Fraunces, Georgia, serif',
                    fontSize: 'clamp(1.65rem, 5.2vw, 2.45rem)',
                    lineHeight: 1.15,
                  }}
                >
                  Your Community Brokerage
                </h1>
                <h2
                  className="mb-4 text-center font-medium tracking-tight text-[#0F3D2E]/90"
                  style={{
                    fontFamily: 'var(--font-hero-editorial), Fraunces, Georgia, serif',
                    fontSize: 'clamp(1.05rem, 3.2vw, 1.35rem)',
                    lineHeight: 1.3,
                  }}
                >
                  The Common Wealth
                </h2>
                <p className="mb-6 text-center font-sans text-[0.875rem] leading-[1.65] text-[#3d4a41] sm:text-[0.9375rem]">
                  A member-owned network where health coverage, everyday savings,
                  and community rewards build lasting value — designed to protect
                  your family today and help grow what you pass on for generations
                  to come.
                </p>
                <div className="flex w-full flex-wrap items-center justify-center gap-2.5 sm:flex-nowrap">
                  <Link
                    href="/createaccount"
                    className="inline-flex min-w-[8.5rem] shrink-0 items-center justify-center rounded-lg border border-[#0F3D2E] bg-transparent px-4 py-2.5 font-sans text-[0.8125rem] font-semibold tracking-[0.01em] text-[#0F3D2E] no-underline transition hover:bg-[#0F3D2E]/[0.06]"
                  >
                    Create Account
                  </Link>
                  <Link
                    href="/enroll"
                    className="inline-flex min-w-[8.5rem] shrink-0 items-center justify-center rounded-lg bg-[#0F3D2E] px-4 py-2.5 font-sans text-[0.8125rem] font-semibold tracking-[0.01em] text-[#FAFCFB] no-underline shadow-[0_8px_22px_-8px_rgba(15,61,46,0.55)] transition hover:bg-[#0A2E22]"
                  >
                    Enroll
                  </Link>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
