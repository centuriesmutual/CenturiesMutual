'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Settings, RefreshCw, LogOut, SlidersHorizontal, Phone, PhoneOff, Mic, MicOff } from 'lucide-react'
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

type WorkspaceId = 'overview' | 'clients' | 'leads' | 'files' | 'employees' | 'intelligence' | 'operations' | 'ledger'
type FileFolderId = 'all' | 'aca' | 'medicare' | 'enrolled' | 'other'
type WorkforceView = 'directory' | 'hiring' | 'job-board'

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
  { id: 'overview', label: 'Home' },
  { id: 'clients', label: 'Clients' },
  { id: 'leads', label: 'Leads' },
  { id: 'files', label: 'Applications' },
  { id: 'employees', label: 'Workforce' },
  { id: 'intelligence', label: 'Intelligence' },
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

type MicroLedgerEntry = {
  at: string
  actor: string
  action: string
  detail?: string
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
      applicant?: {
        ssn?: string
        ssn_last4?: string
        sex?: string
        tobacco?: string
      }
      dependents?: unknown[]
      directory_notes?: string
      agent_notes?: string
      directory_notes_history?: { at: string; text: string }[]
      micro_ledger?: MicroLedgerEntry[]
      producer_id?: string
      agent_id?: string
      lead_id?: string
      marketing_id?: string
      coverage_start?: string
      plan_type?: string
      ssn_masked?: string
    }
    if (!parsed || typeof parsed !== 'object') return null
    return parsed
  } catch {
    return null
  }
}

function formatSsnDigits(digits: string) {
  const d = digits.replace(/\D/g, '').slice(0, 9)
  if (d.length !== 9) return d
  return `${d.slice(0, 3)}-${d.slice(3, 5)}-${d.slice(5)}`
}

function getFullSsn(notes: string | null | undefined) {
  const parsed = parseEnrollmentNotes(notes)
  const raw = parsed?.applicant?.ssn || ''
  const digits = raw.replace(/\D/g, '')
  if (digits.length === 9) return formatSsnDigits(digits)
  if (parsed?.applicant?.ssn_last4) {
    return `***-**-${parsed.applicant.ssn_last4}`
  }
  if (parsed?.ssn_masked) return parsed.ssn_masked
  return ''
}

function getDirectoryNotes(notes: string | null | undefined) {
  const parsed = parseEnrollmentNotes(notes)
  if (parsed?.directory_notes) return parsed.directory_notes
  if (parsed?.agent_notes) return parsed.agent_notes
  if (notes && !notes.trim().startsWith('{')) return notes
  return ''
}

function getAgentOfRecord(notes: string | null | undefined) {
  const parsed = parseEnrollmentNotes(notes)
  return (
    parsed?.agent_id ||
    parsed?.producer_id ||
    parsed?.lead_id ||
    parsed?.marketing_id ||
    ''
  )
}

function getNotesHistory(notes: string | null | undefined): { at: string; text: string }[] {
  const parsed = parseEnrollmentNotes(notes)
  if (Array.isArray(parsed?.directory_notes_history)) {
    return parsed.directory_notes_history.filter(
      (h): h is { at: string; text: string } =>
        Boolean(h && typeof h.at === 'string' && typeof h.text === 'string'),
    )
  }
  return []
}

function getMicroLedger(notes: string | null | undefined): MicroLedgerEntry[] {
  const parsed = parseEnrollmentNotes(notes)
  if (!Array.isArray(parsed?.micro_ledger)) return []
  return parsed.micro_ledger.filter(
    (e): e is MicroLedgerEntry =>
      Boolean(e && typeof e.at === 'string' && typeof e.action === 'string'),
  )
}

function formatMicroLedgerLine(e: MicroLedgerEntry, opts?: { shortDate?: boolean }) {
  const when = opts?.shortDate ? fmtShort(e.at) : fmtDate(e.at)
  const action = e.action.replace(/_/g, ' ').toLowerCase()
  return [when, action, e.actor || null, e.detail || null].filter(Boolean).join(' · ')
}

const MICRO_LEDGER_PAGE_SIZE = 8

