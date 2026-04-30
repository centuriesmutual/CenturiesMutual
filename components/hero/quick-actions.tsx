'use client'

import Link from 'next/link'
import { UsersRound, Home, Newspaper } from 'lucide-react'

/** Copy for hero column only — imported by `CommunityHero`. */
export const COMMUNITY_HERO_QUICK_ITEMS = [
  { href: '/neighborhood', label: 'Listings', Icon: Home },
  { href: '/newspaper', label: 'Newspaper', Icon: Newspaper },
  { href: '/neighborhood?q=roommates', label: 'Roommates', Icon: UsersRound },
] as const

export const quickActionDefaults = [...COMMUNITY_HERO_QUICK_ITEMS]

type Item = {
  readonly href: string
  readonly label: string
  readonly Icon: (typeof Home) | typeof Newspaper | typeof UsersRound
}

export function QuickActions({
  className = '',
  items,
}: {
  className?: string
  /** When set (e.g. from Community Hero), replaces default pill labels. */
  items?: readonly Item[]
}) {
  const row = items ?? quickActionDefaults
  return (
    <div className={`flex flex-nowrap items-center gap-2 overflow-x-auto sm:gap-3 ${className}`}>
      {row.map(({ href, label, Icon }) => (
        <Link
          key={`${href}:${label}`}
          href={href}
          className="inline-flex h-10 shrink-0 items-center gap-2 rounded-full border border-[#0F3D2E]/22 bg-cream/95 px-4 font-sans text-sm font-medium text-[#0F3D2E] no-underline shadow-sm backdrop-blur-sm transition hover:border-[#0F3D2E]/35 hover:bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#C9A961]/55 active:bg-cream"
        >
          <Icon className="h-4 w-4 shrink-0 text-[#0F3D2E]" strokeWidth={1.75} aria-hidden />
          {label}
        </Link>
      ))}
    </div>
  )
}
