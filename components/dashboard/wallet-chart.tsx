'use client'

import { useMemo, useRef, useState } from 'react'

export type ChartRange = '1D' | '1W' | '1M' | '3M' | '1Y' | 'ALL'

export const CHART_RANGES: ReadonlyArray<ChartRange> = ['1D', '1W', '1M', '3M', '1Y', 'ALL']

const RANGE_POINTS: Record<ChartRange, number> = {
  '1D': 78,
  '1W': 84,
  '1M': 90,
  '3M': 96,
  '1Y': 104,
  ALL: 120,
}

const RANGE_SPREAD: Record<ChartRange, number> = {
  '1D': 0.006,
  '1W': 0.014,
  '1M': 0.03,
  '3M': 0.06,
  '1Y': 0.14,
  ALL: 0.42,
}

/** Deterministic pseudo-random walk so the chart is stable across renders. */
function generateSeries(range: ChartRange, endValue: number): number[] {
  const count = RANGE_POINTS[range]
  if (endValue === 0) {
    return Array.from({ length: count }, () => 0)
  }

  const spread = RANGE_SPREAD[range]
  const start = endValue * (1 - spread)
  const out: number[] = []
  let seed = range.charCodeAt(0) * 7 + count * 131

  const rand = () => {
    seed = (seed * 9301 + 49297) % 233280
    return seed / 233280 - 0.5
  }

  for (let i = 0; i < count; i++) {
    const t = i / (count - 1)
    const trend = start + (endValue - start) * t
    const wobble =
      Math.sin(t * Math.PI * 3.1 + seed * 0.001) * endValue * spread * 0.16 +
      rand() * endValue * spread * 0.12
    out.push(Math.max(0, trend + wobble))
  }
  out[out.length - 1] = endValue
  return out
}

export function WalletChart({
  endValue,
  onHoverValue,
}: {
  endValue: number
  onHoverValue?: (value: number | null) => void
}) {
  const [range, setRange] = useState<ChartRange>('1M')
  const [hoverIndex, setHoverIndex] = useState<number | null>(null)
  const svgRef = useRef<SVGSVGElement>(null)

  const series = useMemo(() => generateSeries(range, endValue), [range, endValue])

  const W = 720
  const H = 220
  const PAD = 8

  const min = Math.min(...series)
  const max = Math.max(...series)
  const span = max - min || 1

  const points = series.map((v, i) => {
    const x = PAD + (i / (series.length - 1)) * (W - PAD * 2)
    const y = PAD + (1 - (v - min) / span) * (H - PAD * 2)
    return [x, y] as const
  })

  const path = points
    .map(([x, y], i) => `${i === 0 ? 'M' : 'L'}${x.toFixed(2)},${y.toFixed(2)}`)
    .join(' ')

  const first = series[0]
  const shownIndex = hoverIndex ?? series.length - 1
  const shown = series[shownIndex]
  const delta = shown - first
  const pct = first === 0 ? 0 : (delta / first) * 100
  const up = delta >= 0

  const startY = points[0][1]

  /** Map pointer X into viewBox space via CTM so the cursor lines up when the SVG is scaled. */
  const handleMove = (clientX: number) => {
    const svg = svgRef.current
    if (!svg) return
    const ctm = svg.getScreenCTM()
    if (!ctm) return
    const point = svg.createSVGPoint()
    point.x = clientX
    point.y = 0
    const { x: relX } = point.matrixTransform(ctm.inverse())
    const idx = Math.round(((relX - PAD) / (W - PAD * 2)) * (series.length - 1))
    const clamped = Math.min(series.length - 1, Math.max(0, idx))
    setHoverIndex(clamped)
    onHoverValue?.(series[clamped])
  }

  const clearHover = () => {
    setHoverIndex(null)
    onHoverValue?.(null)
  }

  return (
    <div>
      <p
        className={`m-0 font-sans text-[0.875rem] font-medium ${
          up ? 'text-[#1F7A4D]' : 'text-[#B3402A]'
        }`}
      >
        {up ? '▲' : '▼'} ${Math.abs(delta).toFixed(2)} ({up ? '+' : '-'}
        {Math.abs(pct).toFixed(2)}%){' '}
        <span className="font-normal text-[#8A958D]">
          {hoverIndex !== null
            ? ''
            : range === '1D'
              ? 'Today'
              : `Past ${range === 'ALL' ? 'all time' : range}`}
        </span>
      </p>

      <svg
        ref={svgRef}
        viewBox={`0 0 ${W} ${H}`}
        preserveAspectRatio="none"
        className="mt-2 block w-full cursor-crosshair select-none"
        style={{ height: 'clamp(150px, 24vw, 220px)' }}
        onMouseMove={(e) => handleMove(e.clientX)}
        onMouseLeave={clearHover}
        onTouchMove={(e) => handleMove(e.touches[0].clientX)}
        onTouchEnd={clearHover}
      >
        <line
          x1={PAD}
          x2={W - PAD}
          y1={startY}
          y2={startY}
          stroke="#8A958D"
          strokeWidth="1"
          strokeDasharray="2 5"
          opacity="0.55"
        />
        <path
          d={path}
          fill="none"
          stroke={up ? '#1F7A4D' : '#B3402A'}
          strokeWidth="2"
          strokeLinejoin="round"
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
        />
        {hoverIndex !== null ? (
          <>
            <line
              x1={points[hoverIndex][0]}
              x2={points[hoverIndex][0]}
              y1={PAD}
              y2={H - PAD}
              stroke="#8A958D"
              strokeWidth="1"
              opacity="0.5"
              vectorEffect="non-scaling-stroke"
            />
            <circle
              cx={points[hoverIndex][0]}
              cy={points[hoverIndex][1]}
              r="4.5"
              fill={up ? '#1F7A4D' : '#B3402A'}
              stroke="#FAFCFB"
              strokeWidth="2"
              vectorEffect="non-scaling-stroke"
            />
          </>
        ) : (
          <circle
            cx={points[points.length - 1][0]}
            cy={points[points.length - 1][1]}
            r="4"
            fill={up ? '#1F7A4D' : '#B3402A'}
            vectorEffect="non-scaling-stroke"
          />
        )}
      </svg>

      <div className="mt-2 flex items-center gap-1 pb-3">
        {CHART_RANGES.map((r) => (
          <button
            key={r}
            type="button"
            onClick={() => {
              setRange(r)
              clearHover()
            }}
            className={`border-0 bg-transparent px-3 py-1 font-sans text-[0.75rem] font-semibold transition ${
              range === r
                ? 'text-[#0F3D2E]'
                : 'text-[#8A958D] hover:text-[#14432A]'
            }`}
          >
            {r}
          </button>
        ))}
      </div>
    </div>
  )
}
