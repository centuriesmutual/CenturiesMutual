'use client'

import { cn } from '@/lib/utils'
import './neighborhood-motion.css'

/* ---------------------------------------------------------------------------
 * Product-screen modal mockups for the Centuries Mutual home page.
 *
 * Each component renders a self-contained UI surface that simulates a real
 * screen of the platform (no Three.js, no raster). Brand palette only.
 *
 *   --green       #14432A  primary structure & solid actions
 *   --gold        #C9A53E  precision accents, badges, trims
 *   --paper       #FAFCFB  surfaces
 *   --cream       #F4F1EC  alt surfaces
 *   --border      #E8EBEA  hairline dividers
 *   --gray        #55655D  body/secondary text
 *
 * Animation classes come from neighborhood-motion.css and respect
 * prefers-reduced-motion.
 * ------------------------------------------------------------------------ */

type Props = { className?: string; 'aria-hidden'?: boolean }

const GREEN = '#14432A'
const GOLD = '#C9A53E'
const PAPER = '#FAFCFB'
const BORDER = '#E8EBEA'
const GRAY = '#55655D'

/* ────────────────────────────────────────────────────────────────────────── */
/* Shared chrome                                                              */
/* ────────────────────────────────────────────────────────────────────────── */

function WindowFrame({
  eyebrow,
  title,
  badge,
  children,
  className,
}: {
  eyebrow: string
  title: string
  badge?: { tone: 'live' | 'gold'; label: string }
  children: React.ReactNode
  className?: string
}) {
  return (
    <div
      className={cn(
        'nb-illustrations w-full overflow-hidden rounded-2xl border border-[#E8EBEA] bg-white shadow-[0_24px_60px_-30px_rgba(15,61,46,0.25)]',
        className,
      )}
    >
      <div
        className="flex items-center justify-between gap-3 px-4 py-3"
        style={{
          background: `linear-gradient(180deg, #0F3321 0%, ${GREEN} 60%, #1A5938 100%)`,
        }}
      >
        <div className="flex min-w-0 items-center gap-3">
          <span className="flex shrink-0 gap-1.5" aria-hidden>
            <span className="h-[10px] w-[10px] rounded-full bg-[#FF5F56]" />
            <span className="h-[10px] w-[10px] rounded-full bg-[#FEBC2E]" />
            <span className="h-[10px] w-[10px] rounded-full bg-[#28C840]" />
          </span>
          <div className="min-w-0">
            <div
              className="font-sans text-[9px] font-semibold uppercase tracking-[0.18em]"
              style={{ color: 'rgba(250,252,251,0.72)' }}
            >
              {eyebrow}
            </div>
            <div
              className="truncate font-sans text-[13px] font-semibold leading-tight"
              style={{ color: PAPER }}
            >
              {title}
            </div>
          </div>
        </div>
        {badge && (
          <span
            className="flex shrink-0 items-center gap-1.5 rounded-md px-2 py-1 font-sans text-[10px] font-bold uppercase tracking-[0.08em]"
            style={
              badge.tone === 'live'
                ? { background: 'rgba(34,197,94,0.18)', color: '#A7F3D0' }
                : { background: 'rgba(201,165,62,0.18)', color: GOLD }
            }
          >
            {badge.tone === 'live' && (
              <span
                aria-hidden
                className="nb-pin-pulse h-1.5 w-1.5 rounded-full"
                style={{ background: '#22C55E', boxShadow: '0 0 0 3px rgba(34,197,94,0.25)' }}
              />
            )}
            {badge.label}
          </span>
        )}
      </div>
      <div className="bg-[#F8FAF9]">{children}</div>
    </div>
  )
}

function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="font-sans text-[9px] font-semibold uppercase tracking-[0.18em]"
      style={{ color: GRAY }}
    >
      {children}
    </div>
  )
}

function Pill({
  children,
  tone = 'green',
}: {
  children: React.ReactNode
  tone?: 'green' | 'gold' | 'gray'
}) {
  const styles =
    tone === 'gold'
      ? { background: 'rgba(201,165,62,0.12)', color: '#8A6E1B', border: '1px solid rgba(201,165,62,0.35)' }
      : tone === 'gray'
        ? { background: '#F1F3F2', color: GRAY, border: `1px solid ${BORDER}` }
        : { background: 'rgba(20,67,42,0.06)', color: GREEN, border: '1px solid rgba(20,67,42,0.18)' }
  return (
    <span
      className="inline-flex items-center gap-1 rounded-full px-2 py-[3px] font-sans text-[10.5px] font-semibold leading-none"
      style={styles}
    >
      {children}
    </span>
  )
}

function Avatar({ initials, tone = 'green' }: { initials: string; tone?: 'green' | 'gold' }) {
  return (
    <div
      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full font-sans text-[12px] font-semibold"
      style={{
        background: tone === 'gold' ? GOLD : GREEN,
        color: PAPER,
        boxShadow: 'inset 0 0 0 2px rgba(255,255,255,0.18)',
      }}
    >
      {initials}
    </div>
  )
}

/* ────────────────────────────────────────────────────────────────────────── */
/* 1. Roommate Matching                                                       */
/* ────────────────────────────────────────────────────────────────────────── */

const ROOMMATES = [
  { name: 'Maya Reyes', tags: ['Verified', 'Non-smoker'], match: 98, trust: 92, accent: 'gold' as const, initials: 'MR' },
  { name: 'David Okafor', tags: ['Verified', 'Pets ok'], match: 91, trust: 88, accent: 'green' as const, initials: 'DO' },
  { name: 'Lena Park', tags: ['Verified', 'Quiet hours'], match: 86, trust: 90, accent: 'green' as const, initials: 'LP' },
]

