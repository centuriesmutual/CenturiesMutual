'use client'

import { useEffect, useMemo, useState } from 'react'

const displayFont = { fontFamily: "'Playfair Display', Georgia, serif" } as const
const cardClass =
  'rounded-[16px] border border-[#0F3D2E]/10 bg-white p-4 shadow-[0_1px_0_rgba(15,61,46,0.04)] sm:p-5'
const fieldClass =
  'w-full rounded-[10px] border border-[#0F3D2E]/15 bg-[#FAFCFB] px-3 py-2 font-sans text-[0.8125rem] text-[#0F3D2E] outline-none focus:border-[#0F3D2E]'

type ContractStatus = 'draft' | 'sent' | 'signed' | 'active' | 'expired' | 'terminated'
type ContractType = 'producer_1099' | 'ga_agreement' | 'vendor' | 'employment' | 'nda'

type WorkforceContract = {
  id: string
  party_name: string
  email: string
  contract_type: ContractType
  status: ContractStatus
  effective_date: string
  end_date: string
  commission_rate: string
  states: string
  npn: string
  notes: string
  updated_at: string
}

const STORAGE_KEY = 'cm.workforce.contracts.v1'
const PAGE_SIZE = 5

const CONTRACT_TYPES: { value: ContractType; label: string }[] = [
  { value: 'producer_1099', label: 'Producer (1099)' },
  { value: 'ga_agreement', label: 'GA / Upline agreement' },
  { value: 'vendor', label: 'Vendor' },
  { value: 'employment', label: 'Employment' },
  { value: 'nda', label: 'NDA' },
]

const CONTRACT_STATUSES: { value: ContractStatus; label: string }[] = [
  { value: 'draft', label: 'Draft' },
  { value: 'sent', label: 'Sent' },
  { value: 'signed', label: 'Signed' },
  { value: 'active', label: 'Active' },
  { value: 'expired', label: 'Expired' },
  { value: 'terminated', label: 'Terminated' },
]

const EMPTY: Omit<WorkforceContract, 'id' | 'updated_at'> = {
  party_name: '',
  email: '',
  contract_type: 'producer_1099',
  status: 'draft',
  effective_date: '',
  end_date: '',
  commission_rate: '',
  states: '',
  npn: '',
  notes: '',
}

function loadContracts(): WorkforceContract[] {
  if (typeof window === 'undefined') return []
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw) as WorkforceContract[]
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

function saveContracts(rows: WorkforceContract[]) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(rows))
}

