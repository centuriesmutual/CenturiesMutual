'use client'

import { useCallback, useEffect, useId, useState } from 'react'
import {
  ClipboardDocumentIcon,
  GiftIcon,
  HomeModernIcon,
  UserGroupIcon,
} from '@heroicons/react/24/outline'
import { LuxuryCard } from '@/components/treasury/treasury-luxury'
import { cn } from '@/lib/utils'

type Phase = 'idle' | 'send' | 'review' | 'confirming' | 'success'

const activity = [
  { icon: HomeModernIcon, label: 'Rent to landlord', time: '2025-04-28 09:14:22', amt: '-1,250.00', neg: true },
  { icon: UserGroupIcon, label: 'Pool contribution', time: '2025-04-27 18:02:11', amt: '-45.00', neg: true },
  { icon: GiftIcon, label: 'Gift received from a member', time: '2025-04-26 11:30:45', amt: '25.00', neg: false },
  { icon: HomeModernIcon, label: 'Refund from host', time: '2025-04-25 08:00:01', amt: '120.00', neg: false },
]

export function TreasurySimulatedWallet() {
  const [phase, setPhase] = useState<Phase>('idle')
  const [recipient, setRecipient] = useState('')
  const [amount, setAmount] = useState('')
  const [note, setNote] = useState('')
  const [reducedMotion, setReducedMotion] = useState(false)

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    setReducedMotion(mq.matches)
    const fn = () => setReducedMotion(mq.matches)
    mq.addEventListener('change', fn)
    return () => mq.removeEventListener('change', fn)
  }, [])

  const close = useCallback(() => {
    setPhase('idle')
    setRecipient('')
    setAmount('')
    setNote('')
  }, [])

  const onConfirm = () => {
    setPhase('confirming')
    const delay = reducedMotion ? 400 : 1500
    window.setTimeout(() => setPhase('success'), delay)
  }

  const modalId = useId()
  const walletAddr = '0x7a…4e2 · · · · · · · · · · · · · · · · · · · · · · · · · · · ·'

  return (
    <div className="relative">
      <LuxuryCard className="p-0" padded={false}>
        <div className="rounded-t-2xl border-b border-[#E5E0D5]/80 bg-[#14432A] px-4 py-3 sm:px-5">
          <div className="flex items-center justify-between gap-3">
            <span className="font-sans text-[11px] font-semibold uppercase tracking-[0.18em] text-[#FAFCFB]/95">
              Treasury Reserve
            </span>
            <span className="flex items-center gap-1.5 rounded-full bg-[#0f3321] px-2 py-0.5">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#C9A53E] opacity-40" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-[#C9A53E]" />
              </span>
              <span className="font-sans text-[10px] font-medium uppercase tracking-wider text-[#FAFCFB]/90">Live</span>
            </span>
          </div>
        </div>
        <div className="p-6">
          <div className="relative">
            <p
              className="font-serif text-[2.5rem] font-medium leading-none tracking-tight text-[#14432A]"
              style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
            >
              <span className="align-top text-xl">$</span>8,422
              <span className="text-lg text-[#3d4a41]">.18</span>
            </p>
            <div className="mt-2 h-[2px] w-16 bg-[#C9A53E]" aria-hidden />
          </div>

          <div className="mt-5 flex flex-wrap gap-2">
            <button
              type="button"
              className="rounded-full border border-[#E5E0D5] bg-[#FAFCFB] px-4 py-2 font-sans text-[11px] font-semibold uppercase tracking-wider text-[#14432A] transition hover:border-[#C9A53E]/80"
              onClick={() => setPhase('send')}
              aria-expanded={phase !== 'idle' && phase !== 'success'}
              aria-haspopup="dialog"
            >
              Send
            </button>
            <span className="inline-flex items-center rounded-full border border-[#E5E0D5]/80 px-4 py-2 font-sans text-[11px] font-semibold uppercase tracking-wider text-[#6B6B66]">
              Receive
            </span>
            <span className="inline-flex items-center rounded-full border border-[#E5E0D5]/80 px-4 py-2 font-sans text-[11px] font-semibold uppercase tracking-wider text-[#6B6B66]">
              Withdraw
            </span>
          </div>

          <div className="mt-8 border-t border-[#E5E0D5] pt-5">
            <p className="mb-3 font-sans text-[10px] font-semibold uppercase tracking-[0.15em] text-[#14432A]">Reserve activity</p>
            <ul className="space-y-3">
              {activity.map((row) => {
                const RowIcon = row.icon
                return (
                <li key={row.time} className="flex items-start gap-2 border-b border-[#E5E0D5]/70 pb-3 last:border-0">
                  <RowIcon className="mt-0.5 h-4 w-4 shrink-0 text-[#14432A]" aria-hidden />
                  <div className="min-w-0 flex-1">
                    <p className="font-sans text-[13px] leading-snug text-[#242926]">{row.label}</p>
                    <p className="font-mono text-[10px] text-[#6B6B66]">{row.time}</p>
                  </div>
                  <span
                    className={cn(
                      'font-mono text-[13px] tabular-nums',
                      row.neg ? 'text-[#8c6a5a]' : 'text-[#14432A]',
                    )}
                  >
                    {row.neg ? '−' : '+'}${row.amt}
                  </span>
                </li>
                )
              })}
            </ul>
          </div>

          <div className="mt-6 flex items-center justify-between gap-2 border-t border-[#E5E0D5]/80 pt-4">
            <span className="font-sans text-[0.75rem] text-[#6B6B66]">Reserve reference</span>
            <div className="flex min-w-0 items-center gap-2 font-mono text-[11px] text-[#3d4a41]">
              <span className="truncate">{walletAddr}</span>
              <button
                type="button"
                className="shrink-0 rounded p-1 text-[#14432A] transition hover:text-[#C9A53E]"
                aria-label="Copy address"
              >
                <ClipboardDocumentIcon className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </LuxuryCard>

      {(phase === 'send' || phase === 'review' || phase === 'confirming' || phase === 'success') && (
        <>
          <div
            className="fixed inset-0 z-[200] bg-[#0f3321]/55"
            aria-hidden
            onClick={phase !== 'confirming' ? close : undefined}
          />
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby={`${modalId}-title`}
            className={cn(
              'fixed bottom-8 left-4 right-4 z-[210] mx-auto max-h-[min(92vh,calc(100vh-4rem))] max-w-md overflow-y-auto rounded-2xl border border-[#E5E0D5] bg-[#FAFCFB] p-6 shadow-modal',
              'sm:inset-auto sm:left-1/2 sm:top-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2',
            )}
          >
            <h3 id={`${modalId}-title`} className="font-serif text-xl font-semibold text-[#14432A]" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
              Send funds
            </h3>

            {phase === 'send' && (
              <div className="mt-5 space-y-4">
                <label className="block">
                  <span className="mb-1 block font-sans text-[11px] font-medium uppercase tracking-wider text-[#6B6B66]">Recipient</span>
                  <input
                    className="w-full rounded-xl border border-[#E5E0D5] bg-white px-3 py-2 font-sans text-sm text-[#242926] outline-none ring-[#C9A53E] focus:ring-2"
                    value={recipient}
                    onChange={(e) => setRecipient(e.target.value)}
                    placeholder="Member or saved contact"
                  />
                </label>
                <label className="block">
                  <span className="mb-1 block font-sans text-[11px] font-medium uppercase tracking-wider text-[#6B6B66]">Amount</span>
                  <div className="flex rounded-xl border border-[#E5E0D5] bg-white px-3 py-2">
                    <span className="mr-2 font-mono text-[#14432A]">$</span>
                    <input
                      className="min-w-0 flex-1 bg-transparent font-mono text-sm outline-none"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      placeholder="0.00"
                      inputMode="decimal"
                    />
                  </div>
                </label>
                <label className="block">
                  <span className="mb-1 block font-sans text-[11px] font-medium uppercase tracking-wider text-[#6B6B66]">Note (optional)</span>
                  <textarea
                    className="min-h-[88px] w-full resize-y rounded-xl border border-[#E5E0D5] bg-white px-3 py-2 font-sans text-sm outline-none focus:ring-2 focus:ring-[#C9A53E]"
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    rows={3}
                  />
                </label>
                <button
                  type="button"
                  className="mt-2 w-full rounded-full bg-[#14432A] py-3 font-sans text-sm font-semibold text-[#FAFCFB] transition hover:bg-[#0f3321]"
                  onClick={() => setPhase('review')}
                >
                  Review
                </button>
              </div>
            )}

            {phase === 'review' && (
              <div className="mt-5 space-y-4">
                <dl className="space-y-2 rounded-xl border border-[#E5E0D5] bg-white p-4 font-sans text-sm">
                  <div className="flex justify-between gap-4">
                    <dt className="text-[#6B6B66]">Recipient</dt>
                    <dd className="text-right font-medium text-[#242926]">{recipient || '—'}</dd>
                  </div>
                  <div className="flex justify-between gap-4">
                    <dt className="text-[#6B6B66]">Amount</dt>
                    <dd className="font-mono text-[#14432A]">${amount || '0.00'}</dd>
                  </div>
                  <div className="flex justify-between gap-4">
                    <dt className="text-[#6B6B66]">Network fee</dt>
                    <dd className="font-mono text-[#3d4a41]">~$0.02</dd>
                  </div>
                  <div className="flex justify-between gap-4 border-t border-[#E5E0D5] pt-2">
                    <dt className="text-[#6B6B66]">Est. settlement</dt>
                    <dd className="font-mono text-[#14432A]">Seconds</dd>
                  </div>
                </dl>
                <button
                  type="button"
                  className="w-full rounded-full bg-[#14432A] py-3 font-sans text-sm font-semibold text-[#FAFCFB] transition hover:bg-[#0f3321]"
                  onClick={onConfirm}
                >
                  Confirm
                </button>
                <button type="button" className="w-full font-sans text-sm text-[#6B6B66] underline-offset-2 hover:underline" onClick={() => setPhase('send')}>
                  Back
                </button>
              </div>
            )}

            {phase === 'confirming' && (
              <div className="mt-8 flex flex-col items-center py-6">
                <div className="h-10 w-10 animate-spin rounded-full border-2 border-[#C9A53E] border-t-transparent" aria-hidden />
                <p className="mt-4 font-sans text-sm text-[#3d4a41]">Submitting…</p>
              </div>
            )}

            {phase === 'success' && (
              <div className="mt-6 flex flex-col items-center text-center">
                <div className="flex h-14 w-14 items-center justify-center rounded-full border-2 border-[#C9A53E] bg-[#14432A]/5">
                  <svg className="h-8 w-8 text-[#C9A53E]" viewBox="0 0 24 24" fill="none" aria-hidden>
                    <path d="M5 13l4 4L19 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <p className="mt-4 max-w-xs font-sans text-sm leading-relaxed text-[#3d4a41]">
                  Your transfer settled on the fast network — usually within a few seconds.
                </p>
                <button
                  type="button"
                  className="mt-6 rounded-full border border-[#E5E0D5] px-6 py-2.5 font-sans text-sm font-semibold text-[#14432A] hover:bg-[#FAF7F0]"
                  onClick={close}
                >
                  Close
                </button>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  )
}
