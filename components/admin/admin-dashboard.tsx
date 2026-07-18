'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Settings, RefreshCw, LogOut, SlidersHorizontal } from 'lucide-react'
import {
  AcaEnrollmentFlagsPanel,
  AcaStateLicensingPanel,
} from '@/components/admin/aca-flags-panels'

/* ---------------------------------------------------------------------------
 * Types
 * ------------------------------------------------------------------------- */

type Application = {
  id: string
  application_status: string
  first_name: string
  last_name: string
  email: string
  phone: string | null
  address: string | null
  city: string | null
  state: string | null
  zip: string | null
  date_of_birth: string | null
  plan_type: string | null
  source: string | null
  notes: string | null
  created_at: string
}

type Career = {
  id: string
  first_name: string
  last_name: string
  email: string
  phone: string | null
  position: string
  location: string | null
  work_authorization: string | null
  linkedin_url: string | null
  portfolio_url: string | null
  cover_letter: string | null
  status: string
  created_at: string
}

type LedgerLog = {
  id: string
  memberId?: string
  type?: string
  action?: string
  amount?: number
  currency?: string
  txId?: string
  blockNumber?: number
  status?: string
  createdAt?: string
}

type CareerListingRow = {
  id: string
  title: string
  department: string
  employment_type: string
  location: string
  description: string
  sort_order: number
  published: boolean
}

type AcaFlag = {
  id: string
  key: string
  name: string
  description: string
  enabled: boolean
  start_date: string | null
  end_date: string | null
  updated_at: string
  active: boolean
}

type AcaState = {
  id: string
  state_code: string
  state_name: string
  enabled: boolean
  licensed: boolean
  display_order: number
  updated_at: string
  status: string
}

type WorkspaceId = 'overview' | 'files' | 'employees' | 'operations' | 'ledger'
type FileFolderId = 'all' | 'aca' | 'medicare' | 'enrolled' | 'other'
type EmployeePanelId = 'overview' | 'hiring' | 'job-board' | 'sales'

const APPLICATION_STATUSES = [
  'submitted',
  'under_review',
  'additional_information',
  'approved',
  'declined',
  'active',
] as const

const CAREER_STATUSES = [
  'new',
  'reviewing',
  'interview',
  'offer',
  'hired',
  'declined',
  'archived',
] as const

const ENROLLED_STATUSES = new Set(['approved', 'active'])

const DEPARTMENTS = [
  'Insurance & Enrollment',
  'Member Services',
  'Engineering',
  'Design',
  'Data',
  'Compliance',
  'Operations',
  'Sales & Marketing',
] as const

const EMPTY_LISTING = {
  title: '',
  department: 'Insurance & Enrollment',
  employment_type: 'Full-Time',
  location: 'Remote — US',
  description: '',
  sort_order: 100,
  published: true,
}

const NAV_TABS: { id: Exclude<WorkspaceId, 'operations'>; label: string }[] = [
  { id: 'overview', label: 'Overview' },
  { id: 'files', label: 'Clients' },
  { id: 'employees', label: 'Employees' },
  { id: 'ledger', label: 'Ledger' },
]

/* ---------------------------------------------------------------------------
 * Helpers
 * ------------------------------------------------------------------------- */

function isAcaApplication(a: { plan_type: string | null; source: string | null }) {
  return (
    (a.plan_type ? /aca|marketplace/i.test(a.plan_type) : false) ||
    a.source === 'enrollment' ||
    (a.source ? /aca/i.test(a.source) : false)
  )
}

function isMedicareApplication(a: { plan_type: string | null; source: string | null }) {
  return (
    (a.plan_type ? /medicare/i.test(a.plan_type) : false) ||
    a.source === 'medicare.reviews' ||
    (a.source ? /medicare/i.test(a.source) : false)
  )
}

