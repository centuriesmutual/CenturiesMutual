'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import {
  ShieldCheckIcon,
  UserGroupIcon,
  StarIcon,
  ChatBubbleLeftRightIcon,
} from '@heroicons/react/24/outline'
import {
  sectionAnimation,
  staggerContainer,
  staggerItem,
  slideInLeft,
  slideInRight,
} from '../utils/home-animations'
import { RoommateDirectoryModal } from './illustrations/home-product-modals'
import './illustrations/neighborhood-motion.css'

type Feature = {
  Icon: typeof UserGroupIcon
  title: string
  blurb: string
}

const FEATURES: ReadonlyArray<Feature> = [
  {
    Icon: UserGroupIcon,
    title: 'Compatible Matching',
    blurb: 'Smart preference matching across lifestyle and habits.',
  },
  {
    Icon: ShieldCheckIcon,
    title: 'Verified Profiles',
    blurb: 'ID and background checked before they ever message.',
  },
  {
    Icon: ChatBubbleLeftRightIcon,
    title: 'Secure Messaging',
    blurb: 'Direct, end-to-end conversations with audit trails.',
  },
  {
    Icon: StarIcon,
    title: 'Trust Score',
    blurb: 'A reliable rating that compounds over time.',
  },
]

export default function BlockchainSection() {
  return (
    <section className="relative overflow-hidden border-t border-[#E8EBEA] bg-[#FAFCFB] py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div className="mx-auto max-w-3xl text-center" {...sectionAnimation}>
          <p className="mb-3 font-sans text-[11px] font-semibold uppercase tracking-[0.22em] text-[#C9A53E]">
            — Roommates
          </p>
          <h2
            className="mb-3 font-medium leading-[1.15] tracking-[-0.01em] text-[#14432A]"
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: 'clamp(2rem, 4.2vw, 3rem)',
            }}
          >
            Find Your Perfect Roommate
          </h2>
          <p className="mx-auto max-w-[640px] font-sans text-[1.0625rem] leading-[1.6] text-[#55655D]">
            Search the directory, contact verified members, and seal a roommate
            agreement that holds up — all in one corridor-aware experience.
          </p>
        </motion.div>

        <div className="mt-12 grid grid-cols-1 items-center gap-10 lg:grid-cols-2">
          <motion.div {...slideInLeft}>
            <RoommateDirectoryModal />
          </motion.div>

          <motion.div {...slideInRight}>
            <motion.div
              className="grid grid-cols-1 gap-3 sm:grid-cols-2"
              variants={staggerContainer}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true, margin: '-50px' }}
            >
              {FEATURES.map(({ Icon, title, blurb }) => (
                <motion.div
                  key={title}
                  variants={staggerItem}
                  className="rounded-[14px] border border-[#E8EBEA] bg-white px-5 py-[1.1rem]"
                >
                  <div className="flex items-start gap-3">
                    <div className="rounded-[10px] bg-[#14432A]/[0.06] p-2.5">
                      <Icon className="h-5 w-5 text-[#14432A]" />
                    </div>
                    <div>
                      <h3 className="mb-1 font-sans text-[0.95rem] font-semibold leading-tight tracking-[-0.005em] text-[#14432A]">
                        {title}
                      </h3>
                      <p className="font-sans text-[0.8125rem] leading-[1.5] text-[#55655D]">
                        {blurb}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>

            <motion.div
              className="mt-6 flex flex-wrap items-center gap-3"
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Link
                href="/neighborhood"
                className="inline-flex items-center justify-center rounded-[10px] bg-[#14432A] px-4 py-2 font-sans text-[0.875rem] font-semibold tracking-[0.01em] text-[#FAFCFB] shadow-[0_8px_24px_-10px_rgba(20,67,42,0.45)] transition hover:bg-[#0F3321] no-underline"
              >
                Browse Roommates
              </Link>
              <Link
                href="/rentalequity"
                className="inline-flex items-center justify-center rounded-[10px] border border-[#14432A] bg-transparent px-4 py-2 font-sans text-[0.875rem] font-semibold tracking-[0.01em] text-[#14432A] transition hover:bg-[#14432A]/[0.06] no-underline"
              >
                Learn More
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
