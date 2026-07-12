'use client'

import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowLeftIcon, CheckCircleIcon } from '@heroicons/react/24/outline'

export type ServiceFlowId =
  | 'pay'
  | 'utilities'
  | 'forms'
  | 'find-provider'
  | 'compound'
  | 'taxes'

const META: Record<
  ServiceFlowId,
  { title: string; eyebrow: string; intro: string }
> = {
  pay: {
    title: 'Pay',
    eyebrow: 'Rewards Pay',
    intro: 'Send rewards cash toward rent, groceries, or an everyday eligible expense.',
  },
  utilities: {
    title: 'Utilities',
    eyebrow: 'Household',
    intro: 'Schedule a utility payment from your wallet balance through Paymentus.',
  },
  forms: {
    title: 'Forms',
    eyebrow: 'Documents',
    intro: 'Request membership forms — ID cards, EOBs, and enrollment paperwork.',
  },
  'find-provider': {
    title: 'Find a Provider',
    eyebrow: 'Care network',
    intro: 'Search in-network clinicians by specialty, city, or ZIP.',
  },
  compound: {
    title: 'Compound',
    eyebrow: 'Legacy growth',
    intro: 'Allocate rewards toward your Centuries Mutual compound interest pathway.',
  },
  taxes: {
    title: 'Taxes',
    eyebrow: 'Tax tools',
    intro: 'Start a guided tax filing request tied to your member profile.',
  },
}

const fieldClass =
  'w-full rounded-[10px] border border-[#14432A]/15 bg-[#FAFCFB] px-3.5 py-2.5 font-sans text-[0.9375rem] text-[#14432A] outline-none transition placeholder:text-[#55655D]/55 focus:border-[#14432A]'

const panel = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -8 },
  transition: { duration: 0.28, ease: [0.22, 1, 0.36, 1] as const },
}

