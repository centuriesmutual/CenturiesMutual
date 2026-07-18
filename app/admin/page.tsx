'use client'

import { useCallback, useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { AdminLogin } from '@/components/admin/admin-login'
import { AdminDashboard } from '@/components/admin/admin-dashboard'

type SessionState = {
  authenticated: boolean
  admin: boolean
  email: string | null
}

export default function AdminPage() {
  const [session, setSession] = useState<SessionState | null>(null)
  const [loading, setLoading] = useState(true)

  const refresh = useCallback(async (): Promise<boolean> => {
    setLoading(true)
    try {
      const res = await fetch('/api/admin/me', { cache: 'no-store' })
      const data = await res.json().catch(() => ({}))
      const next = {
        authenticated: Boolean(data?.authenticated),
        admin: Boolean(data?.admin),
        email: (data?.email as string | null) ?? null,
      }
      // Non-admin sessions should not trap the user on a sign-out screen —
      // clear them so the login form stays available for another attempt.
      if (next.authenticated && !next.admin) {
        try {
          const supabase = createClient()
          await supabase.auth.signOut()
        } catch {
          /* ignore */
        }
        setSession({ authenticated: false, admin: false, email: null })
        return false
      }
      setSession(next)
      return next.admin
    } catch {
      setSession({ authenticated: false, admin: false, email: null })
      return false
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void refresh()
  }, [refresh])

  const signOut = useCallback(async () => {
    try {
      const supabase = createClient()
      await supabase.auth.signOut()
    } finally {
      await refresh()
    }
  }, [refresh])

  if (loading && !session) {
    return (
      <main className="flex min-h-dvh items-center justify-center bg-[#0F3D2E]">
        <p className="font-sans text-[0.9375rem] text-white/70">Loading…</p>
      </main>
    )
  }

  if (!session?.admin) {
    return <AdminLogin onSignedIn={refresh} />
  }

  return <AdminDashboard email={session.email} onSignOut={signOut} />
}
