import type { EnrolledPlan } from '@/components/dashboard/enrollment-flow'

export type MemberSession = {
  username: string
  loggedInAt: string
  /** Last user activity — idle timeout is measured from this. */
  lastActiveAt: string
  /** One-time grant required to open Wallet after login/signup. */
  accessGrant: string
}

export type MemberProfile = {
  plan: EnrolledPlan | null
  wgTokens: number
  wgLastClaim: string | null
  mbkConnected: boolean
  mbkStreak: number
}

export const SESSION_KEY = 'cm_member_session'
export const PROFILE_KEY = 'cm_member_profile'
export const ADMIN_PROFILES_KEY = 'cm_admin_enrollments'
/** Present only after login / createaccount; required to open Wallet. */
export const WALLET_ENTRY_KEY = 'cm_wallet_entry'
/** Set after a successful Wallet boot — allows refresh while staying in Wallet. */
export const WALLET_ACTIVE_KEY = 'cm_wallet_active'
/** Skip session teardown while OAuth / payout redirects are in flight. */
export const OAUTH_HOLD_KEY = 'cm_oauth_hold'
/** Suppress leave-warning while an intentional logout is in progress. */
export const SESSION_ENDING_KEY = 'cm_wallet_ending'

/** Idle session lifetime (finance-style). */
export const SESSION_IDLE_MS = 15 * 60 * 1000

export const DEFAULT_PROFILE: MemberProfile = {
  plan: null,
  wgTokens: 0,
  wgLastClaim: null,
  mbkConnected: false,
  mbkStreak: 0,
}

function newAccessGrant() {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID()
  }
  return `cm_${Date.now()}_${Math.random().toString(36).slice(2)}`
}

export function loadSession(): MemberSession | null {
  if (typeof window === 'undefined') return null
  try {
    const raw = window.sessionStorage.getItem(SESSION_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw) as Partial<MemberSession>
    if (!parsed.username || !parsed.loggedInAt) return null
    return {
      username: parsed.username,
      loggedInAt: parsed.loggedInAt,
      lastActiveAt: parsed.lastActiveAt ?? parsed.loggedInAt,
      accessGrant: parsed.accessGrant ?? '',
    }
  } catch {
    return null
  }
}

export function saveSession(session: MemberSession) {
  window.sessionStorage.setItem(SESSION_KEY, JSON.stringify(session))
}

/**
 * Bind a Wallet UX session after a verified Supabase sign-in.
 * Call only with the authenticated member email — never invent placeholders.
 */
export function establishSession(email: string): MemberSession {
  const username = email.trim().toLowerCase()
  if (!username || !username.includes('@')) {
    throw new Error('Authenticated email is required to open Wallet.')
  }
  const now = new Date().toISOString()
  const session: MemberSession = {
    username,
    loggedInAt: now,
    lastActiveAt: now,
    accessGrant: newAccessGrant(),
  }
  saveSession(session)
  window.sessionStorage.setItem(WALLET_ENTRY_KEY, session.accessGrant)
  window.sessionStorage.removeItem(OAUTH_HOLD_KEY)
  window.sessionStorage.removeItem(SESSION_ENDING_KEY)
  return session
}

export function clearSession() {
  if (typeof window === 'undefined') return
  window.sessionStorage.removeItem(SESSION_KEY)
  window.sessionStorage.removeItem(WALLET_ENTRY_KEY)
  window.sessionStorage.removeItem(WALLET_ACTIVE_KEY)
  window.sessionStorage.removeItem(OAUTH_HOLD_KEY)
}

export function markSessionEnding() {
  if (typeof window === 'undefined') return
  window.sessionStorage.setItem(SESSION_ENDING_KEY, '1')
}

export function isSessionEnding() {
  if (typeof window === 'undefined') return false
  return window.sessionStorage.getItem(SESSION_ENDING_KEY) === '1'
}

export function touchSession(): MemberSession | null {
  const session = loadSession()
  if (!session) return null
  const next = { ...session, lastActiveAt: new Date().toISOString() }
  saveSession(next)
  return next
}

export function isSessionExpired(session: MemberSession | null = loadSession()): boolean {
  if (!session) return true
  const last = Date.parse(session.lastActiveAt || session.loggedInAt)
  if (Number.isNaN(last)) return true
  return Date.now() - last > SESSION_IDLE_MS
}

