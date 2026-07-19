'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Settings,
  RefreshCw,
  LogOut,
  SlidersHorizontal,
  Phone,
  PhoneOff,
  Mic,
  MicOff,
  Lock,
  LockOpen,
  Plus,
  StickyNote,
  Mail,
  Eye,
  EyeOff,
} from 'lucide-react'
import {
  AcaEnrollmentFlagsPanel,
  AcaStateLicensingPanel,
} from '@/components/admin/aca-flags-panels'
import {
  ConversationViewModal,
} from '@/components/admin/application-conversations'
import { MailboxPanel } from '@/components/admin/mailbox-panel'
import { IntelligenceDashboard } from '@/components/admin/intelligence-dashboard'
import { WorkforceDashboard } from '@/components/admin/workforce-dashboard'
import { ContractingPanel } from '@/components/admin/contracting-panel'
import { createClient } from '@/lib/supabase/client'

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

type WorkspaceId =
  | 'overview'
  | 'clients'
  | 'leads'
  | 'files'
  | 'mailbox'
  | 'employees'
  | 'intelligence'
  | 'operations'
  | 'ledger'
type FileFolderId = 'all' | 'aca' | 'medicare' | 'enrolled' | 'other'
type WorkforceView = 'command' | 'directory' | 'hiring' | 'job-board' | 'contracting'

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
  { id: 'mailbox', label: 'Mailbox' },
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

function planTypeCategory(
  a: Application,
): 'ACA' | 'Medicare Advantage' | 'Medicare Supplement' | null {
  const plan = (a.plan_type || '').toLowerCase()
  const source = (a.source || '').toLowerCase()
  if (/supplement|medigap/.test(plan)) return 'Medicare Supplement'
  if (/advantage/.test(plan) || source === 'medicare.reviews') return 'Medicare Advantage'
  if (/medicare/.test(plan) && !/supplement|medigap/.test(plan)) return 'Medicare Advantage'
  if (/aca|marketplace|individual\s*&\s*family/.test(plan)) return 'ACA'
  if (source === 'enrollment' || /aca/.test(source)) return 'ACA'
  if (isAcaApplication(a)) return 'ACA'
  if (isMedicareApplication(a)) return 'Medicare Advantage'
  return null
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
        mbi?: string
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
      policy_id?: string
      coverage_start?: string
      plan_type?: string
      ssn_masked?: string
      plan_details?: {
        plan_name?: string
        carrier?: string
        plan_id?: string
        contract_id?: string
        pbp?: string
        premium?: string
        deductible?: string
        coverage_start?: string
        coverage_end?: string
        network?: string
        metal_tier?: string
        group_number?: string
        rx_bin?: string
        notes?: string
      }
      preferred_id?: 'ssn' | 'mbi'
      mailing?: {
        address?: string
        city?: string
        state?: string
        zip?: string
      }
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
  return getLastSpokenAgent(notes) || getStoredAgentId(notes)
}

function getStoredAgentId(notes: string | null | undefined) {
  const parsed = parseEnrollmentNotes(notes)
  return parsed?.agent_id || parsed?.producer_id || parsed?.marketing_id || ''
}

function getLeadId(notes: string | null | undefined) {
  const parsed = parseEnrollmentNotes(notes)
  return parsed?.lead_id || ''
}

function withLeadId(existing: string | null | undefined, leadId: string) {
  const parsed = ensureNotesObject(existing)
  const trimmed = leadId.trim()
  if (!trimmed) {
    delete parsed.lead_id
  } else {
    parsed.lead_id = trimmed
  }
  return JSON.stringify(parsed)
}

const NO_PICKUP_DISPOSITION_LABELS = [
  'no answer',
  'left voicemail',
  'disconnected / wrong number',
  'disconnected',
  'wrong number',
]

function wasClientPickupCall(detail?: string) {
  if (!detail) return false
  const labelMatch = detail.match(/^Disposition:\s*([^·]+)/i)
  const label = (labelMatch?.[1] || detail).trim().toLowerCase()
  return !NO_PICKUP_DISPOSITION_LABELS.some(
    (blocked) => label === blocked || label.startsWith(blocked),
  )
}

function getLastSpokenAgent(notes: string | null | undefined) {
  for (const entry of getMicroLedger(notes)) {
    if (entry.action !== 'call_disposition') continue
    if (!wasClientPickupCall(entry.detail)) continue
    if (!entry.actor?.trim()) continue
    return entry.actor.trim()
  }
  return ''
}

function formatAgentDisplay(actor: string) {
  const trimmed = actor.trim()
  if (!trimmed) return ''
  if (trimmed.includes('@')) return trimmed.split('@')[0] || trimmed
  return trimmed
}

function getPolicyId(notes: string | null | undefined) {
  const parsed = parseEnrollmentNotes(notes)
  return parsed?.policy_id || ''
}

function withPolicyId(existing: string | null | undefined, policyId: string) {
  const parsed = ensureNotesObject(existing)
  const trimmed = policyId.trim()
  if (!trimmed) {
    delete parsed.policy_id
  } else {
    parsed.policy_id = trimmed
  }
  return JSON.stringify(parsed)
}

function withFullSsn(existing: string | null | undefined, ssn: string) {
  const parsed = ensureNotesObject(existing)
  const digits = ssn.replace(/\D/g, '')
  const applicant =
    parsed.applicant && typeof parsed.applicant === 'object'
      ? { ...(parsed.applicant as Record<string, unknown>) }
      : {}
  if (!digits) {
    delete applicant.ssn
    delete applicant.ssn_last4
  } else if (digits.length === 9) {
    applicant.ssn = formatSsnDigits(digits)
    applicant.ssn_last4 = digits.slice(-4)
  } else {
    return JSON.stringify(parsed)
  }
  if (Object.keys(applicant).length === 0) {
    delete parsed.applicant
  } else {
    parsed.applicant = applicant
  }
  return JSON.stringify(parsed)
}

function getMbi(notes: string | null | undefined) {
  const parsed = parseEnrollmentNotes(notes)
  return parsed?.applicant?.mbi || ''
}

function withMbi(existing: string | null | undefined, mbi: string) {
  const parsed = ensureNotesObject(existing)
  const trimmed = mbi.replace(/[^a-zA-Z0-9]/g, '').toUpperCase().slice(0, 11)
  const applicant =
    parsed.applicant && typeof parsed.applicant === 'object'
      ? { ...(parsed.applicant as Record<string, unknown>) }
      : {}
  if (!trimmed) {
    delete applicant.mbi
  } else {
    applicant.mbi = formatMbiInput(trimmed)
  }
  if (Object.keys(applicant).length === 0) {
    delete parsed.applicant
  } else {
    parsed.applicant = applicant
  }
  return JSON.stringify(parsed)
}

function getPreferredId(notes: string | null | undefined): 'ssn' | 'mbi' {
  const parsed = parseEnrollmentNotes(notes)
  if (parsed?.preferred_id === 'mbi' || parsed?.preferred_id === 'ssn') {
    return parsed.preferred_id
  }
  if (getMbi(notes) && !getFullSsn(notes)) return 'mbi'
  return 'ssn'
}

function withPreferredId(existing: string | null | undefined, preferred: 'ssn' | 'mbi') {
  const parsed = ensureNotesObject(existing)
  parsed.preferred_id = preferred
  return JSON.stringify(parsed)
}

type MailingAddress = {
  address: string
  city: string
  state: string
  zip: string
}

function getMailingAddress(notes: string | null | undefined): MailingAddress {
  const parsed = parseEnrollmentNotes(notes)
  return {
    address: parsed?.mailing?.address || '',
    city: parsed?.mailing?.city || '',
    state: parsed?.mailing?.state || '',
    zip: parsed?.mailing?.zip || '',
  }
}

function withMailingAddress(existing: string | null | undefined, mailing: MailingAddress) {
  const parsed = ensureNotesObject(existing)
  const next = {
    address: mailing.address.trim(),
    city: mailing.city.trim(),
    state: mailing.state.trim().toUpperCase(),
    zip: mailing.zip.trim(),
  }
  if (!next.address && !next.city && !next.state && !next.zip) {
    delete parsed.mailing
  } else {
    parsed.mailing = next
  }
  return JSON.stringify(parsed)
}

function formatCombinedAddress(app: Pick<Application, 'address' | 'city' | 'state' | 'zip'>) {
  return [app.address, app.city, app.state, app.zip].filter(Boolean).join(', ')
}

function parseCombinedAddress(
  line: string,
  previous: Pick<Application, 'address' | 'city' | 'state' | 'zip'>,
) {
  const parts = line
    .split(',')
    .map((p) => p.trim())
    .filter(Boolean)
  if (parts.length >= 4) {
    return {
      address: parts.slice(0, -3).join(', ') || null,
      city: parts[parts.length - 3] || null,
      state: parts[parts.length - 2]?.toUpperCase() || null,
      zip: parts[parts.length - 1] || null,
    }
  }
  if (parts.length === 3) {
    const last = parts[2]
    const m = last.match(/^([A-Za-z]{2})\s+(\d{5}(?:-\d{4})?)$/)
    if (m) {
      return {
        address: parts[0] || null,
        city: parts[1] || null,
        state: m[1].toUpperCase(),
        zip: m[2],
      }
    }
    return {
      address: parts[0] || null,
      city: parts[1] || null,
      state: last.toUpperCase().slice(0, 2) || null,
      zip: previous.zip,
    }
  }
  return {
    address: line.trim() || null,
    city: previous.city,
    state: previous.state,
    zip: previous.zip,
  }
}

type DirectoryFieldDraft = {
  first_name: string
  last_name: string
  email: string
  phone: string
  date_of_birth: string
  plan_type: string
  address: string
  city: string
  state: string
  zip: string
  lead_id: string
  policy_id: string
  ssn: string
  mbi: string
  preferred_id: 'ssn' | 'mbi'
}

function directoryDraftFromApp(app: Application): DirectoryFieldDraft {
  const fullSsn = getFullSsn(app.notes)
  const ssnDigits = fullSsn.replace(/\D/g, '')
  return {
    first_name: app.first_name || '',
    last_name: app.last_name || '',
    email: app.email || '',
    phone: formatPhoneInput(app.phone || ''),
    date_of_birth: formatDobDisplay(app.date_of_birth),
    plan_type: app.plan_type || '',
    address: app.address || '',
    city: app.city || '',
    state: formatStateInput(app.state || ''),
    zip: formatZipInput(app.zip || ''),
    lead_id: getLeadId(app.notes),
    policy_id: getPolicyId(app.notes),
    ssn: ssnDigits.length === 9 ? formatSsnDigits(ssnDigits) : fullSsn.includes('*') ? fullSsn : formatSsnInput(fullSsn),
    mbi: formatMbiInput(getMbi(app.notes)),
    preferred_id: getPreferredId(app.notes),
  }
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
  return (phone || '').replace(/\D/g, '').slice(0, 10)
}

function formatPhoneInput(value: string) {
  const d = normalizePhone(value)
  if (d.length === 0) return ''
  if (d.length <= 3) return `(${d}`
  if (d.length <= 6) return `(${d.slice(0, 3)}) ${d.slice(3)}`
  return `(${d.slice(0, 3)}) ${d.slice(3, 6)}-${d.slice(6)}`
}

function formatSsnInput(value: string) {
  const d = value.replace(/\D/g, '').slice(0, 9)
  if (d.length <= 3) return d
  if (d.length <= 5) return `${d.slice(0, 3)}-${d.slice(3)}`
  return `${d.slice(0, 3)}-${d.slice(3, 5)}-${d.slice(5)}`
}

function formatMbiInput(value: string) {
  const clean = value.replace(/[^a-zA-Z0-9]/g, '').toUpperCase().slice(0, 11)
  if (clean.length <= 4) return clean
  if (clean.length <= 7) return `${clean.slice(0, 4)}-${clean.slice(4)}`
  return `${clean.slice(0, 4)}-${clean.slice(4, 7)}-${clean.slice(7)}`
}

function parseDobParts(value: string | null | undefined): { month: string; day: string; year: string } {
  const raw = (value || '').trim()
  let m = raw.match(/^(\d{4})-(\d{1,2})-(\d{1,2})/)
  if (m) {
    return {
      year: m[1],
      month: m[2].padStart(2, '0'),
      day: m[3].padStart(2, '0'),
    }
  }
  m = raw.match(/^(\d{1,2})[\/\-.](\d{1,2})[\/\-.](\d{4})/)
  if (m) {
    return {
      month: m[1].padStart(2, '0'),
      day: m[2].padStart(2, '0'),
      year: m[3],
    }
  }
  return { month: '', day: '', year: '' }
}

