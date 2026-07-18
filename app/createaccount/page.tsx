'use client'

import Link from 'next/link'
import { useState, type ChangeEvent, type FormEvent } from 'react'
import { motion } from 'framer-motion'
import { SiteHeader } from '@/components/layout/site-header'
import { UnifiedBenefitCard } from '@/components/ui/figma-feature-cards'
import { saveProfile, DEFAULT_PROFILE } from '@/lib/member-profile'
import { signUpAction } from '@/lib/supabase/auth-actions'
import { slideInLeft, slideInRight, sectionAnimation } from '@/utils/home-animations'

interface SignupFormData {
  firstName: string
  lastName: string
  email: string
  phoneNumber: string
  password: string
  confirmPassword: string
  agreeToTerms: boolean
}

const NAME_MAX = 40
const PASSWORD_MIN = 8

const fieldClass =
  'w-full rounded-[10px] border border-[#E8EBEA] bg-[#FAFCFB] px-3.5 py-2.5 font-sans text-[0.9375rem] text-[#14432A] outline-none transition placeholder:text-[#55655D]/60 focus:border-[#14432A]'

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i

function formatPhoneNumber(value: string): string {
  const digits = value.replace(/\D/g, '').slice(0, 10)
  if (digits.length === 0) return ''
  if (digits.length < 4) return `(${digits}`
  if (digits.length < 7) return `(${digits.slice(0, 3)}) ${digits.slice(3)}`
  return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`
}

function sanitizeName(value: string): string {
  return value.replace(/[^a-zA-Z\s'-]/g, '').slice(0, NAME_MAX)
}

export default function CreateAccountPage() {
  const [formData, setFormData] = useState<SignupFormData>({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    password: '',
    confirmPassword: '',
    agreeToTerms: false,
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [successMessage, setSuccessMessage] = useState(
    'We sent a verification link to your inbox. Confirm your email, then sign in to open your Wallet and continue enrollment.',
  )

  const passwordsMatch =
    formData.password.length > 0 &&
    formData.confirmPassword.length > 0 &&
    formData.password === formData.confirmPassword

  const passwordTooShort =
    formData.password.length > 0 && formData.password.length < PASSWORD_MIN

  const passwordsMismatch =
    formData.confirmPassword.length > 0 &&
    formData.password !== formData.confirmPassword

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target

    if (type === 'checkbox') {
      setFormData((prev) => ({ ...prev, [name]: checked }))
    } else if (name === 'phoneNumber') {
      setFormData((prev) => ({ ...prev, phoneNumber: formatPhoneNumber(value) }))
    } else if (name === 'firstName' || name === 'lastName') {
      setFormData((prev) => ({ ...prev, [name]: sanitizeName(value) }))
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }))
    }

    if (error) setError(null)
  }

  const handleSignup = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    const firstName = formData.firstName.trim()
    const lastName = formData.lastName.trim()
    const email = formData.email.trim()
    const phoneDigits = formData.phoneNumber.replace(/\D/g, '')

    if (!firstName || !lastName) {
      setError('Please enter your first and last name.')
      setIsSubmitting(false)
      return
    }

    if (firstName.length > NAME_MAX || lastName.length > NAME_MAX) {
      setError(`Names must be ${NAME_MAX} characters or fewer.`)
      setIsSubmitting(false)
      return
    }

    if (!EMAIL_PATTERN.test(email)) {
      setError('Please enter a valid email address.')
      setIsSubmitting(false)
      return
    }

    if (phoneDigits.length !== 10) {
      setError('Please enter a 10-digit phone number.')
      setIsSubmitting(false)
      return
    }

    if (formData.password.length < PASSWORD_MIN) {
      setError(`Password must be at least ${PASSWORD_MIN} characters.`)
      setIsSubmitting(false)
      return
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match.')
      setIsSubmitting(false)
      return
    }

    if (!formData.agreeToTerms) {
      setError('Please agree to the Terms and Privacy Policy.')
      setIsSubmitting(false)
      return
    }

    try {
      const result = await signUpAction({
        firstName,
        lastName,
        email,
        phone: phoneDigits,
        password: formData.password,
        confirmPassword: formData.confirmPassword,
        agreeToTerms: true as const,
      })

      if (!result || result.ok !== true) {
        const failed = result && result.ok === false ? result : null
        const message =
          failed && typeof failed.error === 'string' && failed.error.trim()
            ? failed.error
            : 'Could not create your account. Please try again.'
        setError(message)
        setIsSubmitting(false)
        return
      }

      saveProfile(DEFAULT_PROFILE)
      if (typeof result.message === 'string' && result.message.trim()) {
        setSuccessMessage(result.message)
      }
      setSuccess(true)
    } catch (err) {
      const message =
        err instanceof Error && err.message
          ? err.message
          : 'An error occurred during signup. Please try again.'
      setError(message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <>
      <SiteHeader />
      <main className="m-0 block overflow-hidden bg-transparent p-0">
        <section className="flex h-[calc(100dvh-69px)] max-h-[calc(100dvh-69px)] items-center overflow-hidden bg-[#FAFCFB]">
          <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
            {success ? (
              <motion.div
                className="mx-auto max-w-lg rounded-2xl bg-[#14432A]/[0.06] px-6 py-10 text-center sm:px-10 sm:py-12"
                {...sectionAnimation}
              >
                <p className="mb-3 font-sans text-[11px] font-semibold uppercase tracking-[0.22em] text-[#C9A53E]">
                  Success
                </p>
                <h1
                  className="mb-3 font-medium leading-[1.2] tracking-[-0.01em] text-[#14432A]"
                  style={{
                    fontFamily: "'Playfair Display', Georgia, serif",
                    fontSize: 'clamp(1.75rem, 3.5vw, 2.35rem)',
                  }}
                >
                  Verify your email
                </h1>
                <p className="mx-auto mb-8 max-w-md font-sans text-[0.9375rem] leading-[1.65] text-[#55655D]">
                  {successMessage}
                </p>
                <Link
                  href="/login"
                  className="inline-flex items-center justify-center rounded-[10px] bg-[#0F3D2E] px-5 py-2 font-sans text-[0.875rem] font-semibold text-[#FAFCFB] no-underline transition hover:bg-[#0A2E22]"
                >
                  Go to Login
                </Link>
              </motion.div>
            ) : (
              <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-12 lg:gap-12">
                <motion.div className="lg:col-span-5" {...slideInLeft}>
                  <p className="mb-3 font-sans text-[11px] font-semibold uppercase tracking-[0.22em] text-[#C9A53E]">
                    Why join
                  </p>
                  <h1
                    className="mb-3 font-medium leading-[1.2] tracking-[-0.01em] text-[#14432A]"
                    style={{
                      fontFamily: "'Playfair Display', Georgia, serif",
                      fontSize: 'clamp(1.6rem, 3.2vw, 2.35rem)',
                    }}
                  >
                    One membership for coverage and rewards
                  </h1>
                  <div className="mt-6">
                    <UnifiedBenefitCard
                      title="Highlights"
                      body={
                        <p className="m-0">
                          Your Centuries Mutual account is the door to Individual
                          &amp; Family, Medicare, Group, and Dental pathways —
                          plus the rewards wallet, documents, Find a Provider, and
                          wellness programs tied to the same identity.
                        </p>
                      }
                      points={[
                        'Single member identity across insurance and rewards',
                        'Documents, ID cards, and plan status in one hub',
                        'Healthcare rewards eligibility where program rules allow',
                        'Care access tools including Find a Provider',
                      ]}
                    />
                  </div>
                </motion.div>

                <motion.div className="lg:col-span-7" {...slideInRight}>
                  <div className="rounded-2xl bg-[#14432A]/[0.06] p-5 sm:p-6 lg:p-8">
                    <p className="mb-2 font-sans text-[10px] font-semibold uppercase tracking-[0.2em] text-[#C9A53E]">
                      Create Account
                    </p>
                    <h2
                      className="mb-5 font-medium leading-snug tracking-[-0.01em] text-[#14432A]"
                      style={{
                        fontFamily: "'Playfair Display', Georgia, serif",
                        fontSize: 'clamp(1.35rem, 2.4vw, 1.65rem)',
                      }}
                    >
                      Join the Community
                    </h2>

                    <form onSubmit={handleSignup} className="space-y-4" noValidate>
                      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div>
                          <label
                            htmlFor="firstName"
                            className="mb-1.5 block font-sans text-[0.75rem] font-medium text-[#55655D]"
                          >
                            First name
                          </label>
                          <input
                            id="firstName"
                            name="firstName"
                            type="text"
                            required
                            maxLength={NAME_MAX}
                            autoComplete="given-name"
                            value={formData.firstName}
                            onChange={handleInputChange}
                            placeholder="First name"
                            className={fieldClass}
                          />
                        </div>
                        <div>
                          <label
                            htmlFor="lastName"
                            className="mb-1.5 block font-sans text-[0.75rem] font-medium text-[#55655D]"
                          >
                            Last name
                          </label>
                          <input
                            id="lastName"
                            name="lastName"
                            type="text"
                            required
                            maxLength={NAME_MAX}
                            autoComplete="family-name"
                            value={formData.lastName}
                            onChange={handleInputChange}
                            placeholder="Last name"
                            className={fieldClass}
                          />
                        </div>
                      </div>

                      <div>
                        <label
                          htmlFor="email"
                          className="mb-1.5 block font-sans text-[0.75rem] font-medium text-[#55655D]"
                        >
                          Email
                        </label>
                        <input
                          id="email"
                          name="email"
                          type="email"
                          required
                          autoComplete="email"
                          inputMode="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          placeholder="name@example.com"
                          className={fieldClass}
                        />
                      </div>

                      <div>
                        <label
                          htmlFor="phoneNumber"
                          className="mb-1.5 block font-sans text-[0.75rem] font-medium text-[#55655D]"
                        >
                          Phone
                        </label>
                        <input
                          id="phoneNumber"
                          name="phoneNumber"
                          type="tel"
                          required
                          autoComplete="tel"
                          inputMode="numeric"
                          value={formData.phoneNumber}
                          onChange={handleInputChange}
                          placeholder="(555) 555-5555"
                          className={fieldClass}
                        />
                      </div>

                      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div>
                          <label
                            htmlFor="password"
                            className="mb-1.5 block font-sans text-[0.75rem] font-medium text-[#55655D]"
                          >
                            Password
                          </label>
                          <input
                            id="password"
                            name="password"
                            type="password"
                            required
                            minLength={PASSWORD_MIN}
                            autoComplete="new-password"
                            value={formData.password}
                            onChange={handleInputChange}
                            placeholder="At least 6 characters"
                            className={fieldClass}
                          />
                          {passwordTooShort ? (
                            <p className="mt-1.5 mb-0 font-sans text-[0.75rem] text-[#9A3412]">
                              Use at least {PASSWORD_MIN} characters.
                            </p>
                          ) : null}
                        </div>
                        <div>
                          <label
                            htmlFor="confirmPassword"
                            className="mb-1.5 block font-sans text-[0.75rem] font-medium text-[#55655D]"
                          >
                            Confirm password
                          </label>
                          <input
                            id="confirmPassword"
                            name="confirmPassword"
                            type="password"
                            required
                            minLength={PASSWORD_MIN}
                            autoComplete="new-password"
                            value={formData.confirmPassword}
                            onChange={handleInputChange}
                            placeholder="Confirm password"
                            className={fieldClass}
                          />
                          {formData.confirmPassword.length > 0 ? (
                            <p
                              className={`mt-1.5 mb-0 font-sans text-[0.75rem] ${
                                passwordsMatch ? 'text-[#14432A]' : 'text-[#9A3412]'
                              }`}
                            >
                              {passwordsMatch
                                ? 'Passwords match'
                                : passwordsMismatch
                                  ? 'Passwords do not match'
                                  : null}
                            </p>
                          ) : null}
                        </div>
                      </div>

                      <label className="flex items-start gap-2.5 font-sans text-[0.8125rem] leading-[1.5] text-[#55655D]">
                        <input
                          type="checkbox"
                          id="agreeToTerms"
                          name="agreeToTerms"
                          checked={formData.agreeToTerms}
                          onChange={handleInputChange}
                          required
                          className="mt-1 h-4 w-4 rounded border-[#E8EBEA] text-[#14432A] focus:ring-[#14432A]"
                        />
                        <span>
                          I agree to the{' '}
                          <Link href="/legal" className="font-semibold text-[#14432A]">
                            Terms and Privacy Policy
                          </Link>
                          .
                        </span>
                      </label>

                      {error ? (
                        <p className="m-0 font-sans text-[0.875rem] text-red-700">
                          {typeof error === 'string' ? error : 'Could not create your account. Please try again.'}
                        </p>
                      ) : null}

                      <button
                        type="submit"
                        disabled={isSubmitting || passwordsMismatch || passwordTooShort}
                        className="inline-flex w-full items-center justify-center rounded-[10px] bg-[#0F3D2E] px-4 py-2 font-sans text-[0.875rem] font-semibold text-[#FAFCFB] transition hover:bg-[#0A2E22] disabled:cursor-not-allowed disabled:opacity-70 sm:w-auto sm:min-w-[200px]"
                      >
                        {isSubmitting ? 'Creating…' : 'Create Account'}
                      </button>

                      <p className="m-0 font-sans text-[0.8125rem] text-[#55655D]">
                        Already a member?{' '}
                        <Link href="/login" className="font-semibold text-[#14432A]">
                          Log in
                        </Link>
                      </p>
                    </form>
                  </div>
                </motion.div>
              </div>
            )}
          </div>
        </section>
      </main>
    </>
  )
}
