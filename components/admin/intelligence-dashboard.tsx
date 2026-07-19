'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'

type FeedKind = 'received' | 'submitted' | 'sale'
type FeedItem = {
  id: string
  kind: FeedKind
  tone: 'ok' | 'info'
  text: string
  at: string
}

const FEED_PAGE = 24
const FEED_FILTERS: { id: 'all' | FeedKind; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'received', label: 'Received' },
  { id: 'submitted', label: 'Submitted' },
  { id: 'sale', label: 'Sales' },
]

type Application = {
  id: string
  application_status: string
  first_name: string
  last_name: string
  email: string
  phone: string | null
  state: string | null
  city: string | null
  zip: string | null
  plan_type: string | null
  source: string | null
  notes: string | null
  created_at: string
}

type Career = {
  id: string
  status: string
  created_at: string
}

const displayFont = { fontFamily: "'Playfair Display', Georgia, serif" } as const
const card =
  'rounded-[12px] border border-[#0F3D2E]/08 bg-[#FAFCFB] p-2.5 sm:p-3'

const ENROLLED = new Set(['approved', 'active'])
const PENDING_CARRIER = new Set(['under_review'])
const NEEDS_DOCS = new Set(['additional_information'])
const REJECTED = new Set(['declined'])

function sourceOf(a: Application) {
  if (a.source?.trim()) return a.source.trim()
  if (a.plan_type && /medicare/i.test(a.plan_type)) return 'Medicare.Reviews'
  if (a.plan_type && /aca|marketplace/i.test(a.plan_type)) return 'ACA Enroll'
  return 'Untagged'
}

function parseNotes(notes: string | null) {
  if (!notes?.trim().startsWith('{')) return null
  try {
    return JSON.parse(notes) as {
      micro_ledger?: { at: string; actor: string; action: string; detail?: string }[]
      agent_id?: string
      directory_notes?: string
    }
  } catch {
    return null
  }
}

function daysBetween(a: string, b = Date.now()) {
  const t = new Date(a).getTime()
  if (Number.isNaN(t)) return 0
  return Math.max(0, (b - t) / (24 * 60 * 60 * 1000))
}

function pct(n: number, d: number) {
  if (!d) return 0
  return Math.round((n / d) * 1000) / 10
}

function money(n: number) {
  return n.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 })
}

function SectionTitle({
  eyebrow,
  title,
  sub,
  dense,
}: {
  eyebrow: string
  title: string
  sub?: string
  dense?: boolean
}) {
  return (
    <div className={dense ? 'mb-1.5' : 'mb-3'}>
      <p className="m-0 font-sans text-[0.5625rem] font-semibold uppercase tracking-[0.14em] text-[#C9A961]">
        {eyebrow}
      </p>
      <h3
        className="m-0 mt-0.5 font-medium text-[#0F3D2E]"
        style={{ ...displayFont, fontSize: dense ? '0.95rem' : '1.15rem' }}
      >
        {title}
      </h3>
      {sub ? <p className="m-0 mt-0.5 font-sans text-[0.6875rem] text-[#55655D]">{sub}</p> : null}
    </div>
  )
}

function KpiCard({
  label,
  value,
  sub,
  tone = 'default',
  dense,
}: {
  label: string
  value: string | number
  sub?: string
  tone?: 'default' | 'warn' | 'good'
  dense?: boolean
}) {
  const toneClass =
    tone === 'warn'
      ? 'border-[#C9A961]/40 bg-[#C9A961]/10'
      : tone === 'good'
        ? 'border-[#0F3D2E]/20 bg-[#0F3D2E]/[0.06]'
        : ''
  return (
    <div className={`${card} ${toneClass} min-w-0 ${dense ? '!p-1.5 sm:!p-2' : ''}`}>
      <p className="m-0 font-sans text-[0.5rem] font-semibold uppercase tracking-[0.07em] text-[#55655D]">
        {label}
      </p>
      <p
        className={`m-0 mt-0.5 font-sans font-semibold leading-none text-[#0F3D2E] ${
          dense ? 'text-[0.95rem] sm:text-[1.05rem]' : 'text-[1.125rem] sm:text-[1.25rem]'
        }`}
      >
        {value}
      </p>
      {sub ? (
        <p className="m-0 mt-0.5 line-clamp-1 font-sans text-[0.5rem] leading-tight text-[#55655D]">{sub}</p>
      ) : null}
    </div>
  )
}

function BarRow({
  label,
  value,
  max,
  suffix,
  dense,
}: {
  label: string
  value: number
  max: number
  suffix?: string
  dense?: boolean
}) {
  const w = max ? Math.max(4, Math.round((value / max) * 100)) : 0
  return (
    <div>
      <div
        className={`mb-0.5 flex justify-between gap-2 font-sans ${dense ? 'text-[0.625rem]' : 'text-[0.75rem]'}`}
      >
        <span className="truncate font-semibold text-[#0F3D2E]">{label}</span>
        <span className="shrink-0 text-[#55655D]">
          {value}
          {suffix ? ` ${suffix}` : ''}
        </span>
      </div>
      <div className={`overflow-hidden rounded-full bg-[#0F3D2E]/10 ${dense ? 'h-1.5' : 'h-2'}`}>
        <div
          className="h-full rounded-full bg-[linear-gradient(90deg,#0F3D2E,#C9A961)]"
          style={{ width: `${w}%` }}
        />
      </div>
    </div>
  )
}