export function ContractingPanel() {
  const [rows, setRows] = useState<WorkforceContract[]>([])
  const [draft, setDraft] = useState({ ...EMPTY })
  const [editingId, setEditingId] = useState<string | null>(null)
  const [query, setQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<'all' | ContractStatus>('all')
  const [page, setPage] = useState(1)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    setRows(loadContracts())
    setReady(true)
  }, [])

  useEffect(() => {
    if (!ready) return
    saveContracts(rows)
  }, [rows, ready])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return rows
      .filter((r) => (statusFilter === 'all' ? true : r.status === statusFilter))
      .filter((r) => {
        if (!q) return true
        return [r.party_name, r.email, r.npn, r.states, r.contract_type, r.notes]
          .join(' ')
          .toLowerCase()
          .includes(q)
      })
      .sort((a, b) => +new Date(b.updated_at) - +new Date(a.updated_at))
  }, [rows, query, statusFilter])

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const pageSafe = Math.min(page, pageCount)
  const pageRows = filtered.slice((pageSafe - 1) * PAGE_SIZE, pageSafe * PAGE_SIZE)

  useEffect(() => {
    setPage(1)
  }, [query, statusFilter])

  const resetDraft = () => {
    setEditingId(null)
    setDraft({ ...EMPTY })
  }

  const startEdit = (row: WorkforceContract) => {
    setEditingId(row.id)
    setDraft({
      party_name: row.party_name,
      email: row.email,
      contract_type: row.contract_type,
      status: row.status,
      effective_date: row.effective_date,
      end_date: row.end_date,
      commission_rate: row.commission_rate,
      states: row.states,
      npn: row.npn,
      notes: row.notes,
    })
  }

  const save = () => {
    if (!draft.party_name.trim()) return
    const now = new Date().toISOString()
    if (editingId) {
      setRows((prev) =>
        prev.map((r) => (r.id === editingId ? { ...r, ...draft, updated_at: now } : r)),
      )
    } else {
      setRows((prev) => [
        {
          id: `ctr_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 7)}`,
          ...draft,
          updated_at: now,
        },
        ...prev,
      ])
    }
    resetDraft()
  }

  const remove = (id: string) => {
    if (!window.confirm('Delete this contract record?')) return
    setRows((prev) => prev.filter((r) => r.id !== id))
    if (editingId === id) resetDraft()
  }

  const counts = useMemo(() => {
    const c: Record<string, number> = { all: rows.length }
    for (const s of CONTRACT_STATUSES) c[s.value] = 0
    for (const r of rows) c[r.status] = (c[r.status] ?? 0) + 1
    return c
  }, [rows])

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-end justify-between gap-2">
        <div>
          <p className="m-0 font-sans text-[0.6875rem] font-semibold uppercase tracking-[0.14em] text-[#C9A961]">
            Contracting
          </p>
          <h2 className="m-0 mt-0.5 font-medium text-[#0F3D2E]" style={{ ...displayFont, fontSize: '1.25rem' }}>
            Producer & workforce agreements
          </h2>
        </div>
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search name, NPN, states…"
          className="w-full max-w-sm rounded-[12px] border border-[#0F3D2E]/15 bg-[#F7F3EE] px-3 py-2 font-sans text-[0.8125rem] text-[#0F3D2E] outline-none focus:border-[#0F3D2E] sm:w-72"
        />
      </div>

      <div className="flex flex-wrap gap-1.5">
        <button
          type="button"
          onClick={() => setStatusFilter('all')}
          className={`rounded-full border-0 px-2.5 py-1 font-sans text-[0.625rem] font-semibold ${
            statusFilter === 'all' ? 'bg-[#0F3D2E] text-[#E8DFD6]' : 'bg-[#E8DFD6] text-[#0F3D2E]'
          }`}
        >
          All · {counts.all}
        </button>
        {CONTRACT_STATUSES.map((s) => (
          <button
            key={s.value}
            type="button"
            onClick={() => setStatusFilter(s.value)}
            className={`rounded-full border-0 px-2.5 py-1 font-sans text-[0.625rem] font-semibold ${
              statusFilter === s.value ? 'bg-[#0F3D2E] text-[#E8DFD6]' : 'bg-[#E8DFD6] text-[#0F3D2E]'
            }`}
          >
            {s.label} · {counts[s.value] ?? 0}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
        <div className={cardClass}>
          <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
            <div>
              <p className="m-0 font-sans text-[0.75rem] font-semibold uppercase tracking-[0.14em] text-[#C9A961]">
                Contract editor
              </p>
              <h3
                className="m-0 mt-1 font-medium text-[#0F3D2E]"
                style={{ ...displayFont, fontSize: '1.1rem' }}
              >
                {editingId ? 'Edit contract' : 'New contract'}
              </h3>
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
                Party name
              </label>
              <input
                className={fieldClass}
                value={draft.party_name}
                onChange={(e) => setDraft((d) => ({ ...d, party_name: e.target.value }))}
                placeholder="e.g. Sarah Johnson"
              />
            </div>
            <div>
              <label className="mb-1 block font-sans text-[0.75rem] font-semibold text-[#0F3D2E]">
                Email
              </label>
              <input
                className={fieldClass}
                value={draft.email}
                onChange={(e) => setDraft((d) => ({ ...d, email: e.target.value }))}
              />
            </div>
            <div>
              <label className="mb-1 block font-sans text-[0.75rem] font-semibold text-[#0F3D2E]">
                NPN
              </label>
              <input
                className={fieldClass}
                value={draft.npn}
                onChange={(e) => setDraft((d) => ({ ...d, npn: e.target.value }))}
              />
            </div>
            <div>
              <label className="mb-1 block font-sans text-[0.75rem] font-semibold text-[#0F3D2E]">
                Contract type
              </label>
              <select
                className={fieldClass}
                value={draft.contract_type}
                onChange={(e) =>
                  setDraft((d) => ({ ...d, contract_type: e.target.value as ContractType }))
                }
              >
                {CONTRACT_TYPES.map((t) => (
                  <option key={t.value} value={t.value}>
                    {t.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1 block font-sans text-[0.75rem] font-semibold text-[#0F3D2E]">
                Status
              </label>
              <select
                className={fieldClass}
                value={draft.status}
                onChange={(e) =>
                  setDraft((d) => ({ ...d, status: e.target.value as ContractStatus }))
                }
              >
                {CONTRACT_STATUSES.map((s) => (
                  <option key={s.value} value={s.value}>
                    {s.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1 block font-sans text-[0.75rem] font-semibold text-[#0F3D2E]">
                Effective date
              </label>
              <input
                type="date"
                className={fieldClass}
                value={draft.effective_date}
                onChange={(e) => setDraft((d) => ({ ...d, effective_date: e.target.value }))}
              />
            </div>
            <div>
              <label className="mb-1 block font-sans text-[0.75rem] font-semibold text-[#0F3D2E]">
                End date
              </label>
              <input
                type="date"
                className={fieldClass}
                value={draft.end_date}
                onChange={(e) => setDraft((d) => ({ ...d, end_date: e.target.value }))}
              />
            </div>
            <div>
              <label className="mb-1 block font-sans text-[0.75rem] font-semibold text-[#0F3D2E]">
                Commission rate
              </label>
              <input
                className={fieldClass}
                value={draft.commission_rate}
                onChange={(e) => setDraft((d) => ({ ...d, commission_rate: e.target.value }))}
                placeholder="e.g. 70% / override 5%"
              />
            </div>
            <div>
              <label className="mb-1 block font-sans text-[0.75rem] font-semibold text-[#0F3D2E]">
                Licensed states
              </label>
              <input
                className={fieldClass}
                value={draft.states}
                onChange={(e) => setDraft((d) => ({ ...d, states: e.target.value }))}
                placeholder="TX, FL, GA"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="mb-1 block font-sans text-[0.75rem] font-semibold text-[#0F3D2E]">
                Notes
              </label>
              <textarea
                className={`${fieldClass} min-h-[88px] resize-y`}
                value={draft.notes}
                onChange={(e) => setDraft((d) => ({ ...d, notes: e.target.value }))}
              />
            </div>
          </div>

          <button
            type="button"
            disabled={!draft.party_name.trim()}
            onClick={save}
            className="mt-4 inline-flex rounded-[10px] bg-[#0F3D2E] px-4 py-2.5 font-sans text-[0.875rem] font-semibold text-white transition hover:bg-[#0A2E22] disabled:opacity-50"
          >
            {editingId ? 'Save contract' : 'Add contract'}
          </button>
        </div>

        <div className="space-y-3">
          {pageRows.length === 0 ? (
            <div className={cardClass}>
              <p className="m-0 font-sans text-[0.875rem] text-[#55655D]">
                {rows.length === 0
                  ? 'No contracts yet. Add a producer or vendor agreement to start tracking.'
                  : 'No contracts match that filter.'}
              </p>
            </div>
          ) : (
            pageRows.map((row) => (
              <div key={row.id} className={cardClass}>
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="m-0 font-sans text-[0.9375rem] font-semibold text-[#0F3D2E]">
                        {row.party_name}
                      </p>
                      <span className="inline-flex rounded-full bg-[#0F3D2E]/[0.08] px-2.5 py-1 font-sans text-[0.6875rem] font-semibold uppercase text-[#0F3D2E]">
                        {row.status}
                      </span>
                    </div>
                    <p className="m-0 mt-1 font-sans text-[0.8125rem] text-[#55655D]">
                      {CONTRACT_TYPES.find((t) => t.value === row.contract_type)?.label || row.contract_type}
                      {row.email ? ` · ${row.email}` : ''}
                      {row.npn ? ` · NPN ${row.npn}` : ''}
                    </p>
                    <p className="m-0 mt-0.5 font-sans text-[0.75rem] text-[#55655D]/80">
                      {row.effective_date || 'No effective date'}
                      {row.end_date ? ` → ${row.end_date}` : ''}
                      {row.commission_rate ? ` · ${row.commission_rate}` : ''}
                      {row.states ? ` · ${row.states}` : ''}
                    </p>
                    {row.notes ? (
                      <p className="m-0 mt-2 font-sans text-[0.8125rem] leading-[1.5] text-[#55655D]">
                        {row.notes}
                      </p>
                    ) : null}
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
                      onClick={() => remove(row.id)}
                      className="rounded-[10px] border border-[#B42318]/30 px-3 py-2 font-sans text-[0.8125rem] font-semibold text-[#B42318]"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}

          {filtered.length > PAGE_SIZE ? (
            <div className="flex items-center justify-between gap-2 px-1">
              <p className="m-0 font-sans text-[0.75rem] text-[#55655D]">
                Page {pageSafe} of {pageCount} · {filtered.length} contracts
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
    </div>
  )
}
