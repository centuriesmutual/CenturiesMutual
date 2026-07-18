'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

export const CAREER_ROLES = [
  'General Interest',
  'Licensed Insurance Agent',
  'Enrollment Coordinator',
  'Member Services Specialist',
  'Community Outreach Associate',
  'Full-Stack Engineer',
  'iOS Engineer',
  'Product Designer',
  'Data/BI Analyst',
  'Compliance Analyst',
  'Operations Associate',
] as const

export type CareerRole = (typeof CAREER_ROLES)[number]

type FormState = {
  first_name: string
  last_name: string
  email: string
  phone: string
  location: string
  work_authorization: string
  linkedin_url: string
  portfolio_url: string
  cover_letter: string
  years_experience: string
  how_heard: string
}

const EMPTY: FormState = {
  first_name: '',
  last_name: '',
  email: '',
  phone: '',
  location: '',
  work_authorization: '',
  linkedin_url: '',
  portfolio_url: '',
  cover_letter: '',
  years_experience: '',
  how_heard: '',
}

const inputClass =
  'w-full rounded-[10px] border border-[#14432A]/15 bg-[#FAFCFB] px-3.5 py-2.5 font-sans text-[0.9375rem] text-[#14432A] outline-none transition focus:border-[#0F3D2E] focus:ring-2 focus:ring-[#0F3D2E]/15'
const labelClass =
  'mb-1.5 block font-sans text-[0.8125rem] font-semibold text-[#14432A]'

const STEPS = ['Role', 'Contact', 'Background', 'Review'] as const

