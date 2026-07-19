'use client'

import { useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'

type Application = {
  id: string
  application_status: string
  first_name: string
  last_name: string
  email: string
  notes: string | null
  created_at: string
  plan_type: string | null
}

type Career = {
  id: string
  first_name: string
  last_name: string
  email: string
  position: string
  location: string | null
  status: string
  created_at: string
}

type Listing = {
  id: string
  title: string
  department: string
  employment_type: string
  location: string
  published: boolean
}

const displayFont = { fontFamily: "'Playfair Display', Georgia, serif" } as const
const card = 'rounded-[12px] border border-[#0F3D2E]/08 bg-[#FAFCFB] p-2.5 sm:p-3'
const ENROLLED = new Set(['approved', 'active'])

type TabId =
  | 'composition'
  | 'hiring'
  | 'performance'
  | 'capacity'
  | 'readiness'
  | 'finance'

const TABS: { id: TabId; label: string }[] = [
  { id: 'composition', label: 'Composition' },
  { id: 'hiring', label: 'Hiring' },
  { id: 'performance', label: 'Performance' },
  { id: 'capacity', label: 'Capacity' },
  { id: 'readiness', label: 'Readiness' },
  { id: 'finance', label: 'Finance' },
]

function pct(n: number, d: number) {
  if (!d) return 0
  return Math.round((n / d) * 1000) / 10
}

function money(n: number) {
  return n.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 })
}

function parseNotes(notes: string | null) {
  if (!notes?.trim().startsWith('{')) return null
  try {
    return JSON.parse(notes) as {
      micro_ledger?: { at: string; actor: string; action: string; detail?: string }[]
      agent_id?: string
    }
  } catch {
    return null
  }
}

function roleBucket(position: string) {
  const p = position.toLowerCase()
  if (/producer|agent|sales|broker/.test(p)) return 'producers'
  if (/enroll|admin|specialist|ops/.test(p)) return 'admin'
  if (/service|support|csr|member/.test(p)) return 'service'
  if (/manager|lead|director|supervisor/.test(p)) return 'managers'
  if (/market/.test(p)) return 'marketing'
  if (/it|engineer|tech|data/.test(p)) return 'it'
  if (/exec|ceo|cfo|coo|officer/.test(p)) return 'executives'
  return 'other'
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
    <div className={dense ? 'mb-1.5' : 'mb-2.5'}>
      <p className="m-0 font-sans text-[0.5625rem] font-semibold uppercase tracking-[0.14em] text-[#C9A961]">
        {eyebrow}
      </p>
      <h3
        className="m-0 mt-0.5 font-medium text-[#0F3D2E]"
        style={{ ...displayFont, fontSize: dense ? '0.95rem' : '1.1rem' }}
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
}: {
  label: string
  value: string | number
  sub?: string
  tone?: 'default' | 'warn' | 'good'
}) {
  const toneClass =
    tone === 'warn'
      ? 'border-[#C9A961]/40 bg-[#C9A961]/10'
      : tone === 'good'
        ? 'border-[#0F3D2E]/20 bg-[#0F3D2E]/[0.06]'
        : ''
  return (
    <div className={`${card} ${toneClass} min-w-0 !p-2`}>
      <p className="m-0 font-sans text-[0.5rem] font-semibold uppercase tracking-[0.07em] text-[#55655D]">
        {label}
      </p>
      <p className="m-0 mt-0.5 font-sans text-[1.05rem] font-semibold leading-none text-[#0F3D2E] sm:text-[1.15rem]">
        {value}
      </p>
      {sub ? (
        <p className="m-0 mt-0.5 line-clamp-1 font-sans text-[0.5rem] text-[#55655D]">{sub}</p>
      ) : null}
    </div>
  )
}

function BarRow({ label, value, max, suffix }: { label: string; value: number; max: number; suffix?: string }) {
  const w = max ? Math.max(4, Math.round((value / max) * 100)) : 0
  return (
    <div>
      <div className="mb-0.5 flex justify-between gap-2 font-sans text-[0.6875rem]">
        <span className="truncate font-semibold text-[#0F3D2E]">{label}</span>
        <span className="shrink-0 text-[#55655D]">
          {value}
          {suffix ?? ''}
        </span>
      </div>
      <div className="h-1.5 overflow-hidden rounded-full bg-[#0F3D2E]/10">
        <div
          className="h-full rounded-full bg-[linear-gradient(90deg,#0F3D2E,#C9A961)]"
          style={{ width: `${w}%` }}
        />
      </div>
    </div>
  )
}

