import { NextResponse, type NextRequest } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createServiceClient } from '@/lib/supabase/admin'
import { assertRateLimit, jsonError } from '@/lib/supabase/auth-helpers'
import { acaEnrollmentSchema, formatZodError } from '@/lib/validation/member'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

/**
 * POST — public ACA (marketplace) enrollment submission.
 *
 * Opened from the homepage hero "Enrollment" button, so the applicant may not
 * have an account yet. We attach the signed-in user's id when present, then
 * write with the service-role client (user_id is nullable). The submission lands
 * in `insurance_applications` tagged plan_type='ACA' / source='enrollment' and
 * shows up in the admin portal's ACA tab. Rich detail (SEP declaration, income,
 * household, dependents, signature) is preserved as JSON in `notes`.
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

  // Best-effort: link to the signed-in member if there is a session.
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

  // Everything the flow collected, minus the SSN which we mask before storing.
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
