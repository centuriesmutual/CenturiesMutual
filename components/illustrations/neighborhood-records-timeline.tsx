'use client'

import { useEffect, useRef, useState } from 'react'
import { cn } from '@/lib/utils'

const G = '#14432A'
const GOLD = '#C9A53E'
const PAPER = '#FAFCFB'

function NodeGlyph({ index }: { index: number }) {
  if (index === 0)
    return (
      <>
        <rect x="5" y="4" width="10" height="8" rx="0.8" fill="none" stroke={G} strokeWidth={1} />
        <line x1="7" y1="6.5" x2="13" y2="6.5" stroke="#55655D" strokeWidth={0.4} opacity={0.55} />
      </>
    )
  if (index === 1)
    return (
      <>
        <path d="M6 12 L10 5 L14 12 Z" fill="none" stroke={G} strokeWidth={1} strokeLinejoin="round" />
        <path d="M7.5 10 h5" stroke={GOLD} strokeWidth={0.9} strokeLinecap="round" />
      </>
    )
  if (index === 2)
    return (
      <>
        <line x1="10" y1="3" x2="10" y2="15" stroke={G} strokeWidth={1.2} strokeLinecap="round" />
        <text x="10" y="12" textAnchor="middle" fill={G} fontSize="8" fontFamily="Georgia, serif" fontWeight={600}>
          S
        </text>
      </>
    )
  return (
    <>
      <circle cx="7" cy="7" r="2.5" fill="none" stroke={GOLD} strokeWidth={0.9} />
      <rect x="9.5" y="9" width="1.2" height="6" fill={GOLD} />
    </>
  )
}

const ROWS = [
  {
    headline: 'Application reviewed',
    date: 'Apr 03 · 10:41',
    detail: (
      <>
        Profile and references aligned before next step.
      </>
    ),
  },
  {
    headline: 'Lease signed',
    date: 'Apr 08 · 15:06',
    detail: (
      <>
        Fully bound signatures.{' '}
        <svg className="inline h-5 w-5 align-middle text-[#C9A53E]" viewBox="0 0 28 28" aria-hidden>
          <circle cx="14" cy="14" r="11" stroke="currentColor" fill="none" />
          <text x="14" y="17" textAnchor="middle" fill="currentColor" fontSize="9">
            ✓
          </text>
        </svg>
      </>
    ),
  },
  {
    headline: 'Deposit received',
    date: 'Apr 09 · 08:52',
    detail: (
      <>
        Held in Treasury with linked agreement.{' '}
        <span className="rounded bg-[#14432A]/10 px-1.5 font-mono text-[10px] text-[#14432A]">TX · confirmed</span>
      </>
    ),
  },
  {
    headline: 'Move-in confirmed',
    date: 'Apr 14 · 12:00',
    detail: (
      <span className="inline-flex items-center gap-1 text-[#14432A]">
        Completed <span className="text-[#C9A53E]">✓</span>
      </span>
    ),
  },
] as const

export function NeighborhoodRecordsTimeline({ className }: { className?: string }) {
  const rootRef = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const el = rootRef.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e?.isIntersecting) setVisible(true)
      },
      { threshold: 0.12 },
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  return (
    <div ref={rootRef} className={cn('nb-illustrations', className)}>
      <div className="relative pl-2">
        <div className="pointer-events-none absolute bottom-8 left-[15px] top-4 w-px bg-gradient-to-b from-[#C9A53E]/65 to-[#C9A53E]/25" aria-hidden />

        <div className="relative space-y-8">
          {ROWS.map((row, idx) => {
            const isLast = idx === ROWS.length - 1
            return (
              <div
                key={row.headline}
                className={cn('relative flex gap-3', visible && 'nb-timeline-enter')}
                style={{
                  animationDelay: `${idx * 200}ms`,
                  animationFillMode: 'forwards',
                }}
              >
                <div className="relative z-[1] flex w-9 shrink-0 justify-center pt-0.5">
                  <div
                    className={cn(
                      'relative flex h-7 w-7 items-center justify-center rounded-full border border-[#C9A53E]/60 bg-[#FAFCFB]',
                      isLast && visible && 'nb-timeline-pulse ring-2 ring-[#C9A53E]/35 ring-offset-2 ring-offset-[#FAFCFB]',
                    )}
                  >
                    <svg viewBox="0 0 20 20" className="h-3.5 w-3.5" aria-hidden>
                      <NodeGlyph index={idx} />
                    </svg>
                  </div>
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                    <span className="font-serif font-semibold text-[#14432A]">{row.headline}</span>
                    <span className="font-mono text-[11px] text-[#6B6B66]">{row.date}</span>
                  </div>
                  <p className="mt-1 font-sans text-[0.8125rem] leading-relaxed text-[#3d4a41]">{row.detail}</p>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      <div className="mt-8 flex items-center justify-center gap-2">
        <svg width="28" height="28" viewBox="0 0 28 28" aria-hidden className="shrink-0">
          <circle cx="14" cy="14" r="11" fill="none" stroke={GOLD} strokeWidth={1} />
          <circle cx="14" cy="14" r="6" fill="none" stroke={GOLD} strokeWidth={0.75} opacity={0.85} />
          <path d="M14 10 l4 4 -4 4 -4 -4 Z" fill={GOLD} />
        </svg>
        <span className="font-sans text-[0.6875rem] font-medium uppercase tracking-[0.12em] text-[#55655D]">Sealed record</span>
      </div>
    </div>
  )
}
