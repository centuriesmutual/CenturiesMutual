'use client'

import { useState, type FormEvent, type ReactNode } from 'react'
import { motion } from 'framer-motion'

const STEPS = ['Household', 'Income', 'Deductions', 'Review', 'Filed'] as const

type FormState = {
  filingStatus: string
  firstName: string
  lastName: string
  ssnLast4: string
  wages: string
  interest: string
  otherIncome: string
  standardDeduction: boolean
  charitable: string
  studentLoanInterest: string
}

const initial: FormState = {
  filingStatus: 'single',
  firstName: '',
  lastName: '',
  ssnLast4: '',
  wages: '',
  interest: '',
  otherIncome: '',
  standardDeduction: true,
  charitable: '',
  studentLoanInterest: '',
}

export function TaxFilingFlow() {
  const [step, setStep] = useState(0)
  const [form, setForm] = useState<FormState>(initial)
  const [confirmation, setConfirmation] = useState('')

  const update = (key: keyof FormState, value: string | boolean) => {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  const totalIncome =
    (Number(form.wages) || 0) + (Number(form.interest) || 0) + (Number(form.otherIncome) || 0)
  const deduction = form.standardDeduction
    ? form.filingStatus === 'married' || form.filingStatus === 'joint'
      ? 29200
      : 14600
    : (Number(form.charitable) || 0) + (Number(form.studentLoanInterest) || 0)
  const taxable = Math.max(0, totalIncome - deduction)
  const estimatedTax = Math.round(taxable * 0.12)

  const next = () => setStep((s) => Math.min(s + 1, STEPS.length - 1))
  const back = () => setStep((s) => Math.max(s - 1, 0))

  const submit = (e: FormEvent) => {
    e.preventDefault()
    const id = `CM-TAX-${Date.now().toString().slice(-8)}`
    setConfirmation(id)
    setStep(4)
  }

  return (
    <section className="relative overflow-hidden border-t border-[#E8EBEA] bg-[#FAFCFB] py-12 sm:py-16 lg:py-20">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <p className="mb-3 text-center font-sans text-[11px] font-semibold uppercase tracking-[0.22em] text-[#C9A53E]">
          — Tax filing
        </p>
        <h2
          className="mb-8 text-center font-medium tracking-[-0.01em] text-[#14432A]"
          style={{
            fontFamily: "'Playfair Display', Georgia, serif",
            fontSize: 'clamp(1.6rem, 3.2vw, 2.25rem)',
          }}
        >
          File with Centuries Mutual
        </h2>

        <ol className="mb-8 flex flex-wrap items-center justify-center gap-2">
          {STEPS.map((label, i) => (
            <li
              key={label}
              className={`rounded-full px-3 py-1 font-sans text-[10px] font-semibold uppercase tracking-[0.14em] ${
                i === step
                  ? 'bg-[#14432A] text-[#FAFCFB]'
                  : i < step
                    ? 'bg-[#14432A]/15 text-[#14432A]'
                    : 'bg-[#14432A]/[0.06] text-[#55655D]'
              }`}
            >
              {label}
            </li>
          ))}
        </ol>

        <motion.form
          key={step}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          onSubmit={submit}
          className="rounded-2xl bg-[#14432A]/[0.06] p-5 sm:p-7"
        >
          {step === 0 && (
            <div className="space-y-4">
              <Field label="Filing status">
                <select
                  className="w-full rounded-lg border border-[#14432A]/15 bg-white px-3 py-2.5 font-sans text-sm text-[#14432A]"
                  value={form.filingStatus}
                  onChange={(e) => update('filingStatus', e.target.value)}
                >
                  <option value="single">Single</option>
                  <option value="joint">Married filing jointly</option>
                  <option value="married">Married filing separately</option>
                  <option value="hoh">Head of household</option>
                </select>
              </Field>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Field label="First name">
                  <input
                    required
                    className="w-full rounded-lg border border-[#14432A]/15 bg-white px-3 py-2.5 font-sans text-sm"
                    value={form.firstName}
                    onChange={(e) => update('firstName', e.target.value)}
                  />
                </Field>
                <Field label="Last name">
                  <input
                    required
                    className="w-full rounded-lg border border-[#14432A]/15 bg-white px-3 py-2.5 font-sans text-sm"
                    value={form.lastName}
                    onChange={(e) => update('lastName', e.target.value)}
                  />
                </Field>
              </div>
              <Field label="SSN last 4 (demo only)">
                <input
                  required
                  maxLength={4}
                  pattern="[0-9]{4}"
                  className="w-full rounded-lg border border-[#14432A]/15 bg-white px-3 py-2.5 font-sans text-sm"
                  value={form.ssnLast4}
                  onChange={(e) => update('ssnLast4', e.target.value.replace(/\D/g, '').slice(0, 4))}
                />
              </Field>
            </div>
          )}

          {step === 1 && (
            <div className="space-y-4">
              <Field label="Wages, salaries, tips">
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  className="w-full rounded-lg border border-[#14432A]/15 bg-white px-3 py-2.5 font-sans text-sm"
                  value={form.wages}
                  onChange={(e) => update('wages', e.target.value)}
                />
              </Field>
              <Field label="Taxable interest">
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  className="w-full rounded-lg border border-[#14432A]/15 bg-white px-3 py-2.5 font-sans text-sm"
                  value={form.interest}
                  onChange={(e) => update('interest', e.target.value)}
                />
              </Field>
              <Field label="Other income">
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  className="w-full rounded-lg border border-[#14432A]/15 bg-white px-3 py-2.5 font-sans text-sm"
                  value={form.otherIncome}
                  onChange={(e) => update('otherIncome', e.target.value)}
                />
              </Field>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <label className="flex items-center gap-3 font-sans text-sm text-[#14432A]">
                <input
                  type="checkbox"
                  checked={form.standardDeduction}
                  onChange={(e) => update('standardDeduction', e.target.checked)}
                />
                Take the standard deduction
              </label>
              {!form.standardDeduction && (
                <>
                  <Field label="Charitable contributions">
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      className="w-full rounded-lg border border-[#14432A]/15 bg-white px-3 py-2.5 font-sans text-sm"
                      value={form.charitable}
                      onChange={(e) => update('charitable', e.target.value)}
                    />
                  </Field>
                  <Field label="Student loan interest">
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      className="w-full rounded-lg border border-[#14432A]/15 bg-white px-3 py-2.5 font-sans text-sm"
                      value={form.studentLoanInterest}
                      onChange={(e) => update('studentLoanInterest', e.target.value)}
                    />
                  </Field>
                </>
              )}
            </div>
          )}

          {step === 3 && (
            <div className="space-y-3 font-sans text-sm text-[#55655D]">
              <p>
                <span className="font-semibold text-[#14432A]">Filer:</span> {form.firstName}{' '}
                {form.lastName} · ****{form.ssnLast4}
              </p>
              <p>
                <span className="font-semibold text-[#14432A]">Status:</span> {form.filingStatus}
              </p>
              <p>
                <span className="font-semibold text-[#14432A]">Total income:</span> $
                {totalIncome.toLocaleString(undefined, { maximumFractionDigits: 2 })}
              </p>
              <p>
                <span className="font-semibold text-[#14432A]">Deduction:</span> $
                {deduction.toLocaleString(undefined, { maximumFractionDigits: 2 })}
              </p>
              <p>
                <span className="font-semibold text-[#14432A]">Taxable income:</span> $
                {taxable.toLocaleString(undefined, { maximumFractionDigits: 2 })}
              </p>
              <p className="rounded-xl bg-[#14432A] px-4 py-3 text-[#FAFCFB]">
                Estimated tax (demo rate 12%): ${estimatedTax.toLocaleString()}
              </p>
              <p className="text-[0.75rem] text-[#55655D]">
                This is a guided demonstration for Centuries Mutual members. It does not
                submit a return to the IRS.
              </p>
            </div>
          )}

          {step === 4 && (
            <div className="text-center">
              <p className="mb-2 font-sans text-[11px] font-semibold uppercase tracking-[0.18em] text-[#C9A53E]">
                Filing received
              </p>
              <p
                className="mb-3 font-medium text-[#14432A]"
                style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: '1.5rem' }}
              >
                Confirmation {confirmation}
              </p>
              <p className="font-sans text-sm leading-relaxed text-[#55655D]">
                Your demo return for {form.firstName} {form.lastName} is saved to your
                member record. Download statements and continue coverage tasks from the
                Client Portal.
              </p>
            </div>
          )}

          <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
            {step > 0 && step < 4 ? (
              <button
                type="button"
                onClick={back}
                className="rounded-[10px] border border-[#14432A] bg-transparent px-4 py-2 font-sans text-sm font-semibold text-[#14432A]"
              >
                Back
              </button>
            ) : (
              <span />
            )}
            {step < 3 && (
              <button
                type="button"
                onClick={next}
                className="rounded-[10px] bg-[#14432A] px-4 py-2 font-sans text-sm font-semibold text-[#FAFCFB]"
              >
                Continue
              </button>
            )}
            {step === 3 && (
              <button
                type="submit"
                className="rounded-[10px] bg-[#14432A] px-4 py-2 font-sans text-sm font-semibold text-[#FAFCFB]"
              >
                Submit filing
              </button>
            )}
            {step === 4 && (
              <button
                type="button"
                onClick={() => {
                  setForm(initial)
                  setConfirmation('')
                  setStep(0)
                }}
                className="rounded-[10px] bg-[#14432A] px-4 py-2 font-sans text-sm font-semibold text-[#FAFCFB]"
              >
                Start another return
              </button>
            )}
          </div>
        </motion.form>
      </div>
    </section>
  )
}

function Field({
  label,
  children,
}: {
  label: string
  children: ReactNode
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block font-sans text-[11px] font-semibold uppercase tracking-[0.14em] text-[#C9A53E]">
        {label}
      </span>
      {children}
    </label>
  )
}