export function ServiceFlow({
  id,
  onClose,
  onSubmitted,
}: {
  id: ServiceFlowId
  onClose: () => void
  onSubmitted?: (entry: {
    label: string
    detail: string
    amount: number
    date: string
  }) => void
}) {
  const meta = META[id]
  const [step, setStep] = useState<'form' | 'done'>('form')
  const [error, setError] = useState<string | null>(null)

  const [payee, setPayee] = useState('')
  const [amount, setAmount] = useState('')
  const [note, setNote] = useState('')
  const [biller, setBiller] = useState('')
  const [accountNumber, setAccountNumber] = useState('')
  const [formType, setFormType] = useState('Member ID card')
  const [specialty, setSpecialty] = useState('')
  const [zip, setZip] = useState('')
  const [city, setCity] = useState('')
  const [allocate, setAllocate] = useState('')
  const [taxYear, setTaxYear] = useState(String(new Date().getFullYear() - 1))
  const [filingStatus, setFilingStatus] = useState('Single')

  const submit = () => {
    if (id === 'pay') {
      if (!payee.trim() || !(Number.parseFloat(amount) > 0)) {
        setError('Enter a payee and an amount greater than zero.')
        return
      }
    }
    if (id === 'utilities') {
      if (!biller.trim() || !accountNumber.trim() || !(Number.parseFloat(amount) > 0)) {
        setError('Enter biller, account number, and amount.')
        return
      }
    }
    if (id === 'forms' && !formType) {
      setError('Select a form to request.')
      return
    }
    if (id === 'find-provider') {
      if (!specialty.trim() || zip.replace(/\D/g, '').length !== 5) {
        setError('Enter a specialty and a 5-digit ZIP.')
        return
      }
    }
    if (id === 'compound' && !(Number.parseFloat(allocate) > 0)) {
      setError('Enter an allocation amount greater than zero.')
      return
    }
    if (id === 'taxes' && !taxYear.trim()) {
      setError('Enter a tax year.')
      return
    }
    setError(null)
    const date = new Date().toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    })
    if (id === 'pay') {
      onSubmitted?.({
        label: `Pay — ${payee}`,
        detail: note || 'Rewards pay',
        amount: -Math.abs(Number.parseFloat(amount) || 0),
        date,
      })
    } else if (id === 'utilities') {
      onSubmitted?.({
        label: `Utilities — ${biller}`,
        detail: `Account ${accountNumber}`,
        amount: -Math.abs(Number.parseFloat(amount) || 0),
        date,
      })
    } else if (id === 'compound') {
      onSubmitted?.({
        label: 'Compound allocation',
        detail: note || 'Legacy growth',
        amount: -Math.abs(Number.parseFloat(allocate) || 0),
        date,
      })
    } else if (id === 'forms') {
      onSubmitted?.({
        label: 'Forms request',
        detail: formType,
        amount: 0,
        date,
      })
    } else if (id === 'find-provider') {
      onSubmitted?.({
        label: 'Provider search',
        detail: `${specialty} · ${zip}`,
        amount: 0,
        date,
      })
    } else if (id === 'taxes') {
      onSubmitted?.({
        label: 'Tax filing request',
        detail: `${taxYear} · ${filingStatus}`,
        amount: 0,
        date,
      })
    }
    setStep('done')
  }

  return (
    <div>
      <button
        type="button"
        onClick={onClose}
        className="mb-6 inline-flex items-center gap-1.5 border-0 bg-transparent p-0 font-sans text-[0.8125rem] font-semibold text-[#55655D] transition hover:text-[#14432A]"
      >
        <ArrowLeftIcon className="h-4 w-4" />
        Back
      </button>

      <AnimatePresence mode="wait">
        {step === 'form' ? (
          <motion.div key="form" {...panel}>
            <p className="mb-2 font-sans text-[11px] font-semibold uppercase tracking-[0.22em] text-[#C9A53E]">
              {meta.eyebrow}
            </p>
            <h1
              className="mb-2 font-medium text-[#14432A]"
              style={{
                fontFamily: "'Playfair Display', Georgia, serif",
                fontSize: 'clamp(1.6rem, 3vw, 2.1rem)',
              }}
            >
              {meta.title}
            </h1>
            <p className="mb-6 max-w-lg font-sans text-[0.875rem] leading-[1.6] text-[#55655D]">
              {meta.intro}
            </p>

            <div className="space-y-4">
              {id === 'pay' ? (
                <>
                  <Field label="Payee">
                    <input value={payee} onChange={(e) => setPayee(e.target.value)} className={fieldClass} placeholder="Landlord, store, or recipient" />
                  </Field>
                  <Field label="Amount">
                    <input inputMode="decimal" value={amount} onChange={(e) => setAmount(e.target.value)} className={fieldClass} placeholder="0.00" />
                  </Field>
                  <Field label="Memo (optional)">
                    <input value={note} onChange={(e) => setNote(e.target.value)} className={fieldClass} placeholder="Rent, groceries…" />
                  </Field>
                </>
              ) : null}

              {id === 'utilities' ? (
                <>
                  <Field label="Utility biller">
                    <input value={biller} onChange={(e) => setBiller(e.target.value)} className={fieldClass} placeholder="Electric, water, gas…" />
                  </Field>
                  <Field label="Account number">
                    <input value={accountNumber} onChange={(e) => setAccountNumber(e.target.value)} className={fieldClass} placeholder="Account #" />
                  </Field>
                  <Field label="Amount">
                    <input inputMode="decimal" value={amount} onChange={(e) => setAmount(e.target.value)} className={fieldClass} placeholder="0.00" />
                  </Field>
                </>
              ) : null}

              {id === 'forms' ? (
                <Field label="Form type">
                  <select value={formType} onChange={(e) => setFormType(e.target.value)} className={fieldClass}>
                    <option>Member ID card</option>
                    <option>Explanation of benefits</option>
                    <option>Enrollment confirmation</option>
                    <option>Change of address</option>
                    <option>Authorization to release records</option>
                  </select>
                </Field>
              ) : null}

              {id === 'find-provider' ? (
                <>
                  <Field label="Specialty">
                    <input value={specialty} onChange={(e) => setSpecialty(e.target.value)} className={fieldClass} placeholder="Primary care, dental, cardiology…" />
                  </Field>
                  <Field label="City (optional)">
                    <input value={city} onChange={(e) => setCity(e.target.value)} className={fieldClass} placeholder="City" />
                  </Field>
                  <Field label="ZIP">
                    <input inputMode="numeric" value={zip} onChange={(e) => setZip(e.target.value.replace(/\D/g, '').slice(0, 5))} className={fieldClass} placeholder="00000" />
                  </Field>
                </>
              ) : null}

              {id === 'compound' ? (
                <>
                  <Field label="Amount to allocate">
                    <input inputMode="decimal" value={allocate} onChange={(e) => setAllocate(e.target.value)} className={fieldClass} placeholder="0.00" />
                  </Field>
                  <Field label="Note (optional)">
                    <input value={note} onChange={(e) => setNote(e.target.value)} className={fieldClass} placeholder="Contribution memo" />
                  </Field>
                </>
              ) : null}

              {id === 'taxes' ? (
                <>
                  <Field label="Tax year">
                    <input value={taxYear} onChange={(e) => setTaxYear(e.target.value)} className={fieldClass} placeholder="YYYY" />
                  </Field>
                  <Field label="Filing status">
                    <select value={filingStatus} onChange={(e) => setFilingStatus(e.target.value)} className={fieldClass}>
                      <option>Single</option>
                      <option>Married filing jointly</option>
                      <option>Married filing separately</option>
                      <option>Head of household</option>
                    </select>
                  </Field>
                </>
              ) : null}

              {error ? <p className="m-0 font-sans text-[0.8125rem] text-[#B3402A]">{error}</p> : null}

              <button
                type="button"
                onClick={submit}
                className="inline-flex items-center justify-center rounded-[10px] bg-[#0F3D2E] px-5 py-2.5 font-sans text-[0.875rem] font-semibold text-[#FAFCFB] transition hover:bg-[#0A2E22]"
              >
                {id === 'find-provider'
                  ? 'Search providers'
                  : id === 'forms'
                    ? 'Request form'
                    : id === 'taxes'
                      ? 'Start filing'
                      : 'Submit'}
              </button>
            </div>
          </motion.div>
        ) : (
          <motion.div key="done" {...panel} className="text-center">
            <CheckCircleIcon className="mx-auto h-12 w-12 text-[#1F7A4D]" />
            <h1
              className="mt-4 font-medium text-[#14432A]"
              style={{
                fontFamily: "'Playfair Display', Georgia, serif",
                fontSize: 'clamp(1.6rem, 3vw, 2.1rem)',
              }}
            >
              {id === 'find-provider' ? 'Search submitted' : 'Request submitted'}
            </h1>
            <p className="mx-auto mt-2 max-w-md font-sans text-[0.875rem] leading-[1.6] text-[#55655D]">
              {id === 'find-provider'
                ? `We will surface ${specialty || 'matching'} providers near ${zip}${city ? `, ${city}` : ''}.`
                : `Your ${meta.title.toLowerCase()} request is queued. Check Transaction History as updates post.`}
            </p>
            <button
              type="button"
              onClick={onClose}
              className="mt-6 inline-flex items-center justify-center rounded-[10px] bg-[#0F3D2E] px-5 py-2.5 font-sans text-[0.875rem] font-semibold text-[#FAFCFB] transition hover:bg-[#0A2E22]"
            >
              Back to wallet
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="mb-1.5 block font-sans text-[0.75rem] font-medium text-[#55655D]">
        {label}
      </label>
      {children}
    </div>
  )
}
