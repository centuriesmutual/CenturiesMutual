'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { sectionAnimation } from '@/utils/home-animations'

export const CAREER_ROLES = [
  'General Interest',
  'Licensed Insurance Agent',
  'Member Services Specialist',
  'Enrollment Coordinator',
  'Community Outreach Associate',
  'Software Engineer',
  'Compliance Analyst',
] as const

type FormState = {
  first_name: string
  last_name: string
  email: string
  phone: string
  position: string
  location: string
  work_authorization: string
  linkedin_url: string
  portfolio_url: string
  cover_letter: string
}

const EMPTY: FormState = {
  first_name: '',
  last_name: '',
  email: '',
  phone: '',
  position: CAREER_ROLES[0],
  location: '',
  work_authorization: '',
  linkedin_url: '',
  portfolio_url: '',
  cover_letter: '',
}

const inputClass =
  'w-full rounded-[10px] border border-[#14432A]/15 bg-[#FAFCFB] px-3.5 py-2.5 font-sans text-[0.9375rem] text-[#14432A] outline-none transition focus:border-[#0F3D2E] focus:ring-2 focus:ring-[#0F3D2E]/15'
const labelClass =
  'mb-1.5 block font-sans text-[0.8125rem] font-semibold text-[#14432A]'

export function CareersApplicationForm() {
  const [form, setForm] = useState<FormState>(EMPTY)
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle')
  const [error, setError] = useState<string | null>(null)

  const update =
    (key: keyof FormState) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
      setForm((f) => ({ ...f, [key]: e.target.value }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('submitting')
    setError(null)

    try {
      const res = await fetch('/api/careers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok || !data?.ok) {
        setError(data?.error || 'Could not submit your application. Please try again.')
        setStatus('error')
        return
      }
      setStatus('success')
      setForm(EMPTY)
    } catch {
      setError('Network error. Please try again.')
      setStatus('error')
    }
  }

  return (
    <section id="apply" className="relative overflow-hidden border-t border-[#E8EBEA] bg-[#F4F1EC] py-14 sm:py-20">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_80%_0%,rgba(201,169,97,0.14)_0%,transparent_55%)]"
      />
      <div className="relative mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <motion.div className="mb-8 text-center" {...sectionAnimation}>
          <p className="mb-3 font-sans text-[11px] font-semibold uppercase tracking-[0.22em] text-[#C9A53E]">
            — Apply
          </p>
          <h2
            className="mb-3 font-medium leading-[1.2] tracking-[-0.01em] text-[#14432A]"
            style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 'clamp(1.6rem, 3.2vw, 2.35rem)' }}
          >
            Tell us where you fit
          </h2>
          <p className="mx-auto max-w-[560px] font-sans text-[0.9375rem] leading-[1.65] text-[#55655D]">
            Share a little about yourself and the work you want to do. Every submission
            is reviewed by our team — we reach out when there is a fit.
          </p>
        </motion.div>

        {status === 'success' ? (
          <div className="rounded-2xl border border-[#14432A]/10 bg-white p-8 text-center shadow-sm">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[#0F3D2E]/[0.08] text-[#0F3D2E]">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden>
                <path d="M20 6 9 17l-5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <h3 className="mb-2 font-sans text-[1.125rem] font-semibold text-[#14432A]">
              Application received
            </h3>
            <p className="mb-5 font-sans text-[0.9375rem] text-[#55655D]">
              Thank you for your interest in Centuries Mutual. We&apos;ll be in touch if
              your background matches an open role.
            </p>
            <button
              type="button"
              onClick={() => setStatus('idle')}
              className="inline-flex items-center justify-center rounded-[10px] border border-[#0F3D2E] bg-transparent px-4 py-2.5 font-sans text-[0.875rem] font-semibold text-[#0F3D2E] transition hover:bg-[#0F3D2E]/[0.06]"
            >
              Submit another application
            </button>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="rounded-2xl border border-[#14432A]/10 bg-white p-6 shadow-sm sm:p-8"
          >
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className={labelClass} htmlFor="first_name">First name</label>
                <input id="first_name" className={inputClass} value={form.first_name} onChange={update('first_name')} required maxLength={60} />
              </div>
              <div>
                <label className={labelClass} htmlFor="last_name">Last name</label>
                <input id="last_name" className={inputClass} value={form.last_name} onChange={update('last_name')} required maxLength={60} />
              </div>
              <div>
                <label className={labelClass} htmlFor="email">Email</label>
                <input id="email" type="email" className={inputClass} value={form.email} onChange={update('email')} required />
              </div>
              <div>
                <label className={labelClass} htmlFor="phone">Phone <span className="font-normal text-[#55655D]">(optional)</span></label>
                <input id="phone" className={inputClass} value={form.phone} onChange={update('phone')} inputMode="tel" />
              </div>
              <div>
                <label className={labelClass} htmlFor="position">Role of interest</label>
                <select id="position" className={inputClass} value={form.position} onChange={update('position')} required>
                  {CAREER_ROLES.map((role) => (
                    <option key={role} value={role}>{role}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className={labelClass} htmlFor="location">Location <span className="font-normal text-[#55655D]">(optional)</span></label>
                <input id="location" className={inputClass} value={form.location} onChange={update('location')} placeholder="City, State" />
              </div>
              <div>
                <label className={labelClass} htmlFor="work_authorization">Work authorization <span className="font-normal text-[#55655D]">(optional)</span></label>
                <input id="work_authorization" className={inputClass} value={form.work_authorization} onChange={update('work_authorization')} placeholder="e.g. US Citizen" />
              </div>
              <div>
                <label className={labelClass} htmlFor="linkedin_url">LinkedIn <span className="font-normal text-[#55655D]">(optional)</span></label>
                <input id="linkedin_url" type="url" className={inputClass} value={form.linkedin_url} onChange={update('linkedin_url')} placeholder="https://" />
              </div>
              <div className="sm:col-span-2">
                <label className={labelClass} htmlFor="portfolio_url">Portfolio or resume link <span className="font-normal text-[#55655D]">(optional)</span></label>
                <input id="portfolio_url" type="url" className={inputClass} value={form.portfolio_url} onChange={update('portfolio_url')} placeholder="https://" />
              </div>
              <div className="sm:col-span-2">
                <label className={labelClass} htmlFor="cover_letter">Why Centuries Mutual? <span className="font-normal text-[#55655D]">(optional)</span></label>
                <textarea id="cover_letter" className={`${inputClass} min-h-[130px] resize-y`} value={form.cover_letter} onChange={update('cover_letter')} maxLength={5000} />
              </div>
            </div>

            {status === 'error' && error ? (
              <p className="mt-4 rounded-[10px] bg-[#B42318]/[0.08] px-4 py-3 font-sans text-[0.875rem] text-[#B42318]">
                {error}
              </p>
            ) : null}

            <button
              type="submit"
              disabled={status === 'submitting'}
              className="mt-6 inline-flex w-full items-center justify-center rounded-[10px] bg-[#0F3D2E] px-4 py-3 font-sans text-[0.9375rem] font-semibold text-[#FAFCFB] shadow-[0_6px_18px_-8px_rgba(15,61,46,0.5)] transition hover:bg-[#0A2E22] disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
            >
              {status === 'submitting' ? 'Submitting…' : 'Submit application'}
            </button>
          </form>
        )}
      </div>
    </section>
  )
}
