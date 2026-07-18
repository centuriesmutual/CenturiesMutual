'use client'

import { useMemo, useState } from 'react'

type EnrollmentFlag = {
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

type StateFlag = {
  id: string
  state_code: string
  state_name: string
  enabled: boolean
  licensed: boolean
  display_order: number
  updated_at: string
  status: string
}

const cardClass = 'rounded-2xl border border-[#14432A]/10 bg-white p-5 shadow-sm'
const fieldClass =
  'w-full rounded-[10px] border border-[#14432A]/15 bg-[#FAFCFB] px-3 py-2 font-sans text-[0.875rem] text-[#14432A] outline-none focus:border-[#0F3D2E]'

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

export function AcaEnrollmentFlagsPanel({
  flags,
  onChange,
  onFlash,
}: {
  flags: EnrollmentFlag[]
  onChange: (flags: EnrollmentFlag[]) => void
  onFlash: (msg: string | null) => void
}) {
  const [busyKey, setBusyKey] = useState<string | null>(null)

  const save = async (flag: EnrollmentFlag, patch: Partial<EnrollmentFlag>) => {
    setBusyKey(flag.key)
    onFlash(null)
    try {
      const res = await fetch('/api/admin/aca-flags', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          key: flag.key,
          enabled: patch.enabled ?? flag.enabled,
          start_date:
            patch.start_date !== undefined ? patch.start_date : flag.start_date,
          end_date: patch.end_date !== undefined ? patch.end_date : flag.end_date,
        }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok || !data?.ok) {
        onFlash(data?.error || 'Could not save flag.')
        return
      }
      onChange(flags.map((f) => (f.key === flag.key ? { ...f, ...data.flag } : f)))
      onFlash(`${flag.name} saved.`)
    } finally {
      setBusyKey(null)
    }
  }

  return (
    <div className="space-y-4">
      <p className="m-0 font-sans text-[0.875rem] text-[#55655D]">
        Control ACA Open Enrollment and Special Enrollment without redeploying. Backend
        enforcement uses these flags as the source of truth.
      </p>
      {flags.length === 0 ? (
        <p className="font-sans text-[0.9375rem] text-[#55655D]">No ACA enrollment flags found.</p>
      ) : (
        flags.map((flag) => (
          <div key={flag.id} className={cardClass}>
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="min-w-0 max-w-2xl">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="m-0 font-sans text-[1rem] font-semibold text-[#14432A]">
                    {flag.name}
                  </h3>
                  <span
                    className={`inline-flex rounded-full px-2.5 py-1 font-sans text-[0.6875rem] font-semibold uppercase ${
                      flag.active
                        ? 'bg-[#0F3D2E]/12 text-[#0F3D2E]'
                        : 'bg-[#14432A]/10 text-[#55655D]'
                    }`}
                  >
                    {flag.active ? 'Currently active' : 'Inactive'}
                  </span>
                </div>
                <p className="m-0 mt-1 font-mono text-[0.75rem] text-[#55655D]">{flag.key}</p>
                <p className="m-0 mt-2 font-sans text-[0.8125rem] leading-[1.55] text-[#55655D]">
                  {flag.description}
                </p>
                <p className="m-0 mt-2 font-sans text-[0.75rem] text-[#55655D]/80">
                  Updated {fmtDate(flag.updated_at)}
                </p>
              </div>
              <label className="flex items-center gap-2 font-sans text-[0.875rem] font-semibold text-[#14432A]">
                <input
                  type="checkbox"
                  checked={flag.enabled}
                  disabled={busyKey === flag.key}
                  onChange={(e) => void save(flag, { enabled: e.target.checked })}
                  className="h-4 w-4 accent-[#0F3D2E]"
                />
                Enabled
              </label>
            </div>

            {flag.key === 'ACA_OEP_ENABLED' ? (
              <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
                <div>
                  <label className="mb-1 block font-sans text-[0.75rem] font-semibold text-[#14432A]">
                    Start date
                  </label>
                  <input
                    type="date"
                    className={fieldClass}
                    value={flag.start_date ?? ''}
                    disabled={busyKey === flag.key}
                    onChange={(e) =>
                      void save(flag, { start_date: e.target.value || null })
                    }
                  />
                </div>
                <div>
                  <label className="mb-1 block font-sans text-[0.75rem] font-semibold text-[#14432A]">
                    End date
                  </label>
                  <input
                    type="date"
                    className={fieldClass}
                    value={flag.end_date ?? ''}
                    disabled={busyKey === flag.key}
                    onChange={(e) => void save(flag, { end_date: e.target.value || null })}
                  />
                </div>
                <div className="flex items-end">
                  <p className="m-0 font-sans text-[0.8125rem] text-[#55655D]">
                    OEP is active only when Enabled is on and today falls within the date range
                    (America/Chicago).
                  </p>
                </div>
              </div>
            ) : null}
          </div>
        ))
      )}
    </div>
  )
}

