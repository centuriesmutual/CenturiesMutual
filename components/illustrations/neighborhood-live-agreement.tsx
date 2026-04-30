import { cn } from '@/lib/utils'

const G = '#14432A'
const GOLD = '#C9A53E'

type P = { className?: string; 'aria-hidden'?: boolean }

export function IllustrationKnowsWhatsDue({ className, ...rest }: P) {
  return (
    <div className={cn('nb-illustrations mx-auto flex justify-center', className)} aria-hidden={rest['aria-hidden'] ?? true}>
      <svg viewBox="0 0 120 80" className="h-20 w-[120px] max-w-full sm:h-[80px]" xmlns="http://www.w3.org/2000/svg">
        <g className="nb-dot-pulse">
          <circle cx="60" cy="14" r="3" fill={GOLD} />
        </g>
        {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((i) => {
          const r = Math.floor(i / 4)
          const c = i % 4
          const cx = 28 + c * 16
          const cy = 32 + r * 14
          const on = i === 7
          return (
            <rect
              key={i}
              x={cx - 5}
              y={cy - 5}
              width="10"
              height="10"
              rx="1.5"
              fill={G}
              fillOpacity={on ? 0.5 : 0.18}
              stroke="none"
            />
          )
        })}
        {(() => {
          const cx = 28 + 3 * 16
          const cy = 32 + 1 * 14
          return <circle cx={cx} cy={cy} r="6" fill={GOLD} fillOpacity={0.35} />
        })()}
      </svg>
    </div>
  )
}

export function IllustrationTriggersAction({ className, ...rest }: P) {
  return (
    <div className={cn('nb-illustrations mx-auto flex justify-center', className)} aria-hidden={rest['aria-hidden'] ?? true}>
      <svg viewBox="0 0 120 80" className="h-20 w-[120px] max-w-full sm:h-[80px]" xmlns="http://www.w3.org/2000/svg">
        <circle cx="60" cy="42" r="22" fill={G} fillOpacity={0.14} className="nb-green-soft-pulse" />
        <path
          d="M58 22 L52 38 h6 l-4 16 8 -12 h-6 l6 -20 z"
          fill={GOLD}
          stroke={GOLD}
          strokeWidth={0.5}
          strokeLinejoin="round"
        />
      </svg>
    </div>
  )
}

export function IllustrationRecordsEveryStep({ className, ...rest }: P) {
  return (
    <div className={cn('nb-illustrations mx-auto flex justify-center', className)} aria-hidden={rest['aria-hidden'] ?? true}>
      <svg viewBox="0 0 120 80" className="h-20 w-[120px] max-w-full sm:h-[80px]" xmlns="http://www.w3.org/2000/svg">
        <g>
          <circle cx="26" cy="26" r="2.5" fill={GOLD} />
          <line x1="34" y1="26" x2="92" y2="26" stroke={G} strokeWidth={1.5} strokeLinecap="round" />
        </g>
        <g>
          <circle cx="28" cy="42" r="2.5" fill={GOLD} />
          <line x1="36" y1="42" x2="88" y2="42" stroke={G} strokeWidth={1.5} strokeLinecap="round" />
        </g>
        <g>
          <circle cx="30" cy="58" r="2.5" fill={GOLD} />
          <line x1="38" y1="58" x2="94" y2="58" stroke={G} strokeWidth={1.5} strokeLinecap="round" />
        </g>
      </svg>
    </div>
  )
}

export function IllustrationResolvesDisputes({ className, ...rest }: P) {
  return (
    <div className={cn('nb-illustrations mx-auto flex justify-center', className)} aria-hidden={rest['aria-hidden'] ?? true}>
      <svg viewBox="0 0 120 80" className="h-20 w-[120px] max-w-full sm:h-[80px]" xmlns="http://www.w3.org/2000/svg">
        <line x1="60" y1="18" x2="60" y2="58" stroke={GOLD} strokeWidth={1.5} strokeLinecap="round" />
        <line x1="42" y1="32" x2="78" y2="32" stroke={G} strokeWidth={1.2} strokeLinecap="round" />
        <line x1="38" y1="38" x2="46" y2="48" stroke={G} strokeWidth={1.2} strokeLinecap="round" />
        <line x1="82" y1="38" x2="74" y2="48" stroke={G} strokeWidth={1.2} strokeLinecap="round" />
        <rect x="34" y="50" width="14" height="10" rx="1" fill={G} fillOpacity={0.35} className="nb-scale-pan-l" />
        <rect x="72" y="50" width="14" height="10" rx="1" fill={G} fillOpacity={0.35} className="nb-scale-pan-r" />
        <circle cx="41" cy="54" r="1.5" fill={GOLD} />
        <circle cx="79" cy="54" r="1.5" fill={GOLD} />
      </svg>
    </div>
  )
}
