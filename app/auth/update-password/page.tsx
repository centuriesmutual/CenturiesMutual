'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState, type FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import { updatePasswordAction } from '@/lib/supabase/auth-actions'

export default function UpdatePasswordPage() {
  const router = useRouter()
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)
    const result = await updatePasswordAction({ password, confirmPassword })
    setIsSubmitting(false)
    if (result.ok === false) {
      setError(result.error)
      return
    }
    router.replace('/wallet')
    router.refresh()
  }

  return (
    <div className="min-h-screen bg-light py-3 py-md-5 d-flex flex-column">
      <div className="container flex-grow-1 d-flex align-items-center justify-content-center">
        <div className="row justify-content-center w-100">
          <div className="col-12 col-sm-10 col-md-8 col-lg-6 col-xl-5">
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
                  Choose a new password
                </h4>
              </div>
              <div className="card-body px-3 px-md-4 py-3 py-md-4">
                <form onSubmit={onSubmit}>
                  <div className="mb-3">
                    <label htmlFor="password" className="form-label small text-muted">
                      New password
                    </label>
                    <input
                      id="password"
                      type="password"
                      className="form-control"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      minLength={8}
                      autoComplete="new-password"
                      style={{ borderColor: '#e9ecef', fontSize: '1rem', padding: '0.75rem' }}
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="confirmPassword" className="form-label small text-muted">
                      Confirm password
                    </label>
                    <input
                      id="confirmPassword"
                      type="password"
                      className="form-control"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                      minLength={8}
                      autoComplete="new-password"
                      style={{ borderColor: '#e9ecef', fontSize: '1rem', padding: '0.75rem' }}
                    />
                  </div>
                  {error ? (
                    <div className="alert alert-danger mb-3" role="alert" style={{ fontSize: '0.9rem' }}>
                      {error}
                    </div>
                  ) : null}
                  <button
                    type="submit"
                    className="btn btn-primary w-100 py-3"
                    style={{ backgroundColor: '#14432A', borderColor: '#14432A' }}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Saving…' : 'Update password'}
                  </button>
                  <p className="text-center text-muted small mt-3 mb-0">
                    <Link href="/login" style={{ color: '#14432A' }}>
                      Back to login
                    </Link>
                  </p>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
