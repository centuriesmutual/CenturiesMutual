import { cn } from '@/lib/utils'

const GREEN = '#14432A'
const GOLD = '#C9A53E'
const PAPER = '#FAFCFB'
const BORDER = '#E8EBEA'
const GRAY = '#55655D'

type Props = { className?: string; 'aria-hidden'?: boolean }

/* Roommate Matching — replaces RoommateMatchingDashboardImmersive */
export function RoommateMatchingIllustration({ className, 'aria-hidden': ah = true }: Props) {
  return (
    <div className={cn('nb-illustrations w-full', className)}>
      <svg viewBox="0 0 600 400" className="h-auto w-full" role="img" aria-hidden={ah} xmlns="http://www.w3.org/2000/svg">
        <defs>
          <filter id="hi-card-shadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="2" stdDeviation="6" floodColor="#0F3D2E" floodOpacity="0.10" />
          </filter>
        </defs>

        {/* topographic field */}
        <path d="M0 320 Q200 308 420 320 T600 314" fill="none" stroke={BORDER} strokeWidth={0.5} opacity={0.7} />
        <path d="M0 260 Q220 248 420 264 T600 252" fill="none" stroke={BORDER} strokeWidth={0.5} opacity={0.55} />
        <path d="M0 200 Q180 188 380 202 T600 188" fill="none" stroke={BORDER} strokeWidth={0.5} opacity={0.4} />

        {/* connection arc */}
        <path
          d="M 165 200 Q 300 110 435 200"
          fill="none"
          stroke={GOLD}
          strokeWidth={1.5}
          strokeLinecap="round"
          strokeDasharray="160 320"
          className="nb-dash-flow-slow"
        />

        {/* left figure */}
        <g transform="translate(120,170)">
          <circle cx="0" cy="0" r="22" fill={GREEN} fillOpacity={0.9} />
          <path d="M-26 30 L26 30 L20 76 L-20 76 Z" fill={GREEN} fillOpacity={0.85} />
        </g>

        {/* right figure */}
        <g transform="translate(480,170)">
          <circle cx="0" cy="0" r="22" fill={GREEN} fillOpacity={0.7} />
          <path d="M-26 30 L26 30 L20 76 L-20 76 Z" fill={GREEN} fillOpacity={0.65} />
        </g>

        {/* center match medallion */}
        <g transform="translate(300,150)" className="nb-pin-pulse">
          <circle r="34" fill={PAPER} stroke={GREEN} strokeWidth={1.5} filter="url(#hi-card-shadow)" />
          <circle r="20" fill="none" stroke={GOLD} strokeWidth={1} />
          <text
            x="0"
            y="6"
            textAnchor="middle"
            fontFamily="'Playfair Display', Georgia, serif"
            fontSize="16"
            fill={GREEN}
            fontWeight={600}
          >
            98%
          </text>
          <circle cx="22" cy="-22" r="3.5" fill={GOLD} />
        </g>

        {/* compatibility floor cards */}
        <g className="nb-float-1">
          <rect x="60" y="280" width="160" height="64" rx="10" fill={PAPER} stroke={BORDER} strokeWidth={1} filter="url(#hi-card-shadow)" />
          <circle cx="86" cy="312" r="12" fill={GREEN} fillOpacity={0.85} />
          <rect x="106" y="298" width="86" height="6" rx="2" fill={GREEN} fillOpacity={0.65} />
          <rect x="106" y="312" width="60" height="5" rx="2" fill={GRAY} opacity={0.55} />
          <rect x="106" y="324" width="44" height="5" rx="2" fill={GOLD} opacity={0.85} />
        </g>

        <g className="nb-float-2">
          <rect x="380" y="280" width="160" height="64" rx="10" fill={PAPER} stroke={BORDER} strokeWidth={1} filter="url(#hi-card-shadow)" />
          <circle cx="406" cy="312" r="12" fill={GREEN} fillOpacity={0.7} />
          <rect x="426" y="298" width="86" height="6" rx="2" fill={GREEN} fillOpacity={0.55} />
          <rect x="426" y="312" width="60" height="5" rx="2" fill={GRAY} opacity={0.55} />
          <rect x="426" y="324" width="44" height="5" rx="2" fill={GOLD} opacity={0.85} />
        </g>

        {/* trust seal */}
        <g transform="translate(300,330)" className="nb-seal-pulse">
          <circle r="14" fill={PAPER} stroke={GOLD} strokeWidth={1} />
          <circle r="8" fill="none" stroke={GOLD} strokeWidth={0.75} />
          <path d="M-4 0 L-1 3 L5 -4" fill="none" stroke={GREEN} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
        </g>
      </svg>
    </div>
  )
}

