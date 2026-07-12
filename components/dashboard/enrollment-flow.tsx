'use client'

import { useState, type ChangeEvent, type ReactNode } from 'react'

export type PlanPathway =
  | 'aca-individual-family'
  | 'medicare-advantage'
  | 'medicare-supplement'
  | 'dental'
  | 'group'

export type EnrolledPlan = {
  pathway: PlanPathway
  name: string
  planId: string
  status: 'Pending review' | 'Active' | 'Inactive'
  submittedAt: string
  effectiveDate: string
}

export const PATHWAYS: ReadonlyArray<{
  id: PlanPathway
  name: string
  blurb: string
}> = [
  {
    id: 'aca-individual-family',
    name: 'Individual & Family (ACA)',
    blurb: 'Marketplace-style medical coverage for you and your household.',
  },
  {
    id: 'medicare-advantage',
    name: 'Medicare Advantage',
    blurb: 'Part C — hospital, medical, and extras in one plan.',
  },
  {
    id: 'medicare-supplement',
    name: 'Medicare Supplement',
    blurb: 'Medigap — help with what Original Medicare leaves behind.',
  },
  {
    id: 'dental',
    name: 'Dental',
    blurb: 'Preventive and restorative dental benefits.',
  },
  {
    id: 'group',
    name: 'Group Plans',
    blurb: 'Employer and organization sponsored coverage.',
  },
]

const US_STATES = [
  'AL','AK','AZ','AR','CA','CO','CT','DE','FL','GA','HI','ID','IL','IN','IA','KS','KY','LA','ME','MD',
  'MA','MI','MN','MS','MO','MT','NE','NV','NH','NJ','NM','NY','NC','ND','OH','OK','OR','PA','RI','SC',
  'SD','TN','TX','UT','VT','VA','WA','WV','WI','WY','DC',
]

type Dependent = { firstName: string; lastName: string; dob: string; ssn: string; relationship: string }

const emptyDependent = (): Dependent => ({
  firstName: '',
  lastName: '',
  dob: '',
  ssn: '',
  relationship: 'Spouse',
})

function formatSsn(value: string): string {
  const d = value.replace(/\D/g, '').slice(0, 9)
  if (d.length <= 3) return d
  if (d.length <= 5) return `${d.slice(0, 3)}-${d.slice(3)}`
  return `${d.slice(0, 3)}-${d.slice(3, 5)}-${d.slice(5)}`
}

function formatPhone(value: string): string {
  const d = value.replace(/\D/g, '').slice(0, 10)
  if (d.length === 0) return ''
  if (d.length < 4) return `(${d}`
  if (d.length < 7) return `(${d.slice(0, 3)}) ${d.slice(3)}`
  return `(${d.slice(0, 3)}) ${d.slice(3, 6)}-${d.slice(6)}`
}

function formatMbi(value: string): string {
  return value
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, '')
    .slice(0, 11)
    .replace(/(.{4})(.{3})?(.*)?/, (_, a, b, c) => [a, b, c].filter(Boolean).join('-'))
}

const fieldClass =
  'w-full rounded-[10px] border border-[#14432A]/15 bg-white px-3 py-2 font-sans text-[0.875rem] text-[#14432A] outline-none transition placeholder:text-[#55655D]/50 focus:border-[#14432A]'

const labelClass = 'mb-1 block font-sans text-[0.6875rem] font-semibold uppercase tracking-[0.08em] text-[#55655D]'

function Field({
  label,
  children,
  className = '',
}: {
  label: string
  children: ReactNode
  className?: string
}) {
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
      <h3
        className="m-0 font-medium text-[#14432A]"
        style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: '1.35rem' }}
      >
        {title}
      </h3>
    </div>
  )
}

