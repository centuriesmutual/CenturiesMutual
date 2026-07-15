/**
 * Centuries Mutual Supabase module.
 *
 * Client: createClient from ./client (browser, anon key)
 * Server: createClient from ./server (cookies + anon)
 * Admin:  createServiceClient from ./admin (service role, RLS bypass)
 *
 * Future admin.centuriesmutual.com / office.centuriesmutual.com portals
 * should use createServiceClient on trusted servers only.
 */
export { createClient as createBrowserClient } from '@/lib/supabase/client'
export { createClient as createServerClient } from '@/lib/supabase/server'
export { createServiceClient } from '@/lib/supabase/admin'
export { isSupabaseConfigured } from '@/lib/supabase/env'
