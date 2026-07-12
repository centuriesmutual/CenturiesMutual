'use client'

import { useMemo, useState } from 'react'
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline'

import type { LedgerEntry } from '@/lib/wallet-ledger'

const PAGE_SIZE = 10

const usd = (n: number) =>
  n.toLocaleString('en-US', { style: 'currency', currency: 'USD' })

export function TransactionHistory({
  entries,
}: {
  entries: ReadonlyArray<LedgerEntry>
}) {
  const [page, setPage] = useState(0)
  const totalPages = Math.max(1, Math.ceil(entries.length / PAGE_SIZE))
  const safePage = Math.min(page, totalPages - 1)

  const slice = useMemo(() => {
    const start = safePage * PAGE_SIZE
    return entries.slice(start, start + PAGE_SIZE)
  }, [entries, safePage])

  return (
    <div>
      <p className="mb-2 font-sans text-[11px] font-semibold uppercase tracking-[0.22em] text-[#C9A53E]">
        Ledger
      </p>
      <h1
        className="mb-6 font-medium text-[#14432A]"
        style={{
          fontFamily: "'Playfair Display', Georgia, serif",
          fontSize: 'clamp(1.6rem, 3vw, 2.1rem)',
        }}
      >
        Recent activity
      </h1>

      <div className="rounded-2xl bg-[#14432A]/[0.04]">
        {entries.length === 0 ? (
          <p className="m-0 px-5 py-10 text-center font-sans text-[0.875rem] text-[#55655D]">
            No activity yet. Your ledger will appear here once rewards or settlements post.
          </p>
        ) : (
          <div className="divide-y divide-[#14432A]/[0.08]">
            {slice.map((t) => (
              <div
                key={t.id}
                className="flex items-center justify-between gap-4 px-5 py-3.5"
              >
                <div className="min-w-0">
                  <p className="m-0 truncate font-sans text-[0.875rem] font-medium text-[#14432A]">
                    {t.label}
                  </p>
                  <p className="m-0 font-sans text-[0.75rem] text-[#55655D]">
                    {t.detail} · {t.date}
                  </p>
                </div>
                <p
                  className={`m-0 shrink-0 font-sans text-[0.875rem] font-semibold tabular-nums ${
                    t.amount >= 0 ? 'text-[#1F7A4D]' : 'text-[#14432A]'
                  }`}
                >
                  {t.amount >= 0 ? '+' : ''}
                  {usd(t.amount)}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      {entries.length > PAGE_SIZE ? (
        <div className="mt-4 flex items-center justify-between gap-3">
          <button
            type="button"
            disabled={safePage === 0}
            onClick={() => setPage((p) => Math.max(0, p - 1))}
            className="inline-flex items-center gap-1 border-0 bg-transparent p-0 font-sans text-[0.8125rem] font-semibold text-[#14432A] disabled:opacity-35"
          >
            <ChevronLeftIcon className="h-4 w-4" />
            Previous
          </button>
          <p className="m-0 font-sans text-[0.75rem] text-[#55655D]">
            Page {safePage + 1} of {totalPages}
          </p>
          <button
            type="button"
            disabled={safePage >= totalPages - 1}
            onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
            className="inline-flex items-center gap-1 border-0 bg-transparent p-0 font-sans text-[0.8125rem] font-semibold text-[#14432A] disabled:opacity-35"
          >
            Next
            <ChevronRightIcon className="h-4 w-4" />
          </button>
        </div>
      ) : null}
    </div>
  )
}
