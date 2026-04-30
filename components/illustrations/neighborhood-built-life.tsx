import { cn } from '@/lib/utils'

const G = '#14432A'
const GOLD = '#C9A53E'
const BORDER = '#E8EBEA'
const PAPER = '#FAFCFB'

type P = { className?: string; 'aria-hidden'?: boolean }

export function IllustrationLongTermTenant({ className, ...rest }: P) {
  return (
    <div className={cn('nb-illustrations flex h-full w-full items-center justify-center', className)} aria-hidden={rest['aria-hidden'] ?? true}>
      <svg viewBox="0 0 160 120" className="h-[120px] w-[160px] max-w-full" xmlns="http://www.w3.org/2000/svg">
        <circle cx="80" cy="62" r="38" fill={G} fillOpacity={0.08} />
        <path d="M52 70 L52 48 L108 48 L108 70 L80 88 Z" fill="none" stroke={G} strokeWidth={1.5} />
        <path d="M68 48 V38 h24 v10" fill="none" stroke={G} strokeWidth={1.5} />
        <circle cx="80" cy="64" r="4" fill={GOLD} />
        <line x1="56" y1="102" x2="72" y2="102" stroke={GOLD} strokeWidth={1} />
        <line x1="88" y1="102" x2="104" y2="102" stroke={GOLD} strokeWidth={1} />
      </svg>
    </div>
  )
}

export function IllustrationLandlord({ className, ...rest }: P) {
  return (
    <div className={cn('nb-illustrations flex h-full w-full items-center justify-center', className)} aria-hidden={rest['aria-hidden'] ?? true}>
      <svg viewBox="0 0 160 120" className="h-[120px] w-[160px] max-w-full" xmlns="http://www.w3.org/2000/svg">
        <rect x="28" y="36" width="56" height="64" rx="6" fill={PAPER} fillOpacity={0.95} stroke={BORDER} strokeWidth={0.75} />
        <rect x="38" y="48" width="36" height="44" rx="4" fill="none" stroke={G} strokeWidth={1.5} />
        <rect x="44" y="56" width="8" height="8" rx="1" fill={G} fillOpacity={0.25} />
        <rect x="60" y="56" width="8" height="8" rx="1" fill={G} fillOpacity={0.25} />
        <rect x="76" y="56" width="8" height="8" rx="1" fill={G} fillOpacity={0.25} />
        <line x1="94" y1="58" x2="118" y2="58" stroke={GOLD} strokeWidth={0.9} />
        <circle cx="128" cy="50" r="14" fill="none" stroke={GOLD} strokeWidth={1} />
        <path d="M122 50 l4 4 l8 -8" fill="none" stroke={GOLD} strokeWidth={1.2} strokeLinecap="round" />
      </svg>
    </div>
  )
}

export function IllustrationHost({ className, ...rest }: P) {
  return (
    <div className={cn('nb-illustrations flex h-full w-full items-center justify-center', className)} aria-hidden={rest['aria-hidden'] ?? true}>
      <svg viewBox="0 0 160 120" className="h-[120px] w-[160px] max-w-full" xmlns="http://www.w3.org/2000/svg">
        <rect x="68" y="44" width="36" height="28" rx="6" fill={GOLD} fillOpacity={0.35} stroke={GOLD} strokeWidth={1} />
        {[
          { x: 36, o: 0.75 },
          { x: 80, o: 0.85 },
          { x: 124, o: 0.55 },
        ].map((p, i) => (
          <g key={i} opacity={p.o}>
            <circle cx={p.x} cy="32" r="8" fill={G} />
            <path d={`M${p.x - 6} 44 L${p.x + 6} 44 L${p.x + 4} 58 L${p.x - 4} 58 Z`} fill={G} />
            <line
              x1={p.x}
              y1="44"
              x2="86"
              y2="56"
              stroke={GOLD}
              strokeWidth={0.75}
              strokeLinecap="round"
            />
          </g>
        ))}
      </svg>
    </div>
  )
}

export function IllustrationNewToCity({ className, ...rest }: P) {
  return (
    <div className={cn('nb-illustrations flex h-full w-full items-center justify-center', className)} aria-hidden={rest['aria-hidden'] ?? true}>
      <svg viewBox="0 0 160 120" className="h-[120px] w-[160px] max-w-full" xmlns="http://www.w3.org/2000/svg">
        <path d="M10 90 Q 40 70 80 85 T 150 75" fill="none" stroke={BORDER} strokeWidth={0.5} />
        <path d="M20 100 Q 60 60 100 78 T 145 55" fill="none" stroke={BORDER} strokeWidth={0.5} opacity={0.8} />
        <path d="M 24 96 Q 70 72 118 62 T 140 40" fill="none" stroke={GOLD} strokeWidth={1.2} strokeLinecap="round" />
        <circle cx="118" cy="62" r="5" fill={GOLD} />
        <circle cx="48" cy="68" r="9" fill={G} fillOpacity={0.75} />
        <path d="M48 60 v14 M42 66 h12" stroke={PAPER} strokeWidth={1.2} strokeLinecap="round" />
      </svg>
    </div>
  )
}

export function NeighborhoodClosingOrnament({ className, 'aria-hidden': ah = true }: P) {
  return (
    <div className={cn('nb-illustrations mt-10 flex justify-center', className)} aria-hidden={ah}>
      <svg viewBox="0 0 160 24" className="h-6 w-40" xmlns="http://www.w3.org/2000/svg">
        <line x1="8" y1="12" x2="152" y2="12" stroke={GOLD} strokeWidth={1} />
        {[
          { x: 32, c: false },
          { x: 80, c: true },
          { x: 128, c: false },
        ].map((d) => (
          <path
            key={d.x}
            d={`M${d.x} 8 l4 4 -4 4 -4 -4 Z`}
            fill={GOLD}
            className={d.c ? 'nb-ornament-center' : undefined}
          />
        ))}
      </svg>
    </div>
  )
}
