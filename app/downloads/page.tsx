'use client'

import { motion } from 'framer-motion'
import { SiteHeader } from '@/components/layout/site-header'
import { sectionAnimation } from '@/utils/home-animations'

const platforms = [
  {
    name: 'iOS',
    body: 'Coverage status, rewards, and member tools on iPhone and iPad.',
  },
  {
    name: 'Android',
    body: 'Plans, rewards wallet, and care access on Android devices.',
  },
]

export default function DownloadsPage() {
  return (
    <>
      <SiteHeader />
      <main className="m-0 block overflow-hidden bg-transparent p-0">
        <section className="flex h-[calc(100dvh-57px)] max-h-[calc(100dvh-57px)] items-start overflow-hidden bg-[#0F3D2E] pt-[14vh] sm:pt-[16vh]">
          <div className="mx-auto w-full max-w-4xl px-4 sm:px-6 lg:px-8">
            <motion.div className="mx-auto max-w-2xl text-center" {...sectionAnimation}>
              <p className="mb-2 font-sans text-[10px] font-semibold uppercase tracking-[0.22em] text-[#C9A53E] sm:mb-3 sm:text-[11px]">
                — Downloads
              </p>
              <h1
                className="mb-2 font-medium leading-[1.15] tracking-[-0.01em] text-[#FAFCFB] sm:mb-3"
                style={{
                  fontFamily: "'Playfair Display', Georgia, serif",
                  fontSize: 'clamp(1.55rem, 4.2vw, 2.5rem)',
                }}
              >
                Get the Centuries Mutual App
              </h1>
              <p className="mx-auto max-w-[520px] font-sans text-[0.8125rem] leading-[1.55] text-[#FAFCFB]/85 sm:text-[0.9375rem]">
                Choose your platform and carry exclusive health insurance, member
                rewards, and care access with you.
              </p>
            </motion.div>

            <motion.div
              className="mx-auto mt-6 grid max-w-3xl grid-cols-2 gap-3 sm:mt-8 sm:gap-5"
              {...sectionAnimation}
            >
              {platforms.map((platform, index) => (
                <div
                  key={platform.name}
                  className="flex flex-col rounded-[12px] bg-[#164A38] px-3 py-4 sm:rounded-[14px] sm:px-6 sm:py-6"
                >
                  <p className="mb-1.5 font-sans text-[9px] font-semibold uppercase tracking-[0.18em] text-[#C9A53E] sm:mb-2 sm:text-[11px] sm:tracking-[0.22em]">
                    {String(index + 1).padStart(2, '0')} Platform
                  </p>
                  <h2
                    className="mb-1.5 font-medium leading-[1.2] tracking-[-0.01em] text-[#FAFCFB] sm:mb-2"
                    style={{
                      fontFamily: "'Playfair Display', Georgia, serif",
                      fontSize: 'clamp(1.15rem, 2.5vw, 1.65rem)',
                    }}
                  >
                    {platform.name}
                  </h2>
                  <p className="mb-3 flex-1 font-sans text-[0.75rem] leading-[1.45] text-[#FAFCFB]/80 sm:mb-4 sm:text-[0.875rem] sm:leading-[1.55]">
                    {platform.body}
                  </p>
                  <span className="inline-flex w-full items-center justify-center rounded-[10px] bg-[#FAFCFB]/90 px-3 py-2 font-sans text-[0.75rem] font-semibold text-[#0F3D2E] sm:w-auto sm:px-4 sm:py-2.5 sm:text-[0.875rem]">
                    Coming Soon
                  </span>
                </div>
              ))}
            </motion.div>
          </div>
        </section>
      </main>
    </>
  )
}