/* Social Network — replaces CommunicationDashboardImmersive */
export function SocialNetworkIllustration({ className, 'aria-hidden': ah = true }: Props) {
  const nodes: { x: number; y: number; r: number; opacity: number }[] = [
    { x: 110, y: 120, r: 18, opacity: 0.85 },
    { x: 480, y: 100, r: 16, opacity: 0.7 },
    { x: 130, y: 290, r: 14, opacity: 0.6 },
    { x: 470, y: 300, r: 18, opacity: 0.8 },
    { x: 230, y: 80, r: 12, opacity: 0.55 },
    { x: 360, y: 320, r: 12, opacity: 0.5 },
  ]
  return (
    <div className={cn('nb-illustrations w-full', className)}>
      <svg viewBox="0 0 600 400" className="h-auto w-full" role="img" aria-hidden={ah} xmlns="http://www.w3.org/2000/svg">
        <defs>
          <filter id="hi-soft" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="2" stdDeviation="5" floodColor="#0F3D2E" floodOpacity="0.10" />
          </filter>
        </defs>

        {/* atmospheric rings */}
        <circle cx="300" cy="200" r="170" fill="none" stroke={BORDER} strokeWidth={0.5} />
        <circle cx="300" cy="200" r="120" fill="none" stroke={BORDER} strokeWidth={0.5} />
        <circle cx="300" cy="200" r="70" fill="none" stroke={BORDER} strokeWidth={0.5} />

        {/* connection lines */}
        {nodes.map((n, i) => (
          <line
            key={`line-${i}`}
            x1="300"
            y1="200"
            x2={n.x}
            y2={n.y}
            stroke={GOLD}
            strokeWidth={1}
            strokeLinecap="round"
            opacity={0.6}
            strokeDasharray="40 24"
            className="nb-dash-flow-slow"
          />
        ))}

        {/* outer nodes */}
        {nodes.map((n, i) => (
          <g key={`node-${i}`} className={cn(i % 3 === 0 && 'nb-float-1', i % 3 === 1 && 'nb-float-2', i % 3 === 2 && 'nb-float-3')} style={{ transformBox: 'fill-box', transformOrigin: 'center' }}>
            <circle cx={n.x} cy={n.y} r={n.r + 4} fill={PAPER} stroke={GREEN} strokeWidth={1} opacity={0.95} />
            <circle cx={n.x} cy={n.y} r={n.r} fill={GREEN} opacity={n.opacity} />
          </g>
        ))}

        {/* center "you" node */}
        <g className="nb-pin-pulse">
          <circle cx="300" cy="200" r="34" fill={PAPER} stroke={GOLD} strokeWidth={1.5} filter="url(#hi-soft)" />
          <circle cx="300" cy="200" r="22" fill={GREEN} />
          <circle cx="316" cy="186" r="4" fill={GOLD} />
        </g>

        {/* chat bubble accent */}
        <g transform="translate(420,150)">
          <rect x="0" y="0" width="80" height="36" rx="10" fill={PAPER} stroke={BORDER} strokeWidth={1} filter="url(#hi-soft)" />
          <path d="M14 36 L20 46 L24 36 Z" fill={PAPER} stroke={BORDER} strokeWidth={1} />
          <circle cx="22" cy="18" r="2.5" fill={GREEN} />
          <circle cx="34" cy="18" r="2.5" fill={GREEN} fillOpacity={0.7} />
          <circle cx="46" cy="18" r="2.5" fill={GREEN} fillOpacity={0.45} />
          <circle cx="64" cy="10" r="3" fill={GOLD} />
        </g>
      </svg>
    </div>
  )
}

