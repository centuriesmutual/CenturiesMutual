import { createServiceClient } from '@/lib/supabase/admin'

export type AcaStateFlag = {
  id: string
  state_code: string
  state_name: string
  enabled: boolean
  licensed: boolean
  display_order: number
  created_at: string
  updated_at: string
}

function normalizeCode(stateCode: string) {
  return stateCode.trim().toUpperCase()
}

export async function listAcaStateFlags(): Promise<AcaStateFlag[]> {
  const supabase = createServiceClient()
  const { data, error } = await supabase
    .from('aca_state_flags')
    .select('*')
    .order('state_name', { ascending: true })
  if (error) throw new Error(error.message)
  return (data ?? []) as AcaStateFlag[]
}

export async function getAcaStateFlag(stateCode: string): Promise<AcaStateFlag | null> {
  const code = normalizeCode(stateCode)
  if (!/^[A-Z]{2}$/.test(code)) return null
  const supabase = createServiceClient()
  const { data, error } = await supabase
    .from('aca_state_flags')
    .select('*')
    .eq('state_code', code)
    .maybeSingle()
  if (error || !data) return null
  return data as AcaStateFlag
}

export async function isStateLicensed(stateCode: string): Promise<boolean> {
  const row = await getAcaStateFlag(stateCode)
  return Boolean(row?.licensed)
}

export async function isStateEnrollmentEnabled(stateCode: string): Promise<boolean> {
  const row = await getAcaStateFlag(stateCode)
  return Boolean(row?.enabled)
}

/** Available only when licensed AND enabled. */
export async function isStateAvailable(stateCode: string): Promise<boolean> {
  const row = await getAcaStateFlag(stateCode)
  return Boolean(row && row.licensed && row.enabled)
}

export async function listAvailableAcaStates(): Promise<AcaStateFlag[]> {
  const all = await listAcaStateFlags()
  return all.filter((s) => s.licensed && s.enabled)
}
