import jwt from 'jsonwebtoken'
import { createClient } from '@supabase/supabase-js'
import { getSupabaseAnonKey, getSupabaseUrl } from '@/lib/supabase/env'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production'

export interface User {
  id: string
  email: string
  name: string
  role: 'admin' | 'editor' | 'viewer'
}

export function generateToken(user: User): string {
  return jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    JWT_SECRET,
    { expiresIn: '7d' },
  )
}

export function verifyToken(token: string): User | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as {
      id: string
      email: string
      role: User['role']
    }
    return {
      id: decoded.id,
      email: decoded.email,
      name: decoded.email.split('@')[0] || 'Editor',
      role: decoded.role || 'editor',
    }
  } catch {
    return null
  }
}

/**
 * Authenticate editor staff against Supabase Auth (same account as admin/office/campaign).
 */
export async function authenticateUser(
  email: string,
  password: string,
): Promise<User | null> {
  const normalized = email.trim().toLowerCase()
  try {
    const supabase = createClient(getSupabaseUrl(), getSupabaseAnonKey(), {
      auth: { autoRefreshToken: false, persistSession: false },
    })
    const { data, error } = await supabase.auth.signInWithPassword({
      email: normalized,
      password,
    })
    if (error || !data.user) return null

    // Optional allowlist — defaults to ADMIN_EMAILS when set.
    // Staff with app_metadata.role admin/staff_admin are always allowed.
    const metaRole = data.user.app_metadata?.role
    const isStaffMeta = metaRole === 'admin' || metaRole === 'staff_admin'
    const allow = (process.env.ADMIN_EMAILS ?? '')
      .split(',')
      .map((e) => e.trim().toLowerCase())
      .filter(Boolean)
    if (!isStaffMeta && allow.length > 0 && !allow.includes(normalized)) {
      await supabase.auth.signOut()
      return null
    }

    return {
      id: data.user.id,
      email: data.user.email ?? normalized,
      name: data.user.email?.split('@')[0] || 'Editor',
      role: 'admin',
    }
  } catch {
    return null
  }
}

export function getUserById(id: string): User | undefined {
  return undefined
}
