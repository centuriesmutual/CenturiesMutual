'use client'

import dynamic from 'next/dynamic'
import Link from 'next/link'
import { motion } from 'framer-motion'
import {
  WalletIcon,
  BuildingLibraryIcon,
  DocumentCheckIcon,
  ReceiptPercentIcon,
  ShieldCheckIcon,
  BoltIcon,
} from '@heroicons/react/24/outline'
import { SiteHeader } from '@/components/layout/site-header'
import Footer from '@/components/Footer'
import {
  FigmaFeatureCards,
  UnifiedBenefitCard,
} from '@/components/ui/figma-feature-cards'
import {
  sectionAnimation,
  slideInLeft,
  slideInRight,
  staggerContainer,
  staggerItem,
} from '@/utils/home-animations'

const LightBulb3D = dynamic(
  () =>
    import('@/components/illustrations/light-bulb-3d').then((m) => m.LightBulb3D),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-full w-full items-center justify-center font-sans text-sm text-[#8FB39E]">
        Loading…
      </div>
    ),
  },
)

const FLOW = [
  {
    step: '01',
    title: 'Open Wallet',
    body: 'Sign in to your Centuries Mutual Wallet and choose Utilities from Account services.',
  },
  {
    step: '02',
    title: 'Start bill pay',
    body: 'Launch utilities bill pay for electric, water, gas, internet, and related household providers.',
  },
  {
    step: '03',
    title: 'Enter biller details',
    body: 'Add your utility account number, service address, and amount. Confirm before funds leave the ledger.',
  },
  {
    step: '04',
    title: 'Settle & record',
    body: 'The payment settles and a dated receipt lands in your Wallet history, with rewards eligibility where program rules allow.',
  },
] as const

const FEATURES = [
  {
    Icon: BoltIcon,
    title: 'Household utilities',
    blurb: 'Electric, water, gas, and internet from one membership rail.',
  },
  {
    Icon: BuildingLibraryIcon,
    title: 'Provider network',
    blurb: 'Enterprise bill-pay connectivity for eligible utility providers.',
  },
  {
    Icon: WalletIcon,
    title: 'Wallet-funded settles',
    blurb: 'Pay from your Centuries Mutual ledger — same identity as rewards.',
  },
  {
    Icon: ReceiptPercentIcon,
    title: 'Audit-ready receipts',
    blurb: 'Every send is dated, stored, and exportable beside other Wallet activity.',
  },
  {
    Icon: DocumentCheckIcon,
    title: 'Clear confirmation',
    blurb: 'Review biller, account, and amount before the payment is transmitted.',
  },
  {
    Icon: ShieldCheckIcon,
    title: 'Controlled access',
    blurb: 'Membership-scoped pays with activity logging on every settlement.',
  },
] as const