export function CareersApplicationFlow({
  initialPosition,
  onClose,
}: {
  initialPosition: CareerRole
  onClose: () => void
}) {
  const [step, setStep] = useState(0)
  const [position, setPosition] = useState<CareerRole>(initialPosition)
  const [form, setForm] = useState<FormState>(EMPTY)
  const [attest, setAttest] = useState(false)
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle')
  const [error, setError] = useState<string | null>(null)
  const [referenceId, setReferenceId] = useState<string | null>(null)

  useEffect(() => {
    setPosition(initialPosition)
  }, [initialPosition])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && status !== 'submitting') onClose()
    }
    document.addEventListener('keydown', onKey)
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = prev
    }
  }, [onClose, status])

  const update =
    (key: keyof FormState) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      setForm((f) => ({ ...f, [key]: e.target.value }))
      setError(null)
    }

  const validateStep = (): string | null => {
    if (step === 0 && !position) return 'Select a role to continue.'
    if (step === 1) {
      if (!form.first_name.trim() || !form.last_name.trim()) return 'Enter your first and last name.'
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(form.email.trim())) return 'Enter a valid email.'
    }
    if (step === 3 && !attest) return 'Confirm the attestation to submit.'
    return null
  }

  const next = () => {
    const err = validateStep()
    if (err) {
      setError(err)
      return
    }
    setError(null)
    setStep((s) => Math.min(STEPS.length - 1, s + 1))
  }

  const normalizeOptionalUrl = (value: string) => {
    const trimmed = value.trim()
    if (!trimmed || trimmed === 'https://' || trimmed === 'http://') return ''
    return trimmed
  }

  const submit = async () => {
    const err = validateStep()
    if (err) {
      setError(err)
      return
    }
    setStatus('submitting')
    setError(null)
    try {
      const cover = [
        form.cover_letter.trim(),
        form.years_experience.trim()
          ? `Years of experience: ${form.years_experience.trim()}`
          : '',
        form.how_heard.trim() ? `How they heard about us: ${form.how_heard.trim()}` : '',
      ]
        .filter(Boolean)
        .join('\n\n')

      const res = await fetch('/api/careers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          first_name: form.first_name.trim(),
          last_name: form.last_name.trim(),
          email: form.email.trim(),
          phone: form.phone.trim() || undefined,
          position,
          location: form.location.trim() || null,
          work_authorization: form.work_authorization.trim() || null,
          linkedin_url: normalizeOptionalUrl(form.linkedin_url),
          portfolio_url: normalizeOptionalUrl(form.portfolio_url),
          cover_letter: cover || null,
        }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok || !data?.ok) {
        setError(data?.error || 'Could not submit your application. Please try again.')
        setStatus('error')
        return
      }
      setReferenceId(typeof data.id === 'string' ? data.id : null)
      setStatus('success')
    } catch {
      setError('Network error. Please try again.')
      setStatus('error')
    }
  }

  return (
    <motion.div
      className="fixed inset-0 z-[120] flex items-end justify-center bg-black/50 p-0 sm:items-center sm:p-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="careers-apply-title"
      onClick={(e) => {
        if (e.target === e.currentTarget && status !== 'submitting') onClose()
      }}
    >
      <motion.div
        className="flex max-h-[min(92dvh,880px)] w-full max-w-2xl flex-col overflow-hidden rounded-t-2xl bg-[#FAFCFB] shadow-2xl sm:rounded-2xl"
        initial={{ y: 40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 24, opacity: 0 }}
        transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
      >
        <header className="flex items-start justify-between gap-3 border-b border-[#E8DFD6] bg-[#0F3D2E] px-5 py-4 sm:px-6">
          <div>
            <p className="m-0 font-sans text-[10px] font-semibold uppercase tracking-[0.2em] text-[#C9A53E]">
              Application
            </p>
            <h2
              id="careers-apply-title"
              className="m-0 mt-1 font-medium text-[#FAFCFB]"
              style={{
                fontFamily: "'Playfair Display', Georgia, serif",
                fontSize: '1.35rem',
              }}
            >
              {status === 'success' ? 'Application received' : 'Apply to Centuries Mutual'}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={status === 'submitting'}
            className="rounded-lg border border-white/20 px-2.5 py-1.5 font-sans text-[0.75rem] font-semibold text-white/90 transition hover:bg-white/10 disabled:opacity-50"
          >
            Close
          </button>
        </header>

        {status !== 'success' ? (
          <div className="flex gap-2 border-b border-[#E8DFD6] bg-white px-5 py-3 sm:px-6">
            {STEPS.map((label, i) => (
              <div key={label} className="flex min-w-0 flex-1 flex-col gap-1">
                <div
                  className={`h-1 rounded-full ${i <= step ? 'bg-[#0F3D2E]' : 'bg-[#14432A]/12'}`}
                />
                <span
                  className={`truncate font-sans text-[0.65rem] font-semibold uppercase tracking-[0.08em] ${
                    i === step ? 'text-[#0F3D2E]' : 'text-[#55655D]/70'
                  }`}
                >
                  {label}
                </span>
              </div>
            ))}
          </div>
        ) : null}

        <div className="min-h-0 flex-1 overflow-y-auto px-5 py-5 sm:px-6 sm:py-6">
          {status === 'success' ? (
            <div className="py-6 text-center">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[#0F3D2E] text-[#C9A53E]">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" aria-hidden>
                  <path
                    d="M20 6 9 17l-5-5"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <p className="mb-2 font-sans text-[1.05rem] font-semibold text-[#14432A]">
                Thank you — your application is in review.
              </p>
              <p className="mx-auto mb-4 max-w-md font-sans text-[0.9rem] leading-[1.6] text-[#55655D]">
                Our talent team reviews every submission. You will hear from us if there is a
                fit for <strong className="text-[#14432A]">{position}</strong>.
              </p>
              {referenceId ? (
                <p className="mb-6 font-mono text-[0.75rem] text-[#55655D]/80">
                  Reference {referenceId}
                </p>
              ) : null}
              <button
                type="button"
                onClick={onClose}
                className="inline-flex rounded-[10px] bg-[#0F3D2E] px-5 py-2.5 font-sans text-[0.875rem] font-semibold text-[#FAFCFB] transition hover:bg-[#0A2E22]"
              >
                Done
              </button>
            </div>
          ) : (
            <>
              {step === 0 && (
                <div>
                  <p className="mb-4 font-sans text-[0.9rem] leading-[1.6] text-[#55655D]">
                    Confirm the role you are applying for. Submissions route to the Centuries
                    Mutual admin careers queue for review.
                  </p>
                  <label className={labelClass} htmlFor="position">
                    Role of interest
                  </label>
                  <select
                    id="position"
                    className={inputClass}
                    value={position}
                    onChange={(e) => setPosition(e.target.value as CareerRole)}
                  >
                    {CAREER_ROLES.map((role) => (
                      <option key={role} value={role}>
                        {role}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {step === 1 && (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label className={labelClass} htmlFor="first_name">
                      First name
                    </label>
                    <input
                      id="first_name"
                      className={inputClass}
                      value={form.first_name}
                      onChange={update('first_name')}
                      required
                      maxLength={60}
                      autoComplete="given-name"
                    />
                  </div>
                  <div>
                    <label className={labelClass} htmlFor="last_name">
                      Last name
                    </label>
                    <input
                      id="last_name"
                      className={inputClass}
                      value={form.last_name}
                      onChange={update('last_name')}
                      required
                      maxLength={60}
                      autoComplete="family-name"
                    />
                  </div>
                  <div>
                    <label className={labelClass} htmlFor="email">
                      Email
                    </label>
                    <input
                      id="email"
                      type="email"
                      className={inputClass}
                      value={form.email}
                      onChange={update('email')}
                      required
                      autoComplete="email"
                    />
                  </div>
                  <div>
                    <label className={labelClass} htmlFor="phone">
                      Phone <span className="font-normal text-[#55655D]">(optional)</span>
                    </label>
                    <input
                      id="phone"
                      className={inputClass}
                      value={form.phone}
                      onChange={update('phone')}
                      inputMode="tel"
                      autoComplete="tel"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className={labelClass} htmlFor="location">
                      Location <span className="font-normal text-[#55655D]">(optional)</span>
                    </label>
                    <input
                      id="location"
                      className={inputClass}
                      value={form.location}
                      onChange={update('location')}
                      placeholder="City, State"
                    />
                  </div>
                </div>
              )}

              {step === 2 && (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label className={labelClass} htmlFor="work_authorization">
                      Work authorization{' '}
                      <span className="font-normal text-[#55655D]">(optional)</span>
                    </label>
                    <input
                      id="work_authorization"
                      className={inputClass}
                      value={form.work_authorization}
                      onChange={update('work_authorization')}
                      placeholder="e.g. Authorized to work in the U.S."
                    />
                  </div>
                  <div>
                    <label className={labelClass} htmlFor="years_experience">
                      Years of experience{' '}
                      <span className="font-normal text-[#55655D]">(optional)</span>
                    </label>
                    <input
                      id="years_experience"
                      className={inputClass}
                      value={form.years_experience}
                      onChange={update('years_experience')}
                      placeholder="e.g. 5"
                    />
                  </div>
                  <div>
                    <label className={labelClass} htmlFor="linkedin_url">
                      LinkedIn <span className="font-normal text-[#55655D]">(optional)</span>
                    </label>
                    <input
                      id="linkedin_url"
                      type="url"
                      className={inputClass}
                      value={form.linkedin_url}
                      onChange={update('linkedin_url')}
                      placeholder="https://"
                    />
                  </div>
                  <div>
                    <label className={labelClass} htmlFor="portfolio_url">
                      Resume / portfolio link{' '}
                      <span className="font-normal text-[#55655D]">(optional)</span>
                    </label>
                    <input
                      id="portfolio_url"
                      type="url"
                      className={inputClass}
                      value={form.portfolio_url}
                      onChange={update('portfolio_url')}
                      placeholder="https://"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className={labelClass} htmlFor="how_heard">
                      How did you hear about us?{' '}
                      <span className="font-normal text-[#55655D]">(optional)</span>
                    </label>
                    <input
                      id="how_heard"
                      className={inputClass}
                      value={form.how_heard}
                      onChange={update('how_heard')}
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className={labelClass} htmlFor="cover_letter">
                      Why Centuries Mutual?{' '}
                      <span className="font-normal text-[#55655D]">(optional)</span>
                    </label>
                    <textarea
                      id="cover_letter"
                      className={`${inputClass} min-h-[120px] resize-y`}
                      value={form.cover_letter}
                      onChange={update('cover_letter')}
                      maxLength={5000}
                      placeholder="A short introduction goes further than a polished résumé."
                    />
                  </div>
                </div>
              )}

              {step === 3 && (
                <div>
                  <div className="rounded-[12px] border border-[#14432A]/10 bg-white p-4">
                    <dl className="m-0 grid grid-cols-1 gap-3 sm:grid-cols-2">
                      <div>
                        <dt className="font-sans text-[0.65rem] font-semibold uppercase tracking-[0.1em] text-[#55655D]">
                          Role
                        </dt>
                        <dd className="m-0 font-sans text-[0.9rem] font-semibold text-[#14432A]">
                          {position}
                        </dd>
                      </div>
                      <div>
                        <dt className="font-sans text-[0.65rem] font-semibold uppercase tracking-[0.1em] text-[#55655D]">
                          Applicant
                        </dt>
                        <dd className="m-0 font-sans text-[0.9rem] text-[#14432A]">
                          {form.first_name} {form.last_name}
                        </dd>
                      </div>
                      <div>
                        <dt className="font-sans text-[0.65rem] font-semibold uppercase tracking-[0.1em] text-[#55655D]">
                          Contact
                        </dt>
                        <dd className="m-0 font-sans text-[0.9rem] text-[#14432A]">
                          {form.email}
                          {form.phone ? ` · ${form.phone}` : ''}
                        </dd>
                      </div>
                      <div>
                        <dt className="font-sans text-[0.65rem] font-semibold uppercase tracking-[0.1em] text-[#55655D]">
                          Location
                        </dt>
                        <dd className="m-0 font-sans text-[0.9rem] text-[#14432A]">
                          {form.location || '—'}
                        </dd>
                      </div>
                    </dl>
                  </div>
                  <label className="mt-4 flex items-start gap-2.5 font-sans text-[0.8125rem] leading-[1.55] text-[#55655D]">
                    <input
                      type="checkbox"
                      checked={attest}
                      onChange={(e) => {
                        setAttest(e.target.checked)
                        setError(null)
                      }}
                      className="mt-1 h-4 w-4 accent-[#0F3D2E]"
                    />
                    <span>
                      I attest that the information provided is true and complete. I authorize
                      Centuries Mutual to contact me about this application and to retain my
                      materials for recruiting purposes consistent with applicable law.
                    </span>
                  </label>
                </div>
              )}

              {error ? (
                <p className="mt-4 rounded-[10px] bg-[#B42318]/[0.08] px-4 py-3 font-sans text-[0.875rem] text-[#B42318]">
                  {error}
                </p>
              ) : null}
            </>
          )}
        </div>

        {status !== 'success' ? (
          <footer className="flex items-center justify-between gap-3 border-t border-[#E8DFD6] bg-white px-5 py-4 sm:px-6">
            <button
              type="button"
              onClick={() => {
                setError(null)
                if (step === 0) onClose()
                else setStep((s) => s - 1)
              }}
              disabled={status === 'submitting'}
              className="font-sans text-[0.8125rem] font-semibold text-[#55655D] hover:text-[#14432A] disabled:opacity-50"
            >
              {step === 0 ? 'Cancel' : 'Back'}
            </button>
            {step < STEPS.length - 1 ? (
              <button
                type="button"
                onClick={next}
                className="inline-flex rounded-[10px] bg-[#0F3D2E] px-5 py-2.5 font-sans text-[0.875rem] font-semibold text-[#FAFCFB] transition hover:bg-[#0A2E22]"
              >
                Continue
              </button>
            ) : (
              <button
                type="button"
                onClick={submit}
                disabled={status === 'submitting'}
                className="inline-flex rounded-[10px] bg-[#0F3D2E] px-5 py-2.5 font-sans text-[0.875rem] font-semibold text-[#FAFCFB] transition hover:bg-[#0A2E22] disabled:opacity-60"
              >
                {status === 'submitting' ? 'Submitting…' : 'Submit application'}
              </button>
            )}
          </footer>
        ) : null}
      </motion.div>
    </motion.div>
  )
}

/** @deprecated Use CareersApplicationFlow — kept for any remaining imports. */
export function CareersApplicationForm(props: {
  position?: CareerRole
  onPositionChange?: (position: CareerRole) => void
}) {
  const [open, setOpen] = useState(Boolean(props.position))
  if (!open) return null
  return (
    <CareersApplicationFlow
      initialPosition={props.position ?? 'General Interest'}
      onClose={() => {
        setOpen(false)
        props.onPositionChange?.('General Interest')
      }}
    />
  )
}
