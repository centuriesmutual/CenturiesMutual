import { cn } from '@/lib/utils'

const GREEN = '#14432A'
const GOLD = '#C9A53E'
const PAPER = '#FAFCFB'
const BORDER = '#E8EBEA'

type Props = { className?: string; 'aria-hidden'?: boolean }

/** Corridor map — viewBox 600×400; paper surface via parent CSS */
export function CorridorMapHero({ className, 'aria-hidden': ariaHidden = true }: Props) {
  const buildings: { x: number; y: number; w: number; h: number; rx: number }[] = [
    { x: 40, y: 268, w: 28, h: 38, rx: 4 },
    { x: 78, y: 254, w: 32, h: 52, rx: 4 },
    { x: 118, y: 278, w: 24, h: 32, rx: 3 },
    { x: 155, y: 238, w: 36, h: 62, rx: 5 },
    { x: 200, y: 260, w: 26, h: 40, rx: 3 },
    { x: 240, y: 232, w: 30, h: 58, rx: 4 },
    { x: 285, y: 256, w: 22, h: 34, rx: 3 },
    { x: 320, y: 226, w: 34, h: 54, rx: 4 },
    { x: 365, y: 246, w: 28, h: 44, rx: 4 },
    { x: 405, y: 220, w: 32, h: 60, rx: 5 },
    { x: 448, y: 238, w: 26, h: 42, rx: 3 },
    { x: 485, y: 214, w: 38, h: 56, rx: 5 },
    { x: 532, y: 234, w: 24, h: 36, rx: 3 },
    { x: 95, y: 202, w: 30, h: 48, rx: 4 },
  ]

  const pathD = 'M 55 360 Q 180 310 280 260 T 450 150 T 540 88'

  const anchors = [
    { x: 175, y: 248 },
    { x: 315, y: 198 },
    { x: 470, y: 148 },
  ]

  const pin = { x: 300, y: 175 }

  return (
    <div className={cn('nb-illustrations flex flex-col', className)}>
      <svg
        viewBox="0 0 600 400"
        className="h-auto w-full"
        role="img"
        aria-hidden={ariaHidden}
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <filter id="nb-anchor-shadow" x="-30%" y="-30%" width="160%" height="160%">
            <feDropShadow dx="0" dy="1" stdDeviation="2" floodColor="#14432A" floodOpacity="0.12" />
          </filter>
        </defs>

        <path d="M 0 320 Q 200 315 400 325 T 600 318" fill="none" stroke={BORDER} strokeWidth={0.5} opacity={0.85} />
        <path d="M 0 260 Q 220 250 420 268 T 600 255" fill="none" stroke={BORDER} strokeWidth={0.5} opacity={0.7} />
        <path d="M 0 200 Q 180 190 380 205 T 600 188" fill="none" stroke={BORDER} strokeWidth={0.5} opacity={0.55} />
        <path d="M 0 140 Q 240 130 480 148 T 600 125" fill="none" stroke={BORDER} strokeWidth={0.5} opacity={0.4} />

        {buildings.map((b, i) => (
          <rect key={i} x={b.x} y={b.y} width={b.w} height={b.h} rx={b.rx} fill={GREEN} fillOpacity={0.3} />
        ))}

        <path d={pathD} fill="none" stroke={GOLD} strokeWidth={1.5} strokeLinecap="round" />

        {anchors.map((a, i) => (
          <g
            key={i}
            className={cn('nb-float-1', i === 1 && 'nb-float-2', i === 2 && 'nb-float-3')}
            style={{ transformBox: 'fill-box', transformOrigin: 'center' }}
          >
            <rect
              x={a.x - 22}
              y={a.y - 28}
              width={44}
              height={40}
              rx={6}
              fill={PAPER}
              stroke={GREEN}
              strokeWidth={1}
              filter="url(#nb-anchor-shadow)"
            />
            <circle cx={a.x + 14} cy={a.y - 20} r={3} fill={GOLD} />
          </g>
        ))}

        <g transform={`translate(${pin.x},${pin.y})`} className="nb-pin-pulse">
          <circle r={8} fill={GOLD} />
          <circle r={5.5} fill="none" stroke={PAPER} strokeWidth={1} />
        </g>
      </svg>

      <div className="mt-3 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 border-t border-[#E8EBEA]/90 px-2 pt-3">
        <span className="flex items-center gap-2 font-sans text-[0.6875rem] text-[#55655D]">
          <svg width="10" height="10" viewBox="0 0 10 10" aria-hidden className="shrink-0">
            <rect x="0.5" y="0.5" width="9" height="9" fill="none" stroke={GOLD} strokeWidth={0.5} />
          </svg>
          Corridor path
        </span>
        <span className="flex items-center gap-2 font-sans text-[0.6875rem] text-[#55655D]">
          <svg width="14" height="10" viewBox="0 0 14 10" aria-hidden className="shrink-0">
            <rect x="0.5" y="0.5" width="13" height="9" rx="2" fill="none" stroke={GREEN} strokeWidth={1} />
          </svg>
          Verified home
        </span>
        <span className="flex items-center gap-2 font-sans text-[0.6875rem] text-[#55655D]">
          <svg width="10" height="10" viewBox="0 0 10 10" aria-hidden className="shrink-0">
            <circle cx="5" cy="5" r="3.5" fill={GOLD} />
          </svg>
          Your location
        </span>
      </div>
    </div>
  )
}
