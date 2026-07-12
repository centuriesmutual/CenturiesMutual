'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeftIcon, CheckCircleIcon, LinkIcon } from '@heroicons/react/24/outline'
import {
  CoinbaseLogo,
  RobinhoodLogo,
  PaymentusLogo,
} from '@/components/dashboard/payout-logos'
import {
  loadLinkedAccounts,
  saveLinkedAccount,
  type LinkedProvider,
} from '@/lib/payout-links'

export type CashOutDestination = LinkedProvider

const DESTINATIONS: ReadonlyArray<{
  id: CashOutDestination
  name: string
  blurb: string
  oauthPath?: string
  Logo: typeof CoinbaseLogo
}> = [
  {
    id: 'coinbase',
    name: 'Coinbase',
    blurb: 'Withdraw rewards cash to your linked Coinbase account.',
    oauthPath: '/api/oauth/coinbase',
    Logo: CoinbaseLogo,
  },
  {
    id: 'robinhood',
    name: 'Robinhood',
    blurb: 'Transfer available balance to Robinhood brokerage cash.',
    oauthPath: '/api/oauth/robinhood',
    Logo: RobinhoodLogo,
  },
  {
    id: 'paymentus',
    name: 'Paymentus',
    blurb: 'Pay utility bills — electric, water, gas, and more.',
    Logo: PaymentusLogo,
  },
]

const usd = (n: number) =>
  n.toLocaleString('en-US', { style: 'currency', currency: 'USD' })

const fieldClass =
  'w-full rounded-[10px] border border-[#14432A]/15 bg-[#FAFCFB] px-3.5 py-2.5 font-sans text-[0.9375rem] text-[#14432A] outline-none transition placeholder:text-[#55655D]/55 focus:border-[#14432A]'

type Step = 'choose' | 'details' | 'confirm' | 'done'

function cookieLinked(provider: CashOutDestination) {
  if (typeof document === 'undefined') return false
  return document.cookie.split(';').some((c) => c.trim().startsWith(`cm_${provider}_linked=1`))
}

