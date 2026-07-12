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
    <section className="relative overflow-hidden border-t border-[#E8EBEA] bg-[#FAFCFB] py-12 sm:py-16 lg:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div className="mx-auto max-w-3xl text-center" {...sectionAnimation}>
          <p className="mb-3 font-sans text-[11px] font-semibold uppercase tracking-[0.22em] text-[#C9A53E]">
            — Blockchain
          </p>
          <h2
            className="mb-3 font-medium leading-[1.15] tracking-[-0.01em] text-[#14432A]"
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: 'clamp(1.75rem, 4.2vw, 3rem)',
            }}
          >
            Healthcare Rewards Wallet
          </h2>
        </motion.div>

        <div className="mt-8 grid grid-cols-1 items-center gap-8 sm:mt-10 lg:mt-12 lg:grid-cols-2 lg:gap-10">
          <motion.div {...slideInLeft}>
            <CenturiesMutualCard3D />
          </motion.div>

          <motion.div {...slideInRight}>
            <UnifiedBenefitCard
              eyebrow="Healthcare rewards"
              title="Signature Digital Wallet"
              body={
                <p className="m-0">
                  Earn rewards on a wallet tied to your Centuries Mutual identity —
                  supplemental credits for eligible activity like rent, bills, and
                  member programs. Every credit you earn shows up in chronological
                  order with dates and amounts you can review anytime, tied to your
                  verified member account.
                </p>
              }
              points={[
                'Link the wallet to your membership in one step',
                'Earn rewards when you do everyday eligible activities',
                'See every credit listed with the date it was earned',
                'Only you can use or move your rewards',
              ]}
            />
          </motion.div>
        </div>
      </div>
    </section>
  )
}
