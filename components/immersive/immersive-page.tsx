'use client'

import type { ReactNode } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { SiteHeader } from '@/components/layout/site-header'
import Footer from '@/components/Footer'
import { UnifiedBenefitCard } from '@/components/ui/figma-feature-cards'
import {
  sectionAnimation,
  slideInLeft,
  slideInRight,
} from '@/utils/home-animations'

export type ImmersivePoint = string

export type ImmersiveSection = {
  eyebrow: string
  title: string
  body: string
  points: ReadonlyArray<ImmersivePoint>
  tone?: 'paper' | 'cream'
}

export type ImmersivePageProps = {
  eyebrow: string
  title: string
  lead: string
  sections: ReadonlyArray<ImmersiveSection>
  ctaLabel?: string
  ctaHref?: string
  secondaryLabel?: string
  secondaryHref?: string
  children?: ReactNode
}

export function ImmersivePage({
  eyebrow,
  title,
  lead,
  sections,
  ctaLabel = 'Client Portal',
  ctaHref = '/login',
  secondaryLabel = 'Back home',
  secondaryHref = '/',
  children,
}: ImmersivePageProps) {
  return (
    <>
      <SiteHeader />
      <main className="m-0 block bg-transparent p-0">
        <section className="relative overflow-hidden border-b border-[#E8EBEA] bg-[#0F3D2E] py-14 sm:py-20">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_20%_0%,rgba(201,169,97,0.22)_0%,transparent_55%)]"
          />
          <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <motion.div className="mx-auto max-w-3xl text-center" {...sectionAnimation}>
              <p className="mb-3 font-sans text-[11px] font-semibold uppercase tracking-[0.22em] text-[#C9A53E]">
                {eyebrow}
              </p>
              <h1
                className="mb-4 font-medium leading-[1.15] tracking-[-0.01em] text-[#FAFCFB]"
                style={{
                  fontFamily: "'Playfair Display', Georgia, serif",
                  fontSize: 'clamp(2rem, 5vw, 3.25rem)',
                }}
              >
                {title}
              </h1>
              <p className="mx-auto max-w-[640px] font-sans text-[1rem] leading-[1.65] text-[#FAFCFB]/85 sm:text-[1.0625rem]">
                {lead}
              </p>
              <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
                {ctaHref.startsWith('http') ? (
                  <a
                    href={ctaHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center rounded-[10px] bg-[#FAFCFB] px-4 py-2.5 font-sans text-[0.875rem] font-semibold text-[#0F3D2E] no-underline shadow-sm transition hover:bg-white"
                  >
                    {ctaLabel}
                  </a>
                ) : (
                  <Link
                    href={ctaHref}
                    className="inline-flex items-center justify-center rounded-[10px] bg-[#FAFCFB] px-4 py-2.5 font-sans text-[0.875rem] font-semibold text-[#0F3D2E] no-underline shadow-sm transition hover:bg-white"
                  >
                    {ctaLabel}
                  </Link>
                )}
                <Link
                  href={secondaryHref}
                  className="inline-flex items-center justify-center rounded-[10px] border border-white/25 bg-transparent px-4 py-2.5 font-sans text-[0.875rem] font-semibold text-[#FAFCFB] no-underline transition hover:bg-white/10"
                >
                  {secondaryLabel}
                </Link>
              </div>
            </motion.div>
          </div>
        </section>

        {sections.map((section, index) => (
          <section
            key={section.title}
            className={`relative overflow-hidden border-t border-[#E8EBEA] py-12 sm:py-16 lg:py-20 ${
              section.tone === 'cream' || index % 2 === 1 ? 'bg-[#F4F1EC]' : 'bg-[#FAFCFB]'
            }`}
          >
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-12 lg:gap-12">
                <motion.div className="lg:col-span-5" {...slideInLeft}>
                  <p className="mb-3 font-sans text-[11px] font-semibold uppercase tracking-[0.22em] text-[#C9A53E]">
                    {section.eyebrow}
                  </p>
                  <h2
                    className="mb-3 font-medium leading-[1.2] tracking-[-0.01em] text-[#14432A]"
                    style={{
                      fontFamily: "'Playfair Display', Georgia, serif",
                      fontSize: 'clamp(1.6rem, 3.2vw, 2.35rem)',
                    }}
                  >
                    {section.title}
                  </h2>
                </motion.div>
                <motion.div className="lg:col-span-7" {...slideInRight}>
                  <UnifiedBenefitCard
                    title="Highlights"
                    body={<p className="m-0">{section.body}</p>}
                    points={[...section.points]}
                  />
                </motion.div>
              </div>
            </div>
          </section>
        ))}

        {children}
      </main>
      <Footer />
    </>
  )
}
