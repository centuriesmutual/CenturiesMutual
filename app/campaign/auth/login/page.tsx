'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'

export default function LoginPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({ email: '', password: '' })
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.email.trim() || !formData.password) {
      setError('Please enter both email and password')
      return
    }
    router.push('/dashboard')
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
              Marketing
            </p>
            <h1
              className="mb-1 font-medium text-[#14432A]"
              style={{
                fontFamily: "'Playfair Display', Georgia, serif",
                fontSize: '1.85rem',
              }}
            >
              Campaign
            </h1>
            <p className="m-0 font-sans text-[0.875rem] text-[#55655D]">
              Your all-in-one marketing platform
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
                htmlFor="campaign-login-email"
                className="mb-1.5 block font-sans text-[0.8125rem] font-semibold text-[#14432A]"
              >
                Email address
              </label>
              <input
                id="campaign-login-email"
                type="email"
                name="email"
                required
                autoComplete="email"
                value={formData.email}
                onChange={(e) => {
                  setFormData({ ...formData, email: e.target.value })
                  if (error) setError('')
                }}
                placeholder="Enter your email"
                className="w-full rounded-[10px] border border-[#14432A]/15 bg-white px-3.5 py-2.5 font-sans text-[0.9375rem] text-[#14432A] outline-none transition focus:border-[#0F3D2E] focus:ring-2 focus:ring-[#0F3D2E]/15"
              />
            </div>

            <div className="mb-5">
              <label
                htmlFor="campaign-login-password"
                className="mb-1.5 block font-sans text-[0.8125rem] font-semibold text-[#14432A]"
              >
                Password
              </label>
              <input
                id="campaign-login-password"
                type="password"
                name="password"
                required
                autoComplete="current-password"
                value={formData.password}
                onChange={(e) => {
                  setFormData({ ...formData, password: e.target.value })
                  if (error) setError('')
                }}
                placeholder="Enter your password"
                className="w-full rounded-[10px] border border-[#14432A]/15 bg-white px-3.5 py-2.5 font-sans text-[0.9375rem] text-[#14432A] outline-none transition focus:border-[#0F3D2E] focus:ring-2 focus:ring-[#0F3D2E]/15"
              />
            </div>

            <div className="mb-5 flex items-center justify-between gap-3">
              <label className="flex items-center gap-2 font-sans text-[0.875rem] text-[#55655D]">
                <input
                  type="checkbox"
                  className="h-4 w-4 rounded accent-[#0F3D2E]"
                />
                Remember me
              </label>
              <a
                href="#"
                className="font-sans text-[0.8125rem] font-semibold text-[#C9A53E] hover:underline"
              >
                Forgot password?
              </a>
            </div>

            <button
              type="submit"
              className="inline-flex w-full items-center justify-center rounded-[10px] bg-[#0F3D2E] px-4 py-2.5 font-sans text-[0.9375rem] font-semibold text-[#FAFCFB] transition hover:bg-[#0A2E22]"
            >
              Sign in
            </button>

            <p className="mt-5 text-center font-sans text-[0.875rem] text-[#55655D]">
              Don&apos;t have an account?{' '}
              <a href="#" className="font-semibold text-[#C9A53E] hover:underline">
                Sign up
              </a>
            </p>
          </form>
        </div>
      </div>
    </main>
  )
}
