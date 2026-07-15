import { createBrowserClient } from '@supabase/ssr'
import { getSupabaseAnonKey, getSupabaseUrl } from '@/lib/supabase/env'

/** Browser Supabase client — anon key only, never service role. */
export function createClient() {
  return createBrowserClient(getSupabaseUrl(), getSupabaseAnonKey())
}