export function EnrollmentFlow({
  onComplete,
  onCancel,
}: {
  onComplete: (plan: EnrolledPlan) => void
  onCancel: () => void
}) {
  const [pathway, setPathway] = useState<PlanPathway | null>(null)
  const [step, setStep] = useState(0)
  const [error, setError] = useState<string | null>(null)

  // Applicant
  const [applicant, setApplicant] = useState({
    firstName: '',
    middleInitial: '',
    lastName: '',
    dob: '',
    ssn: '',
    sex: '',
    phone: '',
    email: '',
    street: '',
    apt: '',
    city: '',
    state: 'TX',
    zip: '',
    county: '',
    citizenship: 'U.S. citizen',
    tobacco: 'No',
    emergencyName: '',
    emergencyPhone: '',
    emergencyRelation: 'Spouse',
  })

  // ACA
  const [aca, setAca] = useState({
    householdSize: '1',
    annualIncome: '',
    filingStatus: 'Single',
    coverageStart: '',
    currentCoverage: 'None',
  })
  const [dependents, setDependents] = useState<Dependent[]>([])

  // Medicare
  const [medicare, setMedicare] = useState({
    mbi: '',
    partAEffective: '',
    partBEffective: '',
    electionPeriod: 'AEP (Oct 15 – Dec 7)',
    currentCoverage: 'Original Medicare only',
    preferredPlanLetter: 'Plan G',
    preferredPcp: '',
    preferredPharmacy: '',
    sepEventDate: '',
  })

  // Dental
  const [dental, setDental] = useState({
    priorCoverage: 'No',
    priorCarrier: '',
    coverageStart: '',
  })

  // Group
  const [group, setGroup] = useState({
    employerName: '',
    ein: '',
    industry: '',
    groupSize: '',
    contactName: '',
    contactTitle: '',
    contactEmail: '',
    renewalMonth: '',
  })

  // Review / sign
  const [payment, setPayment] = useState('Bank draft (EFT)')
  const [agree, setAgree] = useState(false)
  const [signature, setSignature] = useState('')

  const needsDependents = pathway === 'aca-individual-family' || pathway === 'dental'
  const totalSteps = 4

  const set =
    <T,>(setter: (fn: (prev: T) => T) => void) =>
    (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      const { name, value } = e.target
      setter((prev) => ({ ...prev, [name]: value }))
      setError(null)
    }

  const setApplicantField = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    let v = value
    if (name === 'ssn') v = formatSsn(value)
    if (name === 'phone') v = formatPhone(value)
    if (name === 'emergencyPhone') v = formatPhone(value)
    if (name === 'zip') v = value.replace(/\D/g, '').slice(0, 5)
    setApplicant((prev) => ({ ...prev, [name]: v }))
    setError(null)
  }

  const validateApplicant = (): string | null => {
    if (!applicant.firstName.trim() || !applicant.lastName.trim()) return 'Enter your legal first and last name.'
    if (!applicant.dob) return 'Enter your date of birth.'
    if (applicant.ssn.replace(/\D/g, '').length !== 9) return 'Enter a valid 9-digit Social Security number.'
    if (!applicant.sex) return 'Select a sex as it appears on legal documents.'
    if (applicant.phone.replace(/\D/g, '').length !== 10) return 'Enter a 10-digit phone number.'
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(applicant.email.trim())) return 'Enter a valid email address.'
    if (!applicant.street.trim() || !applicant.city.trim() || applicant.zip.length !== 5)
      return 'Complete your residential address (street, city, 5-digit ZIP).'
    if (!applicant.emergencyName.trim()) return 'Enter an emergency contact name.'
    if (applicant.emergencyPhone.replace(/\D/g, '').length !== 10)
      return 'Enter a 10-digit emergency contact phone.'
    return null
  }

  const validatePathwayStep = (): string | null => {
    if (pathway === 'aca-individual-family') {
      if (!aca.annualIncome) return 'Enter estimated annual household income.'
      if (!aca.coverageStart) return 'Choose a requested coverage start date.'
    }
    if (pathway === 'medicare-advantage' || pathway === 'medicare-supplement') {
      if (medicare.mbi.replace(/-/g, '').length !== 11)
        return 'Enter your 11-character Medicare number (MBI).'
      if (!medicare.partAEffective || !medicare.partBEffective)
        return 'Enter your Part A and Part B effective dates.'
    }
    if (pathway === 'dental' && !dental.coverageStart) return 'Choose a requested coverage start date.'
    if (pathway === 'group') {
      if (!group.employerName.trim()) return 'Enter the employer or organization name.'
      if (group.ein.replace(/\D/g, '').length !== 9) return 'Enter a valid 9-digit EIN.'
      if (!group.groupSize) return 'Enter the approximate number of eligible employees.'
      if (!group.contactName.trim()) return 'Enter a benefits contact name.'
    }
    for (const d of dependents) {
      if (!d.firstName.trim() || !d.lastName.trim() || !d.dob)
        return 'Complete name and date of birth for every dependent, or remove empty rows.'
    }
    return null
  }

  const next = () => {
    if (step === 1) {
      const err = validateApplicant()
      if (err) return setError(err)
    }
    if (step === 2) {
      const err = validatePathwayStep()
      if (err) return setError(err)
    }
    setError(null)
    setStep((s) => s + 1)
  }

  const submit = () => {
    if (!agree) return setError('You must agree to the authorization and terms to submit.')
    const expected = `${applicant.firstName} ${applicant.lastName}`.trim().toLowerCase()
    if (signature.trim().toLowerCase() !== expected)
      return setError('Type your full legal name exactly as entered to e-sign.')

    const meta = PATHWAYS.find((p) => p.id === pathway)!
    const planId = `CM-${new Date().getFullYear()}-${Math.random().toString(36).slice(2, 8).toUpperCase()}`
    const effectiveDate =
      pathway === 'aca-individual-family'
        ? aca.coverageStart
        : pathway === 'dental'
          ? dental.coverageStart
          : new Date(new Date().getFullYear(), new Date().getMonth() + 1, 1).toISOString().slice(0, 10)

    onComplete({
      pathway: pathway!,
      name: meta.name,
      planId,
      status: 'Pending review',
      submittedAt: new Date().toISOString(),
      effectiveDate,
    })
  }

  /* ------------------------------ Step 0: pathway ------------------------------ */
  if (step === 0) {
    return (
      <div>
        <StepHeading step={1} total={totalSteps} title="What are you enrolling in?" />
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {PATHWAYS.map((p) => (
            <button
              key={p.id}
              type="button"
              onClick={() => setPathway(p.id)}
              className={`rounded-[14px] border p-4 text-left transition ${
                pathway === p.id
                  ? 'border-[#0F3D2E] bg-[#0F3D2E] text-[#FAFCFB]'
                  : 'border-[#14432A]/12 bg-white text-[#14432A] hover:border-[#14432A]/35'
              }`}
            >
              <p className="m-0 font-sans text-[0.9375rem] font-semibold">{p.name}</p>
              <p
                className={`mb-0 mt-1 font-sans text-[0.8125rem] leading-[1.5] ${
                  pathway === p.id ? 'text-[#FAFCFB]/75' : 'text-[#55655D]'
                }`}
              >
                {p.blurb}
              </p>
            </button>
          ))}
        </div>
        <div className="mt-6 flex items-center gap-3">
          <button
            type="button"
            disabled={!pathway}
            onClick={() => setStep(1)}
            className="inline-flex items-center justify-center rounded-[10px] bg-[#0F3D2E] px-5 py-2 font-sans text-[0.875rem] font-semibold text-[#FAFCFB] transition hover:bg-[#0A2E22] disabled:cursor-not-allowed disabled:opacity-50"
          >
            Continue
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="font-sans text-[0.8125rem] font-semibold text-[#55655D] hover:text-[#14432A]"
          >
            Cancel
          </button>
        </div>
      </div>
    )
  }

  /* ------------------------------ Step 1: applicant ------------------------------ */
  if (step === 1) {
    return (
      <div>
        <StepHeading step={2} total={totalSteps} title="Applicant information" />
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-6">
          <Field label="First name" className="sm:col-span-2">
            <input name="firstName" value={applicant.firstName} onChange={setApplicantField} className={fieldClass} placeholder="First" />
          </Field>
          <Field label="M.I." className="sm:col-span-1">
            <input name="middleInitial" maxLength={1} value={applicant.middleInitial} onChange={setApplicantField} className={fieldClass} placeholder="" />
          </Field>
          <Field label="Last name" className="sm:col-span-3">
            <input name="lastName" value={applicant.lastName} onChange={setApplicantField} className={fieldClass} placeholder="Last" />
          </Field>

          <Field label="Date of birth" className="sm:col-span-2">
            <input type="date" name="dob" value={applicant.dob} onChange={setApplicantField} className={fieldClass} />
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
            <input name="street" value={applicant.street} onChange={setApplicantField} className={fieldClass} placeholder="Street" />
          </Field>
          <Field label="Apt / Unit" className="sm:col-span-2">
            <input name="apt" value={applicant.apt} onChange={setApplicantField} className={fieldClass} placeholder="Optional" />
          </Field>

          <Field label="City" className="sm:col-span-2">
            <input name="city" value={applicant.city} onChange={setApplicantField} className={fieldClass} placeholder="City" />
          </Field>
          <Field label="State" className="sm:col-span-1">
            <select name="state" value={applicant.state} onChange={setApplicantField} className={fieldClass}>
              {US_STATES.map((s) => (
                <option key={s}>{s}</option>
              ))}
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

          <p className="mb-0 mt-2 font-sans text-[0.75rem] font-semibold uppercase tracking-[0.1em] text-[#55655D] sm:col-span-6">
            Emergency contact
          </p>
          <Field label="Full name" className="sm:col-span-2">
            <input name="emergencyName" value={applicant.emergencyName} onChange={setApplicantField} className={fieldClass} placeholder="Contact name" />
          </Field>
          <Field label="Phone" className="sm:col-span-2">
            <input name="emergencyPhone" inputMode="numeric" value={applicant.emergencyPhone} onChange={setApplicantField} className={fieldClass} placeholder="(555) 555-5555" />
          </Field>
          <Field label="Relationship" className="sm:col-span-2">
            <select name="emergencyRelation" value={applicant.emergencyRelation} onChange={setApplicantField} className={fieldClass}>
              <option>Spouse</option>
              <option>Parent</option>
              <option>Child</option>
              <option>Sibling</option>
              <option>Friend</option>
              <option>Other</option>
            </select>
          </Field>
        </div>

        {error ? <p className="mb-0 mt-4 font-sans text-[0.8125rem] text-[#B3402A]">{error}</p> : null}

        <div className="mt-6 flex items-center gap-3">
          <button type="button" onClick={next} className="inline-flex items-center justify-center rounded-[10px] bg-[#0F3D2E] px-5 py-2 font-sans text-[0.875rem] font-semibold text-[#FAFCFB] transition hover:bg-[#0A2E22]">
            Continue
          </button>
          <button type="button" onClick={() => setStep(0)} className="font-sans text-[0.8125rem] font-semibold text-[#55655D] hover:text-[#14432A]">
            Back
          </button>
        </div>
      </div>
    )
  }

  /* ------------------------------ Step 2: pathway details ------------------------------ */
  if (step === 2) {
    return (
      <div>
        <StepHeading
          step={3}
          total={totalSteps}
          title={PATHWAYS.find((p) => p.id === pathway)?.name ?? 'Plan details'}
        />

        {pathway === 'aca-individual-family' ? (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-6">
            <Field label="Household size" className="sm:col-span-2">
              <input name="householdSize" inputMode="numeric" value={aca.householdSize} onChange={set(setAca)} className={fieldClass} />
            </Field>
            <Field label="Estimated annual household income" className="sm:col-span-2">
              <input name="annualIncome" inputMode="numeric" value={aca.annualIncome} onChange={set(setAca)} className={fieldClass} placeholder="$" />
            </Field>
            <Field label="Tax filing status" className="sm:col-span-2">
              <select name="filingStatus" value={aca.filingStatus} onChange={set(setAca)} className={fieldClass}>
                <option>Single</option>
                <option>Married filing jointly</option>
                <option>Married filing separately</option>
                <option>Head of household</option>
              </select>
            </Field>
            <Field label="Requested coverage start" className="sm:col-span-3">
              <input type="date" name="coverageStart" value={aca.coverageStart} onChange={set(setAca)} className={fieldClass} />
            </Field>
            <Field label="Current coverage" className="sm:col-span-3">
              <select name="currentCoverage" value={aca.currentCoverage} onChange={set(setAca)} className={fieldClass}>
                <option>None</option>
                <option>Employer plan ending</option>
                <option>Marketplace plan</option>
                <option>Medicaid / CHIP</option>
                <option>Other</option>
              </select>
            </Field>
          </div>
        ) : null}

        {pathway === 'medicare-advantage' || pathway === 'medicare-supplement' ? (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-6">
            <Field label="Medicare number (MBI)" className="sm:col-span-3">
              <input
                name="mbi"
                value={medicare.mbi}
                onChange={(e) => {
                  setMedicare((p) => ({ ...p, mbi: formatMbi(e.target.value) }))
                  setError(null)
                }}
                className={fieldClass}
                placeholder="XXXX-XXX-XXXX"
              />
            </Field>
            <Field label="Election period" className="sm:col-span-3">
              <select name="electionPeriod" value={medicare.electionPeriod} onChange={set(setMedicare)} className={fieldClass}>
                <option>AEP (Oct 15 – Dec 7)</option>
                <option>OEP (Jan 1 – Mar 31)</option>
                <option>IEP (turning 65)</option>
                <option>SEP (qualifying event)</option>
                <option>Medigap open enrollment</option>
              </select>
            </Field>
            <Field label="Part A effective date" className="sm:col-span-3">
              <input type="date" name="partAEffective" value={medicare.partAEffective} onChange={set(setMedicare)} className={fieldClass} />
            </Field>
            <Field label="Part B effective date" className="sm:col-span-3">
              <input type="date" name="partBEffective" value={medicare.partBEffective} onChange={set(setMedicare)} className={fieldClass} />
            </Field>
            <Field label="Current coverage" className="sm:col-span-3">
              <select name="currentCoverage" value={medicare.currentCoverage} onChange={set(setMedicare)} className={fieldClass}>
                <option>Original Medicare only</option>
                <option>Medicare Advantage plan</option>
                <option>Medicare Supplement plan</option>
                <option>Employer / retiree coverage</option>
              </select>
            </Field>
            {pathway === 'medicare-supplement' ? (
              <Field label="Preferred plan letter" className="sm:col-span-3">
                <select name="preferredPlanLetter" value={medicare.preferredPlanLetter} onChange={set(setMedicare)} className={fieldClass}>
                  <option>Plan G</option>
                  <option>Plan N</option>
                  <option>Plan F (if eligible)</option>
                  <option>High-deductible G</option>
                  <option>Undecided — request guidance</option>
                </select>
              </Field>
            ) : null}
            {pathway === 'medicare-advantage' ? (
              <>
                <Field label="Preferred primary care physician" className="sm:col-span-3">
                  <input name="preferredPcp" value={medicare.preferredPcp} onChange={set(setMedicare)} className={fieldClass} placeholder="PCP name or practice" />
                </Field>
                <Field label="Preferred pharmacy" className="sm:col-span-3">
                  <input name="preferredPharmacy" value={medicare.preferredPharmacy} onChange={set(setMedicare)} className={fieldClass} placeholder="Pharmacy name" />
                </Field>
              </>
            ) : null}
            {medicare.electionPeriod.startsWith('SEP') ? (
              <Field label="SEP qualifying event date" className="sm:col-span-3">
                <input type="date" name="sepEventDate" value={medicare.sepEventDate} onChange={set(setMedicare)} className={fieldClass} />
              </Field>
            ) : null}
          </div>
        ) : null}

        {pathway === 'dental' ? (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-6">
            <Field label="Requested coverage start" className="sm:col-span-2">
              <input type="date" name="coverageStart" value={dental.coverageStart} onChange={set(setDental)} className={fieldClass} />
            </Field>
            <Field label="Prior dental coverage (last 12 months)" className="sm:col-span-2">
              <select name="priorCoverage" value={dental.priorCoverage} onChange={set(setDental)} className={fieldClass}>
                <option>No</option>
                <option>Yes</option>
              </select>
            </Field>
            <Field label="Prior carrier (if any)" className="sm:col-span-2">
              <input name="priorCarrier" value={dental.priorCarrier} onChange={set(setDental)} className={fieldClass} placeholder="Carrier name" />
            </Field>
          </div>
        ) : null}

        {pathway === 'group' ? (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-6">
            <Field label="Employer / organization name" className="sm:col-span-4">
              <input name="employerName" value={group.employerName} onChange={set(setGroup)} className={fieldClass} />
            </Field>
            <Field label="EIN" className="sm:col-span-2">
              <input
                name="ein"
                inputMode="numeric"
                value={group.ein}
                onChange={(e) => {
                  const d = e.target.value.replace(/\D/g, '').slice(0, 9)
                  setGroup((p) => ({ ...p, ein: d.length > 2 ? `${d.slice(0, 2)}-${d.slice(2)}` : d }))
                  setError(null)
                }}
                className={fieldClass}
                placeholder="XX-XXXXXXX"
              />
            </Field>
            <Field label="Industry" className="sm:col-span-3">
              <input name="industry" value={group.industry} onChange={set(setGroup)} className={fieldClass} />
            </Field>
            <Field label="Eligible employees" className="sm:col-span-3">
              <input name="groupSize" inputMode="numeric" value={group.groupSize} onChange={set(setGroup)} className={fieldClass} />
            </Field>
            <Field label="Benefits contact name" className="sm:col-span-2">
              <input name="contactName" value={group.contactName} onChange={set(setGroup)} className={fieldClass} />
            </Field>
            <Field label="Contact title" className="sm:col-span-2">
              <input name="contactTitle" value={group.contactTitle} onChange={set(setGroup)} className={fieldClass} />
            </Field>
            <Field label="Contact email" className="sm:col-span-2">
              <input name="contactEmail" type="email" value={group.contactEmail} onChange={set(setGroup)} className={fieldClass} />
            </Field>
            <Field label="Current renewal month" className="sm:col-span-3">
              <select name="renewalMonth" value={group.renewalMonth} onChange={set(setGroup)} className={fieldClass}>
                <option value="">Select…</option>
                {['January','February','March','April','May','June','July','August','September','October','November','December'].map((m) => (
                  <option key={m}>{m}</option>
                ))}
              </select>
            </Field>
          </div>
        ) : null}

        {needsDependents ? (
          <div className="mt-6">
            <div className="mb-2 flex items-center justify-between">
              <p className="m-0 font-sans text-[0.8125rem] font-semibold text-[#14432A]">Dependents to cover</p>
              <button
                type="button"
                onClick={() => setDependents((d) => [...d, emptyDependent()])}
                className="font-sans text-[0.8125rem] font-semibold text-[#0F3D2E] hover:underline"
              >
                + Add dependent
              </button>
            </div>
            {dependents.length === 0 ? (
              <p className="m-0 font-sans text-[0.8125rem] text-[#55655D]">No dependents added — applicant-only coverage.</p>
            ) : (
              <div className="space-y-3">
                {dependents.map((d, i) => (
                  <div key={i} className="grid grid-cols-1 gap-2 rounded-[12px] border border-[#14432A]/10 bg-white p-3 sm:grid-cols-10">
                    <input
                      value={d.firstName}
                      onChange={(e) => setDependents((arr) => arr.map((x, j) => (j === i ? { ...x, firstName: e.target.value } : x)))}
                      className={`${fieldClass} sm:col-span-2`}
                      placeholder="First name"
                    />
                    <input
                      value={d.lastName}
                      onChange={(e) => setDependents((arr) => arr.map((x, j) => (j === i ? { ...x, lastName: e.target.value } : x)))}
                      className={`${fieldClass} sm:col-span-2`}
                      placeholder="Last name"
                    />
                    <input
                      type="date"
                      value={d.dob}
                      onChange={(e) => setDependents((arr) => arr.map((x, j) => (j === i ? { ...x, dob: e.target.value } : x)))}
                      className={`${fieldClass} sm:col-span-2`}
                    />
                    <input
                      value={d.ssn}
                      inputMode="numeric"
                      onChange={(e) => setDependents((arr) => arr.map((x, j) => (j === i ? { ...x, ssn: formatSsn(e.target.value) } : x)))}
                      className={`${fieldClass} sm:col-span-2`}
                      placeholder="SSN"
                    />
                    <select
                      value={d.relationship}
                      onChange={(e) => setDependents((arr) => arr.map((x, j) => (j === i ? { ...x, relationship: e.target.value } : x)))}
                      className={`${fieldClass} sm:col-span-1`}
                    >
                      <option>Spouse</option>
                      <option>Child</option>
                      <option>Other</option>
                    </select>
                    <button
                      type="button"
                      onClick={() => setDependents((arr) => arr.filter((_, j) => j !== i))}
                      className="font-sans text-[0.8125rem] font-semibold text-[#B3402A] sm:col-span-1"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : null}

        {error ? <p className="mb-0 mt-4 font-sans text-[0.8125rem] text-[#B3402A]">{error}</p> : null}

        <div className="mt-6 flex items-center gap-3">
          <button type="button" onClick={next} className="inline-flex items-center justify-center rounded-[10px] bg-[#0F3D2E] px-5 py-2 font-sans text-[0.875rem] font-semibold text-[#FAFCFB] transition hover:bg-[#0A2E22]">
            Continue
          </button>
          <button type="button" onClick={() => setStep(1)} className="font-sans text-[0.8125rem] font-semibold text-[#55655D] hover:text-[#14432A]">
            Back
          </button>
        </div>
      </div>
    )
  }

  /* ------------------------------ Step 3: review & sign ------------------------------ */
  const meta = PATHWAYS.find((p) => p.id === pathway)!
  return (
    <div>
      <StepHeading step={4} total={totalSteps} title="Review and e-sign" />

      <div className="rounded-[12px] border border-[#14432A]/10 bg-white p-4">
        <dl className="m-0 grid grid-cols-1 gap-x-6 gap-y-2 sm:grid-cols-2">
          <div>
            <dt className="font-sans text-[0.6875rem] font-semibold uppercase tracking-[0.08em] text-[#55655D]">Pathway</dt>
            <dd className="m-0 font-sans text-[0.875rem] font-semibold text-[#14432A]">{meta.name}</dd>
          </div>
          <div>
            <dt className="font-sans text-[0.6875rem] font-semibold uppercase tracking-[0.08em] text-[#55655D]">Applicant</dt>
            <dd className="m-0 font-sans text-[0.875rem] text-[#14432A]">
              {applicant.firstName} {applicant.middleInitial} {applicant.lastName} · DOB {applicant.dob}
            </dd>
          </div>
          <div>
            <dt className="font-sans text-[0.6875rem] font-semibold uppercase tracking-[0.08em] text-[#55655D]">Address</dt>
            <dd className="m-0 font-sans text-[0.875rem] text-[#14432A]">
              {applicant.street}
              {applicant.apt ? `, ${applicant.apt}` : ''}, {applicant.city}, {applicant.state} {applicant.zip}
            </dd>
          </div>
          <div>
            <dt className="font-sans text-[0.6875rem] font-semibold uppercase tracking-[0.08em] text-[#55655D]">Contact</dt>
            <dd className="m-0 font-sans text-[0.875rem] text-[#14432A]">
              {applicant.phone} · {applicant.email}
            </dd>
          </div>
          {needsDependents && dependents.length > 0 ? (
            <div className="sm:col-span-2">
              <dt className="font-sans text-[0.6875rem] font-semibold uppercase tracking-[0.08em] text-[#55655D]">Dependents</dt>
              <dd className="m-0 font-sans text-[0.875rem] text-[#14432A]">
                {dependents.map((d) => `${d.firstName} ${d.lastName} (${d.relationship})`).join(', ')}
              </dd>
            </div>
          ) : null}
        </dl>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
        <Field label="Premium payment preference">
          <select value={payment} onChange={(e) => setPayment(e.target.value)} className={fieldClass}>
            <option>Bank draft (EFT)</option>
            <option>Credit / debit card</option>
            <option>Direct bill</option>
            <option>Social Security deduction (Medicare)</option>
          </select>
        </Field>
        <Field label="E-signature (type your full legal name)">
          <input
            value={signature}
            onChange={(e) => {
              setSignature(e.target.value)
              setError(null)
            }}
            className={fieldClass}
            placeholder={`${applicant.firstName} ${applicant.lastName}`.trim() || 'Full legal name'}
          />
        </Field>
      </div>

      <label className="mt-4 flex items-start gap-2.5 font-sans text-[0.8125rem] leading-[1.55] text-[#55655D]">
        <input
          type="checkbox"
          checked={agree}
          onChange={(e) => {
            setAgree(e.target.checked)
            setError(null)
          }}
          className="mt-1 h-4 w-4 rounded border-[#14432A]/30 text-[#14432A]"
        />
        <span>
          I attest the information provided is true and complete. I authorize Centuries Mutual to
          submit this application to the applicable carrier, verify eligibility, and contact me about
          this enrollment. I understand submission does not guarantee coverage; benefits are governed
          solely by plan documents, underwriting, and applicable law.
        </span>
      </label>

      {error ? <p className="mb-0 mt-4 font-sans text-[0.8125rem] text-[#B3402A]">{error}</p> : null}

      <div className="mt-6 flex items-center gap-3">
        <button type="button" onClick={submit} className="inline-flex items-center justify-center rounded-[10px] bg-[#0F3D2E] px-5 py-2 font-sans text-[0.875rem] font-semibold text-[#FAFCFB] transition hover:bg-[#0A2E22]">
          Submit enrollment
        </button>
        <button type="button" onClick={() => setStep(2)} className="font-sans text-[0.8125rem] font-semibold text-[#55655D] hover:text-[#14432A]">
          Back
        </button>
      </div>
    </div>
  )
}