export function AcaStateLicensingPanel({
  states,
  onChange,
  onFlash,
}: {
  states: StateFlag[]
  onChange: (states: StateFlag[]) => void
  onFlash: (msg: string | null) => void
}) {
  const [query, setQuery] = useState('')
  const [filter, setFilter] = useState<
    'all' | 'licensed' | 'not_licensed' | 'enabled' | 'disabled'
  >('all')
  const [busyId, setBusyId] = useState<string | null>(null)

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase()
    return states
      .filter((s) => {
        if (filter === 'licensed' && !s.licensed) return false
        if (filter === 'not_licensed' && s.licensed) return false
        if (filter === 'enabled' && !s.enabled) return false
        if (filter === 'disabled' && s.enabled) return false
        if (!q) return true
        return (
          s.state_name.toLowerCase().includes(q) ||
          s.state_code.toLowerCase().includes(q)
        )
      })
      .sort((a, b) => a.state_name.localeCompare(b.state_name))
  }, [states, query, filter])

  const patch = async (row: StateFlag, updates: Partial<StateFlag>) => {
    setBusyId(row.id)
    onFlash(null)
    try {
      const res = await fetch('/api/admin/aca-states', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: row.id,
          licensed: updates.licensed ?? row.licensed,
          enabled: updates.enabled ?? row.enabled,
        }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok || !data?.ok) {
        onFlash(data?.error || 'Could not update state.')
        return
      }
      onChange(states.map((s) => (s.id === row.id ? { ...s, ...data.state } : s)))
      onFlash(`${row.state_name} updated.`)
    } finally {
      setBusyId(null)
    }
  }

  return (
    <div className="space-y-4">
      <p className="m-0 font-sans text-[0.875rem] text-[#55655D]">
        A state is available for ACA enrollment only when it is both licensed and enrollment-enabled.
        Backend rejects submissions from unavailable states.
      </p>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div className="w-full sm:max-w-sm">
          <label className="mb-1 block font-sans text-[0.75rem] font-semibold text-[#14432A]">
            Search states
          </label>
          <input
            className={fieldClass}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Texas, TX…"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          {(
            [
              ['all', 'All'],
              ['licensed', 'Licensed'],
              ['not_licensed', 'Not Licensed'],
              ['enabled', 'Enabled'],
              ['disabled', 'Disabled'],
            ] as const
          ).map(([id, label]) => (
            <button
              key={id}
              type="button"
              onClick={() => setFilter(id)}
              className={`rounded-full px-3 py-1.5 font-sans text-[0.75rem] font-semibold transition ${
                filter === id
                  ? 'bg-[#0F3D2E] text-white'
                  : 'bg-white text-[#14432A] hover:bg-[#0F3D2E]/[0.06]'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-[#14432A]/10 bg-white shadow-sm">
        <table className="min-w-full border-collapse text-left">
          <thead>
            <tr className="border-b border-[#E8DFD6] bg-[#F4F1EC]">
              {['State', 'Licensed', 'Enrollment Enabled', 'Status', 'Last Updated'].map((h) => (
                <th
                  key={h}
                  className="px-4 py-3 font-sans text-[0.6875rem] font-semibold uppercase tracking-[0.1em] text-[#55655D]"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {visible.map((row) => (
              <tr key={row.id} className="border-b border-[#E8DFD6] last:border-b-0">
                <td className="px-4 py-3">
                  <p className="m-0 font-sans text-[0.875rem] font-semibold text-[#14432A]">
                    {row.state_name}
                  </p>
                  <p className="m-0 font-mono text-[0.75rem] text-[#55655D]">{row.state_code}</p>
                </td>
                <td className="px-4 py-3">
                  <input
                    type="checkbox"
                    checked={row.licensed}
                    disabled={busyId === row.id}
                    onChange={(e) => void patch(row, { licensed: e.target.checked })}
                    className="h-4 w-4 accent-[#0F3D2E]"
                    aria-label={`${row.state_name} licensed`}
                  />
                </td>
                <td className="px-4 py-3">
                  <input
                    type="checkbox"
                    checked={row.enabled}
                    disabled={busyId === row.id}
                    onChange={(e) => void patch(row, { enabled: e.target.checked })}
                    className="h-4 w-4 accent-[#0F3D2E]"
                    aria-label={`${row.state_name} enrollment enabled`}
                  />
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`inline-flex rounded-full px-2.5 py-1 font-sans text-[0.6875rem] font-semibold uppercase ${
                      row.licensed && row.enabled
                        ? 'bg-[#0F3D2E]/12 text-[#0F3D2E]'
                        : 'bg-[#14432A]/10 text-[#55655D]'
                    }`}
                  >
                    {row.status}
                  </span>
                </td>
                <td className="px-4 py-3 font-sans text-[0.8125rem] text-[#55655D]">
                  {fmtDate(row.updated_at)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {visible.length === 0 ? (
          <p className="px-4 py-6 font-sans text-[0.875rem] text-[#55655D]">No states match.</p>
        ) : null}
      </div>
    </div>
  )
}