function fmtDate(iso?: string | null) {
  if (!iso) return '—'
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return iso
  return d.toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

function fmtShort(iso?: string | null) {
  if (!iso) return '—'
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return iso
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

function parseEnrollmentNotes(notes: string | null | undefined) {
  if (!notes) return null
  try {
    const parsed = JSON.parse(notes) as {
      enrollment_period?: string
      household?: {
        size?: number
        annual_income?: number
        coverage_start?: string
        filing_status?: string
        current_coverage?: string
      }
      sep?: { qualifying_event?: string | null; event_date?: string | null }
      applicant?: { ssn_last4?: string; sex?: string; tobacco?: string }
      dependents?: unknown[]
    }
    if (!parsed || typeof parsed !== 'object') return null
    return parsed
  } catch {
    return null
  }
}

function sourceLabel(a: Application) {
  if (isMedicareApplication(a)) return 'Medicare.Reviews'
  if (isAcaApplication(a)) return 'ACA Enroll'
  if (a.source) return a.source
  return 'Untagged'
}

function folderFor(a: Application): FileFolderId {
  if (ENROLLED_STATUSES.has(a.application_status)) return 'enrolled'
  if (isMedicareApplication(a)) return 'medicare'
  if (isAcaApplication(a)) return 'aca'
  return 'other'
}

function statusBadge(status: string) {
  const map: Record<string, string> = {
    submitted: 'bg-[#C9A961]/15 text-[#8a6d16]',
    under_review: 'bg-[#2563eb]/12 text-[#1d4ed8]',
    additional_information: 'bg-[#f59e0b]/15 text-[#b45309]',
    approved: 'bg-[#0F3D2E]/12 text-[#0F3D2E]',
    active: 'bg-[#0F3D2E]/12 text-[#0F3D2E]',
    declined: 'bg-[#B42318]/12 text-[#B42318]',
    new: 'bg-[#C9A961]/15 text-[#8a6d16]',
    reviewing: 'bg-[#2563eb]/12 text-[#1d4ed8]',
    interview: 'bg-[#0F3D2E]/12 text-[#0F3D2E]',
    offer: 'bg-[#0F3D2E]/12 text-[#0F3D2E]',
    hired: 'bg-[#0F3D2E]/12 text-[#0F3D2E]',
    archived: 'bg-[#0F3D2E]/10 text-[#55655D]',
  }
  const cls = map[status] ?? 'bg-[#0F3D2E]/10 text-[#0F3D2E]'
  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-1 font-sans text-[0.6875rem] font-semibold uppercase tracking-[0.04em] ${cls}`}
    >
      {status.replace(/_/g, ' ')}
    </span>
  )
}

const cardClass =
  'rounded-[20px] border border-[#0F3D2E]/10 bg-[#FAFCFB] p-5 shadow-[0_4px_20px_rgba(15,61,46,0.05)] transition hover:-translate-y-0.5 hover:shadow-[0_12px_30px_rgba(15,61,46,0.1)]'
const selectClass =
  'rounded-[12px] border border-[#0F3D2E]/15 bg-[#F7F3EE] px-3 py-2 font-sans text-[0.8125rem] font-semibold text-[#0F3D2E] outline-none focus:border-[#0F3D2E]'
const fieldClass =
  'w-full rounded-[12px] border border-[#0F3D2E]/15 bg-[#F7F3EE] px-3 py-2 font-sans text-[0.875rem] text-[#0F3D2E] outline-none focus:border-[#0F3D2E]'
const displayFont = { fontFamily: "'Playfair Display', Georgia, serif" } as const

/* ---------------------------------------------------------------------------
 * Main dashboard
 * ------------------------------------------------------------------------- */

export function AdminDashboard({
  email,
  onSignOut,
}: {
  email: string | null
  onSignOut: () => void | Promise<void>
}) {
  const [workspace, setWorkspace] = useState<WorkspaceId>('overview')
  const [folder, setFolder] = useState<FileFolderId>('all')
  const [employeePanel, setEmployeePanel] = useState<EmployeePanelId>('overview')
  const [opsPanel, setOpsPanel] = useState<'flags' | 'states'>('flags')
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [query, setQuery] = useState('')
  const [settingsOpen, setSettingsOpen] = useState(false)
  const settingsRef = useRef<HTMLDivElement>(null)

  const [applications, setApplications] = useState<Application[]>([])
  const [careers, setCareers] = useState<Career[]>([])
  const [listings, setListings] = useState<CareerListingRow[]>([])
  const [acaFlags, setAcaFlags] = useState<AcaFlag[]>([])
  const [acaStates, setAcaStates] = useState<AcaState[]>([])
  const [ledger, setLedger] = useState<LedgerLog[]>([])
  const [ledgerNote, setLedgerNote] = useState<string | null>(null)

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [flash, setFlash] = useState<string | null>(null)

  const loadAll = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const [appsRes, careersRes, listingsRes, flagsRes, statesRes, ledgerRes] =
        await Promise.all([
          fetch('/api/admin/applications', { cache: 'no-store' }),
          fetch('/api/admin/careers', { cache: 'no-store' }),
          fetch('/api/admin/career-listings', { cache: 'no-store' }),
          fetch('/api/admin/aca-flags', { cache: 'no-store' }),
          fetch('/api/admin/aca-states', { cache: 'no-store' }),
          fetch('/api/admin/ledger-logs', { cache: 'no-store' }),
        ])

      if (appsRes.status === 403 || careersRes.status === 403) {
        setError('Your account is not authorized for admin access.')
        return
      }

      const appsData = await appsRes.json().catch(() => ({}))
      const careersData = await careersRes.json().catch(() => ({}))
      const listingsData = await listingsRes.json().catch(() => ({}))
      const flagsData = await flagsRes.json().catch(() => ({}))
      const statesData = await statesRes.json().catch(() => ({}))
      const ledgerData = await ledgerRes.json().catch(() => ({}))

      setApplications(appsData?.applications ?? [])
      setCareers(careersData?.careers ?? [])
      setListings(listingsData?.listings ?? [])
      setAcaFlags(flagsData?.flags ?? [])
      setAcaStates(statesData?.states ?? [])
      setLedger(ledgerData?.logs ?? [])
      setLedgerNote(
        ledgerData?.comingSoon
          ? ledgerData?.message || 'Hyperledger logs are coming soon.'
          : !ledgerData?.ok
            ? ledgerData?.message || 'Could not load ledger logs.'
            : null,
      )
    } catch {
      setError('Could not load admin data. Please try again.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void loadAll()
  }, [loadAll])

  useEffect(() => {
    if (!settingsOpen) return
    const onPointer = (e: MouseEvent) => {
      if (settingsRef.current && !settingsRef.current.contains(e.target as Node)) {
        setSettingsOpen(false)
      }
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setSettingsOpen(false)
    }
    document.addEventListener('mousedown', onPointer)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onPointer)
      document.removeEventListener('keydown', onKey)
    }
  }, [settingsOpen])

  const clientsBadge = useMemo(
    () =>
      applications.filter((a) =>
        a.application_status === 'submitted' || a.application_status === 'under_review',
      ).length,
    [applications],
  )

  const goHome = () => {
    setWorkspace('overview')
    setSettingsOpen(false)
    void loadAll()
  }

  const acaApplications = useMemo(
    () => applications.filter(isAcaApplication),
    [applications],
  )
  const medicareApplications = useMemo(
    () => applications.filter(isMedicareApplication),
    [applications],
  )
  const enrollments = useMemo(
    () => applications.filter((a) => ENROLLED_STATUSES.has(a.application_status)),
    [applications],
  )
  const otherApplications = useMemo(
    () =>
      applications.filter(
        (a) =>
          !isAcaApplication(a) &&
          !isMedicareApplication(a) &&
          !ENROLLED_STATUSES.has(a.application_status),
      ),
    [applications],
  )

  const folderCounts = useMemo(
    () => ({
      all: applications.length,
      aca: acaApplications.length,
      medicare: medicareApplications.length,
      enrolled: enrollments.length,
      other: otherApplications.length,
    }),
    [
      applications.length,
      acaApplications.length,
      medicareApplications.length,
      enrollments.length,
      otherApplications.length,
    ],
  )

  const folderRows = useMemo(() => {
    const base =
      folder === 'aca'
        ? acaApplications
        : folder === 'medicare'
          ? medicareApplications
          : folder === 'enrolled'
            ? enrollments
            : folder === 'other'
              ? otherApplications
              : applications
    const q = query.trim().toLowerCase()
    if (!q) return base
    return base.filter((a) => {
      const hay = [
        a.first_name,
        a.last_name,
        a.email,
        a.phone,
        a.city,
        a.state,
        a.plan_type,
        a.source,
        a.application_status,
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase()
      return hay.includes(q)
    })
  }, [
    folder,
    query,
    applications,
    acaApplications,
    medicareApplications,
    enrollments,
    otherApplications,
  ])

  const selected = useMemo(
    () => applications.find((a) => a.id === selectedId) ?? null,
    [applications, selectedId],
  )

  useEffect(() => {
    if (selectedId && !folderRows.some((r) => r.id === selectedId)) {
      setSelectedId(folderRows[0]?.id ?? null)
    }
  }, [folderRows, selectedId])

  const hiringStats = useMemo(() => {
    const byStatus: Record<string, number> = {}
    for (const s of CAREER_STATUSES) byStatus[s] = 0
    for (const c of careers) byStatus[c.status] = (byStatus[c.status] ?? 0) + 1
    return byStatus
  }, [careers])

  const salesStats = useMemo(() => {
    const bySource: Record<string, number> = {}
    const byStatus: Record<string, number> = {}
    const byState: Record<string, number> = {}
    let last7 = 0
    const weekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000
    for (const a of applications) {
      const src = sourceLabel(a)
      bySource[src] = (bySource[src] ?? 0) + 1
      byStatus[a.application_status] = (byStatus[a.application_status] ?? 0) + 1
      if (a.state) byState[a.state] = (byState[a.state] ?? 0) + 1
      if (new Date(a.created_at).getTime() >= weekAgo) last7 += 1
    }
    const enrolled = enrollments.length
    const conversion =
      applications.length > 0 ? Math.round((enrolled / applications.length) * 100) : 0
    return { bySource, byStatus, byState, last7, conversion, enrolled }
  }, [applications, enrollments.length])

  const updateStatus = async (id: string, application_status: string) => {
    setFlash(null)
    const res = await fetch('/api/admin/applications', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, application_status }),
    })
    const data = await res.json().catch(() => ({}))
    if (!res.ok || !data?.ok) {
      setFlash(data?.error || 'Could not update status.')
      return
    }
    setApplications((prev) =>
      prev.map((a) => (a.id === id ? { ...a, application_status } : a)),
    )
    setFlash('Application status updated.')
  }

  const updateCareerStatus = async (id: string, status: string) => {
    setFlash(null)
    const res = await fetch('/api/admin/careers', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, status }),
    })
    const data = await res.json().catch(() => ({}))
    if (!res.ok || !data?.ok) {
      setFlash(data?.error || 'Could not update career status.')
      return
    }
    setCareers((prev) => prev.map((c) => (c.id === id ? { ...c, status } : c)))
    setFlash('Hiring pipeline updated.')
  }

  return (
    <main className="min-h-dvh bg-[radial-gradient(ellipse_at_12%_0%,rgba(201,169,97,0.14)_0%,transparent_42%),linear-gradient(165deg,#E8DFD6_0%,#F7F3EE_48%,#EFE8DF_100%)]">
      <div className="mx-auto max-w-[1400px] px-4 py-8 sm:px-6 lg:px-8">
        {/* Office-style workspace header */}
        <div className="relative mb-10 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="m-0 font-sans text-[10px] font-semibold uppercase tracking-[0.28em] text-[#C9A961]">
              Centuries Mutual · Office
            </p>
            <button
              type="button"
              onClick={goHome}
              className="m-0 mt-2 block cursor-pointer border-0 bg-transparent p-0 text-left font-medium tracking-tight text-[#0F3D2E] transition hover:text-[#245C45]"
              style={{ ...displayFont, fontSize: 'clamp(1.85rem,3vw,2.45rem)' }}
              title="Refresh and return to Overview"
            >
              Administration
            </button>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => void loadAll()}
              aria-label="Refresh"
              title="Refresh"
              className="inline-flex h-10 w-10 items-center justify-center rounded-[12px] border-0 bg-transparent text-[#0F3D2E] transition hover:-translate-y-0.5 hover:text-[#245C45]"
            >
              <RefreshCw className="h-4 w-4" strokeWidth={2.25} />
            </button>
            <div className="relative" ref={settingsRef}>
              <button
                type="button"
                onClick={() => setSettingsOpen((o) => !o)}
                aria-label="Settings"
                aria-expanded={settingsOpen}
                title="Settings"
                className="inline-flex h-10 w-10 items-center justify-center rounded-[12px] border border-[#0F3D2E]/18 bg-[#FAFCFB] text-[#0F3D2E] transition hover:-translate-y-0.5 hover:border-[#0F3D2E] hover:bg-[#0F3D2E] hover:text-[#FAFCFB]"
              >
                <Settings className="h-4 w-4" strokeWidth={2.25} />
              </button>
              {settingsOpen ? (
                <div className="absolute right-0 z-30 mt-2 w-52 overflow-hidden rounded-[14px] border border-[#0F3D2E]/12 bg-[#FAFCFB] shadow-[0_16px_40px_rgba(15,61,46,0.16)]">
                  {email ? (
                    <p className="m-0 truncate border-b border-[#0F3D2E]/08 px-3.5 py-2.5 font-sans text-[0.6875rem] text-[#55655D]">
                      {email}
                    </p>
                  ) : null}
                  <button
                    type="button"
                    onClick={() => {
                      setSettingsOpen(false)
                      setWorkspace('operations')
                    }}
                    className="flex w-full items-center gap-2.5 px-3.5 py-2.5 text-left font-sans text-[0.8125rem] font-semibold text-[#0F3D2E] transition hover:bg-[#0F3D2E]/[0.06]"
                  >
                    <SlidersHorizontal className="h-3.5 w-3.5 shrink-0" strokeWidth={2.25} />
                    Operations
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setSettingsOpen(false)
                      void onSignOut()
                    }}
                    className="flex w-full items-center gap-2.5 border-t border-[#0F3D2E]/08 px-3.5 py-2.5 text-left font-sans text-[0.8125rem] font-semibold text-[#B42318] transition hover:bg-[#B42318]/[0.06]"
                  >
                    <LogOut className="h-3.5 w-3.5 shrink-0" strokeWidth={2.25} />
                    Sign out
                  </button>
                </div>
              ) : null}
            </div>
          </div>
          <div
            aria-hidden
            className="pointer-events-none absolute -bottom-5 left-0 right-0 h-px bg-[linear-gradient(90deg,transparent,rgba(15,61,46,0.18),transparent)]"
          />
        </div>

        {/* Workspace nav — minimal folder tabs */}
        <nav className="mb-8" aria-label="Office sections">
          <div className="flex items-end gap-1 overflow-x-auto border-b border-[#B89A78] px-0.5">
            {NAV_TABS.map((w) => {
              const active = workspace === w.id
              return (
                <button
                  key={w.id}
                  type="button"
                  onClick={() => setWorkspace(w.id)}
                  className={`relative -mb-px flex shrink-0 items-center gap-1.5 rounded-t-[10px] border border-b-0 px-4 py-2.5 font-sans text-[0.8125rem] font-semibold transition ${
                    active
                      ? 'z-10 border-[#B89A78] bg-[#F7F3EE] text-[#0F3D2E]'
                      : 'z-0 border-transparent bg-[#C9B396]/55 text-[#0F3D2E]/70 hover:bg-[#C9B396]/85 hover:text-[#0F3D2E]'
                  }`}
                >
                  {w.label}
                  {w.id === 'files' ? (
                    <span
                      className={`inline-flex min-w-[1.15rem] items-center justify-center rounded-full px-1.5 py-0.5 font-sans text-[0.625rem] font-bold leading-none ${
                        active
                          ? 'bg-[#0F3D2E] text-[#FAFCFB]'
                          : 'bg-[#0F3D2E]/75 text-[#FAFCFB]'
                      }`}
                    >
                      {clientsBadge > 99 ? '99+' : clientsBadge}
                    </span>
                  ) : null}
                </button>
              )
            })}
          </div>
        </nav>

        {flash ? (
          <p className="mb-4 rounded-[12px] border border-[#0F3D2E]/10 bg-[#E8F0EA] px-4 py-3 font-sans text-[0.875rem] text-[#0F3D2E]">
            {flash}
          </p>
        ) : null}
        {error ? (
          <p className="mb-4 rounded-[12px] bg-[#B42318]/[0.08] px-4 py-3 font-sans text-[0.875rem] text-[#B42318]">
            {error}
          </p>
        ) : null}

        {loading ? (
          <div className={`${cardClass} py-16 text-center`}>
            <p className="m-0 font-sans text-[0.9375rem] text-[#55655D]">Loading workspace…</p>
          </div>
        ) : (
          <AnimatePresence mode="wait">
            <motion.div
              key={workspace}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.22 }}
            >
              {workspace === 'overview' && (
                <OverviewPanel applications={applications} careers={careers} />
              )}

              {workspace === 'files' && (
                <FilesWorkspace
                  folder={folder}
                  counts={folderCounts}
                  rows={folderRows}
                  selected={selected}
                  query={query}
                  sales={salesStats}
                  acaCount={acaApplications.length}
                  medicareCount={medicareApplications.length}
                  enrolledCount={enrollments.length}
                  onQuery={setQuery}
                  onFolder={(id) => {
                    setFolder(id)
                    setSelectedId(null)
                  }}
                  onSelect={setSelectedId}
                  onUpdateStatus={updateStatus}
                />
              )}

              {workspace === 'employees' && (
                <EmployeesWorkspace
                  panel={employeePanel}
                  onPanel={setEmployeePanel}
                  careers={careers}
                  listings={listings}
                  hiringStats={hiringStats}
                  sales={salesStats}
                  onUpdateCareer={updateCareerStatus}
                  onListingsChange={setListings}
                  onFlash={setFlash}
                />
              )}

              {workspace === 'operations' && (
                <div className="space-y-4">
                  <div className="flex flex-wrap gap-2">
                    {(
                      [
                        { id: 'flags' as const, label: 'ACA enrollment flags' },
                        { id: 'states' as const, label: 'State licensing' },
                      ] as const
                    ).map((p) => (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => setOpsPanel(p.id)}
                        className={`rounded-[12px] px-4 py-2 font-sans text-[0.8125rem] font-semibold transition ${
                          opsPanel === p.id
                            ? 'bg-[#0F3D2E] text-[#FAFCFB]'
                            : 'border border-[#0F3D2E]/10 bg-[#FAFCFB] text-[#0F3D2E] hover:bg-[#0F3D2E]/[0.06]'
                        }`}
                      >
                        {p.label}
                      </button>
                    ))}
                  </div>
                  {opsPanel === 'flags' ? (
                    <AcaEnrollmentFlagsPanel
                      flags={acaFlags}
                      onChange={setAcaFlags}
                      onFlash={setFlash}
                    />
                  ) : (
                    <AcaStateLicensingPanel
                      states={acaStates}
                      onChange={setAcaStates}
                      onFlash={setFlash}
                    />
                  )}
                </div>
              )}

              {workspace === 'ledger' && <LedgerTable rows={ledger} note={ledgerNote} />}
            </motion.div>
          </AnimatePresence>
        )}
      </div>
    </main>
  )
}

/* ---------------------------------------------------------------------------
 * Overview
 * ------------------------------------------------------------------------- */

function OverviewPanel({
  applications,
  careers,
}: {
  applications: Application[]
  careers: Career[]
}) {
  return (
    <div className="space-y-6">
      <OfficeCalendar applications={applications} careers={careers} />
    </div>
  )
}

function OfficeCalendar({
  applications,
  careers,
}: {
  applications: Application[]
  careers: Career[]
}) {
  const [cursor, setCursor] = useState(() => {
    const d = new Date()
    return new Date(d.getFullYear(), d.getMonth(), 1)
  })
  const [selectedDay, setSelectedDay] = useState<number | null>(() => new Date().getDate())

  const year = cursor.getFullYear()
  const month = cursor.getMonth()
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const firstWeekday = new Date(year, month, 1).getDay()
  const today = new Date()

  const monthNames = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ]

  const eventsByDay = useMemo(() => {
    const map = new Map<number, { apps: number; careers: number }>()
    const bump = (iso: string, kind: 'apps' | 'careers') => {
      const d = new Date(iso)
      if (d.getFullYear() !== year || d.getMonth() !== month) return
      const day = d.getDate()
      const cur = map.get(day) ?? { apps: 0, careers: 0 }
      cur[kind] += 1
      map.set(day, cur)
    }
    for (const a of applications) bump(a.created_at, 'apps')
    for (const c of careers) bump(c.created_at, 'careers')
    return map
  }, [applications, careers, year, month])

  const selectedEvents = selectedDay != null ? eventsByDay.get(selectedDay) : null
  const selectedLabel =
    selectedDay != null
      ? new Date(year, month, selectedDay).toLocaleDateString('en-US', {
          weekday: 'long',
          month: 'long',
          day: 'numeric',
          year: 'numeric',
        })
      : null

  const cells: (number | null)[] = []
  for (let i = 0; i < firstWeekday; i++) cells.push(null)
  for (let d = 1; d <= daysInMonth; d++) cells.push(d)

  return (
    <div className={`${cardClass} !p-0 overflow-hidden`}>
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#0F3D2E]/10 bg-[linear-gradient(135deg,#F7F3EE_0%,#EFE8DF_100%)] px-5 py-4">
        <div>
          <p className="m-0 font-sans text-[0.6875rem] font-semibold uppercase tracking-[0.16em] text-[#C9A961]">
            Calendar
          </p>
          <h2 className="m-0 mt-1 font-medium text-[#0F3D2E]" style={{ ...displayFont, fontSize: '1.45rem' }}>
            {monthNames[month]} {year}
          </h2>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            aria-label="Previous month"
            onClick={() => setCursor(new Date(year, month - 1, 1))}
            className="inline-flex h-9 w-9 items-center justify-center rounded-[10px] border border-[#0F3D2E]/15 bg-[#FAFCFB] font-sans text-[0.875rem] font-semibold text-[#0F3D2E] transition hover:bg-[#0F3D2E] hover:text-[#FAFCFB]"
          >
            ‹
          </button>
          <button
            type="button"
            onClick={() => {
              const now = new Date()
              setCursor(new Date(now.getFullYear(), now.getMonth(), 1))
              setSelectedDay(now.getDate())
            }}
            className="rounded-[10px] border border-[#0F3D2E]/15 bg-[#FAFCFB] px-3 py-1.5 font-sans text-[0.75rem] font-semibold text-[#0F3D2E] transition hover:bg-[#0F3D2E] hover:text-[#FAFCFB]"
          >
            Today
          </button>
          <button
            type="button"
            aria-label="Next month"
            onClick={() => setCursor(new Date(year, month + 1, 1))}
            className="inline-flex h-9 w-9 items-center justify-center rounded-[10px] border border-[#0F3D2E]/15 bg-[#FAFCFB] font-sans text-[0.875rem] font-semibold text-[#0F3D2E] transition hover:bg-[#0F3D2E] hover:text-[#FAFCFB]"
          >
            ›
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-0 lg:grid-cols-[minmax(0,1.4fr)_minmax(260px,0.8fr)]">
        <div className="p-4 sm:p-5">
          <div className="mb-2 grid grid-cols-7 gap-1">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d) => (
              <div
                key={d}
                className="py-1 text-center font-sans text-[0.6875rem] font-semibold uppercase tracking-[0.08em] text-[#55655D]"
              >
                {d}
              </div>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-1">
            {cells.map((day, i) => {
              if (day == null) {
                return <div key={`e-${i}`} className="aspect-square min-h-[2.75rem]" />
              }
              const ev = eventsByDay.get(day)
              const isToday =
                today.getFullYear() === year &&
                today.getMonth() === month &&
                today.getDate() === day
              const isSelected = selectedDay === day
              return (
                <button
                  key={day}
                  type="button"
                  onClick={() => setSelectedDay(day)}
                  className={`relative flex aspect-square min-h-[2.75rem] flex-col items-center justify-start rounded-[12px] pt-1.5 font-sans text-[0.8125rem] transition ${
                    isSelected
                      ? 'bg-[#0F3D2E] text-[#FAFCFB] shadow-[0_4px_12px_rgba(15,61,46,0.25)]'
                      : isToday
                        ? 'bg-[#C9A961]/25 font-semibold text-[#0F3D2E]'
                        : 'text-[#0F3D2E] hover:bg-[#0F3D2E]/[0.06]'
                  }`}
                >
                  <span>{day}</span>
                  {ev && (ev.apps > 0 || ev.careers > 0) ? (
                    <span className="mt-auto mb-1.5 flex gap-0.5">
                      {ev.apps > 0 ? (
                        <span
                          className={`h-1.5 w-1.5 rounded-full ${isSelected ? 'bg-[#C9A961]' : 'bg-[#0F3D2E]'}`}
                        />
                      ) : null}
                      {ev.careers > 0 ? (
                        <span
                          className={`h-1.5 w-1.5 rounded-full ${isSelected ? 'bg-[#E8DFD6]' : 'bg-[#C9A961]'}`}
                        />
                      ) : null}
                    </span>
                  ) : null}
                </button>
              )
            })}
          </div>
        </div>

        <aside className="border-t border-[#0F3D2E]/10 bg-[#F7F3EE] p-5 lg:border-l lg:border-t-0">
          <p className="m-0 font-sans text-[0.6875rem] font-semibold uppercase tracking-[0.14em] text-[#C9A961]">
            Day detail
          </p>
          <p className="m-0 mt-1 font-sans text-[0.9375rem] font-semibold text-[#0F3D2E]">
            {selectedLabel ?? 'Select a day'}
          </p>
          <div className="mt-4 space-y-3">
            <div className="rounded-[14px] border border-[#0F3D2E]/08 bg-[#FAFCFB] px-3.5 py-3">
              <p className="m-0 font-sans text-[0.6875rem] font-semibold uppercase tracking-[0.1em] text-[#55655D]">
                Client applications
              </p>
              <p className="m-0 mt-1 font-sans text-[1.75rem] font-semibold leading-none text-[#0F3D2E]">
                {selectedEvents?.apps ?? 0}
              </p>
            </div>
            <div className="rounded-[14px] border border-[#0F3D2E]/08 bg-[#FAFCFB] px-3.5 py-3">
              <p className="m-0 font-sans text-[0.6875rem] font-semibold uppercase tracking-[0.1em] text-[#55655D]">
                Career applications
              </p>
              <p className="m-0 mt-1 font-sans text-[1.75rem] font-semibold leading-none text-[#0F3D2E]">
                {selectedEvents?.careers ?? 0}
              </p>
            </div>
          </div>
          <div className="mt-5 flex flex-wrap gap-3 font-sans text-[0.6875rem] text-[#55655D]">
            <span className="inline-flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-[#0F3D2E]" /> Clients
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-[#C9A961]" /> Careers
            </span>
          </div>
        </aside>
      </div>
    </div>
  )
}

/* ---------------------------------------------------------------------------
 * Files workspace (filesystem)
 * ------------------------------------------------------------------------- */

function FilesWorkspace({
  folder,
  counts,
  rows,
  selected,
  query,
  sales,
  acaCount,
  medicareCount,
  enrolledCount,
  onQuery,
  onFolder,
  onSelect,
  onUpdateStatus,
}: {
  folder: FileFolderId
  counts: Record<FileFolderId, number>
  rows: Application[]
  selected: Application | null
  query: string
  sales: { last7: number; conversion: number }
  acaCount: number
  medicareCount: number
  enrolledCount: number
  onQuery: (q: string) => void
  onFolder: (id: FileFolderId) => void
  onSelect: (id: string) => void
  onUpdateStatus: (id: string, status: string) => void | Promise<void>
}) {
  const folders: { id: FileFolderId; name: string; path: string }[] = [
    { id: 'all', name: 'All Applications', path: '/Applications' },
    { id: 'aca', name: 'ACA · Marketplace', path: '/Applications/ACA' },
    { id: 'medicare', name: 'Medicare.Reviews', path: '/Applications/Medicare.Reviews' },
    { id: 'enrolled', name: 'Enrolled Members', path: '/Applications/Enrolled' },
    { id: 'other', name: 'Other / Untagged', path: '/Applications/Other' },
  ]

  const activePath = folders.find((f) => f.id === folder)?.path ?? '/Applications'

  const miniStats: {
    id: FileFolderId
    label: string
    value: number
    sub: string
  }[] = [
    {
      id: 'all',
      label: 'All',
      value: counts.all,
      sub: `${sales.last7} / 7d`,
    },
    {
      id: 'aca',
      label: 'ACA',
      value: acaCount,
      sub: 'Marketplace',
    },
    {
      id: 'medicare',
      label: 'Medicare',
      value: medicareCount,
      sub: 'Reviews',
    },
    {
      id: 'enrolled',
      label: 'Active',
      value: enrolledCount,
      sub: `${sales.conversion}%`,
    },
  ]

  return (
    <div className="overflow-hidden rounded-[20px] border border-[#0F3D2E]/10 bg-[#FAFCFB] shadow-[0_4px_20px_rgba(15,61,46,0.05)]">
      <div className="flex flex-wrap items-center gap-2.5 border-b border-[#0F3D2E]/10 bg-[linear-gradient(135deg,#F7F3EE_0%,#EFE8DF_100%)] px-4 py-3">
        <div className="mr-1 hidden min-w-0 shrink-0 sm:block">
          <p className="m-0 font-sans text-[0.625rem] font-semibold uppercase tracking-[0.14em] text-[#C9A961]">
            Clients
          </p>
          <p className="m-0 truncate font-mono text-[0.6875rem] text-[#0F3D2E]">{activePath}</p>
        </div>
        <div className="flex min-w-0 flex-1 flex-wrap items-center gap-1.5">
          {miniStats.map((s) => (
            <button
              key={s.id}
              type="button"
              onClick={() => onFolder(s.id)}
              className={`min-w-[4.5rem] rounded-[10px] border px-2 py-1.5 text-left transition ${
                folder === s.id
                  ? 'border-[#0F3D2E] bg-[#0F3D2E] text-[#FAFCFB]'
                  : 'border-[#0F3D2E]/12 bg-[#FAFCFB] text-[#0F3D2E] hover:border-[#0F3D2E]/30'
              }`}
            >
              <p
                className={`m-0 font-sans text-[0.5625rem] font-semibold uppercase tracking-[0.08em] ${
                  folder === s.id ? 'text-white/70' : 'text-[#55655D]'
                }`}
              >
                {s.label}
              </p>
              <p className="m-0 font-sans text-[0.9375rem] font-semibold leading-tight">{s.value}</p>
              <p
                className={`m-0 truncate font-sans text-[0.5625rem] ${
                  folder === s.id ? 'text-white/60' : 'text-[#55655D]'
                }`}
              >
                {s.sub}
              </p>
            </button>
          ))}
        </div>
        <input
          value={query}
          onChange={(e) => onQuery(e.target.value)}
          placeholder="Search name, email, state, source…"
          className="w-full max-w-xs rounded-[12px] border border-[#0F3D2E]/15 bg-[#FAFCFB] px-3 py-2 font-sans text-[0.8125rem] text-[#0F3D2E] outline-none focus:border-[#0F3D2E] sm:w-56"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[240px_minmax(0,1fr)_minmax(0,1.1fr)]">
        {/* Folder tree */}
        <aside className="border-b border-[#0F3D2E]/10 bg-[#F7F3EE] p-3 lg:border-b-0 lg:border-r">
          <p className="mb-2 px-2 font-sans text-[0.6875rem] font-semibold uppercase tracking-[0.12em] text-[#55655D]">
            Folders
          </p>
          <div className="space-y-1">
            {folders.map((f) => (
              <button
                key={f.id}
                type="button"
                onClick={() => onFolder(f.id)}
                className={`flex w-full items-center justify-between rounded-[12px] px-3 py-2.5 text-left font-sans text-[0.8125rem] transition ${
                  folder === f.id
                    ? 'bg-[linear-gradient(135deg,#0F3D2E_0%,#14432A_100%)] font-semibold text-[#FAFCFB] shadow-[0_4px_12px_rgba(15,61,46,0.2)]'
                    : 'font-medium text-[#0F3D2E] hover:bg-[#FAFCFB]'
                }`}
              >
                <span className="truncate">{f.name}</span>
                <span
                  className={`ml-2 rounded-full px-2 py-0.5 text-[0.6875rem] ${
                    folder === f.id ? 'bg-white/15 text-white' : 'bg-[#0F3D2E]/10 text-[#55655D]'
                  }`}
                >
                  {counts[f.id]}
                </span>
              </button>
            ))}
          </div>
        </aside>

        {/* File list */}
        <section className="min-h-[420px] border-b border-[#0F3D2E]/08 lg:border-b-0 lg:border-r">
          {rows.length === 0 ? (
            <div className="flex h-full min-h-[420px] items-center justify-center p-6">
              <p className="m-0 text-center font-sans text-[0.875rem] text-[#55655D]">
                {folder === 'medicare'
                  ? 'No Medicare.Reviews applications yet. They appear here when medicare.reviews POSTs to /api/enrollment/medicare with source tagging.'
                  : 'This folder is empty.'}
              </p>
            </div>
          ) : (
            <ul className="max-h-[640px] divide-y divide-[#0F3D2E]/08 overflow-y-auto">
              {rows.map((a) => {
                const active = selected?.id === a.id
                return (
                  <li key={a.id}>
                    <button
                      type="button"
                      onClick={() => onSelect(a.id)}
                      className={`flex w-full items-start gap-3 px-4 py-3.5 text-left transition ${
                        active ? 'bg-[#0F3D2E]/[0.06]' : 'hover:bg-[#FAFCFB]'
                      }`}
                    >
                      <span className="mt-0.5 inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-[10px] bg-[#0F3D2E]/10 font-sans text-[0.6875rem] font-bold text-[#0F3D2E]">
                        {isMedicareApplication(a) ? 'MR' : isAcaApplication(a) ? 'ACA' : 'APP'}
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="flex flex-wrap items-center gap-2">
                          <span className="font-sans text-[0.875rem] font-semibold text-[#0F3D2E]">
                            {a.first_name} {a.last_name}
                          </span>
                          {statusBadge(a.application_status)}
                        </span>
                        <span className="mt-0.5 block truncate font-sans text-[0.75rem] text-[#55655D]">
                          {sourceLabel(a)}
                          {a.plan_type ? ` · ${a.plan_type}` : ''}
                          {a.state ? ` · ${a.state}` : ''}
                        </span>
                        <span className="mt-0.5 block font-sans text-[0.6875rem] text-[#55655D]/80">
                          {fmtShort(a.created_at)}
                        </span>
                      </span>
                    </button>
                  </li>
                )
              })}
            </ul>
          )}
        </section>

        {/* Detail pane */}
        <section className="min-h-[420px] bg-white p-5">
          {!selected ? (
            <div className="flex h-full min-h-[380px] items-center justify-center">
              <p className="m-0 font-sans text-[0.875rem] text-[#55655D]">
                Select a file to inspect the application record.
              </p>
            </div>
          ) : (
            <ApplicationDetail app={selected} onUpdateStatus={onUpdateStatus} />
          )}
        </section>
      </div>
    </div>
  )
}

function ApplicationDetail({
  app,
  onUpdateStatus,
}: {
  app: Application
  onUpdateStatus: (id: string, status: string) => void | Promise<void>
}) {
  const detail = parseEnrollmentNotes(app.notes)
  return (
    <div>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="m-0 font-sans text-[0.6875rem] font-semibold uppercase tracking-[0.14em] text-[#C9A961]">
            {sourceLabel(app)}
          </p>
          <h2 className="m-0 mt-1 font-medium text-[#0F3D2E]" style={{ ...displayFont, fontSize: '1.45rem' }}>
            {app.first_name} {app.last_name}
          </h2>
          <p className="m-0 mt-1 font-sans text-[0.8125rem] text-[#55655D]">
            Submitted {fmtDate(app.created_at)}
          </p>
        </div>
        <select
          value={app.application_status}
          onChange={(e) => void onUpdateStatus(app.id, e.target.value)}
          className={selectClass}
        >
          {APPLICATION_STATUSES.map((s) => (
            <option key={s} value={s}>
              {s.replace(/_/g, ' ')}
            </option>
          ))}
        </select>
      </div>

      <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
        {[
          { label: 'Email', value: app.email },
          { label: 'Phone', value: app.phone || '—' },
          { label: 'Date of birth', value: app.date_of_birth || '—' },
          { label: 'Plan type', value: app.plan_type || '—' },
          {
            label: 'Address',
            value: [app.address, app.city, app.state, app.zip].filter(Boolean).join(', ') || '—',
          },
          { label: 'Source', value: app.source || sourceLabel(app) },
        ].map((row) => (
          <div key={row.label} className="rounded-[12px] bg-[#FAFCFB] px-3 py-2.5">
            <p className="m-0 font-sans text-[0.6875rem] font-semibold uppercase tracking-[0.1em] text-[#55655D]">
              {row.label}
            </p>
            <p className="m-0 mt-1 break-words font-sans text-[0.875rem] text-[#0F3D2E]">
              {row.value}
            </p>
          </div>
        ))}
      </div>

      {detail ? (
        <div className="mt-5 rounded-[14px] border border-[#0F3D2E]/08 bg-[#F7FAF8] p-4">
          <p className="m-0 font-sans text-[0.75rem] font-semibold uppercase tracking-[0.12em] text-[#0F3D2E]">
            Enrollment packet
          </p>
          <div className="mt-3 space-y-1.5 font-sans text-[0.8125rem] text-[#55655D]">
            {detail.enrollment_period ? (
              <p className="m-0">
                Period:{' '}
                <strong className="text-[#0F3D2E]">
                  {detail.enrollment_period === 'sep' ? 'Special Enrollment' : 'Open Enrollment'}
                </strong>
              </p>
            ) : null}
            {detail.household?.coverage_start ? (
              <p className="m-0">
                Coverage start:{' '}
                <strong className="text-[#0F3D2E]">{detail.household.coverage_start}</strong>
              </p>
            ) : null}
            {typeof detail.household?.annual_income === 'number' ? (
              <p className="m-0">
                Income:{' '}
                <strong className="text-[#0F3D2E]">
                  ${detail.household.annual_income.toLocaleString('en-US')}
                </strong>
                {detail.household.size ? ` · HH ${detail.household.size}` : ''}
                {detail.household.filing_status ? ` · ${detail.household.filing_status}` : ''}
              </p>
            ) : null}
            {detail.applicant?.ssn_last4 ? (
              <p className="m-0">SSN ****{detail.applicant.ssn_last4}</p>
            ) : null}
            {detail.sep?.qualifying_event ? (
              <p className="m-0">
                SEP: {detail.sep.qualifying_event}
                {detail.sep.event_date ? ` (${detail.sep.event_date})` : ''}
              </p>
            ) : null}
            {Array.isArray(detail.dependents) ? (
              <p className="m-0">Dependents: {detail.dependents.length}</p>
            ) : null}
          </div>
        </div>
      ) : app.notes ? (
        <pre className="mt-5 overflow-x-auto whitespace-pre-wrap rounded-[14px] bg-[#F4F1EC] p-4 font-sans text-[0.8125rem] text-[#55655D]">
          {app.notes}
        </pre>
      ) : null}

      <div className="mt-5 rounded-[14px] border border-dashed border-[#0F3D2E]/15 px-4 py-5 text-center">
        <p className="m-0 font-sans text-[0.8125rem] font-semibold text-[#0F3D2E]">
          Document folder
        </p>
        <p className="m-0 mt-1 font-sans text-[0.75rem] text-[#55655D]">
          Supporting files for this application will appear here as medicare.reviews and ACA
          uploads land in storage.
        </p>
      </div>
    </div>
  )
}

/* ---------------------------------------------------------------------------
 * Employees workspace
 * ------------------------------------------------------------------------- */

function EmployeesWorkspace({
  panel,
  onPanel,
  careers,
  listings,
  hiringStats,
  sales,
  onUpdateCareer,
  onListingsChange,
  onFlash,
}: {
  panel: EmployeePanelId
  onPanel: (p: EmployeePanelId) => void
  careers: Career[]
  listings: CareerListingRow[]
  hiringStats: Record<string, number>
  sales: {
    bySource: Record<string, number>
    byStatus: Record<string, number>
    byState: Record<string, number>
    last7: number
    conversion: number
    enrolled: number
  }
  onUpdateCareer: (id: string, status: string) => void | Promise<void>
  onListingsChange: (rows: CareerListingRow[]) => void
  onFlash: (msg: string | null) => void
}) {
  const tabs: { id: EmployeePanelId; label: string }[] = [
    { id: 'overview', label: 'Workforce overview' },
    { id: 'hiring', label: 'Hiring pipeline' },
    { id: 'job-board', label: 'Careers page' },
    { id: 'sales', label: 'Sales & marketing' },
  ]

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3 sm:max-w-md">
        <button
          type="button"
          onClick={() => onPanel('hiring')}
          className="group flex flex-col items-start rounded-[16px] border border-[#0F3D2E]/10 bg-[#FAFCFB] p-3.5 text-left shadow-[0_4px_16px_rgba(15,61,46,0.05)] transition hover:-translate-y-0.5 hover:border-[#0F3D2E]/25"
        >
          <span className="mb-2 inline-flex h-9 w-9 items-center justify-center rounded-[12px] bg-[#1a4d38] text-[0.6875rem] font-bold text-white">
            CM
          </span>
          <span className="font-sans text-[0.8125rem] font-semibold text-[#0F3D2E]">Hiring pipeline</span>
          <span className="mt-0.5 font-sans text-[0.6875rem] text-[#55655D]">
            {careers.length} career apps
          </span>
        </button>
        <button
          type="button"
          onClick={() => onPanel('job-board')}
          className="group flex flex-col items-start rounded-[16px] border border-[#0F3D2E]/10 bg-[#FAFCFB] p-3.5 text-left shadow-[0_4px_16px_rgba(15,61,46,0.05)] transition hover:-translate-y-0.5 hover:border-[#0F3D2E]/25"
        >
          <span className="mb-2 inline-flex h-9 w-9 items-center justify-center rounded-[12px] bg-[#2F6B52] text-[0.6875rem] font-bold text-white">
            CM
          </span>
          <span className="font-sans text-[0.8125rem] font-semibold text-[#0F3D2E]">Job board</span>
          <span className="mt-0.5 font-sans text-[0.6875rem] text-[#55655D]">
            {listings.filter((l) => l.published).length} live roles
          </span>
        </button>
      </div>

      <div className="flex flex-wrap gap-2">
        {tabs.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => onPanel(t.id)}
            className={`rounded-full px-4 py-2 font-sans text-[0.8125rem] font-semibold transition ${
              panel === t.id
                ? 'bg-[#0F3D2E] text-white'
                : 'bg-white text-[#0F3D2E] hover:bg-[#0F3D2E]/[0.06]'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {panel === 'overview' && (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          <div className={`${cardClass} lg:col-span-2`}>
            <p className="m-0 font-sans text-[0.6875rem] font-semibold uppercase tracking-[0.14em] text-[#C9A961]">
              Business intelligence
            </p>
            <h2 className="m-0 mt-1 font-medium text-[#0F3D2E]" style={{ ...displayFont, fontSize: '1.35rem' }}>
              Hiring & growth pulse
            </h2>
            <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
              {[
                { label: 'Pipeline', value: careers.length },
                { label: 'New', value: hiringStats.new ?? 0 },
                { label: 'Interview+', value: (hiringStats.interview ?? 0) + (hiringStats.offer ?? 0) },
                { label: 'Hired', value: hiringStats.hired ?? 0 },
              ].map((s) => (
                <div key={s.label} className="rounded-[14px] bg-[#FAFCFB] px-3 py-3">
                  <p className="m-0 font-sans text-[0.6875rem] font-semibold uppercase tracking-[0.1em] text-[#55655D]">
                    {s.label}
                  </p>
                  <p className="m-0 mt-1 font-sans text-[1.6rem] font-semibold text-[#0F3D2E]">
                    {s.value}
                  </p>
                </div>
              ))}
            </div>
            <div className="mt-5">
              <p className="mb-2 font-sans text-[0.75rem] font-semibold uppercase tracking-[0.12em] text-[#55655D]">
                Pipeline stages
              </p>
              <div className="flex flex-wrap gap-2">
                {CAREER_STATUSES.map((s) => (
                  <span
                    key={s}
                    className="inline-flex items-center gap-2 rounded-full bg-[#F4F1EC] px-3 py-1.5 font-sans text-[0.75rem] text-[#0F3D2E]"
                  >
                    {s.replace(/_/g, ' ')}
                    <strong>{hiringStats[s] ?? 0}</strong>
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className={cardClass}>
            <h3 className="m-0 font-medium text-[#0F3D2E]" style={{ ...displayFont, fontSize: '1.1rem' }}>
              Sales this week
            </h3>
            <p className="m-0 mt-3 font-sans text-[2.4rem] font-semibold leading-none text-[#0F3D2E]">
              {sales.last7}
            </p>
            <p className="m-0 mt-2 font-sans text-[0.8125rem] text-[#55655D]">
              New applications · {sales.conversion}% enroll conversion overall
            </p>
            <button
              type="button"
              onClick={() => onPanel('sales')}
              className="mt-5 w-full rounded-[12px] bg-[#0F3D2E] px-4 py-2.5 font-sans text-[0.8125rem] font-semibold text-white"
            >
              Open sales desk
            </button>
          </div>
        </div>
      )}

      {panel === 'hiring' && <CareersTable rows={careers} onUpdateStatus={onUpdateCareer} />}
      {panel === 'job-board' && (
        <JobBoardEditor rows={listings} onChange={onListingsChange} onFlash={onFlash} />
      )}
      {panel === 'sales' && <SalesMarketingPanel sales={sales} />}
    </div>
  )
}

function SalesMarketingPanel({
  sales,
}: {
  sales: {
    bySource: Record<string, number>
    byStatus: Record<string, number>
    byState: Record<string, number>
    last7: number
    conversion: number
    enrolled: number
  }
}) {
  const topStates = Object.entries(sales.byState)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8)
  const total = Object.values(sales.bySource).reduce((a, b) => a + b, 0)

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
      <div className={`${cardClass} lg:col-span-2`}>
        <p className="m-0 font-sans text-[0.6875rem] font-semibold uppercase tracking-[0.14em] text-[#C9A961]">
          Marketing attribution
        </p>
        <h2 className="m-0 mt-1 font-medium text-[#0F3D2E]" style={{ ...displayFont, fontSize: '1.35rem' }}>
          Application sources
        </h2>
        <p className="m-0 mt-2 font-sans text-[0.875rem] text-[#55655D]">
          Live mix from ACA enroll, Medicare.Reviews, and untagged intake — the same funnel
          agents work on the Office floor.
        </p>
        <div className="mt-5 space-y-3">
          {Object.entries(sales.bySource)
            .sort((a, b) => b[1] - a[1])
            .map(([src, n]) => {
              const pct = total ? Math.round((n / total) * 100) : 0
              return (
                <div key={src}>
                  <div className="mb-1 flex justify-between font-sans text-[0.8125rem]">
                    <span className="font-semibold text-[#0F3D2E]">{src}</span>
                    <span className="text-[#55655D]">
                      {n} apps · {pct}%
                    </span>
                  </div>
                  <div className="h-2.5 overflow-hidden rounded-full bg-[#0F3D2E]/10">
                    <div
                      className="h-full rounded-full bg-[linear-gradient(90deg,#0F3D2E,#C9A961)]"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              )
            })}
          {total === 0 ? (
            <p className="m-0 font-sans text-[0.875rem] text-[#55655D]">No source data yet.</p>
          ) : null}
        </div>
      </div>

      <div className="space-y-4">
        <div className={cardClass}>
          <p className="m-0 font-sans text-[0.6875rem] font-semibold uppercase tracking-[0.12em] text-[#55655D]">
            Conversion
          </p>
          <p className="m-0 mt-2 font-sans text-[2.2rem] font-semibold text-[#0F3D2E]">
            {sales.conversion}%
          </p>
          <p className="m-0 mt-1 font-sans text-[0.8125rem] text-[#55655D]">
            {sales.enrolled} enrolled / approved of total intake
          </p>
        </div>
        <div className={cardClass}>
          <p className="m-0 font-sans text-[0.6875rem] font-semibold uppercase tracking-[0.12em] text-[#55655D]">
            Top states
          </p>
          <ul className="m-0 mt-3 list-none space-y-2 p-0">
            {topStates.length === 0 ? (
              <li className="font-sans text-[0.8125rem] text-[#55655D]">No state data yet.</li>
            ) : (
              topStates.map(([st, n]) => (
                <li
                  key={st}
                  className="flex items-center justify-between font-sans text-[0.8125rem] text-[#0F3D2E]"
                >
                  <span className="font-semibold">{st}</span>
                  <span className="text-[#55655D]">{n}</span>
                </li>
              ))
            )}
          </ul>
        </div>
        <div className={cardClass}>
          <p className="m-0 font-sans text-[0.6875rem] font-semibold uppercase tracking-[0.12em] text-[#55655D]">
            Pipeline status
          </p>
          <div className="mt-3 space-y-2">
            {Object.entries(sales.byStatus).map(([st, n]) => (
              <div key={st} className="flex items-center justify-between gap-2">
                {statusBadge(st)}
                <span className="font-sans text-[0.8125rem] font-semibold text-[#0F3D2E]">{n}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

/* ---------------------------------------------------------------------------
 * Shared tables / editors (preserved)
 * ------------------------------------------------------------------------- */

function CareersTable({
  rows,
  onUpdateStatus,
}: {
  rows: Career[]
  onUpdateStatus: (id: string, status: string) => void | Promise<void>
}) {
  if (rows.length === 0) {
    return (
      <div className={`${cardClass}`}>
        <p className="m-0 font-sans text-[0.9375rem] text-[#55655D]">
          No career applications yet. Submissions from the careers page land here.
        </p>
      </div>
    )
  }
  return (
    <div className="space-y-3">
      {rows.map((c) => (
        <div key={c.id} className={cardClass}>
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <p className="m-0 font-sans text-[0.9375rem] font-semibold text-[#0F3D2E]">
                  {c.first_name} {c.last_name}
                </p>
                {statusBadge(c.status)}
                <span className="inline-flex rounded-full bg-[#0F3D2E]/[0.06] px-2.5 py-1 font-sans text-[0.6875rem] font-semibold text-[#0F3D2E]">
                  {c.position}
                </span>
              </div>
              <p className="m-0 mt-1 font-sans text-[0.8125rem] text-[#55655D]">
                {c.email}
                {c.phone ? ` · ${c.phone}` : ''}
                {c.location ? ` · ${c.location}` : ''}
                {c.work_authorization ? ` · ${c.work_authorization}` : ''}
              </p>
              <p className="m-0 mt-0.5 font-sans text-[0.75rem] text-[#55655D]/80">
                Applied {fmtDate(c.created_at)}
              </p>
              <div className="mt-1 flex flex-wrap gap-3">
                {c.linkedin_url ? (
                  <a
                    href={c.linkedin_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-sans text-[0.8125rem] font-semibold text-[#0F3D2E] underline"
                  >
                    LinkedIn
                  </a>
                ) : null}
                {c.portfolio_url ? (
                  <a
                    href={c.portfolio_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-sans text-[0.8125rem] font-semibold text-[#0F3D2E] underline"
                  >
                    Portfolio / Resume
                  </a>
                ) : null}
              </div>
              {c.cover_letter ? (
                <p className="m-0 mt-2 whitespace-pre-wrap rounded-[8px] bg-[#F4F1EC] px-3 py-2 font-sans text-[0.8125rem] text-[#55655D]">
                  {c.cover_letter}
                </p>
              ) : null}
            </div>
            <select
              value={c.status}
              onChange={(e) => void onUpdateStatus(c.id, e.target.value)}
              className={selectClass}
            >
              {CAREER_STATUSES.map((s) => (
                <option key={s} value={s}>
                  {s.replace(/_/g, ' ')}
                </option>
              ))}
            </select>
          </div>
        </div>
      ))}
    </div>
  )
}

function LedgerTable({ rows, note }: { rows: LedgerLog[]; note: string | null }) {
  return (
    <div>
      {note ? (
        <p className="mb-4 rounded-[12px] bg-[#C9A961]/12 px-4 py-3 font-sans text-[0.875rem] text-[#8a6d16]">
          {note}
        </p>
      ) : null}
      {rows.length === 0 ? (
        <div className={cardClass}>
          <p className="m-0 font-sans text-[0.9375rem] text-[#55655D]">
            No Hyperledger events to display.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {rows.map((l) => (
            <div key={l.id} className={cardClass}>
              <div className="flex flex-wrap items-center gap-2">
                <p className="m-0 font-sans text-[0.9375rem] font-semibold text-[#0F3D2E]">
                  {l.type || l.action || 'Ledger event'}
                </p>
                {l.status ? statusBadge(l.status) : null}
                {typeof l.amount === 'number' ? (
                  <span className="inline-flex rounded-full bg-[#0F3D2E]/[0.08] px-2.5 py-1 font-sans text-[0.6875rem] font-semibold text-[#0F3D2E]">
                    {l.amount} {l.currency || 'CM_CREDIT'}
                  </span>
                ) : null}
              </div>
              <p className="m-0 mt-1 font-sans text-[0.8125rem] text-[#55655D]">
                {l.memberId ? `Member ${l.memberId}` : ''}
                {l.txId ? ` · tx ${l.txId}` : ''}
                {typeof l.blockNumber === 'number' ? ` · block ${l.blockNumber}` : ''}
              </p>
              <p className="m-0 mt-0.5 font-sans text-[0.75rem] text-[#55655D]/80">
                {fmtDate(l.createdAt)}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function JobBoardEditor({
  rows,
  onChange,
  onFlash,
}: {
  rows: CareerListingRow[]
  onChange: (rows: CareerListingRow[]) => void
  onFlash: (msg: string | null) => void
}) {
  const [draft, setDraft] = useState({ ...EMPTY_LISTING })
  const [editingId, setEditingId] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)

  const startEdit = (row: CareerListingRow) => {
    setEditingId(row.id)
    setDraft({
      title: row.title,
      department: row.department,
      employment_type: row.employment_type,
      location: row.location,
      description: row.description,
      sort_order: row.sort_order,
      published: row.published,
    })
  }

  const resetDraft = () => {
    setEditingId(null)
    setDraft({ ...EMPTY_LISTING })
  }

  const save = async () => {
    setBusy(true)
    onFlash(null)
    try {
      const res = await fetch('/api/admin/career-listings', {
        method: editingId ? 'PATCH' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingId ? { id: editingId, ...draft } : draft),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok || !data?.ok) {
        onFlash(data?.error || 'Could not save listing.')
        return
      }
      const listing = data.listing as CareerListingRow
      onChange(
        editingId
          ? rows.map((r) => (r.id === editingId ? listing : r))
          : [...rows, listing].sort((a, b) => a.sort_order - b.sort_order),
      )
      onFlash(editingId ? 'Listing updated.' : 'Listing created.')
      resetDraft()
    } finally {
      setBusy(false)
    }
  }

  const remove = async (id: string) => {
    if (!window.confirm('Delete this job listing from the careers page?')) return
    setBusy(true)
    onFlash(null)
    try {
      const res = await fetch(`/api/admin/career-listings?id=${encodeURIComponent(id)}`, {
        method: 'DELETE',
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok || !data?.ok) {
        onFlash(data?.error || 'Could not delete listing.')
        return
      }
      onChange(rows.filter((r) => r.id !== id))
      if (editingId === id) resetDraft()
      onFlash('Listing deleted.')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="space-y-5">
      <div className={cardClass}>
        <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
          <div>
            <p className="m-0 font-sans text-[0.75rem] font-semibold uppercase tracking-[0.14em] text-[#C9A961]">
              Careers page editor
            </p>
            <h2
              className="m-0 mt-1 font-medium text-[#0F3D2E]"
              style={{ ...displayFont, fontSize: '1.25rem' }}
            >
              {editingId ? 'Edit listing' : 'Add listing'}
            </h2>
          </div>
          {editingId ? (
            <button
              type="button"
              onClick={resetDraft}
              className="rounded-[10px] border border-[#0F3D2E]/20 px-3 py-2 font-sans text-[0.8125rem] font-semibold text-[#55655D]"
            >
              Cancel edit
            </button>
          ) : null}
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label className="mb-1 block font-sans text-[0.75rem] font-semibold text-[#0F3D2E]">
              Title
            </label>
            <input
              className={fieldClass}
              value={draft.title}
              onChange={(e) => setDraft((d) => ({ ...d, title: e.target.value }))}
              placeholder="e.g. Licensed Insurance Agent"
            />
          </div>
          <div>
            <label className="mb-1 block font-sans text-[0.75rem] font-semibold text-[#0F3D2E]">
              Department
            </label>
            <select
              className={fieldClass}
              value={draft.department}
              onChange={(e) => setDraft((d) => ({ ...d, department: e.target.value }))}
            >
              {DEPARTMENTS.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-1 block font-sans text-[0.75rem] font-semibold text-[#0F3D2E]">
              Employment type
            </label>
            <input
              className={fieldClass}
              value={draft.employment_type}
              onChange={(e) => setDraft((d) => ({ ...d, employment_type: e.target.value }))}
            />
          </div>
          <div>
            <label className="mb-1 block font-sans text-[0.75rem] font-semibold text-[#0F3D2E]">
              Location
            </label>
            <input
              className={fieldClass}
              value={draft.location}
              onChange={(e) => setDraft((d) => ({ ...d, location: e.target.value }))}
            />
          </div>
          <div>
            <label className="mb-1 block font-sans text-[0.75rem] font-semibold text-[#0F3D2E]">
              Sort order
            </label>
            <input
              type="number"
              className={fieldClass}
              value={draft.sort_order}
              onChange={(e) =>
                setDraft((d) => ({ ...d, sort_order: Number(e.target.value) || 0 }))
              }
            />
          </div>
          <div className="sm:col-span-2">
            <label className="mb-1 block font-sans text-[0.75rem] font-semibold text-[#0F3D2E]">
              Description
            </label>
            <textarea
              className={`${fieldClass} min-h-[100px] resize-y`}
              value={draft.description}
              onChange={(e) => setDraft((d) => ({ ...d, description: e.target.value }))}
            />
          </div>
          <label className="flex items-center gap-2 font-sans text-[0.875rem] text-[#0F3D2E]">
            <input
              type="checkbox"
              checked={draft.published}
              onChange={(e) => setDraft((d) => ({ ...d, published: e.target.checked }))}
              className="h-4 w-4 accent-[#0F3D2E]"
            />
            Published on careers page
          </label>
        </div>

        <button
          type="button"
          disabled={busy || !draft.title.trim() || !draft.description.trim()}
          onClick={() => void save()}
          className="mt-4 inline-flex rounded-[10px] bg-[#0F3D2E] px-4 py-2.5 font-sans text-[0.875rem] font-semibold text-white transition hover:bg-[#0A2E22] disabled:opacity-50"
        >
          {busy ? 'Saving…' : editingId ? 'Save changes' : 'Add to careers page'}
        </button>
      </div>

      <div className="space-y-3">
        {rows.length === 0 ? (
          <p className="font-sans text-[0.9375rem] text-[#55655D]">
            No job listings yet. Add one above — it will appear on the public careers page.
          </p>
        ) : (
          rows.map((row) => (
            <div key={row.id} className={cardClass}>
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="m-0 font-sans text-[0.9375rem] font-semibold text-[#0F3D2E]">
                      {row.title}
                    </p>
                    <span
                      className={`inline-flex rounded-full px-2.5 py-1 font-sans text-[0.6875rem] font-semibold uppercase ${
                        row.published
                          ? 'bg-[#0F3D2E]/12 text-[#0F3D2E]'
                          : 'bg-[#0F3D2E]/10 text-[#55655D]'
                      }`}
                    >
                      {row.published ? 'Published' : 'Hidden'}
                    </span>
                  </div>
                  <p className="m-0 mt-1 font-sans text-[0.8125rem] text-[#55655D]">
                    {row.department} · {row.employment_type} · {row.location} · sort{' '}
                    {row.sort_order}
                  </p>
                  <p className="m-0 mt-2 font-sans text-[0.875rem] leading-[1.55] text-[#55655D]">
                    {row.description}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => startEdit(row)}
                    className="rounded-[10px] border border-[#0F3D2E] px-3 py-2 font-sans text-[0.8125rem] font-semibold text-[#0F3D2E]"
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    disabled={busy}
                    onClick={() => void remove(row.id)}
                    className="rounded-[10px] border border-[#B42318]/30 px-3 py-2 font-sans text-[0.8125rem] font-semibold text-[#B42318]"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