/**
 * Validate Wallet access. Requires a live session within the idle window and
 * either a fresh login entry grant or an already-active Wallet binding.
 * Typing /wallet without logging in fails.
 */
export function validateWalletAccess():
  | { ok: true; session: MemberSession }
  | { ok: false; reason: 'missing' | 'expired' | 'no_entry' } {
  const session = loadSession()
  if (!session) return { ok: false, reason: 'missing' }
  if (isSessionExpired(session)) {
    clearSession()
    return { ok: false, reason: 'expired' }
  }

  const active = window.sessionStorage.getItem(WALLET_ACTIVE_KEY)
  const entry = window.sessionStorage.getItem(WALLET_ENTRY_KEY)

  if (active === session.accessGrant) {
    touchSession()
    return { ok: true, session: loadSession()! }
  }

  if (entry === session.accessGrant && session.accessGrant) {
    window.sessionStorage.setItem(WALLET_ACTIVE_KEY, session.accessGrant)
    touchSession()
    return { ok: true, session: loadSession()! }
  }

  clearSession()
  return { ok: false, reason: 'no_entry' }
}

export function endWalletSession() {
  clearSession()
}

export function markOauthHold() {
  if (typeof window === 'undefined') return
  window.sessionStorage.setItem(OAUTH_HOLD_KEY, '1')
}

export function clearOauthHold() {
  if (typeof window === 'undefined') return
  window.sessionStorage.removeItem(OAUTH_HOLD_KEY)
}

export function hasOauthHold() {
  if (typeof window === 'undefined') return false
  return window.sessionStorage.getItem(OAUTH_HOLD_KEY) === '1'
}

/** Public marketing pages should never appear logged in. */
export function ensurePublicSiteLoggedOut() {
  if (typeof window === 'undefined') return
  clearSession()
}

export function loadProfile(): MemberProfile {
  if (typeof window === 'undefined') return DEFAULT_PROFILE
  try {
    const raw = window.localStorage.getItem(PROFILE_KEY)
    if (!raw) return DEFAULT_PROFILE
    const parsed = JSON.parse(raw) as MemberProfile
    const merged = { ...DEFAULT_PROFILE, ...parsed }
    if (merged.plan?.planId) {
      const admin = loadAdminStatus(merged.plan.planId)
      if (admin) merged.plan = { ...merged.plan, status: admin }
    }
    return merged
  } catch {
    return DEFAULT_PROFILE
  }
}

export function saveProfile(profile: MemberProfile) {
  window.localStorage.setItem(PROFILE_KEY, JSON.stringify(profile))
  if (profile.plan?.planId) {
    syncAdminEnrollment(profile.plan)
  }
}

function syncAdminEnrollment(plan: EnrolledPlan) {
  const map = loadAdminMap()
  map[plan.planId] = {
    planId: plan.planId,
    name: plan.name,
    pathway: plan.pathway,
    status: plan.status,
    effectiveDate: plan.effectiveDate,
    submittedAt: plan.submittedAt,
    member: loadSession()?.username ?? 'unknown',
  }
  window.localStorage.setItem(ADMIN_PROFILES_KEY, JSON.stringify(map))
}

export type AdminEnrollmentRecord = {
  planId: string
  name: string
  pathway: string
  status: EnrolledPlan['status']
  effectiveDate: string
  submittedAt: string
  member: string
}

export function loadAdminMap(): Record<string, AdminEnrollmentRecord> {
  if (typeof window === 'undefined') return {}
  try {
    const raw = window.localStorage.getItem(ADMIN_PROFILES_KEY)
    return raw ? (JSON.parse(raw) as Record<string, AdminEnrollmentRecord>) : {}
  } catch {
    return {}
  }
}

export function loadAdminStatus(planId: string): EnrolledPlan['status'] | null {
  return loadAdminMap()[planId]?.status ?? null
}

export function setAdminEnrollmentStatus(
  planId: string,
  status: EnrolledPlan['status'],
): boolean {
  const map = loadAdminMap()
  if (!map[planId]) return false
  map[planId] = { ...map[planId], status }
  window.localStorage.setItem(ADMIN_PROFILES_KEY, JSON.stringify(map))
  const profile = loadProfile()
  if (profile.plan?.planId === planId) {
    saveProfile({ ...profile, plan: { ...profile.plan, status } })
  }
  return true
}

export function todayKey() {
  return new Date().toISOString().slice(0, 10)
}
