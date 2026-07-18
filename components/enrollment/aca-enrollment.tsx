'use client'

import { useMemo, useState, type ChangeEvent, type ReactNode } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { SiteHeader } from '@/components/layout/site-header'
import Footer from '@/components/Footer'

/* ---------------------------------------------------------------------------
 * Reference data
 * ------------------------------------------------------------------------- */

const US_STATES = [
  'AL','AK','AZ','AR','CA','CO','CT','DE','FL','GA','HI','ID','IL','IN','IA','KS','KY','LA','ME','MD',
  'MA','MI','MN','MS','MO','MT','NE','NV','NH','NJ','NM','NY','NC','ND','OH','OK','OR','PA','RI','SC',
  'SD','TN','TX','UT','VT','VA','WA','WV','WI','WY','DC',
]

// 2025 federal poverty guidelines (48 contiguous states + DC), annual, USD.
const FPL_BASE = 15060
const FPL_PER_PERSON = 5380
const fplFor = (size: number) => FPL_BASE + FPL_PER_PERSON * (Math.max(1, size) - 1)
const usd = (n: number) => n.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 })

const SEP_EVENTS = [
  'Loss of qualifying health coverage',
  'Marriage',
  'Birth, adoption, or placement of a child',
  'Divorce or legal separation with loss of coverage',
  'Permanent move to a new coverage area',
  'Change in income affecting eligibility',
  'Gained citizenship or lawful presence',
  'Released from incarceration',
  'Other qualifying life event',
]

/* ---------------------------------------------------------------------------
 * Small field primitives
 * ------------------------------------------------------------------------- */

const fieldClass =
  'w-full rounded-[10px] border border-[#14432A]/15 bg-white px-3 py-2 font-sans text-[0.875rem] text-[#14432A] outline-none transition placeholder:text-[#55655D]/50 focus:border-[#14432A]'
const labelClass =
  'mb-1 block font-sans text-[0.6875rem] font-semibold uppercase tracking-[0.08em] text-[#55655D]'

function Field({ label, children, className = '' }: { label: string; children: ReactNode; className?: string }) {
  return (
    <div className={className}>
      <label className={labelClass}>{label}</label>
      {children}
    </div>
  )
}

function StepHeading({ step, total, title }: { step: number; total: number; title: string }) {
  return (
    <div className="mb-5">
      <p className="mb-1 font-sans text-[10px] font-semibold uppercase tracking-[0.2em] text-[#C9A53E]">
        Step {step} of {total}
      </p>
      <h2
        className="m-0 font-medium text-[#14432A]"
        style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 'clamp(1.35rem,3vw,1.9rem)' }}
      >
        {title}
      </h2>
    </div>
  )
}

function formatSsn(value: string) {
  const d = value.replace(/\D/g, '').slice(0, 9)
  if (d.length <= 3) return d
  if (d.length <= 5) return `${d.slice(0, 3)}-${d.slice(3)}`
  return `${d.slice(0, 3)}-${d.slice(3, 5)}-${d.slice(5)}`
}
function formatPhone(value: string) {
  const d = value.replace(/\D/g, '').slice(0, 10)
  if (!d) return ''
  if (d.length < 4) return `(${d}`
  if (d.length < 7) return `(${d.slice(0, 3)}) ${d.slice(3)}`
  return `(${d.slice(0, 3)}) ${d.slice(3, 6)}-${d.slice(6)}`
}

type Dependent = { first_name: string; last_name: string; dob: string; relationship: string }
const emptyDependent = (): Dependent => ({ first_name: '', last_name: '', dob: '', relationship: 'Child' })

const TOTAL_STEPS = 4

/* ---------------------------------------------------------------------------
 * Component
 * ------------------------------------------------------------------------- */

