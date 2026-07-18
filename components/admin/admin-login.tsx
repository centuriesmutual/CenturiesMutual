'use client'

import { useState } from 'react'
import Image from 'next/image'
import { createClient } from '@/lib/supabase/client'

type Props = {
  /** True when a user is signed in but not on the admin allowlist. */
  notAuthorized?: boolean
  email?: string | null
  onSignedIn: () => void | Promise<void>
  onSignOut: () => void | Promise<void>
}

export function AdminLogin({ notAuthorized, email, onSignedIn, onSignOut }: Props) {
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      const supabase = createClient()
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email: form.email.trim().toLowerCase(),
        password: form.password,
      })
      if (signInError || !data.user) {
        setError(
          signInError?.message?.toLowerCase().includes('email not confirmed')
            ? 'This account email is not confirmed yet.'
            : 'Invalid email or password.',
        )
        setLoading(false)
        return
      }
      await onSignedIn()
    } catch {
      setError('Something went wrong. Please try again.')
      setLoading(false)
    }
  }

  return (
    <main className="relative flex min-h-dvh items-center justify-center overflow-hidden bg-[#0F3D2E] px-4 py-12">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_-10%,rgba(201,169,97,0.25)_0%,transparent_55%)]"
      />
      <div className="relative w-full max-w-[440px]">
        <div className="rounded-2xl border border-white/10 bg-[#FAFCFB] p-8 shadow-[0_24px_60px_-24px_rgba(0,0,0,0.6)] sm:p-10">
          <div className="mb-6 text-center">
            <div className="mx-auto mb-3 flex h-16 w-16 items-center justify-center">
              <Image
                src="/cmlogotreesmall-removebg-preview.png"
                alt="Centuries Mutual"
                width={64}
                height={64}
                style={{ objectFit: 'contain' }}
              />
            </div>
            <p className="mb-1 font-sans text-[11px] font-semibold uppercase tracking-[0.22em] text-[#C9A53E]">
              Administration
            </p>
            <h1
              className="mb-1 font-medium text-[#14432A]"
              style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: '1.6rem' }}
            >
              Welcome Back
            </h1>
            <p className="m-0 font-sans text-[0.875rem] text-[#55655D]">
              Please sign in to the admin portal
            </p>
          </div>

          {notAuthorized ? (
            <div className="rounded-2xl border border-[#B42318]/15 bg-[#B42318]/[0.06] p-5 text-center">
              <p className="mb-1 font-sans text-[0.9375rem] font-semibold text-[#B42318]">
                Not authorized
              </p>
              <p className="mb-4 font-sans text-[0.875rem] text-[#55655D]">
                {email ? <span className="font-medium">{email}</span> : 'This account'} is
                not on the admin allowlist. Sign in with an authorized account.
              </p>
              <button
                type="button"
                onClick={() => void onSignOut()}
                className="inline-flex items-center justify-center rounded-[10px] bg-[#0F3D2E] px-4 py-2.5 font-sans text-[0.875rem] font-semibold text-[#FAFCFB] transition hover:bg-[#0A2E22]"
              >
                Sign out
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label
                  htmlFor="admin-email"
                  className="mb-1.5 block font-sans text-[0.8125rem] font-semibold text-[#14432A]"
                >
                  Email address
                </label>
                <input
                  id="admin-email"
                  type="email"
                  required
                  value={form.email}
                  onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                  placeholder="Enter your email"
                  className="w-full rounded-[10px] border border-[#14432A]/15 bg-white px-3.5 py-2.5 font-sans text-[0.9375rem] text-[#14432A] outline-none transition focus:border-[#0F3D2E] focus:ring-2 focus:ring-[#0F3D2E]/15"
                />
              </div>
              <div className="mb-5">
                <label
                  htmlFor="admin-password"
                  className="mb-1.5 block font-sans text-[0.8125rem] font-semibold text-[#14432A]"
                >
                  Password
                </label>
                <input
                  id="admin-password"
                  type="password"
                  required
                  value={form.password}
                  onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
                  placeholder="Enter your password"
                  className="w-full rounded-[10px] border border-[#14432A]/15 bg-white px-3.5 py-2.5 font-sans text-[0.9375rem] text-[#14432A] outline-none transition focus:border-[#0F3D2E] focus:ring-2 focus:ring-[#0F3D2E]/15"
                />
              </div>

              {error ? (
                <p className="mb-4 rounded-[10px] bg-[#B42318]/[0.08] px-4 py-3 font-sans text-[0.875rem] text-[#B42318]">
                  {error}
                </p>
              ) : null}

              <button
                type="submit"
                disabled={loading}
                className="inline-flex w-full items-center justify-center rounded-[10px] bg-[#0F3D2E] px-4 py-3 font-sans text-[0.9375rem] font-semibold text-[#FAFCFB] shadow-[0_6px_18px_-8px_rgba(15,61,46,0.5)] transition hover:bg-[#0A2E22] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? 'Signing in…' : 'Sign In'}
              </button>
            </form>
          )}
        </div>
        <p className="mt-4 text-center font-sans text-[0.75rem] text-white/50">
          Centuries Mutual · Secure admin access
        </p>
      </div>
    </main>
  )
}