export function CashOutFlow({
  availableBalance,
  onClose,
  onSubmitted,
}: {
  availableBalance: number
  onClose: () => void
  onSubmitted?: (entry: {
    label: string
    detail: string
    amount: number
    date: string
  }) => void
}) {
  const [step, setStep] = useState<Step>('choose')
  const [destination, setDestination] = useState<CashOutDestination | null>(null)
  const [amount, setAmount] = useState('')
  const [billerName, setBillerName] = useState('')
  const [accountNumber, setAccountNumber] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [linked, setLinked] = useState<Partial<Record<CashOutDestination, boolean>>>({})

  useEffect(() => {
    const saved = loadLinkedAccounts()
    setLinked({
      coinbase: Boolean(saved.coinbase) || cookieLinked('coinbase'),
      robinhood: Boolean(saved.robinhood) || cookieLinked('robinhood'),
      paymentus: Boolean(saved.paymentus),
    })
  }, [])

  const selected = DESTINATIONS.find((d) => d.id === destination)
  const amountNum = Number.parseFloat(amount.replace(/[^0-9.]/g, '')) || 0
  const isLinked = destination ? Boolean(linked[destination]) : false

  const connectOAuth = (id: CashOutDestination) => {
    const dest = DESTINATIONS.find((d) => d.id === id)
    if (!dest?.oauthPath) {
      saveLinkedAccount({
        provider: 'paymentus',
        linkedAt: new Date().toISOString(),
        displayName: 'Paymentus',
        accountRef: 'paymentus',
      })
      setLinked((p) => ({ ...p, paymentus: true }))
      return
    }
    window.location.href = `${dest.oauthPath}?return=/wallet`
  }

  const continueFromDetails = () => {
    if (amountNum <= 0) {
      setError('Enter an amount greater than zero.')
      return
    }
    if (amountNum > availableBalance) {
      setError(
        availableBalance === 0
          ? 'No rewards cash available to cash out yet.'
          : `Amount exceeds available balance of ${usd(availableBalance)}.`,
      )
      return
    }
    if (destination === 'paymentus') {
      if (!billerName.trim() || !accountNumber.trim()) {
        setError('Enter the utility biller name and your account number.')
        return
      }
    } else if (!isLinked) {
      setError(`Connect ${selected?.name ?? 'your account'} with OAuth before continuing.`)
      return
    }
    setError(null)
    setStep('confirm')
  }

  const submit = async () => {
    if (!selected || !destination) return
    setSubmitting(true)
    setError(null)
    try {
      const res = await fetch('/api/payout/transfer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          provider: destination,
          amount: amountNum,
          billerName,
          accountNumber,
        }),
      })
      const data = (await res.json()) as { ok: boolean; error?: string }
      if (!res.ok || !data.ok) {
        setError(data.error || 'Transfer failed.')
        setSubmitting(false)
        return
      }
      onSubmitted?.({
        label:
          destination === 'paymentus'
            ? `Utility payment — ${billerName || 'Paymentus'}`
            : `Cash out — ${selected.name}`,
        detail:
          destination === 'paymentus'
            ? `Account ${accountNumber}`
            : `${selected.name} (OAuth)`,
        amount: -Math.abs(amountNum),
        date: new Date().toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
        }),
      })
      setStep('done')
    } catch {
      setError('Network error. Try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div>
      <div className="mb-6 flex items-center gap-3">
        {step !== 'done' ? (
          <button
            type="button"
            onClick={() => {
              if (step === 'choose') onClose()
              else if (step === 'details') {
                setStep('choose')
                setError(null)
              } else setStep('details')
            }}
            className="inline-flex items-center gap-1.5 border-0 bg-transparent p-0 font-sans text-[0.8125rem] font-semibold text-[#55655D] transition hover:text-[#14432A]"
          >
            <ArrowLeftIcon className="h-4 w-4" />
            Back
          </button>
        ) : null}
      </div>

      <AnimatePresence mode="wait">
        {step === 'choose' ? (
          <motion.div
            key="choose"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
          >
            <p className="mb-2 font-sans text-[11px] font-semibold uppercase tracking-[0.22em] text-[#C9A53E]">
              Cash Out
            </p>
            <h1
              className="mb-2 font-medium text-[#14432A]"
              style={{
                fontFamily: "'Playfair Display', Georgia, serif",
                fontSize: 'clamp(1.6rem, 3vw, 2.1rem)',
              }}
            >
              Where should we send it?
            </h1>
            <p className="mb-6 max-w-lg font-sans text-[0.875rem] leading-[1.6] text-[#55655D]">
              Available balance {usd(availableBalance)}. Connect Coinbase or Robinhood with
              OAuth, or pay utilities through Paymentus.
            </p>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              {DESTINATIONS.map((d) => {
                const connected = Boolean(linked[d.id])
                return (
                  <button
                    key={d.id}
                    type="button"
                    onClick={() => {
                      setDestination(d.id)
                      setError(null)
                      setStep('details')
                    }}
                    className="group relative flex aspect-square flex-col items-center justify-center gap-3 rounded-2xl bg-[#14432A]/[0.06] p-5 text-center transition hover:bg-[#14432A]/[0.1]"
                  >
                    <d.Logo className="h-12 w-12" />
                    <span className="font-sans text-[0.9375rem] font-semibold text-[#14432A]">
                      {d.name}
                    </span>
                    <span className="line-clamp-3 font-sans text-[0.75rem] leading-[1.45] text-[#55655D]">
                      {d.blurb}
                    </span>
                    <span
                      className={`absolute right-3 top-3 rounded-full px-2 py-0.5 font-sans text-[0.625rem] font-semibold uppercase tracking-wide ${
                        connected
                          ? 'bg-[#1F7A4D]/15 text-[#1F7A4D]'
                          : 'bg-[#14432A]/10 text-[#55655D]'
                      }`}
                    >
                      {connected ? 'Linked' : d.oauthPath ? 'OAuth' : 'Bills'}
                    </span>
                  </button>
                )
              })}
            </div>
          </motion.div>
        ) : null}

        {step === 'details' && selected ? (
          <motion.div
            key="details"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="mb-5 flex items-center gap-3">
              <selected.Logo className="h-9 w-9" />
              <div>
                <p className="m-0 font-sans text-[11px] font-semibold uppercase tracking-[0.22em] text-[#C9A53E]">
                  {selected.name}
                </p>
                <h1
                  className="m-0 font-medium text-[#14432A]"
                  style={{
                    fontFamily: "'Playfair Display', Georgia, serif",
                    fontSize: 'clamp(1.4rem, 2.8vw, 1.85rem)',
                  }}
                >
                  {destination === 'paymentus' ? 'Pay a utility bill' : 'Withdrawal details'}
                </h1>
              </div>
            </div>

            {destination !== 'paymentus' ? (
              <div className="mb-5 rounded-2xl bg-[#14432A]/[0.06] p-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="m-0 font-sans text-[0.875rem] font-semibold text-[#14432A]">
                      {isLinked ? `${selected.name} connected` : `Connect ${selected.name}`}
                    </p>
                    <p className="mb-0 mt-0.5 font-sans text-[0.75rem] text-[#55655D]">
                      {isLinked
                        ? 'OAuth session active. You can send rewards cash to this account.'
                        : 'Authenticate with OAuth to authorize withdrawals to your account.'}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => connectOAuth(destination!)}
                    className="inline-flex items-center gap-1.5 rounded-[10px] bg-[#0F3D2E] px-3.5 py-2 font-sans text-[0.8125rem] font-semibold text-[#FAFCFB]"
                  >
                    <LinkIcon className="h-4 w-4" />
                    {isLinked ? 'Reconnect' : 'Connect with OAuth'}
                  </button>
                </div>
              </div>
            ) : null}

            <div className="space-y-4">
              <div>
                <label className="mb-1.5 block font-sans text-[0.75rem] font-medium text-[#55655D]">
                  Amount
                </label>
                <input
                  inputMode="decimal"
                  value={amount}
                  onChange={(e) => {
                    setAmount(e.target.value)
                    setError(null)
                  }}
                  className={fieldClass}
                  placeholder="0.00"
                />
              </div>

              {destination === 'paymentus' ? (
                <>
                  <div>
                    <label className="mb-1.5 block font-sans text-[0.75rem] font-medium text-[#55655D]">
                      Utility biller
                    </label>
                    <input
                      value={billerName}
                      onChange={(e) => {
                        setBillerName(e.target.value)
                        setError(null)
                      }}
                      className={fieldClass}
                      placeholder="e.g. City Electric, Water Authority"
                    />
                  </div>
                  <div>
                    <label className="mb-1.5 block font-sans text-[0.75rem] font-medium text-[#55655D]">
                      Account number
                    </label>
                    <input
                      value={accountNumber}
                      onChange={(e) => {
                        setAccountNumber(e.target.value)
                        setError(null)
                      }}
                      className={fieldClass}
                      placeholder="Utility account #"
                    />
                  </div>
                </>
              ) : null}

              {error ? (
                <p className="m-0 font-sans text-[0.8125rem] text-[#B3402A]">{error}</p>
              ) : null}

              <button
                type="button"
                onClick={continueFromDetails}
                className="inline-flex items-center justify-center rounded-[10px] bg-[#0F3D2E] px-5 py-2.5 font-sans text-[0.875rem] font-semibold text-[#FAFCFB] transition hover:bg-[#0A2E22]"
              >
                Continue
              </button>
            </div>
          </motion.div>
        ) : null}

        {step === 'confirm' && selected ? (
          <motion.div
            key="confirm"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
          >
            <p className="mb-2 font-sans text-[11px] font-semibold uppercase tracking-[0.22em] text-[#C9A53E]">
              Confirm
            </p>
            <h1
              className="mb-6 font-medium text-[#14432A]"
              style={{
                fontFamily: "'Playfair Display', Georgia, serif",
                fontSize: 'clamp(1.6rem, 3vw, 2.1rem)',
              }}
            >
              Review cash out
            </h1>
            <dl className="m-0 space-y-3 rounded-2xl bg-[#14432A]/[0.06] p-5">
              <div className="flex justify-between gap-4">
                <dt className="font-sans text-[0.8125rem] text-[#55655D]">Destination</dt>
                <dd className="m-0 font-sans text-[0.875rem] font-semibold text-[#14432A]">
                  {selected.name}
                </dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="font-sans text-[0.8125rem] text-[#55655D]">Amount</dt>
                <dd className="m-0 font-sans text-[0.875rem] font-semibold tabular-nums text-[#14432A]">
                  {usd(amountNum)}
                </dd>
              </div>
              {destination === 'paymentus' ? (
                <>
                  <div className="flex justify-between gap-4">
                    <dt className="font-sans text-[0.8125rem] text-[#55655D]">Biller</dt>
                    <dd className="m-0 text-right font-sans text-[0.875rem] font-semibold text-[#14432A]">
                      {billerName}
                    </dd>
                  </div>
                  <div className="flex justify-between gap-4">
                    <dt className="font-sans text-[0.8125rem] text-[#55655D]">Account</dt>
                    <dd className="m-0 font-sans text-[0.875rem] font-semibold text-[#14432A]">
                      {accountNumber}
                    </dd>
                  </div>
                </>
              ) : (
                <div className="flex justify-between gap-4">
                  <dt className="font-sans text-[0.8125rem] text-[#55655D]">Auth</dt>
                  <dd className="m-0 font-sans text-[0.875rem] font-semibold text-[#1F7A4D]">
                    OAuth connected
                  </dd>
                </div>
              )}
            </dl>
            {error ? (
              <p className="mb-0 mt-4 font-sans text-[0.8125rem] text-[#B3402A]">{error}</p>
            ) : null}
            <button
              type="button"
              disabled={submitting}
              onClick={submit}
              className="mt-6 inline-flex items-center justify-center rounded-[10px] bg-[#0F3D2E] px-5 py-2.5 font-sans text-[0.875rem] font-semibold text-[#FAFCFB] transition hover:bg-[#0A2E22] disabled:opacity-60"
            >
              {submitting
                ? 'Sending…'
                : destination === 'paymentus'
                  ? 'Pay bill'
                  : 'Send to account'}
            </button>
          </motion.div>
        ) : null}

        {step === 'done' && selected ? (
          <motion.div
            key="done"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            className="text-center"
          >
            <CheckCircleIcon className="mx-auto h-12 w-12 text-[#1F7A4D]" />
            <h1
              className="mt-4 font-medium text-[#14432A]"
              style={{
                fontFamily: "'Playfair Display', Georgia, serif",
                fontSize: 'clamp(1.6rem, 3vw, 2.1rem)',
              }}
            >
              {destination === 'paymentus' ? 'Payment submitted' : 'Cash out submitted'}
            </h1>
            <p className="mx-auto mt-2 max-w-md font-sans text-[0.875rem] leading-[1.6] text-[#55655D]">
              {usd(amountNum)} via {selected.name} is queued. Check Transaction History once
              it posts.
            </p>
            <button
              type="button"
              onClick={onClose}
              className="mt-6 inline-flex items-center justify-center rounded-[10px] bg-[#0F3D2E] px-5 py-2.5 font-sans text-[0.875rem] font-semibold text-[#FAFCFB] transition hover:bg-[#0A2E22]"
            >
              Back to wallet
            </button>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  )
}
