import { cn } from '@/lib/utils'

const G = '#14432A'
const GOLD = '#C9A53E'
const PAPER = '#FAFCFB'

type P = { className?: string; 'aria-hidden'?: boolean }

export function NeighborhoodStepsFlowDesktop({ className, 'aria-hidden': ah = true }: P) {
  const cx = [125, 375, 625, 875]
  return (
    <div className={cn('nb-illustrations mb-8 hidden w-full md:block', className)} aria-hidden={ah}>
      <svg viewBox="0 0 1000 64" className="h-14 w-full max-w-[1000px] mx-auto" xmlns="http://www.w3.org/2000/svg">
        <line
          x1="125"
          y1="32"
          x2="875"
          y2="32"
          stroke={GOLD}
          strokeWidth={1}
          strokeDasharray="6 5"
          strokeDashoffset="0"
          className="nb-dash-flow"
        />
        {cx.map((x, i) => (
          <g key={i}>
            <circle cx={x} cy="32" r="14" fill={PAPER} stroke={GOLD} strokeWidth={1} />
            <text
              x={x}
              y="37"
              textAnchor="middle"
              fill={G}
              fontSize="13"
              fontFamily="Playfair Display, Georgia, serif"
              fontWeight={500}
            >
              {i + 1}
            </text>
          </g>
        ))}
      </svg>
    </div>
  )
}

export function NeighborhoodStepsFlowMobile({ className, 'aria-hidden': ah = true }: P) {
  const cy = [32, 112, 192, 272]
  return (
    <div className={cn('nb-illustrations mb-8 flex justify-center md:hidden', className)} aria-hidden={ah}>
      <svg viewBox="0 0 64 304" className="h-[280px] w-12" xmlns="http://www.w3.org/2000/svg">
        <line
          x1="32"
          y1="32"
          x2="32"
          y2="272"
          stroke={GOLD}
          strokeWidth={1}
          strokeDasharray="6 5"
          strokeDashoffset="0"
          className="nb-dash-flow"
        />
        {cy.map((y, i) => (
          <g key={i}>
            <circle cx="32" cy={y} r="14" fill={PAPER} stroke={GOLD} strokeWidth={1} />
            <text
              x="32"
              y={y + 5}
              textAnchor="middle"
              fill={G}
              fontSize="13"
              fontFamily="Playfair Display, Georgia, serif"
              fontWeight={500}
            >
              {i + 1}
            </text>
          </g>
        ))}
      </svg>
    </div>
  )
}

export function IllustrationStepVerify({ className, ...rest }: P) {
  return (
    <div className={cn('nb-illustrations mx-auto flex justify-center', className)} {...rest}>
      <svg viewBox="0 0 120 72" className="h-16 w-[120px]" xmlns="http://www.w3.org/2000/svg">
        <rect x="18" y="10" width="84" height="52" rx="6" fill={PAPER} stroke={G} strokeWidth={1} />
        <circle cx="86" cy="22" r="10" fill="none" stroke={GOLD} strokeWidth={1.2} />
        <path d="M82 22 l3 3 l6 -8" fill="none" stroke={GOLD} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </div>
  )
}

export function IllustrationStepMatch({ className, ...rest }: P) {
  return (
    <div className={cn('nb-illustrations mx-auto flex justify-center', className)} {...rest}>
      <svg viewBox="0 0 120 72" className="h-16 w-[120px]" xmlns="http://www.w3.org/2000/svg">
        <circle cx="38" cy="36" r="10" fill={G} fillOpacity={0.75} />
        <path d="M32 48 L44 48 L41 58 L35 58 Z" fill={G} fillOpacity={0.75} />
        <circle cx="82" cy="36" r="10" fill={G} fillOpacity={0.75} />
        <path d="M76 48 L88 48 L85 58 L79 58 Z" fill={G} fillOpacity={0.75} />
        <path d="M 48 34 Q 60 22 72 34" fill="none" stroke={GOLD} strokeWidth={1.5} strokeLinecap="round" />
        <path d="M60 26 l2 -4 l2 4 M59 24 h6" stroke={GOLD} strokeWidth={1} strokeLinecap="round" />
      </svg>
    </div>
  )
}

export function IllustrationStepMoveIn({ className, ...rest }: P) {
  return (
    <div className={cn('nb-illustrations mx-auto flex justify-center', className)} {...rest}>
      <svg viewBox="0 0 120 72" className="h-16 w-[120px]" xmlns="http://www.w3.org/2000/svg">
        <rect x="62" y="18" width="40" height="38" rx="4" fill="none" stroke={G} strokeWidth={1.5} opacity={0.45} />
        <rect x="68" y="28" width="8" height="8" rx="1" fill={G} fillOpacity={0.25} />
        <rect x="86" y="28" width="8" height="8" rx="1" fill={G} fillOpacity={0.25} />
        <g transform="translate(28,40) rotate(-30)">
          <circle cx="0" cy="0" r="7" fill="none" stroke={GOLD} strokeWidth={1.5} />
          <rect x="-2" y="6" width="4" height="18" fill={GOLD} />
          <rect x="-5" y="22" width="4" height="3" fill={GOLD} />
          <rect x="1" y="22" width="4" height="3" fill={GOLD} />
        </g>
      </svg>
    </div>
  )
}

export function IllustrationStepBelong({ className, ...rest }: P) {
  return (
    <div className={cn('nb-illustrations mx-auto flex justify-center', className)} {...rest}>
      <svg viewBox="0 0 120 72" className="h-16 w-[120px]" xmlns="http://www.w3.org/2000/svg">
        <circle cx="60" cy="36" r="26" fill="none" stroke={G} strokeWidth={1} opacity={0.35} className="nb-ring-pulse" />
        <circle cx="60" cy="36" r="18" fill="none" stroke={G} strokeWidth={1} opacity={0.45} />
        <circle cx="60" cy="36" r="10" fill="none" stroke={G} strokeWidth={1} opacity={0.55} />
        <circle cx="60" cy="36" r="4" fill={GOLD} />
      </svg>
    </div>
  )
}
