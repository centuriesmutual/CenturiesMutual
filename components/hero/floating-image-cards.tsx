'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { MonitorPlay, Play, Users } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { cardFloat } from '@/lib/animations'
import { cn } from '@/lib/utils'

const linkReset =
  'no-underline !text-white hover:!text-white hover:no-underline focus-visible:no-underline active:!text-white visited:!text-white'

const slabCls = cn(
  'block h-auto rounded-xl border border-[#C9A961]/35 bg-[#0F3D2E]/90 shadow-lg backdrop-blur-md transition hover:bg-[#0F3D2E]/95 text-white',
  linkReset,
)

const youtubeFrameCls = cn(
  'relative rounded-[28px] border border-[#C9A961]/25 bg-gradient-to-b from-[#1a2420] via-[#121816] to-[#0a0f0c] p-[7px] shadow-[0_28px_64px_rgba(0,0,0,0.55),0_0_0_1px_rgba(201,169,97,0.08),inset_0_1px_0_rgba(255,255,255,0.06)] ring-1 ring-black/50',
)

type CardRow = { id: string; delay: number; href: string }

const CARDS: CardRow[] = [
  {
    id: 'video',
    delay: 0.15,
    href: '/private-phone-messaging',
  },
]

const CHAT_Z = 40 as const

const STREAM_CAPTION_ROTATE_MS = 12000

const STREAM_CAPTIONS: readonly string[] = [
  'Member walks and policy Q&A — replay trims by chapter.',
  'Neighborhood corridor tours with live captions.',
  'Broker-hosted briefings synced to listings in your corridor.',
  'Watch parties for rate and market updates — moderated chat.',
]

function YoutubeCard({ labelId }: { labelId: string }) {
  const [captionIdx, setCaptionIdx] = useState(0)
  useEffect(() => {
    const id = window.setInterval(() => setCaptionIdx((i) => (i + 1) % STREAM_CAPTIONS.length), STREAM_CAPTION_ROTATE_MS)
    return () => window.clearInterval(id)
  }, [])

  return (
    <div className={youtubeFrameCls}>
      <div
        className="pointer-events-none absolute -inset-px rounded-[28px] opacity-[0.35] blur-xl"
        aria-hidden
        style={{
          background:
            'radial-gradient(ellipse 80% 60% at 50% 0%, rgba(201, 169, 97, 0.22), transparent 55%), radial-gradient(ellipse 70% 50% at 80% 100%, rgba(16, 185, 129, 0.12), transparent 50%)',
        }}
      />
      <div className="relative overflow-hidden rounded-[22px] bg-black">
        <div className="bg-[#050807] px-3.5 pb-5 pt-3 sm:px-5 sm:pb-6 sm:pt-3.5">
          <p id={labelId} className="sr-only">
            Member video preview with rotating captions.
          </p>

          <div
            className="overflow-hidden rounded-[14px] border border-white/[0.14] bg-[#0f0f0f] shadow-inner ring-1 ring-black/50"
            aria-hidden
          >
            <div className="flex items-center gap-2 border-b border-white/[0.07] bg-[#282828] px-3.5 py-2.5 sm:px-4">
              <span className="flex shrink-0 gap-[6px]" aria-hidden>
                <span className="h-[7px] w-[7px] shrink-0 rounded-full bg-[#ff5f56]" />
                <span className="h-[7px] w-[7px] shrink-0 rounded-full bg-[#febc2e]" />
                <span className="h-[7px] w-[7px] shrink-0 rounded-full bg-[#28c840]" />
              </span>
              <MonitorPlay className="h-3.5 w-3.5 shrink-0 text-white/72" aria-hidden />
              <span className="min-w-0 flex-1 truncate font-sans text-[9px] font-medium uppercase tracking-[0.12em] text-white/92 sm:text-[10px]">
                youtu.be · Centuries Mutual
              </span>
              <Users className="h-3.5 w-3.5 shrink-0 text-white/75" aria-hidden />
            </div>
            {/* Taller video area than before (no pulse card below) */}
            <div className="relative w-full pt-[62%] sm:pt-[58%]">
              <div className="absolute inset-0 bg-[#050505]" />
              <div className="absolute inset-[1px] bg-[radial-gradient(ellipse_at_50%_20%,rgba(201,169,97,0.08),transparent_52%),linear-gradient(to_bottom,#0a0a0a,#000)]" />
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="flex h-[3.75rem] w-[3.75rem] items-center justify-center rounded-full bg-[rgba(255,255,255,0.95)] shadow-[0_8px_32px_rgba(0,0,0,0.5)] ring-2 ring-black/65 sm:h-[4.5rem] sm:w-[4.5rem]">
                  <Play
                    className="relative left-[3px] h-11 w-11 shrink-0 text-[#050505] sm:h-14 sm:w-14"
                    fill="currentColor"
                    strokeWidth={0}
                    aria-hidden
                  />
                </span>
              </div>
            </div>
          </div>

          <div className="mt-4 flex min-h-[2.5rem] items-start justify-start sm:mt-5">
            <AnimatePresence mode="wait" initial={false}>
              <motion.p
                key={captionIdx}
                initial={{ opacity: 0, y: 2 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -2 }}
                transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
                className="line-clamp-2 text-left font-sans text-[10px] leading-snug tracking-[0.015em] text-white/75 sm:text-[11px]"
              >
                {STREAM_CAPTIONS[captionIdx]}
              </motion.p>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  )
}

function FloatingInner({ row, titleId }: { row: CardRow; titleId: string }) {
  const youtubeLabel = `${titleId}-youtube`
  return (
    <Link href={row.href} className={cn(slabCls, 'lg:pointer-events-auto p-3 sm:p-4')} aria-labelledby={youtubeLabel}>
      <YoutubeCard labelId={youtubeLabel} />
    </Link>
  )
}

function FloaterArticle({ row }: { row: CardRow }) {
  const titleId = `floater-${row.id}-title`
  return (
    <motion.article
      variants={cardFloat}
      initial="hidden"
      animate="show"
      transition={{ delay: row.delay }}
      className="relative z-10 w-full max-w-[min(36rem,100%)] sm:max-w-xl md:max-w-[34rem] lg:max-w-[36rem]"
      style={{ zIndex: CHAT_Z }}
      aria-label="Member video preview"
    >
      <FloatingInner row={row} titleId={titleId} />
    </motion.article>
  )
}

export function FloatingImageCards({ className = '' }: { className?: string }) {
  return (
    <div
      className={cn(
        'pointer-events-none relative z-[1] flex w-full max-w-[min(36rem,100%)] flex-col sm:max-w-xl md:max-w-[34rem] lg:max-w-[36rem]',
        '[&_a]:pointer-events-auto',
        className,
      )}
    >
      {CARDS.map((c) => (
        <FloaterArticle key={c.id} row={c} />
      ))}
    </div>
  )
}