/* Smart Home Security — replaces SecuritySystemDashboardImmersive */
export function SmartHomeSecurityIllustration({ className, 'aria-hidden': ah = true }: Props) {
  return (
    <div className={cn('nb-illustrations w-full', className)}>
      <svg viewBox="0 0 600 400" className="h-auto w-full" role="img" aria-hidden={ah} xmlns="http://www.w3.org/2000/svg">
        <defs>
          <filter id="hi-house-shadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="3" stdDeviation="6" floodColor="#0F3D2E" floodOpacity="0.12" />
          </filter>
        </defs>

        {/* protection rings */}
        <circle cx="300" cy="220" r="170" fill="none" stroke={GOLD} strokeWidth={0.75} opacity={0.35} />
        <circle cx="300" cy="220" r="130" fill="none" stroke={GOLD} strokeWidth={0.75} opacity={0.25} className="nb-ring-pulse" />
        <circle cx="300" cy="220" r="92" fill="none" stroke={BORDER} strokeWidth={0.5} />

        {/* sensor dots around perimeter */}
        {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => {
          const angle = (i / 8) * Math.PI * 2 - Math.PI / 2
          const cx = 300 + 170 * Math.cos(angle)
          const cy = 220 + 170 * Math.sin(angle)
          return <circle key={i} cx={cx} cy={cy} r="3.5" fill={GOLD} className={cn('nb-dot-pulse')} style={{ animationDelay: `${(i % 4) * 0.5}s` }} />
        })}

        {/* House outline (architectural) */}
        <g filter="url(#hi-house-shadow)">
          <rect x="225" y="200" width="150" height="110" rx="3" fill={PAPER} stroke={GREEN} strokeWidth={1.5} />
          <path d="M215 200 L300 138 L385 200" fill={PAPER} stroke={GREEN} strokeWidth={1.5} strokeLinejoin="round" />
          <rect x="285" y="240" width="30" height="70" fill={GREEN} fillOpacity={0.85} rx="2" />
          <rect x="245" y="220" width="22" height="22" rx="2" fill="none" stroke={GREEN} strokeWidth={1.25} />
          <line x1="256" y1="220" x2="256" y2="242" stroke={GREEN} strokeWidth={0.75} />
          <line x1="245" y1="231" x2="267" y2="231" stroke={GREEN} strokeWidth={0.75} />
          <rect x="333" y="220" width="22" height="22" rx="2" fill="none" stroke={GREEN} strokeWidth={1.25} />
          <line x1="344" y1="220" x2="344" y2="242" stroke={GREEN} strokeWidth={0.75} />
          <line x1="333" y1="231" x2="355" y2="231" stroke={GREEN} strokeWidth={0.75} />
        </g>

        {/* lock seal at top-right */}
        <g transform="translate(380,150)" className="nb-seal-pulse">
          <circle r="22" fill={PAPER} stroke={GOLD} strokeWidth={1.5} />
          <rect x="-8" y="-3" width="16" height="14" rx="2" fill={GREEN} />
          <path d="M-5 -3 V-8 a5 5 0 0 1 10 0 V-3" fill="none" stroke={GREEN} strokeWidth={1.5} />
        </g>

        {/* alert chip */}
        <g transform="translate(420,300)">
          <rect x="0" y="0" width="120" height="36" rx="18" fill={PAPER} stroke={BORDER} strokeWidth={1} />
          <circle cx="20" cy="18" r="4" fill={GOLD} className="nb-pin-pulse" />
          <rect x="34" y="13" width="70" height="5" rx="2" fill={GREEN} fillOpacity={0.7} />
          <rect x="34" y="22" width="50" height="4" rx="2" fill={GRAY} opacity={0.55} />
        </g>
      </svg>
    </div>
  )
}

