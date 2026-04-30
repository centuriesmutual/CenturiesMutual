'use client'

import { useEffect, useRef, useState } from 'react'
import { AgreementGoldSeal } from '@/components/illustrations/neighborhood-agreements'

const GOLD = '#C9A53E'

export function LeaseAgreementPanelHeader() {
  const ref = useRef<HTMLDivElement>(null)
  const [w, setW] = useState(220)
  const [draw, setDraw] = useState(false)
  const [lineDrawn, setLineDrawn] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e?.isIntersecting) setDraw(true)
      },
      { threshold: 0.15 },
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  useEffect(() => {
    if (!draw) return
    const reduced =
      typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduced) {
      setLineDrawn(true)
      return
    }
    let id2 = 0
    const id1 = requestAnimationFrame(() => {
      id2 = requestAnimationFrame(() => setLineDrawn(true))
    })
    return () => {
      cancelAnimationFrame(id1)
      cancelAnimationFrame(id2)
    }
  }, [draw])

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const ro = new ResizeObserver(() => setW(Math.max(120, el.clientWidth - 36)))
    ro.observe(el)
    setW(Math.max(120, el.clientWidth - 36))
    return () => ro.disconnect()
  }, [])

  const reduced =
    typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
  const len = Math.max(w, 120)
  const offset = lineDrawn || reduced ? 0 : len

  return (
    <div ref={ref} className="relative flex flex-col bg-[#14432A] px-4 py-3 pr-14">
      <AgreementGoldSeal className="absolute right-2.5 top-2.5" />
      <span className="font-sans text-[11px] font-semibold uppercase tracking-[0.15em] text-[#FAFCFB]/95">Lease Agreement</span>
      <svg
        width="100%"
        height="8"
        viewBox={`0 0 ${len} 2`}
        preserveAspectRatio="none"
        className="nb-illustrations mt-1 max-w-[calc(100%-2rem)]"
        aria-hidden
        xmlns="http://www.w3.org/2000/svg"
      >
        <line
          x1="0"
          y1="1"
          x2={len}
          y2="1"
          stroke={GOLD}
          strokeWidth={1}
          vectorEffect="non-scaling-stroke"
          strokeDasharray={len}
          strokeDashoffset={offset}
          style={reduced ? undefined : { transition: 'stroke-dashoffset 0.6s ease-out' }}
        />
      </svg>
    </div>
  )
}