export function RoommateMatchingModal({ className }: Props) {
  return (
    <WindowFrame
      className={className}
      eyebrow="Centuries Mutual"
      title="Roommate Match — Austin Corridor"
      badge={{ tone: 'live', label: '3 live' }}
    >
      <div className="px-5 pt-4">
        <div className="flex items-center justify-between gap-3">
          <Eyebrow>Filter</Eyebrow>
          <span className="font-sans text-[11px]" style={{ color: GRAY }}>
            28 matches · Updated 2m ago
          </span>
        </div>

        {/* Search + chips */}
        <div className="mt-2 flex flex-wrap items-center gap-2">
          <div
            className="flex h-9 flex-1 min-w-[160px] items-center gap-2 rounded-lg border bg-white px-3"
            style={{ borderColor: BORDER }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden>
              <circle cx="11" cy="11" r="6.5" stroke={GRAY} strokeWidth="1.5" />
              <path d="M20 20l-4-4" stroke={GRAY} strokeWidth="1.5" strokeLinecap="round" />
            </svg>
            <span className="font-sans text-[12px]" style={{ color: GREEN }}>
              Austin, TX
            </span>
            <span className="ml-auto font-sans text-[10px] font-semibold uppercase tracking-[0.12em]" style={{ color: GOLD }}>
              ⌘ K
            </span>
          </div>
          <Pill>$1,200–$1,800</Pill>
          <Pill>2 BR</Pill>
          <Pill tone="gold">Verified only</Pill>
        </div>

        {/* List */}
        <div className="mt-4 space-y-2 pb-4">
          {ROOMMATES.map((m, i) => (
            <div
              key={m.name}
              className="flex items-center gap-3 rounded-xl border bg-white px-3 py-3"
              style={{ borderColor: BORDER }}
            >
              <Avatar initials={m.initials} tone={m.accent} />
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="truncate font-sans text-[13px] font-semibold" style={{ color: GREEN }}>
                    {m.name}
                  </span>
                  {i === 0 && (
                    <span className="font-sans text-[9px] font-bold uppercase tracking-[0.12em]" style={{ color: GOLD }}>
                      Top match
                    </span>
                  )}
                </div>
                <div className="mt-1 flex flex-wrap items-center gap-1.5">
                  {m.tags.map((t) => (
                    <span
                      key={t}
                      className="font-sans text-[10px] font-medium"
                      style={{ color: GRAY }}
                    >
                      · {t}
                    </span>
                  ))}
                </div>
              </div>

              {/* Match donut */}
              <div className="flex shrink-0 flex-col items-center pr-1">
                <svg width="40" height="40" viewBox="0 0 40 40" aria-hidden>
                  <circle cx="20" cy="20" r="16" fill="none" stroke={BORDER} strokeWidth="3" />
                  <circle
                    cx="20"
                    cy="20"
                    r="16"
                    fill="none"
                    stroke={i === 0 ? GOLD : GREEN}
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeDasharray={`${(m.match / 100) * 100.5} 100.5`}
                    transform="rotate(-90 20 20)"
                  />
                  <text
                    x="20"
                    y="23"
                    textAnchor="middle"
                    fontFamily="'Playfair Display', Georgia, serif"
                    fontSize="11"
                    fontWeight="600"
                    fill={GREEN}
                  >
                    {m.match}
                  </text>
                </svg>
                <span className="mt-1 font-sans text-[9px] uppercase tracking-[0.12em]" style={{ color: GRAY }}>
                  Match
                </span>
              </div>

              <button
                type="button"
                tabIndex={-1}
                aria-hidden
                className="shrink-0 rounded-lg px-3 py-2 font-sans text-[11px] font-semibold"
                style={{ background: GREEN, color: PAPER }}
              >
                Message
              </button>
            </div>
          ))}
        </div>
      </div>

      <div
        className="flex items-center justify-between border-t px-5 py-2.5"
        style={{ borderColor: BORDER, background: '#F1F3F2' }}
      >
        <span className="font-sans text-[10.5px] uppercase tracking-[0.14em]" style={{ color: GRAY }}>
          Trust scores updated daily
        </span>
        <span className="font-sans text-[10.5px] uppercase tracking-[0.14em]" style={{ color: GOLD }}>
          See all matches →
        </span>
      </div>
    </WindowFrame>
  )
}

/* ────────────────────────────────────────────────────────────────────────── */
/* 2. Social Network & Messaging                                              */
/* ────────────────────────────────────────────────────────────────────────── */

const THREADS = [
  { name: 'Corridor — North Austin', preview: 'Maya: Touring 2BR Friday afternoon ↗', time: '2m', unread: 2, initials: 'CN', tone: 'green' as const },
  { name: 'Maya Reyes', preview: 'Sounds great — I’ll bring the lease draft.', time: '8m', unread: 0, initials: 'MR', tone: 'gold' as const },
  { name: 'Landlord · Cedar Park', preview: 'Verified · Available Sept 1', time: '1h', unread: 1, initials: 'LC', tone: 'green' as const },
  { name: 'Welcome Committee', preview: '12 new neighbors in your corridor', time: '3h', unread: 0, initials: 'WC', tone: 'green' as const },
]

const MESSAGES = [
  { from: 'them', text: 'Just saw the listing — looks promising. Are utilities included?' },
  { from: 'you', text: 'Yes, water + internet. Electric is split.' },
  { from: 'them', text: 'Perfect. I can sign by Friday if the tour goes well.' },
]

export function SocialNetworkModal({ className }: Props) {
  return (
    <WindowFrame
      className={className}
      eyebrow="Centuries Mutual"
      title="Network — Messages"
      badge={{ tone: 'live', label: 'Online' }}
    >
      <div className="grid grid-cols-1 sm:grid-cols-[1.1fr_1.4fr]">
        {/* Threads list */}
        <div
          className="border-r px-3 pb-3 pt-3"
          style={{ borderColor: BORDER, background: '#FAFCFB' }}
        >
          <div className="mb-2 flex items-center justify-between px-1">
            <Eyebrow>Threads</Eyebrow>
            <span className="font-sans text-[10px] font-semibold" style={{ color: GOLD }}>
              + New
            </span>
          </div>
          <div className="space-y-1">
            {THREADS.map((t, i) => {
              const active = i === 1
              return (
                <div
                  key={t.name}
                  className="flex items-center gap-2 rounded-lg px-2 py-2"
                  style={{
                    background: active ? 'rgba(20,67,42,0.06)' : 'transparent',
                    border: active ? '1px solid rgba(20,67,42,0.18)' : '1px solid transparent',
                  }}
                >
                  <Avatar initials={t.initials} tone={t.tone} />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-baseline justify-between gap-2">
                      <span
                        className="truncate font-sans text-[12px] font-semibold"
                        style={{ color: GREEN }}
                      >
                        {t.name}
                      </span>
                      <span className="font-sans text-[10px]" style={{ color: GRAY }}>
                        {t.time}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="line-clamp-1 font-sans text-[11px]" style={{ color: GRAY }}>
                        {t.preview}
                      </span>
                      {t.unread > 0 && (
                        <span
                          className="shrink-0 rounded-full px-1.5 font-sans text-[9px] font-bold"
                          style={{ background: GOLD, color: GREEN }}
                        >
                          {t.unread}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Conversation pane */}
        <div className="flex min-h-0 flex-col">
          <div
            className="flex items-center justify-between border-b px-4 py-3"
            style={{ borderColor: BORDER }}
          >
            <div className="flex items-center gap-2">
              <Avatar initials="MR" tone="gold" />
              <div>
                <div className="font-sans text-[12.5px] font-semibold" style={{ color: GREEN }}>
                  Maya Reyes
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="nb-pin-pulse h-1.5 w-1.5 rounded-full" style={{ background: '#22C55E' }} />
                  <span className="font-sans text-[10px]" style={{ color: GRAY }}>
                    Active now · End-to-end secured
                  </span>
                </div>
              </div>
            </div>
            <Pill tone="gold">Verified</Pill>
          </div>

          <div className="space-y-2 px-4 py-4">
            {MESSAGES.map((m, i) => (
              <div
                key={i}
                className={cn('flex w-full', m.from === 'you' ? 'justify-end' : 'justify-start')}
              >
                <div
                  className="max-w-[80%] rounded-2xl px-3 py-2 font-sans text-[12px] leading-snug"
                  style={
                    m.from === 'you'
                      ? { background: GREEN, color: PAPER, borderBottomRightRadius: 6 }
                      : {
                          background: 'white',
                          color: GREEN,
                          border: `1px solid ${BORDER}`,
                          borderBottomLeftRadius: 6,
                        }
                  }
                >
                  {m.text}
                </div>
              </div>
            ))}

            {/* Typing indicator */}
            <div className="flex items-center gap-2">
              <Avatar initials="MR" tone="gold" />
              <div
                className="flex items-center gap-1 rounded-2xl border bg-white px-3 py-2"
                style={{ borderColor: BORDER, borderBottomLeftRadius: 6 }}
              >
                <span
                  className="nb-pin-pulse h-1.5 w-1.5 rounded-full"
                  style={{ background: GREEN, animationDelay: '0s' }}
                />
                <span
                  className="nb-pin-pulse h-1.5 w-1.5 rounded-full"
                  style={{ background: GREEN, animationDelay: '0.3s' }}
                />
                <span
                  className="nb-pin-pulse h-1.5 w-1.5 rounded-full"
                  style={{ background: GREEN, animationDelay: '0.6s' }}
                />
              </div>
            </div>
          </div>

          {/* Composer */}
          <div
            className="mt-auto flex items-center gap-2 border-t px-3 py-2"
            style={{ borderColor: BORDER, background: '#FAFCFB' }}
          >
            <button
              type="button"
              tabIndex={-1}
              aria-hidden
              className="grid h-8 w-8 place-items-center rounded-full"
              style={{ background: 'rgba(20,67,42,0.06)' }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden>
                <path d="M12 5v14M5 12h14" stroke={GREEN} strokeWidth="1.6" strokeLinecap="round" />
              </svg>
            </button>
            <div
              className="flex-1 rounded-full border bg-white px-3 py-2 font-sans text-[12px]"
              style={{ borderColor: BORDER, color: GRAY }}
            >
              Write a message…
            </div>
            <button
              type="button"
              tabIndex={-1}
              aria-hidden
              className="grid h-8 w-8 place-items-center rounded-full"
              style={{ background: GREEN }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden>
                <path d="M4 12l16-7-7 16-2-7-7-2z" fill={GOLD} />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </WindowFrame>
  )
}

/* ────────────────────────────────────────────────────────────────────────── */
/* 3. Smart Home Security Dashboard                                           */
/* ────────────────────────────────────────────────────────────────────────── */

const CAMERAS = [
  { label: 'Front door', time: '6:14 PM', live: true },
  { label: 'Garage', time: '6:13 PM', live: true },
  { label: 'Back yard', time: '6:11 PM', live: false },
  { label: 'Driveway', time: '6:10 PM', live: true },
]

const ACTIVITY = [
  { time: '6:14 PM', text: 'Front door — locked', tone: 'green' as const },
  { time: '6:08 PM', text: 'Garage motion — cleared', tone: 'gold' as const },
  { time: '5:52 PM', text: 'Maya R. unlocked side gate', tone: 'green' as const },
  { time: '5:14 PM', text: 'System fully armed (Away)', tone: 'green' as const },
]

export function SmartHomeSecurityModal({ className }: Props) {
  return (
    <WindowFrame
      className={className}
      eyebrow="Centuries Mutual"
      title="Security — Home Dashboard"
      badge={{ tone: 'live', label: 'Armed · Away' }}
    >
      {/* Stat strip */}
      <div
        className="grid grid-cols-3 divide-x px-5 pt-3"
        style={{ borderColor: BORDER }}
      >
        {[
          { v: '4', l: 'Cameras' },
          { v: '12', l: 'Sensors' },
          { v: '3', l: 'Locks' },
        ].map((s, i) => (
          <div key={s.l} className={cn('flex flex-col items-center py-2', i > 0 && 'pl-2')}>
            <span
              className="font-serif text-[20px] leading-none"
              style={{
                fontFamily: "'Playfair Display', Georgia, serif",
                color: GREEN,
                fontWeight: 600,
              }}
            >
              {s.v}
            </span>
            <span className="mt-1 font-sans text-[9.5px] uppercase tracking-[0.18em]" style={{ color: GRAY }}>
              {s.l}
            </span>
          </div>
        ))}
      </div>

      {/* Cameras grid */}
      <div className="px-5 pt-3">
        <div className="mb-2 flex items-center justify-between">
          <Eyebrow>Live cameras</Eyebrow>
          <span className="font-sans text-[10.5px]" style={{ color: GRAY }}>
            All clear · 2m ago
          </span>
        </div>
        <div className="grid grid-cols-2 gap-2">
          {CAMERAS.map((c) => (
            <div
              key={c.label}
              className="relative aspect-[16/10] overflow-hidden rounded-lg border"
              style={{
                background:
                  'linear-gradient(180deg, #0A0F0C 0%, #102018 100%)',
                borderColor: 'rgba(20,67,42,0.35)',
              }}
            >
              {/* faux scanlines */}
              <div
                className="pointer-events-none absolute inset-0 opacity-[0.08]"
                style={{
                  backgroundImage:
                    'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.06) 2px, rgba(255,255,255,0.06) 4px)',
                }}
                aria-hidden
              />
              {/* faux motion path */}
              <svg viewBox="0 0 200 110" className="absolute inset-0 h-full w-full" aria-hidden>
                <path
                  d="M10 100 Q 60 70 100 78 T 195 36"
                  fill="none"
                  stroke={GOLD}
                  strokeOpacity="0.55"
                  strokeWidth="1"
                  strokeDasharray="4 6"
                  className="nb-dash-flow-slow"
                />
                <circle cx="40" cy="92" r="1.5" fill={GOLD} />
                <circle cx="100" cy="78" r="1.5" fill={GOLD} />
                <circle cx="160" cy="50" r="1.5" fill={GOLD} />
              </svg>

              {/* timestamp */}
              <span
                className="absolute left-2 bottom-2 rounded px-1.5 py-[2px] font-mono text-[9px]"
                style={{ background: 'rgba(0,0,0,0.6)', color: '#A7F3D0' }}
              >
                {c.time}
              </span>
              {/* label */}
              <span
                className="absolute left-2 top-2 font-sans text-[9.5px] font-semibold"
                style={{ color: '#E5E7EB' }}
              >
                {c.label}
              </span>
              {/* live dot */}
              {c.live && (
                <span
                  className="nb-pin-pulse absolute right-2 top-2 h-1.5 w-1.5 rounded-full"
                  style={{ background: '#FF5F56', boxShadow: '0 0 0 3px rgba(255,95,86,0.25)' }}
                />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Activity log */}
      <div className="px-5 pb-5 pt-4">
        <div className="mb-2 flex items-center justify-between">
          <Eyebrow>Activity</Eyebrow>
          <span className="font-sans text-[10.5px] uppercase tracking-[0.12em]" style={{ color: GOLD }}>
            All systems healthy
          </span>
        </div>
        <div
          className="divide-y rounded-xl border bg-white"
          style={{ borderColor: BORDER }}
        >
          {ACTIVITY.map((a) => (
            <div key={a.text} className="flex items-center gap-3 px-3 py-2">
              <span
                className="h-1.5 w-1.5 shrink-0 rounded-full"
                style={{ background: a.tone === 'gold' ? GOLD : GREEN }}
              />
              <span className="flex-1 font-sans text-[12px]" style={{ color: GREEN }}>
                {a.text}
              </span>
              <span className="font-mono text-[10.5px]" style={{ color: GRAY }}>
                {a.time}
              </span>
            </div>
          ))}
        </div>
      </div>
    </WindowFrame>
  )
}

/* ────────────────────────────────────────────────────────────────────────── */
/* 4. eDocument System — Lease modal                                          */
/* ────────────────────────────────────────────────────────────────────────── */

const FIELDS: { l: string; v: string }[] = [
  { l: 'Tenant', v: 'Maya Reyes' },
  { l: 'Lessor', v: 'Cedar Park Holdings, LLC' },
  { l: 'Property', v: '4218 Burnet Rd, Austin TX' },
  { l: 'Term', v: '12 months · Sept 1, 2026 → Aug 31, 2027' },
  { l: 'Monthly rent', v: '$1,640' },
  { l: 'Security deposit', v: '$1,640 · Held in escrow' },
]

export function EDocumentSystemModal({ className }: Props) {
  return (
    <WindowFrame
      className={className}
      eyebrow="Centuries Mutual"
      title="Lease Agreement — TX-2024 Std"
      badge={{ tone: 'gold', label: 'Sealed' }}
    >
      <div className="px-5 py-4">
        {/* document title block */}
        <div className="flex items-start justify-between">
          <div>
            <Eyebrow>Document</Eyebrow>
            <h3
              className="mt-1 font-serif"
              style={{
                fontFamily: "'Playfair Display', Georgia, serif",
                color: GREEN,
                fontSize: '17px',
                fontWeight: 600,
                letterSpacing: '-0.01em',
              }}
            >
              Standard Residential Lease
            </h3>
            <p className="mt-1 font-sans text-[11px]" style={{ color: GRAY }}>
              Doc ID · CM-LSE-00482 · Created May 12
            </p>
          </div>

          {/* gold seal */}
          <div className="nb-seal-pulse relative h-12 w-12 shrink-0">
            <svg viewBox="0 0 48 48" className="h-full w-full" aria-hidden>
              <circle cx="24" cy="24" r="22" fill={PAPER} stroke={GOLD} strokeWidth="1.25" />
              <circle cx="24" cy="24" r="14" fill="none" stroke={GOLD} strokeWidth="0.75" />
              <path d="M24 14 L28 20 L24 26 L20 20 Z" fill={GOLD} />
              <text
                x="24"
                y="36"
                textAnchor="middle"
                fontFamily="'Playfair Display', Georgia, serif"
                fontSize="6"
                fontWeight="600"
                letterSpacing="0.18em"
                fill={GREEN}
              >
                CM·SEAL
              </text>
            </svg>
          </div>
        </div>

        {/* fields */}
        <div className="mt-4 divide-y rounded-xl border bg-white" style={{ borderColor: BORDER }}>
          {FIELDS.map((f) => (
            <div key={f.l} className="flex items-center gap-3 px-3 py-2.5">
              <span
                className="w-32 shrink-0 font-sans text-[10.5px] uppercase tracking-[0.16em]"
                style={{ color: GRAY }}
              >
                {f.l}
              </span>
              <span className="flex-1 font-sans text-[12.5px] font-medium" style={{ color: GREEN }}>
                {f.v}
              </span>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden>
                <path
                  d="M5 12l5 5 9-11"
                  stroke={GOLD}
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          ))}
        </div>

        {/* signature block */}
        <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
          {/* tenant signature */}
          <div className="rounded-xl border bg-white p-3" style={{ borderColor: BORDER }}>
            <div className="flex items-center justify-between">
              <Eyebrow>Tenant signature</Eyebrow>
              <span className="font-sans text-[9px] uppercase tracking-[0.12em]" style={{ color: GOLD }}>
                Signed
              </span>
            </div>
            <svg viewBox="0 0 220 50" className="mt-1 h-12 w-full" aria-hidden>
              <path
                d="M6 38 C 24 8, 36 38, 50 22 S 78 12, 92 32 T 130 18 T 168 30 T 210 14"
                fill="none"
                stroke={GREEN}
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeDasharray="320"
                strokeDashoffset="320"
                className="nb-title-line nb-title-line-animate"
                style={{ animationDuration: '1.4s' }}
              />
              <line x1="6" y1="44" x2="210" y2="44" stroke={BORDER} strokeWidth="0.75" />
            </svg>
            <div className="mt-1 flex items-center justify-between font-sans text-[10.5px]" style={{ color: GRAY }}>
              <span>Maya Reyes</span>
              <span className="font-mono">May 14 · 2:14 PM CDT</span>
            </div>
          </div>

          {/* lessor signature */}
          <div className="rounded-xl border bg-white p-3" style={{ borderColor: BORDER }}>
            <div className="flex items-center justify-between">
              <Eyebrow>Lessor signature</Eyebrow>
              <span className="font-sans text-[9px] uppercase tracking-[0.12em]" style={{ color: GOLD }}>
                Pending
              </span>
            </div>
            <svg viewBox="0 0 220 50" className="mt-1 h-12 w-full" aria-hidden>
              <line x1="6" y1="44" x2="210" y2="44" stroke={BORDER} strokeWidth="0.75" />
              <text
                x="12"
                y="34"
                fontFamily="'Playfair Display', Georgia, serif"
                fontSize="14"
                fontStyle="italic"
                fill={GRAY}
              >
                Awaiting countersign…
              </text>
            </svg>
            <div className="mt-1 flex items-center justify-between font-sans text-[10.5px]" style={{ color: GRAY }}>
              <span>Cedar Park Holdings</span>
              <span className="font-mono">Reminder sent</span>
            </div>
          </div>
        </div>

        {/* actions */}
        <div className="mt-4 flex items-center justify-between gap-3 pb-1">
          <div className="flex items-center gap-2">
            <Pill>Audit log: 14 events</Pill>
            <Pill tone="gold">Notarized digitally</Pill>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              tabIndex={-1}
              aria-hidden
              className="rounded-lg border px-3 py-1.5 font-sans text-[11px] font-semibold"
              style={{ borderColor: GREEN, color: GREEN }}
            >
              Save draft
            </button>
            <button
              type="button"
              tabIndex={-1}
              aria-hidden
              className="rounded-lg px-3 py-1.5 font-sans text-[11px] font-semibold"
              style={{ background: GREEN, color: PAPER }}
            >
              Send for signature
            </button>
          </div>
        </div>
      </div>
    </WindowFrame>
  )
}

/* ────────────────────────────────────────────────────────────────────────── */
/* 5. Member overview — for the "A Legacy of Trust" panel                     */
/* ────────────────────────────────────────────────────────────────────────── */

export function MemberTrustModal({ className }: Props) {
  const ledger = [
    { label: 'Application reviewed', date: 'Jan 4', done: true },
    { label: 'Lease signed', date: 'Jan 12', done: true },
    { label: 'Deposit received', date: 'Jan 13', done: true },
    { label: 'Move-in confirmed', date: 'Feb 1', done: true },
  ]
  return (
    <WindowFrame
      className={className}
      eyebrow="Centuries Mutual"
      title="Member — Maya Reyes"
      badge={{ tone: 'gold', label: 'Verified' }}
    >
      <div className="grid grid-cols-1 sm:grid-cols-[0.9fr_1.1fr]">
        {/* identity panel */}
        <div className="border-r px-5 py-4" style={{ borderColor: BORDER, background: '#FAFCFB' }}>
          <div className="flex items-center gap-3">
            <Avatar initials="MR" tone="gold" />
            <div>
              <div className="font-sans text-[13px] font-semibold" style={{ color: GREEN }}>
                Maya Reyes
              </div>
              <div className="font-sans text-[10.5px]" style={{ color: GRAY }}>
                Member since Jan 2026 · Austin Corridor
              </div>
            </div>
          </div>

          {/* trust gauge */}
          <div className="mt-4 flex items-center gap-3">
            <svg width="88" height="88" viewBox="0 0 88 88" aria-hidden>
              <circle cx="44" cy="44" r="36" fill="none" stroke={BORDER} strokeWidth="6" />
              <circle
                cx="44"
                cy="44"
                r="36"
                fill="none"
                stroke={GOLD}
                strokeWidth="6"
                strokeLinecap="round"
                strokeDasharray={`${0.94 * 226} 226`}
                transform="rotate(-90 44 44)"
              />
              <text
                x="44"
                y="42"
                textAnchor="middle"
                fontFamily="'Playfair Display', Georgia, serif"
                fontSize="22"
                fontWeight="600"
                fill={GREEN}
              >
                94
              </text>
              <text
                x="44"
                y="58"
                textAnchor="middle"
                fontFamily="Inter, sans-serif"
                fontSize="7"
                letterSpacing="0.18em"
                fill={GRAY}
              >
                TRUST
              </text>
            </svg>
            <div className="flex flex-col gap-1.5">
              <Pill>ID checked</Pill>
              <Pill>Background clear</Pill>
              <Pill tone="gold">Lease on file</Pill>
            </div>
          </div>
        </div>

        {/* ledger */}
        <div className="px-5 py-4">
          <div className="flex items-center justify-between">
            <Eyebrow>Records that hold up</Eyebrow>
            <span className="font-sans text-[10.5px]" style={{ color: GRAY }}>
              Sealed · Jan–Feb 2026
            </span>
          </div>

          <div className="relative mt-3">
            <span
              aria-hidden
              className="absolute left-[7px] top-1.5 bottom-1.5 w-px"
              style={{ background: GOLD, opacity: 0.6 }}
            />
            <div className="space-y-3">
              {ledger.map((l, i) => (
                <div key={l.label} className="relative flex items-center gap-3">
                  <span
                    className={cn(
                      'relative z-[1] grid h-3.5 w-3.5 place-items-center rounded-full border bg-white',
                      i === ledger.length - 1 && 'nb-pin-pulse',
                    )}
                    style={{ borderColor: GOLD }}
                  >
                    <span
                      className="h-1.5 w-1.5 rounded-full"
                      style={{ background: l.done ? GOLD : 'transparent' }}
                    />
                  </span>
                  <div className="flex flex-1 items-center justify-between">
                    <span className="font-sans text-[12px]" style={{ color: GREEN }}>
                      {l.label}
                    </span>
                    <span className="font-mono text-[10.5px]" style={{ color: GRAY }}>
                      {l.date}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div
            className="mt-4 flex items-center justify-between rounded-xl border px-3 py-2.5"
            style={{ borderColor: BORDER, background: '#FAFCFB' }}
          >
            <div className="flex items-center gap-2">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden>
                <circle cx="12" cy="12" r="9" stroke={GOLD} strokeWidth="1.4" />
                <path d="M9 12l2 2 4-5" stroke={GREEN} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <span className="font-sans text-[11.5px] font-semibold" style={{ color: GREEN }}>
                Sealed record
              </span>
            </div>
            <span className="font-sans text-[10.5px] uppercase tracking-[0.14em]" style={{ color: GOLD }}>
              Yours to keep →
            </span>
          </div>
        </div>
      </div>
    </WindowFrame>
  )
}

/* ────────────────────────────────────────────────────────────────────────── */
/* 6. Roommate Directory — Yellow-Pages style                                 */
/* ────────────────────────────────────────────────────────────────────────── */

const DIRECTORY = [
  {
    initials: 'MR',
    name: 'Reyes, Maya',
    age: 27,
    occupation: 'Software designer',
    area: 'Burnet Rd · 78757',
    phone: '512 · 555 · 0124',
    tags: ['Verified', 'Non-smoker', 'Pets ok'],
    trust: 92,
    accent: 'gold' as const,
  },
  {
    initials: 'DO',
    name: 'Okafor, David',
    age: 31,
    occupation: 'Civil engineer',
    area: 'Cedar Park · 78613',
    phone: '512 · 555 · 0287',
    tags: ['Verified', 'Quiet hours'],
    trust: 88,
    accent: 'green' as const,
  },
  {
    initials: 'LP',
    name: 'Park, Lena',
    age: 25,
    occupation: 'Public-school teacher',
    area: 'Hyde Park · 78751',
    phone: '512 · 555 · 0341',
    tags: ['Verified', 'Pets ok'],
    trust: 90,
    accent: 'green' as const,
  },
]

const ALPHABET = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z']

export function RoommateDirectoryModal({ className }: Props) {
  return (
    <WindowFrame
      className={className}
      eyebrow="Centuries Mutual"
      title="Roommate Directory — Austin, TX"
      badge={{ tone: 'gold', label: 'Vol. 24' }}
    >
      <div
        className="relative px-0 pt-0"
        style={{
          background: '#F4ECCB',
          backgroundImage:
            'repeating-linear-gradient(0deg, transparent 0px, transparent 22px, rgba(20,67,42,0.04) 22px, rgba(20,67,42,0.04) 23px)',
        }}
      >
        {/* Masthead */}
        <div
          className="flex items-center justify-between gap-3 border-b px-5 py-3"
          style={{ borderColor: 'rgba(20,67,42,0.18)' }}
        >
          <div className="flex items-baseline gap-2">
            <span
              className="font-serif"
              style={{
                fontFamily: "'Playfair Display', Georgia, serif",
                color: GREEN,
                fontSize: '17px',
                fontWeight: 700,
                letterSpacing: '0.02em',
              }}
            >
              Yellow Pages
            </span>
            <span
              className="font-sans text-[10.5px] uppercase tracking-[0.18em]"
              style={{ color: '#8A6E1B' }}
            >
              · Roommate listings
            </span>
          </div>
          <span className="font-sans text-[10.5px] uppercase tracking-[0.16em]" style={{ color: GREEN }}>
            Page 1 / 4
          </span>
        </div>

        {/* Search bar */}
        <div className="px-5 pt-4">
          <div
            className="flex items-center gap-2 rounded-md border bg-white px-3 py-2 shadow-[0_1px_0_rgba(20,67,42,0.04)]"
            style={{ borderColor: 'rgba(20,67,42,0.22)' }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden>
              <circle cx="11" cy="11" r="6.5" stroke={GREEN} strokeWidth="1.5" />
              <path d="M20 20l-4-4" stroke={GREEN} strokeWidth="1.5" strokeLinecap="round" />
            </svg>
            <span className="font-sans text-[12px]" style={{ color: GREEN }}>
              Find a roommate near you
            </span>
            <span className="ml-auto font-sans text-[10.5px]" style={{ color: GRAY }}>
              City: <span style={{ color: GREEN, fontWeight: 600 }}>Austin, TX</span>
            </span>
            <button
              type="button"
              tabIndex={-1}
              aria-hidden
              className="ml-2 rounded px-2.5 py-1 font-sans text-[10.5px] font-bold uppercase tracking-[0.14em]"
              style={{ background: GREEN, color: PAPER }}
            >
              Browse
            </button>
          </div>
          <div className="mt-2 flex flex-wrap items-center gap-2 text-[10.5px]" style={{ color: GRAY }}>
            <span className="font-sans uppercase tracking-[0.16em]" style={{ color: '#8A6E1B' }}>
              Listed under:
            </span>
            <Pill tone="green">Roommates</Pill>
            <Pill tone="gold">Verified members</Pill>
            <span className="font-mono">28 listings · Updated daily</span>
          </div>
        </div>

        {/* Directory body w/ alphabet rail */}
        <div className="grid grid-cols-[34px_1fr] gap-0">
          <div className="flex flex-col items-center gap-[1px] border-r py-3" style={{ borderColor: 'rgba(20,67,42,0.18)' }}>
            {ALPHABET.map((l) => (
              <span
                key={l}
                className="font-mono text-[10px]"
                style={{
                  color: l === 'O' || l === 'P' || l === 'R' ? GREEN : '#8A6E1B',
                  fontWeight: l === 'R' ? 700 : 500,
                  letterSpacing: '0.05em',
                }}
              >
                {l}
              </span>
            ))}
          </div>

          <div className="px-4 py-3">
            <div
              className="mb-2 flex items-baseline justify-between border-b pb-1.5"
              style={{ borderColor: 'rgba(20,67,42,0.22)' }}
            >
              <span
                className="font-serif"
                style={{
                  fontFamily: "'Playfair Display', Georgia, serif",
                  color: GREEN,
                  fontSize: '15px',
                  fontWeight: 600,
                }}
              >
                R — Listings
              </span>
              <span className="font-sans text-[10px] uppercase tracking-[0.18em]" style={{ color: '#8A6E1B' }}>
                Sort A → Z
              </span>
            </div>

            <div className="divide-y" style={{ borderColor: 'rgba(20,67,42,0.16)' }}>
              {DIRECTORY.map((d, i) => (
                <div key={d.name} className="flex items-center gap-3 py-2.5">
                  <div
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded font-sans text-[11px] font-bold"
                    style={{
                      background: d.accent === 'gold' ? GOLD : GREEN,
                      color: PAPER,
                      boxShadow: 'inset 0 0 0 2px rgba(255,255,255,0.18)',
                    }}
                  >
                    {d.initials}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-baseline gap-2">
                      <span
                        className="truncate font-serif"
                        style={{
                          fontFamily: "'Playfair Display', Georgia, serif",
                          color: GREEN,
                          fontSize: '14px',
                          fontWeight: 600,
                        }}
                      >
                        {d.name}
                      </span>
                      <span className="font-sans text-[10.5px]" style={{ color: GRAY }}>
                        — {d.occupation}, {d.age}
                      </span>
                    </div>
                    <div className="mt-0.5 flex flex-wrap items-baseline gap-x-3 gap-y-1 font-sans text-[10.5px]">
                      <span style={{ color: GRAY }}>📍 {d.area}</span>
                      <span className="font-mono" style={{ color: GREEN }}>
                        ☎ {d.phone}
                      </span>
                      {d.tags.map((t) => (
                        <span key={t} className="uppercase tracking-[0.12em]" style={{ color: '#8A6E1B', fontWeight: 600 }}>
                          · {t}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="flex shrink-0 flex-col items-end gap-1.5">
                    <span
                      className="font-sans text-[9.5px] font-bold uppercase tracking-[0.14em]"
                      style={{ color: i === 0 ? GOLD : GREEN }}
                    >
                      Trust {d.trust}
                    </span>
                    <button
                      type="button"
                      tabIndex={-1}
                      aria-hidden
                      className="rounded border px-2.5 py-1 font-sans text-[10.5px] font-semibold"
                      style={{ borderColor: GREEN, color: GREEN, background: 'transparent' }}
                    >
                      Contact
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-3 flex items-center justify-between border-t pt-2" style={{ borderColor: 'rgba(20,67,42,0.18)' }}>
              <span className="font-sans text-[10.5px] uppercase tracking-[0.16em]" style={{ color: '#8A6E1B' }}>
                Continued on next page →
              </span>
              <span className="font-mono text-[10px]" style={{ color: GRAY }}>
                Vol. 24 · Spring Issue
              </span>
            </div>
          </div>
        </div>
      </div>
    </WindowFrame>
  )
}

/* ────────────────────────────────────────────────────────────────────────── */
/* 7. Twitter / X feed                                                        */
/* ────────────────────────────────────────────────────────────────────────── */

const POSTS = [
  {
    initials: 'CM',
    name: 'Centuries Mutual',
    handle: '@centuriesmutual',
    time: '2h',
    verified: true,
    body: 'Your corridor moves at the speed of trust. New verified listings posted in Austin · Cedar Park this week — every one notarized, every record sealed.',
    likes: '1.2K',
    reposts: 184,
    replies: 42,
  },
  {
    initials: 'MR',
    name: 'Maya Reyes',
    handle: '@maya.in.atx',
    time: '6h',
    verified: true,
    body: 'Signed my lease through Centuries Mutual today. Three roommates, one ledger, zero spreadsheets. The audit log alone is worth it.',
    likes: 318,
    reposts: 47,
    replies: 19,
    hasCard: true,
  },
  {
    initials: 'DO',
    name: 'David Okafor',
    handle: '@dokafor',
    time: '1d',
    verified: false,
    body: 'My corridor newspaper just dropped — three new neighbors verified, two block events on the calendar. Reading it like a Sunday paper. ☕',
    likes: 92,
    reposts: 14,
    replies: 6,
  },
]

const TRENDS = [
  { topic: 'Austin Corridor', volume: '2,418 posts' },
  { topic: 'Verified Leases', volume: '982 posts' },
  { topic: '#TrustScores', volume: '614 posts' },
]

export function TwitterFeedModal({ className }: Props) {
  return (
    <WindowFrame
      className={className}
      eyebrow="Centuries Mutual"
      title="Network — For You"
      badge={{ tone: 'live', label: 'Live' }}
    >
      <div className="grid grid-cols-1 sm:grid-cols-[1.6fr_1fr]">
        {/* Feed */}
        <div className="border-r" style={{ borderColor: BORDER }}>
          {/* tab bar */}
          <div
            className="sticky top-0 z-[1] flex items-center justify-between border-b bg-white px-4"
            style={{ borderColor: BORDER }}
          >
            {['For you', 'Following', 'Corridor'].map((t, i) => (
              <button
                key={t}
                type="button"
                tabIndex={-1}
                aria-hidden
                className="relative flex-1 py-3 font-sans text-[12px] font-semibold"
                style={{ color: i === 0 ? GREEN : GRAY }}
              >
                {t}
                {i === 0 && (
                  <span
                    className="absolute inset-x-3 -bottom-px h-[3px] rounded-full"
                    style={{ background: GOLD }}
                  />
                )}
              </button>
            ))}
          </div>

          {/* Composer */}
          <div className="flex items-start gap-3 border-b px-4 py-3" style={{ borderColor: BORDER }}>
            <Avatar initials="YOU" />
            <div className="flex-1">
              <div className="font-sans text-[13px]" style={{ color: GRAY }}>
                What&apos;s happening in your corridor?
              </div>
              <div className="mt-2 flex items-center justify-between">
                <div className="flex gap-3 font-sans text-[11px]" style={{ color: GREEN }}>
                  <span>📷 Photo</span>
                  <span>📍 Place</span>
                  <span>📊 Poll</span>
                </div>
                <button
                  type="button"
                  tabIndex={-1}
                  aria-hidden
                  className="rounded-full px-3.5 py-1.5 font-sans text-[11.5px] font-bold"
                  style={{ background: GREEN, color: PAPER }}
                >
                  Post
                </button>
              </div>
            </div>
          </div>

          {/* Posts */}
          <div className="divide-y" style={{ borderColor: BORDER }}>
            {POSTS.map((p, i) => (
              <article key={p.handle} className="flex gap-3 px-4 py-3">
                <Avatar initials={p.initials} tone={i === 0 ? 'gold' : 'green'} />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5 font-sans text-[12.5px]">
                    <span className="font-semibold" style={{ color: GREEN }}>
                      {p.name}
                    </span>
                    {p.verified && (
                      <svg width="13" height="13" viewBox="0 0 24 24" aria-hidden>
                        <path
                          fill={GOLD}
                          d="M12 2l2.4 2.2 3.2-.4.4 3.2L20.2 9 18 12l2.2 2.4-2.6 1.8.4 3.2-3.2.4L12 22l-2.4-2.2-3.2.4-.4-3.2L3.8 15 6 12 3.8 9.6l2.6-1.8-.4-3.2 3.2-.4z"
                        />
                        <path d="M9 12l2 2 4-5" stroke="#0F3321" strokeWidth="1.6" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    )}
                    <span style={{ color: GRAY }}>{p.handle}</span>
                    <span style={{ color: GRAY }}>· {p.time}</span>
                  </div>
                  <p
                    className="mt-1 font-sans text-[13px] leading-snug"
                    style={{ color: '#1F2A24' }}
                  >
                    {p.body}
                  </p>

                  {p.hasCard && (
                    <div
                      className="mt-2 overflow-hidden rounded-xl border"
                      style={{ borderColor: BORDER }}
                    >
                      <div
                        className="h-20 w-full"
                        style={{
                          background:
                            'linear-gradient(120deg, rgba(20,67,42,0.85) 0%, rgba(20,67,42,0.55) 60%, rgba(201,165,62,0.85) 100%)',
                        }}
                        aria-hidden
                      />
                      <div className="flex items-center justify-between gap-3 p-3">
                        <div>
                          <div className="font-sans text-[10.5px] uppercase tracking-[0.16em]" style={{ color: '#8A6E1B' }}>
                            centuriesmutual.com
                          </div>
                          <div className="font-sans text-[12.5px] font-semibold" style={{ color: GREEN }}>
                            Lease — Cedar Park, sealed Feb 1
                          </div>
                          <div className="font-sans text-[11px]" style={{ color: GRAY }}>
                            Audit log · 14 events · Yours to keep
                          </div>
                        </div>
                        <span className="font-sans text-[10px] uppercase tracking-[0.14em]" style={{ color: GOLD }}>
                          View →
                        </span>
                      </div>
                    </div>
                  )}

                  {/* action bar */}
                  <div
                    className="mt-2 flex max-w-md items-center justify-between font-sans text-[11px]"
                    style={{ color: GRAY }}
                  >
                    <span className="flex items-center gap-1">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden>
                        <path d="M21 12a8 8 0 0 1-12 7l-5 1 1-5a8 8 0 1 1 16-3z" stroke={GRAY} strokeWidth="1.4" />
                      </svg>
                      {p.replies}
                    </span>
                    <span className="flex items-center gap-1">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden>
                        <path d="M7 7h10l-2-2M17 17H7l2 2" stroke={GRAY} strokeWidth="1.4" strokeLinecap="round" />
                      </svg>
                      {p.reposts}
                    </span>
                    <span className="flex items-center gap-1">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden>
                        <path
                          d="M12 21s-7-4.5-9-9a5 5 0 0 1 9-3 5 5 0 0 1 9 3c-2 4.5-9 9-9 9z"
                          stroke={i === 0 ? GOLD : GRAY}
                          strokeWidth="1.4"
                          fill={i === 0 ? 'rgba(201,165,62,0.18)' : 'none'}
                        />
                      </svg>
                      <span style={{ color: i === 0 ? GOLD : GRAY }}>{p.likes}</span>
                    </span>
                    <span>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden>
                        <path d="M5 5v16l7-5 7 5V5z" stroke={GRAY} strokeWidth="1.4" />
                      </svg>
                    </span>
                    <span>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden>
                        <path d="M4 12h16M12 4v16" stroke={GRAY} strokeWidth="1.4" strokeLinecap="round" />
                      </svg>
                    </span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>

        {/* Trends rail */}
        <aside className="hidden flex-col gap-3 px-4 py-3 sm:flex">
          <div
            className="rounded-xl border bg-white p-3"
            style={{ borderColor: BORDER }}
          >
            <Eyebrow>Trending in your corridor</Eyebrow>
            <div className="mt-2 space-y-3">
              {TRENDS.map((t) => (
                <div key={t.topic}>
                  <div className="font-sans text-[12.5px] font-semibold" style={{ color: GREEN }}>
                    {t.topic}
                  </div>
                  <div className="font-mono text-[10.5px]" style={{ color: GRAY }}>
                    {t.volume}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div
            className="rounded-xl border p-3"
            style={{ borderColor: BORDER, background: '#FAFCFB' }}
          >
            <Eyebrow>Who to follow</Eyebrow>
            <div className="mt-2 space-y-2">
              {[
                { i: 'NA', n: 'North Austin Corridor', h: '@nax.corridor' },
                { i: 'CP', n: 'Cedar Park Hosts', h: '@cphosts' },
              ].map((u) => (
                <div key={u.h} className="flex items-center gap-2">
                  <Avatar initials={u.i} />
                  <div className="min-w-0 flex-1">
                    <div className="truncate font-sans text-[12px] font-semibold" style={{ color: GREEN }}>
                      {u.n}
                    </div>
                    <div className="truncate font-sans text-[10.5px]" style={{ color: GRAY }}>
                      {u.h}
                    </div>
                  </div>
                  <button
                    type="button"
                    tabIndex={-1}
                    aria-hidden
                    className="rounded-full border px-2.5 py-1 font-sans text-[10.5px] font-bold"
                    style={{ borderColor: GREEN, color: GREEN }}
                  >
                    Follow
                  </button>
                </div>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </WindowFrame>
  )
}

/* ────────────────────────────────────────────────────────────────────────── */
/* 8. Treasury — Calendar / Notes / Messages / Wallet                         */
/* ────────────────────────────────────────────────────────────────────────── */

const NOTES = [
  { done: true, text: 'Confirm move-in walkthrough', meta: 'Today · 3:00 PM' },
  { done: true, text: 'Sign deposit escrow release', meta: 'Yesterday' },
  { done: false, text: 'Update beneficiary on policy', meta: 'Due Fri' },
  { done: false, text: 'Reconcile April utilities', meta: 'Apr 30' },
]

const MESSAGES_PREVIEW = [
  { initials: 'MR', name: 'Maya Reyes', preview: 'I’ll bring the lease draft.', time: '2m', tone: 'gold' as const },
  { initials: 'CP', name: 'Cedar Park HOA', preview: 'Q2 statement is ready', time: '1h', tone: 'green' as const },
  { initials: 'CM', name: 'Concierge', preview: 'Your trust score updated', time: '3h', tone: 'green' as const },
]

const TXNS = [
  { label: 'Rent · Cedar Park, LLC', amount: '−$1,640.00', meta: 'Apr 1', tone: 'out' as const },
  { label: 'Deposit released to escrow', amount: '+$1,640.00', meta: 'Mar 28', tone: 'in' as const },
  { label: 'Utilities split — settled', amount: '−$184.20', meta: 'Mar 25', tone: 'out' as const },
]

function MiniCalendar() {
  const days = Array.from({ length: 30 }, (_, i) => i + 1)
  const today = 14
  const events = new Set([3, 9, 14, 19, 27])

  return (
    <div className="rounded-xl border bg-white p-3" style={{ borderColor: BORDER }}>
      <div className="flex items-center justify-between">
        <Eyebrow>Calendar</Eyebrow>
        <span
          className="font-serif"
          style={{
            fontFamily: "'Playfair Display', Georgia, serif",
            color: GREEN,
            fontSize: '13px',
            fontWeight: 600,
          }}
        >
          April 2026
        </span>
      </div>
      <div className="mt-2 grid grid-cols-7 gap-1 font-sans text-[10px] uppercase tracking-[0.1em]" style={{ color: GRAY }}>
        {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => (
          <span key={`h-${i}`} className="text-center">
            {d}
          </span>
        ))}
      </div>
      <div className="mt-1 grid grid-cols-7 gap-1">
        {/* offset for April 2026 (Wed start) */}
        {Array.from({ length: 3 }).map((_, i) => (
          <span key={`o-${i}`} aria-hidden />
        ))}
        {days.map((d) => {
          const active = d === today
          const isEvent = events.has(d)
          return (
            <span
              key={d}
              className="relative grid h-6 place-items-center rounded text-center font-sans text-[11px]"
              style={{
                background: active ? GREEN : 'transparent',
                color: active ? PAPER : GREEN,
                fontWeight: active ? 700 : 500,
              }}
            >
              {d}
              {isEvent && !active && (
                <span
                  aria-hidden
                  className="absolute bottom-0.5 h-1 w-1 rounded-full"
                  style={{ background: GOLD }}
                />
              )}
            </span>
          )
        })}
      </div>
      <div className="mt-2 flex items-center justify-between font-sans text-[10.5px]" style={{ color: GRAY }}>
        <span>· 5 events this month</span>
        <span style={{ color: GOLD }}>Today: Move-in walkthrough</span>
      </div>
    </div>
  )
}

function NotesCard() {
  return (
    <div className="rounded-xl border bg-white p-3" style={{ borderColor: BORDER }}>
      <div className="flex items-center justify-between">
        <Eyebrow>Notes & tasks</Eyebrow>
        <span className="font-sans text-[10px]" style={{ color: GRAY }}>
          4 items · 2 done
        </span>
      </div>
      <ul className="mt-2 space-y-1.5">
        {NOTES.map((n) => (
          <li key={n.text} className="flex items-center gap-2">
            <span
              aria-hidden
              className="grid h-4 w-4 shrink-0 place-items-center rounded border"
              style={{
                borderColor: n.done ? GREEN : 'rgba(20,67,42,0.4)',
                background: n.done ? GREEN : 'transparent',
              }}
            >
              {n.done && (
                <svg width="9" height="9" viewBox="0 0 24 24" fill="none" aria-hidden>
                  <path d="M5 12l5 5 9-11" stroke={GOLD} strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              )}
            </span>
            <span
              className="flex-1 font-sans text-[12px]"
              style={{ color: GREEN, textDecoration: n.done ? 'line-through' : 'none', opacity: n.done ? 0.65 : 1 }}
            >
              {n.text}
            </span>
            <span className="font-mono text-[10px]" style={{ color: GRAY }}>
              {n.meta}
            </span>
          </li>
        ))}
      </ul>
    </div>
  )
}

function MessagesCard() {
  return (
    <div className="rounded-xl border bg-white p-3" style={{ borderColor: BORDER }}>
      <div className="flex items-center justify-between">
        <Eyebrow>Messages</Eyebrow>
        <span className="font-sans text-[10px]" style={{ color: GRAY }}>
          3 unread
        </span>
      </div>
      <div className="mt-2 space-y-2">
        {MESSAGES_PREVIEW.map((m) => (
          <div key={m.name} className="flex items-center gap-2">
            <Avatar initials={m.initials} tone={m.tone} />
            <div className="min-w-0 flex-1">
              <div className="flex items-baseline justify-between gap-2">
                <span className="truncate font-sans text-[12px] font-semibold" style={{ color: GREEN }}>
                  {m.name}
                </span>
                <span className="font-mono text-[10px]" style={{ color: GRAY }}>
                  {m.time}
                </span>
              </div>
              <span className="line-clamp-1 font-sans text-[11px]" style={{ color: GRAY }}>
                {m.preview}
              </span>
            </div>
            <span className="h-1.5 w-1.5 rounded-full nb-pin-pulse" style={{ background: GOLD }} aria-hidden />
          </div>
        ))}
      </div>
    </div>
  )
}

function WalletCard() {
  return (
    <div
      className="rounded-xl border p-3"
      style={{ borderColor: 'rgba(20,67,42,0.45)', background: GREEN, color: PAPER }}
    >
      <div className="flex items-center justify-between">
        <span
          className="font-sans text-[9.5px] font-semibold uppercase tracking-[0.18em]"
          style={{ color: 'rgba(250,252,251,0.72)' }}
        >
          Wallet
        </span>
        <span
          className="font-sans text-[9.5px] font-bold uppercase tracking-[0.16em]"
          style={{ color: GOLD }}
        >
          ●●●● 4218
        </span>
      </div>
      <div className="mt-1.5 flex items-baseline gap-2">
        <span
          className="font-serif"
          style={{
            fontFamily: "'Playfair Display', Georgia, serif",
            fontSize: '24px',
            lineHeight: 1,
            fontWeight: 600,
            letterSpacing: '-0.01em',
          }}
        >
          $4,218.40
        </span>
        <span className="font-sans text-[10.5px]" style={{ color: 'rgba(250,252,251,0.7)' }}>
          available
        </span>
      </div>
      <div
        className="mt-2 divide-y rounded-lg"
        style={{ background: 'rgba(255,255,255,0.06)', borderColor: 'rgba(255,255,255,0.1)' }}
      >
        {TXNS.map((t) => (
          <div key={t.label} className="flex items-center gap-2 px-2.5 py-1.5">
            <span
              className="grid h-5 w-5 place-items-center rounded-full"
              style={{
                background:
                  t.tone === 'in'
                    ? 'rgba(34,197,94,0.18)'
                    : 'rgba(255,255,255,0.08)',
                color: t.tone === 'in' ? '#A7F3D0' : '#E5E7EB',
              }}
            >
              {t.tone === 'in' ? '+' : '−'}
            </span>
            <span className="flex-1 truncate font-sans text-[11px]">{t.label}</span>
            <span className="font-mono text-[10.5px]" style={{ color: t.tone === 'in' ? '#A7F3D0' : '#E5E7EB' }}>
              {t.amount}
            </span>
            <span className="font-mono text-[10px]" style={{ color: 'rgba(250,252,251,0.6)' }}>
              {t.meta}
            </span>
          </div>
        ))}
      </div>
      <div className="mt-2 flex items-center justify-between">
        <span className="font-sans text-[10px] uppercase tracking-[0.14em]" style={{ color: 'rgba(250,252,251,0.6)' }}>
          Treasury · Apr ledger
        </span>
        <span
          className="font-sans text-[10px] font-bold uppercase tracking-[0.14em]"
          style={{ color: GOLD }}
        >
          Reconcile →
        </span>
      </div>
    </div>
  )
}

export function TreasuryModal({ className }: Props) {
  return (
    <WindowFrame
      className={className}
      eyebrow="Centuries Mutual"
      title="Treasury — Daily Operations"
      badge={{ tone: 'live', label: 'Synced' }}
    >
      <div className="grid grid-cols-1 gap-3 px-4 py-4 sm:grid-cols-2">
        <MiniCalendar />
        <NotesCard />
        <MessagesCard />
        <WalletCard />
      </div>

      <div
        className="flex items-center justify-between border-t px-4 py-2.5"
        style={{ borderColor: BORDER, background: '#F1F3F2' }}
      >
        <span className="font-sans text-[10.5px] uppercase tracking-[0.14em]" style={{ color: GRAY }}>
          Auto-reconciled · 04:14 UTC
        </span>
        <span className="font-sans text-[10.5px] uppercase tracking-[0.14em]" style={{ color: GOLD }}>
          Open Treasury →
        </span>
      </div>
    </WindowFrame>
  )
}
