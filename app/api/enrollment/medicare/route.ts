import { NextResponse, type NextRequest } from 'next/server'
import { createServiceClient } from '@/lib/supabase/admin'
import { assertRateLimit, jsonError } from '@/lib/supabase/auth-helpers'
import {
  formatZodError,
  medicareReviewsIngestSchema,
} from '@/lib/validation/member'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

const SOURCE = 'medicare.reviews'
const DEFAULT_PLAN = 'Medicare Advantage'
const DAY_MS = 24 * 60 * 60 * 1000

function clientIp(req: NextRequest) {
  const fwd = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
  return fwd || req.headers.get('x-real-ip') || 'local'
}

function expectedIngestKey() {
  return (process.env.MEDICARE_REVIEWS_INGEST_KEY || '').trim()
}

function providedIngestKey(req: NextRequest) {
  const header = req.headers.get('x-medicare-reviews-key')?.trim()
  if (header) return header
  const auth = req.headers.get('authorization')?.trim() || ''
  if (auth.toLowerCase().startsWith('bearer ')) {
    return auth.slice(7).trim()
  }
  return ''
}

/**
 * POST /api/enrollment/medicare
 *
 * Public ingest endpoint for medicare.reviews submissions.
 * Requires MEDICARE_REVIEWS_INGEST_KEY (header `x-medicare-reviews-key`
 * or `Authorization: Bearer <key>`).
 *
 * Inserts into insurance_applications with:
 *   source = 'medicare.reviews'
 *   plan_type = payload.plan_type || 'Medicare Advantage'
 *
 * Those rows appear in Admin → Files → Medicare.Reviews.
 */
export async function POST(req: NextRequest) {
  const ip = clientIp(req)
  const burst = assertRateLimit(`enroll:medicare:burst:${ip}`, 20, 60_000)
  if (burst) return burst

  const expected = expectedIngestKey()
  if (!expected) {
    return jsonError(
      'Medicare ingest is not configured (MEDICARE_REVIEWS_INGEST_KEY).',
      503,
    )
  }
  if (providedIngestKey(req) !== expected) {
    return jsonError('Unauthorized.', 401)
  }

  let body: unknown
  try {
    body = await req.json()
  } catch {
    return jsonError('Invalid JSON body.')
  }

  const parsed = medicareReviewsIngestSchema.safeParse(body)
  if (!parsed.success) {
    return jsonError('Validation failed.', 400, formatZodError(parsed.error))
  }
  const row = parsed.data
  const email = row.email.trim().toLowerCase()

  const supabase = createServiceClient()

  // Soft daily dedupe by email (same pattern as ACA enroll).
  const since = new Date(Date.now() - DAY_MS).toISOString()
  const { data: recent } = await supabase
    .from('insurance_applications')
    .select('id')
    .eq('source', SOURCE)
    .ilike('email', email)
    .gte('created_at', since)
    .limit(1)

  if (recent && recent.length > 0) {
    return jsonError(
      'An application for this email was already submitted in the last 24 hours.',
      429,
    )
  }

  const planType = row.plan_type?.trim() || DEFAULT_PLAN
  const detail = {
    submitted_at: new Date().toISOString(),
    source: SOURCE,
    lead_id: row.lead_id || null,
    marketing_id: row.marketing_id || null,
    producer_id: row.producer_id || null,
    medicare_number_last4: row.medicare_number
      ? row.medicare_number.replace(/\s+/g, '').slice(-4)
      : null,
    preferred_language: row.preferred_language || null,
    county: row.county || null,
    coverage_start: row.coverage_start || null,
    meta: row.meta ?? null,
    freeform_notes: row.notes || null,
  }

  const { data, error } = await supabase
    .from('insurance_applications')
    .insert({
      user_id: null,
      application_status: 'submitted',
      first_name: row.first_name,
      last_name: row.last_name,
      email,
      phone: row.phone || null,
      address: row.address || null,
      city: row.city || null,
      state: row.state || null,
      zip: row.zip || null,
      date_of_birth: row.date_of_birth || null,
      plan_type: planType,
      source: SOURCE,
      notes: JSON.stringify(detail),
    })
    .select('id, created_at, source, plan_type, application_status')
    .single()

  if (error) return jsonError(error.message, 500)

  return NextResponse.json(
    {
      ok: true,
      id: data.id,
      source: data.source,
      plan_type: data.plan_type,
      application_status: data.application_status,
      created_at: data.created_at,
    },
    { status: 201 },
  )
}

/** GET — lightweight health / contract hint (no secrets). */
export async function GET() {
  const configured = Boolean(expectedIngestKey())
  return NextResponse.json({
    ok: true,
    service: 'medicare.reviews ingest',
    configured,
    source: SOURCE,
    default_plan_type: DEFAULT_PLAN,
    auth: 'x-medicare-reviews-key or Authorization: Bearer <MEDICARE_REVIEWS_INGEST_KEY>',
  })
}
