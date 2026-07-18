'use client'

import { motion } from 'framer-motion'
import {
  CheckCircleIcon,
  ClockIcon,
  PhoneIcon,
} from '@heroicons/react/24/outline'
import { slideInLeft, slideInRight } from '@/utils/home-animations'
import { LiveChat } from '@/components/help-desk/live-chat'

const PHONE_DISPLAY = '(214) 555-0134'
const PHONE_TEL = '+12145550134'

const PHONE_POINTS: ReadonlyArray<string> = [
  'Have your member ID ready to speed things up',
  'Know your plan type (Medicare Advantage, Supplement, dental, or family)',
  'Note whether you are calling about the app or the web experience',
]

export function HelpDeskHero() {
  return (
    <section className="relative overflow-hidden border-b border-[#E8EBEA] bg-[#FAFCFB] py-14 sm:py-20">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_80%_0%,rgba(201,169,97,0.14)_0%,transparent_55%)]"
      />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto mb-10 max-w-3xl text-center sm:mb-14">
          <p className="mb-3 font-sans text-[11px] font-semibold uppercase tracking-[0.22em] text-[#C9A53E]">
            — Support
          </p>
          <h1
            className="mb-4 font-medium leading-[1.15] tracking-[-0.01em] text-[#14432A]"
            style={{
              fontFamily: "'Playfair Display', Georgia, serif",
              fontSize: 'clamp(2rem, 5vw, 3.25rem)',
            }}
          >
            Help Desk
          </h1>
          <p className="mx-auto max-w-[640px] font-sans text-[1rem] leading-[1.65] text-[#55655D] sm:text-[1.0625rem]">
            Two ways to reach Centuries Mutual — talk to a Dallas-based member
            services steward by phone, or start a real-time chat with our AI
            assistant. We route you to the right person from either door.
          </p>
        </div>

        <div className="grid grid-cols-1 items-stretch gap-6 lg:grid-cols-2 lg:gap-8">
          <motion.div className="flex" {...slideInLeft}>
            <div className="flex w-full flex-col rounded-[18px] border border-[#E8EBEA] bg-white p-6 shadow-[0_12px_40px_-28px_rgba(15,61,46,0.5)] sm:p-8">
              <span className="mb-5 flex h-12 w-12 items-center justify-center rounded-full bg-[#0F3D2E]/8 text-[#0F3D2E]">
                <PhoneIcon className="h-6 w-6" aria-hidden />
              </span>
              <h2
                className="mb-2 font-medium leading-[1.2] tracking-[-0.01em] text-[#14432A]"
                style={{
                  fontFamily: "'Playfair Display', Georgia, serif",
                  fontSize: 'clamp(1.5rem, 3vw, 2rem)',
                }}
              >
                Phone Support
              </h2>
              <p className="m-0 mb-6 font-sans text-[0.95rem] leading-[1.6] text-[#55655D]">
                Prefer a voice on the line? Call our member services team and a
                steward will help with enrollment, coverage, rewards, or a
                security concern.
              </p>

              <a
                href={`tel:${PHONE_TEL}`}
                className="group mb-4 inline-flex items-center gap-3 self-start rounded-[12px] bg-[#0F3D2E] px-5 py-3.5 no-underline shadow-sm transition hover:bg-[#0A2E22]"
              >
                <PhoneIcon
                  className="h-5 w-5 text-[#C9A53E]"
                  aria-hidden
                />
                <span
                  className="font-medium tracking-[-0.01em] text-[#FAFCFB]"
                  style={{
                    fontFamily: "'Playfair Display', Georgia, serif",
                    fontSize: 'clamp(1.5rem, 3.5vw, 2rem)',
                  }}
                >
                  {PHONE_DISPLAY}
                </span>
              </a>

              <p className="m-0 mb-6 flex items-center gap-2 font-sans text-[0.82rem] font-medium text-[#55655D]">
                <ClockIcon className="h-4 w-4 shrink-0 text-[#C9A53E]" aria-hidden />
                Dallas-based member services · U.S. business-day coverage
              </p>

              <div className="mt-auto border-t border-[#E8EBEA] pt-5">
                <p className="mb-3 font-sans text-[11px] font-semibold uppercase tracking-[0.18em] text-[#C9A53E]">
                  Before you call
                </p>
                <ul className="m-0 list-none space-y-2.5 p-0">
                  {PHONE_POINTS.map((point) => (
                    <li
                      key={point}
                      className="flex items-start gap-2.5 font-sans text-[0.9rem] leading-[1.5] text-[#14432A]"
                    >
                      <CheckCircleIcon
                        className="mt-0.5 h-5 w-5 shrink-0 text-[#0F3D2E]"
                        aria-hidden
                      />
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </motion.div>

          <motion.div className="flex" {...slideInRight}>
            <LiveChat />
          </motion.div>
        </div>
      </div>
    </section>
  )
}
