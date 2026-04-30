'use client'

import { useCallback, useEffect, useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'

const SLIDES = [
  { id: '1', alt: 'Broken video placeholder — playback unavailable', line: 'This video is no longer available.' },
  { id: '2', alt: 'Broken video placeholder — playback error', line: 'An error occurred. Playback stopped.' },
  { id: '3', alt: 'Broken video placeholder — connection issue', line: 'Check your connection and try again.' },
  { id: '4', alt: 'Broken video placeholder — content unavailable', line: 'This content cannot be played here.' },
] as const

const INTERVAL_MS = 7500

function BrokenVideoFrame({ line }: { line: string }) {
  return (
    <div className="flex h-full min-h-0 w-full items-stretch justify-center bg-black">
      <div className="relative flex h-full w-full max-w-none shrink-0 flex-col overflow-hidden rounded-md border border-white/[0.08] bg-[#181818] shadow-[0_8px_32px_rgba(0,0,0,0.45)]">
        <div className="flex h-7 shrink-0 items-center gap-1.5 border-b border-white/[0.06] bg-[#212121] px-3 sm:px-4">
          <span className="h-2 w-2 rounded-full bg-[#ff5f57]/90" aria-hidden />
          <span className="h-2 w-2 rounded-full bg-[#febc2e]/90" aria-hidden />
          <span className="h-2 w-2 rounded-full bg-[#28c840]/90" aria-hidden />
        </div>
        <div className="relative w-full flex-1">
          <div className="absolute inset-0 bg-[#050505]" aria-hidden />
          <div
            className="absolute inset-[1px] bg-[radial-gradient(ellipse_at_50%_20%,rgba(201,169,97,0.06),transparent_52%),linear-gradient(to_bottom,#0a0a0a,#000)]"
            aria-hidden
          />
          <div
            className="pointer-events-none absolute inset-0 opacity-[0.07]"
            style={{
              backgroundImage: `repeating-linear-gradient(
                0deg,
                transparent,
                transparent 2px,
                rgba(255,255,255,0.04) 2px,
                rgba(255,255,255,0.04) 4px
              )`,
            }}
            aria-hidden
          />
          <div className="absolute inset-0 z-[1] flex flex-col items-center justify-center gap-2.5 px-5 py-5 sm:gap-3 sm:px-6 sm:py-6">
            <svg
              width="72"
              height="72"
              viewBox="0 0 72 72"
              fill="none"
              className="h-[3.25rem] w-[3.25rem] shrink-0 text-[#8a8a8a] sm:h-[4.25rem] sm:w-[4.25rem]"
              aria-hidden
            >
              <rect x="10" y="16" width="52" height="36" rx="4" stroke="currentColor" strokeWidth="1.5" fill="rgba(255,255,255,0.03)" />
              <path d="M30 28L46 36L30 44V28Z" fill="currentColor" opacity="0.35" />
              <path d="M22 52L50 52" stroke="#c54b4b" strokeWidth="2.2" strokeLinecap="round" />
              <path d="M26 56L46 48" stroke="#c54b4b" strokeWidth="2.2" strokeLinecap="round" />
            </svg>
            <p className="max-w-[18rem] text-center font-sans text-[12px] font-medium leading-snug text-[#e8e8e8]/88 sm:max-w-[22rem] sm:text-[13px] md:text-[14px]">
              {line}
            </p>
            <p className="font-sans text-[10px] uppercase tracking-[0.12em] text-[#8a8a8a]">Error code · player</p>
          </div>
        </div>
      </div>
    </div>
  )
}

type Props = {
  className?: string
  /** e.g. `bottom-28` when parent has a bottom overlay (CTA strip) */
  controlsClassName?: string
}

export function HeroEditorialCarousel({ className, controlsClassName }: Props) {
  const [index, setIndex] = useState(0)
  const [reducedMotion, setReducedMotion] = useState(false)

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    setReducedMotion(mq.matches)
    const fn = () => setReducedMotion(mq.matches)
    mq.addEventListener('change', fn)
    return () => mq.removeEventListener('change', fn)
  }, [])

  const go = useCallback((dir: -1 | 1) => {
    setIndex((i) => {
      const n = SLIDES.length
      return (i + dir + n) % n
    })
  }, [])

  useEffect(() => {
    if (reducedMotion) return
    const t = window.setInterval(() => go(1), INTERVAL_MS)
    return () => window.clearInterval(t)
  }, [go, reducedMotion])

  const controlsBar =
    'opacity-0 transition-opacity duration-200 ease-out motion-reduce:transition-none group-hover:opacity-100 group-focus-within:opacity-100 [@media(hover:none)]:opacity-100'

  return (
    <div
      className={cn(
        'group relative w-full min-h-0 overflow-hidden rounded-2xl',
        className,
      )}
      role="region"
      aria-roledescription="carousel"
      aria-label="Featured scenes"
    >
      {SLIDES.map((slide, i) => (
        <div
          key={slide.id}
          className={cn(
            'absolute inset-0 transition-opacity duration-700 ease-out motion-reduce:transition-none',
            i === index ? 'z-[1] opacity-100' : 'pointer-events-none z-0 opacity-0',
          )}
          aria-hidden={i !== index}
        >
          <BrokenVideoFrame line={slide.line} />
        </div>
      ))}

      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 z-[2] h-[34%] bg-gradient-to-t from-black/35 via-black/10 to-transparent sm:h-[36%]"
        aria-hidden
      />

      <div
        className={cn(
          'absolute bottom-4 left-4 right-4 z-[3] flex items-center justify-between gap-3 sm:left-5 sm:right-5',
          controlsBar,
          controlsClassName,
        )}
      >
        <button
          type="button"
          onClick={() => go(-1)}
          className="pointer-events-auto flex h-9 w-9 shrink-0 items-center justify-center rounded-full border-0 bg-black/45 text-white shadow-none backdrop-blur-md outline-none ring-0 transition hover:bg-black/55 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#C9A961]/70"
          aria-label="Previous slide"
        >
          <ChevronLeft className="h-5 w-5 shrink-0 text-white" strokeWidth={2.25} aria-hidden />
        </button>

        <div className="flex flex-1 justify-center gap-1.5" role="tablist" aria-label="Slide indicators">
          {SLIDES.map((s, i) => (
            <button
              key={s.id}
              type="button"
              role="tab"
              aria-selected={i === index}
              aria-label={`Go to slide ${i + 1}`}
              onClick={() => setIndex(i)}
              className={cn(
                'h-1.5 rounded-full border-0 shadow-none outline-none ring-0 transition-all motion-reduce:transition-none',
                i === index ? 'w-6 bg-[#FAFCFB]' : 'w-1.5 bg-white/45 hover:bg-white/70',
              )}
            />
          ))}
        </div>

        <button
          type="button"
          onClick={() => go(1)}
          className="pointer-events-auto flex h-9 w-9 shrink-0 items-center justify-center rounded-full border-0 bg-black/45 text-white shadow-none backdrop-blur-md outline-none ring-0 transition hover:bg-black/55 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#C9A961]/70"
          aria-label="Next slide"
        >
          <ChevronRight className="h-5 w-5 shrink-0 text-white" strokeWidth={2.25} aria-hidden />
        </button>
      </div>

      <p className="sr-only" aria-live="polite">
        Slide {index + 1} of {SLIDES.length}: {SLIDES[index].alt}
      </p>
    </div>
  )
}
