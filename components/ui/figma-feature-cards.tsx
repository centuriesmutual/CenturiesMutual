'use client'

import { motion } from 'framer-motion'
import type { ComponentType, SVGProps, ReactNode } from 'react'
import { staggerContainer, staggerItem } from '@/utils/home-animations'

type Feature = {
  Icon: ComponentType<SVGProps<SVGSVGElement>>
  title: string
  blurb: string
}

/** Feature tiles — soft green tint matching icon shade */
export function FigmaFeatureCards({
  features,
  className = '',
}: {
  features: ReadonlyArray<Feature>
  className?: string
}) {
  return (
    <motion.div
      className={`grid grid-cols-1 gap-3 sm:grid-cols-2 ${className}`}
      variants={staggerContainer}
      initial="initial"
      whileInView="animate"
      viewport={{ once: true, margin: '-50px' }}
    >
      {features.map(({ Icon, title, blurb }, index) => (
        <motion.div
          key={title}
          variants={staggerItem}
          className="group relative overflow-hidden rounded-2xl bg-[#14432A]/[0.06] p-5"
        >
          <div className="mb-3 flex items-center justify-between gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-[10px] bg-[#14432A]/[0.06]">
              <Icon className="h-5 w-5 text-[#14432A]" />
            </div>
            <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-[#C9A53E]">
              {String(index + 1).padStart(2, '0')}
            </span>
          </div>
          <h3 className="mb-1.5 font-sans text-[0.95rem] font-semibold leading-tight tracking-[-0.01em] text-[#14432A]">
            {title}
          </h3>
          <p className="m-0 font-sans text-[0.8125rem] leading-[1.55] text-[#55655D]">{blurb}</p>
        </motion.div>
      ))}
    </motion.div>
  )
}

/** Single unified benefit card — one surface, one story */
export function UnifiedBenefitCard({
  eyebrow,
  title,
  body,
  points,
  className = '',
}: {
  eyebrow?: string
  title: string
  body: ReactNode
  points?: ReadonlyArray<string>
  className?: string
}) {
  return (
    <motion.div
      className={`rounded-2xl bg-[#14432A]/[0.06] p-5 sm:p-6 lg:p-7 ${className}`}
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.95, ease: [0.22, 1, 0.36, 1] }}
    >
      {eyebrow ? (
        <p className="mb-2 font-sans text-[10px] font-semibold uppercase tracking-[0.2em] text-[#C9A53E]">
          {eyebrow}
        </p>
      ) : null}
      <h3
        className="mb-3 font-medium leading-snug tracking-[-0.01em] text-[#14432A]"
        style={{
          fontFamily: "'Playfair Display', Georgia, serif",
          fontSize: 'clamp(1.35rem, 2.4vw, 1.65rem)',
        }}
      >
        {title}
      </h3>
      <div className="font-sans text-[0.9375rem] leading-[1.65] text-[#55655D]">{body}</div>
      {points && points.length > 0 ? (
        <ul className="mt-3 space-y-2 border-t border-[#14432A]/10 pt-3">
          {points.map((point) => (
            <li key={point} className="flex items-start gap-2.5">
              <span
                aria-hidden
                className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#C9A53E]"
              />
              <span className="font-sans text-[0.875rem] leading-[1.5] text-[#14432A]">{point}</span>
            </li>
          ))}
        </ul>
      ) : null}
    </motion.div>
  )
}
