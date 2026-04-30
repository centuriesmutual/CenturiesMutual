'use client'

import { Search } from 'lucide-react'
import { useEffect, useState } from 'react'
import { cn } from '@/lib/utils'

type Props = {
  onOpen: () => void
  /** Optional class on outer button */
  className?: string
  /** Lower, wider strip (e.g. under a hero image) */
  compact?: boolean
  /** Hide muted helper text; control still has aria-label for screen readers */
  hideLabel?: boolean
}

export function CommunitySearchBar({ onOpen, className, compact, hideLabel }: Props) {
  const [kbdHint, setKbdHint] = useState('⌘ K')

  useEffect(() => {
    const isApple = typeof navigator !== 'undefined' && /Mac|iPod|iPhone|iPad/.test(navigator.platform ?? '')
    setKbdHint(isApple ? '⌘K' : 'Ctrl K')
  }, [])

  return (
    <button
      type="button"
      onClick={onOpen}
      aria-label={
        hideLabel ? 'Search — open palette to search rooms, neighborhoods, and dates' : undefined
      }
      className={cn(
        'group flex w-full cursor-pointer items-center rounded-full border border-[#E5E0D5] bg-white shadow-sm outline-none transition hover:-translate-y-px hover:border-forest hover:shadow-md focus-visible:border-forest focus-visible:ring-2 focus-visible:ring-forest/25',
        compact
          ? hideLabel
            ? 'h-10 justify-between gap-0 px-4 sm:px-5 py-0'
            : 'h-10 gap-2.5 border-warm-border px-3 py-0 sm:gap-3 sm:px-4'
          : 'h-14 gap-3 bg-cream px-4',
        className,
      )}
    >
      <Search
        className={cn('shrink-0 text-muted', compact ? 'h-[1.05rem] w-[1.05rem]' : 'h-5 w-5')}
        strokeWidth={2}
        aria-hidden
      />
      {!hideLabel && (
        <span
          className={cn(
            'min-w-0 flex-1 text-left font-sans text-muted',
            compact ? 'text-[13px] leading-tight sm:text-sm' : 'text-sm md:text-[15px]',
          )}
        >
          Search rooms, neighborhoods, or dates…
        </span>
      )}
      <kbd
        className={cn(
          'pointer-events-none shrink-0 select-none rounded-full border border-warm-border bg-cream font-mono font-semibold uppercase tracking-wide text-muted/75',
          compact
            ? 'hidden px-2 py-0.5 text-[9px] sm:inline-block'
            : 'hidden px-2.5 py-1 text-[10px] sm:inline-block',
        )}
        aria-hidden
      >
        {kbdHint}
      </kbd>
    </button>
  )
}