/* eDocument System — replaces EDocumentDashboardImmersive */
export function EDocumentSystemIllustration({ className, 'aria-hidden': ah = true }: Props) {
  return (
    <div className={cn('nb-illustrations w-full', className)}>
      <svg viewBox="0 0 600 400" className="h-auto w-full" role="img" aria-hidden={ah} xmlns="http://www.w3.org/2000/svg">
        <defs>
          <filter id="hi-doc-shadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="3" stdDeviation="8" floodColor="#0F3D2E" floodOpacity="0.12" />
          </filter>
        </defs>

        {/* fanned documents */}
        <g transform="translate(300,200)">
          <g transform="rotate(-8) translate(-110,-130)" className="nb-float-3">
            <rect width="220" height="260" rx="6" fill={PAPER} stroke={GREEN} strokeWidth={1} filter="url(#hi-doc-shadow)" />
            <line x1="22" y1="42" x2="170" y2="42" stroke={GOLD} strokeWidth={1} />
            <line x1="22" y1="62" x2="160" y2="62" stroke={GRAY} strokeWidth={0.5} opacity={0.5} />
            <line x1="22" y1="76" x2="190" y2="76" stroke={GRAY} strokeWidth={0.5} opacity={0.5} />
            <line x1="22" y1="90" x2="150" y2="90" stroke={GRAY} strokeWidth={0.5} opacity={0.5} />
            <line x1="22" y1="118" x2="180" y2="118" stroke={GRAY} strokeWidth={0.5} opacity={0.45} />
            <line x1="22" y1="132" x2="160" y2="132" stroke={GRAY} strokeWidth={0.5} opacity={0.45} />
          </g>

          <g transform="rotate(6) translate(-110,-130)" className="nb-float-1">
            <rect width="220" height="260" rx="6" fill={PAPER} stroke={GREEN} strokeWidth={1} filter="url(#hi-doc-shadow)" />
            <line x1="22" y1="42" x2="170" y2="42" stroke={GOLD} strokeWidth={1} />
            <line x1="22" y1="62" x2="160" y2="62" stroke={GRAY} strokeWidth={0.5} opacity={0.5} />
            <line x1="22" y1="76" x2="190" y2="76" stroke={GRAY} strokeWidth={0.5} opacity={0.5} />
            <line x1="22" y1="90" x2="150" y2="90" stroke={GRAY} strokeWidth={0.5} opacity={0.5} />
            <line x1="22" y1="120" x2="180" y2="120" stroke={GRAY} strokeWidth={0.5} opacity={0.45} />
            <g transform="translate(180,30)">
              <circle r="10" fill={PAPER} stroke={GOLD} strokeWidth={1} />
              <circle r="5" fill="none" stroke={GOLD} strokeWidth={0.5} />
              <path d="M-2 0 L0 2 L4 -3" fill="none" stroke={GREEN} strokeWidth={1.25} strokeLinecap="round" strokeLinejoin="round" />
            </g>
          </g>

          <g transform="translate(-110,-130)">
            <rect width="220" height="260" rx="6" fill={PAPER} stroke={GREEN} strokeWidth={1.5} filter="url(#hi-doc-shadow)" />
            <line x1="22" y1="42" x2="170" y2="42" stroke={GOLD} strokeWidth={1.25} />
            <line x1="22" y1="60" x2="160" y2="60" stroke={GRAY} strokeWidth={0.5} opacity={0.55} />
            <line x1="22" y1="74" x2="190" y2="74" stroke={GRAY} strokeWidth={0.5} opacity={0.55} />
            <line x1="22" y1="88" x2="150" y2="88" stroke={GRAY} strokeWidth={0.5} opacity={0.55} />
            <line x1="22" y1="102" x2="180" y2="102" stroke={GRAY} strokeWidth={0.5} opacity={0.55} />
            <line x1="22" y1="116" x2="160" y2="116" stroke={GRAY} strokeWidth={0.5} opacity={0.55} />

            {/* signature row */}
            <line x1="22" y1="180" x2="120" y2="180" stroke={GREEN} strokeWidth={1.25} />
            <text x="22" y="196" fontFamily="'Playfair Display', Georgia, serif" fontSize="12" fill={GREEN} fontStyle="italic">
              C. Mutual
            </text>

            {/* checks */}
            <g transform="translate(160,170)">
              <rect width="40" height="20" rx="4" fill={GREEN} />
              <path d="M8 10 L13 14 L26 5" fill="none" stroke={GOLD} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
            </g>

            {/* gold seal */}
            <g transform="translate(180,30)" className="nb-seal-pulse">
              <circle r="16" fill={PAPER} stroke={GOLD} strokeWidth={1.25} />
              <circle r="8" fill="none" stroke={GOLD} strokeWidth={0.75} />
              <path d="M0 -3 L3 0 L0 3 L-3 0 Z" fill={GOLD} />
              {[0, 1, 2, 3].map((i) => (
                <line
                  key={i}
                  x1="0"
                  y1="-13"
                  x2="0"
                  y2="-18"
                  stroke={GOLD}
                  strokeWidth={1}
                  strokeLinecap="round"
                  transform={`rotate(${i * 90})`}
                />
              ))}
            </g>
          </g>
        </g>

        {/* timeline strip below */}
        <g transform="translate(120,360)">
          <line x1="0" y1="0" x2="360" y2="0" stroke={GOLD} strokeWidth={1} strokeDasharray="80 40" className="nb-dash-flow-slow" />
          {[0, 1, 2, 3].map((i) => (
            <g key={i} transform={`translate(${i * 120},0)`}>
              <circle r="6" fill={PAPER} stroke={GOLD} strokeWidth={1} />
              <circle r="2.5" fill={GOLD} />
            </g>
          ))}
        </g>
      </svg>
    </div>
  )
}

