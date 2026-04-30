import { cn } from '@/lib/utils'

const G = '#14432A'
const GOLD = '#C9A53E'
const PAPER = '#FAFCFB'

type P = { className?: string; 'aria-hidden'?: boolean }

/** ~560×160 — three documents converging */
export function NeighborhoodAgreementsDocFan({ className, 'aria-hidden': ah = true }: P) {
  return (
    <div className={cn('nb-illustrations mb-8 flex w-full justify-center', className)} aria-hidden={ah}>
      <svg viewBox="0 0 560 160" className="h-auto w-full max-w-[560px]" xmlns="http://www.w3.org/2000/svg">
        <g transform="translate(40,28) rotate(-8)">
          <rect x="0" y="0" width="120" height="96" rx="8" fill={PAPER} stroke={G} strokeWidth={1} opacity={0.95} />
        </g>
        <g transform="translate(200,18)">
          <rect x="0" y="0" width="140" height="108" rx="8" fill={PAPER} stroke={G} strokeWidth={1.2} />
          <circle cx="118" cy="18" r="8" fill="none" stroke={GOLD} strokeWidth={1} />
          <path d="M114 18 l2.5 2.5 L122 14" fill="none" stroke={GOLD} strokeWidth={1} strokeLinecap="round" />
        </g>
        <g transform="translate(380,32) rotate(10)">
          <rect x="0" y="0" width="118" height="92" rx="8" fill={PAPER} stroke={G} strokeWidth={1} opacity={0.92} />
        </g>
        <path
          d="M 100 70 Q 200 40 420 52"
          fill="none"
          stroke={GOLD}
          strokeWidth={0.9}
          strokeDasharray="4 6"
          className="nb-dash-flow-slow"
        />
        <path
          d="M 270 64 L 430 56"
          fill="none"
          stroke={GOLD}
          strokeWidth={0.9}
          strokeDasharray="4 6"
          className="nb-dash-flow-slow"
        />
        <circle cx="470" cy="52" r="5" fill={GOLD} />
      </svg>
    </div>
  )
}

/** 32px seal — position absolute by parent */
export function AgreementGoldSeal({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 32 32"
      className={cn('nb-illustrations pointer-events-none h-8 w-8', className)}
      aria-hidden
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="16" cy="16" r="14" fill="none" stroke={GOLD} strokeWidth={1} />
      <circle cx="16" cy="16" r="8" fill="none" stroke={GOLD} strokeWidth={0.75} opacity={0.85} />
      <path d="M16 12 l2.5 2.5 L20 11" fill="none" stroke={GOLD} strokeWidth={1} strokeLinecap="round" />
      {[0, 90, 180, 270].map((deg) => (
        <line
          key={deg}
          x1="16"
          y1="2"
          x2="16"
          y2="5"
          stroke={GOLD}
          strokeWidth={0.75}
          transform={`rotate(${deg} 16 16)`}
        />
      ))}
      <path d="M16 14 l2 2 -2 2 -2 -2 Z" fill={GOLD} />
    </svg>
  )
}

export function AgreementRowCheck({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" className={cn('h-4 w-4 shrink-0 text-[#14432A]', className)} aria-hidden xmlns="http://www.w3.org/2000/svg">
      <path
        d="M3 8 L6.5 11.5 L13 4.5"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}