function joinDobParts(month: string, day: string, year: string) {
  if (!month || !day || !year || year.length !== 4) return ''
  return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`
}

function formatDobInput(value: string) {
  const d = value.replace(/\D/g, '').slice(0, 8)
  if (d.length <= 2) return d
  if (d.length <= 4) return `${d.slice(0, 2)}/${d.slice(2)}`
  return `${d.slice(0, 2)}/${d.slice(2, 4)}/${d.slice(4)}`
}

function formatDobDisplay(value: string | null | undefined) {
  const parts = parseDobParts(value)
  if (parts.month && parts.day && parts.year) {
    return `${parts.month}/${parts.day}/${parts.year}`
  }
  if (!value) return ''
  if (/^\d{4}-\d{2}-\d{2}/.test(value)) return ''
  return formatDobInput(value)
}

function dobToStorage(display: string) {
  const parts = parseDobParts(display)
  return joinDobParts(parts.month, parts.day, parts.year)
}

type PlanDetails = {
  plan_name: string
  carrier: string
  plan_id: string
  contract_id: string
  pbp: string
  premium: string
  deductible: string
  coverage_start: string
  coverage_end: string
  network: string
  metal_tier: string
  group_number: string
  rx_bin: string
  notes: string
}

function emptyPlanDetails(): PlanDetails {
  return {
    plan_name: '',
    carrier: '',
    plan_id: '',
    contract_id: '',
    pbp: '',
    premium: '',
    deductible: '',
    coverage_start: '',
    coverage_end: '',
    network: '',
    metal_tier: '',
    group_number: '',
    rx_bin: '',
    notes: '',
  }
}

function getPlanDetails(notes: string | null | undefined, planType?: string | null): PlanDetails {
  const parsed = parseEnrollmentNotes(notes)
  const raw = parsed?.plan_details
  const base = emptyPlanDetails()
  if (!raw || typeof raw !== 'object') {
    return { ...base, plan_name: planType || '' }
  }
  return {
    plan_name: raw.plan_name || planType || '',
    carrier: raw.carrier || '',
    plan_id: raw.plan_id || '',
    contract_id: raw.contract_id || '',
    pbp: raw.pbp || '',
    premium: raw.premium || '',
    deductible: raw.deductible || '',
    coverage_start: raw.coverage_start || parsed?.household?.coverage_start || parsed?.coverage_start || '',
    coverage_end: raw.coverage_end || '',
    network: raw.network || '',
    metal_tier: raw.metal_tier || '',
    group_number: raw.group_number || '',
    rx_bin: raw.rx_bin || '',
    notes: raw.notes || '',
  }
}

function withPlanDetails(existing: string | null | undefined, details: PlanDetails) {
  const parsed = ensureNotesObject(existing)
  const cleaned = Object.fromEntries(
    Object.entries(details).map(([k, v]) => [k, typeof v === 'string' ? v.trim() : v]),
  ) as PlanDetails
  const hasAny = Object.values(cleaned).some((v) => Boolean(v))
  if (!hasAny) {
    delete parsed.plan_details
  } else {
    parsed.plan_details = cleaned
  }
  if (cleaned.coverage_start) {
    const household =
      parsed.household && typeof parsed.household === 'object'
        ? { ...(parsed.household as Record<string, unknown>) }
        : {}
    household.coverage_start = cleaned.coverage_start
    parsed.household = household
  }
  return JSON.stringify(parsed)
}

function normalizeEmail(email: string | null | undefined) {
  return (email || '').trim().toLowerCase()
}

const US_STATE_CODES = new Set([
  'AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA', 'HI', 'ID', 'IL', 'IN', 'IA', 'KS',
  'KY', 'LA', 'ME', 'MD', 'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ', 'NM', 'NY',
  'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC', 'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV',
  'WI', 'WY', 'DC',
])

function isValidDirectoryEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[A-Za-z]{2,}$/.test(email.trim())
}

function formatZipInput(value: string) {
  const d = value.replace(/\D/g, '').slice(0, 9)
  if (d.length <= 5) return d
  return `${d.slice(0, 5)}-${d.slice(5)}`
}

function isValidZip(zip: string) {
  const t = zip.trim()
  if (!t) return true
  return /^\d{5}(-\d{4})?$/.test(t)
}

function formatStateInput(value: string) {
  return value.replace(/[^a-zA-Z]/g, '').toUpperCase().slice(0, 2)
}

function isValidState(state: string) {
  const t = state.trim().toUpperCase()
  if (!t) return true
  return US_STATE_CODES.has(t)
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

function enrollmentBadge(status: string, opts?: { onClick?: () => void; title?: string }) {
  const active = ENROLLED_STATUSES.has(status)
  const className = `inline-flex items-center rounded-full px-2 py-0.5 font-sans text-[0.625rem] font-semibold uppercase tracking-[0.06em] ${
    active ? 'bg-[#0F3D2E] text-[#E8DFD6]' : 'bg-[#0F3D2E]/10 text-[#55655D]'
  } ${opts?.onClick ? 'cursor-pointer transition hover:opacity-80' : ''}`
  const label = active ? 'Active' : 'Inactive'
  if (opts?.onClick) {
    return (
      <button
        type="button"
        onClick={opts.onClick}
        title={opts.title || 'View enrollment history'}
        className={`border-0 ${className}`}
      >
        {label}
      </button>
    )
  }
  return <span className={className}>{label}</span>
}

function buildEnrollmentEvents(app: Application) {
  const detail = parseEnrollmentNotes(app.notes)
  const events: { at: string; title: string; detail: string }[] = [
    {
      at: app.created_at,
      title: `Application submitted · ${app.application_status.replace(/_/g, ' ')}`,
      detail: [
        `${sourceLabel(app)}${app.plan_type ? ` · ${app.plan_type}` : ''}`,
        `Application ID ${app.id}`,
      ].join('\n'),
    },
  ]
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
}

function EnrollmentHistoryModal({
  app,
  onClose,
}: {
  app: Application
  onClose: () => void
}) {
  const detail = parseEnrollmentNotes(app.notes)
  const events = useMemo(() => buildEnrollmentEvents(app), [app])
  const active = ENROLLED_STATUSES.has(app.application_status)

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  return (
    <div
      className="fixed inset-0 z-[65] flex items-center justify-center bg-[#0F3D2E]/45 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="enrollment-history-title"
      onClick={onClose}
    >
      <div
        className="flex max-h-[min(88vh,560px)] w-full max-w-lg flex-col overflow-hidden rounded-[16px] bg-[#F7F3EE] shadow-[0_24px_60px_rgba(15,61,46,0.28)]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex shrink-0 items-start justify-between gap-3 border-b border-[#0F3D2E]/10 px-4 py-3">
          <div>
            <p className="m-0 font-sans text-[0.625rem] font-semibold uppercase tracking-[0.14em] text-[#C9A961]">
              Enrollment
            </p>
            <h2
              id="enrollment-history-title"
              className="m-0 mt-0.5 font-medium text-[#0F3D2E]"
              style={{ ...displayFont, fontSize: '1.15rem' }}
            >
              {app.first_name} {app.last_name}
            </h2>
            <div className="mt-1.5">{enrollmentBadge(app.application_status)}</div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-[10px] border-0 bg-transparent px-2.5 py-1.5 font-sans text-[0.8125rem] font-semibold text-[#55655D] transition hover:bg-[#0F3D2E]/[0.06] hover:text-[#0F3D2E]"
          >
            Close
          </button>
        </div>

        <div className="min-h-0 flex-1 space-y-4 overflow-y-auto px-4 py-4">
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            <div className="rounded-[10px] border border-[#0F3D2E]/08 bg-[#E8DFD6] px-3 py-2.5">
              <p className="m-0 font-sans text-[0.5625rem] font-semibold uppercase tracking-[0.08em] text-[#55655D]">
                Coverage start
              </p>
              <p className="m-0 mt-0.5 font-sans text-[0.8125rem] text-[#0F3D2E]">
                {detail?.household?.coverage_start || '—'}
              </p>
            </div>
            <div className="rounded-[10px] border border-[#0F3D2E]/08 bg-[#E8DFD6] px-3 py-2.5">
              <p className="m-0 font-sans text-[0.5625rem] font-semibold uppercase tracking-[0.08em] text-[#55655D]">
                Submitted
              </p>
              <p className="m-0 mt-0.5 font-sans text-[0.8125rem] text-[#0F3D2E]">
                {fmtDate(app.created_at)}
              </p>
            </div>
            <div className="rounded-[10px] border border-[#0F3D2E]/08 bg-[#E8DFD6] px-3 py-2.5 sm:col-span-2">
              <p className="m-0 font-sans text-[0.5625rem] font-semibold uppercase tracking-[0.08em] text-[#55655D]">
                Enrollment status
              </p>
              <p className="m-0 mt-0.5 font-sans text-[0.8125rem] text-[#0F3D2E]">
                {active ? 'Active' : 'Inactive'}
                <span className="text-[#55655D]">
                  {' '}
                  · {app.application_status.replace(/_/g, ' ')}
                </span>
              </p>
            </div>
          </div>

          <section>
            <h3 className="m-0 font-sans text-[0.6875rem] font-semibold uppercase tracking-[0.12em] text-[#0F3D2E]">
              Enrollment history
            </h3>
            <ul className="m-0 mt-2 list-none space-y-2 p-0">
              {events.map((ev, i) => (
                <li
                  key={`${ev.title}-${i}`}
                  className="rounded-[12px] border border-[#0F3D2E]/08 bg-[#FAFCFB] px-3 py-2.5"
                >
                  <p className="m-0 font-sans text-[0.6875rem] text-[#55655D]">{fmtDate(ev.at)}</p>
                  <p className="m-0 mt-0.5 font-sans text-[0.8125rem] font-semibold text-[#0F3D2E]">
                    {ev.title}
                  </p>
                  <p className="m-0 mt-0.5 whitespace-pre-wrap break-words font-sans text-[0.75rem] text-[#55655D]">
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

  const updateApplicationRecord = async (
    id: string,
    patch: Partial<
      Pick<
        Application,
        | 'first_name'
        | 'last_name'
        | 'email'
        | 'phone'
        | 'date_of_birth'
        | 'address'
        | 'city'
        | 'state'
        | 'zip'
        | 'plan_type'
        | 'notes'
      >
    >,
  ) => {
    setFlash(null)
    const res = await fetch('/api/admin/applications', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, ...patch }),
    })
    const data = await res.json().catch(() => ({}))
    if (!res.ok || !data?.ok) {
      setFlash(data?.error || 'Could not save client record.')
      return false
    }
    setApplications((prev) =>
      prev.map((a) => (a.id === id ? { ...a, ...(data.application as Application) } : a)),
    )
    setFlash('Client record saved.')
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
                      onSaveRecord={updateApplicationRecord}
                      onAudit={recordApplicationAudit}
                      onFlash={setFlash}
                    />
                  )}

                  {workspace === 'leads' && (
                    <LeadsSpreadsheetPanel
                      applications={applications}
                      onUpdateStatus={updateStatus}
                      onAudit={recordApplicationAudit}
                    />
                  )}

                  {workspace === 'mailbox' && <MailboxPanel actorEmail={email} />}

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
                    <div className="flex min-h-0 flex-1 flex-col overflow-hidden p-3 sm:p-4">
                      <EmployeesWorkspace
                        applications={applications}
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
                    <div className="flex min-h-0 flex-1 flex-col overflow-hidden p-3 sm:p-4">
                      <IntelligenceDashboard
                        applications={applications}
                        careers={careers}
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

function MailingAddressModal({
  app,
  onClose,
  onSave,
}: {
  app: Application
  onClose: () => void
  onSave: (mailing: MailingAddress) => Promise<boolean>
}) {
  const existing = getMailingAddress(app.notes)
  const [draft, setDraft] = useState<MailingAddress>(() => ({
    ...existing,
    state: formatStateInput(existing.state),
    zip: formatZipInput(existing.zip),
  }))
  const [saving, setSaving] = useState(false)
  const [localError, setLocalError] = useState<string | null>(null)

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  const copyResidential = () => {
    setDraft({
      address: app.address || '',
      city: app.city || '',
      state: formatStateInput(app.state || ''),
      zip: formatZipInput(app.zip || ''),
    })
    setLocalError(null)
  }

  const save = async () => {
    const state = formatStateInput(draft.state)
    const zip = formatZipInput(draft.zip)
    if (state && !isValidState(state)) {
      setLocalError('Enter a valid 2-letter US state code.')
      return
    }
    if (zip && !isValidZip(zip)) {
      setLocalError('ZIP must be 5 digits, or ZIP+4 (12345-6789).')
      return
    }
    setLocalError(null)
    setSaving(true)
    try {
      const ok = await onSave({ ...draft, state, zip })
      if (ok) onClose()
    } finally {
      setSaving(false)
    }
  }

  const field =
    'w-full rounded-[10px] border border-[#0F3D2E]/20 bg-white px-2.5 py-2 font-sans text-[0.8125rem] text-[#0F3D2E] outline-none focus:border-[#0F3D2E]/45'

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#0F3D2E]/45 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="mailing-address-title"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="w-full max-w-md overflow-hidden rounded-[16px] bg-[#F7F3EE] shadow-[0_24px_60px_rgba(15,61,46,0.28)]"
        initial={{ opacity: 0, y: 16, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 10, scale: 0.98 }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-3 border-b border-[#0F3D2E]/10 px-4 py-3">
          <div>
            <p className="m-0 font-sans text-[0.625rem] font-semibold uppercase tracking-[0.14em] text-[#C9A961]">
              Mailing address
            </p>
            <h2
              id="mailing-address-title"
              className="m-0 mt-0.5 font-medium text-[#0F3D2E]"
              style={{ ...displayFont, fontSize: '1.1rem' }}
            >
              {app.first_name} {app.last_name}
            </h2>
            <p className="m-0 mt-1 font-sans text-[0.6875rem] text-[#55655D]">
              Separate from residential address on the record
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-[8px] border-0 bg-transparent px-2 py-1 font-sans text-[0.8125rem] font-semibold text-[#55655D] hover:bg-[#0F3D2E]/[0.06]"
          >
            Close
          </button>
        </div>
        <div className="space-y-3 px-4 py-3">
          <button
            type="button"
            onClick={copyResidential}
            className="rounded-[8px] border border-[#0F3D2E]/20 bg-white px-2.5 py-1.5 font-sans text-[0.6875rem] font-semibold text-[#0F3D2E] hover:bg-[#FAFCFB]"
          >
            Copy from residential address
          </button>
          <label className="block">
            <span className="mb-1 block font-sans text-[0.625rem] font-semibold uppercase tracking-[0.08em] text-[#55655D]">
              Street
            </span>
            <input
              className={field}
              value={draft.address}
              onChange={(e) => setDraft((d) => ({ ...d, address: e.target.value }))}
            />
          </label>
          <div className="grid grid-cols-3 gap-2">
            <label className="col-span-1 block sm:col-span-1">
              <span className="mb-1 block font-sans text-[0.625rem] font-semibold uppercase tracking-[0.08em] text-[#55655D]">
                City
              </span>
              <input
                className={field}
                value={draft.city}
                onChange={(e) => setDraft((d) => ({ ...d, city: e.target.value }))}
              />
            </label>
            <label className="block">
              <span className="mb-1 block font-sans text-[0.625rem] font-semibold uppercase tracking-[0.08em] text-[#55655D]">
                State
              </span>
              <input
                className={field}
                value={draft.state}
                maxLength={2}
                onChange={(e) =>
                  setDraft((d) => ({ ...d, state: formatStateInput(e.target.value) }))
                }
              />
            </label>
            <label className="block">
              <span className="mb-1 block font-sans text-[0.625rem] font-semibold uppercase tracking-[0.08em] text-[#55655D]">
                ZIP
              </span>
              <input
                className={field}
                value={draft.zip}
                inputMode="numeric"
                maxLength={10}
                onChange={(e) => setDraft((d) => ({ ...d, zip: formatZipInput(e.target.value) }))}
              />
            </label>
          </div>
          {localError ? (
            <p className="m-0 font-sans text-[0.75rem] text-[#8B3A3A]">{localError}</p>
          ) : null}
          <div className="flex justify-end">
            <button
              type="button"
              disabled={saving}
              onClick={() => void save()}
              className="rounded-[10px] bg-[#0F3D2E] px-4 py-1.5 font-sans text-[0.75rem] font-semibold text-[#E8DFD6] disabled:opacity-50"
            >
              {saving ? 'Saving…' : 'Save mailing address'}
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}

function PlanDetailsModal({
  app,
  onClose,
  onSave,
}: {
  app: Application
  onClose: () => void
  onSave: (details: PlanDetails, planType: string) => Promise<boolean>
}) {
  const [draft, setDraft] = useState(() => getPlanDetails(app.notes, app.plan_type))
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  const save = async () => {
    setSaving(true)
    try {
      const ok = await onSave(draft, draft.plan_name || app.plan_type || '')
      if (ok) onClose()
    } finally {
      setSaving(false)
    }
  }

  const field =
    'w-full rounded-[10px] border border-[#0F3D2E]/20 bg-white px-2.5 py-2 font-sans text-[0.8125rem] text-[#0F3D2E] outline-none focus:border-[#0F3D2E]/45'
  const setField = (key: keyof PlanDetails) => (e: { target: { value: string } }) =>
      setDraft((d) => ({ ...d, [key]: e.target.value }))

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#0F3D2E]/45 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="plan-details-title"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="flex max-h-[min(90vh,720px)] w-full max-w-2xl flex-col overflow-hidden rounded-[16px] bg-[#F7F3EE] shadow-[0_24px_60px_rgba(15,61,46,0.28)]"
        initial={{ opacity: 0, y: 16, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 10, scale: 0.98 }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex shrink-0 items-start justify-between gap-3 border-b border-[#0F3D2E]/10 px-4 py-3">
          <div>
            <p className="m-0 font-sans text-[0.625rem] font-semibold uppercase tracking-[0.14em] text-[#C9A961]">
              Plan details
            </p>
            <h2
              id="plan-details-title"
              className="m-0 mt-0.5 font-medium text-[#0F3D2E]"
              style={{ ...displayFont, fontSize: '1.1rem' }}
            >
              {app.first_name} {app.last_name}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-[8px] border-0 bg-transparent px-2 py-1 font-sans text-[0.8125rem] font-semibold text-[#55655D] hover:bg-[#0F3D2E]/[0.06]"
          >
            Close
          </button>
        </div>
        <div className="min-h-0 flex-1 space-y-3 overflow-y-auto px-4 py-3">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {(
              [
                ['plan_name', 'Plan name / type'],
                ['carrier', 'Carrier'],
                ['plan_id', 'Plan ID'],
                ['contract_id', 'Contract ID'],
                ['pbp', 'PBP'],
                ['premium', 'Premium'],
                ['deductible', 'Deductible'],
                ['coverage_start', 'Coverage start'],
                ['coverage_end', 'Coverage end'],
                ['network', 'Network'],
                ['metal_tier', 'Metal tier'],
                ['group_number', 'Group number'],
                ['rx_bin', 'Rx BIN'],
              ] as const
            ).map(([key, label]) => (
              <label key={key} className="block">
                <span className="mb-1 block font-sans text-[0.625rem] font-semibold uppercase tracking-[0.08em] text-[#55655D]">
                  {label}
                </span>
                <input
                  className={field}
                  type={key.includes('coverage') ? 'date' : 'text'}
                  value={draft[key]}
                  onChange={setField(key)}
                />
              </label>
            ))}
            <label className="block sm:col-span-2">
              <span className="mb-1 block font-sans text-[0.625rem] font-semibold uppercase tracking-[0.08em] text-[#55655D]">
                Plan notes
              </span>
              <textarea
                className={`${field} min-h-[72px] resize-y`}
                value={draft.notes}
                onChange={setField('notes')}
              />
            </label>
          </div>
        </div>
        <div className="flex shrink-0 justify-end border-t border-[#0F3D2E]/10 px-4 py-3">
          <button
            type="button"
            disabled={saving}
            onClick={() => void save()}
            className="rounded-[10px] bg-[#0F3D2E] px-4 py-1.5 font-sans text-[0.75rem] font-semibold text-[#E8DFD6] disabled:opacity-50"
          >
            {saving ? 'Saving…' : 'Save plan details'}
          </button>
        </div>
      </motion.div>
    </motion.div>
  )
}

function DirectoryNotesModal({
  app,
  onClose,
  onSave,
}: {
  app: Application
  onClose: () => void
  onSave: (text: string) => Promise<boolean>
}) {
  const [draft, setDraft] = useState('')
  const [saving, setSaving] = useState(false)
  const history = getNotesHistory(app.notes)
  const current = getDirectoryNotes(app.notes)

  const entries = useMemo(() => {
    const list: { at: string; text: string; current?: boolean }[] = history.map((h) => ({
      ...h,
    }))
    if (current.trim()) {
      const inHistory = history.some((h) => h.text.trim() === current.trim())
      if (!inHistory) {
        list.unshift({ at: '', text: current, current: true })
      }
    }
    return list
  }, [history, current])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  const save = async () => {
    if (!draft.trim() || saving) return
    setSaving(true)
    try {
      const ok = await onSave(draft.trim())
      if (ok) {
        setDraft('')
      }
    } finally {
      setSaving(false)
    }
  }

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#0F3D2E]/45 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="directory-notes-title"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.18 }}
      onClick={onClose}
    >
      <motion.div
        className="flex max-h-[min(88vh,560px)] w-full max-w-lg flex-col overflow-hidden rounded-[16px] bg-[#F7F3EE] shadow-[0_24px_60px_rgba(15,61,46,0.28)]"
        initial={{ opacity: 0, y: 18, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 12, scale: 0.98 }}
        transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex shrink-0 items-start justify-between gap-3 border-b border-[#0F3D2E]/10 px-4 py-3 sm:px-5">
          <div className="min-w-0">
            <p className="m-0 font-sans text-[0.625rem] font-semibold uppercase tracking-[0.14em] text-[#C9A961]">
              Notes
            </p>
            <h2
              id="directory-notes-title"
              className="m-0 mt-0.5 truncate font-medium text-[#0F3D2E]"
              style={{ ...displayFont, fontSize: '1.15rem' }}
            >
              {app.first_name} {app.last_name}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-[8px] border-0 bg-transparent px-2 py-1 font-sans text-[0.8125rem] font-semibold text-[#55655D] hover:bg-[#0F3D2E]/[0.06]"
          >
            Close
          </button>
        </div>

        <div className="min-h-0 flex-1 space-y-2 overflow-y-auto px-4 py-3 sm:px-5">
          {entries.length === 0 ? (
            <p className="m-0 font-sans text-[0.8125rem] text-[#55655D]">No notes yet.</p>
          ) : (
            entries.map((entry, i) => (
              <div
                key={`${entry.at}-${i}`}
                className="rounded-[12px] border border-[#0F3D2E]/08 bg-white px-3 py-2.5"
              >
                <p className="m-0 font-sans text-[0.625rem] font-semibold uppercase tracking-[0.08em] text-[#55655D]">
                  {entry.current ? 'Current' : fmtDate(entry.at)}
                </p>
                <p className="m-0 mt-1 whitespace-pre-wrap font-sans text-[0.8125rem] leading-[1.5] text-[#0F3D2E]">
                  {entry.text}
                </p>
              </div>
            ))
          )}
        </div>

        <div className="shrink-0 border-t border-[#0F3D2E]/10 px-4 py-3 sm:px-5">
          <label className="mb-1 block font-sans text-[0.625rem] font-semibold uppercase tracking-[0.08em] text-[#55655D]">
            New note
          </label>
          <textarea
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder="Write a new note…"
            className="min-h-[5.5rem] w-full resize-y rounded-[10px] border border-[#0F3D2E]/20 bg-white px-2.5 py-2 font-sans text-[0.8125rem] text-[#0F3D2E] outline-none focus:border-[#0F3D2E]/45"
          />
          <div className="mt-2 flex justify-end">
            <button
              type="button"
              disabled={!draft.trim() || saving}
              onClick={() => void save()}
              className="rounded-[10px] bg-[#0F3D2E] px-4 py-1.5 font-sans text-[0.75rem] font-semibold text-[#E8DFD6] transition hover:bg-[#0A2E22] disabled:opacity-50"
            >
              {saving ? 'Saving…' : 'Save note'}
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}

function DirectoryHistoryModal({
  app,
  onClose,
}: {
  app: Application
  onClose: () => void
}) {
  const microLedger = getMicroLedger(app.notes)
  const agentOfRecord = getAgentOfRecord(app.notes)
  const [ledgerPage, setLedgerPage] = useState(0)
  const [threadMessages, setThreadMessages] = useState<
    {
      id: string
      sender_role: string
      message: string
      message_type: string
      created_at: string
    }[]
  >([])
  const [threadTitle, setThreadTitle] = useState<string | null>(null)
  const [conversationId, setConversationId] = useState<string | null>(null)
  const [fullThreadOpen, setFullThreadOpen] = useState(false)
  const [threadUpdatedAt, setThreadUpdatedAt] = useState<string | null>(null)

  const LEDGER_PAGE = 8
  const ledgerPages = Math.max(1, Math.ceil(microLedger.length / LEDGER_PAGE))
  const ledgerSlice = microLedger.slice(
    ledgerPage * LEDGER_PAGE,
    ledgerPage * LEDGER_PAGE + LEDGER_PAGE,
  )

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      const res = await fetch('/api/admin/conversations?limit=40')
      const data = await res.json().catch(() => ({}))
      if (!res.ok || !data?.ok || cancelled) return
      const match = (data.conversations || []).find(
        (c: { application_id?: string | null }) => c.application_id === app.id,
      )
      if (!match) {
        const created = await fetch('/api/admin/conversations', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ applicationId: app.id, createdAt: app.created_at }),
        })
        const createdData = await created.json().catch(() => ({}))
        if (created.ok && createdData?.conversation?.id) {
          const detail = await fetch(`/api/admin/conversations/${createdData.conversation.id}`)
          const detailData = await detail.json().catch(() => ({}))
          if (!cancelled && detail.ok && detailData?.ok) {
            setConversationId(createdData.conversation.id)
            setThreadTitle(createdData.conversation.title)
            setThreadUpdatedAt(createdData.conversation.updated_at || null)
            setThreadMessages(detailData.messages || [])
          }
        }
        return
      }
      setConversationId(match.id)
      setThreadTitle(match.title)
      setThreadUpdatedAt(match.updated_at || null)
      const detail = await fetch(`/api/admin/conversations/${match.id}`)
      const detailData = await detail.json().catch(() => ({}))
      if (!cancelled && detail.ok && detailData?.ok) {
        setThreadMessages(detailData.messages || [])
      } else if (!cancelled) {
        setThreadMessages(match.messages || [])
      }
    })()
    return () => {
      cancelled = true
    }
  }, [app.id, app.created_at])

  useEffect(() => {
    setLedgerPage(0)
  }, [app.id, microLedger.length])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !fullThreadOpen) onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose, fullThreadOpen])

  const previewMessages = threadMessages.slice(-5)

  return (
    <>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center bg-[#0F3D2E]/45 p-4"
        role="dialog"
        aria-modal="true"
        aria-labelledby="directory-history-title"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.18 }}
        onClick={onClose}
      >
        <motion.div
          className="flex max-h-[min(88vh,640px)] w-full max-w-2xl flex-col overflow-hidden rounded-[16px] bg-[#F7F3EE] shadow-[0_24px_60px_rgba(15,61,46,0.28)]"
          initial={{ opacity: 0, y: 18, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 12, scale: 0.98 }}
          transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex shrink-0 items-start justify-between gap-3 border-b border-[#0F3D2E]/10 px-4 py-3 sm:px-5">
            <div className="min-w-0">
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
              <div className="mt-1 flex flex-wrap items-center gap-2">
                {threadTitle ? (
                  <p className="m-0 font-sans text-[0.75rem] font-semibold text-[#0F3D2E]">
                    {threadTitle}
                  </p>
                ) : null}
                {agentOfRecord ? (
                  <span
                    className="inline-flex max-w-full items-center truncate rounded-full bg-[#0F3D2E]/10 px-2 py-0.5 font-sans text-[0.5625rem] font-semibold tracking-[0.04em] text-[#0F3D2E]"
                    title={agentOfRecord}
                  >
                    Agent of Record: {formatAgentDisplay(agentOfRecord) || agentOfRecord}
                  </span>
                ) : null}
              </div>
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
              <div className="flex items-center justify-between gap-2">
                <h3 className="m-0 font-sans text-[0.6875rem] font-semibold uppercase tracking-[0.12em] text-[#0F3D2E]">
                  Application Conversations
                </h3>
                {conversationId ? (
                  <button
                    type="button"
                    onClick={() => setFullThreadOpen(true)}
                    className="rounded-[8px] border-0 bg-transparent px-2 py-0.5 font-sans text-[0.6875rem] font-semibold text-[#0F3D2E] transition hover:bg-[#0F3D2E]/[0.06]"
                  >
                    Open
                  </button>
                ) : null}
              </div>
              {threadTitle ? (
                <p
                  className="m-0 mt-2 font-medium text-[#0F3D2E]"
                  style={{ ...displayFont, fontSize: '1.05rem' }}
                >
                  {threadTitle}
                </p>
              ) : null}
              <p className="m-0 mt-0.5 font-sans text-[0.6875rem] text-[#55655D]">
                {app.first_name} {app.last_name} · {app.application_status.replace(/_/g, ' ')}
              </p>
              {threadUpdatedAt ? (
                <p className="m-0 mt-0.5 font-sans text-[0.625rem] text-[#55655D]">
                  {fmtDate(threadUpdatedAt)}
                </p>
              ) : null}

              {previewMessages.length === 0 ? (
                <p className="m-0 mt-3 font-sans text-[0.8125rem] text-[#55655D]">
                  No conversation messages yet.
                </p>
              ) : (
                <ul className="m-0 mt-3 list-none space-y-2.5 p-0">
                  {previewMessages.map((m) => {
                    const isSystem =
                      m.message_type === 'system' ||
                      m.message_type === 'status' ||
                      m.sender_role === 'system'
                    const label =
                      m.message_type === 'note'
                        ? 'Note'
                        : isSystem
                          ? 'System'
                          : m.sender_role === 'admin'
                            ? 'Admin'
                            : m.sender_role === 'producer'
                              ? 'Producer'
                              : 'Office'
                    return (
                      <li key={m.id} className="min-w-0">
                        <p className="m-0 font-sans text-[0.625rem] font-semibold uppercase tracking-[0.08em] text-[#0F3D2E]">
                          {label}
                        </p>
                        <p className="m-0 mt-0.5 whitespace-pre-wrap font-sans text-[0.8125rem] leading-snug text-[#55655D]">
                          {m.message || '—'}
                        </p>
                      </li>
                    )
                  })}
                </ul>
              )}
            </section>

            <section>
              <div className="flex items-center justify-between gap-2">
                <h3 className="m-0 font-sans text-[0.6875rem] font-semibold uppercase tracking-[0.12em] text-[#0F3D2E]">
                  Micro ledger
                </h3>
                {microLedger.length > 0 ? (
                  <p className="m-0 font-sans text-[0.625rem] font-semibold text-[#0F3D2E]">
                    {ledgerPage + 1} / {ledgerPages}
                  </p>
                ) : null}
              </div>
              {microLedger.length === 0 ? (
                <p className="m-0 mt-2 font-sans text-[0.8125rem] text-[#55655D]">
                  No ledger activity yet.
                </p>
              ) : (
                <>
                  <ul className="m-0 mt-2 list-none space-y-2 p-0">
                    {ledgerSlice.map((e, i) => (
                      <li
                        key={`${e.at}-${e.action}-${i}`}
                        className="rounded-[12px] border border-[#0F3D2E]/08 bg-[#FAFCFB] px-3 py-2.5"
                      >
                        <p className="m-0 font-sans text-[0.6875rem] text-[#55655D]">
                          {fmtDate(e.at)}
                        </p>
                        <p className="m-0 mt-0.5 font-sans text-[0.8125rem] font-semibold capitalize text-[#0F3D2E]">
                          {e.action.replace(/_/g, ' ')}
                        </p>
                        <p className="m-0 mt-0.5 break-words font-sans text-[0.75rem] text-[#55655D]">
                          {[e.actor, e.detail].filter(Boolean).join(' · ')}
                        </p>
                      </li>
                    ))}
                  </ul>
                  {ledgerPages > 1 ? (
                    <div className="mt-2 flex items-center justify-end gap-2">
                      <button
                        type="button"
                        disabled={ledgerPage <= 0}
                        onClick={() => setLedgerPage((p) => Math.max(0, p - 1))}
                        className="rounded-[8px] border-0 bg-[#E8DFD6] px-2.5 py-1 font-sans text-[0.6875rem] font-semibold text-[#0F3D2E] disabled:opacity-40"
                      >
                        Prev
                      </button>
                      <button
                        type="button"
                        disabled={ledgerPage >= ledgerPages - 1}
                        onClick={() => setLedgerPage((p) => Math.min(ledgerPages - 1, p + 1))}
                        className="rounded-[8px] border-0 bg-[#E8DFD6] px-2.5 py-1 font-sans text-[0.6875rem] font-semibold text-[#0F3D2E] disabled:opacity-40"
                      >
                        Next
                      </button>
                    </div>
                  ) : null}
                </>
              )}
            </section>
          </div>
        </motion.div>
      </motion.div>

      {fullThreadOpen && conversationId ? (
        <ConversationViewModal
          conversationId={conversationId}
          onClose={() => setFullThreadOpen(false)}
        />
      ) : null}
    </>
  )
}

function ClientsDirectoryPanel({
  applications,
  actorEmail,
  onSaveNotes,
  onSaveRecord,
  onAudit,
  onFlash,
}: {
  applications: Application[]
  actorEmail: string | null
  onSaveNotes: (id: string, notes: string | null) => Promise<boolean>
  onSaveRecord: (
    id: string,
    patch: Partial<
      Pick<
        Application,
        | 'first_name'
        | 'last_name'
        | 'email'
        | 'phone'
        | 'date_of_birth'
        | 'address'
        | 'city'
        | 'state'
        | 'zip'
        | 'plan_type'
        | 'notes'
      >
    >,
  ) => Promise<boolean>
  onAudit: (
    id: string,
    action: string,
    detail?: string,
    opts?: { silent?: boolean },
  ) => Promise<boolean>
  onFlash: (message: string | null) => void
}) {
  const [search, setSearch] = useState('')
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [pickerOpen, setPickerOpen] = useState(false)
  const [notesOpen, setNotesOpen] = useState(false)
  const [mailingOpen, setMailingOpen] = useState(false)
  const [planOpen, setPlanOpen] = useState(false)
  const [idView, setIdView] = useState<'ssn' | 'mbi'>('ssn')
  const [ssnRevealed, setSsnRevealed] = useState(false)
  const [callTarget, setCallTarget] = useState<SoftPhoneTarget | null>(null)
  const [enrollmentOpen, setEnrollmentOpen] = useState(false)
  const [fieldsLocked, setFieldsLocked] = useState(true)
  const [fieldDraft, setFieldDraft] = useState<DirectoryFieldDraft | null>(null)
  const [savingFields, setSavingFields] = useState(false)
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
        getPolicyId(a.notes),
        getLeadId(a.notes),
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
    setNotesOpen(false)
    setMailingOpen(false)
    setPlanOpen(false)
    setSsnRevealed(false)
    setEnrollmentOpen(false)
    setFieldsLocked(true)
    setFieldDraft(null)
    if (selected) setIdView(getPreferredId(selected.notes))
  }, [selected?.id])

  useEffect(() => {
    if (!selectedId || lastViewedId.current === selectedId) return
    lastViewedId.current = selectedId
    void onAudit(selectedId, 'viewed', 'Directory', { silent: true })
  }, [selectedId, onAudit])

  const fullSsn = selected ? getFullSsn(selected.notes) : ''
  const editing = Boolean(selected && !fieldsLocked && fieldDraft)

  const displayEmail = editing ? fieldDraft!.email : selected?.email || ''
  const displayPhone = editing ? fieldDraft!.phone : selected?.phone || ''

  const duplicateEmailWarning = useMemo(() => {
    if (!selected || !displayEmail) return null
    const email = normalizeEmail(displayEmail)
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
  }, [applications, selected, displayEmail])

  const duplicatePhoneWarning = useMemo(() => {
    if (!selected || !displayPhone) return null
    const phone = normalizePhone(displayPhone)
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
  }, [applications, selected, displayPhone])

  const fieldDefs = [
    'First name',
    'Last name',
    'Email',
    'Phone number',
    'Date of birth',
    'Address',
    'City',
    'State',
    'ZIP',
    'SSN',
    'Plan type',
    'Lead ID',
    'Application ID',
    'Policy ID',
  ] as const

  const fields: {
    label: string
    value: string
    warning?: string | null
    editable?: boolean
    draftKey?: keyof DirectoryFieldDraft
  }[] = fieldDefs.map((label) => {
    if (!selected) return { label, value: '', editable: false }
    const draft = editing ? fieldDraft! : null
    switch (label) {
      case 'Application ID':
        return { label, value: selected.id, editable: false }
      case 'Lead ID':
        return {
          label,
          value: draft ? draft.lead_id : getLeadId(selected.notes),
          editable: true,
          draftKey: 'lead_id',
        }
      case 'Policy ID':
        return {
          label,
          value: draft ? draft.policy_id : getPolicyId(selected.notes),
          editable: true,
          draftKey: 'policy_id',
        }
      case 'First name':
        return {
          label,
          value: draft ? draft.first_name : selected.first_name || '',
          editable: true,
          draftKey: 'first_name',
        }
      case 'Last name':
        return {
          label,
          value: draft ? draft.last_name : selected.last_name || '',
          editable: true,
          draftKey: 'last_name',
        }
      case 'Email':
        return {
          label,
          value: draft ? draft.email : selected.email || '',
          warning: duplicateEmailWarning,
          editable: true,
          draftKey: 'email',
        }
      case 'Phone number':
        return {
          label,
          value: draft ? draft.phone : selected.phone || '',
          warning: duplicatePhoneWarning,
          editable: true,
          draftKey: 'phone',
        }
      case 'Date of birth':
        return {
          label,
          value: draft ? draft.date_of_birth : selected.date_of_birth || '',
          editable: true,
          draftKey: 'date_of_birth',
        }
      case 'Plan type':
        return {
          label,
          value: draft ? draft.plan_type : selected.plan_type || '',
          editable: true,
          draftKey: 'plan_type',
        }
      case 'Address':
        return {
          label,
          value: draft ? draft.address : selected.address || '',
          editable: true,
          draftKey: 'address',
        }
      case 'City':
        return {
          label,
          value: draft ? draft.city : selected.city || '',
          editable: true,
          draftKey: 'city',
        }
      case 'State':
        return {
          label,
          value: draft ? draft.state : formatStateInput(selected.state || ''),
          editable: true,
          draftKey: 'state',
        }
      case 'ZIP':
        return {
          label,
          value: draft ? draft.zip : formatZipInput(selected.zip || ''),
          editable: true,
          draftKey: 'zip',
        }
      case 'SSN':
        return {
          label,
          value: '',
          editable: true,
          draftKey: 'ssn',
        }
      default:
        return { label, value: '', editable: false }
    }
  })

  const spokenAgent = selected ? getLastSpokenAgent(selected.notes) : ''
  const spokenAgentLabel = spokenAgent ? formatAgentDisplay(spokenAgent) : '—'

  const saveNotes = async (text: string) => {
    if (!selected) return false
    let notes = withDirectoryNotes(selected.notes, text)
    notes = withMicroLedger(notes, {
      at: new Date().toISOString(),
      actor: actorEmail || 'admin',
      action: 'notes_updated',
      detail: 'Directory notes saved',
    })
    const ok = await onSaveNotes(selected.id, notes)
    if (ok && text.trim()) {
      await fetch('/api/admin/conversations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          applicationId: selected.id,
          createdAt: selected.created_at,
          note: text.trim(),
        }),
      })
    }
    return ok
  }

  const saveFieldDraft = async () => {
    if (!selected || !fieldDraft) return false
    const baseline = directoryDraftFromApp(selected)
    const email = fieldDraft.email.trim()
    const state = formatStateInput(fieldDraft.state)
    const zip = formatZipInput(fieldDraft.zip)

    if (!email) {
      onFlash('Email is required.')
      return false
    }
    if (!isValidDirectoryEmail(email)) {
      onFlash('Enter a valid email with an @ and a domain extension (e.g. name@example.com).')
      return false
    }
    if (state && !isValidState(state)) {
      onFlash('Enter a valid 2-letter US state code.')
      return false
    }
    if (zip && !isValidZip(zip)) {
      onFlash('ZIP must be 5 digits, or ZIP+4 (12345-6789).')
      return false
    }

    const changed =
      baseline.first_name !== fieldDraft.first_name.trim() ||
      baseline.last_name !== fieldDraft.last_name.trim() ||
      baseline.email !== email ||
      baseline.phone.replace(/\D/g, '') !== fieldDraft.phone.replace(/\D/g, '') ||
      baseline.date_of_birth !== fieldDraft.date_of_birth.trim() ||
      baseline.plan_type !== fieldDraft.plan_type.trim() ||
      baseline.address !== fieldDraft.address.trim() ||
      baseline.city !== fieldDraft.city.trim() ||
      baseline.state !== state ||
      baseline.zip !== zip ||
      baseline.lead_id !== fieldDraft.lead_id.trim() ||
      baseline.policy_id !== fieldDraft.policy_id.trim() ||
      baseline.ssn.replace(/\D/g, '') !== fieldDraft.ssn.replace(/\D/g, '') ||
      baseline.mbi.replace(/[^a-zA-Z0-9]/gi, '').toUpperCase() !==
        fieldDraft.mbi.replace(/[^a-zA-Z0-9]/gi, '').toUpperCase()

    if (!changed) return true

    let notes = selected.notes
    if (baseline.policy_id !== fieldDraft.policy_id.trim()) {
      notes = withPolicyId(notes, fieldDraft.policy_id)
    }
    if (baseline.lead_id !== fieldDraft.lead_id.trim()) {
      notes = withLeadId(notes, fieldDraft.lead_id)
    }
    const draftSsnDigits = fieldDraft.ssn.replace(/\D/g, '')
    const baselineSsnDigits = baseline.ssn.replace(/\D/g, '')
    if (draftSsnDigits !== baselineSsnDigits && !fieldDraft.ssn.includes('*')) {
      notes = withFullSsn(notes, fieldDraft.ssn)
    }
    if (baseline.mbi.trim().toUpperCase() !== fieldDraft.mbi.trim().toUpperCase()) {
      notes = withMbi(notes, fieldDraft.mbi)
    }
    notes = withPreferredId(notes, idView)
    notes = withMicroLedger(notes, {
      at: new Date().toISOString(),
      actor: actorEmail || 'admin',
      action: 'profile_updated',
      detail: 'Directory record fields saved',
    })

    return onSaveRecord(selected.id, {
      first_name: fieldDraft.first_name.trim(),
      last_name: fieldDraft.last_name.trim(),
      email,
      phone: formatPhoneInput(fieldDraft.phone) || null,
      date_of_birth: dobToStorage(fieldDraft.date_of_birth) || null,
      plan_type: fieldDraft.plan_type.trim() || null,
      address: fieldDraft.address.trim() || null,
      city: fieldDraft.city.trim() || null,
      state: state || null,
      zip: zip || null,
      notes,
    })
  }

  const toggleFieldsLock = async () => {
    if (!selected || savingFields) return
    if (fieldsLocked) {
      setFieldDraft(directoryDraftFromApp(selected))
      setFieldsLocked(false)
      setSsnRevealed(true)
      return
    }
    setSavingFields(true)
    try {
      const ok = await saveFieldDraft()
      if (!ok) return
      setFieldsLocked(true)
      setFieldDraft(null)
    } finally {
      setSavingFields(false)
    }
  }

  const revealSsn = () => {
    if (!selected || ssnRevealed) return
    setSsnRevealed(true)
    void onAudit(selected.id, 'ssn_revealed', 'Directory', { silent: true })
  }

  const toggleSsnReveal = () => {
    if (!selected || !fullSsn || editing) return
    if (ssnRevealed) {
      setSsnRevealed(false)
      return
    }
    revealSsn()
  }

  const clearDirectory = () => {
    setSearch('')
    setSelectedId(null)
    setPickerOpen(false)
    setNotesOpen(false)
    setMailingOpen(false)
    setPlanOpen(false)
    setSsnRevealed(false)
    setEnrollmentOpen(false)
    setFieldsLocked(true)
    setFieldDraft(null)
  }

  const saveMailingAddress = async (mailing: MailingAddress) => {
    if (!selected) return false
    let notes = withMailingAddress(selected.notes, mailing)
    notes = withMicroLedger(notes, {
      at: new Date().toISOString(),
      actor: actorEmail || 'admin',
      action: 'mailing_address_updated',
      detail: 'Mailing address saved',
    })
    return onSaveNotes(selected.id, notes)
  }

  const savePlanDetails = async (details: PlanDetails, planType: string) => {
    if (!selected) return false
    let notes = withPlanDetails(selected.notes, details)
    notes = withMicroLedger(notes, {
      at: new Date().toISOString(),
      actor: actorEmail || 'admin',
      action: 'plan_details_updated',
      detail: 'Plan details saved',
    })
    const ok = await onSaveRecord(selected.id, {
      plan_type: planType.trim() || details.plan_name.trim() || selected.plan_type,
      notes,
    })
    if (ok && fieldDraft) {
      setFieldDraft((prev) =>
        prev
          ? { ...prev, plan_type: planType.trim() || details.plan_name.trim() || prev.plan_type }
          : prev,
      )
    }
    return ok
  }

  const emptyFieldClass =
    'w-full rounded-[10px] border border-[#0F3D2E]/20 bg-transparent px-2.5 py-1.5 font-sans text-[0.8125rem] text-[#0F3D2E] outline-none placeholder:text-[#55655D]/50'
  const filledFieldClass =
    'w-full cursor-default rounded-[10px] border border-[#0F3D2E]/15 bg-[#FAFCFB] px-2.5 py-1.5 font-sans text-[0.8125rem] text-[#0F3D2E] outline-none'
  const editableFieldClass =
    'w-full rounded-[10px] border border-[#0F3D2E]/35 bg-white px-2.5 py-1.5 font-sans text-[0.8125rem] text-[#0F3D2E] outline-none ring-0 focus:border-[#0F3D2E]/55'
  const invalidFieldClass =
    'w-full rounded-[10px] border border-[#8B3A3A]/55 bg-white px-2.5 py-1.5 font-sans text-[0.8125rem] text-[#0F3D2E] outline-none ring-0 focus:border-[#8B3A3A]'

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
          <div className="mb-3 flex min-h-[1.75rem] shrink-0 items-center gap-2">
            <div className="flex min-w-0 flex-1 flex-wrap items-center gap-2">
              {selected ? (
                <>
                  <h3 className="m-0 font-medium text-[#0F3D2E]" style={{ ...displayFont, fontSize: '1.15rem' }}>
                    {editing ? `${fieldDraft!.first_name} ${fieldDraft!.last_name}`.trim() : `${selected.first_name} ${selected.last_name}`}
                  </h3>
                  {enrollmentBadge(selected.application_status, {
                    onClick: () => setEnrollmentOpen(true),
                    title: 'View coverage start, submitted date, and enrollment history',
                  })}
                </>
              ) : (
                <h3 className="m-0 font-medium text-[#55655D]" style={{ ...displayFont, fontSize: '1.15rem' }}>
                  Client record
                </h3>
              )}
            </div>
            {selected ? (
              <button
                type="button"
                disabled={savingFields}
                onClick={() => void toggleFieldsLock()}
                title={fieldsLocked ? 'Unlock to edit fields' : 'Lock to save and make read-only'}
                aria-label={fieldsLocked ? 'Unlock fields' : 'Lock fields'}
                className="ml-auto inline-flex shrink-0 items-center justify-center rounded-[8px] border-0 bg-transparent p-1.5 text-[#0F3D2E] transition hover:bg-[#0F3D2E]/[0.08] disabled:opacity-50"
              >
                {fieldsLocked ? (
                  <Lock className="h-4 w-4" strokeWidth={2.25} />
                ) : (
                  <LockOpen className="h-4 w-4" strokeWidth={2.25} />
                )}
              </button>
            ) : null}
          </div>
          <div className="grid shrink-0 grid-cols-1 content-start gap-2 sm:grid-cols-2 xl:grid-cols-3">
            {fields.map((f) => {
              const planCategory =
                f.label === 'Plan type' && selected ? planTypeCategory(selected) : null
              const canEdit = Boolean(editing && f.editable && f.draftKey)
              const mbiValue = editing
                ? fieldDraft!.mbi
                : selected
                  ? formatMbiInput(getMbi(selected.notes))
                  : ''
              const ssnValue = editing
                ? fieldDraft!.ssn
                : selected
                  ? fullSsn || '—'
                  : ''
              const dobDisplay = editing
                ? fieldDraft!.date_of_birth
                : selected?.date_of_birth
                  ? formatDobDisplay(selected.date_of_birth)
                  : ''
              const phoneDisplay = editing
                ? fieldDraft!.phone
                : selected?.phone
                  ? formatPhoneInput(selected.phone)
                  : ''

              if (f.label === 'SSN') {
                return (
                  <div key={f.label} className="block">
                    <div className="mb-1 flex flex-wrap items-center gap-1.5">
                      <div className="inline-flex rounded-full bg-[#0F3D2E]/10 p-0.5">
                        <button
                          type="button"
                          disabled={!selected}
                          onClick={(e) => {
                            e.preventDefault()
                            setIdView('ssn')
                          }}
                          className={`rounded-full border-0 px-2 py-0.5 font-sans text-[0.5rem] font-semibold transition ${
                            idView === 'ssn'
                              ? 'bg-[#0F3D2E] text-[#E8DFD6]'
                              : 'bg-transparent text-[#0F3D2E]'
                          }`}
                        >
                          SSN
                        </button>
                        <button
                          type="button"
                          disabled={!selected}
                          onClick={(e) => {
                            e.preventDefault()
                            setIdView('mbi')
                          }}
                          className={`rounded-full border-0 px-2 py-0.5 font-sans text-[0.5rem] font-semibold transition ${
                            idView === 'mbi'
                              ? 'bg-[#0F3D2E] text-[#E8DFD6]'
                              : 'bg-transparent text-[#0F3D2E]'
                          }`}
                        >
                          MBI
                        </button>
                      </div>
                      {idView === 'ssn' ? (
                        <button
                          type="button"
                          disabled={!selected || !fullSsn || editing}
                          onClick={(e) => {
                            e.preventDefault()
                            toggleSsnReveal()
                          }}
                          title={
                            !fullSsn
                              ? 'No SSN on file'
                              : ssnRevealed || editing
                                ? 'Hide SSN'
                                : 'Reveal SSN'
                          }
                          aria-label={
                            ssnRevealed || editing ? 'Hide social security number' : 'Reveal social security number'
                          }
                          className="inline-flex items-center justify-center border-0 bg-transparent p-0.5 text-[#0F3D2E] transition hover:text-[#245C45] disabled:opacity-35"
                        >
                          {ssnRevealed || editing ? (
                            <EyeOff className="h-3.5 w-3.5" strokeWidth={2.25} />
                          ) : (
                            <Eye className="h-3.5 w-3.5" strokeWidth={2.25} />
                          )}
                        </button>
                      ) : null}
                    </div>
                    <input
                      readOnly={!editing}
                      value={
                        idView === 'mbi'
                          ? mbiValue || (editing ? '' : '—')
                          : ssnValue
                      }
                      maxLength={idView === 'mbi' ? 13 : 11}
                      onChange={
                        editing
                          ? (e) =>
                              setFieldDraft((prev) =>
                                prev
                                  ? idView === 'mbi'
                                    ? { ...prev, mbi: formatMbiInput(e.target.value) }
                                    : { ...prev, ssn: formatSsnInput(e.target.value) }
                                  : prev,
                              )
                          : undefined
                      }
                      className={`${
                        !selected
                          ? emptyFieldClass
                          : editing
                            ? editableFieldClass
                            : filledFieldClass
                      } ${
                        selected &&
                        idView === 'ssn' &&
                        fullSsn &&
                        !ssnRevealed &&
                        !editing
                          ? 'select-none blur-[5px]'
                          : ''
                      }`}
                    />
                  </div>
                )
              }

              if (f.label === 'Date of birth') {
                return (
                  <label key={f.label} className="block">
                    <span className="mb-1 block font-sans text-[0.625rem] font-semibold uppercase tracking-[0.08em] text-[#55655D]">
                      Date of birth
                    </span>
                    <input
                      readOnly={!canEdit}
                      value={dobDisplay || (!selected ? '' : editing ? '' : '—')}
                      inputMode="numeric"
                      maxLength={10}
                      onChange={
                        canEdit
                          ? (e) =>
                              setFieldDraft((prev) =>
                                prev
                                  ? { ...prev, date_of_birth: formatDobInput(e.target.value) }
                                  : prev,
                              )
                          : undefined
                      }
                      className={
                        !selected
                          ? emptyFieldClass
                          : canEdit
                            ? editableFieldClass
                            : filledFieldClass
                      }
                    />
                  </label>
                )
              }

              if (f.label === 'Phone number') {
                return (
                  <label key={f.label} className="block">
                    <span className="mb-1 flex items-center gap-1 font-sans text-[0.625rem] font-semibold uppercase tracking-[0.08em] text-[#55655D]">
                      Phone number
                      <button
                        type="button"
                        disabled={!selected?.phone && !displayPhone}
                        onClick={(e) => {
                          e.preventDefault()
                          const phone = displayPhone || selected?.phone
                          if (!selected || !phone) return
                          setCallTarget({
                            applicationId: selected.id,
                            name: `${selected.first_name} ${selected.last_name}`.trim(),
                            phone,
                            context: 'Clients',
                          })
                        }}
                        title={
                          displayPhone || selected?.phone
                            ? `Call ${displayPhone || selected?.phone}`
                            : 'No phone on file'
                        }
                        className="inline-flex items-center justify-center border-0 bg-transparent p-0 text-[#0F3D2E] transition hover:text-[#245C45] disabled:opacity-35"
                      >
                        <Phone className="h-3 w-3" strokeWidth={2.25} />
                      </button>
                      {f.warning ? <DuplicateFieldMark message={f.warning} /> : null}
                    </span>
                    <input
                      readOnly={!canEdit}
                      value={phoneDisplay || (!selected ? '' : editing ? '' : '—')}
                      inputMode="tel"
                      maxLength={14}
                      onChange={
                        canEdit
                          ? (e) =>
                              setFieldDraft((prev) =>
                                prev ? { ...prev, phone: formatPhoneInput(e.target.value) } : prev,
                              )
                          : undefined
                      }
                      className={
                        !selected
                          ? emptyFieldClass
                          : canEdit
                            ? editableFieldClass
                            : filledFieldClass
                      }
                    />
                  </label>
                )
              }

              if (f.label === 'Email') {
                const emailInvalid =
                  canEdit &&
                  Boolean(fieldDraft?.email.trim()) &&
                  !isValidDirectoryEmail(fieldDraft!.email)
                return (
                  <label key={f.label} className="block">
                    <span className="mb-1 flex items-center gap-1 font-sans text-[0.625rem] font-semibold uppercase tracking-[0.08em] text-[#55655D]">
                      {f.label}
                      {f.warning ? <DuplicateFieldMark message={f.warning} /> : null}
                    </span>
                    <input
                      readOnly={!canEdit}
                      type="email"
                      autoComplete="email"
                      value={f.value}
                      placeholder="—"
                      onChange={
                        canEdit
                          ? (e) =>
                              setFieldDraft((prev) =>
                                prev ? { ...prev, email: e.target.value } : prev,
                              )
                          : undefined
                      }
                      className={
                        !selected
                          ? emptyFieldClass
                          : canEdit
                            ? emailInvalid
                              ? invalidFieldClass
                              : editableFieldClass
                            : filledFieldClass
                      }
                    />
                  </label>
                )
              }

              if (f.label === 'State') {
                const stateInvalid =
                  canEdit &&
                  Boolean(fieldDraft?.state.trim()) &&
                  !isValidState(fieldDraft!.state)
                return (
                  <label key={f.label} className="block">
                    <span className="mb-1 block font-sans text-[0.625rem] font-semibold uppercase tracking-[0.08em] text-[#55655D]">
                      State
                    </span>
                    <input
                      readOnly={!canEdit}
                      value={f.value}
                      placeholder="—"
                      maxLength={2}
                      autoComplete="address-level1"
                      onChange={
                        canEdit
                          ? (e) =>
                              setFieldDraft((prev) =>
                                prev ? { ...prev, state: formatStateInput(e.target.value) } : prev,
                              )
                          : undefined
                      }
                      className={
                        !selected
                          ? emptyFieldClass
                          : canEdit
                            ? stateInvalid
                              ? invalidFieldClass
                              : editableFieldClass
                            : filledFieldClass
                      }
                    />
                  </label>
                )
              }

              if (f.label === 'ZIP') {
                const zipInvalid =
                  canEdit &&
                  Boolean(fieldDraft?.zip.trim()) &&
                  !isValidZip(fieldDraft!.zip)
                return (
                  <label key={f.label} className="block">
                    <span className="mb-1 block font-sans text-[0.625rem] font-semibold uppercase tracking-[0.08em] text-[#55655D]">
                      ZIP
                    </span>
                    <input
                      readOnly={!canEdit}
                      value={f.value}
                      placeholder="—"
                      inputMode="numeric"
                      maxLength={10}
                      autoComplete="postal-code"
                      onChange={
                        canEdit
                          ? (e) =>
                              setFieldDraft((prev) =>
                                prev ? { ...prev, zip: formatZipInput(e.target.value) } : prev,
                              )
                          : undefined
                      }
                      className={
                        !selected
                          ? emptyFieldClass
                          : canEdit
                            ? zipInvalid
                              ? invalidFieldClass
                              : editableFieldClass
                            : filledFieldClass
                      }
                    />
                  </label>
                )
              }

              return (
              <label key={f.label} className="block">
                <span className="mb-1 flex items-center gap-1 font-sans text-[0.625rem] font-semibold uppercase tracking-[0.08em] text-[#55655D]">
                  {f.label}
                  {planCategory ? (
                    <span className="ml-0.5 inline-flex rounded-full bg-[#0F3D2E]/10 px-1.5 py-0.5 font-sans text-[0.5rem] font-semibold tracking-[0.04em] text-[#0F3D2E]">
                      {planCategory}
                    </span>
                  ) : null}
                  {f.label === 'Address' ? (
                    <button
                      type="button"
                      disabled={!selected}
                      onClick={(e) => {
                        e.preventDefault()
                        setMailingOpen(true)
                      }}
                      title="Edit mailing address"
                      aria-label="Edit mailing address"
                      className="inline-flex items-center justify-center border-0 bg-transparent p-0 text-[#0F3D2E] transition hover:text-[#245C45] disabled:opacity-35"
                    >
                      <Mail className="h-3 w-3" strokeWidth={2.25} />
                    </button>
                  ) : null}
                  {f.label === 'Plan type' ? (
                    <button
                      type="button"
                      disabled={!selected}
                      onClick={(e) => {
                        e.preventDefault()
                        setPlanOpen(true)
                      }}
                      title="Edit plan details"
                      aria-label="Edit plan details"
                      className="inline-flex items-center justify-center border-0 bg-transparent p-0 text-[#0F3D2E] transition hover:text-[#245C45] disabled:opacity-35"
                    >
                      <Plus className="h-3.5 w-3.5" strokeWidth={2.5} />
                    </button>
                  ) : null}
                  {f.warning ? <DuplicateFieldMark message={f.warning} /> : null}
                </span>
                <input
                  readOnly={!canEdit}
                  value={f.value}
                  placeholder="—"
                  onChange={
                    canEdit && f.draftKey
                      ? (e) =>
                          setFieldDraft((prev) =>
                            prev ? { ...prev, [f.draftKey!]: e.target.value } : prev,
                          )
                      : undefined
                  }
                  className={
                    !selected
                      ? emptyFieldClass
                      : canEdit
                        ? editableFieldClass
                        : filledFieldClass
                  }
                />
              </label>
              )
            })}
          </div>
          <div className="mt-3 flex shrink-0 items-center justify-between gap-2">
            <div className="flex min-w-0 flex-wrap items-center gap-1.5">
              {selected ? (
                <button
                  type="button"
                  title={
                    spokenAgent
                      ? `Last agent who spoke with the client on a connected call: ${spokenAgent}`
                      : 'Updates when an agent reaches the client by phone and the client picks up'
                  }
                  className="inline-flex max-w-full items-center truncate rounded-full border-0 bg-[#0F3D2E]/10 px-1.5 py-0.5 font-sans text-[0.5rem] font-semibold tracking-[0.04em] text-[#0F3D2E]"
                >
                  Agent of Record: {spokenAgentLabel}
                </button>
              ) : (
                <span className="font-sans text-[0.625rem] font-semibold uppercase tracking-[0.08em] text-[#55655D]">
                  Agent of Record
                </span>
              )}
            </div>
            <button
              type="button"
              disabled={!selected}
              onClick={() => setNotesOpen(true)}
              title="Notes"
              aria-label="Open notes"
              className="inline-flex items-center justify-center rounded-[8px] border-0 bg-transparent p-1.5 text-[#0F3D2E] transition hover:bg-[#0F3D2E]/[0.08] disabled:opacity-40"
            >
              <StickyNote className="h-4 w-4" strokeWidth={2} />
            </button>
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
            ) : null}
          </div>
        </aside>
      </div>

      <AnimatePresence>
        {notesOpen && selected ? (
          <DirectoryNotesModal
            key={`notes-${selected.id}`}
            app={selected}
            onClose={() => setNotesOpen(false)}
            onSave={saveNotes}
          />
        ) : null}
      </AnimatePresence>

      <AnimatePresence>
        {mailingOpen && selected ? (
          <MailingAddressModal
            key={`mail-${selected.id}`}
            app={selected}
            onClose={() => setMailingOpen(false)}
            onSave={saveMailingAddress}
          />
        ) : null}
      </AnimatePresence>

      <AnimatePresence>
        {planOpen && selected ? (
          <PlanDetailsModal
            key={`plan-${selected.id}`}
            app={selected}
            onClose={() => setPlanOpen(false)}
            onSave={savePlanDetails}
          />
        ) : null}
      </AnimatePresence>

      {enrollmentOpen && selected ? (
        <EnrollmentHistoryModal app={selected} onClose={() => setEnrollmentOpen(false)} />
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
  const [page, setPage] = useState(0)
  const lastViewedId = useRef<string | null>(null)
  const LEADS_PAGE = 25

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

  const leadPages = Math.max(1, Math.ceil(leads.length / LEADS_PAGE))
  const pagedLeads = leads.slice(page * LEADS_PAGE, page * LEADS_PAGE + LEADS_PAGE)

  useEffect(() => {
    setPage(0)
  }, [query, applications])

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
                {pagedLeads.length === 0 ? (
                  <tr>
                    <td
                      colSpan={LEAD_COLUMNS.length + 1}
                      className="border border-[#A8B5AE] px-3 py-8 text-center text-[#55655D]"
                    >
                      No leads in the pipeline.
                    </td>
                  </tr>
                ) : (
                  pagedLeads.map((a, i) => {
                    const isSelected = selectedId === a.id
                    const rowNum = page * LEADS_PAGE + i + 1
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
                          {rowNum}
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
            <span>
              Page {page + 1} / {leadPages}
            </span>
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                disabled={page <= 0}
                onClick={() => setPage((p) => Math.max(0, p - 1))}
                className="rounded-[4px] border border-[#A8B5AE] bg-white px-2 py-0.5 font-semibold text-[#0F3D2E] disabled:opacity-40"
              >
                Prev
              </button>
              <button
                type="button"
                disabled={page >= leadPages - 1}
                onClick={() => setPage((p) => Math.min(leadPages - 1, p + 1))}
                className="rounded-[4px] border border-[#A8B5AE] bg-white px-2 py-0.5 font-semibold text-[#0F3D2E] disabled:opacity-40"
              >
                Next
              </button>
            </div>
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
  type CalEvent = {
    id: string
    title: string
    description: string | null
    starts_at: string
    ends_at: string | null
    scope: 'individual' | 'executive' | 'team' | 'company'
    assignee_email: string | null
    sync_to_office: boolean
  }

  const [cursor, setCursor] = useState(() => {
    const d = new Date()
    return new Date(d.getFullYear(), d.getMonth(), 1)
  })
  const [selectedDay, setSelectedDay] = useState<number | null>(() => new Date().getDate())
  const [events, setEvents] = useState<CalEvent[]>([])
  const [createOpen, setCreateOpen] = useState(false)
  const [saving, setSaving] = useState(false)
  const [draft, setDraft] = useState({
    title: '',
    description: '',
    date: '',
    time: '09:00',
    scope: 'company' as CalEvent['scope'],
    assigneeEmail: '',
    syncToOffice: true,
  })

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

  const loadEvents = useCallback(async () => {
    const from = new Date(year, month, 1).toISOString()
    const to = new Date(year, month + 1, 0, 23, 59, 59).toISOString()
    const res = await fetch(
      `/api/admin/calendar-events?from=${encodeURIComponent(from)}&to=${encodeURIComponent(to)}`,
    )
    const data = await res.json().catch(() => ({}))
    if (res.ok && data?.ok) setEvents(data.events || [])
  }, [year, month])

  useEffect(() => {
    void loadEvents()
  }, [loadEvents])

  useEffect(() => {
    const supabase = createClient()
    const channel = supabase
      .channel('office-calendar-events')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'office_calendar_events' },
        () => {
          void loadEvents()
        },
      )
      .subscribe()
    return () => {
      void supabase.removeChannel(channel)
    }
  }, [loadEvents])

  type DayBuckets = {
    individual: number
    executive: number
    team: number
    company: number
  }

  const eventsByDay = useMemo(() => {
    const map = new Map<number, DayBuckets>()
    const bump = (day: number, key: keyof DayBuckets) => {
      const cur = map.get(day) ?? { individual: 0, executive: 0, team: 0, company: 0 }
      cur[key] += 1
      map.set(day, cur)
    }
    for (const a of applications) {
      const d = new Date(a.created_at)
      if (d.getFullYear() === year && d.getMonth() === month) bump(d.getDate(), 'individual')
    }
    for (const c of careers) {
      const d = new Date(c.created_at)
      if (d.getFullYear() === year && d.getMonth() === month) bump(d.getDate(), 'executive')
    }
    for (const e of events) {
      const d = new Date(e.starts_at)
      if (d.getFullYear() === year && d.getMonth() === month) {
        bump(d.getDate(), e.scope)
      }
    }
    return map
  }, [applications, careers, events, year, month])

  const selectedLabel =
    selectedDay != null
      ? new Date(year, month, selectedDay).toLocaleDateString('en-US', {
          weekday: 'long',
          month: 'long',
          day: 'numeric',
          year: 'numeric',
        })
      : null

  const dayEvents = useMemo(() => {
    if (selectedDay == null) return []
    return events
      .filter((e) => {
        const d = new Date(e.starts_at)
        return d.getFullYear() === year && d.getMonth() === month && d.getDate() === selectedDay
      })
      .sort((a, b) => +new Date(a.starts_at) - +new Date(b.starts_at))
  }, [events, selectedDay, year, month])

  const upcomingCount = useMemo(() => {
    const now = Date.now()
    return events.filter((e) => new Date(e.starts_at).getTime() >= now).length
  }, [events])

  const selectedBuckets =
    selectedDay != null
      ? eventsByDay.get(selectedDay) ?? { individual: 0, executive: 0, team: 0, company: 0 }
      : { individual: 0, executive: 0, team: 0, company: 0 }

  const cells: (number | null)[] = []
  for (let i = 0; i < firstWeekday; i++) cells.push(null)
  for (let d = 1; d <= daysInMonth; d++) cells.push(d)

  const openCreate = () => {
    const day = selectedDay ?? today.getDate()
    const yyyy = year
    const mm = String(month + 1).padStart(2, '0')
    const dd = String(day).padStart(2, '0')
    setDraft({
      title: '',
      description: '',
      date: `${yyyy}-${mm}-${dd}`,
      time: '09:00',
      scope: 'company',
      assigneeEmail: '',
      syncToOffice: true,
    })
    setCreateOpen(true)
  }

  const saveEvent = async () => {
    if (!draft.title.trim() || !draft.date || saving) return
    setSaving(true)
    try {
      const startsAt = new Date(`${draft.date}T${draft.time || '09:00'}:00`)
      const res = await fetch('/api/admin/calendar-events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: draft.title.trim(),
          description: draft.description.trim() || null,
          startsAt: startsAt.toISOString(),
          scope: draft.scope,
          assigneeEmail: draft.scope === 'individual' ? draft.assigneeEmail.trim() : null,
          syncToOffice: draft.syncToOffice,
        }),
      })
      const data = await res.json().catch(() => ({}))
      if (res.ok && data?.ok) {
        setCreateOpen(false)
        await loadEvents()
      }
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="flex h-full min-h-0 flex-col overflow-hidden bg-[#F7F3EE]">
      <div className="flex shrink-0 flex-wrap items-center justify-between gap-2 border-b border-[#0F3D2E]/10 bg-[#F7F3EE] px-3 py-2.5 sm:px-4">
        <div className="flex items-center gap-2">
          <div>
            <p className="m-0 font-sans text-[0.625rem] font-semibold uppercase tracking-[0.14em] text-[#C9A961]">
              Calendar
            </p>
            <h2 className="m-0 mt-0.5 font-medium text-[#0F3D2E]" style={{ ...displayFont, fontSize: '1.15rem' }}>
              {monthNames[month]} {year}
            </h2>
          </div>
          <button
            type="button"
            onClick={openCreate}
            title="Add calendar event"
            className="mt-3 inline-flex h-8 w-8 items-center justify-center rounded-[8px] border-0 bg-[#0F3D2E] text-[#E8DFD6] transition hover:bg-[#0A2E22]"
          >
            <Plus className="h-4 w-4" strokeWidth={2.5} />
          </button>
        </div>
        <div className="flex gap-1">
          <button
            type="button"
            onClick={() => setCursor(new Date(year, month - 1, 1))}
            className="rounded-[8px] border-0 bg-[#E8DFD6] px-2.5 py-1 font-sans text-[0.75rem] font-semibold text-[#0F3D2E]"
          >
            Prev
          </button>
          <button
            type="button"
            onClick={() => setCursor(new Date(year, month + 1, 1))}
            className="rounded-[8px] border-0 bg-[#E8DFD6] px-2.5 py-1 font-sans text-[0.75rem] font-semibold text-[#0F3D2E]"
          >
            Next
          </button>
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
              const hasDots =
                ev &&
                (ev.individual > 0 || ev.executive > 0 || ev.team > 0 || ev.company > 0)
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
                  {hasDots ? (
                    <span className="mt-auto mb-1 flex flex-wrap justify-center gap-0.5 px-0.5">
                      {ev!.individual > 0 ? (
                        <span className={`h-1 w-1 rounded-full ${isSelected ? 'bg-[#C9A961]' : 'bg-[#0F3D2E]'}`} />
                      ) : null}
                      {ev!.executive > 0 ? (
                        <span className={`h-1 w-1 rounded-full ${isSelected ? 'bg-[#E8DFD6]' : 'bg-[#C9A961]'}`} />
                      ) : null}
                      {ev!.team > 0 ? (
                        <span className={`h-1 w-1 rounded-full ${isSelected ? 'bg-[#7EB8A0]' : 'bg-[#2F6F5E]'}`} />
                      ) : null}
                      {ev!.company > 0 ? (
                        <span className={`h-1 w-1 rounded-full ${isSelected ? 'bg-[#F0E6D8]' : 'bg-[#8B6914]'}`} />
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
            Inbox
          </p>
          <p className="m-0 mt-1 font-sans text-[0.8125rem] font-semibold text-[#0F3D2E]">
            {selectedLabel ?? 'Select a day'}
          </p>
          <div className="mt-3 space-y-2">
            <div className="rounded-[10px] border border-[#0F3D2E]/08 bg-[#FAFCFB] px-3 py-2">
              <p className="m-0 font-sans text-[0.625rem] font-semibold uppercase tracking-[0.1em] text-[#55655D]">
                Upcoming events
              </p>
              <p className="m-0 mt-0.5 font-sans text-[1.35rem] font-semibold leading-none text-[#0F3D2E]">
                {upcomingCount}
              </p>
              <p className="m-0 mt-1 font-sans text-[0.625rem] text-[#55655D]">
                Scheduled on calendar · updates live
              </p>
            </div>
            <div className="rounded-[10px] border border-[#0F3D2E]/08 bg-[#FAFCFB] px-3 py-2">
              <p className="m-0 font-sans text-[0.625rem] font-semibold uppercase tracking-[0.1em] text-[#55655D]">
                This day
              </p>
              <p className="m-0 mt-0.5 font-sans text-[0.75rem] text-[#0F3D2E]">
                Individual {selectedBuckets.individual} · Executive {selectedBuckets.executive} · Team{' '}
                {selectedBuckets.team} · Company {selectedBuckets.company}
              </p>
            </div>
          </div>

          <div className="mt-3 min-h-0 flex-1 space-y-1.5 overflow-y-auto">
            {dayEvents.length === 0 ? (
              <p className="m-0 font-sans text-[0.75rem] text-[#55655D]">No scheduled events this day.</p>
            ) : (
              dayEvents.map((e) => (
                <div key={e.id} className="rounded-[10px] border border-[#0F3D2E]/08 bg-white px-2.5 py-2">
                  <p className="m-0 font-sans text-[0.5625rem] font-semibold uppercase tracking-[0.08em] text-[#C9A961]">
                    {e.scope}
                  </p>
                  <p className="m-0 mt-0.5 font-sans text-[0.8125rem] font-semibold text-[#0F3D2E]">{e.title}</p>
                  <p className="m-0 mt-0.5 font-sans text-[0.625rem] text-[#55655D]">
                    {new Date(e.starts_at).toLocaleTimeString('en-US', {
                      hour: 'numeric',
                      minute: '2-digit',
                    })}
                    {e.assignee_email ? ` · ${e.assignee_email}` : ''}
                    {e.sync_to_office ? ' · Office sync' : ''}
                  </p>
                </div>
              ))
            )}
          </div>

          <div className="mt-auto flex flex-wrap gap-x-3 gap-y-1.5 pt-3 font-sans text-[0.625rem] text-[#55655D]">
            <span className="inline-flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-[#0F3D2E]" /> Individual
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-[#C9A961]" /> Executive
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-[#2F6F5E]" /> Team
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-[#8B6914]" /> Company
            </span>
          </div>
        </aside>
      </div>

      <AnimatePresence>
        {createOpen ? (
          <motion.div
            className="fixed inset-0 z-[70] flex items-center justify-center bg-[#0F3D2E]/45 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setCreateOpen(false)}
          >
            <motion.div
              className="w-full max-w-md rounded-[16px] bg-[#F7F3EE] p-4 shadow-[0_24px_60px_rgba(15,61,46,0.28)]"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 12 }}
              onClick={(e) => e.stopPropagation()}
            >
              <p className="m-0 font-sans text-[0.625rem] font-semibold uppercase tracking-[0.14em] text-[#C9A961]">
                New event
              </p>
              <h3 className="m-0 mt-1 font-medium text-[#0F3D2E]" style={{ ...displayFont, fontSize: '1.15rem' }}>
                Schedule for Office
              </h3>
              <div className="mt-3 space-y-2">
                <input
                  value={draft.title}
                  onChange={(e) => setDraft((d) => ({ ...d, title: e.target.value }))}
                  placeholder="Event title"
                  className="w-full rounded-[10px] border border-[#0F3D2E]/15 bg-white px-3 py-2 font-sans text-[0.8125rem] text-[#0F3D2E] outline-none"
                />
                <textarea
                  value={draft.description}
                  onChange={(e) => setDraft((d) => ({ ...d, description: e.target.value }))}
                  placeholder="Description (optional)"
                  rows={2}
                  className="w-full resize-none rounded-[10px] border border-[#0F3D2E]/15 bg-white px-3 py-2 font-sans text-[0.8125rem] text-[#0F3D2E] outline-none"
                />
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="date"
                    value={draft.date}
                    onChange={(e) => setDraft((d) => ({ ...d, date: e.target.value }))}
                    className="rounded-[10px] border border-[#0F3D2E]/15 bg-white px-3 py-2 font-sans text-[0.8125rem] text-[#0F3D2E] outline-none"
                  />
                  <input
                    type="time"
                    value={draft.time}
                    onChange={(e) => setDraft((d) => ({ ...d, time: e.target.value }))}
                    className="rounded-[10px] border border-[#0F3D2E]/15 bg-white px-3 py-2 font-sans text-[0.8125rem] text-[#0F3D2E] outline-none"
                  />
                </div>
                <select
                  value={draft.scope}
                  onChange={(e) =>
                    setDraft((d) => ({ ...d, scope: e.target.value as CalEvent['scope'] }))
                  }
                  className="w-full rounded-[10px] border border-[#0F3D2E]/15 bg-white px-3 py-2 font-sans text-[0.8125rem] text-[#0F3D2E] outline-none"
                >
                  <option value="company">Entire company</option>
                  <option value="team">Team</option>
                  <option value="executive">Executive</option>
                  <option value="individual">Selective employee</option>
                </select>
                {draft.scope === 'individual' ? (
                  <input
                    value={draft.assigneeEmail}
                    onChange={(e) => setDraft((d) => ({ ...d, assigneeEmail: e.target.value }))}
                    placeholder="Employee email"
                    className="w-full rounded-[10px] border border-[#0F3D2E]/15 bg-white px-3 py-2 font-sans text-[0.8125rem] text-[#0F3D2E] outline-none"
                  />
                ) : null}
                <label className="flex items-center gap-2 font-sans text-[0.75rem] text-[#0F3D2E]">
                  <input
                    type="checkbox"
                    checked={draft.syncToOffice}
                    onChange={(e) => setDraft((d) => ({ ...d, syncToOffice: e.target.checked }))}
                  />
                  Sync to Office subdomain
                </label>
              </div>
              <div className="mt-4 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setCreateOpen(false)}
                  className="rounded-[8px] border-0 bg-transparent px-3 py-1.5 font-sans text-[0.75rem] font-semibold text-[#55655D]"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={saving || !draft.title.trim() || (draft.scope === 'individual' && !draft.assigneeEmail.trim())}
                  onClick={() => void saveEvent()}
                  className="rounded-[8px] border-0 bg-[#0F3D2E] px-3 py-1.5 font-sans text-[0.75rem] font-semibold text-[#E8DFD6] disabled:opacity-45"
                >
                  {saving ? 'Saving…' : 'Create event'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
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
  const [page, setPage] = useState(0)
  const FILES_PAGE = 20
  const filePages = Math.max(1, Math.ceil(rows.length / FILES_PAGE))
  const pagedRows = rows.slice(page * FILES_PAGE, page * FILES_PAGE + FILES_PAGE)

  useEffect(() => {
    setPage(0)
  }, [folder, query, rows.length])

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
        <section className="flex min-h-0 flex-col overflow-hidden border-b border-[#0F3D2E]/08 lg:border-b-0 lg:border-r-0">
          {rows.length === 0 ? (
            <div className="flex h-full items-center justify-center p-4">
              <p className="m-0 text-center font-sans text-[0.8125rem] text-[#55655D]">
                {folder === 'medicare'
                  ? 'No Medicare.Reviews applications yet. They appear here when medicare.reviews POSTs to /api/enrollment/medicare with source tagging.'
                  : 'This folder is empty.'}
              </p>
            </div>
          ) : (
            <>
              <ul className="min-h-0 flex-1 space-y-2 overflow-y-auto p-2">
                {pagedRows.map((a) => {
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
              <div className="flex shrink-0 items-center justify-between border-t border-[#0F3D2E]/08 px-2 py-1.5">
                <span className="font-sans text-[0.625rem] font-semibold text-[#55655D]">
                  {page + 1} / {filePages}
                </span>
                <div className="flex gap-1.5">
                  <button
                    type="button"
                    disabled={page <= 0}
                    onClick={() => setPage((p) => Math.max(0, p - 1))}
                    className="rounded-[8px] border-0 bg-[#E8DFD6] px-2.5 py-1 font-sans text-[0.6875rem] font-semibold text-[#0F3D2E] disabled:opacity-40"
                  >
                    Prev
                  </button>
                  <button
                    type="button"
                    disabled={page >= filePages - 1}
                    onClick={() => setPage((p) => Math.min(filePages - 1, p + 1))}
                    className="rounded-[8px] border-0 bg-[#E8DFD6] px-2.5 py-1 font-sans text-[0.6875rem] font-semibold text-[#0F3D2E] disabled:opacity-40"
                  >
                    Next
                  </button>
                </div>
              </div>
            </>
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
  applications,
  careers,
  listings,
  hiringStats,
  onUpdateCareer,
  onListingsChange,
  onFlash,
}: {
  applications: Application[]
  careers: Career[]
  listings: CareerListingRow[]
  hiringStats: Record<string, number>
  onUpdateCareer: (id: string, status: string) => void | Promise<void>
  onListingsChange: (rows: CareerListingRow[]) => void
  onFlash: (msg: string | null) => void
}) {
  const [view, setView] = useState<WorkforceView>('command')
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
    <div className="flex h-full min-h-0 flex-col gap-2">
      <div className="flex shrink-0 flex-wrap gap-1.5">
        {(
          [
            { id: 'command' as const, label: 'Command' },
            { id: 'directory' as const, label: 'Profiles' },
            { id: 'hiring' as const, label: 'Applications' },
            { id: 'job-board' as const, label: 'Recruitment' },
            { id: 'contracting' as const, label: 'Contracting' },
          ] as const
        ).map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setView(t.id)}
            className={`rounded-full px-3 py-1.5 font-sans text-[0.75rem] font-semibold transition ${
              view === t.id
                ? 'bg-[#0F3D2E] text-white'
                : 'bg-[#E8DFD6] text-[#0F3D2E] hover:bg-[#E0D6CA]'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {view === 'command' ? (
        <div className="min-h-0 flex-1 overflow-hidden">
          <WorkforceDashboard
            applications={applications}
            careers={careers}
            listings={listings}
          />
        </div>
      ) : (
        <div className="min-h-0 flex-1 space-y-3 overflow-y-auto">
          {view === 'directory' && (
            <>
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <p className="m-0 font-sans text-[0.6875rem] font-semibold uppercase tracking-[0.14em] text-[#C9A961]">
                    Profiles
                  </p>
                  <p className="m-0 mt-0.5 font-sans text-[0.8125rem] text-[#55655D]">
                    Career applicants and hired workforce records
                  </p>
                </div>
                <input
                  value={profileQuery}
                  onChange={(e) => setProfileQuery(e.target.value)}
                  placeholder="Search employee profiles…"
                  className="w-full max-w-sm rounded-[12px] border border-[#0F3D2E]/15 bg-[#F7F3EE] px-3 py-2 font-sans text-[0.8125rem] text-[#0F3D2E] outline-none focus:border-[#0F3D2E] sm:w-72"
                />
              </div>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                {[
                  { label: 'Pipeline', value: careers.length },
                  { label: 'New', value: hiringStats.new ?? 0 },
                  { label: 'Interview+', value: (hiringStats.interview ?? 0) + (hiringStats.offer ?? 0) },
                  { label: 'Hired', value: hiringStats.hired ?? 0 },
                ].map((s) => (
                  <div key={s.label} className="rounded-[14px] border border-[#0F3D2E]/08 bg-[#FAFCFB] px-3 py-3">
                    <p className="m-0 font-sans text-[0.6875rem] font-semibold uppercase tracking-[0.1em] text-[#55655D]">
                      {s.label}
                    </p>
                    <p className="m-0 mt-1 font-sans text-[1.4rem] font-semibold text-[#0F3D2E]">{s.value}</p>
                  </div>
                ))}
              </div>
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
            </>
          )}

          {view === 'hiring' && <CareersTable rows={careers} onUpdateStatus={onUpdateCareer} />}
          {view === 'job-board' && (
            <JobBoardEditor rows={listings} onChange={onListingsChange} onFlash={onFlash} />
          )}
          {view === 'contracting' && <ContractingPanel />}
        </div>
      )}
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
  const [page, setPage] = useState(1)
  const PAGE_SIZE = 4

  const pageCount = Math.max(1, Math.ceil(rows.length / PAGE_SIZE))
  const pageSafe = Math.min(page, pageCount)
  const pageRows = rows.slice((pageSafe - 1) * PAGE_SIZE, pageSafe * PAGE_SIZE)

  useEffect(() => {
    if (page > pageCount) setPage(pageCount)
  }, [page, pageCount])

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
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
      <div className={cardClass}>
        <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
          <div>
            <p className="m-0 font-sans text-[0.75rem] font-semibold uppercase tracking-[0.14em] text-[#C9A961]">
              Recruitment editor
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

      <div className="flex min-h-0 flex-col gap-3">
        {rows.length === 0 ? (
          <div className={cardClass}>
            <p className="m-0 font-sans text-[0.9375rem] text-[#55655D]">
              No job listings yet. Add one in the editor — it will appear on the public careers page.
            </p>
          </div>
        ) : (
          pageRows.map((row) => (
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

        {rows.length > PAGE_SIZE ? (
          <div className="flex items-center justify-between gap-2 px-1">
            <p className="m-0 font-sans text-[0.75rem] text-[#55655D]">
              Page {pageSafe} of {pageCount} · {rows.length} listings
            </p>
            <div className="flex gap-2">
              <button
                type="button"
                disabled={pageSafe <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className="rounded-[8px] border border-[#0F3D2E]/20 px-3 py-1.5 font-sans text-[0.75rem] font-semibold text-[#0F3D2E] disabled:opacity-40"
              >
                Previous
              </button>
              <button
                type="button"
                disabled={pageSafe >= pageCount}
                onClick={() => setPage((p) => Math.min(pageCount, p + 1))}
                className="rounded-[8px] border border-[#0F3D2E]/20 px-3 py-1.5 font-sans text-[0.75rem] font-semibold text-[#0F3D2E] disabled:opacity-40"
              >
                Next
              </button>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  )
}