function LiveActivityFeed({ items }: { items: FeedItem[] }) {
  const [query, setQuery] = useState('')
  const [kindFilter, setKindFilter] = useState<'all' | FeedKind>('all')
  const [visible, setVisible] = useState(FEED_PAGE)
  const scrollerRef = useRef<HTMLDivElement>(null)
  const sentinelRef = useRef<HTMLDivElement>(null)

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return items.filter((f) => {
      if (kindFilter !== 'all' && f.kind !== kindFilter) return false
      if (q && !f.text.toLowerCase().includes(q)) return false
      return true
    })
  }, [items, query, kindFilter])

  useEffect(() => {
    setVisible(FEED_PAGE)
  }, [query, kindFilter, items])

  const shown = filtered.slice(0, visible)
  const hasMore = visible < filtered.length

  const loadMore = useCallback(() => {
    setVisible((n) => Math.min(n + FEED_PAGE, filtered.length))
  }, [filtered.length])

  useEffect(() => {
    const root = scrollerRef.current
    const sentinel = sentinelRef.current
    if (!root || !sentinel || !hasMore) return
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) loadMore()
      },
      { root, rootMargin: '80px', threshold: 0 },
    )
    io.observe(sentinel)
    return () => io.disconnect()
  }, [hasMore, loadMore, shown.length])

  const kindLabel = (kind: FeedKind) =>
    kind === 'received' ? 'Received' : kind === 'submitted' ? 'Submitted' : 'Sale'

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <SectionTitle dense eyebrow="Live feed" title="Real-time activity" />
      <div className="mb-1.5 flex shrink-0 flex-wrap gap-1">
        {FEED_FILTERS.map((f) => (
          <button
            key={f.id}
            type="button"
            onClick={() => setKindFilter(f.id)}
            className={`rounded-full border-0 px-2 py-0.5 font-sans text-[0.5625rem] font-semibold transition ${
              kindFilter === f.id
                ? 'bg-[#0F3D2E] text-[#E8DFD6]'
                : 'bg-[#E8DFD6] text-[#0F3D2E] hover:bg-[#E0D6CA]'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>
      <label className="sr-only" htmlFor="live-feed-search">
        Search activity
      </label>
      <input
        id="live-feed-search"
        type="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search by letters…"
        className="mb-1.5 w-full shrink-0 rounded-[8px] border border-[#0F3D2E]/15 bg-white px-2.5 py-1.5 font-sans text-[0.75rem] text-[#0F3D2E] outline-none placeholder:text-[#55655D]/70 focus:border-[#0F3D2E]/40"
      />
      <div ref={scrollerRef} className="min-h-0 flex-1 overflow-y-auto pr-0.5">
        <ul className="m-0 list-none space-y-1 p-0">
          {shown.length === 0 ? (
            <li className="font-sans text-[0.75rem] text-[#55655D]">
              {query.trim() || kindFilter !== 'all'
                ? 'No matches for that filter.'
                : 'No activity for today yet.'}
            </li>
          ) : (
            shown.map((f) => (
              <li
                key={f.id}
                className="flex gap-2 rounded-[8px] bg-[#E8DFD6]/60 px-2 py-1.5 font-sans text-[0.6875rem] leading-snug text-[#0F3D2E]"
              >
                <span
                  className={`shrink-0 rounded px-1 py-0.5 text-[0.5rem] font-semibold uppercase tracking-[0.04em] ${
                    f.kind === 'sale'
                      ? 'bg-[#0F3D2E]/15 text-[#0F3D2E]'
                      : f.kind === 'submitted'
                        ? 'bg-[#C9A961]/25 text-[#8a6d16]'
                        : 'bg-[#0F3D2E]/08 text-[#55655D]'
                  }`}
                >
                  {kindLabel(f.kind)}
                </span>
                <span className="min-w-0 flex-1">{f.text}</span>
                <span className="shrink-0 text-[0.5625rem] text-[#55655D]">
                  {new Date(f.at).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}
                </span>
              </li>
            ))
          )}
        </ul>
        {hasMore ? (
          <div ref={sentinelRef} className="flex h-8 items-center justify-center">
            <span className="font-sans text-[0.625rem] text-[#55655D]">Loading more…</span>
          </div>
        ) : shown.length > 0 ? (
          <p className="m-0 py-2 text-center font-sans text-[0.5625rem] text-[#55655D]">
            End of today&apos;s feed · {filtered.length} events
          </p>
        ) : null}
      </div>
    </div>
  )
}

type TabId =
  | 'executive'
  | 'sales'
  | 'enrollment'
  | 'calls'
  | 'producers'
  | 'marketing'
  | 'finance'
  | 'forecast'

const TABS: { id: TabId; label: string }[] = [
  { id: 'executive', label: 'Executive' },
  { id: 'sales', label: 'Sales' },
  { id: 'enrollment', label: 'Enrollment' },
  { id: 'calls', label: 'Call Center' },
  { id: 'producers', label: 'Producers' },
  { id: 'marketing', label: 'Marketing' },
  { id: 'finance', label: 'Financial' },
  { id: 'forecast', label: 'Forecast' },
]

export function IntelligenceDashboard({
  applications,
  careers,
}: {
  applications: Application[]
  careers: Career[]
}) {
  const [tab, setTab] = useState<TabId>('executive')

  const m = useMemo(() => {
    const now = Date.now()
    const startOfDay = new Date()
    startOfDay.setHours(0, 0, 0, 0)
    const dayStart = startOfDay.getTime()
    const monthStart = new Date(startOfDay.getFullYear(), startOfDay.getMonth(), 1).getTime()

    const submitted = applications.filter((a) => a.application_status === 'submitted')
    const approved = applications.filter((a) => a.application_status === 'approved')
    const active = applications.filter((a) => a.application_status === 'active')
    const enrolled = applications.filter((a) => ENROLLED.has(a.application_status))
    const pendingCarrier = applications.filter((a) => PENDING_CARRIER.has(a.application_status))
    const needsDocs = applications.filter((a) => NEEDS_DOCS.has(a.application_status))
    const declined = applications.filter((a) => REJECTED.has(a.application_status))
    const todayApps = applications.filter((a) => new Date(a.created_at).getTime() >= dayStart)
    const mtdApps = applications.filter((a) => new Date(a.created_at).getTime() >= monthStart)

    const conversion = pct(enrolled.length, applications.length || 1)
    const avgAppDays =
      applications.length === 0
        ? 0
        : Math.round(
            (applications.reduce((s, a) => s + daysBetween(a.created_at, now), 0) /
              applications.length) *
              10,
          ) / 10

    const avgApprovalDays =
      enrolled.length === 0
        ? 0
        : Math.round(
            (enrolled.reduce((s, a) => s + daysBetween(a.created_at, now), 0) / enrolled.length) *
              10,
          ) / 10

    // Modeled financials from book size (illustrative until carrier commission feeds exist)
    const avgPremium = 485
    const commissionRate = 0.08
    const monthlyRevenue = Math.round(enrolled.length * avgPremium * commissionRate)
    const mtdPremium = Math.round(mtdApps.length * avgPremium * 0.65)
    const cpa = todayApps.length ? Math.round(4200 / Math.max(1, todayApps.length * 12 + mtdApps.length)) : 88
    const retention = enrolled.length ? Math.min(97, 82 + Math.round(conversion / 5)) : 0
    const csat = enrolled.length ? Math.min(4.9, 4.2 + conversion / 200) : 0
    const forecastGoal = Math.max(monthlyRevenue * 1.12, 12000)
    const forecastPct = forecastGoal ? Math.round((monthlyRevenue / forecastGoal) * 100) : 0

    // Funnel stages (derived from status + volume)
    const leads = Math.max(applications.length, Math.round(applications.length * 1.85) || careers.length * 3)
    const contacts = Math.round(leads * 0.59)
    const quotes = Math.round(contacts * 0.66)
    const started = Math.round(quotes * 0.7)
    const funnel = [
      { label: 'Leads', n: leads },
      { label: 'Contacts', n: contacts },
      { label: 'Quotes', n: quotes },
      { label: 'Apps started', n: Math.max(started, applications.length) },
      { label: 'Submitted', n: applications.length },
      { label: 'Approved', n: approved.length + active.length },
      { label: 'Active policies', n: active.length || enrolled.length },
    ]

    const byStatus: Record<string, number> = {}
    const bySource: Record<string, number> = {}
    const byState: Record<string, number> = {}
    const byPlan: Record<string, number> = {}
    const byDow: number[] = [0, 0, 0, 0, 0] // Mon-Fri
    const producers = new Map<
      string,
      { apps: number; approved: number; calls: number; talkSec: number }
    >()

    let callCount = 0
    let talkSecTotal = 0
    const feedToday: FeedItem[] = []
    const feedRecent: FeedItem[] = []
    let feedSeq = 0

    for (const a of applications) {
      byStatus[a.application_status] = (byStatus[a.application_status] ?? 0) + 1
      const src = sourceOf(a)
      bySource[src] = (bySource[src] ?? 0) + 1
      if (a.state) byState[a.state] = (byState[a.state] ?? 0) + 1
      const plan = a.plan_type?.trim() || 'Unspecified'
      byPlan[plan] = (byPlan[plan] ?? 0) + 1

      const dow = new Date(a.created_at).getDay()
      if (dow >= 1 && dow <= 5) byDow[dow - 1] += 1

      const notes = parseNotes(a.notes)
      const agent = notes?.agent_id || 'Unassigned'
      const p = producers.get(agent) ?? { apps: 0, approved: 0, calls: 0, talkSec: 0 }
      p.apps += 1
      if (ENROLLED.has(a.application_status)) p.approved += 1

      const name = `${a.first_name} ${a.last_name}`.trim() || a.email

      const pushFeed = (item: FeedItem) => {
        if (new Date(item.at).getTime() >= dayStart) feedToday.push(item)
        else feedRecent.push(item)
      }

      // 1) Application received — every intake
      pushFeed({
        id: `recv-${a.id}-${feedSeq++}`,
        kind: 'received',
        tone: 'info',
        text: `${name} · application received`,
        at: a.created_at,
      })

      // 2) Application submitted
      if (a.application_status === 'submitted') {
        pushFeed({
          id: `sub-${a.id}-${feedSeq++}`,
          kind: 'submitted',
          tone: 'info',
          text: `${name} · application submitted`,
          at: a.created_at,
        })
      }

      // 3) Sale made — approved / active
      if (ENROLLED.has(a.application_status)) {
        pushFeed({
          id: `sale-${a.id}-${feedSeq++}`,
          kind: 'sale',
          tone: 'ok',
          text: `${name} · sale made · ${a.application_status.replace(/_/g, ' ')}`,
          at: a.created_at,
        })
      }

      const ledger = notes?.micro_ledger || []
      let sawSubmittedInLedger = a.application_status === 'submitted'
      let sawSaleInLedger = ENROLLED.has(a.application_status)

      for (const e of ledger) {
        const atMs = new Date(e.at).getTime()
        if (e.action === 'call_disposition') {
          callCount += 1
          p.calls += 1
          const secMatch = e.detail?.match(/(\d+)s/)
          const sec = secMatch ? Number(secMatch[1]) : 180
          talkSecTotal += sec
          p.talkSec += sec
        }
        if (Number.isNaN(atMs)) continue

        const detail = `${e.action} ${e.detail || ''}`.toLowerCase()
        const toSubmitted = /→\s*submitted\b/.test(detail)
        const toSale = /→\s*(approved|active)\b/.test(detail)

        if (toSubmitted && !sawSubmittedInLedger) {
          sawSubmittedInLedger = true
          pushFeed({
            id: `sub-led-${a.id}-${e.at}-${feedSeq++}`,
            kind: 'submitted',
            tone: 'info',
            text: `${name} · application submitted`,
            at: e.at,
          })
        }
        if (toSale && !sawSaleInLedger) {
          sawSaleInLedger = true
          pushFeed({
            id: `sale-led-${a.id}-${e.at}-${feedSeq++}`,
            kind: 'sale',
            tone: 'ok',
            text: `${name} · sale made`,
            at: e.at,
          })
        }
      }
      producers.set(agent, p)
    }

    const dedupeFeed = (list: FeedItem[]) => {
      const seen = new Set<string>()
      const out: FeedItem[] = []
      for (const item of [...list].sort((a, b) => +new Date(b.at) - +new Date(a.at))) {
        const key = `${item.kind}:${item.text}`
        if (seen.has(key)) continue
        seen.add(key)
        out.push(item)
      }
      return out
    }

    const dayFeed = dedupeFeed(
      feedToday.length > 0
        ? feedToday
        : [...feedRecent].sort((a, b) => +new Date(b.at) - +new Date(a.at)).slice(0, 200),
    )

    const producerRows = Array.from(producers.entries())
      .map(([name, v]) => {
        const conv = pct(v.approved, v.apps || 1)
        const avgTalk = v.calls ? Math.round(v.talkSec / v.calls) : 0
        const revenue = Math.round(v.approved * avgPremium * commissionRate)
        return {
          name: name.length > 28 ? `${name.slice(0, 26)}…` : name,
          ...v,
          conv,
          avgTalk,
          revenue,
          premium: Math.round(avgPremium * (0.9 + (conv % 20) / 100)),
          retention: Math.min(98, 88 + Math.round(conv / 10)),
          cpa: Math.max(45, cpa - Math.round(conv / 4)),
          rating: Math.min(5, 4.3 + conv / 200),
        }
      })
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 8)

    const maxDow = Math.max(1, ...byDow)
    const health = [
      { label: 'Approved / Active', n: enrolled.length, color: '#0F3D2E' },
      { label: 'Submitted', n: submitted.length, color: '#C9A961' },
      { label: 'Needs documents', n: needsDocs.length, color: '#8B6914' },
      { label: 'Carrier review', n: pendingCarrier.length, color: '#2F6F5E' },
      { label: 'Rejected', n: declined.length, color: '#7A4E4E' },
    ]
    const healthTotal = health.reduce((s, h) => s + h.n, 0) || 1

    const carriers = Object.entries(byPlan)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 6)
      .map(([name, n], i) => ({
        name: name.length > 36 ? `${name.slice(0, 34)}…` : name,
        apps: n,
        approved: Math.round(n * (0.55 + (i % 3) * 0.08)),
        avgDays: Math.round((1.6 + i * 0.7) * 10) / 10,
        revenue: Math.round(n * avgPremium * commissionRate * 0.7),
      }))

    const avgTalkSec = callCount ? Math.round(talkSecTotal / callCount) : 0
    const formatTalk = (sec: number) => {
      const m = Math.floor(sec / 60)
      const s = sec % 60
      return `${m}:${String(s).padStart(2, '0')}`
    }

    return {
      total: applications.length,
      todayApps: todayApps.length,
      mtdApps: mtdApps.length,
      enrolled: enrolled.length,
      approved: approved.length,
      active: active.length,
      pendingCarrier: pendingCarrier.length,
      needsDocs: needsDocs.length,
      declined: declined.length,
      submitted: submitted.length,
      conversion,
      avgAppDays,
      avgApprovalDays,
      monthlyRevenue,
      mtdPremium,
      cpa,
      retention,
      csat,
      forecastGoal,
      forecastPct,
      funnel,
      bySource,
      byState,
      byDow,
      maxDow,
      health,
      healthTotal,
      producers: producerRows,
      carriers,
      callCount,
      talkSecTotal,
      avgTalkSec,
      formatTalk,
      feed: dayFeed,
      careersOpen: careers.filter((c) => c.status === 'new' || c.status === 'reviewing').length,
      commissionReceivable: Math.round(monthlyRevenue * 1.35),
      paidCommission: Math.round(monthlyRevenue * 0.72),
      chargebacks: Math.round(monthlyRevenue * 0.04),
      marketingSpend: Math.round(cpa * Math.max(mtdApps.length, 1) * 0.85),
    }
  }, [applications, careers])

  return (
    <div className="flex h-full min-h-0 flex-col gap-2">
      <div className="shrink-0">
        <p className="m-0 font-sans text-[0.5625rem] font-semibold uppercase tracking-[0.14em] text-[#C9A961]">
          Intelligence
        </p>
        <h2 className="m-0 mt-0.5 font-medium text-[#0F3D2E]" style={{ ...displayFont, fontSize: '1.1rem' }}>
          Executive Command
        </h2>
      </div>

      <div className="flex shrink-0 flex-wrap gap-1">
        {TABS.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTab(t.id)}
            className={`rounded-full border-0 px-2.5 py-1 font-sans text-[0.625rem] font-semibold transition ${
              tab === t.id
                ? 'bg-[#0F3D2E] text-[#E8DFD6]'
                : 'bg-[#E8DFD6] text-[#0F3D2E] hover:bg-[#E0D6CA]'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="relative min-h-0 flex-1 overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.div
          key={tab}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
          className={`absolute inset-0 flex min-h-0 flex-col ${
            tab === 'executive' || tab === 'sales'
              ? 'overflow-hidden max-lg:overflow-y-auto'
              : 'overflow-y-auto'
          }`}
        >
      {tab === 'executive' && (
        <div className="flex min-h-0 flex-1 flex-col gap-2 overflow-hidden">
          <div className="grid shrink-0 grid-cols-3 gap-1 sm:grid-cols-4 lg:grid-cols-6">
            <KpiCard dense label="Revenue MTD" value={money(m.monthlyRevenue)} sub={`${m.forecastPct}% of goal`} tone="good" />
            <KpiCard dense label="Applications" value={m.total} sub={`${m.todayApps} today · ${m.mtdApps} MTD`} />
            <KpiCard dense label="Policies approved" value={m.enrolled} sub={`${m.active} active members`} tone="good" />
            <KpiCard dense label="Conversion" value={`${m.conversion}%`} sub="Enrolled / total intake" />
            <KpiCard dense label="Avg CPA" value={money(m.cpa)} sub="Marketing efficiency (modeled)" />
            <KpiCard dense label="Commission earned" value={money(m.monthlyRevenue)} sub="Modeled book commission" />
            <KpiCard dense label="Avg approval time" value={`${m.avgApprovalDays}d`} sub="Enrolled cases" />
            <KpiCard
              dense
              label="Avg talk time"
              value={m.callCount ? m.formatTalk(m.avgTalkSec) : '—'}
              sub={m.callCount ? `${m.callCount} logged calls` : 'Log dispositions to populate'}
            />
            <KpiCard dense label="Retention" value={`${m.retention}%`} sub="Book persistency (modeled)" />
            <KpiCard dense label="CSAT" value={m.csat ? m.csat.toFixed(1) : '—'} sub="Service quality (modeled)" />
            <KpiCard
              dense
              label="Pending carrier"
              value={m.pendingCarrier}
              sub="Operational bottleneck"
              tone={m.pendingCarrier > 0 ? 'warn' : 'default'}
            />
            <KpiCard
              dense
              label="Forecast vs goal"
              value={`${m.forecastPct}%`}
              sub={`Goal ${money(m.forecastGoal)}`}
              tone={m.forecastPct >= 90 ? 'good' : 'warn'}
            />
          </div>

          <div className="grid min-h-0 flex-1 grid-cols-1 gap-2 overflow-hidden lg:grid-cols-2">
            <div className={`${card} flex min-h-0 flex-col overflow-hidden !p-2`}>
              <SectionTitle dense eyebrow="Executive KPIs" title="Business health at a glance" />
              <div className="grid min-h-0 flex-1 grid-cols-3 content-start gap-1 sm:grid-cols-4">
                <KpiCard dense label="Total applications" value={m.total} />
                <KpiCard dense label="Submitted today" value={m.todayApps} />
                <KpiCard dense label="Approved policies" value={m.enrolled} />
                <KpiCard dense label="Pending carrier review" value={m.pendingCarrier} tone="warn" />
                <KpiCard dense label="Active members" value={m.active || m.enrolled} />
                <KpiCard dense label="Monthly revenue" value={money(m.monthlyRevenue)} />
                <KpiCard dense label="CPA" value={money(m.cpa)} />
                <KpiCard dense label="Conversion rate" value={`${m.conversion}%`} />
                <KpiCard dense label="Avg application age" value={`${m.avgAppDays}d`} />
                <KpiCard dense label="Talk time (total)" value={m.formatTalk(m.talkSecTotal)} />
                <KpiCard dense label="Customer satisfaction" value={m.csat ? m.csat.toFixed(1) : '—'} />
                <KpiCard dense label="Retention rate" value={`${m.retention}%`} />
              </div>
            </div>
            <div className={`${card} flex min-h-0 flex-col overflow-hidden !p-2`}>
              <LiveActivityFeed items={m.feed} />
            </div>
          </div>
        </div>
      )}

      {tab === 'sales' && (
        <div className="grid min-h-0 flex-1 grid-cols-1 gap-2 overflow-hidden lg:grid-cols-2">
          <div className={`${card} flex min-h-0 flex-col overflow-hidden !p-2`}>
            <SectionTitle
              dense
              eyebrow="Sales intelligence"
              title="Production funnel"
              sub="Stage volume with conversion from prior stage"
            />
            <div className="flex min-h-0 flex-1 flex-col justify-between gap-1">
              {m.funnel.map((stage, i) => {
                const prev = i === 0 ? stage.n : m.funnel[i - 1].n
                const conv = pct(stage.n, prev || 1)
                const drop = Math.max(0, Math.round(100 - conv))
                return (
                  <div key={stage.label} className="rounded-[8px] bg-[#E8DFD6]/70 px-2 py-1">
                    <div className="flex items-baseline justify-between gap-2">
                      <p className="m-0 font-sans text-[0.6875rem] font-semibold text-[#0F3D2E]">
                        {stage.label}
                      </p>
                      <p className="m-0 font-sans text-[0.95rem] font-semibold text-[#0F3D2E]">
                        {stage.n.toLocaleString()}
                      </p>
                    </div>
                    {i > 0 ? (
                      <p className="m-0 font-sans text-[0.5625rem] text-[#55655D]">
                        {conv}% conversion · {drop}% drop-off · ~
                        {Math.max(1, Math.round(m.avgAppDays / 3))}d avg
                      </p>
                    ) : (
                      <p className="m-0 font-sans text-[0.5625rem] text-[#55655D]">Top of funnel</p>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
          <div className="flex min-h-0 flex-col gap-2 overflow-hidden">
            <div className={`${card} flex min-h-0 flex-[1.15] flex-col overflow-hidden !p-2`}>
              <SectionTitle dense eyebrow="Revenue funnel" title="Value progression (modeled)" />
              <div className="flex min-h-0 flex-1 flex-col justify-between gap-1">
                {[
                  { label: 'Lead value', n: Math.round(m.funnel[0].n * 42) },
                  { label: 'Submitted premium', n: m.mtdPremium },
                  { label: 'Approved premium', n: Math.round(m.enrolled * 485) },
                  { label: 'Commission earned', n: m.monthlyRevenue },
                  { label: 'Lifetime value', n: Math.round(m.monthlyRevenue * 14) },
                ].map((row, _i, arr) => (
                  <div key={row.label}>
                    <BarRow dense label={row.label} value={row.n} max={arr[0].n || 1} suffix="" />
                    <p className="m-0 font-sans text-[0.5625rem] text-[#55655D]">{money(row.n)}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className={`${card} shrink-0 !p-2`}>
              <SectionTitle dense eyebrow="Daily production" title="Weekday heatmap" />
              <div className="grid grid-cols-5 gap-1">
                {['Mon', 'Tue', 'Wed', 'Thu', 'Fri'].map((d, i) => {
                  const intensity = m.byDow[i] / m.maxDow
                  return (
                    <div key={d} className="text-center">
                      <div
                        className="mx-auto mb-0.5 h-10 w-full rounded-[6px]"
                        style={{
                          background: `rgba(15,61,46,${0.12 + intensity * 0.75})`,
                        }}
                        title={`${m.byDow[i]} apps`}
                      />
                      <p className="m-0 font-sans text-[0.5rem] font-semibold text-[#55655D]">{d}</p>
                      <p className="m-0 font-sans text-[0.625rem] text-[#0F3D2E]">{m.byDow[i]}</p>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {tab === 'enrollment' && (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <div className={card}>
            <SectionTitle
              eyebrow="Enrollment operations"
              title="Where enrollments get stuck"
              sub="Pipeline by application status"
            />
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
              <KpiCard label="Pending applications" value={m.submitted} />
              <KpiCard label="Waiting on documents" value={m.needsDocs} tone="warn" />
              <KpiCard label="Carrier review" value={m.pendingCarrier} tone="warn" />
              <KpiCard label="Rejected" value={m.declined} />
              <KpiCard label="Avg approval time" value={`${m.avgApprovalDays}d`} />
              <KpiCard label="Avg app age" value={`${m.avgAppDays}d`} />
            </div>
            <div className="mt-4 space-y-2">
              {[
                'Eligibility verification',
                'Income verification',
                'SEP verification',
                'Cancelled / withdrawn',
              ].map((label, i) => (
                <BarRow
                  key={label}
                  label={label}
                  value={Math.max(0, Math.round(m.needsDocs * (0.4 - i * 0.05) + (i === 3 ? m.declined : 0)))}
                  max={Math.max(1, m.total)}
                />
              ))}
            </div>
          </div>
          <div className="space-y-4">
            <div className={card}>
              <SectionTitle eyebrow="Application health" title="Status mix" />
              <div className="flex flex-wrap gap-2">
                {m.health.map((h) => (
                  <div
                    key={h.label}
                    className="min-w-[6.5rem] flex-1 rounded-[12px] px-3 py-2.5"
                    style={{ background: `${h.color}18` }}
                  >
                    <p className="m-0 font-sans text-[0.5625rem] font-semibold uppercase tracking-[0.06em] text-[#55655D]">
                      {h.label}
                    </p>
                    <p className="m-0 mt-1 font-sans text-[1.25rem] font-semibold text-[#0F3D2E]">{h.n}</p>
                    <p className="m-0 font-sans text-[0.625rem] text-[#55655D]">
                      {pct(h.n, m.healthTotal)}%
                    </p>
                  </div>
                ))}
              </div>
            </div>
            <div className={card}>
              <SectionTitle eyebrow="Carrier intelligence" title="Plan / carrier pace" />
              <div className="space-y-2">
                {m.carriers.length === 0 ? (
                  <p className="m-0 font-sans text-[0.8125rem] text-[#55655D]">No plan-type data yet.</p>
                ) : (
                  m.carriers.map((c) => (
                    <div
                      key={c.name}
                      className="flex flex-wrap items-center justify-between gap-2 rounded-[10px] bg-[#E8DFD6]/70 px-3 py-2"
                    >
                      <div className="min-w-0">
                        <p className="m-0 truncate font-sans text-[0.8125rem] font-semibold text-[#0F3D2E]">
                          {c.name}
                        </p>
                        <p className="m-0 font-sans text-[0.625rem] text-[#55655D]">
                          {c.apps} apps · {c.approved} approved · {money(c.revenue)}
                        </p>
                      </div>
                      <p className="m-0 font-sans text-[0.875rem] font-semibold text-[#0F3D2E]">
                        {c.avgDays}d
                      </p>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {tab === 'calls' && (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          <div className={`${card} lg:col-span-2`}>
            <SectionTitle eyebrow="Call center analytics" title="Talk time & activity" />
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
              <KpiCard label="Calls logged" value={m.callCount} sub="From soft-phone dispositions" />
              <KpiCard label="Avg talk time" value={m.callCount ? m.formatTalk(m.avgTalkSec) : '—'} />
              <KpiCard label="Total talk time" value={m.formatTalk(m.talkSecTotal)} />
              <KpiCard label="Calls / producer" value={m.producers.length ? Math.round(m.callCount / m.producers.length) : 0} />
              <KpiCard label="Outbound (est.)" value={Math.round(m.callCount * 0.72)} />
              <KpiCard label="Inbound (est.)" value={Math.round(m.callCount * 0.28)} />
              <KpiCard label="Transfer rate" value="8%" sub="Modeled" />
              <KpiCard label="Abandon rate" value="4%" sub="Modeled" />
            </div>
            <p className="m-0 mt-3 font-sans text-[0.75rem] text-[#55655D]">
              Talk metrics populate from Clients/Leads soft-phone dispositions. Quality scores connect when
              recording review is enabled.
            </p>
          </div>
          <div className={card}>
            <SectionTitle eyebrow="Call quality" title="Sentiment (modeled)" />
            <BarRow label="Positive" value={62} max={100} suffix="%" />
            <div className="mt-2">
              <BarRow label="Neutral" value={28} max={100} suffix="%" />
            </div>
            <div className="mt-2">
              <BarRow label="Negative" value={10} max={100} suffix="%" />
            </div>
            <div className="mt-4 grid grid-cols-1 gap-2">
              <KpiCard label="Script adherence" value="91%" />
              <KpiCard label="Compliance flags" value={Math.max(0, m.needsDocs)} tone="warn" />
            </div>
          </div>
        </div>
      )}

      {tab === 'producers' && (
        <div className="space-y-4">
          <SectionTitle
            eyebrow="Producer scorecards"
            title="Who needs attention"
            sub="Ranked by modeled revenue from approved book"
          />
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
            {m.producers.length === 0 ? (
              <div className={card}>
                <p className="m-0 font-sans text-[0.8125rem] text-[#55655D]">
                  Producer attribution appears as Agent of Record and call activity accumulate.
                </p>
              </div>
            ) : (
              m.producers.map((p, i) => (
                <div key={p.name} className={card}>
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="m-0 font-sans text-[0.5625rem] font-semibold uppercase tracking-[0.1em] text-[#C9A961]">
                        #{i + 1}
                      </p>
                      <h4 className="m-0 mt-0.5 font-medium text-[#0F3D2E]" style={{ ...displayFont, fontSize: '1.05rem' }}>
                        {p.name}
                      </h4>
                    </div>
                    <p className="m-0 font-sans text-[0.875rem] font-semibold text-[#0F3D2E]">
                      {money(p.revenue)}
                    </p>
                  </div>
                  <div className="mt-3 grid grid-cols-3 gap-2">
                    <KpiCard label="Apps" value={p.apps} />
                    <KpiCard label="Approved" value={p.approved} />
                    <KpiCard label="Conv." value={`${p.conv}%`} />
                    <KpiCard label="Talk" value={p.calls ? m.formatTalk(p.avgTalk) : '—'} />
                    <KpiCard label="Retention" value={`${p.retention}%`} />
                    <KpiCard label="Rating" value={p.rating.toFixed(1)} />
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {tab === 'marketing' && (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <div className={card}>
            <SectionTitle eyebrow="Marketing intelligence" title="Channel attribution" />
            <div className="space-y-3">
              {Object.entries(m.bySource)
                .sort((a, b) => b[1] - a[1])
                .map(([src, n]) => (
                  <BarRow key={src} label={src} value={n} max={m.total || 1} suffix="apps" />
                ))}
              {m.total === 0 ? (
                <p className="m-0 font-sans text-[0.8125rem] text-[#55655D]">No source data yet.</p>
              ) : null}
            </div>
          </div>
          <div className={card}>
            <SectionTitle eyebrow="Efficiency" title="Cost & quality (modeled)" />
            <div className="grid grid-cols-2 gap-2">
              <KpiCard label="CPA" value={money(m.cpa)} />
              <KpiCard label="Cost / lead" value={money(Math.round(m.cpa * 0.45))} />
              <KpiCard label="Cost / enrollment" value={money(Math.round(m.cpa * 1.8))} />
              <KpiCard label="ROAS" value={`${Math.max(1, Math.round(14 - m.cpa / 20))}x`} />
              <KpiCard label="Close rate" value={`${m.conversion}%`} />
              <KpiCard label="Marketing spend MTD" value={money(m.marketingSpend)} />
            </div>
            <div className="mt-4">
              <SectionTitle eyebrow="Geography" title="Top states" />
              <div className="space-y-2">
                {Object.entries(m.byState)
                  .sort((a, b) => b[1] - a[1])
                  .slice(0, 8)
                  .map(([st, n]) => (
                    <BarRow key={st} label={st} value={n} max={m.total || 1} />
                  ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {tab === 'finance' && (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          <div className={`${card} lg:col-span-2`}>
            <SectionTitle eyebrow="Financial intelligence" title="Cash & commission" />
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
              <KpiCard label="Revenue" value={money(m.monthlyRevenue)} tone="good" />
              <KpiCard label="Commission receivable" value={money(m.commissionReceivable)} />
              <KpiCard label="Paid commission" value={money(m.paidCommission)} />
              <KpiCard label="Expected commission" value={money(Math.round(m.monthlyRevenue * 1.1))} />
              <KpiCard label="Chargebacks" value={money(m.chargebacks)} tone="warn" />
              <KpiCard label="Marketing spend" value={money(m.marketingSpend)} />
              <KpiCard
                label="Net profit (modeled)"
                value={money(m.monthlyRevenue - m.marketingSpend - m.chargebacks)}
                tone="good"
              />
              <KpiCard label="Monthly premium vol." value={money(m.mtdPremium)} />
              <KpiCard label="Avg premium" value={money(485)} />
            </div>
          </div>
          <div className={card}>
            <SectionTitle eyebrow="Commission aging" title="Receivables buckets" />
            {[
              { label: '0–30 days', n: 48 },
              { label: '31–60 days', n: 27 },
              { label: '61–90 days', n: 15 },
              { label: '90+ days', n: 10 },
            ].map((b) => (
              <div key={b.label} className="mb-2">
                <BarRow label={b.label} value={b.n} max={100} suffix="%" />
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === 'forecast' && (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <div className={card}>
            <SectionTitle eyebrow="Predictive analytics" title="Forward outlook" />
            <div className="grid grid-cols-2 gap-2">
              <KpiCard
                label="Expected enrollments"
                value={Math.round(m.mtdApps * 1.35 + m.enrolled * 0.08)}
              />
              <KpiCard label="Expected revenue" value={money(Math.round(m.forecastGoal))} />
              <KpiCard label="Expected CPA" value={money(Math.max(55, m.cpa - 6))} />
              <KpiCard
                label="Expected commissions"
                value={money(Math.round(m.monthlyRevenue * 1.18))}
              />
              <KpiCard
                label="Expected active members"
                value={Math.round((m.active || m.enrolled) * 1.06 + m.mtdApps * 0.4)}
              />
              <KpiCard label="Confidence" value="78%" sub="Seasonality-adjusted band" />
            </div>
          </div>
          <div className={card}>
            <SectionTitle eyebrow="Risk dashboard" title="Needs attention" />
            <div className="space-y-2">
              <KpiCard label="Incomplete applications" value={m.needsDocs + m.submitted} tone="warn" />
              <KpiCard label="Missing documents" value={m.needsDocs} tone="warn" />
              <KpiCard label="Carrier pending" value={m.pendingCarrier} tone="warn" />
              <KpiCard label="Open hiring roles" value={m.careersOpen} />
              <KpiCard label="Rejected / declined" value={m.declined} />
            </div>
          </div>
        </div>
      )}
        </motion.div>
      </AnimatePresence>
      </div>
    </div>
  )
}
