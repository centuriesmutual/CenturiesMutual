/**
 * Shared env resolution for Supabase.
 * Server: SUPABASE_URL, SUPABASE_ANON_KEY, SUPABASE_SERVICE_ROLE_KEY
 * Browser may use NEXT_PUBLIC_* mirrors of the public URL + anon key only.
 */
export function getSupabaseUrl() {
  const url =
    process.env.NEXT_PUBLIC_SUPABASE_URL?.trim() ||
    process.env.SUPABASE_URL?.trim()
  if (!url) {
    throw new Error('Missing SUPABASE_URL (or NEXT_PUBLIC_SUPABASE_URL)')
  }
  return url
}

export function getSupabaseAnonKey() {
  const key =
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim() ||
    process.env.SUPABASE_ANON_KEY?.trim()
  if (!key) {
    throw new Error('Missing SUPABASE_ANON_KEY (or NEXT_PUBLIC_SUPABASE_ANON_KEY)')
  }
  return key
}

export function getSupabaseServiceRoleKey() {
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim()
  if (!key) {
    throw new Error('Missing SUPABASE_SERVICE_ROLE_KEY')
  }
  return key
}

/**
 * Optional cookie domain so the Supabase session is shared across
 * *.centuriesmutual.com (main site, wallet., admin.). Set
 * NEXT_PUBLIC_COOKIE_DOMAIN=.centuriesmutual.com in production ONLY — leaving it
 * unset keeps host-only cookies for local dev (localhost cannot use a domain).
 */
export function getCookieDomain(): string | undefined {
  const domain = process.env.NEXT_PUBLIC_COOKIE_DOMAIN?.trim()
  return domain || undefined
}

/** Shared cookie options for the SSR clients. */
export function supabaseCookieOptions() {
  const domain = getCookieDomain()
  return domain ? { domain } : undefined
}

export function isSupabaseConfigured() {
  try {
    getSupabaseUrl()
    getSupabaseAnonKey()
    return true
  } catch {
    return false
  }
}
