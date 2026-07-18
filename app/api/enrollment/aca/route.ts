import { NextResponse, type NextRequest } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createServiceClient } from '@/lib/supabase/admin'
import { assertRateLimit, jsonError } from '@/lib/supabase/auth-helpers'
import { acaEnrollmentSchema, formatZodError } from '@/lib/validation/member'
import {
  isACAOpenEnrollment,
  isACASpecialEnrollmentEnabled,
} from '@/lib/aca/enrollment-flags'
import { getAcaStateFlag, isStateAvailable } from '@/lib/aca/state-flags'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

/**
 * POST — public ACA enrollment submission.
 * Backend enforces enrollment-period flags and state availability.
 */
export async function POST(req: NextRequest) {
  const limited = assertRateLimit(
    `enroll:aca:${req.headers.get('x-forwarded-for') ?? 'local'}`,
    8,
  )
  if (limited) return limited

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

  // --- Enrollment period flags (source of truth) ---
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

  // --- State availability (source of truth) ---
  const stateRow = await getAcaStateFlag(row.state)
  if (!stateRow) {
    return jsonError('ACA enrollment is currently unavailable in the selected state.', 403)
  }
  if (!(await isStateAvailable(row.state))) {
    return jsonError('ACA enrollment is currently unavailable in the selected state.', 403)
  }

  let userId: string | null = null
  try {
    const supabase = createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()
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
      coverage_start: row.coverage_start,
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

  const supabase = createServiceClient()
  const { data, error } = await supabase
    .from('insurance_applications')
    .insert({
      user_id: userId,
      application_status: 'submitted',
      first_name: row.first_name,
      last_name: row.last_name,
      email: row.email,
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

  return NextResponse.json({ ok: true, id: data?.id }, { status: 201 })
}
