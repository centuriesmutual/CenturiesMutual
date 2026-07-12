'use client'

import dynamic from 'next/dynamic'
import Link from 'next/link'
import { motion } from 'framer-motion'
import {
  slideInLeft,
  slideInRight,
} from '../utils/home-animations'
import { UnifiedBenefitCard } from './ui/figma-feature-cards'
import './illustrations/neighborhood-motion.css'

const Piano3D = dynamic(
  () => import('./illustrations/piano-3d').then((m) => m.Piano3D),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-[300px] w-full items-center justify-center bg-transparent font-sans text-sm text-[#55655D]">
        Loading…
      </div>
    ),
  },
)

export default function WintergardenMusic() {
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
            — Wintergarden
          </p>
          <h2
            className="mb-3 font-medium leading-[1.15] tracking-[-0.01em] text-[#14432A]"
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: 'clamp(1.75rem, 4.2vw, 3rem)',
            }}
          >
            Music Performance Software
          </h2>
          <p className="mx-auto max-w-[640px] font-sans text-[0.9375rem] leading-[1.6] text-[#55655D] sm:text-[1.0625rem]">
            Wintergarden is Centuries Mutual&apos;s music performance software and
            game — a studio for rehearsal, stagecraft, and technique that turns
            practice into scored play. Open{' '}
            <Link
              href="/wintergarden"
              className="font-semibold text-[#14432A] underline decoration-[#C9A53E]/60 underline-offset-2 hover:decoration-[#C9A53E]"
            >
              Wintergarden
            </Link>{' '}
            to develop real performance skill inside your membership.
          </p>
        </motion.div>

        <div className="mt-8 grid grid-cols-1 items-center gap-8 sm:mt-10 lg:mt-12 lg:grid-cols-2 lg:gap-10">
          <motion.div {...slideInLeft}>
            <UnifiedBenefitCard
              eyebrow="How it works"
              title="Rehearse, perform, and level up"
              body={
                <p className="m-0">
                  Enter a session, play through guided repertoire, and earn
                  performance scores on timing, phrasing, and stage readiness.
                  Progressive challenges unlock harder pieces as your stamina
                  grows — so development feels like a game while staying
                  disciplined enough for the concert hall.
                </p>
              }
              points={[
                'Playable rehearsal sessions with live performance scoring',
                'Technique drills for timing, dynamics, and phrasing',
                'Progressive challenges that build repertoire and stamina',
                'Progress stays linked to your Centuries Mutual member profile',
              ]}
            />
          </motion.div>

          <motion.div {...slideInRight}>
            <Piano3D />
          </motion.div>
        </div>
      </div>
    </section>
  )
}
