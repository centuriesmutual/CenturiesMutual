import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import type { User } from '@supabase/supabase-js'

export async function requireUser(): Promise<
  { user: User; error?: undefined } | { user?: undefined; error: NextResponse }
> {
  const supabase = createClient()
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  if (error || !user) {
    return {
      error: NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 }),
    }
  }

  return { user }
}

/** Simple in-memory rate limit (per-instance). Replace with Redis on scale-out. */
const buckets = new Map<string, { count: number; reset: number }>()

export function rateLimit(
  key: string,
  limit = 20,
  windowMs = 60_000,
): { ok: true } | { ok: false; response: NextResponse } {
  const now = Date.now()
  const entry = buckets.get(key)
  if (!entry || now > entry.reset) {
    buckets.set(key, { count: 1, reset: now + windowMs })
    return { ok: true }
  }
  if (entry.count >= limit) {
    return {
      ok: false,
      response: NextResponse.json(
        { ok: false, error: 'Too many requests. Try again shortly.' },
        { status: 429 },
      ),
    }
  }
  entry.count += 1
  return { ok: true }
}

export function assertRateLimit(
  key: string,
  limit = 20,
  windowMs = 60_000,
): NextResponse | null {
  const result = rateLimit(key, limit, windowMs)
  if (result.ok === false) return result.response
  return null
}

export function jsonError(message: string, status = 400, details?: unknown) {
  return NextResponse.json(
    { ok: false, error: message, details: details ?? undefined },
    { status },
  )
}