export function AcaEnrollment() {
  const [step, setStep] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [done, setDone] = useState<string | null>(null)

  // Step 0 — declarations
  const [enrollmentPeriod, setEnrollmentPeriod] = useState<'open' | 'sep' | ''>('')
  const [sepEvent, setSepEvent] = useState('')
  const [sepEventDate, setSepEventDate] = useState('')
  const [sepAttested, setSepAttested] = useState(false)
  const [disclosuresAccepted, setDisclosuresAccepted] = useState(false)

  // Step 1 — applicant
  const [applicant, setApplicant] = useState({
    first_name: '', middle_initial: '', last_name: '', date_of_birth: '', ssn: '', sex: '',
    phone: '', email: '', address: '', apt: '', city: '', state: 'TX', zip: '', county: '',
    citizenship: 'U.S. citizen', tobacco: 'No',
  })

  // Step 2 — household & income
  const [household, setHousehold] = useState({
    household_size: '1', annual_income: '', filing_status: 'Single',
    current_coverage: 'None', coverage_start: '',
  })
  const [dependents, setDependents] = useState<Dependent[]>([])

  // Step 3 — sign
  const [signature, setSignature] = useState('')
  const [finalAgree, setFinalAgree] = useState(false)

  const householdSizeNum = Math.max(1, parseInt(household.household_size || '1', 10) || 1)
  const fpl = useMemo(() => fplFor(householdSizeNum), [householdSizeNum])

  const setApplicantField = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    let v = value
    if (name === 'ssn') v = formatSsn(value)
    if (name === 'phone') v = formatPhone(value)
    if (name === 'zip') v = value.replace(/\D/g, '').slice(0, 5)
    if (name === 'middle_initial') v = value.slice(0, 1)
    setApplicant((p) => ({ ...p, [name]: v }))
    setError(null)
  }
  const setHouseholdField = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setHousehold((p) => ({ ...p, [name]: value }))
    setError(null)
  }

  const validateDeclarations = (): string | null => {
    if (!enrollmentPeriod) return 'Tell us whether you are enrolling during Open Enrollment or a Special Enrollment Period.'
    if (enrollmentPeriod === 'sep') {
      if (!sepEvent) return 'Select the qualifying life event for your Special Enrollment Period.'
      if (!sepEventDate) return 'Enter the date of your qualifying life event.'
      if (!sepAttested) return 'You must attest that your SEP qualifying event is accurate.'
    }
    if (!disclosuresAccepted) return 'Please read and accept the enrollment disclosures to continue.'
    return null
  }
  const validateApplicant = (): string | null => {
    if (!applicant.first_name.trim() || !applicant.last_name.trim()) return 'Enter your legal first and last name.'
    if (!applicant.date_of_birth) return 'Enter your date of birth.'
    if (applicant.ssn.replace(/\D/g, '').length !== 9) return 'Enter a valid 9-digit Social Security number.'
    if (!applicant.sex) return 'Select a sex as it appears on legal documents.'
    if (applicant.phone.replace(/\D/g, '').length !== 10) return 'Enter a 10-digit phone number.'
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(applicant.email.trim())) return 'Enter a valid email address.'
    if (!applicant.address.trim() || !applicant.city.trim() || applicant.zip.length !== 5)
      return 'Complete your residential address (street, city, 5-digit ZIP).'
    return null
  }
  const validateHousehold = (): string | null => {
    if (!household.annual_income) return 'Enter your estimated annual household income.'
    if (!household.coverage_start) return 'Choose a requested coverage start date.'
    for (const d of dependents) {
      if ((d.first_name || d.last_name) && !d.dob) return 'Enter a date of birth for every dependent, or remove empty rows.'
    }
    return null
  }

  const next = () => {
    const err = step === 0 ? validateDeclarations() : step === 1 ? validateApplicant() : step === 2 ? validateHousehold() : null
    if (err) { setError(err); return }
    setError(null)
    setStep((s) => s + 1)
  }

  const submit = async () => {
    if (!finalAgree) { setError('You must agree to the authorization and terms to submit.'); return }
    const expected = `${applicant.first_name} ${applicant.last_name}`.trim().toLowerCase()
    if (signature.trim().toLowerCase() !== expected) {
      setError('Type your full legal name exactly as entered above to e-sign.')
      return
    }
    setSubmitting(true)
    setError(null)
    try {
      const res = await fetch('/api/enrollment/aca', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          first_name: applicant.first_name,
          middle_initial: applicant.middle_initial,
          last_name: applicant.last_name,
          email: applicant.email,
          phone: applicant.phone,
          date_of_birth: applicant.date_of_birth,
          ssn: applicant.ssn,
          sex: applicant.sex,
          address: applicant.address,
          apt: applicant.apt,
          city: applicant.city,
          state: applicant.state,
          zip: applicant.zip,
          county: applicant.county,
          citizenship: applicant.citizenship,
          tobacco: applicant.tobacco,
          enrollment_period: enrollmentPeriod,
          sep_qualifying_event: sepEvent,
          sep_event_date: sepEventDate,
          sep_attested: sepAttested,
          household_size: householdSizeNum,
          annual_income: Number(household.annual_income.replace(/[^\d.]/g, '')) || 0,
          filing_status: household.filing_status,
          current_coverage: household.current_coverage,
          coverage_start: household.coverage_start,
          dependents: dependents.filter((d) => d.first_name || d.last_name || d.dob),
          disclosures_accepted: disclosuresAccepted,
          signature,
        }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok || !data?.ok) {
        setError(data?.error || 'We could not submit your application. Please review and try again.')
        setSubmitting(false)
        return
      }
      setDone(data.id ?? 'submitted')
    } catch {
      setError('A network error occurred. Please try again.')
      setSubmitting(false)
    }
  }

  return (
    <>
      <SiteHeader />
      <main className="bg-[#FAFCFB]">
        {/* Hero band */}
        <section className="bg-[#0F3D2E] px-4 py-12 sm:px-6 sm:py-16">
          <div className="mx-auto max-w-3xl text-center">
            <p className="mb-2 font-sans text-[11px] font-semibold uppercase tracking-[0.22em] text-[#C9A53E]">
              — ACA Enrollment
            </p>
            <h1
              className="mb-3 font-medium leading-[1.12] text-[#FAFCFB]"
              style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 'clamp(1.9rem,5vw,3rem)' }}
            >
              Individual &amp; Family Marketplace Enrollment
            </h1>
            <p className="mx-auto max-w-2xl font-sans text-[0.9375rem] leading-[1.65] text-[#FAFCFB]/85">
              Apply for ACA-style individual and family medical coverage. We&apos;ll confirm your
              enrollment period, review income for potential savings, and collect the details a
              carrier needs — with clear disclosures before you begin.
            </p>
          </div>
        </section>

        <section className="px-4 py-10 sm:px-6">
          <div className="mx-auto max-w-3xl">
            {done ? (
              <SuccessCard id={done} />
            ) : (
              <>
                {/* Progress */}
                <div className="mb-6 flex items-center gap-2">
                  {Array.from({ length: TOTAL_STEPS }).map((_, i) => (
                    <div
                      key={i}
                      className={`h-1.5 flex-1 rounded-full transition ${i <= step ? 'bg-[#0F3D2E]' : 'bg-[#14432A]/12'}`}
                    />
                  ))}
                </div>

                <motion.div
                  key={step}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="rounded-2xl border border-[#14432A]/10 bg-white p-5 shadow-sm sm:p-7"
                >
                  {step === 0 && (
                    <DeclarationsStep
                      enrollmentPeriod={enrollmentPeriod}
                      setEnrollmentPeriod={(v) => { setEnrollmentPeriod(v); setError(null) }}
                      sepEvent={sepEvent}
                      setSepEvent={(v) => { setSepEvent(v); setError(null) }}
                      sepEventDate={sepEventDate}
                      setSepEventDate={(v) => { setSepEventDate(v); setError(null) }}
                      sepAttested={sepAttested}
                      setSepAttested={(v) => { setSepAttested(v); setError(null) }}
                      disclosuresAccepted={disclosuresAccepted}
                      setDisclosuresAccepted={(v) => { setDisclosuresAccepted(v); setError(null) }}
                    />
                  )}

                  {step === 1 && (
                    <div>
                      <StepHeading step={2} total={TOTAL_STEPS} title="Applicant information" />
                      <div className="grid grid-cols-1 gap-3 sm:grid-cols-6">
                        <Field label="First name" className="sm:col-span-2">
                          <input name="first_name" value={applicant.first_name} onChange={setApplicantField} className={fieldClass} placeholder="First" />
                        </Field>
                        <Field label="M.I." className="sm:col-span-1">
                          <input name="middle_initial" value={applicant.middle_initial} onChange={setApplicantField} className={fieldClass} />
                        </Field>
                        <Field label="Last name" className="sm:col-span-3">
                          <input name="last_name" value={applicant.last_name} onChange={setApplicantField} className={fieldClass} placeholder="Last" />
                        </Field>
                        <Field label="Date of birth" className="sm:col-span-2">
                          <input type="date" name="date_of_birth" value={applicant.date_of_birth} onChange={setApplicantField} className={fieldClass} />
                        </Field>
                        <Field label="Social Security number" className="sm:col-span-2">
                          <input name="ssn" inputMode="numeric" value={applicant.ssn} onChange={setApplicantField} className={fieldClass} placeholder="XXX-XX-XXXX" />
                        </Field>
                        <Field label="Sex (legal)" className="sm:col-span-2">
                          <select name="sex" value={applicant.sex} onChange={setApplicantField} className={fieldClass}>
                            <option value="">Select…</option>
                            <option>Female</option>
                            <option>Male</option>
                          </select>
                        </Field>
                        <Field label="Phone" className="sm:col-span-3">
                          <input name="phone" inputMode="numeric" value={applicant.phone} onChange={setApplicantField} className={fieldClass} placeholder="(555) 555-5555" />
                        </Field>
                        <Field label="Email" className="sm:col-span-3">
                          <input name="email" type="email" value={applicant.email} onChange={setApplicantField} className={fieldClass} placeholder="name@example.com" />
                        </Field>
                        <Field label="Street address" className="sm:col-span-4">
                          <input name="address" value={applicant.address} onChange={setApplicantField} className={fieldClass} placeholder="Street" />
                        </Field>
                        <Field label="Apt / Unit" className="sm:col-span-2">
                          <input name="apt" value={applicant.apt} onChange={setApplicantField} className={fieldClass} placeholder="Optional" />
                        </Field>
                        <Field label="City" className="sm:col-span-2">
                          <input name="city" value={applicant.city} onChange={setApplicantField} className={fieldClass} placeholder="City" />
                        </Field>
                        <Field label="State" className="sm:col-span-1">
                          <select name="state" value={applicant.state} onChange={setApplicantField} className={fieldClass}>
                            {US_STATES.map((s) => <option key={s}>{s}</option>)}
                          </select>
                        </Field>
                        <Field label="ZIP" className="sm:col-span-1">
                          <input name="zip" inputMode="numeric" value={applicant.zip} onChange={setApplicantField} className={fieldClass} placeholder="00000" />
                        </Field>
                        <Field label="County" className="sm:col-span-2">
                          <input name="county" value={applicant.county} onChange={setApplicantField} className={fieldClass} placeholder="County" />
                        </Field>
                        <Field label="Citizenship / immigration status" className="sm:col-span-3">
                          <select name="citizenship" value={applicant.citizenship} onChange={setApplicantField} className={fieldClass}>
                            <option>U.S. citizen</option>
                            <option>U.S. national</option>
                            <option>Lawfully present immigrant</option>
                            <option>Other / prefer to discuss</option>
                          </select>
                        </Field>
                        <Field label="Tobacco use (last 6 months)" className="sm:col-span-3">
                          <select name="tobacco" value={applicant.tobacco} onChange={setApplicantField} className={fieldClass}>
                            <option>No</option>
                            <option>Yes</option>
                          </select>
                        </Field>
                      </div>
                    </div>
                  )}

                  {step === 2 && (
                    <div>
                      <StepHeading step={3} total={TOTAL_STEPS} title="Household, income & coverage" />
                      <div className="grid grid-cols-1 gap-3 sm:grid-cols-6">
                        <Field label="Household size (tax household)" className="sm:col-span-2">
                          <input name="household_size" inputMode="numeric" value={household.household_size} onChange={setHouseholdField} className={fieldClass} />
                        </Field>
                        <Field label="Estimated annual household income" className="sm:col-span-2">
                          <input name="annual_income" inputMode="numeric" value={household.annual_income} onChange={setHouseholdField} className={fieldClass} placeholder="$" />
                        </Field>
                        <Field label="Tax filing status" className="sm:col-span-2">
                          <select name="filing_status" value={household.filing_status} onChange={setHouseholdField} className={fieldClass}>
                            <option>Single</option>
                            <option>Married filing jointly</option>
                            <option>Married filing separately</option>
                            <option>Head of household</option>
                          </select>
                        </Field>
                        <Field label="Requested coverage start" className="sm:col-span-3">
                          <input type="date" name="coverage_start" value={household.coverage_start} onChange={setHouseholdField} className={fieldClass} />
                        </Field>
                        <Field label="Current coverage" className="sm:col-span-3">
                          <select name="current_coverage" value={household.current_coverage} onChange={setHouseholdField} className={fieldClass}>
                            <option>None</option>
                            <option>Employer plan ending</option>
                            <option>Marketplace plan</option>
                            <option>Medicaid / CHIP</option>
                            <option>Other</option>
                          </select>
                        </Field>
                      </div>

                      <IncomeGuidance size={householdSizeNum} fpl={fpl} />

                      <div className="mt-6">
                        <div className="mb-2 flex items-center justify-between">
                          <p className="m-0 font-sans text-[0.8125rem] font-semibold text-[#14432A]">Dependents to cover</p>
                          <button type="button" onClick={() => setDependents((d) => [...d, emptyDependent()])} className="font-sans text-[0.8125rem] font-semibold text-[#0F3D2E] hover:underline">
                            + Add dependent
                          </button>
                        </div>
                        {dependents.length === 0 ? (
                          <p className="m-0 font-sans text-[0.8125rem] text-[#55655D]">No dependents added — applicant-only coverage.</p>
                        ) : (
                          <div className="space-y-3">
                            {dependents.map((d, i) => (
                              <div key={i} className="grid grid-cols-1 gap-2 rounded-[12px] border border-[#14432A]/10 bg-[#FAFCFB] p-3 sm:grid-cols-10">
                                <input value={d.first_name} onChange={(e) => setDependents((arr) => arr.map((x, j) => (j === i ? { ...x, first_name: e.target.value } : x)))} className={`${fieldClass} sm:col-span-3`} placeholder="First name" />
                                <input value={d.last_name} onChange={(e) => setDependents((arr) => arr.map((x, j) => (j === i ? { ...x, last_name: e.target.value } : x)))} className={`${fieldClass} sm:col-span-3`} placeholder="Last name" />
                                <input type="date" value={d.dob} onChange={(e) => setDependents((arr) => arr.map((x, j) => (j === i ? { ...x, dob: e.target.value } : x)))} className={`${fieldClass} sm:col-span-2`} />
                                <select value={d.relationship} onChange={(e) => setDependents((arr) => arr.map((x, j) => (j === i ? { ...x, relationship: e.target.value } : x)))} className={`${fieldClass} sm:col-span-1`}>
                                  <option>Child</option>
                                  <option>Spouse</option>
                                  <option>Other</option>
                                </select>
                                <button type="button" onClick={() => setDependents((arr) => arr.filter((_, j) => j !== i))} className="font-sans text-[0.8125rem] font-semibold text-[#B3402A] sm:col-span-1">
                                  Remove
                                </button>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {step === 3 && (
                    <div>
                      <StepHeading step={4} total={TOTAL_STEPS} title="Review & e-sign" />
                      <div className="rounded-[12px] border border-[#14432A]/10 bg-[#FAFCFB] p-4">
                        <dl className="m-0 grid grid-cols-1 gap-x-6 gap-y-2 sm:grid-cols-2">
                          <ReviewItem label="Applicant" value={`${applicant.first_name} ${applicant.middle_initial} ${applicant.last_name} · DOB ${applicant.date_of_birth}`} />
                          <ReviewItem label="Contact" value={`${applicant.phone} · ${applicant.email}`} />
                          <ReviewItem label="Address" value={`${applicant.address}${applicant.apt ? `, ${applicant.apt}` : ''}, ${applicant.city}, ${applicant.state} ${applicant.zip}`} />
                          <ReviewItem label="Enrollment period" value={enrollmentPeriod === 'sep' ? `Special Enrollment — ${sepEvent} (${sepEventDate})` : 'Open Enrollment'} />
                          <ReviewItem label="Household / income" value={`${householdSizeNum} person(s) · ${household.annual_income ? usd(Number(household.annual_income.replace(/[^\d.]/g, '')) || 0) : '—'}`} />
                          <ReviewItem label="Coverage start" value={household.coverage_start} />
                          {dependents.filter((d) => d.first_name || d.last_name).length > 0 && (
                            <div className="sm:col-span-2">
                              <dt className={labelClass}>Dependents</dt>
                              <dd className="m-0 font-sans text-[0.875rem] text-[#14432A]">
                                {dependents.filter((d) => d.first_name || d.last_name).map((d) => `${d.first_name} ${d.last_name} (${d.relationship})`).join(', ')}
                              </dd>
                            </div>
                          )}
                        </dl>
                      </div>

                      <div className="mt-4 grid grid-cols-1 gap-3">
                        <Field label="E-signature (type your full legal name)">
                          <input value={signature} onChange={(e) => { setSignature(e.target.value); setError(null) }} className={fieldClass} placeholder={`${applicant.first_name} ${applicant.last_name}`.trim() || 'Full legal name'} />
                        </Field>
                      </div>

                      <label className="mt-4 flex items-start gap-2.5 font-sans text-[0.8125rem] leading-[1.55] text-[#55655D]">
                        <input type="checkbox" checked={finalAgree} onChange={(e) => { setFinalAgree(e.target.checked); setError(null) }} className="mt-1 h-4 w-4 accent-[#0F3D2E]" />
                        <span>
                          I attest that the information provided is true and complete. I authorize Centuries Mutual to submit
                          this application to the applicable carrier and the Marketplace, verify eligibility and income, and
                          contact me about this enrollment. I understand submission does not guarantee coverage or subsidies;
                          eligibility, premiums, and effective dates are governed by carrier rules, the Marketplace, and
                          applicable law. Knowingly providing false information may result in denial or termination of coverage.
                        </span>
                      </label>
                    </div>
                  )}

                  {error ? <p className="mb-0 mt-4 font-sans text-[0.8125rem] text-[#B3402A]">{error}</p> : null}

                  <div className="mt-6 flex items-center gap-3">
                    {step < 3 ? (
                      <button type="button" onClick={next} className="inline-flex items-center justify-center rounded-[10px] bg-[#0F3D2E] px-5 py-2.5 font-sans text-[0.875rem] font-semibold text-[#FAFCFB] transition hover:bg-[#0A2E22]">
                        Continue
                      </button>
                    ) : (
                      <button type="button" disabled={submitting} onClick={submit} className="inline-flex items-center justify-center rounded-[10px] bg-[#0F3D2E] px-5 py-2.5 font-sans text-[0.875rem] font-semibold text-[#FAFCFB] transition hover:bg-[#0A2E22] disabled:cursor-not-allowed disabled:opacity-60">
                        {submitting ? 'Submitting…' : 'Submit application'}
                      </button>
                    )}
                    {step > 0 ? (
                      <button type="button" onClick={() => { setStep((s) => s - 1); setError(null) }} className="font-sans text-[0.8125rem] font-semibold text-[#55655D] hover:text-[#14432A]">
                        Back
                      </button>
                    ) : (
                      <Link href="/" className="font-sans text-[0.8125rem] font-semibold text-[#55655D] hover:text-[#14432A]">
                        Cancel
                      </Link>
                    )}
                  </div>
                </motion.div>

                <p className="mx-auto mt-5 max-w-2xl text-center font-sans text-[0.6875rem] leading-[1.6] text-[#55655D]/80">
                  Centuries Mutual is an insurance brokerage. This is an application, not an offer of coverage. Federal
                  poverty guideline figures shown are 2025 estimates for the 48 contiguous states and DC and are for
                  general reference only; your actual eligibility for premium tax credits and cost-sharing reductions is
                  determined by the Health Insurance Marketplace.
                </p>
              </>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}

/* ---------------------------------------------------------------------------
 * Sub-views
 * ------------------------------------------------------------------------- */

function ReviewItem({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className={labelClass}>{label}</dt>
      <dd className="m-0 font-sans text-[0.875rem] text-[#14432A]">{value || '—'}</dd>
    </div>
  )
}

function IncomeGuidance({ size, fpl }: { size: number; fpl: number }) {
  return (
    <div className="mt-5 rounded-[12px] border border-[#C9A53E]/30 bg-[#C9A53E]/[0.07] p-4">
      <p className="m-0 font-sans text-[0.75rem] font-semibold uppercase tracking-[0.12em] text-[#8a6d16]">
        Income thresholds (2025 guideline)
      </p>
      <p className="m-0 mt-2 font-sans text-[0.8125rem] leading-[1.6] text-[#55655D]">
        For a household of <strong className="text-[#14432A]">{size}</strong>, the federal poverty level (100% FPL) is
        about <strong className="text-[#14432A]">{usd(fpl)}</strong>/yr. Most Marketplace savings apply between roughly
        <strong className="text-[#14432A]"> {usd(fpl)}</strong> and <strong className="text-[#14432A]">{usd(fpl * 4)}</strong>
        {' '}(100%–400% FPL); incomes below ~138% FPL may qualify for Medicaid/CHIP in many states. These figures are
        guidance only — final eligibility is set by the Marketplace.
      </p>
    </div>
  )
}

type DeclProps = {
  enrollmentPeriod: 'open' | 'sep' | ''
  setEnrollmentPeriod: (v: 'open' | 'sep') => void
  sepEvent: string
  setSepEvent: (v: string) => void
  sepEventDate: string
  setSepEventDate: (v: string) => void
  sepAttested: boolean
  setSepAttested: (v: boolean) => void
  disclosuresAccepted: boolean
  setDisclosuresAccepted: (v: boolean) => void
}

function DeclarationsStep(p: DeclProps) {
  return (
    <div>
      <StepHeading step={1} total={TOTAL_STEPS} title="Before you begin" />

      <p className="mb-5 font-sans text-[0.9375rem] leading-[1.65] text-[#55655D]">
        ACA individual &amp; family coverage can generally only be purchased during Open Enrollment or when you qualify
        for a Special Enrollment Period (SEP). Confirm your enrollment period, review the income guidance, and accept the
        disclosures below to continue.
      </p>

      {/* Enrollment period */}
      <p className="mb-2 font-sans text-[0.75rem] font-semibold uppercase tracking-[0.12em] text-[#55655D]">
        Enrollment period
      </p>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {([
          { id: 'open', title: 'Open Enrollment', body: 'The annual window when anyone can enroll or change plans.' },
          { id: 'sep', title: 'Special Enrollment Period', body: 'You had a qualifying life event that opens a 60-day window.' },
        ] as const).map((o) => (
          <button
            key={o.id}
            type="button"
            onClick={() => p.setEnrollmentPeriod(o.id)}
            className={`rounded-[14px] border p-4 text-left transition ${
              p.enrollmentPeriod === o.id ? 'border-[#0F3D2E] bg-[#0F3D2E] text-[#FAFCFB]' : 'border-[#14432A]/12 bg-white text-[#14432A] hover:border-[#14432A]/35'
            }`}
          >
            <p className="m-0 font-sans text-[0.9375rem] font-semibold">{o.title}</p>
            <p className={`mb-0 mt-1 font-sans text-[0.8125rem] leading-[1.5] ${p.enrollmentPeriod === o.id ? 'text-[#FAFCFB]/75' : 'text-[#55655D]'}`}>
              {o.body}
            </p>
          </button>
        ))}
      </div>

      {p.enrollmentPeriod === 'sep' && (
        <div className="mt-4 rounded-[12px] border border-[#14432A]/12 bg-[#FAFCFB] p-4">
          <p className="m-0 mb-3 font-sans text-[0.75rem] font-semibold uppercase tracking-[0.12em] text-[#55655D]">
            Special Enrollment Period declaration
          </p>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <Field label="Qualifying life event">
              <select value={p.sepEvent} onChange={(e) => p.setSepEvent(e.target.value)} className={fieldClass}>
                <option value="">Select an event…</option>
                {SEP_EVENTS.map((s) => <option key={s}>{s}</option>)}
              </select>
            </Field>
            <Field label="Date of event">
              <input type="date" value={p.sepEventDate} onChange={(e) => p.setSepEventDate(e.target.value)} className={fieldClass} />
            </Field>
          </div>
          <label className="mt-3 flex items-start gap-2.5 font-sans text-[0.8125rem] leading-[1.55] text-[#55655D]">
            <input type="checkbox" checked={p.sepAttested} onChange={(e) => p.setSepAttested(e.target.checked)} className="mt-1 h-4 w-4 accent-[#0F3D2E]" />
            <span>
              I declare, under penalty of perjury, that the qualifying life event and date above are true and accurate,
              and I understand I may be asked to provide documentation to verify my Special Enrollment Period.
            </span>
          </label>
        </div>
      )}

      {/* Disclosures */}
      <p className="mb-2 mt-6 font-sans text-[0.75rem] font-semibold uppercase tracking-[0.12em] text-[#55655D]">
        Enrollment disclosures
      </p>
      <div className="max-h-56 space-y-3 overflow-y-auto rounded-[12px] border border-[#14432A]/10 bg-[#FAFCFB] p-4 font-sans text-[0.8125rem] leading-[1.6] text-[#55655D]">
        <p className="m-0">
          By continuing, you confirm the information you provide is true and complete to the best of your knowledge.
          Knowingly providing false or incomplete information may result in denial of coverage, rescission, repayment of
          advance premium tax credits, or other remedies permitted by law.
        </p>
        <p className="m-0">
          Centuries Mutual is an insurance brokerage. Submitting this application does not create coverage and is not a
          guarantee of eligibility, plan availability, premium amount, or subsidy. Final determinations are made by the
          Health Insurance Marketplace and the issuing carrier.
        </p>
        <p className="m-0">
          You authorize Centuries Mutual and its carriers to use and disclose your information as needed to process this
          application, determine eligibility (including income verification), and administer benefits, consistent with
          applicable privacy notices and HIPAA where health information is involved.
        </p>
        <p className="m-0">
          Advance Premium Tax Credit (APTC) and cost-sharing reduction eligibility depend on your household size and
          projected annual income relative to the federal poverty level. You agree to promptly report income and
          household changes, which may affect your subsidy and require reconciliation on your federal tax return.
        </p>
        <p className="m-0">
          Electronic signatures and consents captured in this flow have the same legal effect as wet-ink signatures under
          applicable electronic transactions laws (E-SIGN / UETA). You may cancel before final submission.
        </p>
      </div>
      <label className="mt-3 flex items-start gap-2.5 font-sans text-[0.8125rem] leading-[1.55] text-[#14432A]">
        <input type="checkbox" checked={p.disclosuresAccepted} onChange={(e) => p.setDisclosuresAccepted(e.target.checked)} className="mt-1 h-4 w-4 accent-[#0F3D2E]" />
        <span>I have read and agree to the enrollment disclosures, privacy practices, and electronic consent terms above.</span>
      </label>
    </div>
  )
}

function SuccessCard({ id }: { id: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
      className="rounded-2xl border border-[#14432A]/10 bg-white p-8 text-center shadow-sm sm:p-10"
    >
      <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#0F3D2E]">
        <svg viewBox="0 0 24 24" className="h-8 w-8 text-[#C9A53E]" fill="none" stroke="currentColor" strokeWidth={2.5}>
          <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
      <h2 className="mb-2 font-medium text-[#14432A]" style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 'clamp(1.5rem,3vw,2rem)' }}>
        Application submitted
      </h2>
      <p className="mx-auto mb-1 max-w-md font-sans text-[0.9375rem] leading-[1.6] text-[#55655D]">
        Thank you. Your ACA enrollment application has been received and routed to our licensed team for review. We&apos;ll
        follow up about eligibility, plan options, and next steps.
      </p>
      {id && id !== 'submitted' ? (
        <p className="mb-5 font-sans text-[0.75rem] text-[#55655D]/80">Reference: {id}</p>
      ) : null}
      <div className="flex flex-wrap justify-center gap-3">
        <Link href="/" className="inline-flex items-center justify-center rounded-[10px] bg-[#0F3D2E] px-5 py-2.5 font-sans text-[0.875rem] font-semibold text-[#FAFCFB] no-underline transition hover:bg-[#0A2E22]">
          Return home
        </Link>
        <Link href="/individual-family-services" className="inline-flex items-center justify-center rounded-[10px] border border-[#14432A]/25 px-5 py-2.5 font-sans text-[0.875rem] font-semibold text-[#14432A] no-underline transition hover:bg-[#14432A]/[0.05]">
          Explore plans
        </Link>
      </div>
    </motion.div>
  )
}
