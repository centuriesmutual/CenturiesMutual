import { NextResponse, type NextRequest } from 'next/server'
import { createServiceClient } from '@/lib/supabase/admin'
import { assertRateLimit, jsonError } from '@/lib/supabase/auth-helpers'
import { careerApplicationSchema, formatZodError } from '@/lib/validation/member'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

/**
 * POST — public career (job) application submission.
 *
 * Applicants are not signed in, so this writes through the service-role client
 * into `career_applications` (RLS is closed to anon/authenticated). Submissions
 * appear in the admin portal Careers tab.
 */
export async function POST(req: NextRequest) {
  const limited = assertRateLimit(
    `careers:post:${req.headers.get('x-forwarded-for') ?? 'local'}`,
    5,
  )
  if (limited) return limited

  let body: unknown
  try {
    body = await req.json()
  } catch {
    return jsonError('Invalid JSON body.')
  }

  const parsed = careerApplicationSchema.safeParse(body)
  if (!parsed.success) {
    return jsonError('Validation failed.', 400, formatZodError(parsed.error))
  }

  const row = parsed.data
  const supabase = createServiceClient()
  const { data, error } = await supabase
    .from('career_applications')
    .insert({
      first_name: row.first_name,
      last_name: row.last_name,
      email: row.email,
      phone: row.phone || null,
      position: row.position,
      location: row.location || null,
      work_authorization: row.work_authorization || null,
      linkedin_url: row.linkedin_url || null,
      portfolio_url: row.portfolio_url || null,
      cover_letter: row.cover_letter || null,
      status: 'new',
    })
    .select('id')
    .single()

  if (error) return jsonError(error.message, 500)

  return NextResponse.json({ ok: true, id: data?.id }, { status: 201 })
}
