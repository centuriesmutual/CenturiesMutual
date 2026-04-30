'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState, type ChangeEvent, type FormEvent } from 'react'

interface SignupFormData {
  firstName: string
  lastName: string
  email: string
  phoneNumber: string
  password: string
  confirmPassword: string
  agreeToTerms: boolean
}

export default function Signup() {
  const [formData, setFormData] = useState<SignupFormData>({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    password: '',
    confirmPassword: '',
    agreeToTerms: false,
  })
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const target = e.target as HTMLInputElement
    const { name, value, type, checked } = target
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }))
    if (error) setError(null)
  }

  const handleSignup = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match')
      setIsSubmitting(false)
      return
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long')
      setIsSubmitting(false)
      return
    }

    try {
      // Hand off to Auth0 Universal Login with the signup screen hint.
      // Account creation happens on the Auth0 hosted page.
      const params = new URLSearchParams()
      params.set('screen_hint', 'signup')
      params.set('returnTo', 'https://block.centuriesmutual.com')
      if (formData.email) {
        params.set('login_hint', formData.email)
      }
      window.location.href = `/api/auth/login?${params.toString()}`
    } catch {
      setError('An error occurred during signup. Please try again.')
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-light py-3 py-md-5 d-flex flex-column">
      <div className="container flex-grow-1 d-flex align-items-center justify-content-center">
        <div className="row justify-content-center w-100">
          <div className="col-12 col-sm-10 col-md-8 col-lg-6 col-xl-5">
            {/* Back to Home Button */}
            <div className="mb-3">
              <Link href="/" className="btn btn-outline-secondary btn-sm">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  fill="currentColor"
                  className="bi bi-arrow-left me-2"
                  viewBox="0 0 16 16"
                >
                  <path
                    fillRule="evenodd"
                    d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8z"
                  />
                </svg>
                Back to Home
              </Link>
            </div>
            <div className="card border-0 shadow-sm">
              {/* Card Header with Logo */}
              <div className="card-header bg-white border-0 text-center pt-4 pb-2">
                <div className="mb-3 mb-md-4 d-flex justify-content-center">
                  <Image
                    src="/cmlogotreesmall-removebg-preview.png"
                    alt="Centuries Mutual"
                    width={120}
                    height={60}
                    style={{
                      objectFit: 'contain',
                    }}
                  />
                </div>
                <h4
                  className="mb-0"
                  style={{
                    fontFamily: "'Playfair Display', serif",
                    color: '#14432A',
                    fontSize: '1.5rem',
                  }}
                >
                  Create Account
                </h4>
              </div>

              {/* Card Body */}
              <div className="card-body px-3 px-md-4 py-3 py-md-4">
                <form onSubmit={handleSignup}>
                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label htmlFor="firstName" className="form-label small text-muted">
                        First Name
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="firstName"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        placeholder="First name"
                        required
                        style={{
                          borderColor: '#e9ecef',
                          fontSize: '1rem',
                          padding: '0.75rem',
                        }}
                      />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label htmlFor="lastName" className="form-label small text-muted">
                        Last Name
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="lastName"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        placeholder="Last name"
                        required
                        style={{
                          borderColor: '#e9ecef',
                          fontSize: '1rem',
                          padding: '0.75rem',
                        }}
                      />
                    </div>
                  </div>

                  <div className="mb-3">
                    <label htmlFor="email" className="form-label small text-muted">
                      Email Address
                    </label>
                    <input
                      type="email"
                      className="form-control"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="Enter your email"
                      required
                      style={{
                        borderColor: '#e9ecef',
                        fontSize: '1rem',
                        padding: '0.75rem',
                      }}
                    />
                  </div>

                  <div className="mb-3">
                    <label htmlFor="phoneNumber" className="form-label small text-muted">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      className="form-control"
                      id="phoneNumber"
                      name="phoneNumber"
                      value={formData.phoneNumber}
                      onChange={handleInputChange}
                      placeholder="Enter your phone number"
                      required
                      style={{
                        borderColor: '#e9ecef',
                        fontSize: '1rem',
                        padding: '0.75rem',
                      }}
                    />
                  </div>

                  <div className="mb-3">
                    <label htmlFor="password" className="form-label small text-muted">
                      Password
                    </label>
                    <input
                      type="password"
                      className="form-control"
                      id="password"
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      placeholder="Create a password"
                      required
                      style={{
                        borderColor: '#e9ecef',
                        fontSize: '1rem',
                        padding: '0.75rem',
                      }}
                    />
                  </div>

                  <div className="mb-3">
                    <label
                      htmlFor="confirmPassword"
                      className="form-label small text-muted"
                    >
                      Confirm Password
                    </label>
                    <input
                      type="password"
                      className="form-control"
                      id="confirmPassword"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      placeholder="Confirm your password"
                      required
                      style={{
                        borderColor: '#e9ecef',
                        fontSize: '1rem',
                        padding: '0.75rem',
                      }}
                    />
                  </div>

                  <div className="mb-4">
                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        id="agreeToTerms"
                        name="agreeToTerms"
                        checked={formData.agreeToTerms}
                        onChange={handleInputChange}
                        required
                        style={{ borderColor: '#14432A' }}
                      />
                      <label
                        className="form-check-label small text-muted"
                        htmlFor="agreeToTerms"
                      >
                        I agree to the{' '}
                        <Link
                          href="/legal#terms-and-conditions"
                          className="text-decoration-none"
                          style={{ color: '#14432A' }}
                        >
                          Terms and Conditions
                        </Link>{' '}
                        and{' '}
                        <Link
                          href="/legal#privacy-policy"
                          className="text-decoration-none"
                          style={{ color: '#14432A' }}
                        >
                          Privacy Policy
                        </Link>
                      </label>
                    </div>
                  </div>

                  {error && (
                    <div
                      className="alert alert-danger mb-3"
                      role="alert"
                      style={{ fontSize: '0.9rem' }}
                    >
                      {error}
                    </div>
                  )}

                  <button
                    type="submit"
                    className="btn btn-primary w-100 py-3 mb-3"
                    style={{
                      backgroundColor: '#14432A',
                      borderColor: '#14432A',
                      fontSize: '1.1rem',
                    }}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <span
                          className="spinner-border spinner-border-sm me-2"
                          role="status"
                          aria-hidden="true"
                        ></span>
                        Creating Account...
                      </>
                    ) : (
                      'Create Account'
                    )}
                  </button>
                </form>

                <div className="text-center">
                  <p className="text-muted small mb-0">
                    Already have an account?{' '}
                    <Link
                      href="/login"
                      className="text-decoration-none"
                      style={{ color: '#14432A', fontWeight: '500' }}
                    >
                      Sign In
                    </Link>
                  </p>
                </div>
              </div>
            </div>

            {/* Security Notice */}
            <div className="text-center mt-3 mt-md-4">
              <p className="text-muted small mb-0">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  fill="currentColor"
                  className="bi bi-shield-lock me-2"
                  viewBox="0 0 16 16"
                >
                  <path d="M8 1a2 2 0 0 1 2 2v4H6V3a2 2 0 0 1 2-2zm3 6V3a3 3 0 0 0-6 0v4a2 2 0 0 0-2 2v5a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2z" />
                </svg>
                Secure registration with 256-bit encryption
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="py-2 py-md-3 text-center">
        <p className="text-muted small mb-0">
          © 2026 Centuries Mutual. All rights reserved.
        </p>
      </footer>
    </div>
  )
}
