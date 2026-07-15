'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState, type FormEvent } from 'react'
import { requestPasswordResetAction } from '@/lib/supabase/auth-actions'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [message, setMessage] = useState<string | null>(null)

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)
    setMessage(null)
    const result = await requestPasswordResetAction({ email })
    setIsSubmitting(false)
    if (result.ok === false) {
      setError(result.error)
      return
    }
    setMessage(result.message ?? 'Check your email for a reset link.')
  }

  return (
    <div className="min-h-screen bg-light py-3 py-md-5 d-flex flex-column">
      <div className="container flex-grow-1 d-flex align-items-center justify-content-center">
        <div className="row justify-content-center w-100">
          <div className="col-12 col-sm-10 col-md-8 col-lg-6 col-xl-5">
            <div className="mb-3">
              <Link href="/login" className="btn btn-outline-secondary btn-sm">
                Back to Login
              </Link>
            </div>
            <div className="card border-0 shadow-sm">
              <div className="card-header bg-white border-0 text-center pt-4 pb-2">
                <div className="mb-3 d-flex justify-content-center">
                  <Image
                    src="/cmlogotreesmall-removebg-preview.png"
                    alt="Centuries Mutual"
                    width={120}
                    height={60}
                    style={{ objectFit: 'contain' }}
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
                  Reset Password
                </h4>
              </div>
              <div className="card-body px-3 px-md-4 py-3 py-md-4">
                <form onSubmit={onSubmit}>
                  <div className="mb-3">
                    <label htmlFor="email" className="form-label small text-muted">
                      Email
                    </label>
                    <input
                      id="email"
                      type="email"
                      className="form-control"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      autoComplete="email"
                      style={{ borderColor: '#e9ecef', fontSize: '1rem', padding: '0.75rem' }}
                    />
                  </div>
                  {error ? (
                    <div className="alert alert-danger mb-3" role="alert" style={{ fontSize: '0.9rem' }}>
                      {error}
                    </div>
                  ) : null}
                  {message ? (
                    <div className="alert alert-success mb-3" role="alert" style={{ fontSize: '0.9rem' }}>
                      {message}
                    </div>
                  ) : null}
                  <button
                    type="submit"
                    className="btn btn-primary w-100 py-3"
                    style={{ backgroundColor: '#14432A', borderColor: '#14432A' }}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Sending…' : 'Send reset link'}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