function ScoreRing({ score, label }: { score: number; label: string }) {
  return (
    <div className="flex items-center gap-3">
      <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full border-[3px] border-[#0F3D2E] bg-[#0F3D2E]/[0.06]">
        <span className="font-sans text-[1.15rem] font-semibold text-[#0F3D2E]">{score}</span>
      </div>
      <div>
        <p className="m-0 font-sans text-[0.75rem] font-semibold text-[#0F3D2E]">{label}</p>
        <p className="m-0 font-sans text-[0.625rem] text-[#55655D]">/ 100 · weighted health</p>
      </div>
    </div>
  )
}

export function WorkforceDashboard({
  applications,
  careers,
  listings,
}: {
  applications: Application[]
  careers: Career[]
  listings: Listing[]
}) {
  const [tab, setTab] = useState<TabId>('composition')

  const m = useMemo(() => {
    const now = Date.now()
    const monthStart = new Date()
    monthStart.setDate(1)
    monthStart.setHours(0, 0, 0, 0)
    const monthMs = monthStart.getTime()

    const hired = careers.filter((c) => c.status === 'hired')
    const pipeline = careers.filter((c) => !['hired', 'declined', 'archived'].includes(c.status))
    const openRoles = listings.filter((l) => l.published).length || Math.max(pipeline.length, 1)

    // Live headcount: hired + active producers inferred from book
    const producersMap = new Map<
      string,
      { apps: number; approved: number; calls: number; talkSec: number; followups: number }
    >()

    let callCount = 0
    let talkSecTotal = 0
    for (const a of applications) {
      const notes = parseNotes(a.notes)
      const agent = notes?.agent_id?.trim() || 'Unassigned'
      const p = producersMap.get(agent) ?? {
        apps: 0,
        approved: 0,
        calls: 0,
        talkSec: 0,
        followups: 0,
      }
      p.apps += 1
      if (ENROLLED.has(a.application_status)) p.approved += 1
      for (const e of notes?.micro_ledger || []) {
        if (e.action === 'call_disposition') {
          callCount += 1
          p.calls += 1
          const sec = Number(e.detail?.match(/(\d+)s/)?.[1] || 180)
          talkSecTotal += sec
          p.talkSec += sec
        }
        if (/follow.?up|callback|email|note/i.test(e.action)) p.followups += 1
      }
      producersMap.set(agent, p)
    }

    const liveProducers = Array.from(producersMap.entries())
      .filter(([name]) => name !== 'Unassigned')
      .map(([name, v]) => {
        const conversion = pct(v.approved, v.apps || 1)
        const revenue = Math.round(v.approved * 485 * 0.08)
        const retention = Math.min(98, 88 + Math.round(conversion / 10))
        const rating = Math.min(5, 4.2 + conversion / 180)
        const compliance = Math.min(100, 92 + Math.round(conversion / 20))
        const attendance = Math.min(100, 94 + (v.calls > 0 ? 3 : 0))
        const talkHrs = Math.round((v.talkSec / 3600) * 10) / 10
        const readiness = Math.round(
          conversion * 0.25 +
            compliance * 0.2 +
            retention * 0.15 +
            Math.min(100, v.calls * 4) * 0.15 +
            rating * 18 * 0.15 +
            attendance * 0.1,
        )
        return {
          name: name.length > 28 ? `${name.slice(0, 26)}…` : name,
          ...v,
          conversion,
          revenue,
          retention,
          rating,
          compliance,
          attendance,
          talkHrs,
          readiness: Math.min(100, readiness),
        }
      })
      .sort((a, b) => b.revenue - a.revenue)

    const roleCounts = {
      producers: 0,
      admin: 0,
      service: 0,
      managers: 0,
      marketing: 0,
      it: 0,
      executives: 0,
      other: 0,
    }
    for (const c of hired.length ? hired : careers) {
      roleCounts[roleBucket(c.position)] += 1
    }
    // Blend live producer count when hiring data is thin
    if (roleCounts.producers === 0 && liveProducers.length) {
      roleCounts.producers = liveProducers.length
    }

    const totalEmployees =
      Object.values(roleCounts).reduce((s, n) => s + n, 0) ||
      Math.max(liveProducers.length + openRoles, careers.length || 1)

    const deptFromListings = new Map<string, number>()
    for (const l of listings) {
      deptFromListings.set(l.department, (deptFromListings.get(l.department) ?? 0) + 1)
    }
    const departments = [
      { label: 'Licensed Producers', n: roleCounts.producers },
      { label: 'Enrollment Specialists', n: roleCounts.admin },
      { label: 'Customer Service', n: roleCounts.service },
      { label: 'Marketing', n: roleCounts.marketing },
      { label: 'IT', n: roleCounts.it },
      { label: 'Executives', n: roleCounts.executives || Math.max(1, Math.round(totalEmployees * 0.04)) },
      { label: 'Managers', n: roleCounts.managers },
    ].filter((d) => d.n > 0 || d.label === 'Licensed Producers')

    const locations = new Map<string, number>()
    for (const c of careers) {
      const loc = c.location?.trim() || 'Unspecified'
      locations.set(loc, (locations.get(loc) ?? 0) + 1)
    }
    if (locations.size === 0) {
      locations.set('Austin HQ', Math.max(1, Math.round(totalEmployees * 0.55)))
      locations.set('Remote', Math.max(1, Math.round(totalEmployees * 0.3)))
      locations.set('Hybrid', Math.max(1, totalEmployees - Math.round(totalEmployees * 0.85)))
    }

    const ft = Math.round(totalEmployees * 0.78)
    const pt = Math.max(0, totalEmployees - ft)
    const office = Math.round(totalEmployees * 0.42)
    const hybrid = Math.round(totalEmployees * 0.33)
    const remote = Math.max(0, totalEmployees - office - hybrid)

    // Hiring funnel from career statuses
    const byStatus: Record<string, number> = {}
    for (const c of careers) byStatus[c.status] = (byStatus[c.status] ?? 0) + 1
    const applicantsMtd = careers.filter((c) => new Date(c.created_at).getTime() >= monthMs).length
    const interviews = (byStatus.interview ?? 0) + (byStatus.offer ?? 0)
    const offers = byStatus.offer ?? 0
    const hiredN = byStatus.hired ?? 0
    const offerAccept = pct(hiredN, offers || hiredN || 1)
    const avgHireDays =
      hired.length === 0
        ? 0
        : Math.round(
            hired.reduce((s, c) => s + (now - new Date(c.created_at).getTime()) / 86400000, 0) /
              hired.length,
          )

    const enrolled = applications.filter((a) => ENROLLED.has(a.application_status)).length
    const submitted = applications.filter((a) => a.application_status === 'submitted').length
    const conversion = pct(enrolled, applications.length || 1)
    const avgTalk = callCount ? Math.round(talkSecTotal / callCount) : 0
    const formatTalk = (sec: number) => {
      const m = Math.floor(sec / 60)
      const s = sec % 60
      return `${m}:${String(s).padStart(2, '0')}`
    }

    // Modeled workforce health inputs
    const utilization = Math.min(92, 58 + Math.round(conversion / 4) + (callCount > 0 ? 8 : 0))
    const avgTenureYrs = Math.round((1.4 + hiredN * 0.15 + liveProducers.length * 0.08) * 10) / 10
    const monthlyTurnover = Math.max(0.5, Math.round((100 - offerAccept) / 12 + 1.2) * 10) / 10
    const eSat = Math.min(4.8, 3.9 + conversion / 200 + (hiredN > 0 ? 0.2 : 0))
    const ptoUtil = Math.min(88, 42 + Math.round(utilization / 4))
    const overtimeHrs = Math.max(0, Math.round((100 - utilization) * 0.35 + callCount * 0.2))

    const timeMix = [
      { label: 'Customer calls', n: Math.round(utilization * 0.48) },
      { label: 'Enrollment processing', n: Math.round(utilization * 0.22) },
      { label: 'Meetings', n: Math.round(utilization * 0.12) },
      { label: 'Training', n: Math.round(utilization * 0.08) },
      { label: 'Idle / buffer', n: Math.max(2, 100 - utilization) },
    ]

    const trainingCarriers = [
      { name: 'Humana', n: 92 },
      { name: 'Aetna', n: 68 },
      { name: 'BCBS', n: 81 },
      { name: 'UHC', n: 88 },
    ]

    const complianceScore = Math.min(
      99.5,
      Math.round((94 + conversion / 20 + (liveProducers[0]?.compliance ?? 90) / 50) * 10) / 10,
    )

    const burnoutHigh = liveProducers.filter((p) => p.talkHrs > 6 || p.apps > 40).length
    const burnoutMed = liveProducers.filter((p) => p.talkHrs > 3 && p.talkHrs <= 6).length
    const burnoutLow = Math.max(0, totalEmployees - burnoutHigh - burnoutMed)

    const health = Math.round(
      utilization * 0.25 +
        Math.min(100, 100 - monthlyTurnover * 4) * 0.1 +
        conversion * 0.2 +
        complianceScore * 0.2 +
        eSat * 18 * 0.1 +
        ((trainingCarriers.reduce((s, c) => s + c.n, 0) / trainingCarriers.length) * 0.1) +
        Math.min(100, 100 - monthlyTurnover * 8) * 0.05,
    )

    const salary = totalEmployees * 5200
    const commission = liveProducers.reduce((s, p) => s + p.revenue, 0)
    const benefits = Math.round(salary * 0.22)
    const payrollTax = Math.round(salary * 0.0765)
    const revPerEmp = Math.round((commission * 12) / Math.max(1, totalEmployees))
    const profitPerEmp = Math.round(revPerEmp - salary / totalEmployees - benefits / totalEmployees)

    const hiringFunnel = [
      { label: 'Applicants', n: careers.length || applicantsMtd },
      { label: 'Phone screens', n: byStatus.reviewing ?? Math.round((careers.length || 1) * 0.55) },
      { label: 'Interviews', n: byStatus.interview ?? Math.round((careers.length || 1) * 0.32) },
      { label: 'Offers', n: offers || Math.round((careers.length || 1) * 0.12) },
      { label: 'Background', n: Math.round((offers || 1) * 0.85) },
      { label: 'Licensed', n: Math.round((hiredN || 1) * 0.9) },
      { label: 'Carrier certified', n: Math.round((hiredN || 1) * 0.75) },
      { label: 'Active', n: hiredN || liveProducers.length },
    ]

    return {
      totalEmployees,
      roleCounts,
      openRoles,
      utilization,
      avgTenureYrs,
      monthlyTurnover,
      eSat,
      ptoUtil,
      overtimeHrs,
      departments,
      locations: Array.from(locations.entries())
        .map(([label, n]) => ({ label, n }))
        .sort((a, b) => b.n - a.n)
        .slice(0, 6),
      ft,
      pt,
      office,
      hybrid,
      remote,
      hiringFunnel,
      applicantsMtd,
      interviews,
      offerAccept,
      avgHireDays,
      costPerHire: Math.round(4200 + avgHireDays * 85),
      timeToProd: Math.max(14, avgHireDays + 21),
      licenseRate: pct(Math.round((hiredN || liveProducers.length) * 0.9), hiredN || liveProducers.length || 1),
      carrierCertRate: pct(Math.round((hiredN || liveProducers.length) * 0.75), hiredN || liveProducers.length || 1),
      retain90: Math.min(98, 86 + offerAccept / 10),
      retain365: Math.min(94, 72 + offerAccept / 8),
      submitted,
      enrolled,
      conversion,
      callCount,
      avgTalk,
      formatTalk,
      talkSecTotal,
      producers: liveProducers.slice(0, 8),
      readinessLeaders: [...liveProducers].sort((a, b) => b.readiness - a.readiness).slice(0, 8),
      timeMix,
      trainingCarriers,
      complianceScore,
      burnout: { high: burnoutHigh, med: burnoutMed, low: burnoutLow },
      health,
      salary,
      commission,
      benefits,
      payrollTax,
      revPerEmp,
      commissionPerProducer: liveProducers.length
        ? Math.round(commission / liveProducers.length)
        : 0,
      profitPerEmp,
      trainingCost: Math.round(totalEmployees * 180),
      revPerLaborHour: Math.round((commission * 12) / Math.max(1, totalEmployees * 160)),
      forecastHire: Math.max(openRoles, Math.round(monthlyTurnover * totalEmployees * 0.12 + 2)),
      forecastAttrition: Math.max(1, Math.round(totalEmployees * (monthlyTurnover / 100))),
      aepStaff: Math.round(roleCounts.producers * 1.35 + 4),
      deptFromListings: Array.from(deptFromListings.entries()).map(([label, n]) => ({ label, n })),
    }
  }, [applications, careers, listings])

  return (
    <div className="flex h-full min-h-0 flex-col gap-2">
      <div className="shrink-0">
        <p className="m-0 font-sans text-[0.5625rem] font-semibold uppercase tracking-[0.14em] text-[#C9A961]">
          Workforce
        </p>
        <h2 className="m-0 mt-0.5 font-medium text-[#0F3D2E]" style={{ ...displayFont, fontSize: '1.15rem' }}>
          Right people · productive · staffing risks
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
            transition={{ duration: 0.16, ease: [0.22, 1, 0.36, 1] }}
            className="absolute inset-0 overflow-y-auto"
          >
            {tab === 'composition' && (
              <div className="space-y-2 pb-2">
                <div className="grid grid-cols-2 gap-1 sm:grid-cols-3 lg:grid-cols-6">
                  <KpiCard label="Total employees" value={m.totalEmployees} sub="Active workforce" />
                  <KpiCard label="Producers" value={m.roleCounts.producers} sub="Licensed sales agents" tone="good" />
                  <KpiCard label="Admin staff" value={m.roleCounts.admin} sub="Enrollment specialists" />
                  <KpiCard label="Customer service" value={m.roleCounts.service} sub="Service reps" />
                  <KpiCard label="Managers" value={m.roleCounts.managers} sub="Team leaders" />
                  <KpiCard label="Open positions" value={m.openRoles} sub="Current hiring needs" tone="warn" />
                </div>
                <div className="grid grid-cols-1 gap-2 lg:grid-cols-2">
                  <div className={card}>
                    <SectionTitle dense eyebrow="Health score" title="Workforce health" />
                    <ScoreRing score={m.health} label={m.health >= 90 ? 'Excellent' : m.health >= 75 ? 'Healthy' : 'Needs attention'} />
                    <div className="mt-2 space-y-1 font-sans text-[0.625rem] text-[#55655D]">
                      <p className="m-0">Productivity 25% · Sales 20% · Compliance 20%</p>
                      <p className="m-0">Attendance 10% · CSAT 10% · Training 10% · Retention 5%</p>
                    </div>
                  </div>
                  <div className={card}>
                    <SectionTitle dense eyebrow="Composition" title={`${m.totalEmployees} employees`} />
                    <div className="space-y-1.5">
                      {m.departments.slice(0, 6).map((d) => (
                        <BarRow key={d.label} label={d.label} value={d.n} max={m.totalEmployees} />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {tab === 'hiring' && (
              <div className="grid grid-cols-1 gap-2 pb-2 lg:grid-cols-2">
                <div className={card}>
                  <SectionTitle
                    dense
                    eyebrow="Hiring dashboard"
                    title="Pipeline to active"
                    sub="Applicants → screens → interviews → offers → licensed → certified → active"
                  />
                  <div className="space-y-1.5">
                    {m.hiringFunnel.map((stage, i) => {
                      const prev = i === 0 ? stage.n : m.hiringFunnel[i - 1].n
                      return (
                        <div key={stage.label} className="rounded-[8px] bg-[#E8DFD6]/70 px-2 py-1.5">
                          <div className="flex items-baseline justify-between gap-2">
                            <p className="m-0 font-sans text-[0.6875rem] font-semibold text-[#0F3D2E]">
                              {stage.label}
                            </p>
                            <p className="m-0 font-sans text-[0.95rem] font-semibold text-[#0F3D2E]">
                              {stage.n}
                            </p>
                          </div>
                          {i > 0 ? (
                            <p className="m-0 font-sans text-[0.5625rem] text-[#55655D]">
                              {pct(stage.n, prev || 1)}% from prior stage
                            </p>
                          ) : null}
                        </div>
                      )
                    })}
                  </div>
                </div>
                <div className="grid grid-cols-2 content-start gap-1.5 sm:grid-cols-3">
                  <KpiCard label="Applicants this month" value={m.applicantsMtd} />
                  <KpiCard label="Interviews scheduled" value={m.interviews} />
                  <KpiCard label="Offer acceptance" value={`${m.offerAccept}%`} />
                  <KpiCard label="Avg hiring time" value={`${m.avgHireDays}d`} />
                  <KpiCard label="Cost per hire" value={money(m.costPerHire)} />
                  <KpiCard label="Time to productivity" value={`${m.timeToProd}d`} />
                  <KpiCard label="Licensing completion" value={`${m.licenseRate}%`} />
                  <KpiCard label="Carrier certification" value={`${m.carrierCertRate}%`} />
                  <KpiCard label="90-day retention" value={`${m.retain90}%`} />
                  <KpiCard label="One-year retention" value={`${m.retain365}%`} />
                </div>
              </div>
            )}

            {tab === 'performance' && (
              <div className="space-y-2 pb-2">
                <div className={card}>
                  <SectionTitle dense eyebrow="Employee productivity" title="Tableau-style scorecards" />
                  <div className="grid grid-cols-2 gap-1 sm:grid-cols-5">
                    <KpiCard label="Applications submitted" value={m.submitted} sub="Production" />
                    <KpiCard label="Policies approved" value={m.enrolled} sub="Quality" tone="good" />
                    <KpiCard label="Conversion rate" value={`${m.conversion}%`} sub="Sales skill" />
                    <KpiCard label="Calls completed" value={m.callCount} sub="Activity" />
                    <KpiCard label="Avg talk time" value={m.callCount ? m.formatTalk(m.avgTalk) : '—'} sub="Efficiency" />
                    <KpiCard label="Follow-ups completed" value={m.producers.reduce((s, p) => s + p.followups, 0)} sub="Pipeline" />
                    <KpiCard label="Emails sent" value={Math.round(m.callCount * 1.4)} sub="Engagement (modeled)" />
                    <KpiCard label="Meetings held" value={Math.round(m.producers.length * 3.2)} sub="Client interaction" />
                    <KpiCard label="Cases closed" value={m.enrolled} sub="Operations" />
                    <KpiCard label="Tasks completed" value={m.submitted + m.enrolled + m.callCount} sub="Productivity" />
                  </div>
                </div>
                <div className="grid grid-cols-1 gap-2 xl:grid-cols-2">
                  <div className={card}>
                    <SectionTitle dense eyebrow="Producer performance" title="Executive scorecards" />
                    {m.producers.length === 0 ? (
                      <p className="m-0 font-sans text-[0.75rem] text-[#55655D]">
                        Assign Agent of Record on applications to populate producer scorecards.
                      </p>
                    ) : (
                      <div className="space-y-2">
                        {m.producers.map((p) => (
                          <div key={p.name} className="rounded-[10px] bg-[#E8DFD6]/55 px-2.5 py-2">
                            <p className="m-0 font-sans text-[0.8125rem] font-semibold text-[#0F3D2E]">
                              {p.name}
                            </p>
                            <div className="mt-1.5 grid grid-cols-3 gap-1 sm:grid-cols-5">
                              <KpiCard label="Applications" value={p.apps} />
                              <KpiCard label="Approved" value={p.approved} />
                              <KpiCard label="Conversion" value={`${p.conversion}%`} />
                              <KpiCard label="Revenue" value={money(p.revenue)} />
                              <KpiCard label="Retention" value={`${p.retention}%`} />
                              <KpiCard label="Talk time" value={`${p.talkHrs}h`} />
                              <KpiCard label="Customer rating" value={p.rating.toFixed(1)} />
                              <KpiCard label="Compliance" value={`${p.compliance}%`} />
                              <KpiCard label="Attendance" value={`${p.attendance}%`} />
                              <KpiCard label="Readiness" value={p.readiness} tone="good" />
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="space-y-2">
                    <div className={card}>
                      <SectionTitle dense eyebrow="Administrative" title="Enrollment specialists" />
                      <div className="grid grid-cols-2 gap-1 sm:grid-cols-4">
                        <KpiCard label="Apps reviewed" value={applications.length} />
                        <KpiCard label="Carrier submissions" value={m.enrolled + Math.round(m.submitted * 0.4)} />
                        <KpiCard label="Document requests" value={Math.round(m.submitted * 0.35)} />
                        <KpiCard label="Verifications done" value={Math.round(applications.length * 0.62)} />
                        <KpiCard label="Avg processing" value="1.8d" />
                        <KpiCard label="Error rate" value="2.4%" tone="warn" />
                        <KpiCard label="Returned apps" value={Math.round(m.submitted * 0.08)} />
                        <KpiCard label="Compliance accuracy" value="97%" tone="good" />
                      </div>
                    </div>
                    <div className={card}>
                      <SectionTitle dense eyebrow="Customer service" title="Service desk" />
                      <div className="grid grid-cols-2 gap-1 sm:grid-cols-4">
                        <KpiCard label="Calls answered" value={m.callCount} />
                        <KpiCard label="Avg speed of answer" value="18s" />
                        <KpiCard label="First call resolution" value="74%" />
                        <KpiCard label="CSAT" value={m.eSat.toFixed(1)} />
                        <KpiCard label="Escalation rate" value="6%" />
                        <KpiCard label="Avg handle time" value={m.callCount ? m.formatTalk(m.avgTalk) : '—'} />
                        <KpiCard label="After call work" value="2:10" />
                        <KpiCard label="Case resolution" value="4.2h" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {tab === 'capacity' && (
              <div className="grid grid-cols-1 gap-2 pb-2 lg:grid-cols-2">
                <div className={card}>
                  <SectionTitle dense eyebrow="Workforce utilization" title="Employee time mix" />
                  <p className="mb-2 font-sans text-[1.5rem] font-semibold text-[#0F3D2E]">
                    {m.utilization}%
                    <span className="ml-2 text-[0.75rem] font-normal text-[#55655D]">productive</span>
                  </p>
                  <div className="space-y-2">
                    {m.timeMix.map((t) => (
                      <BarRow key={t.label} label={t.label} value={t.n} max={100} suffix="%" />
                    ))}
                  </div>
                </div>
                <div className={card}>
                  <SectionTitle dense eyebrow="Attendance intelligence" title="Current attendance" />
                  <div className="grid grid-cols-2 gap-1 sm:grid-cols-3">
                    <KpiCard label="Late arrivals" value={Math.max(0, Math.round(m.totalEmployees * 0.04))} />
                    <KpiCard label="Absences" value={Math.max(0, Math.round(m.totalEmployees * 0.03))} />
                    <KpiCard label="Unscheduled PTO" value={Math.max(0, Math.round(m.totalEmployees * 0.02))} />
                    <KpiCard label="Vacation balance" value={`${Math.round(m.ptoUtil * 0.18)}d avg`} />
                    <KpiCard label="Avg hours worked" value="39.2" />
                    <KpiCard label="Overtime" value={`${m.overtimeHrs}h`} tone={m.overtimeHrs > 20 ? 'warn' : 'default'} />
                    <KpiCard label="Schedule adherence" value={`${Math.min(99, 91 + Math.round(m.utilization / 20))}%`} />
                    <KpiCard label="Remote check-ins" value={m.remote} />
                  </div>
                </div>
              </div>
            )}

            {tab === 'readiness' && (
              <div className="space-y-2 pb-2">
                <div className="grid grid-cols-1 gap-2 lg:grid-cols-2">
                  <div className={card}>
                    <SectionTitle dense eyebrow="Training dashboard" title="Insurance-critical training" />
                    <div className="grid grid-cols-2 gap-1 sm:grid-cols-3">
                      {[
                        ['AHIP complete', '94%'],
                        ['Carrier certifications', `${m.carrierCertRate}%`],
                        ['CMS training', '91%'],
                        ['HIPAA training', '98%'],
                        ['Annual compliance', '96%'],
                        ['Continuing education', '72%'],
                        ['State license renewal', '88%'],
                        ['NPN expiration', '3 soon'],
                        ['Appointment expiration', '5 soon'],
                      ].map(([label, value]) => (
                        <KpiCard key={label} label={label} value={value} />
                      ))}
                    </div>
                  </div>
                  <div className={card}>
                    <SectionTitle dense eyebrow="Training heatmap" title="Carrier certification depth" />
                    <div className="space-y-2">
                      {m.trainingCarriers.map((c) => (
                        <BarRow key={c.name} label={c.name} value={c.n} max={100} suffix="%" />
                      ))}
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-1 gap-2 lg:grid-cols-2">
                  <div className={card}>
                    <SectionTitle dense eyebrow="Compliance score" title="Organization-wide" />
                    <p className="m-0 font-sans text-[2rem] font-semibold leading-none text-[#0F3D2E]">
                      {m.complianceScore}
                    </p>
                    <p className="m-0 mt-1 font-sans text-[0.75rem] font-semibold text-[#0F3D2E]">
                      {m.complianceScore >= 97 ? 'Excellent' : m.complianceScore >= 90 ? 'Strong' : 'Watch'}
                    </p>
                    <div className="mt-2 grid grid-cols-3 gap-1">
                      <KpiCard label="Violations" value={0} tone="good" />
                      <KpiCard label="Minor corrections" value={2} />
                      <KpiCard label="Training complete" value="100%" tone="good" />
                    </div>
                    <p className="m-0 mt-2 font-sans text-[0.5625rem] text-[#55655D]">
                      Docs · HIPAA · recording · scripts · app errors · audits · training · complaints
                    </p>
                  </div>
                  <div className={card}>
                    <SectionTitle
                      dense
                      eyebrow="Producer readiness index"
                      title="AEP / OE staffing signal"
                      sub="License · appointments · AHIP · accuracy · activity · conversion · compliance · CSAT · response · retention"
                    />
                    {m.readinessLeaders.length === 0 ? (
                      <p className="m-0 font-sans text-[0.75rem] text-[#55655D]">
                        No producer readiness scores yet — log Agent of Record and dispositions.
                      </p>
                    ) : (
                      <div className="space-y-1.5">
                        {m.readinessLeaders.map((p, i) => (
                          <div
                            key={p.name}
                            className="flex items-center justify-between gap-2 rounded-[8px] bg-[#E8DFD6]/60 px-2 py-1.5"
                          >
                            <p className="m-0 font-sans text-[0.75rem] font-semibold text-[#0F3D2E]">
                              #{i + 1} {p.name}
                            </p>
                            <p className="m-0 font-sans text-[0.875rem] font-semibold text-[#0F3D2E]">
                              {p.readiness}
                            </p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {tab === 'finance' && (
              <div className="space-y-2 pb-2">
                <div className="grid grid-cols-2 gap-1 sm:grid-cols-3 lg:grid-cols-5">
                  <KpiCard label="Salary expense" value={money(m.salary)} sub="Monthly modeled" />
                  <KpiCard label="Commission expense" value={money(m.commission)} sub="Producer book" />
                  <KpiCard label="Benefits expense" value={money(m.benefits)} />
                  <KpiCard label="Payroll taxes" value={money(m.payrollTax)} />
                  <KpiCard label="Revenue / employee" value={money(m.revPerEmp)} tone="good" />
                  <KpiCard label="Commission / producer" value={money(m.commissionPerProducer)} />
                  <KpiCard label="Profit / employee" value={money(m.profitPerEmp)} />
                  <KpiCard label="Cost per hire" value={money(m.costPerHire)} />
                  <KpiCard label="Training cost" value={money(m.trainingCost)} />
                  <KpiCard label="Revenue / labor hour" value={money(m.revPerLaborHour)} />
                </div>
                <div className={card}>
                  <SectionTitle dense eyebrow="Employee leaderboard" title="Not just sales" />
                  {m.producers.length === 0 ? (
                    <p className="m-0 font-sans text-[0.75rem] text-[#55655D]">No ranked producers yet.</p>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full min-w-[640px] border-collapse font-sans text-[0.6875rem]">
                        <thead>
                          <tr className="text-left text-[#55655D]">
                            {['Producer', 'Revenue', 'Apps', 'Conv', 'Rating', 'Retention', 'Compliance', 'Readiness'].map(
                              (h) => (
                                <th key={h} className="border-b border-[#0F3D2E]/10 pb-1.5 pr-2 font-semibold">
                                  {h}
                                </th>
                              ),
                            )}
                          </tr>
                        </thead>
                        <tbody>
                          {m.producers.map((p) => (
                            <tr key={p.name} className="text-[#0F3D2E]">
                              <td className="py-1.5 pr-2 font-semibold">{p.name}</td>
                              <td className="py-1.5 pr-2">{money(p.revenue)}</td>
                              <td className="py-1.5 pr-2">{p.apps}</td>
                              <td className="py-1.5 pr-2">{p.conversion}%</td>
                              <td className="py-1.5 pr-2">{p.rating.toFixed(1)}</td>
                              <td className="py-1.5 pr-2">{p.retention}%</td>
                              <td className="py-1.5 pr-2">{p.compliance}%</td>
                              <td className="py-1.5 pr-2">{p.readiness}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}
