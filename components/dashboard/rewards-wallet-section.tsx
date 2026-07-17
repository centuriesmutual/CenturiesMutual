'use client'

import { useCallback, useEffect, useState } from 'react'
import {
  getRewardsBalance,
  getRewardsHistory,
  getWalletStatus,
  LedgerBridgeError,
  type RewardsBalance,
  type RewardsHistory,
  type WalletStatus,
} from '@/lib/ledgerBridge'

type LoadState = 'loading' | 'ready' | 'error'

interface ErrorView {
  message: string
  retryable: boolean
  comingSoon: boolean
}

function toErrorView(err: unknown): ErrorView {
  if (err instanceof LedgerBridgeError) {
    return {
      message: err.message,
      // Only ledger-category outages get the retry affordance.
      retryable: err.category === 'ledger' && err.retryable,
      comingSoon: err.isComingSoon,
    }
  }
  return {
    message: 'Something went wrong. Please try again.',
    retryable: true,
    comingSoon: false,
  }
}

const creditFmt = (n: number) =>
  `${n.toLocaleString('en-US', { maximumFractionDigits: 2 })} CM`

function SectionShell({ children }: { children: React.ReactNode }) {
  return (
    <section className="mt-6 rounded-2xl bg-[#14432A]/[0.06] p-5 sm:p-6">
      <p className="m-0 font-sans text-[0.75rem] font-semibold uppercase tracking-[0.12em] text-[#8A958D]">
        Rewards Wallet
      </p>
      {children}
    </section>
  )
}

export function RewardsWalletSection() {
  const [state, setState] = useState<LoadState>('loading')
  const [wallet, setWallet] = useState<WalletStatus | null>(null)
  const [balance, setBalance] = useState<RewardsBalance | null>(null)
  const [history, setHistory] = useState<RewardsHistory | null>(null)
  const [error, setError] = useState<ErrorView | null>(null)

  const load = useCallback(async () => {
    setState('loading')
    setError(null)
    try {
      const status = await getWalletStatus()
      setWallet(status)

      if (status.status === 'active') {
        const [bal, hist] = await Promise.all([
          getRewardsBalance(),
          getRewardsHistory(),
        ])
        setBalance(bal)
        setHistory(hist)
      } else {
        setBalance(null)
        setHistory(null)
      }
      setState('ready')
    } catch (err) {
      setError(toErrorView(err))
      setState('error')
    }
  }, [])

  useEffect(() => {
    void load()
  }, [load])

  if (state === 'loading') {
    return (
      <SectionShell>
        <p className="mb-0 mt-3 font-sans text-[0.875rem] text-[#55655D]">
          Loading your rewards wallet…
        </p>
      </SectionShell>
    )
  }

  if (state === 'error' && error) {
    return (
      <SectionShell>
        {error.comingSoon ? (
          <>
            <p className="mb-1 mt-3 font-sans text-[0.9375rem] font-semibold text-[#14432A]">
              Coming soon
            </p>
            <p className="mb-0 font-sans text-[0.875rem] text-[#55655D]">
              Rewards are being prepared and will appear here shortly.
            </p>
          </>
        ) : (
          <>
            <p className="mb-0 mt-3 font-sans text-[0.875rem] text-[#8A3B3B]">
              {error.message}
            </p>
            {error.retryable ? (
              <button
                type="button"
                onClick={() => void load()}
                className="mt-3 inline-flex items-center justify-center rounded-full bg-[#0F3D2E] px-4 py-2 font-sans text-[0.8125rem] font-semibold text-[#FAFCFB] transition hover:bg-[#0A2E22]"
              >
                Try again
              </button>
            ) : null}
          </>
        )}
      </SectionShell>
    )
  }

  if (!wallet) return null

  if (wallet.status === 'inactive') {
    return (
      <SectionShell>
        <div className="mt-2 flex items-center gap-2">
          <span className="h-2 w-2 shrink-0 rounded-full bg-[#C9A53E]" aria-hidden />
          <p className="m-0 font-sans text-[0.9375rem] font-semibold text-[#14432A]">
            Pending activation
          </p>
        </div>
        <p className="mb-0 mt-2 font-sans text-[0.875rem] text-[#55655D]">
          Your rewards wallet activates after your ACA enrollment is confirmed.
          You&apos;ll see your balance and history here once it&apos;s live.
        </p>
      </SectionShell>
    )
  }

  if (wallet.status === 'suspended') {
    return (
      <SectionShell>
        <div className="mt-2 flex items-center gap-2">
          <span className="h-2 w-2 shrink-0 rounded-full bg-[#E24B4B]" aria-hidden />
          <p className="m-0 font-sans text-[0.9375rem] font-semibold text-[#14432A]">
            Wallet suspended
          </p>
        </div>
        <p className="mb-0 mt-2 font-sans text-[0.875rem] text-[#55655D]">
          Your rewards wallet is currently suspended. Please contact support for
          help restoring access.
        </p>
      </SectionShell>
    )
  }

  const entries = history?.entries ?? []

  return (
    <SectionShell>
      <div className="mt-2 flex items-center gap-2">
        <span className="h-2 w-2 shrink-0 rounded-full bg-[#3DDC84]" aria-hidden />
        <p className="m-0 font-sans text-[0.8125rem] font-semibold text-[#1F7A4D]">
          Active
        </p>
      </div>

      <p className="m-0 mt-3 font-sans text-[0.75rem] font-medium uppercase tracking-[0.12em] text-[#8A958D]">
        Rewards balance
      </p>
      <h2
        className="m-0 mt-1 font-medium tabular-nums text-[#14432A]"
        style={{
          fontFamily: "'Playfair Display', Georgia, serif",
          fontSize: 'clamp(1.75rem, 4.5vw, 2.5rem)',
        }}
      >
        {balance ? creditFmt(balance.balance) : '—'}
      </h2>
      <p className="m-0 mt-1 font-sans text-[0.75rem] text-[#8A958D]">
        CM_CREDIT · rewards earned on eligible activity
      </p>

      <div className="mt-5">
        <p className="m-0 font-sans text-[0.75rem] font-semibold uppercase tracking-[0.1em] text-[#55655D]">
          Recent activity
        </p>
        {entries.length === 0 ? (
          <p className="mb-0 mt-2 font-sans text-[0.875rem] text-[#55655D]">
            No rewards activity yet.
          </p>
        ) : (
          <ul className="m-0 mt-2 list-none space-y-2 p-0">
            {entries.map((entry) => (
              <li
                key={entry.id}
                className="flex items-center justify-between gap-4 rounded-[10px] bg-[#FAFCFB] px-4 py-3"
              >
                <div className="min-w-0">
                  <p className="m-0 truncate font-sans text-[0.875rem] font-semibold text-[#14432A]">
                    {entry.description || entry.type}
                  </p>
                  <p className="m-0 font-sans text-[0.75rem] text-[#8A958D]">
                    {new Date(entry.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <span
                  className={`shrink-0 font-sans text-[0.875rem] font-semibold tabular-nums ${
                    entry.amount < 0 ? 'text-[#8A3B3B]' : 'text-[#1F7A4D]'
                  }`}
                >
                  {entry.amount > 0 ? '+' : ''}
                  {creditFmt(entry.amount)}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </SectionShell>
  )
}
