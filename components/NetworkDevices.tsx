'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import {
  ShieldCheckIcon,
  GlobeAltIcon,
  ChatBubbleLeftRightIcon,
  HashtagIcon,
} from '@heroicons/react/24/outline'
import {
  sectionAnimation,
  staggerContainer,
  staggerItem,
  slideInLeft,
  slideInRight,
} from '../utils/home-animations'
import { TwitterFeedModal } from './illustrations/home-product-modals'
import './illustrations/neighborhood-motion.css'

type Feature = {
  Icon: typeof ShieldCheckIcon
  title: string
  blurb: string
}

const FEATURES: ReadonlyArray<Feature> = [
  {
    Icon: HashtagIcon,
    title: 'Real-time feed',
    blurb: 'Updates from neighbors, hosts, and trusted partners in your corridor.',
  },
  {
    Icon: ChatBubbleLeftRightIcon,
    title: 'Threads & DMs',
    blurb: 'Public posts and private messages, side by side.',
  },
  {
    Icon: ShieldCheckIcon,
    title: 'Privacy controls',
    blurb: 'Choose who sees what — by post, by group, by relationship.',
  },
  {
    Icon: GlobeAltIcon,
    title: 'Connections & circles',
    blurb: 'Follows, friends, and communities, kept distinct by intent.',
  },
]

export default function NetworkDevices() {
  return (
    <section className="relative overflow-hidden border-t border-[#E8EBEA] bg-[#F4F1EC] py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div className="mx-auto max-w-3xl text-center" {...sectionAnimation}>
          <p className="mb-3 font-sans text-[11px] font-semibold uppercase tracking-[0.22em] text-[#C9A53E]">
            — Network
          </p>
          <h2
            className="mb-3 font-medium leading-[1.15] tracking-[-0.01em] text-[#14432A]"
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: 'clamp(2rem, 4.2vw, 3rem)',
            }}
          >
            Social Network &amp; Messaging
          </h2>
          <p className="mx-auto max-w-[640px] font-sans text-[1.0625rem] leading-[1.6] text-[#55655D]">
            One feed for your community, one inbox for your conversations, one
            identity that carries your trust into every post.
          </p>
        </motion.div>

        <div className="mt-12 grid grid-cols-1 items-center gap-10 lg:grid-cols-2">
          <motion.div className="lg:order-2" {...slideInRight}>
            <TwitterFeedModal />
          </motion.div>

          <motion.div className="lg:order-1" {...slideInLeft}>
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
                href="/shop/network"
                className="inline-flex items-center justify-center rounded-[10px] bg-[#14432A] px-4 py-2 font-sans text-[0.875rem] font-semibold tracking-[0.01em] text-[#FAFCFB] shadow-[0_8px_24px_-10px_rgba(20,67,42,0.45)] transition hover:bg-[#0F3321] no-underline"
              >
                Shop Now
              </Link>
              <Link
                href="/learnmore/network"
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
