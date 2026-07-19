import { NextResponse, type NextRequest } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createServiceClient } from '@/lib/supabase/admin'
import { assertRateLimit, jsonError } from '@/lib/supabase/auth-helpers'
import { acaEnrollmentSchema, formatZodError } from '@/lib/validation/member'
import {
  firstOfNextMonthIso,
  isACAForceNextMonthStartEnabled,
  isACAOpenEnrollment,
  isACASpecialEnrollmentEnabled,
} from '@/lib/aca/enrollment-flags'
import { getAcaStateFlag, isStateAvailable } from '@/lib/aca/state-flags'
import { ensureApplicationConversation } from '@/lib/conversations/server'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

const DAY_MS = 24 * 60 * 60 * 1000

function clientIp(req: NextRequest) {
  const fwd = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
  return fwd || req.headers.get('x-real-ip') || 'local'
}

/**
 * POST — public ACA enrollment submission.
 * Backend enforces enrollment-period flags, state availability, coverage-start
 * rule, and 1 application per email/IP per day.
 */
export async function POST(req: NextRequest) {
  const ip = clientIp(req)

  // Burst protection (per instance) in addition to durable daily limit below.
  const burst = assertRateLimit(`enroll:aca:burst:${ip}`, 5, 60_000)
  if (burst) return burst

  let body: unknown
  try {
    body = await req.json()
  } catch {
    return jsonError('Invalid JSON body.')
  }

  const parsed = acaEnrollmentSchema.safeParse(body)
  if (!parsed.success) {
    return jsonError('Validation failed.', 400, formatZodError(parsed.error))
  }
  const row = parsed.data
  const email = row.email.trim().toLowerCase()
  const fingerprint = `${email}|${ip}`

  const supabase = createServiceClient()

  // Durable: 1 ACA enrollment application per email (and per IP) per rolling day.
  const since = new Date(Date.now() - DAY_MS).toISOString()
  const { data: recentByEmail } = await supabase
    .from('insurance_applications')
    .select('id')
    .eq('source', 'enrollment')
    .ilike('email', email)
    .gte('created_at', since)
    .limit(1)

  if (recentByEmail && recentByEmail.length > 0) {
    return jsonError(
      'You have already submitted an ACA enrollment application in the last 24 hours. Please try again tomorrow.',
      429,
    )
  }

  const { data: recentRate } = await supabase
    .from('aca_enrollment_rate_limits')
    .select('id')
    .eq('fingerprint', fingerprint)
    .gte('created_at', since)
    .limit(1)

  if (recentRate && recentRate.length > 0) {
    return jsonError(
      'You have already submitted an ACA enrollment application in the last 24 hours. Please try again tomorrow.',
      429,
    )
  }

  // --- Enrollment period flags ---
  if (row.enrollment_period === 'open') {
    const oepActive = await isACAOpenEnrollment()
    if (!oepActive) {
      return jsonError(
        'Open Enrollment is not currently active. You cannot submit an Open Enrollment application at this time.',
        403,
      )
    }
  } else if (row.enrollment_period === 'sep') {
    const sepEnabled = await isACASpecialEnrollmentEnabled()
    if (!sepEnabled) {
      return jsonError(
        'Special Enrollment Period applications are not currently accepted.',
        403,
      )
    }
    if (!row.sep_qualifying_event || !row.sep_event_date || !row.sep_attested) {
      return jsonError(
        'A valid Special Enrollment Period qualifying event, event date, and attestation are required.',
        400,
      )
    }
  }

  // --- State availability ---
  const stateRow = await getAcaStateFlag(row.state)
  if (!stateRow || !(await isStateAvailable(row.state))) {
    return jsonError('ACA enrollment is currently unavailable in the selected state.', 403)
  }

  // --- Coverage start (flag-controlled; default forced to 1st of next month) ---
  let coverageStart = row.coverage_start
  if (await isACAForceNextMonthStartEnabled()) {
    coverageStart = firstOfNextMonthIso()
  }

  let userId: string | null = null
  try {
    const authClient = createClient()
    const {
      data: { user },
    } = await authClient.auth.getUser()
    userId = user?.id ?? null
  } catch {
    userId = null
  }

  const maskedSsn = `***-**-${row.ssn.slice(-4)}`
  const detail = {
    submitted_at: new Date().toISOString(),
    applicant: {
      middle_initial: row.middle_initial || null,
      sex: row.sex,
      ssn: row.ssn,
      ssn_last4: row.ssn.slice(-4),
      apt: row.apt || null,
      county: row.county || null,
      citizenship: row.citizenship || null,
      tobacco: row.tobacco || null,
    },
    enrollment_period: row.enrollment_period,
    sep: {
      qualifying_event: row.sep_qualifying_event || null,
      event_date: row.sep_event_date || null,
      attested: Boolean(row.sep_attested),
    },
    household: {
      size: row.household_size,
      annual_income: row.annual_income,
      filing_status: row.filing_status || null,
      current_coverage: row.current_coverage || null,
      coverage_start: coverageStart,
      coverage_start_forced: coverageStart !== row.coverage_start,
    },
    dependents: (row.dependents ?? []).filter(
      (d) => d.first_name || d.last_name || d.dob,
    ),
    disclosures_accepted: row.disclosures_accepted,
    e_signature: row.signature,
    ssn_masked: maskedSsn,
    state_gate: {
      state_code: stateRow.state_code,
      licensed: stateRow.licensed,
      enabled: stateRow.enabled,
    },
  }

  const { data, error } = await supabase
    .from('insurance_applications')
    .insert({
      user_id: userId,
      application_status: 'submitted',
      first_name: row.first_name,
      last_name: row.last_name,
      email: email,
      phone: row.phone || null,
      address: row.address,
      city: row.city,
      state: row.state,
      zip: row.zip,
      date_of_birth: row.date_of_birth,
      plan_type: 'ACA — Individual & Family',
      source: 'enrollment',
      notes: JSON.stringify(detail),
    })
    .select('id')
    .single()

  if (error) return jsonError(error.message, 500)

  if (data?.id) {
    await ensureApplicationConversation({
      applicationId: data.id,
      systemMessage: 'Application submitted',
    })
  }

  await supabase.from('aca_enrollment_rate_limits').insert({
    fingerprint,
    email,
    ip,
    application_id: data?.id ?? null,
  })

  return NextResponse.json(
    { ok: true, id: data?.id, coverage_start: coverageStart },
    { status: 201 },
  )
}