export function UtilitiesPageView() {
  return (
    <>
      <SiteHeader />
      <main className="m-0 block overflow-x-hidden bg-[#FAFCFB] p-0">
        {/* Hero */}
        <section className="relative isolate min-h-[min(92dvh,820px)] overflow-hidden bg-[#071A12]">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0"
            style={{
              background: `
                radial-gradient(ellipse 90% 70% at 12% -10%, rgba(19,75,116,0.45) 0%, transparent 55%),
                radial-gradient(ellipse 70% 60% at 88% 20%, rgba(15,61,46,0.9) 0%, transparent 50%),
                radial-gradient(ellipse 50% 40% at 50% 100%, rgba(201,169,97,0.14) 0%, transparent 45%),
                linear-gradient(165deg, #071A12 0%, #0F3D2E 48%, #0A2E22 100%)
              `,
            }}
          />
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 opacity-[0.14]"
            style={{
              backgroundImage:
                'linear-gradient(rgba(255,255,255,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.06) 1px, transparent 1px)',
              backgroundSize: '48px 48px',
              maskImage:
                'radial-gradient(ellipse 80% 70% at 50% 40%, #000 20%, transparent 75%)',
            }}
          />

          <div className="relative mx-auto grid min-h-[min(92dvh,820px)] max-w-7xl grid-cols-1 items-center gap-8 px-4 py-20 sm:px-6 lg:grid-cols-12 lg:gap-10 lg:px-8 lg:py-28">
            <motion.div
              className="lg:col-span-6"
              initial={{ opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.05, ease: [0.22, 1, 0.36, 1] }}
            >
              <p className="mb-4 font-sans text-[11px] font-semibold uppercase tracking-[0.28em] text-[#C9A53E]">
                Centuries Mutual
              </p>
              <h1
                className="mb-5 font-medium leading-[1.12] tracking-[-0.02em] text-[#FAFCFB]"
                style={{
                  fontFamily: "'Playfair Display', Georgia, serif",
                  fontSize: 'clamp(2.4rem, 6vw, 4rem)',
                }}
              >
                Utilities
              </h1>
              <p className="mb-8 max-w-xl font-sans text-[1.05rem] leading-[1.7] text-[#D5E0DA] sm:text-[1.125rem]">
                Keep the household current without leaving your membership. Pay
                electric, water, gas, internet, and related utility accounts from the
                Centuries Mutual Wallet — on the same ledger that tracks rent,
                groceries, and rewards activity. Each settlement is confirmed before
                funds move, then stored as a dated receipt you can reopen anytime
                for audits, roommates, or month-end review.
              </p>
              <div className="flex flex-wrap items-center gap-3">
                <Link
                  href="/createaccount"
                  className="inline-flex items-center justify-center rounded-[10px] bg-[#FAFCFB] px-5 py-2.5 font-sans text-[0.875rem] font-semibold text-[#0F3D2E] no-underline shadow-[0_10px_30px_-12px_rgba(0,0,0,0.45)] transition hover:bg-white"
                >
                  Create Account
                </Link>
              </div>
            </motion.div>

            <motion.div
              className="relative h-[360px] w-full overflow-visible bg-transparent sm:h-[440px] lg:col-span-6 lg:h-[520px]"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
            >
              <LightBulb3D />
            </motion.div>
          </div>
        </section>

        {/* Flow */}
        <section className="relative overflow-hidden border-t border-[#E8EBEA] bg-[#FAFCFB] py-16 sm:py-20 lg:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <motion.div className="mx-auto max-w-2xl text-center" {...sectionAnimation}>
              <p className="mb-3 font-sans text-[11px] font-semibold uppercase tracking-[0.22em] text-[#C9A53E]">
                Bill-pay flow
              </p>
              <h2
                className="mb-3 font-medium leading-[1.2] tracking-[-0.01em] text-[#14432A]"
                style={{
                  fontFamily: "'Playfair Display', Georgia, serif",
                  fontSize: 'clamp(1.7rem, 3.4vw, 2.4rem)',
                }}
              >
                From Wallet to paid bill
              </h2>
              <p className="m-0 font-sans text-[0.9375rem] leading-[1.65] text-[#55655D]">
                A four-step path: authenticate, open utilities bill pay, confirm the
                biller, and settle with a receipt on your ledger.
              </p>
            </motion.div>

            <motion.ol
              className="relative mt-12 grid list-none grid-cols-1 gap-4 p-0 sm:grid-cols-2 lg:grid-cols-4 lg:gap-5"
              variants={staggerContainer}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true, margin: '-60px' }}
            >
              {FLOW.map((item, index) => (
                <motion.li
                  key={item.step}
                  variants={staggerItem}
                  className="relative rounded-2xl bg-[#14432A]/[0.06] p-5 sm:p-6"
                >
                  <div className="mb-4 flex items-center justify-between gap-3">
                    <span className="font-mono text-[11px] font-semibold uppercase tracking-[0.2em] text-[#C9A53E]">
                      {item.step}
                    </span>
                    {index < FLOW.length - 1 ? (
                      <span
                        aria-hidden
                        className="hidden h-px flex-1 bg-gradient-to-r from-[#14432A]/25 to-transparent lg:block"
                      />
                    ) : null}
                  </div>
                  <h3 className="mb-2 font-sans text-[1rem] font-semibold tracking-[-0.01em] text-[#14432A]">
                    {item.title}
                  </h3>
                  <p className="m-0 font-sans text-[0.8125rem] leading-[1.55] text-[#55655D]">
                    {item.body}
                  </p>
                </motion.li>
              ))}
            </motion.ol>
          </div>
        </section>

        {/* Platform detail */}
        <section className="relative overflow-hidden border-t border-[#E8EBEA] bg-[#F4F1EC] py-16 sm:py-20 lg:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 items-start gap-10 lg:grid-cols-12 lg:gap-14">
              <motion.div className="lg:col-span-5" {...slideInLeft}>
                <p className="mb-3 font-sans text-[11px] font-semibold uppercase tracking-[0.22em] text-[#C9A53E]">
                  Enterprise rail
                </p>
                <h2
                  className="mb-4 font-medium leading-[1.2] tracking-[-0.01em] text-[#14432A]"
                  style={{
                    fontFamily: "'Playfair Display', Georgia, serif",
                    fontSize: 'clamp(1.65rem, 3.2vw, 2.3rem)',
                  }}
                >
                  Bill pay inside your membership
                </h2>
                <p className="mb-0 font-sans text-[0.9375rem] leading-[1.65] text-[#55655D]">
                  Utilities is not a separate app. Household bills settle against the
                  same Wallet ledger that tracks rewards and receipts — one identity,
                  one payment record.
                </p>
              </motion.div>
              <motion.div className="lg:col-span-7" {...slideInRight}>
                <UnifiedBenefitCard
                  eyebrow="Wallet · Utilities"
                  title="What members complete"
                  body={
                    <p className="m-0">
                      From Account → Utilities, enter the biller name, utility account
                      number, and amount. Confirm once — the payment transmits and
                      Centuries Mutual stores the settlement on your ledger.
                    </p>
                  }
                  points={[
                    'Funded from available Wallet balance',
                    'Biller name and account number required',
                    'Amount confirmed before transmission',
                    'Receipt appears in Wallet history after submit',
                  ]}
                  action={{ label: 'Member login', href: '/login?next=/wallet' }}
                />
              </motion.div>
            </div>
          </div>
        </section>

        {/* Capability grid */}
        <section className="relative overflow-hidden border-t border-[#E8EBEA] bg-[#FAFCFB] py-16 sm:py-20 lg:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <motion.div className="mb-10 max-w-2xl" {...sectionAnimation}>
              <p className="mb-3 font-sans text-[11px] font-semibold uppercase tracking-[0.22em] text-[#C9A53E]">
                Capabilities
              </p>
              <h2
                className="m-0 font-medium leading-[1.2] tracking-[-0.01em] text-[#14432A]"
                style={{
                  fontFamily: "'Playfair Display', Georgia, serif",
                  fontSize: 'clamp(1.65rem, 3.2vw, 2.3rem)',
                }}
              >
                Designed for operational clarity
              </h2>
            </motion.div>
            <FigmaFeatureCards features={[...FEATURES]} />
          </div>
        </section>

        {/* Limits + CTA */}
        <section className="relative overflow-hidden border-t border-[#E8EBEA] bg-[#0F3D2E] py-16 sm:py-20">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_80%_0%,rgba(19,75,116,0.35)_0%,transparent_50%)]"
          />
          <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 items-end gap-10 lg:grid-cols-12 lg:gap-12">
              <motion.div className="lg:col-span-7" {...slideInLeft}>
                <p className="mb-3 font-sans text-[11px] font-semibold uppercase tracking-[0.22em] text-[#C9A53E]">
                  Scope
                </p>
                <h2
                  className="mb-4 font-medium leading-[1.2] tracking-[-0.01em] text-[#FAFCFB]"
                  style={{
                    fontFamily: "'Playfair Display', Georgia, serif",
                    fontSize: 'clamp(1.6rem, 3vw, 2.2rem)',
                  }}
                >
                  What Utilities is — and is not
                </h2>
                <p className="mb-0 max-w-xl font-sans text-[0.9375rem] leading-[1.65] text-[#FAFCFB]/80">
                  A payment and records rail for eligible utility providers. Not a
                  utility company, not rate advice, and not a guarantee that every
                  provider nationwide is supported. Availability varies by market and
                  Wallet balance.
                </p>
              </motion.div>
              <motion.div
                className="flex flex-wrap gap-3 lg:col-span-5 lg:justify-end"
                {...slideInRight}
              >
                <Link
                  href="/createaccount"
                  className="inline-flex items-center justify-center rounded-[10px] bg-[#FAFCFB] px-5 py-2.5 font-sans text-[0.875rem] font-semibold text-[#0F3D2E] no-underline transition hover:bg-white"
                >
                  Create Account
                </Link>
              </motion.div>
            </div>
          </div>
        </section>
      </main>
      <Footer variant="legal" />
    </>
  )
}
