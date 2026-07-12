import type { EnrolledPlan } from '@/components/dashboard/enrollment-flow'

export type MemberSession = {
  username: string
  loggedInAt: string
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

export const DEFAULT_PROFILE: MemberProfile = {
  plan: null,
  wgTokens: 0,
  wgLastClaim: null,
  mbkConnected: false,
  mbkStreak: 0,
}

export function loadSession(): MemberSession | null {
  if (typeof window === 'undefined') return null
  try {
    const raw = window.sessionStorage.getItem(SESSION_KEY)
    return raw ? (JSON.parse(raw) as MemberSession) : null
  } catch {
    return null
  }
}

export function saveSession(session: MemberSession) {
  window.sessionStorage.setItem(SESSION_KEY, JSON.stringify(session))
}

export function clearSession() {
  window.sessionStorage.removeItem(SESSION_KEY)
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
