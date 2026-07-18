import { NextResponse } from 'next/server'
import type { User } from '@supabase/supabase-js'
import { createClient } from '@/lib/supabase/server'

/**
 * Admin authorization for the Centuries Mutual admin portal.
 *
 * Admins are identified by an email allowlist in the `ADMIN_EMAILS` env var
 * (comma-separated). This fails closed: if the list is empty or the signed-in
 * user's email is not on it, admin access is denied. Privileged data reads run
 * with the service-role key only after this check passes.
 */
export function adminEmails(): string[] {
  return (process.env.ADMIN_EMAILS ?? '')
    .split(',')
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean)
}

export function isAdminEmail(email?: string | null): boolean {
  if (!email) return false
  return adminEmails().includes(email.trim().toLowerCase())
}

/** True when the user is allowlisted or has staff admin metadata in Supabase Auth. */
export function isAdminUser(user?: Pick<User, 'email' | 'app_metadata'> | null): boolean {
  if (!user) return false
  if (isAdminEmail(user.email)) return true
  const role = user.app_metadata?.role
  return role === 'admin' || role === 'staff_admin'
}

export type AdminSession =
  | { authenticated: boolean; admin: boolean; email: string | null }

/** Non-throwing check used by the admin UI to choose login vs. dashboard. */
export async function getAdminSession(): Promise<AdminSession> {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { authenticated: false, admin: false, email: null }
  }
  return {
    authenticated: true,
    admin: isAdminUser(user),
    email: user.email ?? null,
  }
}

/** Guard for privileged admin API routes. */
export async function requireAdmin(): Promise<
  { user: User; error?: undefined } | { user?: undefined; error: NextResponse }
> {
  const supabase = createClient()
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  if (error || !user) {
    return {
      error: NextResponse.json(
        { ok: false, error: 'Unauthorized' },
        { status: 401 },
      ),
    }
  }

  if (!isAdminUser(user)) {
    return {
      error: NextResponse.json(
        { ok: false, error: 'Forbidden — admin access required.' },
        { status: 403 },
      ),
    }
  }

  return { user }
}