/* Hero/banner ornament for "A Legacy of Trust" — replaces deer.jpeg */
export function LegacyOfTrustIllustration({ className, 'aria-hidden': ah = true }: Props) {
  return (
    <div className={cn('nb-illustrations w-full', className)}>
      <svg viewBox="0 0 600 480" className="h-auto w-full" role="img" aria-hidden={ah} xmlns="http://www.w3.org/2000/svg">
        <defs>
          <filter id="hi-leg-shadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="3" stdDeviation="8" floodColor="#0F3D2E" floodOpacity="0.12" />
          </filter>
        </defs>

        {/* horizon contours */}
        <path d="M0 380 Q200 360 420 380 T600 372" fill="none" stroke={BORDER} strokeWidth={0.75} />
        <path d="M0 320 Q220 304 420 322 T600 308" fill="none" stroke={BORDER} strokeWidth={0.5} opacity={0.7} />
        <path d="M0 260 Q200 244 400 260 T600 248" fill="none" stroke={BORDER} strokeWidth={0.5} opacity={0.5} />

        {/* central monogram column */}
        <g transform="translate(300,240)" filter="url(#hi-leg-shadow)">
          <rect x="-90" y="-130" width="180" height="260" rx="10" fill={PAPER} stroke={GREEN} strokeWidth={1.5} />
          <line x1="-66" y1="-100" x2="66" y2="-100" stroke={GOLD} strokeWidth={1} />
          <text
            x="0"
            y="-72"
            textAnchor="middle"
            fontFamily="'Playfair Display', Georgia, serif"
            fontSize="14"
            fill={GREEN}
            fontWeight={500}
            letterSpacing="0.18em"
          >
            CENTURIES
          </text>
          <text
            x="0"
            y="-54"
            textAnchor="middle"
            fontFamily="'Playfair Display', Georgia, serif"
            fontSize="14"
            fill={GREEN}
            fontWeight={500}
            letterSpacing="0.18em"
          >
            MUTUAL
          </text>

          {/* wreath / monogram */}
          <g transform="translate(0,-6)">
            <circle r="44" fill="none" stroke={GOLD} strokeWidth={1} />
            <circle r="32" fill="none" stroke={GREEN} strokeWidth={1} opacity={0.7} />
            <text
              x="0"
              y="6"
              textAnchor="middle"
              fontFamily="'Playfair Display', Georgia, serif"
              fontSize="34"
              fill={GREEN}
              fontWeight={600}
            >
              CM
            </text>
            <path d="M0 -34 L3 -30 L0 -26 L-3 -30 Z" fill={GOLD} />
            <path d="M0 26 L3 30 L0 34 L-3 30 Z" fill={GOLD} />
            <path d="M-34 0 L-30 -3 L-26 0 L-30 3 Z" fill={GOLD} />
            <path d="M34 0 L30 -3 L26 0 L30 3 Z" fill={GOLD} />
          </g>

          <line x1="-66" y1="64" x2="66" y2="64" stroke={GOLD} strokeWidth={1} />
          <text
            x="0"
            y="92"
            textAnchor="middle"
            fontFamily="'Playfair Display', Georgia, serif"
            fontSize="20"
            fontWeight={500}
            fill={GREEN}
          >
            Est. 2024
          </text>
        </g>

        {/* flanking ornament dots */}
        {[140, 180, 220].map((y, i) => (
          <circle key={`l-${y}`} cx={120} cy={y} r="3" fill={GOLD} opacity={0.4 + i * 0.15} />
        ))}
        {[260, 300, 340].map((y, i) => (
          <circle key={`r-${y}`} cx={480} cy={y} r="3" fill={GOLD} opacity={0.7 - i * 0.15} />
        ))}

        {/* closing diamonds */}
        <g transform="translate(220,440)">
          <line x1="0" y1="0" x2="160" y2="0" stroke={GOLD} strokeWidth={1} />
          <path d="M0 -4 L5 0 L0 4 L-5 0 Z" fill={GOLD} />
          <path d="M80 -5 L86 0 L80 5 L74 0 Z" fill={GOLD} className="nb-ornament-center" />
          <path d="M160 -4 L165 0 L160 4 L155 0 Z" fill={GOLD} />
        </g>
      </svg>
    </div>
  )
}
