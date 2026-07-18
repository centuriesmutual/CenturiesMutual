'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { createClient } from '@/lib/supabase/client'

function isStaffUser(user) {
  if (!user) return false
  const role = user.app_metadata?.role
  if (role === 'admin' || role === 'staff_admin') return true
  const email = (user.email || '').trim().toLowerCase()
  return email === 'centuriesmutual@gmail.com'
}

export default function OfficeLogin() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [remember, setRemember] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [checking, setChecking] = useState(true)

  useEffect(() => {
    let active = true
    ;(async () => {
      try {
        const supabase = createClient()
        const {
          data: { user },
        } = await supabase.auth.getUser()
        if (!active) return
        if (isStaffUser(user)) {
          router.replace('/office/office')
          return
        }
      } catch {
        /* stay on login */
      } finally {
        if (active) setChecking(false)
      }
    })()
    return () => {
      active = false
    }
  }, [router])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const supabase = createClient()
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email: email.trim().toLowerCase(),
        password,
      })
      if (signInError || !data.user) {
        setError('Invalid email or password.')
        return
      }
      if (!isStaffUser(data.user)) {
        await supabase.auth.signOut()
        setError('This account is not authorized for Office access.')
        return
      }
      router.replace('/office/office')
      router.refresh()
    } catch {
      setError('Could not sign in. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (checking) {
    return (
      <main className="flex min-h-dvh items-center justify-center bg-[#0F3D2E]">
        <p className="font-sans text-[0.9375rem] text-white/70">Loading…</p>
      </main>
    )
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
                priority
              />
            </div>
            <p className="mb-1 font-sans text-[11px] font-semibold uppercase tracking-[0.22em] text-[#C9A53E]">
              Office
            </p>
            <h1
              className="mb-1 font-medium text-[#14432A]"
              style={{
                fontFamily: "'Playfair Display', Georgia, serif",
                fontSize: '1.6rem',
              }}
            >
              Welcome Back
            </h1>
            <p className="m-0 font-sans text-[0.875rem] text-[#55655D]">
              Sign in to continue to your office
            </p>
          </div>

          {error ? (
            <div className="mb-4 rounded-[10px] border border-[#B42318]/15 bg-[#B42318]/[0.06] px-4 py-3 font-sans text-[0.875rem] text-[#B42318]">
              {error}
            </div>
          ) : null}

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label
                htmlFor="office-email"
                className="mb-1.5 block font-sans text-[0.8125rem] font-semibold text-[#14432A]"
              >
                Email address
              </label>
              <input
                id="office-email"
                type="email"
                name="email"
                required
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="w-full rounded-[10px] border border-[#14432A]/15 bg-white px-3.5 py-2.5 font-sans text-[0.9375rem] text-[#14432A] outline-none transition focus:border-[#0F3D2E] focus:ring-2 focus:ring-[#0F3D2E]/15"
              />
            </div>

            <div className="mb-4">
              <label
                htmlFor="office-password"
                className="mb-1.5 block font-sans text-[0.8125rem] font-semibold text-[#14432A]"
              >
                Password
              </label>
              <input
                id="office-password"
                type="password"
                name="password"
                required
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="w-full rounded-[10px] border border-[#14432A]/15 bg-white px-3.5 py-2.5 font-sans text-[0.9375rem] text-[#14432A] outline-none transition focus:border-[#0F3D2E] focus:ring-2 focus:ring-[#0F3D2E]/15"
              />
            </div>

            <label className="mb-5 flex items-center gap-2 font-sans text-[0.8125rem] text-[#55655D]">
              <input
                type="checkbox"
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
                className="h-4 w-4 accent-[#0F3D2E]"
              />
              Remember me
            </label>

            <button
              type="submit"
              disabled={loading}
              className="inline-flex w-full items-center justify-center rounded-[10px] bg-[#0F3D2E] px-4 py-3 font-sans text-[0.9375rem] font-semibold text-[#FAFCFB] shadow-[0_6px_18px_-8px_rgba(15,61,46,0.5)] transition hover:bg-[#0A2E22] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? 'Signing in…' : 'Sign In'}
            </button>
          </form>
        </div>
        <p className="mt-4 text-center font-sans text-[0.75rem] text-white/50">
          Centuries Mutual · Office access
        </p>
      </div>
    </main>
  )
}
