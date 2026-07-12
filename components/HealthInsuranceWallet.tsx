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

const CenturiesMutualCard3D = dynamic(
  () =>
    import('./illustrations/centuries-mutual-card-3d').then((m) => m.CenturiesMutualCard3D),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-[280px] w-full items-center justify-center bg-transparent font-sans text-sm text-[#55655D]">
        Loading card…
      </div>
    ),
  },
)

export default function HealthInsuranceWallet() {
  return (
    <section className="relative overflow-hidden border-t border-[#E8EBEA] bg-[#FAFCFB] py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div className="mx-auto max-w-3xl text-center" {...sectionAnimation}>
          <p className="mb-3 font-sans text-[11px] font-semibold uppercase tracking-[0.22em] text-[#C9A53E]">
            — Blockchain
          </p>
          <h2
            className="mb-3 font-medium leading-[1.15] tracking-[-0.01em] text-[#14432A]"
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: 'clamp(2rem, 4.2vw, 3rem)',
            }}
          >
            Healthcare Rewards Wallet
          </h2>
        </motion.div>

        <div className="mt-12 grid grid-cols-1 items-center gap-10 lg:grid-cols-2">
          <motion.div {...slideInLeft}>
            <CenturiesMutualCard3D />
          </motion.div>

          <motion.div {...slideInRight}>
            <UnifiedBenefitCard
              eyebrow="Healthcare rewards"
              title="One wallet clipped to your membership"
              body={
                <p className="m-0">
                  Attach a rewards wallet to your Centuries Mutual identity and earn
                  supplemental credits on eligible activity — rent, bills, and member
                  programs. Accruals land in a clear, dated ledger and stay locked to
                  your verified account, transferable only by you.
                </p>
              }
              points={[
                'Clip the wallet to your account in one step',
                'Earn on everyday eligible activity',
                'Watch credits accrue with a dated ledger',
                'Rewards stay member-locked and portable only by you',
              ]}
            />
          </motion.div>
        </div>
      </div>
    </section>
  )
}
