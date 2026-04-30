import { cn } from '@/lib/utils'

const G = '#14432A'
const GOLD = '#C9A53E'

type P = { className?: string; 'aria-hidden'?: boolean }

export function IllustrationSearchableSeconds({ className, ...rest }: P) {
  return (
    <div className={cn('nb-illustrations mx-auto flex justify-center', className)} aria-hidden={rest['aria-hidden'] ?? true}>
      <svg viewBox="0 0 120 80" className="h-20 w-[120px] max-w-full sm:h-[80px]" xmlns="http://www.w3.org/2000/svg">
        <line x1="20" y1="58" x2="100" y2="58" stroke={GOLD} strokeWidth={0.5} opacity={0.65} />
        <line x1="20" y1="52" x2="100" y2="52" stroke={GOLD} strokeWidth={0.5} opacity={0.5} />
        <line x1="20" y1="46" x2="100" y2="46" stroke={GOLD} strokeWidth={0.5} opacity={0.4} />
        <circle cx="62" cy="38" r="16" fill="none" stroke={G} strokeWidth={1.5} />
        <line x1="74" y1="48" x2="88" y2="60" stroke={G} strokeWidth={1.5} strokeLinecap="round" />
        <circle cx="62" cy="38" r="2.5" fill={GOLD} />
      </svg>
    </div>
  )
}

export function IllustrationConnectedNotScattered({ className, ...rest }: P) {
  return (
    <div className={cn('nb-illustrations mx-auto flex justify-center', className)} aria-hidden={rest['aria-hidden'] ?? true}>
      <svg viewBox="0 0 120 80" className="h-20 w-[120px] max-w-full sm:h-[80px]" xmlns="http://www.w3.org/2000/svg">
        <rect x="18" y="16" width="18" height="14" rx="3" fill={G} fillOpacity={0.45} />
        <rect x="84" y="16" width="18" height="14" rx="3" fill={G} fillOpacity={0.45} />
        <rect x="18" y="50" width="18" height="14" rx="3" fill={G} fillOpacity={0.45} />
        <rect x="84" y="50" width="18" height="14" rx="3" fill={G} fillOpacity={0.45} />
        <path d="M36 23 H84 M36 57 H84 M27 30 V50 M93 30 V50 M36 23 L93 57 M93 23 L36 57" fill="none" stroke={GOLD} strokeWidth={0.9} />
      </svg>
    </div>
  )
}

export function IllustrationYoursToKeep({ className, ...rest }: P) {
  return (
    <div className={cn('nb-illustrations mx-auto flex justify-center', className)} aria-hidden={rest['aria-hidden'] ?? true}>
      <svg viewBox="0 0 120 80" className="h-20 w-[120px] max-w-full sm:h-[80px]" xmlns="http://www.w3.org/2000/svg">
        <path d="M58 8 v10" stroke={GOLD} strokeWidth={1} strokeLinecap="round" opacity={0.45} />
        <path d="M52 52 L52 28 L78 28 L78 52 Q65 58 52 52 Z" fill="none" stroke={G} strokeWidth={1.5} />
        <path d="M56 34 h20 M56 40 h16 M56 46 h18" stroke={G} strokeWidth={0.6} opacity={0.35} />
        <g className="nb-arrow-nudge">
          <path d="M60 22 L66 16 L72 22" fill="none" stroke={GOLD} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
          <line x1="66" y1="16" x2="66" y2="26" stroke={GOLD} strokeWidth={1.5} strokeLinecap="round" />
        </g>
      </svg>
    </div>
  )
}
