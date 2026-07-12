'use client'

import dynamic from 'next/dynamic'
import { motion } from 'framer-motion'
import {
  sectionAnimation,
  slideInLeft,
  slideInRight,
} from '../utils/home-animations'
import { UnifiedBenefitCard } from './ui/figma-feature-cards'
import './illustrations/neighborhood-motion.css'

const PayFlow3D = dynamic(
  () => import('./illustrations/pay-flow-3d').then((m) => m.PayFlow3D),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-[320px] w-full items-center justify-center bg-transparent font-sans text-sm text-[#55655D]">
        Loading…
      </div>
    ),
  },
)

export default function HealthInsurancePay() {
  return (
    <section className="relative overflow-hidden border-t border-[#E8EBEA] bg-[#F4F1EC] py-12 sm:py-16 lg:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div className="mx-auto max-w-3xl text-center" {...sectionAnimation}>
          <p className="mb-3 font-sans text-[11px] font-semibold uppercase tracking-[0.22em] text-[#C9A53E]">
            — Health Insurance Pay
          </p>
          <h2
            className="mb-3 font-medium leading-[1.15] tracking-[-0.01em] text-[#14432A]"
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: 'clamp(1.75rem, 4.2vw, 3rem)',
            }}
          >
            Rent, Bills &amp; Groceries
          </h2>
        </motion.div>

        <div className="mt-8 grid grid-cols-1 items-center gap-8 sm:mt-10 lg:mt-12 lg:grid-cols-2 lg:gap-10">
          <motion.div className="lg:order-2" {...slideInRight}>
            <PayFlow3D />
          </motion.div>

          <motion.div className="lg:order-1" {...slideInLeft}>
            <UnifiedBenefitCard
              eyebrow="Everyday pay"
              title="Rent, bills, and groceries in one place"
              body={
                <p className="m-0">
                  Send rent on a schedule, settle utilities from the same ledger, and
                  check out for household essentials without leaving the app. Every
                  send leaves a dated receipt you can open anytime — one membership
                  surface for the payments that keep a household running.
                </p>
              }
              points={[
                'Rent once or on a recurring draw',
                'Electric, water, and internet from one ledger',
                'Grocery checkout without switching apps',
                'Full payment history you can revisit anytime',
              ]}
            />
          </motion.div>
        </div>
      </div>
    </section>
  )
}
