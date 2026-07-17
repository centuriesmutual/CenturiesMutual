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

  const refresh = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/admin/me', { cache: 'no-store' })
      const data = await res.json().catch(() => ({}))
      setSession({
        authenticated: Boolean(data?.authenticated),
        admin: Boolean(data?.admin),
        email: data?.email ?? null,
      })
    } catch {
      setSession({ authenticated: false, admin: false, email: null })
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

  if (!session?.authenticated || !session.admin) {
    return (
      <AdminLogin
        notAuthorized={Boolean(session?.authenticated) && !session?.admin}
        email={session?.email ?? null}
        onSignedIn={refresh}
        onSignOut={signOut}
      />
    )
  }

  return <AdminDashboard email={session.email} onSignOut={signOut} />
}
