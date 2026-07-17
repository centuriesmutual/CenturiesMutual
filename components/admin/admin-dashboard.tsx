'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'

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

const ENROLLED_STATUSES = new Set(['approved', 'active'])

type TabId = 'applications' | 'enrollments' | 'careers' | 'ledger'

const TABS: { id: TabId; label: string }[] = [
  { id: 'applications', label: 'Applications' },
  { id: 'enrollments', label: 'Enrollments' },
  { id: 'careers', label: 'Careers' },
  { id: 'ledger', label: 'Hyperledger Logs' },
]

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
  const [ledger, setLedger] = useState<LedgerLog[]>([])
  const [ledgerNote, setLedgerNote] = useState<string | null>(null)

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [flash, setFlash] = useState<string | null>(null)

  const loadAll = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const [appsRes, careersRes, ledgerRes] = await Promise.all([
        fetch('/api/admin/applications', { cache: 'no-store' }),
        fetch('/api/admin/careers', { cache: 'no-store' }),
        fetch('/api/admin/ledger-logs', { cache: 'no-store' }),
      ])

      if (appsRes.status === 403 || careersRes.status === 403) {
        setError('Your account is not authorized for admin access.')
        setLoading(false)
        return
      }

      const appsData = await appsRes.json().catch(() => ({}))
      const careersData = await careersRes.json().catch(() => ({}))
      const ledgerData = await ledgerRes.json().catch(() => ({}))

      setApplications(appsData?.applications ?? [])
      setCareers(careersData?.careers ?? [])
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
        <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[
            { label: 'Applications', value: applications.length },
            { label: 'Enrollments', value: enrollments.length },
            { label: 'Careers', value: careers.length },
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
            {(tab === 'applications' || tab === 'enrollments') && (
              <ApplicationsTable
                rows={tab === 'applications' ? applications : enrollments}
                onUpdateStatus={updateStatus}
                emptyLabel={
                  tab === 'applications'
                    ? 'No application submissions yet.'
                    : 'No active enrollments yet.'
                }
              />
            )}
            {tab === 'careers' && <CareersTable rows={careers} />}
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

function CareersTable({ rows }: { rows: Career[] }) {
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
            <p className="m-0 mt-2 rounded-[8px] bg-[#F4F1EC] px-3 py-2 font-sans text-[0.8125rem] text-[#55655D]">
              {c.cover_letter}
            </p>
          ) : null}
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
