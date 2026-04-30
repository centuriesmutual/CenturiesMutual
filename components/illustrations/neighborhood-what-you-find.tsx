import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

const G = '#14432A'
const GOLD = '#C9A53E'
const PAPER = '#FAFCFB'
const GRAY = '#55655D'
type P = { className?: string; 'aria-hidden'?: boolean }

function Wrap({ className, children, 'aria-hidden': ah = true }: { children?: ReactNode } & P) {
  return (
    <div className={cn('nb-illustrations mx-auto flex justify-center', className)} aria-hidden={ah}>
      {children}
    </div>
  )
}

export function IllustrationListingsNearby(props: P) {
  return (
    <Wrap {...props}>
      <svg viewBox="0 0 120 80" className="h-20 w-[120px] max-w-full sm:h-[80px]" xmlns="http://www.w3.org/2000/svg">
        <rect x="8" y="28" width="22" height="44" rx="4" fill={G} fillOpacity={0.35} />
        <rect x="48" y="18" width="26" height="54" rx="5" fill={G} fillOpacity={0.45} />
        <rect x="88" y="32" width="22" height="40" rx="4" fill={G} fillOpacity={0.3} />
        <rect x="44" y="12" width="34" height="62" rx="6" fill="none" stroke={GOLD} strokeWidth={1.5} />
        <circle cx="62" cy="22" r={3} fill={GOLD} />
      </svg>
    </Wrap>
  )
}

export function IllustrationPeopleLiveWith(props: P) {
  return (
    <Wrap {...props}>
      <svg viewBox="0 0 120 80" className="h-20 w-[120px] max-w-full sm:h-[80px]" xmlns="http://www.w3.org/2000/svg">
        <g opacity={0.8}>
          <circle cx="28" cy="28" r="9" fill={G} />
          <path d="M18 42 L38 42 L34 62 L22 62 Z" fill={G} />
        </g>
        <g opacity={0.55}>
          <circle cx="92" cy="30" r="9" fill={G} />
          <path d="M82 44 L102 44 L98 64 L86 64 Z" fill={G} />
        </g>
        <g opacity={0.65}>
          <circle cx="60" cy="26" r="9" fill={G} />
          <path d="M50 40 L70 40 L66 60 L54 60 Z" fill={G} />
        </g>
        <path d="M 38 32 Q 48 26 52 32" fill="none" stroke={GOLD} strokeWidth={1.2} strokeLinecap="round" />
      </svg>
    </Wrap>
  )
}

export function IllustrationLocalNewspaper(props: P) {
  return (
    <Wrap {...props}>
      <svg viewBox="0 0 120 80" className="nb-float-doc h-20 w-[120px] max-w-full sm:h-[80px]" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M22 12 h76 a6 6 0 0 1 6 6 v52 a4 4 0 0 1 -4 4 H26 a4 4 0 0 1 -4 -4 V16 a4 4 0 0 1 4 -4 z"
          fill={PAPER}
          stroke={G}
          strokeWidth={1}
        />
        <line x1="32" y1="28" x2="88" y2="28" stroke={GOLD} strokeWidth={1} />
        <line x1="32" y1="36" x2="82" y2="36" stroke={GOLD} strokeWidth={0.75} opacity={0.85} />
        <line x1="32" y1="46" x2="90" y2="46" stroke={GRAY} strokeWidth={0.5} opacity={0.5} />
        <line x1="32" y1="54" x2="86" y2="54" stroke={GRAY} strokeWidth={0.5} opacity={0.5} />
        <line x1="32" y1="62" x2="84" y2="62" stroke={GRAY} strokeWidth={0.5} opacity={0.5} />
        <circle cx="92" cy="20" r={3} fill={GOLD} />
      </svg>
    </Wrap>
  )
}

export function IllustrationSharedStandards(props: P) {
  return (
    <Wrap {...props}>
      <svg viewBox="0 0 120 80" className="h-20 w-[120px] max-w-full sm:h-[80px]" xmlns="http://www.w3.org/2000/svg">
        {[0, 1, 2].map((i) => (
          <g key={i} transform={`translate(24, ${18 + i * 20})`}>
            <rect x={0} y={0} width="56" height="14" rx="3" fill={G} fillOpacity={0.35 + i * 0.05} />
            <path
              d="M62 4 l4 4 l8 -10"
              fill="none"
              stroke={GOLD}
              strokeWidth={1.5}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </g>
        ))}
      </svg>
    </Wrap>
  )
}