function MicroLedgerModal({
  entries,
  title,
  onClose,
}: {
  entries: MicroLedgerEntry[]
  title?: string
  onClose: () => void
}) {
  const [page, setPage] = useState(0)
  const totalPages = Math.max(1, Math.ceil(entries.length / MICRO_LEDGER_PAGE_SIZE))

  useEffect(() => {
    setPage(0)
  }, [entries])

  useEffect(() => {
    if (page > totalPages - 1) setPage(Math.max(0, totalPages - 1))
  }, [page, totalPages])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowLeft') setPage((p) => Math.max(0, p - 1))
      if (e.key === 'ArrowRight') setPage((p) => Math.min(totalPages - 1, p + 1))
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose, totalPages])

  const pageEntries = entries.slice(
    page * MICRO_LEDGER_PAGE_SIZE,
    page * MICRO_LEDGER_PAGE_SIZE + MICRO_LEDGER_PAGE_SIZE,
  )

  return (
    <div
      className="fixed inset-0 z-[65] flex items-center justify-center bg-[#0F3D2E]/45 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="micro-ledger-title"
      onClick={onClose}
    >
      <div
        className="flex max-h-[min(88vh,560px)] w-full max-w-lg flex-col overflow-hidden rounded-[16px] bg-[#F7F3EE] shadow-[0_24px_60px_rgba(15,61,46,0.28)]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex shrink-0 items-start justify-between gap-3 border-b border-[#0F3D2E]/10 px-4 py-3">
          <div>
            <p className="m-0 font-sans text-[0.625rem] font-semibold uppercase tracking-[0.14em] text-[#C9A961]">
              Activity
            </p>
            <h2
              id="micro-ledger-title"
              className="m-0 mt-0.5 font-medium text-[#0F3D2E]"
              style={{ ...displayFont, fontSize: '1.15rem' }}
            >
              Micro ledger
            </h2>
            {title ? (
              <p className="m-0 mt-0.5 font-sans text-[0.75rem] text-[#55655D]">{title}</p>
            ) : null}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-[10px] border-0 bg-transparent px-2.5 py-1.5 font-sans text-[0.8125rem] font-semibold text-[#55655D] transition hover:bg-[#0F3D2E]/[0.06] hover:text-[#0F3D2E]"
          >
            Close
          </button>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto px-4 py-3">
          {entries.length === 0 ? (
            <p className="m-0 font-sans text-[0.8125rem] text-[#55655D]">No activity recorded.</p>
          ) : (
            <ul className="m-0 list-none space-y-2 p-0">
              {pageEntries.map((e, i) => (
                <li
                  key={`${e.at}-${e.action}-${page}-${i}`}
                  className="rounded-[10px] border border-[#0F3D2E]/08 bg-[#E8DFD6] px-3 py-2.5"
                >
                  <p className="m-0 font-sans text-[0.6875rem] text-[#55655D]">{fmtDate(e.at)}</p>
                  <p className="m-0 mt-0.5 font-sans text-[0.8125rem] font-semibold capitalize text-[#0F3D2E]">
                    {e.action.replace(/_/g, ' ')}
                  </p>
                  {e.actor ? (
                    <p className="m-0 mt-0.5 font-sans text-[0.75rem] text-[#55655D]">{e.actor}</p>
                  ) : null}
                  {e.detail ? (
                    <p className="m-0 mt-0.5 break-words font-sans text-[0.75rem] text-[#55655D]">
                      {e.detail}
                    </p>
                  ) : null}
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="flex shrink-0 items-center justify-between gap-2 border-t border-[#0F3D2E]/10 px-4 py-2.5">
          <p className="m-0 font-sans text-[0.6875rem] text-[#55655D]">
            {entries.length === 0
              ? '0 entries'
              : `${page * MICRO_LEDGER_PAGE_SIZE + 1}–${Math.min(
                  (page + 1) * MICRO_LEDGER_PAGE_SIZE,
                  entries.length,
                )} of ${entries.length}`}
          </p>
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              disabled={page <= 0}
              onClick={() => setPage((p) => Math.max(0, p - 1))}
              className="rounded-[8px] border-0 bg-[#E8DFD6] px-3 py-1.5 font-sans text-[0.75rem] font-semibold text-[#0F3D2E] transition hover:bg-[#E0D6CA] disabled:opacity-40"
            >
              Prev
            </button>
            <span className="min-w-[3.5rem] text-center font-sans text-[0.6875rem] font-semibold text-[#0F3D2E]">
              {page + 1} / {totalPages}
            </span>
            <button
              type="button"
              disabled={page >= totalPages - 1}
              onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
              className="rounded-[8px] border-0 bg-[#E8DFD6] px-3 py-1.5 font-sans text-[0.75rem] font-semibold text-[#0F3D2E] transition hover:bg-[#E0D6CA] disabled:opacity-40"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

function ensureNotesObject(existing: string | null | undefined): Record<string, unknown> {
  try {
    if (existing?.trim().startsWith('{')) {
      const parsed = JSON.parse(existing) as Record<string, unknown>
      if (parsed && typeof parsed === 'object') return { ...parsed }
    }
  } catch {
    /* plain */
  }
  if (existing?.trim()) return { prior_notes: existing }
  return {}
}

function withMicroLedger(
  existing: string | null | undefined,
  entry: MicroLedgerEntry,
): string {
  const parsed = ensureNotesObject(existing)
  const ledger = Array.isArray(parsed.micro_ledger)
    ? [...(parsed.micro_ledger as MicroLedgerEntry[])]
    : []
  ledger.unshift(entry)
  parsed.micro_ledger = ledger.slice(0, 200)
  return JSON.stringify(parsed)
}

function withDirectoryNotes(existing: string | null | undefined, directoryNotes: string) {
  const trimmed = directoryNotes.trim()
  const previous = getDirectoryNotes(existing)
  const parsed = ensureNotesObject(existing)
  const history = Array.isArray(parsed.directory_notes_history)
    ? [...(parsed.directory_notes_history as { at: string; text: string }[])]
    : []
  if (previous && previous !== trimmed) {
    history.unshift({ at: new Date().toISOString(), text: previous })
  }
  if (!trimmed) {
    delete parsed.directory_notes
  } else {
    parsed.directory_notes = trimmed
  }
  parsed.directory_notes_history = history.slice(0, 50)
  return JSON.stringify(parsed)
}

function normalizePhone(phone: string | null | undefined) {
  return (phone || '').replace(/\D/g, '')
}

function normalizeEmail(email: string | null | undefined) {
  return (email || '').trim().toLowerCase()
}

function sourceLabel(a: Application) {
  if (isMedicareApplication(a)) return 'Medicare.Reviews'
  if (isAcaApplication(a)) return 'ACA Enroll'
  if (a.source) return a.source
  return 'Untagged'
}

function lineOfBusiness(a: Application) {
  if (isMedicareApplication(a)) return 'Medicare'
  if (isAcaApplication(a)) return 'ACA'
  if (a.plan_type?.trim()) return a.plan_type.trim()
  if (a.source?.trim()) return a.source.trim()
  return 'General'
}

function folderFor(a: Application): FileFolderId {
  if (ENROLLED_STATUSES.has(a.application_status)) return 'enrolled'
  if (isMedicareApplication(a)) return 'medicare'
  if (isAcaApplication(a)) return 'aca'
  return 'other'
}

function enrollmentActiveLabel(status: string): 'Active' | 'Inactive' {
  return ENROLLED_STATUSES.has(status) ? 'Active' : 'Inactive'
}

function enrollmentBadge(status: string) {
  const active = ENROLLED_STATUSES.has(status)
  return (
    <span
      className={`inline-flex items-center rounded-full px-2 py-0.5 font-sans text-[0.625rem] font-semibold uppercase tracking-[0.06em] ${
        active
          ? 'bg-[#0F3D2E] text-[#E8DFD6]'
          : 'bg-[#0F3D2E]/10 text-[#55655D]'
      }`}
    >
      {active ? 'Active' : 'Inactive'}
    </span>
  )
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
  'rounded-[14px] border border-[#0F3D2E]/10 bg-[#E8DFD6] p-3 shadow-[0_2px_12px_rgba(15,61,46,0.04)]'
const selectClass =
  'rounded-[10px] border border-[#0F3D2E]/15 bg-[#E8DFD6] px-2.5 py-1.5 font-sans text-[0.75rem] font-semibold text-[#0F3D2E] outline-none focus:border-[#0F3D2E]'
const fieldClass =
  'w-full rounded-[10px] border border-[#0F3D2E]/15 bg-[#E8DFD6] px-2.5 py-1.5 font-sans text-[0.8125rem] text-[#0F3D2E] outline-none focus:border-[#0F3D2E]'
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
    const app = applications.find((a) => a.id === id)
    const prevStatus = app?.application_status
    const notes = app
      ? withMicroLedger(app.notes, {
          at: new Date().toISOString(),
          actor: email || 'admin',
          action: 'status_changed',
          detail: `${(prevStatus || 'unknown').replace(/_/g, ' ')} → ${application_status.replace(/_/g, ' ')}`,
        })
      : undefined
    const res = await fetch('/api/admin/applications', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id,
        application_status,
        ...(notes !== undefined ? { notes } : {}),
      }),
    })
    const data = await res.json().catch(() => ({}))
    if (!res.ok || !data?.ok) {
      setFlash(data?.error || 'Could not update status.')
      return
    }
    setApplications((prev) =>
      prev.map((a) =>
        a.id === id
          ? {
              ...a,
              application_status,
              notes: data.application?.notes ?? notes ?? a.notes,
            }
          : a,
      ),
    )
    setFlash('Application status updated.')
  }

  const updateApplicationNotes = async (id: string, notes: string | null) => {
    setFlash(null)
    const res = await fetch('/api/admin/applications', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, notes }),
    })
    const data = await res.json().catch(() => ({}))
    if (!res.ok || !data?.ok) {
      setFlash(data?.error || 'Could not save notes.')
      return false
    }
    setApplications((prev) =>
      prev.map((a) => (a.id === id ? { ...a, notes: data.application?.notes ?? notes } : a)),
    )
    setFlash('Client notes saved.')
    return true
  }

  const recordApplicationAudit = async (
    id: string,
    action: string,
    detail?: string,
    opts?: { silent?: boolean },
  ) => {
    const app = applications.find((a) => a.id === id)
    if (!app) return false
    const notes = withMicroLedger(app.notes, {
      at: new Date().toISOString(),
      actor: email || 'admin',
      action,
      detail,
    })
    const res = await fetch('/api/admin/applications', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, notes }),
    })
    const data = await res.json().catch(() => ({}))
    if (!res.ok || !data?.ok) {
      if (!opts?.silent) setFlash(data?.error || 'Could not record activity.')
      return false
    }
    setApplications((prev) =>
      prev.map((a) => (a.id === id ? { ...a, notes: data.application?.notes ?? notes } : a)),
    )
    return true
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
    setFlash('Application status updated.')
  }

  return (
    <main className="flex h-dvh flex-col overflow-hidden bg-[radial-gradient(ellipse_at_12%_0%,rgba(201,169,97,0.14)_0%,transparent_42%),linear-gradient(165deg,#E8DFD6_0%,#F7F3EE_48%,#EFE8DF_100%)]">
      <div className="mx-auto flex min-h-0 w-full max-w-[1400px] flex-1 flex-col px-3 py-3 sm:px-5 sm:py-4">
        <div className="mb-3 flex shrink-0 flex-wrap items-center justify-between gap-2">
          <div>
            <p className="m-0 font-sans text-[9px] font-semibold uppercase tracking-[0.24em] text-[#C9A961]">
              Centuries Mutual · Office
            </p>
            <button
              type="button"
              onClick={goHome}
              className="m-0 mt-0.5 block cursor-pointer border-0 bg-transparent p-0 text-left font-medium tracking-tight text-[#0F3D2E] transition hover:text-[#245C45]"
              style={{ ...displayFont, fontSize: 'clamp(1.25rem,2.2vw,1.65rem)' }}
              title="Refresh and return to Home"
            >
              Administration
            </button>
          </div>
          <div className="flex flex-wrap items-center gap-1.5">
            <button
              type="button"
              onClick={() => void loadAll()}
              aria-label="Refresh"
              title="Refresh"
              className="inline-flex h-8 w-8 items-center justify-center rounded-[10px] border-0 bg-transparent text-[#0F3D2E] transition hover:text-[#245C45]"
            >
              <RefreshCw className="h-3.5 w-3.5" strokeWidth={2.25} />
            </button>
            <div className="relative" ref={settingsRef}>
              <button
                type="button"
                onClick={() => setSettingsOpen((o) => !o)}
                aria-label="Settings"
                aria-expanded={settingsOpen}
                title="Settings"
                className="inline-flex h-8 w-8 items-center justify-center rounded-[10px] border-0 bg-[#C9B396] text-[#0F3D2E] transition hover:bg-[#0F3D2E] hover:text-[#E8DFD6]"
              >
                <Settings className="h-3.5 w-3.5" strokeWidth={2.25} />
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
        </div>

        <div className="flex min-h-0 flex-1 flex-col">
          <nav className="relative z-10 shrink-0" aria-label="Office sections">
            <div className="flex items-end gap-1 px-0.5">
              {NAV_TABS.map((w) => {
                const active = workspace === w.id
                return (
                  <button
                    key={w.id}
                    type="button"
                    onClick={() => setWorkspace(w.id)}
                    className={`relative mb-[-1px] flex shrink-0 items-center gap-1.5 rounded-t-[8px] border px-3 py-1.5 font-sans text-[0.75rem] font-semibold transition ${
                      active
                        ? 'z-10 border-[#0F3D2E] bg-[#0F3D2E] text-[#E8DFD6]'
                        : 'z-0 border-transparent bg-[#C9B396]/55 text-[#0F3D2E]/70 hover:bg-[#C9B396]/85 hover:text-[#0F3D2E]'
                    }`}
                  >
                    {w.label}
                    {w.id === 'files' ? (
                      <span
                        className={`inline-flex min-w-[1.05rem] items-center justify-center rounded-full px-1 py-0.5 font-sans text-[0.5625rem] font-bold leading-none ${
                          active
                            ? 'bg-[#C9A961] text-[#0F3D2E]'
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

          <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-b-[16px] rounded-tr-[16px] border border-[#B89A78] bg-[#F7F3EE] shadow-[0_4px_20px_rgba(15,61,46,0.05)]">
            {flash ? (
              <p className="m-0 shrink-0 border-b border-[#0F3D2E]/10 bg-[#E8F0EA] px-3 py-2 font-sans text-[0.8125rem] text-[#0F3D2E]">
                {flash}
              </p>
            ) : null}
            {error ? (
              <p className="m-0 shrink-0 border-b border-[#0F3D2E]/10 bg-[#B42318]/[0.08] px-3 py-2 font-sans text-[0.8125rem] text-[#B42318]">
                {error}
              </p>
            ) : null}
            {loading ? (
              <div className="flex flex-1 items-center justify-center py-10 text-center">
                <p className="m-0 font-sans text-[0.875rem] text-[#55655D]">Loading workspace…</p>
              </div>
            ) : (
              <AnimatePresence mode="wait">
                <motion.div
                  key={workspace}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.14 }}
                  className="flex min-h-0 flex-1 flex-col overflow-hidden [&>*]:min-h-0 [&>*]:flex-1 [&>*]:rounded-none [&>*]:border-0 [&>*]:shadow-none"
                >
                  {workspace === 'overview' && (
                    <OverviewPanel applications={applications} careers={careers} />
                  )}

                  {workspace === 'clients' && (
                    <ClientsDirectoryPanel
                      applications={applications}
                      actorEmail={email}
                      onSaveNotes={updateApplicationNotes}
                      onAudit={recordApplicationAudit}
                    />
                  )}

                  {workspace === 'leads' && (
                    <LeadsSpreadsheetPanel
                      applications={applications}
                      onUpdateStatus={updateStatus}
                      onAudit={recordApplicationAudit}
                    />
                  )}

                  {workspace === 'files' && (
                    <FilesWorkspace
                      folder={folder}
                      counts={folderCounts}
                      rows={folderRows}
                      selected={selected}
                      query={query}
                      onQuery={setQuery}
                      onFolder={(id) => {
                        setFolder(id)
                        setSelectedId(null)
                      }}
                      onSelect={setSelectedId}
                      onUpdateStatus={updateStatus}
                      onAudit={recordApplicationAudit}
                    />
                  )}

                  {workspace === 'employees' && (
                    <div className="min-h-0 flex-1 overflow-y-auto p-3 sm:p-4">
                      <EmployeesWorkspace
                        careers={careers}
                        listings={listings}
                        hiringStats={hiringStats}
                        onUpdateCareer={updateCareerStatus}
                        onListingsChange={setListings}
                        onFlash={setFlash}
                      />
                    </div>
                  )}

                  {workspace === 'intelligence' && (
                    <div className="min-h-0 flex-1 overflow-y-auto p-3 sm:p-4">
                      <SalesMarketingPanel
                        sales={salesStats}
                        counts={folderCounts}
                        acaCount={acaApplications.length}
                        medicareCount={medicareApplications.length}
                        enrolledCount={enrollments.length}
                      />
                    </div>
                  )}

                  {workspace === 'operations' && (
                    <div className="min-h-0 flex-1 space-y-3 overflow-y-auto p-3 sm:p-4">
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
                            className={`rounded-[10px] px-3 py-1.5 font-sans text-[0.75rem] font-semibold transition ${
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

                  {workspace === 'ledger' && (
                    <div className="min-h-0 flex-1 overflow-y-auto p-3 sm:p-4">
                      <LedgerTable rows={ledger} note={ledgerNote} />
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
            )}
          </div>
        </div>
      </div>
    </main>
  )
}

/* ---------------------------------------------------------------------------
 * Clients — directory lookup
 * ------------------------------------------------------------------------- */

function DuplicateFieldMark({ message }: { message: string }) {
  return (
    <span className="group relative ml-1 inline-flex align-middle">
      <span
        className="inline-flex h-3.5 w-3.5 cursor-help items-center justify-center rounded-full border border-[#B45309] font-sans text-[0.5625rem] font-bold leading-none text-[#B45309]"
        aria-label={message}
      >
        !
      </span>
      <span className="pointer-events-none absolute bottom-full left-1/2 z-30 mb-1.5 w-52 -translate-x-1/2 rounded-[8px] bg-[#0F3D2E] px-2.5 py-1.5 font-sans text-[0.6875rem] font-normal normal-case tracking-normal text-[#E8DFD6] opacity-0 shadow-lg transition group-hover:opacity-100">
        {message}
      </span>
    </span>
  )
}

function DirectoryHistoryModal({
  app,
  onClose,
}: {
  app: Application
  onClose: () => void
}) {
  const detail = parseEnrollmentNotes(app.notes)
  const currentNotes = getDirectoryNotes(app.notes)
  const notesHistory = getNotesHistory(app.notes)
  const microLedger = getMicroLedger(app.notes)
  const agentId = getAgentOfRecord(app.notes)

  const enrollmentEvents = useMemo(() => {
    const events: { at: string; title: string; detail: string }[] = [
      {
        at: app.created_at,
        title: 'Application submitted',
        detail: `${sourceLabel(app)}${app.plan_type ? ` · ${app.plan_type}` : ''}`,
      },
      {
        at: app.created_at,
        title: `Status · ${app.application_status.replace(/_/g, ' ')}`,
        detail: `Application ID ${app.id}`,
      },
    ]
    if (agentId) {
      events.push({
        at: app.created_at,
        title: 'Agent of Record',
        detail: agentId,
      })
    }
    if (detail?.enrollment_period) {
      events.push({
        at: app.created_at,
        title: 'Enrollment period',
        detail:
          detail.enrollment_period === 'sep' ? 'Special Enrollment Period' : 'Open Enrollment',
      })
    }
    if (detail?.household?.coverage_start) {
      events.push({
        at: detail.household.coverage_start,
        title: 'Coverage start',
        detail: detail.household.coverage_start,
      })
    }
    if (detail?.sep?.qualifying_event) {
      events.push({
        at: detail.sep.event_date || app.created_at,
        title: 'SEP qualifying event',
        detail: `${detail.sep.qualifying_event}${
          detail.sep.event_date ? ` · ${detail.sep.event_date}` : ''
        }`,
      })
    }
    if (typeof detail?.household?.annual_income === 'number') {
      events.push({
        at: app.created_at,
        title: 'Household income recorded',
        detail: `$${detail.household.annual_income.toLocaleString('en-US')}${
          detail.household.size ? ` · HH ${detail.household.size}` : ''
        }`,
      })
    }
    if (Array.isArray(detail?.dependents) && detail.dependents.length > 0) {
      events.push({
        at: app.created_at,
        title: 'Dependents',
        detail: `${detail.dependents.length} dependent${detail.dependents.length === 1 ? '' : 's'}`,
      })
    }
    return events
  }, [app, agentId, detail])

  const noteEntries = useMemo(() => {
    const entries: { at: string; text: string; current?: boolean }[] = []
    if (currentNotes.trim()) {
      entries.push({ at: new Date().toISOString(), text: currentNotes, current: true })
    }
    for (const h of notesHistory) {
      entries.push({ at: h.at, text: h.text })
    }
    return entries
  }, [currentNotes, notesHistory])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#0F3D2E]/45 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="directory-history-title"
      onClick={onClose}
    >
      <div
        className="flex max-h-[min(88vh,640px)] w-full max-w-2xl flex-col overflow-hidden rounded-[16px] bg-[#F7F3EE] shadow-[0_24px_60px_rgba(15,61,46,0.28)]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex shrink-0 items-start justify-between gap-3 border-b border-[#0F3D2E]/10 px-4 py-3 sm:px-5">
          <div>
            <p className="m-0 font-sans text-[0.625rem] font-semibold uppercase tracking-[0.14em] text-[#C9A961]">
              Client history
            </p>
            <h2
              id="directory-history-title"
              className="m-0 mt-0.5 font-medium text-[#0F3D2E]"
              style={{ ...displayFont, fontSize: '1.2rem' }}
            >
              {app.first_name} {app.last_name}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-[10px] border-0 bg-transparent px-2.5 py-1.5 font-sans text-[0.8125rem] font-semibold text-[#55655D] transition hover:bg-[#0F3D2E]/[0.06] hover:text-[#0F3D2E]"
          >
            Close
          </button>
        </div>

        <div className="min-h-0 flex-1 space-y-5 overflow-y-auto px-4 py-4 sm:px-5">
          <section>
            <h3 className="m-0 font-sans text-[0.6875rem] font-semibold uppercase tracking-[0.12em] text-[#0F3D2E]">
              Notes history
            </h3>
            {noteEntries.length === 0 ? (
              <p className="m-0 mt-2 font-sans text-[0.8125rem] text-[#55655D]">No notes recorded yet.</p>
            ) : (
              <ul className="m-0 mt-2 list-none space-y-2 p-0">
                {noteEntries.map((entry, i) => (
                  <li
                    key={`${entry.at}-${i}`}
                    className="rounded-[12px] border border-[#0F3D2E]/08 bg-[#E8DFD6] px-3 py-2.5"
                  >
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="m-0 font-sans text-[0.6875rem] text-[#55655D]">
                        {entry.current ? 'Current' : fmtDate(entry.at)}
                      </p>
                      {entry.current ? (
                        <span className="rounded-full bg-[#0F3D2E]/10 px-2 py-0.5 font-sans text-[0.5625rem] font-semibold uppercase tracking-[0.08em] text-[#0F3D2E]">
                          Latest
                        </span>
                      ) : null}
                    </div>
                    <p className="m-0 mt-1 whitespace-pre-wrap font-sans text-[0.8125rem] text-[#0F3D2E]">
                      {entry.text}
                    </p>
                  </li>
                ))}
              </ul>
            )}
            {microLedger.length > 0 ? (
              <div className="mt-3 border-t border-[#0F3D2E]/08 pt-3">
                <p className="m-0 font-sans text-[0.5625rem] font-semibold uppercase tracking-[0.1em] text-[#55655D]">
                  Micro ledger
                </p>
                <ul className="m-0 mt-1.5 max-h-40 list-none space-y-1 overflow-y-auto p-0">
                  {microLedger.map((e, i) => (
                    <li
                      key={`${e.at}-${e.action}-${i}`}
                      className="font-sans text-[0.625rem] leading-snug text-[#55655D]"
                    >
                      <span className="text-[#0F3D2E]/70">{fmtDate(e.at)}</span>
                      {' · '}
                      <span className="lowercase">{e.action.replace(/_/g, ' ')}</span>
                      {e.actor ? ` · ${e.actor}` : ''}
                      {e.detail ? ` · ${e.detail}` : ''}
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
          </section>

          <section>
            <h3 className="m-0 font-sans text-[0.6875rem] font-semibold uppercase tracking-[0.12em] text-[#0F3D2E]">
              Enrollment history
            </h3>
            <ul className="m-0 mt-2 list-none space-y-2 p-0">
              {enrollmentEvents.map((ev, i) => (
                <li
                  key={`${ev.title}-${i}`}
                  className="rounded-[12px] border border-[#0F3D2E]/08 bg-[#FAFCFB] px-3 py-2.5"
                >
                  <p className="m-0 font-sans text-[0.6875rem] text-[#55655D]">{fmtDate(ev.at)}</p>
                  <p className="m-0 mt-0.5 font-sans text-[0.8125rem] font-semibold text-[#0F3D2E]">
                    {ev.title}
                  </p>
                  <p className="m-0 mt-0.5 break-words font-sans text-[0.75rem] text-[#55655D]">
                    {ev.detail}
                  </p>
                </li>
              ))}
            </ul>
          </section>
        </div>
      </div>
    </div>
  )
}

function ClientsDirectoryPanel({
  applications,
  actorEmail,
  onSaveNotes,
  onAudit,
}: {
  applications: Application[]
  actorEmail: string | null
  onSaveNotes: (id: string, notes: string | null) => Promise<boolean>
  onAudit: (
    id: string,
    action: string,
    detail?: string,
    opts?: { silent?: boolean },
  ) => Promise<boolean>
}) {
  const [search, setSearch] = useState('')
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [pickerOpen, setPickerOpen] = useState(false)
  const [notesDraft, setNotesDraft] = useState('')
  const [savingNotes, setSavingNotes] = useState(false)
  const [historyOpen, setHistoryOpen] = useState(false)
  const [ssnRevealed, setSsnRevealed] = useState(false)
  const [callTarget, setCallTarget] = useState<SoftPhoneTarget | null>(null)
  const [microLedgerOpen, setMicroLedgerOpen] = useState(false)
  const lastViewedId = useRef<string | null>(null)

  const matches = useMemo(() => {
    const q = search.trim().toLowerCase()
    if (!q) return applications
    return applications.filter((a) => {
      const hay = [
        a.id,
        a.first_name,
        a.last_name,
        a.email,
        a.phone,
        a.address,
        a.city,
        a.state,
        a.zip,
        a.plan_type,
        a.source,
        a.application_status,
        getAgentOfRecord(a.notes),
        getDirectoryNotes(a.notes),
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase()
      return hay.includes(q)
    })
  }, [applications, search])

  useEffect(() => {
    if (selectedId && !matches.some((a) => a.id === selectedId)) {
      setSelectedId(matches[0]?.id ?? null)
    } else if (!selectedId && matches.length === 1) {
      setSelectedId(matches[0].id)
    }
  }, [matches, selectedId])

  const selected = applications.find((a) => a.id === selectedId) ?? null

  useEffect(() => {
    setNotesDraft(selected ? getDirectoryNotes(selected.notes) : '')
    setHistoryOpen(false)
    setSsnRevealed(false)
    setMicroLedgerOpen(false)
  }, [selected?.id])

  useEffect(() => {
    if (!selectedId || lastViewedId.current === selectedId) return
    lastViewedId.current = selectedId
    void onAudit(selectedId, 'viewed', 'Directory', { silent: true })
  }, [selectedId, onAudit])

  const detail = selected ? parseEnrollmentNotes(selected.notes) : null
  const fullSsn = selected ? getFullSsn(selected.notes) : ''
  const microLedger = selected ? getMicroLedger(selected.notes) : []

  const duplicateEmailWarning = useMemo(() => {
    if (!selected?.email) return null
    const email = normalizeEmail(selected.email)
    if (!email) return null
    const others = applications.filter(
      (a) => a.id !== selected.id && normalizeEmail(a.email) === email,
    )
    if (others.length === 0) return null
    const names = others
      .slice(0, 3)
      .map((a) => `${a.first_name} ${a.last_name}`.trim())
      .join(', ')
    const more = others.length > 3 ? ` (+${others.length - 3} more)` : ''
    return `Another profile is using the same email: ${names}${more}`
  }, [applications, selected])

  const duplicatePhoneWarning = useMemo(() => {
    if (!selected?.phone) return null
    const phone = normalizePhone(selected.phone)
    if (phone.length < 7) return null
    const others = applications.filter(
      (a) => a.id !== selected.id && normalizePhone(a.phone) === phone,
    )
    if (others.length === 0) return null
    const names = others
      .slice(0, 3)
      .map((a) => `${a.first_name} ${a.last_name}`.trim())
      .join(', ')
    const more = others.length > 3 ? ` (+${others.length - 3} more)` : ''
    return `Another profile is using the same phone number: ${names}${more}`
  }, [applications, selected])

  const fieldDefs = [
    'Application ID',
    'Agent of Record',
    'Enrollment',
    'First name',
    'Last name',
    'Email',
    'Phone number',
    'Date of birth',
    'Plan type',
    'Status',
    'Source',
    'Address',
    'Coverage start',
    'Submitted',
  ] as const

  const fields: { label: string; value: string; warning?: string | null }[] = fieldDefs.map(
    (label) => {
      if (!selected) return { label, value: '' }
      switch (label) {
        case 'Application ID':
          return { label, value: selected.id }
        case 'Agent of Record':
          return { label, value: getAgentOfRecord(selected.notes) }
        case 'Enrollment':
          return { label, value: enrollmentActiveLabel(selected.application_status) }
        case 'First name':
          return { label, value: selected.first_name || '' }
        case 'Last name':
          return { label, value: selected.last_name || '' }
        case 'Email':
          return { label, value: selected.email || '', warning: duplicateEmailWarning }
        case 'Phone number':
          return { label, value: selected.phone || '', warning: duplicatePhoneWarning }
        case 'Date of birth':
          return { label, value: selected.date_of_birth || '' }
        case 'Plan type':
          return { label, value: selected.plan_type || '' }
        case 'Status':
          return { label, value: selected.application_status.replace(/_/g, ' ') }
        case 'Source':
          return { label, value: sourceLabel(selected) }
        case 'Address':
          return {
            label,
            value:
              [selected.address, selected.city, selected.state, selected.zip]
                .filter(Boolean)
                .join(', ') || '',
          }
        case 'Coverage start':
          return { label, value: detail?.household?.coverage_start || '' }
        case 'Submitted':
          return { label, value: fmtDate(selected.created_at) }
        default:
          return { label, value: '' }
      }
    },
  )

  const saveNotes = async () => {
    if (!selected) return
    setSavingNotes(true)
    try {
      let notes = withDirectoryNotes(selected.notes, notesDraft)
      notes = withMicroLedger(notes, {
        at: new Date().toISOString(),
        actor: actorEmail || 'admin',
        action: 'notes_updated',
        detail: 'Directory notes saved',
      })
      await onSaveNotes(selected.id, notes)
    } finally {
      setSavingNotes(false)
    }
  }

  const revealSsn = () => {
    if (!selected || ssnRevealed) return
    setSsnRevealed(true)
    void onAudit(selected.id, 'ssn_revealed', 'Directory', { silent: true })
  }

  const clearDirectory = () => {
    setSearch('')
    setSelectedId(null)
    setNotesDraft('')
    setPickerOpen(false)
    setHistoryOpen(false)
    setSsnRevealed(false)
    setMicroLedgerOpen(false)
  }

  const emptyFieldClass =
    'w-full rounded-[10px] border border-[#0F3D2E]/20 bg-transparent px-2.5 py-1.5 font-sans text-[0.8125rem] text-[#0F3D2E] outline-none placeholder:text-[#55655D]/50'
  const filledFieldClass =
    'w-full cursor-default rounded-[10px] border border-[#0F3D2E]/15 bg-[#FAFCFB] px-2.5 py-1.5 font-sans text-[0.8125rem] text-[#0F3D2E] outline-none'

  return (
    <div className="flex h-full min-h-0 flex-col gap-3 overflow-hidden bg-[#F7F3EE] p-3 sm:p-4">
      <div className="shrink-0">
        <p className="m-0 font-sans text-[0.6875rem] font-semibold uppercase tracking-[0.14em] text-[#C9A961]">
          Clients
        </p>
        <h2 className="m-0 mt-0.5 font-medium text-[#0F3D2E]" style={{ ...displayFont, fontSize: '1.25rem' }}>
          Directory
        </h2>
      </div>

      <div className="grid min-h-0 flex-1 grid-cols-1 gap-3 lg:grid-cols-[minmax(0,1fr)_minmax(220px,0.32fr)]">
        {/* Client record — larger left column */}
        <section className="flex min-h-0 flex-col overflow-hidden rounded-[14px] bg-[#E8DFD6] p-3 sm:p-4">
          <div className="mb-3 flex min-h-[1.75rem] shrink-0 flex-wrap items-center gap-2">
            {selected ? (
              <>
                <h3 className="m-0 font-medium text-[#0F3D2E]" style={{ ...displayFont, fontSize: '1.15rem' }}>
                  {selected.first_name} {selected.last_name}
                </h3>
                {enrollmentBadge(selected.application_status)}
              </>
            ) : (
              <h3 className="m-0 font-medium text-[#55655D]" style={{ ...displayFont, fontSize: '1.15rem' }}>
                Client record
              </h3>
            )}
          </div>
          <div className="grid min-h-0 shrink grid-cols-1 content-start gap-2 overflow-y-auto sm:grid-cols-2 xl:grid-cols-3">
            {fields.map((f) => (
              <label key={f.label} className="block">
                <span className="mb-1 flex items-center gap-1 font-sans text-[0.625rem] font-semibold uppercase tracking-[0.08em] text-[#55655D]">
                  {f.label}
                  {f.label === 'Phone number' ? (
                    <button
                      type="button"
                      disabled={!selected?.phone}
                      onClick={(e) => {
                        e.preventDefault()
                        if (!selected?.phone) return
                        setCallTarget({
                          applicationId: selected.id,
                          name: `${selected.first_name} ${selected.last_name}`.trim(),
                          phone: selected.phone,
                          context: 'Clients',
                        })
                      }}
                      title={selected?.phone ? `Call ${selected.phone}` : 'No phone on file'}
                      className="inline-flex items-center justify-center border-0 bg-transparent p-0 text-[#0F3D2E] transition hover:text-[#245C45] disabled:opacity-35"
                    >
                      <Phone className="h-3 w-3" strokeWidth={2.25} />
                    </button>
                  ) : null}
                  {f.warning ? <DuplicateFieldMark message={f.warning} /> : null}
                </span>
                <input
                  readOnly
                  value={f.value}
                  placeholder="—"
                  className={selected ? filledFieldClass : emptyFieldClass}
                />
              </label>
            ))}
            <div className="block">
              <div className="mb-1 flex items-center justify-between gap-2">
                <span className="font-sans text-[0.625rem] font-semibold uppercase tracking-[0.08em] text-[#55655D]">
                  SSN
                </span>
                <button
                  type="button"
                  disabled={!selected || !fullSsn || ssnRevealed}
                  onClick={revealSsn}
                  className="rounded-[6px] border-0 bg-transparent px-1.5 py-0.5 font-sans text-[0.625rem] font-semibold text-[#0F3D2E] transition hover:bg-[#0F3D2E]/[0.06] disabled:opacity-40"
                >
                  {ssnRevealed ? 'Revealed' : 'Reveal'}
                </button>
              </div>
              <input
                readOnly
                value={selected ? fullSsn || '—' : ''}
                placeholder="—"
                className={`${selected ? filledFieldClass : emptyFieldClass} ${
                  selected && fullSsn && !ssnRevealed ? 'select-none blur-[5px]' : ''
                }`}
              />
            </div>
          </div>
          <div className="mt-3 flex min-h-0 flex-1 flex-col">
            <div className="mb-1 flex items-center justify-between gap-2">
              <span className="font-sans text-[0.625rem] font-semibold uppercase tracking-[0.08em] text-[#55655D]">
                Notes
              </span>
              <button
                type="button"
                disabled={!selected}
                onClick={() => setHistoryOpen(true)}
                className="rounded-[8px] border-0 bg-transparent px-2 py-0.5 font-sans text-[0.6875rem] font-semibold text-[#0F3D2E] transition hover:bg-[#0F3D2E]/[0.06] disabled:opacity-40"
              >
                History
              </button>
            </div>
            <textarea
              value={notesDraft}
              onChange={(e) => setNotesDraft(e.target.value)}
              placeholder="Add notes about this client…"
              disabled={!selected}
              className={`${
                selected ? filledFieldClass : emptyFieldClass
              } min-h-[72px] flex-1 resize-none disabled:opacity-70`}
            />
            {selected && microLedger.length > 0 ? (
              <button
                type="button"
                onClick={() => setMicroLedgerOpen(true)}
                className="mt-2 w-full shrink-0 rounded-[8px] border border-[#0F3D2E]/08 bg-[#F7F3EE]/80 px-2 py-1.5 text-left transition hover:bg-[#F0EBE4]"
                title="View full micro ledger"
              >
                <p className="m-0 font-sans text-[0.5rem] font-semibold uppercase tracking-[0.12em] text-[#55655D]">
                  Micro ledger
                </p>
                <p className="m-0 mt-0.5 truncate font-sans text-[0.5625rem] leading-snug text-[#55655D]">
                  {formatMicroLedgerLine(microLedger[0], { shortDate: true })}
                </p>
                {microLedger.length > 1 ? (
                  <p className="m-0 mt-0.5 font-sans text-[0.5rem] text-[#0F3D2E]/55">
                    +{microLedger.length - 1} earlier · click to view all
                  </p>
                ) : null}
              </button>
            ) : null}
            <div className="mt-2 flex shrink-0 justify-end">
              <button
                type="button"
                disabled={
                  !selected || savingNotes || notesDraft === getDirectoryNotes(selected.notes)
                }
                onClick={() => void saveNotes()}
                className="shrink-0 rounded-[10px] bg-[#0F3D2E] px-4 py-2 font-sans text-[0.75rem] font-semibold text-[#E8DFD6] transition hover:bg-[#0A2E22] disabled:opacity-50"
              >
                {savingNotes ? 'Saving…' : 'Save notes'}
              </button>
            </div>
          </div>
        </section>

        {/* Search card — narrower right column */}
        <aside className="flex min-h-0 flex-col overflow-hidden rounded-[14px] bg-[#E8DFD6] p-3">
          <div className="mb-2 flex items-center justify-between gap-2">
            <p className="m-0 font-sans text-[0.625rem] font-semibold uppercase tracking-[0.12em] text-[#55655D]">
              Search
            </p>
            <button
              type="button"
              onClick={clearDirectory}
              className="rounded-[8px] border-0 bg-transparent px-2 py-1 font-sans text-[0.6875rem] font-semibold text-[#0F3D2E] transition hover:bg-[#0F3D2E]/[0.06]"
            >
              Clear
            </button>
          </div>
          <input
            value={search}
            onChange={(e) => {
              setSearch(e.target.value)
              setPickerOpen(true)
            }}
            onFocus={() => setPickerOpen(true)}
            placeholder="Name, email, phone, state…"
            className={`${fieldClass} w-full shrink-0`}
            autoFocus
          />
          <div className="mt-2 min-h-0 flex-1 overflow-y-auto">
            {pickerOpen && search.trim() ? (
              <ul className="m-0 flex list-none flex-col gap-1.5 p-0">
                {matches.length === 0 ? (
                  <li className="rounded-[12px] bg-white px-3 py-2.5 font-sans text-[0.8125rem] text-[#55655D]">
                    No clients found.
                  </li>
                ) : (
                  matches.slice(0, 12).map((a) => (
                    <li key={a.id}>
                      <button
                        type="button"
                        onMouseDown={(e) => e.preventDefault()}
                        onClick={() => {
                          setSelectedId(a.id)
                          setSearch(`${a.first_name} ${a.last_name}`)
                          setPickerOpen(false)
                        }}
                        className={`flex w-full flex-col rounded-[12px] border-0 px-3 py-2.5 text-left shadow-none transition ${
                          selectedId === a.id
                            ? 'bg-[#0F3D2E] text-[#E8DFD6]'
                            : 'bg-white text-[#0F3D2E] hover:bg-[#FAFCFB]'
                        }`}
                      >
                        <span
                          className={`font-sans text-[0.8125rem] font-semibold ${
                            selectedId === a.id ? 'text-[#E8DFD6]' : 'text-[#0F3D2E]'
                          }`}
                        >
                          {a.first_name} {a.last_name}
                        </span>
                        <span
                          className={`truncate font-sans text-[0.6875rem] ${
                            selectedId === a.id ? 'text-[#E8DFD6]/75' : 'text-[#55655D]'
                          }`}
                        >
                          {a.email}
                          {a.state ? ` · ${a.state}` : ''}
                        </span>
                      </button>
                    </li>
                  ))
                )}
              </ul>
            ) : (
              <p className="m-0 px-0.5 font-sans text-[0.75rem] text-[#55655D]">
                Type to find a client. Results stay in this panel so the record stays visible.
              </p>
            )}
          </div>
        </aside>
      </div>

      {historyOpen && selected ? (
        <DirectoryHistoryModal app={selected} onClose={() => setHistoryOpen(false)} />
      ) : null}

      {microLedgerOpen && selected ? (
        <MicroLedgerModal
          entries={microLedger}
          title={`${selected.first_name} ${selected.last_name}`}
          onClose={() => setMicroLedgerOpen(false)}
        />
      ) : null}

      <AnimatePresence>
        {callTarget ? (
          <SoftPhoneDialer
            key={callTarget.applicationId}
            target={callTarget}
            onClose={() => setCallTarget(null)}
            onComplete={async (payload) => {
              await onAudit(
                callTarget.applicationId,
                'call_disposition',
                `${payload.dispositionGroup}: ${payload.dispositionLabel}${
                  payload.notes ? ` · ${payload.notes}` : ''
                } · ${payload.durationSec}s`,
                { silent: true },
              )
            }}
          />
        ) : null}
      </AnimatePresence>
    </div>
  )
}

/* ---------------------------------------------------------------------------
 * Soft phone — simulated dialer (Clients + Leads)
 * ------------------------------------------------------------------------- */

const DISPOSITION_OPTIONS = [
  { value: 'interested_quote', label: 'Interested – Send Quote' },
  { value: 'interested_transfer', label: 'Interested – Transferred to Licensed Agent' },
  { value: 'not_interested', label: 'Not Interested' },
  { value: 'do_not_call', label: 'Do Not Call' },
  { value: 'callback', label: 'Call Back Later' },
  { value: 'voicemail', label: 'Left Voicemail' },
  { value: 'no_answer', label: 'No Answer' },
  { value: 'wrong_number', label: 'Disconnected / Wrong Number' },
  { value: 'qualified_docs', label: 'Qualified – Awaiting Documents' },
  { value: 'qualified_submitted', label: 'Qualified – Application Submitted' },
  { value: 'not_qualified_age', label: 'Not Qualified – Age' },
  { value: 'not_qualified_income', label: 'Not Qualified – Income' },
  { value: 'has_insurance', label: 'Already Has Insurance' },
  { value: 'out_of_area', label: 'Out of Service Area' },
  { value: 'sale', label: 'Sale' },
  { value: 'sale_bound', label: 'Sale – Policy Bound' },
  { value: 'sale_pending', label: 'Sale – Payment Pending' },
  { value: 'sale_followup', label: 'Sale – Follow-up Required' },
  { value: 'no_sale_declined', label: 'No Sale – Declined' },
  { value: 'no_sale_competitor', label: 'No Sale – Lost to Competitor' },
] as const

type SoftPhoneTarget = {
  applicationId: string
  name: string
  phone: string
  context: string
}

function formatDialDisplay(digits: string) {
  const d = digits.replace(/\D/g, '').slice(0, 15)
  if (d.length <= 3) return d
  if (d.length <= 6) return `(${d.slice(0, 3)}) ${d.slice(3)}`
  if (d.length <= 10) return `(${d.slice(0, 3)}) ${d.slice(3, 6)}-${d.slice(6)}`
  return `+${d.slice(0, d.length - 10)} (${d.slice(-10, -7)}) ${d.slice(-7, -4)}-${d.slice(-4)}`
}

function SoftPhoneDialer({
  target,
  onClose,
  onComplete,
}: {
  target: SoftPhoneTarget
  onClose: () => void
  onComplete: (payload: {
    dispositionGroup: string
    disposition: string
    dispositionLabel: string
    notes: string
    durationSec: number
  }) => void | Promise<void>
}) {
  const seedDigits = normalizePhone(target.phone)
  const [phase, setPhase] = useState<'dialing' | 'ringing' | 'connected' | 'ended'>('dialing')
  const [digits, setDigits] = useState(seedDigits)
  const [muted, setMuted] = useState(false)
  const [showPad, setShowPad] = useState(false)
  const [elapsed, setElapsed] = useState(0)
  const [disposition, setDisposition] = useState('')
  const [dispNotes, setDispNotes] = useState('')
  const [saving, setSaving] = useState(false)
  const startedAt = useRef<number | null>(null)

  useEffect(() => {
    const t1 = window.setTimeout(() => setPhase('ringing'), 700)
    const t2 = window.setTimeout(() => {
      setPhase('connected')
      startedAt.current = Date.now()
    }, 2800)
    return () => {
      window.clearTimeout(t1)
      window.clearTimeout(t2)
    }
  }, [])

  useEffect(() => {
    if (phase !== 'connected') return
    const id = window.setInterval(() => {
      if (startedAt.current) {
        setElapsed(Math.floor((Date.now() - startedAt.current) / 1000))
      }
    }, 250)
    return () => window.clearInterval(id)
  }, [phase])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && phase === 'ended') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose, phase])

  const statusLabel =
    phase === 'dialing'
      ? 'calling…'
      : phase === 'ringing'
        ? 'ringing…'
        : phase === 'connected'
          ? `${String(Math.floor(elapsed / 60)).padStart(2, '0')}:${String(elapsed % 60).padStart(2, '0')}`
          : 'call ended'

  const padKeys = [
    { d: '1', sub: '' },
    { d: '2', sub: 'ABC' },
    { d: '3', sub: 'DEF' },
    { d: '4', sub: 'GHI' },
    { d: '5', sub: 'JKL' },
    { d: '6', sub: 'MNO' },
    { d: '7', sub: 'PQRS' },
    { d: '8', sub: 'TUV' },
    { d: '9', sub: 'WXYZ' },
    { d: '*', sub: '' },
    { d: '0', sub: '+' },
    { d: '#', sub: '' },
  ] as const

  const endCall = () => setPhase('ended')

  const saveDisposition = async () => {
    if (!disposition) return
    const opt = DISPOSITION_OPTIONS.find((o) => o.value === disposition)
    setSaving(true)
    try {
      await onComplete({
        dispositionGroup: 'Disposition',
        disposition,
        dispositionLabel: opt?.label || disposition,
        notes: dispNotes.trim(),
        durationSec: elapsed,
      })
      onClose()
    } finally {
      setSaving(false)
    }
  }

  const initials = target.name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase() ?? '')
    .join('')

  return (
    <div
      className="fixed inset-0 z-[70] flex items-end justify-center bg-black/50 p-0 sm:items-center sm:p-4"
      role="dialog"
      aria-modal="true"
      aria-label="Soft phone"
      onClick={() => {
        if (phase === 'ended') onClose()
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 28 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 16 }}
        transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
        className="relative flex h-[min(100dvh,740px)] w-full max-w-[390px] flex-col overflow-hidden bg-black text-white sm:h-[740px] sm:rounded-[40px]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mx-auto mt-3 h-[34px] w-[126px] shrink-0 rounded-full bg-black" />

        <div className="flex min-h-0 flex-1 flex-col px-6 pb-8 pt-4">
          <div className="flex flex-1 flex-col items-center justify-center text-center">
            <div className="mb-5 flex h-[88px] w-[88px] items-center justify-center rounded-full bg-[#1C1C1E]">
              {phase === 'ended' ? (
                <Phone className="h-9 w-9 text-white/80" />
              ) : (
                <span className="font-sans text-[1.75rem] font-semibold tracking-tight text-white">
                  {initials || '?'}
                </span>
              )}
            </div>
            <h3 className="m-0 max-w-full truncate font-sans text-[1.75rem] font-normal tracking-tight text-white">
              {target.name}
            </h3>
            <p className="m-0 mt-1 font-sans text-[1rem] tabular-nums text-white/55">
              {formatDialDisplay(digits || seedDigits) || 'No number'}
            </p>
            <p className="m-0 mt-3 font-sans text-[0.9375rem] capitalize tabular-nums text-white/45">
              {statusLabel}
            </p>

            {showPad && phase !== 'ended' ? (
              <div className="mt-6 grid w-full max-w-[280px] grid-cols-3 gap-x-5 gap-y-3">
                {padKeys.map((k) => (
                  <button
                    key={k.d}
                    type="button"
                    onClick={() => setDigits((d) => (d + k.d).slice(0, 15))}
                    className="flex h-[68px] w-[68px] flex-col items-center justify-center rounded-full bg-[#1C1C1E] transition active:bg-[#2C2C2E]"
                  >
                    <span className="font-sans text-[1.65rem] font-light leading-none text-white">
                      {k.d}
                    </span>
                    {k.sub ? (
                      <span className="mt-0.5 font-sans text-[0.5625rem] font-semibold tracking-[0.12em] text-white/50">
                        {k.sub}
                      </span>
                    ) : null}
                  </button>
                ))}
              </div>
            ) : null}
          </div>

          {phase !== 'ended' ? (
            <div className="mt-auto flex items-end justify-between px-2 pb-2">
              <button
                type="button"
                onClick={() => setMuted((m) => !m)}
                className="flex w-[72px] flex-col items-center gap-2"
              >
                <span
                  className={`flex h-[64px] w-[64px] items-center justify-center rounded-full ${
                    muted ? 'bg-white text-black' : 'bg-[#1C1C1E] text-white'
                  }`}
                >
                  {muted ? <MicOff className="h-6 w-6" /> : <Mic className="h-6 w-6" />}
                </span>
                <span className="font-sans text-[0.6875rem] text-white/55">mute</span>
              </button>
              <button type="button" onClick={endCall} className="flex w-[72px] flex-col items-center gap-2">
                <span className="flex h-[64px] w-[64px] items-center justify-center rounded-full bg-[#FF3B30] text-white">
                  <PhoneOff className="h-7 w-7" />
                </span>
                <span className="font-sans text-[0.6875rem] text-white/55">end</span>
              </button>
              <button
                type="button"
                onClick={() => setShowPad((v) => !v)}
                className="flex w-[72px] flex-col items-center gap-2"
              >
                <span
                  className={`flex h-[64px] w-[64px] items-center justify-center rounded-full font-sans text-[0.8125rem] font-semibold ${
                    showPad ? 'bg-white text-black' : 'bg-[#1C1C1E] text-white'
                  }`}
                >
                  123
                </span>
                <span className="font-sans text-[0.6875rem] text-white/55">keypad</span>
              </button>
            </div>
          ) : (
            <div className="mt-auto space-y-3">
              <select
                value={disposition}
                onChange={(e) => setDisposition(e.target.value)}
                className="w-full appearance-none rounded-[12px] border-0 bg-[#1C1C1E] px-3 py-3 font-sans text-[0.875rem] text-white outline-none"
              >
                <option value="" className="text-black">
                  Disposition
                </option>
                {DISPOSITION_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value} className="text-black">
                    {o.label}
                  </option>
                ))}
              </select>
              <textarea
                value={dispNotes}
                onChange={(e) => setDispNotes(e.target.value)}
                placeholder="Notes"
                rows={2}
                className="w-full resize-none rounded-[12px] border-0 bg-[#1C1C1E] px-3 py-3 font-sans text-[0.875rem] text-white outline-none placeholder:text-white/35"
              />
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 rounded-full bg-[#1C1C1E] py-3.5 font-sans text-[0.875rem] font-semibold text-white"
                >
                  Skip
                </button>
                <button
                  type="button"
                  disabled={!disposition || saving}
                  onClick={() => void saveDisposition()}
                  className="flex-1 rounded-full bg-[#34C759] py-3.5 font-sans text-[0.875rem] font-semibold text-white disabled:opacity-40"
                >
                  {saving ? 'Saving…' : 'Save'}
                </button>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  )
}

/* ---------------------------------------------------------------------------
 * Leads — Excel-style sheet + profile modal
 * ------------------------------------------------------------------------- */

const LEAD_COLUMNS = [
  { key: 'first_name', label: 'First name' },
  { key: 'last_name', label: 'Last name' },
  { key: 'email', label: 'Email' },
  { key: 'phone', label: 'Phone' },
  { key: 'state', label: 'State' },
  { key: 'lob', label: 'Line of Business' },
] as const

function LeadProfileModal({
  app,
  onClose,
  onCall,
  onAudit,
}: {
  app: Application
  onClose: () => void
  onCall: () => void
  onAudit: (
    id: string,
    action: string,
    detail?: string,
    opts?: { silent?: boolean },
  ) => Promise<boolean>
}) {
  const detail = parseEnrollmentNotes(app.notes)
  const fullSsn = getFullSsn(app.notes)
  const [ssnRevealed, setSsnRevealed] = useState(false)

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  const fields: { label: string; value: string }[] = [
    { label: 'First name', value: app.first_name || '—' },
    { label: 'Last name', value: app.last_name || '—' },
    { label: 'Email', value: app.email || '—' },
    { label: 'Phone', value: app.phone || '—' },
    { label: 'Date of birth', value: app.date_of_birth || '—' },
    { label: 'Plan type', value: app.plan_type || '—' },
    { label: 'Status', value: app.application_status.replace(/_/g, ' ') },
    { label: 'Source', value: sourceLabel(app) },
    {
      label: 'Address',
      value:
        [app.address, app.city, app.state, app.zip].filter(Boolean).join(', ') || '—',
    },
    { label: 'Coverage start', value: detail?.household?.coverage_start || '—' },
    { label: 'Submitted', value: fmtDate(app.created_at) },
  ]

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-[#0F3D2E]/45 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="lead-profile-title"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, y: 12, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 8 }}
        transition={{ duration: 0.18 }}
        className="flex max-h-[min(90vh,720px)] w-full max-w-2xl flex-col overflow-hidden rounded-[16px] bg-[#F7F3EE] shadow-[0_24px_60px_rgba(15,61,46,0.28)]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex shrink-0 items-start justify-between gap-3 border-b border-[#0F3D2E]/10 px-4 py-3 sm:px-5">
          <div className="min-w-0">
            <p className="m-0 font-sans text-[0.625rem] font-semibold uppercase tracking-[0.14em] text-[#C9A961]">
              Lead profile
            </p>
            <h2
              id="lead-profile-title"
              className="m-0 mt-0.5 truncate font-medium text-[#0F3D2E]"
              style={{ ...displayFont, fontSize: '1.25rem' }}
            >
              {app.first_name} {app.last_name}
            </h2>
            <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
              {enrollmentBadge(app.application_status)}
              <span className="rounded-full bg-[#0F3D2E]/10 px-2 py-0.5 font-sans text-[0.625rem] font-semibold text-[#0F3D2E]">
                {lineOfBusiness(app)}
              </span>
            </div>
          </div>
          <div className="flex shrink-0 items-center gap-1.5">
            <button
              type="button"
              disabled={!app.phone}
              onClick={onCall}
              title={app.phone ? `Call ${app.phone}` : 'No phone on file'}
              className="inline-flex items-center justify-center border-0 bg-transparent p-1 text-[#0F3D2E] transition hover:text-[#245C45] disabled:opacity-40"
            >
              <Phone className="h-4 w-4" strokeWidth={2.25} />
            </button>
            <button
              type="button"
              onClick={onClose}
              className="rounded-[10px] border-0 bg-transparent px-2.5 py-1.5 font-sans text-[0.8125rem] font-semibold text-[#55655D] transition hover:bg-[#0F3D2E]/[0.06] hover:text-[#0F3D2E]"
            >
              Close
            </button>
          </div>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto px-4 py-4 sm:px-5">
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            {fields.map((f) => (
              <div
                key={f.label}
                className="rounded-[10px] border border-[#0F3D2E]/08 bg-[#E8DFD6] px-2.5 py-2"
              >
                <p className="m-0 font-sans text-[0.5625rem] font-semibold uppercase tracking-[0.08em] text-[#55655D]">
                  {f.label}
                </p>
                <p className="m-0 mt-0.5 break-words font-sans text-[0.8125rem] text-[#0F3D2E]">
                  {f.value}
                </p>
              </div>
            ))}
            <div className="rounded-[10px] border border-[#0F3D2E]/08 bg-[#E8DFD6] px-2.5 py-2">
              <div className="flex items-center justify-between gap-2">
                <p className="m-0 font-sans text-[0.5625rem] font-semibold uppercase tracking-[0.08em] text-[#55655D]">
                  SSN
                </p>
                <button
                  type="button"
                  disabled={!fullSsn || ssnRevealed}
                  onClick={() => {
                    setSsnRevealed(true)
                    void onAudit(app.id, 'ssn_revealed', 'Leads', { silent: true })
                  }}
                  className="rounded-[6px] border-0 bg-transparent px-1.5 py-0.5 font-sans text-[0.5625rem] font-semibold text-[#0F3D2E] transition hover:bg-[#0F3D2E]/[0.06] disabled:opacity-40"
                >
                  {ssnRevealed ? 'Revealed' : 'Reveal'}
                </button>
              </div>
              <p
                className={`m-0 mt-0.5 break-words font-sans text-[0.8125rem] text-[#0F3D2E] ${
                  fullSsn && !ssnRevealed ? 'select-none blur-[5px]' : ''
                }`}
              >
                {fullSsn || '—'}
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

function LeadsSpreadsheetPanel({
  applications,
  onUpdateStatus: _onUpdateStatus,
  onAudit,
}: {
  applications: Application[]
  onUpdateStatus: (id: string, status: string) => void | Promise<void>
  onAudit: (
    id: string,
    action: string,
    detail?: string,
    opts?: { silent?: boolean },
  ) => Promise<boolean>
}) {
  const [query, setQuery] = useState('')
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [callTarget, setCallTarget] = useState<SoftPhoneTarget | null>(null)
  const lastViewedId = useRef<string | null>(null)

  const leads = useMemo(() => {
    const base = applications.filter((a) => !ENROLLED_STATUSES.has(a.application_status))
    const q = query.trim().toLowerCase()
    if (!q) return base
    return base.filter((a) => {
      const hay = [
        a.first_name,
        a.last_name,
        a.email,
        a.phone,
        a.state,
        a.city,
        a.plan_type,
        a.source,
        a.application_status,
        lineOfBusiness(a),
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase()
      return hay.includes(q)
    })
  }, [applications, query])

  const selected = leads.find((a) => a.id === selectedId) ?? null

  useEffect(() => {
    if (selectedId && !leads.some((a) => a.id === selectedId)) {
      setSelectedId(null)
    }
  }, [leads, selectedId])

  useEffect(() => {
    if (!selectedId || lastViewedId.current === selectedId) return
    lastViewedId.current = selectedId
    void onAudit(selectedId, 'viewed', 'Leads', { silent: true })
  }, [selectedId, onAudit])

  const cellValue = (a: Application, key: (typeof LEAD_COLUMNS)[number]['key']) => {
    switch (key) {
      case 'first_name':
        return a.first_name || ''
      case 'last_name':
        return a.last_name || ''
      case 'email':
        return a.email || ''
      case 'phone':
        return a.phone || ''
      case 'state':
        return a.state || ''
      case 'lob':
        return lineOfBusiness(a)
      default:
        return ''
    }
  }

  const startCall = (app: Application) => {
    if (!app.phone) return
    setCallTarget({
      applicationId: app.id,
      name: `${app.first_name} ${app.last_name}`.trim(),
      phone: app.phone,
      context: 'Leads',
    })
  }

  return (
    <div className="flex h-full min-h-0 flex-col overflow-hidden bg-[#F7F3EE]">
      <div className="flex shrink-0 flex-wrap items-center justify-between gap-2 border-b border-[#0F3D2E]/10 px-3 py-2 sm:px-4">
        <div>
          <p className="m-0 font-sans text-[0.625rem] font-semibold uppercase tracking-[0.14em] text-[#C9A961]">
            Pipeline
          </p>
          <h2 className="m-0 mt-0.5 font-medium text-[#0F3D2E]" style={{ ...displayFont, fontSize: '1.15rem' }}>
            Leads
          </h2>
        </div>
        <div className="flex items-center gap-2">
          <span className="font-sans text-[0.6875rem] text-[#55655D]">
            {leads.length} row{leads.length === 1 ? '' : 's'}
          </span>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Filter sheet…"
            className="w-44 rounded-[8px] border border-[#0F3D2E]/15 bg-[#E8DFD6] px-2.5 py-1.5 font-sans text-[0.75rem] text-[#0F3D2E] outline-none focus:border-[#0F3D2E] sm:w-56"
          />
        </div>
      </div>

      <div className="min-h-0 flex-1 p-2 sm:p-3">
        <div className="flex h-full min-h-0 flex-col overflow-hidden rounded-[4px] border border-[#A8B5AE] bg-[#FAFCFB] shadow-[inset_0_1px_0_rgba(255,255,255,0.6)]">
          <div className="flex shrink-0 items-center gap-2 border-b border-[#A8B5AE] bg-[#0F3D2E] px-2 py-1.5">
            <span className="rounded-[2px] bg-[#E8DFD6] px-1.5 py-0.5 font-sans text-[0.625rem] font-bold text-[#0F3D2E]">
              Workbook
            </span>
          </div>
          <div className="min-h-0 flex-1 overflow-auto">
            <table className="w-max min-w-full border-collapse font-sans text-[0.75rem]">
              <thead className="sticky top-0 z-10">
                <tr>
                  <th className="sticky left-0 z-20 w-10 border border-[#A8B5AE] bg-[#D8E0DB] px-1 py-1 text-center font-semibold text-[#55655D]">
                    #
                  </th>
                  {LEAD_COLUMNS.map((col) => (
                    <th
                      key={col.key}
                      className="min-w-[7.5rem] border border-[#A8B5AE] bg-[#D8E0DB] px-2 py-1 text-left font-semibold text-[#0F3D2E]"
                    >
                      {col.label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {leads.length === 0 ? (
                  <tr>
                    <td
                      colSpan={LEAD_COLUMNS.length + 1}
                      className="border border-[#A8B5AE] px-3 py-8 text-center text-[#55655D]"
                    >
                      No leads in the pipeline.
                    </td>
                  </tr>
                ) : (
                  leads.map((a, i) => {
                    const isSelected = selectedId === a.id
                    return (
                      <tr
                        key={a.id}
                        onClick={() => setSelectedId(a.id)}
                        className={`cursor-pointer ${
                          isSelected
                            ? 'bg-[#C9E4D0]'
                            : i % 2 === 0
                              ? 'bg-[#FAFCFB] hover:bg-[#EEF4F0]'
                              : 'bg-[#F3F6F4] hover:bg-[#EEF4F0]'
                        }`}
                      >
                        <td className="sticky left-0 z-[1] border border-[#A8B5AE] bg-inherit px-1 py-1 text-center font-semibold text-[#55655D]">
                          {i + 1}
                        </td>
                        {LEAD_COLUMNS.map((col) => (
                          <td
                            key={col.key}
                            className="max-w-[14rem] truncate border border-[#A8B5AE] px-2 py-1 text-[#0F3D2E]"
                            title={cellValue(a, col.key)}
                          >
                            {cellValue(a, col.key) || '—'}
                          </td>
                        ))}
                      </tr>
                    )
                  })
                )}
              </tbody>
            </table>
          </div>
          <div className="flex shrink-0 items-center justify-between border-t border-[#A8B5AE] bg-[#E8EFEA] px-2 py-1 font-sans text-[0.625rem] text-[#55655D]">
            <span>Ready</span>
            <span>Select a row to open profile</span>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {selected && !callTarget ? (
          <LeadProfileModal
            key={selected.id}
            app={selected}
            onClose={() => setSelectedId(null)}
            onCall={() => startCall(selected)}
            onAudit={onAudit}
          />
        ) : null}
      </AnimatePresence>

      <AnimatePresence>
        {callTarget ? (
          <SoftPhoneDialer
            key={callTarget.applicationId}
            target={callTarget}
            onClose={() => setCallTarget(null)}
            onComplete={async (payload) => {
              await onAudit(
                callTarget.applicationId,
                'call_disposition',
                `${payload.dispositionGroup}: ${payload.dispositionLabel}${
                  payload.notes ? ` · ${payload.notes}` : ''
                } · ${payload.durationSec}s`,
                { silent: true },
              )
            }}
          />
        ) : null}
      </AnimatePresence>
    </div>
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
  return <OfficeCalendar applications={applications} careers={careers} />
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
    <div className="flex h-full min-h-0 flex-col overflow-hidden bg-[#F7F3EE]">
      <div className="flex shrink-0 flex-wrap items-center justify-between gap-2 border-b border-[#0F3D2E]/10 bg-[#F7F3EE] px-3 py-2.5 sm:px-4">
        <div>
          <p className="m-0 font-sans text-[0.625rem] font-semibold uppercase tracking-[0.14em] text-[#C9A961]">
            Calendar
          </p>
          <h2 className="m-0 mt-0.5 font-medium text-[#0F3D2E]" style={{ ...displayFont, fontSize: '1.15rem' }}>
            {monthNames[month]} {year}
          </h2>
        </div>
      </div>

      <div className="grid min-h-0 flex-1 grid-cols-1 bg-[#F7F3EE] lg:grid-cols-[minmax(0,1.45fr)_minmax(200px,0.7fr)]">
        <div className="flex min-h-0 flex-col bg-[#F7F3EE] p-2 sm:p-3">
          <div className="mb-1 grid shrink-0 grid-cols-7 gap-0.5">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d) => (
              <div
                key={d}
                className="py-0.5 text-center font-sans text-[0.625rem] font-semibold uppercase tracking-[0.06em] text-[#55655D]"
              >
                {d}
              </div>
            ))}
          </div>
          <div className="grid min-h-0 flex-1 grid-cols-7 grid-rows-6 gap-0.5">
            {cells.map((day, i) => {
              if (day == null) {
                return <div key={`e-${i}`} className="min-h-0" />
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
                  className={`relative flex min-h-0 flex-col items-center justify-start rounded-[8px] border-0 pt-1 font-sans text-[0.75rem] shadow-none outline-none transition ${
                    isSelected
                      ? 'bg-[#0F3D2E] font-semibold text-[#FAFCFB]'
                      : isToday
                        ? 'bg-[#E0D6CA] font-semibold text-[#0F3D2E]'
                        : 'bg-[#E8DFD6] text-[#0F3D2E] hover:bg-[#E0D6CA]'
                  }`}
                >
                  <span>{day}</span>
                  {ev && (ev.apps > 0 || ev.careers > 0) ? (
                    <span className="mt-auto mb-1 flex gap-0.5">
                      {ev.apps > 0 ? (
                        <span
                          className={`h-1 w-1 rounded-full ${isSelected ? 'bg-[#C9A961]' : 'bg-[#0F3D2E]'}`}
                        />
                      ) : null}
                      {ev.careers > 0 ? (
                        <span
                          className={`h-1 w-1 rounded-full ${isSelected ? 'bg-[#E8DFD6]' : 'bg-[#C9A961]'}`}
                        />
                      ) : null}
                    </span>
                  ) : null}
                </button>
              )
            })}
          </div>
        </div>

        <aside className="flex min-h-0 flex-col border-t border-[#0F3D2E]/10 bg-[#F7F3EE] p-3 lg:border-l lg:border-t-0">
          <p className="m-0 font-sans text-[0.625rem] font-semibold uppercase tracking-[0.14em] text-[#C9A961]">
            Day detail
          </p>
          <p className="m-0 mt-1 font-sans text-[0.8125rem] font-semibold text-[#0F3D2E]">
            {selectedLabel ?? 'Select a day'}
          </p>
          <div className="mt-3 space-y-2">
            <div className="rounded-[10px] border border-[#0F3D2E]/08 bg-[#FAFCFB] px-3 py-2">
              <p className="m-0 font-sans text-[0.625rem] font-semibold uppercase tracking-[0.1em] text-[#55655D]">
                Client applications
              </p>
              <p className="m-0 mt-0.5 font-sans text-[1.35rem] font-semibold leading-none text-[#0F3D2E]">
                {selectedEvents?.apps ?? 0}
              </p>
            </div>
            <div className="rounded-[10px] border border-[#0F3D2E]/08 bg-[#FAFCFB] px-3 py-2">
              <p className="m-0 font-sans text-[0.625rem] font-semibold uppercase tracking-[0.1em] text-[#55655D]">
                Career applications
              </p>
              <p className="m-0 mt-0.5 font-sans text-[1.35rem] font-semibold leading-none text-[#0F3D2E]">
                {selectedEvents?.careers ?? 0}
              </p>
            </div>
          </div>
          <div className="mt-auto flex flex-wrap gap-3 pt-3 font-sans text-[0.625rem] text-[#55655D]">
            <span className="inline-flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-[#0F3D2E]" /> Clients
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-[#C9A961]" /> Careers
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
  onQuery,
  onFolder,
  onSelect,
  onUpdateStatus,
  onAudit,
}: {
  folder: FileFolderId
  counts: Record<FileFolderId, number>
  rows: Application[]
  selected: Application | null
  query: string
  onQuery: (q: string) => void
  onFolder: (id: FileFolderId) => void
  onSelect: (id: string) => void
  onUpdateStatus: (id: string, status: string) => void | Promise<void>
  onAudit: (
    id: string,
    action: string,
    detail?: string,
    opts?: { silent?: boolean },
  ) => Promise<boolean>
}) {
  const folders: { id: FileFolderId; name: string; path: string }[] = [
    { id: 'all', name: 'All Applications', path: '/Applications' },
    { id: 'aca', name: 'ACA · Marketplace', path: '/Applications/ACA' },
    { id: 'medicare', name: 'Medicare.Reviews', path: '/Applications/Medicare.Reviews' },
    { id: 'enrolled', name: 'Enrolled Members', path: '/Applications/Enrolled' },
    { id: 'other', name: 'Other / Untagged', path: '/Applications/Other' },
  ]

  const activePath = folders.find((f) => f.id === folder)?.path ?? '/Applications'

  return (
    <div className="flex h-full min-h-0 flex-col overflow-hidden bg-[#F7F3EE]">
      <div className="flex shrink-0 flex-wrap items-center justify-between gap-2 border-b border-[#0F3D2E]/10 bg-[linear-gradient(135deg,#F7F3EE_0%,#EFE8DF_100%)] px-3 py-2">
        <div className="mr-1 min-w-0 shrink-0">
          <p className="m-0 font-sans text-[0.5625rem] font-semibold uppercase tracking-[0.14em] text-[#C9A961]">
            Applications
          </p>
          <p className="m-0 truncate font-mono text-[0.625rem] text-[#0F3D2E]">{activePath}</p>
        </div>
        <input
          value={query}
          onChange={(e) => onQuery(e.target.value)}
          placeholder="Search name, email, state, source…"
          className="w-full max-w-xs rounded-[12px] border border-[#0F3D2E]/15 bg-[#E8DFD6] px-3 py-2 font-sans text-[0.8125rem] text-[#0F3D2E] outline-none focus:border-[#0F3D2E] sm:w-56"
        />
      </div>

      <div className="grid min-h-0 flex-1 grid-cols-1 lg:grid-cols-[200px_minmax(0,1fr)_minmax(0,1.1fr)]">
        {/* Folder tree */}
        <aside className="min-h-0 overflow-y-auto border-b border-[#0F3D2E]/10 bg-[#F7F3EE] p-2 lg:border-b-0 lg:border-r-0">
          <p className="mb-1.5 px-2 font-sans text-[0.625rem] font-semibold uppercase tracking-[0.12em] text-[#55655D]">
            Folders
          </p>
          <div className="space-y-1">
            {folders.map((f) => (
              <button
                key={f.id}
                type="button"
                onClick={() => onFolder(f.id)}
                className={`flex w-full items-center justify-between rounded-[12px] border-0 px-3 py-2.5 text-left font-sans text-[0.8125rem] shadow-none outline-none transition ${
                  folder === f.id
                    ? 'bg-[#0F3D2E] font-semibold text-[#E8DFD6]'
                    : 'bg-transparent font-medium text-[#0F3D2E] hover:bg-[#E8DFD6]'
                }`}
              >
                <span className="truncate">{f.name}</span>
                <span
                  className={`ml-2 rounded-full px-2 py-0.5 text-[0.6875rem] ${
                    folder === f.id ? 'bg-[#C9A961] text-[#0F3D2E]' : 'bg-[#0F3D2E]/10 text-[#55655D]'
                  }`}
                >
                  {counts[f.id]}
                </span>
              </button>
            ))}
          </div>
        </aside>

        {/* File list */}
        <section className="min-h-0 overflow-hidden border-b border-[#0F3D2E]/08 lg:border-b-0 lg:border-r-0">
          {rows.length === 0 ? (
            <div className="flex h-full items-center justify-center p-4">
              <p className="m-0 text-center font-sans text-[0.8125rem] text-[#55655D]">
                {folder === 'medicare'
                  ? 'No Medicare.Reviews applications yet. They appear here when medicare.reviews POSTs to /api/enrollment/medicare with source tagging.'
                  : 'This folder is empty.'}
              </p>
            </div>
          ) : (
            <ul className="h-full space-y-2 overflow-y-auto p-2">
              {rows.map((a) => {
                const active = selected?.id === a.id
                return (
                  <li key={a.id}>
                    <button
                      type="button"
                      onClick={() => onSelect(a.id)}
                      className={`flex w-full items-start gap-2.5 rounded-[14px] border-0 px-3 py-2.5 text-left shadow-none outline-none transition ${
                        active
                          ? 'bg-[#C9B396]'
                          : 'bg-[#E8DFD6] hover:bg-[#E0D6CA]'
                      }`}
                    >
                      <span className="mt-0.5 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-[8px] bg-[#0F3D2E]/10 font-sans text-[0.625rem] font-bold text-[#0F3D2E]">
                        {isMedicareApplication(a) ? 'MR' : isAcaApplication(a) ? 'ACA' : 'APP'}
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="flex flex-wrap items-center gap-2">
                          <span className="font-sans text-[0.8125rem] font-semibold text-[#0F3D2E]">
                            {a.first_name} {a.last_name}
                          </span>
                          {statusBadge(a.application_status)}
                        </span>
                        <span className="mt-0.5 block truncate font-sans text-[0.6875rem] text-[#55655D]">
                          {sourceLabel(a)}
                          {a.plan_type ? ` · ${a.plan_type}` : ''}
                          {a.state ? ` · ${a.state}` : ''}
                        </span>
                        <span className="mt-0.5 block font-sans text-[0.625rem] text-[#55655D]/80">
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
        <section className="min-h-0 overflow-y-auto bg-[#F7F3EE] p-3 sm:p-4">
          {!selected ? (
            <div className="flex h-full items-center justify-center">
              <p className="m-0 font-sans text-[0.8125rem] text-[#55655D]">
                Select a file to inspect the application record.
              </p>
            </div>
          ) : (
            <ApplicationDetail
              app={selected}
              onUpdateStatus={onUpdateStatus}
              onAudit={onAudit}
            />
          )}
        </section>
      </div>
    </div>
  )
}

function ApplicationDetail({
  app,
  onUpdateStatus,
  onAudit,
}: {
  app: Application
  onUpdateStatus: (id: string, status: string) => void | Promise<void>
  onAudit: (
    id: string,
    action: string,
    detail?: string,
    opts?: { silent?: boolean },
  ) => Promise<boolean>
}) {
  const detail = parseEnrollmentNotes(app.notes)
  const fullSsn = getFullSsn(app.notes)
  const [ssnRevealed, setSsnRevealed] = useState(false)
  const lastViewedId = useRef<string | null>(null)

  useEffect(() => {
    setSsnRevealed(false)
  }, [app.id])

  useEffect(() => {
    if (lastViewedId.current === app.id) return
    lastViewedId.current = app.id
    void onAudit(app.id, 'viewed', 'Applications', { silent: true })
  }, [app.id, onAudit])

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
          <div className="mt-2 flex flex-wrap gap-1.5">
            {enrollmentBadge(app.application_status)}
          </div>
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
          { label: 'Agent of Record', value: getAgentOfRecord(app.notes) || '—' },
          { label: 'Application ID', value: app.id },
        ].map((row) => (
          <div key={row.label} className="rounded-[12px] bg-[#E8DFD6] px-3 py-2.5">
            <p className="m-0 font-sans text-[0.6875rem] font-semibold uppercase tracking-[0.1em] text-[#55655D]">
              {row.label}
            </p>
            <p className="m-0 mt-1 break-words font-sans text-[0.875rem] text-[#0F3D2E]">
              {row.value}
            </p>
          </div>
        ))}
        <div className="rounded-[12px] bg-[#E8DFD6] px-3 py-2.5">
          <div className="flex items-center justify-between gap-2">
            <p className="m-0 font-sans text-[0.6875rem] font-semibold uppercase tracking-[0.1em] text-[#55655D]">
              SSN
            </p>
            <button
              type="button"
              disabled={!fullSsn || ssnRevealed}
              onClick={() => {
                setSsnRevealed(true)
                void onAudit(app.id, 'ssn_revealed', 'Applications', { silent: true })
              }}
              className="rounded-[6px] border-0 bg-transparent px-1.5 py-0.5 font-sans text-[0.625rem] font-semibold text-[#0F3D2E] transition hover:bg-[#0F3D2E]/[0.08] disabled:opacity-40"
            >
              {ssnRevealed ? 'Revealed' : 'Reveal'}
            </button>
          </div>
          <p
            className={`m-0 mt-1 break-words font-sans text-[0.875rem] text-[#0F3D2E] ${
              fullSsn && !ssnRevealed ? 'select-none blur-[5px]' : ''
            }`}
          >
            {fullSsn || '—'}
          </p>
        </div>
      </div>

      {detail ? (
        <div className="mt-5 rounded-[14px] border border-[#0F3D2E]/08 bg-[#E8DFD6] p-4">
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

      {getMicroLedger(app.notes).length > 0 ? (
        <div className="mt-4 rounded-[12px] border border-[#0F3D2E]/08 bg-[#FAFCFB] px-3 py-2.5">
          <p className="m-0 font-sans text-[0.5625rem] font-semibold uppercase tracking-[0.1em] text-[#55655D]">
            Micro ledger
          </p>
          <ul className="m-0 mt-1.5 max-h-32 list-none space-y-0.5 overflow-y-auto p-0">
            {getMicroLedger(app.notes)
              .slice(0, 40)
              .map((e, i) => (
                <li
                  key={`${e.at}-${e.action}-${i}`}
                  className="font-sans text-[0.5625rem] leading-snug text-[#55655D]"
                >
                  {fmtShort(e.at)} · {e.action.replace(/_/g, ' ').toLowerCase()}
                  {e.actor ? ` · ${e.actor}` : ''}
                  {e.detail ? ` · ${e.detail}` : ''}
                </li>
              ))}
          </ul>
        </div>
      ) : null}

      <div className="mt-5 rounded-[14px] border border-dashed border-[#0F3D2E]/15 bg-[#E8DFD6] px-4 py-5 text-center">
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
  careers,
  listings,
  hiringStats,
  onUpdateCareer,
  onListingsChange,
  onFlash,
}: {
  careers: Career[]
  listings: CareerListingRow[]
  hiringStats: Record<string, number>
  onUpdateCareer: (id: string, status: string) => void | Promise<void>
  onListingsChange: (rows: CareerListingRow[]) => void
  onFlash: (msg: string | null) => void
}) {
  const [view, setView] = useState<WorkforceView>('directory')
  const [profileQuery, setProfileQuery] = useState('')

  const profiles = useMemo(() => {
    const q = profileQuery.trim().toLowerCase()
    if (!q) return careers
    return careers.filter((c) => {
      const hay = [
        c.first_name,
        c.last_name,
        c.email,
        c.phone,
        c.position,
        c.location,
        c.status,
        c.work_authorization,
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase()
      return hay.includes(q)
    })
  }, [careers, profileQuery])

  return (
    <div className="space-y-4">
      <div className={cardClass}>
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="m-0 font-sans text-[0.6875rem] font-semibold uppercase tracking-[0.14em] text-[#C9A961]">
              Workforce
            </p>
            <h2 className="m-0 mt-1 font-medium text-[#0F3D2E]" style={{ ...displayFont, fontSize: '1.35rem' }}>
              Hiring pulse
            </h2>
          </div>
          <input
            value={profileQuery}
            onChange={(e) => {
              setProfileQuery(e.target.value)
              setView('directory')
            }}
            placeholder="Search employee profiles…"
            className="w-full max-w-sm rounded-[12px] border border-[#0F3D2E]/15 bg-[#F7F3EE] px-3 py-2 font-sans text-[0.8125rem] text-[#0F3D2E] outline-none focus:border-[#0F3D2E] sm:w-72"
          />
        </div>

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
            Application stages
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

      <div className="flex flex-wrap gap-2">
        {(
          [
            { id: 'directory' as const, label: 'Profiles' },
            { id: 'hiring' as const, label: 'Applications' },
            { id: 'job-board' as const, label: 'Hire' },
          ] as const
        ).map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setView(t.id)}
            className={`rounded-full px-4 py-2 font-sans text-[0.8125rem] font-semibold transition ${
              view === t.id
                ? 'bg-[#0F3D2E] text-white'
                : 'bg-[#E8DFD6] text-[#0F3D2E] hover:bg-[#E0D6CA]'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {view === 'directory' && (
        <div className="space-y-3">
          {profiles.length === 0 ? (
            <div className={cardClass}>
              <p className="m-0 font-sans text-[0.875rem] text-[#55655D]">
                {profileQuery.trim()
                  ? 'No employee profiles match that search.'
                  : 'No employee profiles yet. Career applications appear here as people apply.'}
              </p>
            </div>
          ) : (
            profiles.map((c) => (
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
                  </div>
                  <select
                    value={c.status}
                    onChange={(e) => void onUpdateCareer(c.id, e.target.value)}
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
            ))
          )}
        </div>
      )}

      {view === 'hiring' && <CareersTable rows={careers} onUpdateStatus={onUpdateCareer} />}
      {view === 'job-board' && (
        <JobBoardEditor rows={listings} onChange={onListingsChange} onFlash={onFlash} />
      )}
    </div>
  )
}

function SalesMarketingPanel({
  sales,
  counts,
  acaCount,
  medicareCount,
  enrolledCount,
}: {
  sales: {
    bySource: Record<string, number>
    byStatus: Record<string, number>
    byState: Record<string, number>
    last7: number
    conversion: number
    enrolled: number
  }
  counts: Record<FileFolderId, number>
  acaCount: number
  medicareCount: number
  enrolledCount: number
}) {
  const topStates = Object.entries(sales.byState)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8)
  const total = Object.values(sales.bySource).reduce((a, b) => a + b, 0)

  const miniStats = [
    { label: 'All', value: counts.all, sub: `${sales.last7} / 7d` },
    { label: 'ACA', value: acaCount, sub: 'Marketplace' },
    { label: 'Medicare', value: medicareCount, sub: 'Reviews' },
    { label: 'Active', value: enrolledCount, sub: `${sales.conversion}%` },
  ]

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {miniStats.map((s) => (
          <div
            key={s.label}
            className="min-w-[5.5rem] flex-1 rounded-[12px] bg-[#E8DFD6] px-3 py-2.5 sm:flex-none"
          >
            <p className="m-0 font-sans text-[0.5625rem] font-semibold uppercase tracking-[0.08em] text-[#55655D]">
              {s.label}
            </p>
            <p className="m-0 mt-0.5 font-sans text-[1.25rem] font-semibold leading-tight text-[#0F3D2E]">
              {s.value}
            </p>
            <p className="m-0 truncate font-sans text-[0.625rem] text-[#55655D]">{s.sub}</p>
          </div>
        ))}
      </div>

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
              Hire editor
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
