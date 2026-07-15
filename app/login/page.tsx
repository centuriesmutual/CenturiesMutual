'use client'

import { Suspense } from 'react'
import LoginClient from './login-client'

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-light">
          <p className="font-sans text-sm text-[#55655D]">Loading…</p>
        </div>
      }
    >
      <LoginClient />
    </Suspense>
  )
}
