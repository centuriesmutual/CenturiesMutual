'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import {
  loadAdminMap,
  setAdminEnrollmentStatus,
  type AdminEnrollmentRecord,
} from '@/lib/member-profile'
import type { EnrolledPlan } from '@/components/dashboard/enrollment-flow'

const STATUSES: EnrolledPlan['status'][] = ['Pending review', 'Active', 'Inactive']

export default function AdminPage() {
  const [records, setRecords] = useState<AdminEnrollmentRecord[]>([])
  const [message, setMessage] = useState<string | null>(null)

  const refresh = () => {
    const map = loadAdminMap()
    setRecords(Object.values(map).sort((a, b) => b.submittedAt.localeCompare(a.submittedAt)))
  }

  useEffect(() => {
    refresh()
  }, [])

  const updateStatus = (planId: string, status: EnrolledPlan['status']) => {
    const ok = setAdminEnrollmentStatus(planId, status)
    setMessage(ok ? `Updated ${planId} to ${status}.` : `Plan ${planId} not found.`)
    refresh()
  }

  return (
    <main className="min-h-dvh bg-[#FAFCFB] px-4 py-10 sm:px-6">
      <div className="mx-auto max-w-4xl">
        <p className="mb-2 font-sans text-[11px] font-semibold uppercase tracking-[0.22em] text-[#C9A53E]">
          Administration
        </p>
        <h1
          className="mb-2 font-medium text-[#14432A]"
          style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: '1.75rem' }}
        >
          Enrollment control
        </h1>
        <p className="mb-6 font-sans text-[0.875rem] text-[#55655D]">
          Update enrollment status by plan ID. Changes sync to the member&apos;s Wallet settings
          when they reload.
        </p>

        {message ? (
          <p className="mb-4 rounded-[10px] bg-[#14432A]/[0.06] px-4 py-3 font-sans text-[0.875rem] text-[#14432A]">
            {message}
          </p>
        ) : null}

        {records.length === 0 ? (
          <p className="font-sans text-[0.875rem] text-[#55655D]">
            No enrollments yet. Members appear here after submitting an enrollment from Wallet.
          </p>
        ) : (
          <div className="space-y-3">
            {records.map((r) => (
              <div
                key={r.planId}
                className="rounded-2xl border border-[#14432A]/10 bg-white p-5"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="m-0 font-sans text-[0.9375rem] font-semibold text-[#14432A]">
                      {r.name}
                    </p>
                    <p className="m-0 font-sans text-[0.8125rem] text-[#55655D]">
                      {r.planId} · {r.member} · effective {r.effectiveDate}
                    </p>
                  </div>
                  <select
                    value={r.status}
                    onChange={(e) =>
                      updateStatus(r.planId, e.target.value as EnrolledPlan['status'])
                    }
                    className="rounded-[10px] border border-[#14432A]/15 bg-[#FAFCFB] px-3 py-2 font-sans text-[0.8125rem] font-semibold text-[#14432A]"
                  >
                    {STATUSES.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            ))}
          </div>
        )}

        <Link
          href="/wallet"
          className="mt-8 inline-flex font-sans text-[0.8125rem] font-semibold text-[#0F3D2E] no-underline hover:underline"
        >
          ← Back to Wallet
        </Link>
      </div>
    </main>
  )
}
