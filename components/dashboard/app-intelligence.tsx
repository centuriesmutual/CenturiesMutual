'use client'

import Link from 'next/link'
import type { ReactNode } from 'react'
import { LockClosedIcon } from '@heroicons/react/24/outline'

const usd = (n: number) =>
  n.toLocaleString('en-US', { style: 'currency', currency: 'USD' })

function LockedBanner({ app }: { app: string }) {
  return (
    <div className="mb-5 flex flex-wrap items-center gap-3 rounded-2xl border border-[#B3402A]/25 bg-[#B3402A]/[0.08] px-4 py-3.5 sm:px-5">
      <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#B3402A]/15 text-[#B3402A]">
        <LockClosedIcon className="h-4 w-4" />
      </span>
      <div className="min-w-0 flex-1">
        <p className="m-0 font-sans text-[0.875rem] font-semibold text-[#14432A]">
          Not logged in to {app}
        </p>
        <p className="mb-0 mt-0.5 font-sans text-[0.75rem] leading-snug text-[#55655D]">
          Sign in to sync live intelligence, earnings, and performance into your membership.
        </p>
      </div>
      <span className="rounded-full bg-[#B3402A]/12 px-2.5 py-1 font-sans text-[0.6875rem] font-semibold uppercase tracking-[0.08em] text-[#B3402A]">
        Offline
      </span>
    </div>
  )
}

function SectionLabel({ children }: { children: ReactNode }) {
  return (
    <p className="m-0 font-sans text-[11px] font-semibold uppercase tracking-[0.22em] text-[#C9A53E]">
      {children}
    </p>
  )
}

function MetricTile({
  label,
  value,
  hint,
}: {
  label: string
  value: string
  hint?: string
}) {
  return (
    <div className="rounded-[12px] bg-white p-4 shadow-[0_1px_0_rgba(20,67,42,0.06)]">
      <p className="m-0 font-sans text-[0.6875rem] font-semibold uppercase tracking-[0.08em] text-[#55655D]">
        {label}
      </p>
      <p className="m-0 mt-1.5 font-sans text-[1.2rem] font-semibold tabular-nums text-[#14432A]">
        {value}
      </p>
      {hint ? (
        <p className="mb-0 mt-1 font-sans text-[0.6875rem] text-[#8A958D]">{hint}</p>
      ) : null}
    </div>
  )
}

function LockedLayer({ children }: { children: ReactNode }) {
  return (
    <div className="relative overflow-hidden rounded-2xl">
      <div className="pointer-events-none select-none blur-[2.5px] opacity-55" aria-hidden>
        {children}
      </div>
      <div className="absolute inset-0 flex items-center justify-center bg-[#FAFCFB]/35 backdrop-blur-[1px]">
        <div className="inline-flex items-center gap-2 rounded-full border border-[#14432A]/15 bg-[#FAFCFB]/95 px-3.5 py-2 font-sans text-[0.75rem] font-semibold text-[#14432A] shadow-sm">
          <LockClosedIcon className="h-3.5 w-3.5 text-[#C9A53E]" />
          Sign in to unlock
        </div>
      </div>
    </div>
  )
}

function SparkBars({
  values,
  color = '#0F3D2E',
}: {
  values: number[]
  color?: string
}) {
  const max = Math.max(...values, 1)
  return (
    <div className="flex h-28 items-end gap-1.5 sm:gap-2">
      {values.map((v, i) => (
        <div key={i} className="flex min-w-0 flex-1 flex-col items-center gap-1.5">
          <div
            className="w-full rounded-t-[4px] bg-[#14432A]/10"
            style={{
              height: `${Math.max(8, (v / max) * 100)}%`,
              backgroundColor: v > 0 ? color : undefined,
              opacity: v > 0 ? 0.35 + (v / max) * 0.65 : 1,
            }}
          />
          <span className="font-sans text-[0.5625rem] font-medium text-[#8A958D]">
            {['M', 'T', 'W', 'T', 'F', 'S', 'S'][i]}
          </span>
        </div>
      ))}
    </div>
  )
}

function TrendLine({ points, stroke = '#0F3D2E' }: { points: number[]; stroke?: string }) {
  const W = 640
  const H = 140
  const flat = points.every((v) => v === 0)
  const min = flat ? 0 : Math.min(...points)
  const max = flat ? 1 : Math.max(...points)
  const span = max - min || 1
  const path = points
    .map((v, i) => {
      const x = (i / (points.length - 1)) * W
      const y = flat ? H / 2 : H - ((v - min) / span) * (H - 16) - 8
      return `${i === 0 ? 'M' : 'L'}${x.toFixed(1)},${y.toFixed(1)}`
    })
    .join(' ')
  const area = `${path} L${W},${H} L0,${H} Z`

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="h-36 w-full" preserveAspectRatio="none" aria-hidden>
      <path d={area} fill={stroke} opacity="0.06" />
      <path d={path} fill="none" stroke={stroke} strokeWidth="2.5" opacity={flat ? 0.35 : 1} />
    </svg>
  )
}

