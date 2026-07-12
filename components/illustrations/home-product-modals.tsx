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
/* 4. Compound earnings — member-only growth                                  */
/* ────────────────────────────────────────────────────────────────────────── */

const COMPOUND_FIELDS: { l: string; v: string }[] = [
  { l: 'Member', v: 'Maya Reyes' },
  { l: 'Program', v: 'Centuries Mutual Exclusive' },
  { l: 'Principal', v: '$4,218.40' },
  { l: 'Compound rate', v: '4.25% APY · Daily' },
  { l: 'YTD growth', v: '+$186.40' },
  { l: 'Next credit', v: 'Tonight · 11:59 PM CT' },
]

export function EDocumentSystemModal({ className }: Props) {
  return (
    <WindowFrame
      className={className}
      eyebrow="Centuries Mutual"
      title="Compound Earnings — Member Only"
      badge={{ tone: 'gold', label: 'Exclusive' }}
    >
      <div className="px-5 py-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <Eyebrow>Growth ledger</Eyebrow>
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
              Compound inside Centuries Mutual
            </h3>
            <p className="mt-1 font-sans text-[11px]" style={{ color: GRAY }}>
              Account · CM-CMP-00482 · Accruing since Jan 12
            </p>
          </div>

          <div
            className="nb-seal-pulse flex h-14 w-14 shrink-0 flex-col items-center justify-center rounded-full border"
            style={{ borderColor: GOLD, background: PAPER }}
          >
            <span
              className="font-serif leading-none"
              style={{
                fontFamily: "'Playfair Display', Georgia, serif",
                color: GREEN,
                fontSize: '16px',
                fontWeight: 700,
              }}
            >
              4.25
            </span>
            <span className="font-sans text-[8px] font-bold uppercase tracking-[0.14em]" style={{ color: GOLD }}>
              % APY
            </span>
          </div>
        </div>

        <div
          className="mt-4 overflow-hidden rounded-xl border p-3"
          style={{
            borderColor: 'rgba(20,67,42,0.2)',
            background: `linear-gradient(135deg, ${GREEN} 0%, #1A5938 55%, #0F3321 100%)`,
            color: PAPER,
          }}
        >
          <div className="flex items-center justify-between">
            <span className="font-sans text-[9.5px] font-semibold uppercase tracking-[0.18em]" style={{ color: 'rgba(250,252,251,0.7)' }}>
              Projected 12-month value
            </span>
            <Pill tone="gold">Member only</Pill>
          </div>
          <div className="mt-1.5 flex items-baseline gap-2">
            <span
              className="font-serif"
              style={{
                fontFamily: "'Playfair Display', Georgia, serif",
                fontSize: '28px',
                fontWeight: 600,
                letterSpacing: '-0.01em',
              }}
            >
              $4,402.18
            </span>
            <span className="font-sans text-[11px]" style={{ color: '#A7F3D0' }}>
              +$183.78 if left to compound
            </span>
          </div>
          <svg viewBox="0 0 280 48" className="mt-2 h-10 w-full" aria-hidden>
            <path
              d="M0 40 C 40 38, 60 36, 80 32 S 120 24, 140 20 S 180 14, 200 10 S 240 6, 280 2"
              fill="none"
              stroke={GOLD}
              strokeWidth="2"
              strokeLinecap="round"
              className="nb-title-line nb-title-line-animate"
            />
            <path
              d="M0 40 C 40 38, 60 36, 80 32 S 120 24, 140 20 S 180 14, 200 10 S 240 6, 280 2 L 280 48 L 0 48 Z"
              fill="rgba(201,165,62,0.18)"
            />
          </svg>
        </div>

        <div className="mt-4 divide-y rounded-xl border bg-white" style={{ borderColor: BORDER }}>
          {COMPOUND_FIELDS.map((f) => (
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

        <div className="mt-4 flex items-center justify-between gap-3 pb-1">
          <div className="flex flex-wrap items-center gap-2">
            <Pill>Daily compound</Pill>
            <Pill tone="gold">Exclusive to CM</Pill>
          </div>
          <button
            type="button"
            tabIndex={-1}
            aria-hidden
            className="rounded-lg px-3 py-1.5 font-sans text-[11px] font-semibold"
            style={{ background: GREEN, color: PAPER }}
          >
            Keep compounding
          </button>
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
/* 6. Rewards wallet attachment                                               */
/* ────────────────────────────────────────────────────────────────────────── */

const REWARD_ROWS = [
  {
    label: 'On-time rent credit',
    meta: 'Apr 1 · Cedar Park lease',
    amount: '+$24.60',
    tone: 'in' as const,
  },
  {
    label: 'Utilities autopay bonus',
    meta: 'Mar 28 · Electric + water',
    amount: '+$8.40',
    tone: 'in' as const,
  },
  {
    label: 'Grocery checkout reward',
    meta: 'Mar 22 · Household basket',
    amount: '+$6.15',
    tone: 'in' as const,
  },
]

export function RoommateDirectoryModal({ className }: Props) {
  return (
    <WindowFrame
      className={className}
      eyebrow="Centuries Mutual"
      title="Rewards Wallet — Attached"
      badge={{ tone: 'gold', label: 'Linked' }}
    >
      <div className="px-5 py-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <Eyebrow>Account attachment</Eyebrow>
            <h3
              className="mt-1 font-serif"
              style={{
                fontFamily: "'Playfair Display', Georgia, serif",
                color: GREEN,
                fontSize: '17px',
                fontWeight: 600,
              }}
            >
              Wallet clipped to your membership
            </h3>
            <p className="mt-1 font-sans text-[11px]" style={{ color: GRAY }}>
              Maya Reyes · Member since Jan 2026
            </p>
          </div>
          <Pill tone="gold">Supplemental</Pill>
        </div>

        <div
          className="mt-4 rounded-xl border p-4"
          style={{ borderColor: 'rgba(20,67,42,0.35)', background: GREEN, color: PAPER }}
        >
          <div className="flex items-center justify-between">
            <span className="font-sans text-[9.5px] font-semibold uppercase tracking-[0.18em]" style={{ color: 'rgba(250,252,251,0.72)' }}>
              Rewards balance
            </span>
            <span className="font-mono text-[10px]" style={{ color: GOLD }}>
              ●●●● 7842
            </span>
          </div>
          <div className="mt-1.5 flex items-baseline gap-2">
            <span
              className="font-serif"
              style={{
                fontFamily: "'Playfair Display', Georgia, serif",
                fontSize: '28px',
                fontWeight: 600,
                letterSpacing: '-0.01em',
              }}
            >
              $186.40
            </span>
            <span className="font-sans text-[11px]" style={{ color: '#A7F3D0' }}>
              +$39.15 this month
            </span>
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            <span
              className="rounded-md px-2 py-1 font-sans text-[10px] font-semibold uppercase tracking-[0.12em]"
              style={{ background: 'rgba(255,255,255,0.1)', color: PAPER }}
            >
              Attached to CM account
            </span>
            <span
              className="rounded-md px-2 py-1 font-sans text-[10px] font-semibold uppercase tracking-[0.12em]"
              style={{ background: 'rgba(201,165,62,0.22)', color: GOLD }}
            >
              Earns on eligible activity
            </span>
          </div>
        </div>

        <div className="mt-4">
          <div className="mb-2 flex items-center justify-between">
            <Eyebrow>Recent accruals</Eyebrow>
            <span className="font-sans text-[10px] uppercase tracking-[0.14em]" style={{ color: GRAY }}>
              Updated daily
            </span>
          </div>
          <div className="divide-y rounded-xl border bg-white" style={{ borderColor: BORDER }}>
            {REWARD_ROWS.map((r) => (
              <div key={r.label} className="flex items-center gap-3 px-3 py-2.5">
                <span
                  className="grid h-7 w-7 place-items-center rounded-full font-sans text-[12px] font-bold"
                  style={{ background: 'rgba(20,67,42,0.08)', color: GREEN }}
                >
                  +
                </span>
                <div className="min-w-0 flex-1">
                  <div className="font-sans text-[12.5px] font-semibold" style={{ color: GREEN }}>
                    {r.label}
                  </div>
                  <div className="font-sans text-[10.5px]" style={{ color: GRAY }}>
                    {r.meta}
                  </div>
                </div>
                <span className="font-mono text-[12px] font-semibold" style={{ color: GREEN }}>
                  {r.amount}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between border-t pt-3" style={{ borderColor: BORDER }}>
          <span className="font-sans text-[10.5px] uppercase tracking-[0.14em]" style={{ color: GRAY }}>
            Status · Attached &amp; accruing
          </span>
          <span className="font-sans text-[10.5px] font-bold uppercase tracking-[0.14em]" style={{ color: GOLD }}>
            Manage wallet →
          </span>
        </div>
      </div>
    </WindowFrame>
  )
}

/* ────────────────────────────────────────────────────────────────────────── */
/* 7. Pay — Rent / Bills / Groceries                                          */
/* ────────────────────────────────────────────────────────────────────────── */

const PAY_TABS = ['Rent', 'Bills', 'Groceries'] as const

const PAY_SCHEDULE = [
  {
    kind: 'Rent',
    payee: 'Cedar Park Holdings, LLC',
    amount: '$1,640.00',
    due: 'Due Apr 1',
    status: 'Scheduled',
  },
  {
    kind: 'Electric',
    payee: 'Austin Energy',
    amount: '$112.40',
    due: 'Due Mar 28',
    status: 'Ready',
  },
  {
    kind: 'Groceries',
    payee: 'Household basket',
    amount: '$84.15',
    due: 'Checkout open',
    status: 'Draft',
  },
]

const RECENT_PAYS = [
  { label: 'Rent · Mar', amount: '−$1,640.00', meta: 'Mar 1' },
  { label: 'Water · Q1', amount: '−$64.20', meta: 'Mar 12' },
  { label: 'Groceries · H-E-B', amount: '−$97.80', meta: 'Mar 18' },
]

export function TwitterFeedModal({ className }: Props) {
  return (
    <WindowFrame
      className={className}
      eyebrow="Centuries Mutual"
      title="Pay — Rent, Bills & Groceries"
      badge={{ tone: 'live', label: 'Live' }}
    >
      <div className="grid grid-cols-1 sm:grid-cols-[1.55fr_1fr]">
        <div className="border-r" style={{ borderColor: BORDER }}>
          <div
            className="flex items-center justify-between border-b bg-white px-4"
            style={{ borderColor: BORDER }}
          >
            {PAY_TABS.map((t, i) => (
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

          <div className="px-4 py-3">
            <div
              className="rounded-xl border p-3"
              style={{ borderColor: BORDER, background: '#FAFCFB' }}
            >
              <Eyebrow>Next rent</Eyebrow>
              <div className="mt-1 flex items-baseline justify-between gap-2">
                <span
                  className="font-serif"
                  style={{
                    fontFamily: "'Playfair Display', Georgia, serif",
                    color: GREEN,
                    fontSize: '24px',
                    fontWeight: 600,
                  }}
                >
                  $1,640.00
                </span>
                <span className="font-sans text-[11px]" style={{ color: GRAY }}>
                  Cedar Park · Apr 1
                </span>
              </div>
              <div className="mt-3 flex gap-2">
                <button
                  type="button"
                  tabIndex={-1}
                  aria-hidden
                  className="rounded-lg px-3 py-1.5 font-sans text-[11px] font-semibold"
                  style={{ background: GREEN, color: PAPER }}
                >
                  Pay now
                </button>
                <button
                  type="button"
                  tabIndex={-1}
                  aria-hidden
                  className="rounded-lg border px-3 py-1.5 font-sans text-[11px] font-semibold"
                  style={{ borderColor: GREEN, color: GREEN }}
                >
                  Keep scheduled
                </button>
              </div>
            </div>

            <div className="mt-3 space-y-2">
              {PAY_SCHEDULE.map((p) => (
                <div
                  key={p.payee + p.kind}
                  className="flex items-center gap-3 rounded-xl border bg-white px-3 py-2.5"
                  style={{ borderColor: BORDER }}
                >
                  <div
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg font-sans text-[10px] font-bold uppercase tracking-[0.06em]"
                    style={{ background: 'rgba(20,67,42,0.08)', color: GREEN }}
                  >
                    {p.kind.slice(0, 2)}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="truncate font-sans text-[12.5px] font-semibold" style={{ color: GREEN }}>
                      {p.payee}
                    </div>
                    <div className="font-sans text-[10.5px]" style={{ color: GRAY }}>
                      {p.kind} · {p.due}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-mono text-[12px] font-semibold" style={{ color: GREEN }}>
                      {p.amount}
                    </div>
                    <div className="font-sans text-[9.5px] uppercase tracking-[0.12em]" style={{ color: GOLD }}>
                      {p.status}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <aside className="flex flex-col gap-3 px-4 py-3">
          <div className="rounded-xl border bg-white p-3" style={{ borderColor: BORDER }}>
            <Eyebrow>Wallet available</Eyebrow>
            <div
              className="mt-1 font-serif"
              style={{
                fontFamily: "'Playfair Display', Georgia, serif",
                color: GREEN,
                fontSize: '22px',
                fontWeight: 600,
              }}
            >
              $4,218.40
            </div>
            <p className="mt-1 font-sans text-[11px]" style={{ color: GRAY }}>
              Ready for rent, bills, or groceries
            </p>
          </div>

          <div className="rounded-xl border p-3" style={{ borderColor: BORDER, background: '#FAFCFB' }}>
            <Eyebrow>Recent sends</Eyebrow>
            <div className="mt-2 space-y-2">
              {RECENT_PAYS.map((r) => (
                <div key={r.label} className="flex items-center justify-between gap-2">
                  <div>
                    <div className="font-sans text-[12px] font-semibold" style={{ color: GREEN }}>
                      {r.label}
                    </div>
                    <div className="font-mono text-[10px]" style={{ color: GRAY }}>
                      {r.meta}
                    </div>
                  </div>
                  <span className="font-mono text-[11px]" style={{ color: GRAY }}>
                    {r.amount}
                  </span>
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
/* 8. Fitness — My Brother's Keeper integration                               */
/* ────────────────────────────────────────────────────────────────────────── */

const WORKOUTS = [
  { done: true, text: 'Morning run · 3.2 mi', meta: 'Today · 6:40 AM' },
  { done: true, text: 'Strength · upper body', meta: 'Yesterday' },
  { done: false, text: 'Mobility · 20 min', meta: 'Due today' },
  { done: false, text: 'Zone 2 bike · 45 min', meta: 'Fri goal' },
]

const SYNC_EVENTS = [
  { initials: 'MB', name: 'My Brother’s Keeper', preview: 'Weekly plan synced', time: '2m', tone: 'gold' as const },
  { initials: 'CM', name: 'Centuries Mutual', preview: 'Fitness credit queued', time: '1h', tone: 'green' as const },
  { initials: 'MR', name: 'Maya Reyes', preview: 'Streak: 12 days', time: '3h', tone: 'green' as const },
]

function FitnessWeek() {
  const days = ['M', 'T', 'W', 'T', 'F', 'S', 'S']
  const active = new Set([0, 1, 2, 3, 5])
  return (
    <div className="rounded-xl border bg-white p-3" style={{ borderColor: BORDER }}>
      <div className="flex items-center justify-between">
        <Eyebrow>This week</Eyebrow>
        <span
          className="font-serif"
          style={{
            fontFamily: "'Playfair Display', Georgia, serif",
            color: GREEN,
            fontSize: '13px',
            fontWeight: 600,
          }}
        >
          Apr 6–12
        </span>
      </div>
      <div className="mt-3 grid grid-cols-7 gap-1.5">
        {days.map((d, i) => (
          <div key={`${d}-${i}`} className="flex flex-col items-center gap-1.5">
            <span className="font-sans text-[10px] uppercase tracking-[0.1em]" style={{ color: GRAY }}>
              {d}
            </span>
            <span
              className="grid h-8 w-8 place-items-center rounded-full font-sans text-[11px] font-semibold"
              style={{
                background: active.has(i) ? GREEN : 'rgba(20,67,42,0.06)',
                color: active.has(i) ? PAPER : GREEN,
              }}
            >
              {active.has(i) ? '✓' : '·'}
            </span>
          </div>
        ))}
      </div>
      <div className="mt-2 flex items-center justify-between font-sans text-[10.5px]" style={{ color: GRAY }}>
        <span>· 5 of 7 days logged</span>
        <span style={{ color: GOLD }}>Streak · 12 days</span>
      </div>
    </div>
  )
}

function WorkoutPlan() {
  return (
    <div className="rounded-xl border bg-white p-3" style={{ borderColor: BORDER }}>
      <div className="flex items-center justify-between">
        <Eyebrow>Workout plan</Eyebrow>
        <span className="font-sans text-[10px]" style={{ color: GRAY }}>
          Via mybrotherskeeper.cc
        </span>
      </div>
      <ul className="mt-2 space-y-1.5">
        {WORKOUTS.map((n) => (
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

function SyncFeed() {
  return (
    <div className="rounded-xl border bg-white p-3" style={{ borderColor: BORDER }}>
      <div className="flex items-center justify-between">
        <Eyebrow>Sync feed</Eyebrow>
        <span className="font-sans text-[10px]" style={{ color: GRAY }}>
          Connected
        </span>
      </div>
      <div className="mt-2 space-y-2">
        {SYNC_EVENTS.map((m) => (
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

function FitnessRewardsCard() {
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
          Fitness → rewards
        </span>
        <span
          className="font-sans text-[9.5px] font-bold uppercase tracking-[0.16em]"
          style={{ color: GOLD }}
        >
          MBK linked
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
          +$18.50
        </span>
        <span className="font-sans text-[10.5px]" style={{ color: 'rgba(250,252,251,0.7)' }}>
          this week
        </span>
      </div>
      <div className="mt-3 space-y-1.5">
        {[
          { label: 'Run streak bonus', amount: '+$8.00' },
          { label: 'Strength sessions ×3', amount: '+$6.50' },
          { label: 'Weekly goal met', amount: '+$4.00' },
        ].map((row) => (
          <div key={row.label} className="flex items-center justify-between font-sans text-[11px]">
            <span style={{ color: 'rgba(250,252,251,0.85)' }}>{row.label}</span>
            <span className="font-mono" style={{ color: '#A7F3D0' }}>
              {row.amount}
            </span>
          </div>
        ))}
      </div>
      <div className="mt-2 flex items-center justify-between">
        <span className="font-sans text-[10px] uppercase tracking-[0.14em]" style={{ color: 'rgba(250,252,251,0.6)' }}>
          mybrotherskeeper.cc
        </span>
        <span
          className="font-sans text-[10px] font-bold uppercase tracking-[0.14em]"
          style={{ color: GOLD }}
        >
          Open app →
        </span>
      </div>
    </div>
  )
}

export function TreasuryModal({ className }: Props) {
  return (
    <WindowFrame
      className={className}
      eyebrow="Centuries Mutual × MBK"
      title="Fitness — My Brother’s Keeper"
      badge={{ tone: 'live', label: 'Synced' }}
    >
      <div className="grid grid-cols-1 gap-3 px-4 py-4 sm:grid-cols-2">
        <FitnessWeek />
        <WorkoutPlan />
        <SyncFeed />
        <FitnessRewardsCard />
      </div>

      <div
        className="flex items-center justify-between border-t px-4 py-2.5"
        style={{ borderColor: BORDER, background: '#F1F3F2' }}
      >
        <span className="font-sans text-[10.5px] uppercase tracking-[0.14em]" style={{ color: GRAY }}>
          Last sync · 04:14 UTC
        </span>
        <span className="font-sans text-[10.5px] uppercase tracking-[0.14em]" style={{ color: GOLD }}>
          mybrotherskeeper.cc →
        </span>
      </div>
    </WindowFrame>
  )
}
