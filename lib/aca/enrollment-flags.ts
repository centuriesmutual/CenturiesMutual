import { createServiceClient } from '@/lib/supabase/admin'

export type AcaEnrollmentFlag = {
  id: string
  key: string
  name: string
  description: string
  enabled: boolean
  start_date: string | null
  end_date: string | null
  created_at: string
  updated_at: string
}

export const ACA_FLAG_KEYS = {
  OEP: 'ACA_OEP_ENABLED',
  SEP: 'ACA_SEP_ENABLED',
} as const

function todayIsoDate(now = new Date()): string {
  // Evaluate in America/Chicago (Centuries Mutual HQ) for marketplace windows.
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: 'America/Chicago',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(now)
}

function isDateInInclusiveRange(
  today: string,
  start: string | null | undefined,
  end: string | null | undefined,
): boolean {
  if (!start || !end) return false
  return today >= start && today <= end
}

export function evaluateOepActive(flag: Pick<AcaEnrollmentFlag, 'enabled' | 'start_date' | 'end_date'>, now = new Date()) {
  if (!flag.enabled) return false
  return isDateInInclusiveRange(todayIsoDate(now), flag.start_date, flag.end_date)
}

export function evaluateSepActive(flag: Pick<AcaEnrollmentFlag, 'enabled'>) {
  return Boolean(flag.enabled)
}

async function getFlagByKey(key: string): Promise<AcaEnrollmentFlag | null> {
  const supabase = createServiceClient()
  const { data, error } = await supabase
    .from('aca_enrollment_flags')
    .select('*')
    .eq('key', key)
    .maybeSingle()
  if (error || !data) return null
  return data as AcaEnrollmentFlag
}

export async function listAcaEnrollmentFlags(): Promise<AcaEnrollmentFlag[]> {
  const supabase = createServiceClient()
  const { data, error } = await supabase
    .from('aca_enrollment_flags')
    .select('*')
    .order('key', { ascending: true })
  if (error) throw new Error(error.message)
  return (data ?? []) as AcaEnrollmentFlag[]
}

/** True when OEP flag is enabled AND today is within start/end dates. */
export async function isACAOpenEnrollment(now = new Date()): Promise<boolean> {
  const flag = await getFlagByKey(ACA_FLAG_KEYS.OEP)
  if (!flag) return false
  return evaluateOepActive(flag, now)
}

/** True when SEP applications are accepted. */
export async function isACASpecialEnrollmentEnabled(): Promise<boolean> {
  const flag = await getFlagByKey(ACA_FLAG_KEYS.SEP)
  if (!flag) return false
  return evaluateSepActive(flag)
}

export async function getAcaEnrollmentAvailability(now = new Date()) {
  const flags = await listAcaEnrollmentFlags()
  const oep = flags.find((f) => f.key === ACA_FLAG_KEYS.OEP) ?? null
  const sep = flags.find((f) => f.key === ACA_FLAG_KEYS.SEP) ?? null
  return {
    flags,
    openEnrollmentActive: oep ? evaluateOepActive(oep, now) : false,
    specialEnrollmentEnabled: sep ? evaluateSepActive(sep) : false,
    oep,
    sep,
  }
}