const EMPTY_WEEK = [0, 0, 0, 0, 0, 0, 0]
const EMPTY_TREND = Array.from({ length: 12 }, () => 0)

export function MbkIntelligence() {
  return (
    <div>
      <div className="mb-2 flex flex-wrap items-end justify-between gap-3">
        <div>
          <SectionLabel>Enterprise intelligence</SectionLabel>
          <h1
            className="m-0 mt-2 font-medium text-[#14432A]"
            style={{
              fontFamily: "'Playfair Display', Georgia, serif",
              fontSize: 'clamp(1.6rem, 3vw, 2.1rem)',
            }}
          >
            My Brothers Keeper
          </h1>
          <p className="mb-0 mt-2 max-w-xl font-sans text-[0.875rem] leading-[1.6] text-[#55655D]">
            Training volume, streak economics, and wallet-credit performance from your fitness OS.
          </p>
        </div>
        <a
          href="https://mybrotherskeeper.cc"
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-[10px] bg-[#0F3D2E] px-4 py-2.5 font-sans text-[0.8125rem] font-semibold text-[#FAFCFB] no-underline transition hover:bg-[#0A2E22]"
        >
          Log in to My Brothers Keeper
        </a>
      </div>

      <LockedBanner app="My Brothers Keeper" />

      <div className="mb-4 grid grid-cols-2 gap-3 lg:grid-cols-4">
        <MetricTile label="Session status" value="Signed out" hint="No active MBK session" />
        <MetricTile label="Live sync" value="Paused" hint="Waiting for authentication" />
        <MetricTile label="Ledger bridge" value="Idle" hint="Credits will resume on login" />
        <MetricTile label="Last sync" value="—" hint="No device linked" />
      </div>

      <LockedLayer>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
            <MetricTile label="Weekly streak" value="—" hint="No data" />
            <MetricTile label="Workouts logged" value="0" hint="This billing period" />
            <MetricTile label="Credits earned" value={usd(0)} hint="Eligible activity → wallet" />
            <MetricTile label="Goal adherence" value="—" hint="No training days on file" />
          </div>

          <div className="grid gap-4 lg:grid-cols-5">
            <div className="rounded-2xl bg-[#14432A]/[0.06] p-5 lg:col-span-3">
              <div className="mb-3 flex items-baseline justify-between gap-3">
                <div>
                  <SectionLabel>Training volume</SectionLabel>
                  <p className="m-0 mt-1 font-sans text-[0.9375rem] font-semibold text-[#14432A]">
                    12-week strength &amp; conditioning curve
                  </p>
                </div>
                <p className="m-0 font-sans text-[0.75rem] font-semibold text-[#8A958D]">—</p>
              </div>
              <TrendLine points={EMPTY_TREND} />
            </div>

            <div className="rounded-2xl bg-[#14432A]/[0.06] p-5 lg:col-span-2">
              <SectionLabel>This week</SectionLabel>
              <p className="m-0 mt-1 font-sans text-[0.9375rem] font-semibold text-[#14432A]">
                Consistency board
              </p>
              <p className="mb-4 mt-1 font-sans text-[0.75rem] text-[#55655D]">
                0 of 7 days · No streak
              </p>
              <SparkBars values={EMPTY_WEEK} />
            </div>
          </div>

          <div className="grid gap-4 lg:grid-cols-2">
            <div className="rounded-2xl bg-[#0F3D2E] p-5 sm:p-6">
              <SectionLabel>Earnings bridge</SectionLabel>
              <p
                className="m-0 mt-2 font-medium tabular-nums text-[#FAFCFB]"
                style={{
                  fontFamily: "'Playfair Display', Georgia, serif",
                  fontSize: 'clamp(1.75rem, 3vw, 2.25rem)',
                }}
              >
                {usd(0)}
                <span className="ml-2 text-[0.45em] font-sans font-semibold uppercase tracking-[0.12em] text-[#C9A53E]">
                  this week
                </span>
              </p>
              <ul className="mb-0 mt-4 list-none space-y-2.5 p-0">
                {[
                  { label: 'Run streak bonus', value: 0 },
                  { label: 'Strength sessions', value: 0 },
                  { label: 'Weekly goal', value: 0 },
                ].map((row) => (
                  <li
                    key={row.label}
                    className="flex items-center justify-between gap-3 border-t border-white/10 pt-2.5 font-sans text-[0.8125rem]"
                  >
                    <span className="text-[#FAFCFB]/75">{row.label}</span>
                    <span className="font-semibold tabular-nums text-[#FAFCFB]/55">
                      {usd(row.value)}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-2xl bg-[#14432A]/[0.06] p-5 sm:p-6">
              <SectionLabel>Performance intelligence</SectionLabel>
              <p className="m-0 mt-1 font-sans text-[0.9375rem] font-semibold text-[#14432A]">
                Coaching insights
              </p>
              <ul className="mb-0 mt-4 list-none space-y-3 p-0">
                {[
                  { k: 'Volume', v: '—' },
                  { k: 'Frequency', v: '—' },
                  { k: 'Pace', v: '—' },
                  { k: 'Recovery', v: '—' },
                ].map((row) => (
                  <li key={row.k} className="flex gap-3">
                    <span className="w-20 shrink-0 font-sans text-[0.6875rem] font-semibold uppercase tracking-[0.08em] text-[#C9A53E]">
                      {row.k}
                    </span>
                    <span className="font-sans text-[0.8125rem] leading-snug text-[#14432A]">
                      {row.v}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </LockedLayer>

      <p className="mb-0 mt-5 font-sans text-[0.6875rem] leading-relaxed text-[#8A958D]">
        Fitness intelligence is supplemental wellness tracking — not medical advice. Live metrics
        appear after you authenticate with My Brothers Keeper.
      </p>
    </div>
  )
}

export function WintergardenIntelligence() {
  return (
    <div>
      <div className="mb-2 flex flex-wrap items-end justify-between gap-3">
        <div>
          <SectionLabel>Performance intelligence</SectionLabel>
          <h1
            className="m-0 mt-2 font-medium text-[#14432A]"
            style={{
              fontFamily: "'Playfair Display', Georgia, serif",
              fontSize: 'clamp(1.6rem, 3vw, 2.1rem)',
            }}
          >
            Wintergarden
          </h1>
          <p className="mb-0 mt-2 max-w-xl font-sans text-[0.875rem] leading-[1.6] text-[#55655D]">
            Conservatory scores, rehearsal economics, and stage-readiness trends from your music
            studio.
          </p>
        </div>
        <Link
          href="/wintergarden"
          className="rounded-[10px] bg-[#0F3D2E] px-4 py-2.5 font-sans text-[0.8125rem] font-semibold text-[#FAFCFB] no-underline transition hover:bg-[#0A2E22]"
        >
          Log in to Wintergarden
        </Link>
      </div>

      <LockedBanner app="Wintergarden" />

      <div className="mb-4 grid grid-cols-2 gap-3 lg:grid-cols-4">
        <MetricTile label="Session status" value="Signed out" hint="No conservatory session" />
        <MetricTile label="Studio sync" value="Paused" hint="Waiting for authentication" />
        <MetricTile label="Token bridge" value="Idle" hint="WG earnings locked" />
        <MetricTile label="Last recital" value="—" hint="No scored sessions on file" />
      </div>

      <LockedLayer>
        <div className="space-y-4">
          <div className="rounded-2xl bg-[#0F3D2E] p-5 sm:p-7">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="m-0 font-sans text-[0.75rem] font-semibold uppercase tracking-[0.1em] text-[#FAFCFB]/55">
                  Composite performance score
                </p>
                <p
                  className="m-0 mt-1 font-medium tabular-nums text-[#FAFCFB]"
                  style={{
                    fontFamily: "'Playfair Display', Georgia, serif",
                    fontSize: 'clamp(2.2rem, 5vw, 3rem)',
                  }}
                >
                  —
                  <span className="ml-2 text-[0.4em] font-sans font-semibold text-[#C9A53E]">
                    / 100
                  </span>
                </p>
              </div>
              <div className="text-right">
                <p className="m-0 font-sans text-[0.75rem] font-semibold uppercase tracking-[0.1em] text-[#FAFCFB]/55">
                  Token earnings
                </p>
                <p className="m-0 mt-1 font-sans text-[1.5rem] font-semibold tabular-nums text-[#C9A53E]">
                  0 WG
                </p>
              </div>
            </div>
            <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
              {[
                { label: 'Timing', value: '—' },
                { label: 'Phrasing', value: '—' },
                { label: 'Dynamics', value: '—' },
                { label: 'Stage readiness', value: '—' },
              ].map((s) => (
                <div key={s.label} className="rounded-[12px] bg-white/10 px-3 py-3">
                  <p className="m-0 font-sans text-[0.625rem] font-semibold uppercase tracking-[0.08em] text-[#FAFCFB]/55">
                    {s.label}
                  </p>
                  <p className="m-0 mt-1 font-sans text-[1.15rem] font-semibold tabular-nums text-[#FAFCFB]">
                    {s.value}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="grid gap-4 lg:grid-cols-5">
            <div className="rounded-2xl bg-[#14432A]/[0.06] p-5 lg:col-span-3">
              <div className="mb-3 flex items-baseline justify-between gap-3">
                <div>
                  <SectionLabel>Practice trend</SectionLabel>
                  <p className="m-0 mt-1 font-sans text-[0.9375rem] font-semibold text-[#14432A]">
                    Session scores · last 12 rehearsals
                  </p>
                </div>
                <p className="m-0 font-sans text-[0.75rem] font-semibold text-[#8A958D]">—</p>
              </div>
              <TrendLine points={EMPTY_TREND} stroke="#C9A53E" />
            </div>

            <div className="rounded-2xl bg-[#14432A]/[0.06] p-5 lg:col-span-2">
              <SectionLabel>Repertoire progress</SectionLabel>
              <p className="m-0 mt-1 font-sans text-[0.9375rem] font-semibold text-[#14432A]">
                Book &amp; unlocks
              </p>
              <ul className="mb-0 mt-4 list-none space-y-3 p-0">
                {[
                  { label: 'Book progress', pct: 0 },
                  { label: 'Stage drill pack', pct: 0 },
                  { label: 'Dynamics challenge', pct: 0 },
                ].map((row) => (
                  <li key={row.label}>
                    <div className="mb-1.5 flex justify-between gap-2 font-sans text-[0.75rem]">
                      <span className="font-medium text-[#14432A]">{row.label}</span>
                      <span className="tabular-nums text-[#55655D]">—</span>
                    </div>
                    <div className="h-1.5 overflow-hidden rounded-full bg-[#14432A]/10">
                      <div
                        className="h-full rounded-full bg-[#0F3D2E]"
                        style={{ width: `${row.pct}%` }}
                      />
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="grid gap-4 lg:grid-cols-2">
            <div className="rounded-2xl bg-[#14432A]/[0.06] p-5 sm:p-6">
              <SectionLabel>Earnings &amp; tokens</SectionLabel>
              <p className="m-0 mt-1 font-sans text-[0.9375rem] font-semibold text-[#14432A]">
                Performance payouts
              </p>
              <ul className="mb-0 mt-4 list-none space-y-2.5 p-0">
                {[
                  { label: 'Daily rehearsal claim', value: '0 WG' },
                  { label: 'Perfect timing bonus', value: '0 WG' },
                  { label: 'Recital milestone', value: '0 WG' },
                  { label: 'Wallet credit bridge', value: usd(0) },
                ].map((row) => (
                  <li
                    key={row.label}
                    className="flex items-center justify-between gap-3 border-t border-[#14432A]/10 pt-2.5 font-sans text-[0.8125rem]"
                  >
                    <span className="text-[#55655D]">{row.label}</span>
                    <span className="font-semibold tabular-nums text-[#14432A]">{row.value}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-2xl bg-[#14432A]/[0.06] p-5 sm:p-6">
              <SectionLabel>Session feedback</SectionLabel>
              <p className="m-0 mt-1 font-sans text-[0.9375rem] font-semibold text-[#14432A]">
                Measure-level coaching
              </p>
              <ul className="mb-0 mt-4 list-none space-y-3 p-0">
                {[
                  { k: 'Timing', v: '—' },
                  { k: 'Phrasing', v: '—' },
                  { k: 'Dynamics', v: '—' },
                  { k: 'Stage', v: '—' },
                ].map((row) => (
                  <li key={row.k} className="flex gap-3">
                    <span className="w-20 shrink-0 font-sans text-[0.6875rem] font-semibold uppercase tracking-[0.08em] text-[#C9A53E]">
                      {row.k}
                    </span>
                    <span className="font-sans text-[0.8125rem] leading-snug text-[#14432A]">
                      {row.v}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </LockedLayer>

      <p className="mb-0 mt-5 font-sans text-[0.6875rem] leading-relaxed text-[#8A958D]">
        Wintergarden performance intelligence is supplemental enrichment — not clinical instruction.
        Live scores and token earnings appear after you authenticate with Wintergarden.
      </p>
    </div>
  )
}
