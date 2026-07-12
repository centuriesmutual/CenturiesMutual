'use client'

import dynamic from 'next/dynamic'
import { motion } from 'framer-motion'
import {
  slideInLeft,
  slideInRight,
} from '../utils/home-animations'
import { UnifiedBenefitCard } from './ui/figma-feature-cards'
import './illustrations/neighborhood-motion.css'

const Colosseum3D = dynamic(
  () => import('./illustrations/colosseum-3d').then((m) => m.Colosseum3D),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-[300px] w-full items-center justify-center bg-transparent font-sans text-sm text-[#55655D]">
        Loading…
      </div>
    ),
  },
)

export default function HealthInsuranceWellness() {
  return (
    <section className="relative overflow-hidden border-t border-[#E8EBEA] bg-[#FAFCFB] py-12 sm:py-16 lg:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          className="mx-auto max-w-3xl text-center"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 1.15, ease: [0.22, 1, 0.36, 1] }}
        >
          <p className="mb-3 font-sans text-[11px] font-semibold uppercase tracking-[0.22em] text-[#C9A53E]">
            — Health Insurance Wellness
          </p>
          <h2
            className="mb-3 font-medium leading-[1.15] tracking-[-0.01em] text-[#14432A]"
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: 'clamp(1.75rem, 4.2vw, 3rem)',
            }}
          >
            Fitness via My Brother&apos;s Keeper
          </h2>
          <p className="mx-auto max-w-[640px] font-sans text-[0.9375rem] leading-[1.6] text-[#55655D] sm:text-[1.0625rem]">
            Connect your fitness activity through{' '}
            <a
              href="https://mybrotherskeeper.cc"
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-[#14432A] underline decoration-[#C9A53E]/60 underline-offset-2 hover:decoration-[#C9A53E]"
            >
              mybrotherskeeper.cc
            </a>
            — workouts sync into your Centuries Mutual health insurance membership
            so healthy habits can feed your member rewards.
          </p>
        </motion.div>

        <div className="mt-8 grid grid-cols-1 items-center gap-8 sm:mt-10 lg:mt-12 lg:grid-cols-2 lg:gap-10">
          <motion.div {...slideInLeft}>
            <UnifiedBenefitCard
              eyebrow="Wellness bridge"
              title="Fitness that feeds your membership"
              body={
                <p className="m-0">
                  Workouts logged in My Brother&apos;s Keeper flow straight into your
                  Centuries Mutual profile — streaks and daily goals stay visible
                  beside your member ledger, and eligible activity can unlock
                  supplemental credits on your attached wallet. One login, one
                  bridge between healthy habits and member rewards.
                </p>
              }
              points={[
                'Workouts sync automatically from My Brother’s Keeper',
                'Streaks and daily goals beside your member ledger',
                'Health progress connects without a second login',
                'Eligible activity can unlock wallet credits',
              ]}
            />
          </motion.div>

          <motion.div {...slideInRight}>
            <Colosseum3D />
          </motion.div>
        </div>
      </div>
    </section>
  )
}
