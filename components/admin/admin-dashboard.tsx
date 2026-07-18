'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import {
  AcaEnrollmentFlagsPanel,
  AcaStateLicensingPanel,
} from '@/components/admin/aca-flags-panels'

type Application = {
  id: string
  application_status: string
  first_name: string
  last_name: string
  email: string
  phone: string | null
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

type TabId =
  | 'applications'
  | 'aca'
  | 'enrollments'
  | 'careers'
  | 'job-board'
  | 'aca-flags'
  | 'state-licensing'
  | 'ledger'

const TABS: { id: TabId; label: string }[] = [
  { id: 'applications', label: 'Applications' },
  { id: 'aca', label: 'ACA' },
  { id: 'enrollments', label: 'Enrollments' },
  { id: 'careers', label: 'Career Apps' },
  { id: 'job-board', label: 'Careers Page' },
  { id: 'aca-flags', label: 'ACA Flags' },
  { id: 'state-licensing', label: 'State Licensing' },
  { id: 'ledger', label: 'Hyperledger Logs' },
]

const DEPARTMENTS = [
  'Insurance & Enrollment',
  'Member Services',
  'Engineering',
  'Design',
  'Data',
  'Compliance',
  'Operations',
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

/** Marketplace/ACA submissions — from the public enrollment flow or tagged ACA. */
function isAcaApplication(a: { plan_type: string | null; source: string | null }) {
  return (
    (a.plan_type ? /aca/i.test(a.plan_type) : false) ||
    a.source === 'enrollment'
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

function statusBadge(status: string) {
  const map: Record<string, string> = {
    submitted: 'bg-[#C9A53E]/15 text-[#8a6d16]',
    under_review: 'bg-[#2563eb]/12 text-[#1d4ed8]',
    additional_information: 'bg-[#f59e0b]/15 text-[#b45309]',
    approved: 'bg-[#0F3D2E]/12 text-[#0F3D2E]',
    active: 'bg-[#0F3D2E]/12 text-[#0F3D2E]',
    declined: 'bg-[#B42318]/12 text-[#B42318]',
    new: 'bg-[#C9A53E]/15 text-[#8a6d16]',
    reviewing: 'bg-[#2563eb]/12 text-[#1d4ed8]',
    interview: 'bg-[#0F3D2E]/12 text-[#0F3D2E]',
    offer: 'bg-[#0F3D2E]/12 text-[#0F3D2E]',
    hired: 'bg-[#0F3D2E]/12 text-[#0F3D2E]',
    archived: 'bg-[#14432A]/10 text-[#55655D]',
  }
  const cls = map[status] ?? 'bg-[#14432A]/10 text-[#14432A]'
  return (
    <span className={`inline-flex rounded-full px-2.5 py-1 font-sans text-[0.6875rem] font-semibold uppercase tracking-[0.04em] ${cls}`}>
      {status.replace(/_/g, ' ')}
    </span>
  )
}

const cardClass = 'rounded-2xl border border-[#14432A]/10 bg-white p-5 shadow-sm'
const selectClass =
  'rounded-[10px] border border-[#14432A]/15 bg-[#FAFCFB] px-3 py-2 font-sans text-[0.8125rem] font-semibold text-[#14432A] outline-none focus:border-[#0F3D2E]'

export function AdminDashboard({
  email,
  onSignOut,
}: {
  email: string | null
  onSignOut: () => void | Promise<void>
}) {
  const [tab, setTab] = useState<TabId>('applications')

  const [applications, setApplications] = useState<Application[]>([])
  const [careers, setCareers] = useState<Career[]>([])
  const [listings, setListings] = useState<CareerListingRow[]>([])
  const [acaFlags, setAcaFlags] = useState<
    {
      id: string
      key: string
      name: string
      description: string
      enabled: boolean
      start_date: string | null
      end_date: string | null
      updated_at: string
      active: boolean
    }[]
  >([])
  const [acaStates, setAcaStates] = useState<
    {
      id: string
      state_code: string
      state_name: string
      enabled: boolean
      licensed: boolean
      display_order: number
      updated_at: string
      status: string
    }[]
  >([])
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
        setLoading(false)
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

  const enrollments = useMemo(
    () => applications.filter((a) => ENROLLED_STATUSES.has(a.application_status)),
    [applications],
  )

  const acaApplications = useMemo(
    () => applications.filter(isAcaApplication),
    [applications],
  )

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
    setFlash('Status updated.')
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
    setFlash('Career application status updated.')
  }

  return (
    <main className="min-h-dvh bg-[#F4F1EC]">
      <header className="border-b border-[#14432A]/10 bg-[#0F3D2E] text-white">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-4 sm:px-6">
          <div>
            <p className="m-0 font-sans text-[11px] font-semibold uppercase tracking-[0.22em] text-[#C9A53E]">
              Centuries Mutual
            </p>
            <h1
              className="m-0 font-medium text-white"
              style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: '1.4rem' }}
            >
              Admin Portal
            </h1>
          </div>
          <div className="flex items-center gap-3">
            {email ? (
              <span className="font-sans text-[0.8125rem] text-white/70">{email}</span>
            ) : null}
            <button
              type="button"
              onClick={() => void loadAll()}
              className="rounded-[10px] border border-white/25 bg-transparent px-3 py-2 font-sans text-[0.8125rem] font-semibold text-white transition hover:bg-white/10"
            >
              Refresh
            </button>
            <button
              type="button"
              onClick={() => void onSignOut()}
              className="rounded-[10px] bg-white px-3 py-2 font-sans text-[0.8125rem] font-semibold text-[#0F3D2E] transition hover:bg-white/90"
            >
              Sign out
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        {/* Summary stats */}
        <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {[
            { label: 'Applications', value: applications.length },
            { label: 'ACA', value: acaApplications.length },
            { label: 'Enrollments', value: enrollments.length },
            { label: 'Career Apps', value: careers.length },
            { label: 'Job listings', value: listings.length },
            { label: 'Ledger events', value: ledger.length },
          ].map((s) => (
            <div key={s.label} className={cardClass}>
              <p className="m-0 font-sans text-[0.75rem] font-semibold uppercase tracking-[0.14em] text-[#55655D]">
                {s.label}
              </p>
              <p className="m-0 mt-1 font-sans text-[1.75rem] font-semibold text-[#0F3D2E]">
                {s.value}
              </p>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="mb-5 flex flex-wrap gap-2">
          {TABS.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setTab(t.id)}
              className={`rounded-full px-4 py-2 font-sans text-[0.8125rem] font-semibold transition ${
                tab === t.id
                  ? 'bg-[#0F3D2E] text-white'
                  : 'bg-white text-[#14432A] hover:bg-[#0F3D2E]/[0.06]'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {flash ? (
          <p className="mb-4 rounded-[10px] bg-[#0F3D2E]/[0.06] px-4 py-3 font-sans text-[0.875rem] text-[#0F3D2E]">
            {flash}
          </p>
        ) : null}
        {error ? (
          <p className="mb-4 rounded-[10px] bg-[#B42318]/[0.08] px-4 py-3 font-sans text-[0.875rem] text-[#B42318]">
            {error}
          </p>
        ) : null}

        {loading ? (
          <p className="font-sans text-[0.9375rem] text-[#55655D]">Loading…</p>
        ) : (
          <>
            {(tab === 'applications' || tab === 'enrollments' || tab === 'aca') && (
              <ApplicationsTable
                rows={
                  tab === 'applications'
                    ? applications
                    : tab === 'aca'
                      ? acaApplications
                      : enrollments
                }
                onUpdateStatus={updateStatus}
                emptyLabel={
                  tab === 'applications'
                    ? 'No application submissions yet.'
                    : tab === 'aca'
                      ? 'No ACA / marketplace enrollments submitted yet.'
                      : 'No active enrollments yet.'
                }
              />
            )}
            {tab === 'careers' && (
              <CareersTable rows={careers} onUpdateStatus={updateCareerStatus} />
            )}
            {tab === 'job-board' && (
              <JobBoardEditor
                rows={listings}
                onChange={setListings}
                onFlash={setFlash}
              />
            )}
            {tab === 'aca-flags' && (
              <AcaEnrollmentFlagsPanel
                flags={acaFlags}
                onChange={setAcaFlags}
                onFlash={setFlash}
              />
            )}
            {tab === 'state-licensing' && (
              <AcaStateLicensingPanel
                states={acaStates}
                onChange={setAcaStates}
                onFlash={setFlash}
              />
            )}
            {tab === 'ledger' && <LedgerTable rows={ledger} note={ledgerNote} />}
          </>
        )}
      </div>
    </main>
  )
}

function ApplicationsTable({
  rows,
  onUpdateStatus,
  emptyLabel,
}: {
  rows: Application[]
  onUpdateStatus: (id: string, status: string) => void | Promise<void>
  emptyLabel: string
}) {
  if (rows.length === 0) {
    return <p className="font-sans text-[0.9375rem] text-[#55655D]">{emptyLabel}</p>
  }
  return (
    <div className="space-y-3">
      {rows.map((a) => (
        <div key={a.id} className={cardClass}>
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <p className="m-0 font-sans text-[0.9375rem] font-semibold text-[#14432A]">
                  {a.first_name} {a.last_name}
                </p>
                {statusBadge(a.application_status)}
                {a.plan_type ? (
                  <span className="inline-flex rounded-full bg-[#14432A]/[0.06] px-2.5 py-1 font-sans text-[0.6875rem] font-semibold text-[#14432A]">
                    {a.plan_type}
                  </span>
                ) : null}
                {a.source ? (
                  <span className="inline-flex rounded-full bg-[#C9A53E]/12 px-2.5 py-1 font-sans text-[0.6875rem] font-semibold text-[#8a6d16]">
                    {a.source}
                  </span>
                ) : null}
              </div>
              <p className="m-0 mt-1 font-sans text-[0.8125rem] text-[#55655D]">
                {a.email}
                {a.phone ? ` · ${a.phone}` : ''}
                {a.city || a.state ? ` · ${[a.city, a.state].filter(Boolean).join(', ')}` : ''}
              </p>
              <p className="m-0 mt-0.5 font-sans text-[0.75rem] text-[#55655D]/80">
                Submitted {fmtDate(a.created_at)}
                {a.date_of_birth ? ` · DOB ${a.date_of_birth}` : ''}
              </p>
              {a.notes ? (
                <p className="m-0 mt-2 rounded-[8px] bg-[#F4F1EC] px-3 py-2 font-sans text-[0.8125rem] text-[#55655D]">
                  {a.notes}
                </p>
              ) : null}
            </div>
            <select
              value={a.application_status}
              onChange={(e) => void onUpdateStatus(a.id, e.target.value)}
              className={selectClass}
            >
              {APPLICATION_STATUSES.map((s) => (
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

function CareersTable({
  rows,
  onUpdateStatus,
}: {
  rows: Career[]
  onUpdateStatus: (id: string, status: string) => void | Promise<void>
}) {
  if (rows.length === 0) {
    return (
      <p className="font-sans text-[0.9375rem] text-[#55655D]">
        No career applications yet.
      </p>
    )
  }
  return (
    <div className="space-y-3">
      {rows.map((c) => (
        <div key={c.id} className={cardClass}>
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <p className="m-0 font-sans text-[0.9375rem] font-semibold text-[#14432A]">
                  {c.first_name} {c.last_name}
                </p>
                {statusBadge(c.status)}
                <span className="inline-flex rounded-full bg-[#14432A]/[0.06] px-2.5 py-1 font-sans text-[0.6875rem] font-semibold text-[#14432A]">
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
        <p className="mb-4 rounded-[10px] bg-[#C9A53E]/12 px-4 py-3 font-sans text-[0.875rem] text-[#8a6d16]">
          {note}
        </p>
      ) : null}
      {rows.length === 0 ? (
        <p className="font-sans text-[0.9375rem] text-[#55655D]">
          No Hyperledger events to display.
        </p>
      ) : (
        <div className="space-y-3">
          {rows.map((l) => (
            <div key={l.id} className={cardClass}>
              <div className="flex flex-wrap items-center gap-2">
                <p className="m-0 font-sans text-[0.9375rem] font-semibold text-[#14432A]">
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

const fieldClass =
  'w-full rounded-[10px] border border-[#14432A]/15 bg-[#FAFCFB] px-3 py-2 font-sans text-[0.875rem] text-[#14432A] outline-none focus:border-[#0F3D2E]'

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
            <p className="m-0 font-sans text-[0.75rem] font-semibold uppercase tracking-[0.14em] text-[#C9A53E]">
              Careers page editor
            </p>
            <h2
              className="m-0 mt-1 font-medium text-[#14432A]"
              style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: '1.25rem' }}
            >
              {editingId ? 'Edit listing' : 'Add listing'}
            </h2>
          </div>
          {editingId ? (
            <button
              type="button"
              onClick={resetDraft}
              className="rounded-[10px] border border-[#14432A]/20 px-3 py-2 font-sans text-[0.8125rem] font-semibold text-[#55655D]"
            >
              Cancel edit
            </button>
          ) : null}
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label className="mb-1 block font-sans text-[0.75rem] font-semibold text-[#14432A]">
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
            <label className="mb-1 block font-sans text-[0.75rem] font-semibold text-[#14432A]">
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
            <label className="mb-1 block font-sans text-[0.75rem] font-semibold text-[#14432A]">
              Employment type
            </label>
            <input
              className={fieldClass}
              value={draft.employment_type}
              onChange={(e) => setDraft((d) => ({ ...d, employment_type: e.target.value }))}
            />
          </div>
          <div>
            <label className="mb-1 block font-sans text-[0.75rem] font-semibold text-[#14432A]">
              Location
            </label>
            <input
              className={fieldClass}
              value={draft.location}
              onChange={(e) => setDraft((d) => ({ ...d, location: e.target.value }))}
            />
          </div>
          <div>
            <label className="mb-1 block font-sans text-[0.75rem] font-semibold text-[#14432A]">
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
            <label className="mb-1 block font-sans text-[0.75rem] font-semibold text-[#14432A]">
              Description
            </label>
            <textarea
              className={`${fieldClass} min-h-[100px] resize-y`}
              value={draft.description}
              onChange={(e) => setDraft((d) => ({ ...d, description: e.target.value }))}
            />
          </div>
          <label className="flex items-center gap-2 font-sans text-[0.875rem] text-[#14432A]">
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
                    <p className="m-0 font-sans text-[0.9375rem] font-semibold text-[#14432A]">
                      {row.title}
                    </p>
                    <span
                      className={`inline-flex rounded-full px-2.5 py-1 font-sans text-[0.6875rem] font-semibold uppercase ${
                        row.published
                          ? 'bg-[#0F3D2E]/12 text-[#0F3D2E]'
                          : 'bg-[#14432A]/10 text-[#55655D]'
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

