import { createClient as createSupabaseClient } from '@supabase/supabase-js'
import { getSupabaseServiceRoleKey, getSupabaseUrl } from '@/lib/supabase/env'

/**
 * Service-role client — server only.
 * Bypasses RLS; use for trusted admin/office jobs and privileged ops.
 * Never import from client components.
 */
export function createServiceClient() {
  return createSupabaseClient(getSupabaseUrl(), getSupabaseServiceRoleKey(), {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  })
}
