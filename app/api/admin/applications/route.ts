import { NextResponse, type NextRequest } from 'next/server'
import { requireAdmin } from '@/lib/admin/access'
import { createServiceClient } from '@/lib/supabase/admin'
import { jsonError } from '@/lib/supabase/auth-helpers'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

const APPLICATION_STATUSES = [
  'submitted',
  'under_review',
  'additional_information',
  'approved',
  'declined',
  'active',
] as const

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

/**
 * GET — every insurance application submission across all members.
 *
 * Uses the service-role client to bypass member RLS so the admin portal can see
 * ACA, dental/vision, supplement, group, and Medicare submissions — including
 * applications created by external front-ends (e.g. medicare.reviews) that
 * write to the same Supabase project. Admin-gated by the ADMIN_EMAILS allowlist.
 */
export async function GET() {
  const auth = await requireAdmin()
  if (auth.error) return auth.error

  const supabase = createServiceClient()
  const { data, error } = await supabase
    .from('insurance_applications')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) return jsonError(error.message, 500)

  return NextResponse.json({ ok: true, applications: data ?? [] })
}

/** PATCH — update an application's status across any member. Admin-gated. */
export async function PATCH(req: NextRequest) {
  const auth = await requireAdmin()
  if (auth.error) return auth.error

  let body: { id?: string; application_status?: string }
  try {
    body = (await req.json()) as { id?: string; application_status?: string }
  } catch {
    return jsonError('Invalid JSON body.')
  }

  const id = body.id?.trim()
  const status = body.application_status?.trim()

  if (!id || !UUID_RE.test(id)) {
    return jsonError('A valid application id is required.', 400)
  }
  if (!status || !APPLICATION_STATUSES.includes(status as (typeof APPLICATION_STATUSES)[number])) {
    return jsonError('A valid application_status is required.', 400)
  }

  const supabase = createServiceClient()
  const { data, error } = await supabase
    .from('insurance_applications')
    .update({ application_status: status })
    .eq('id', id)
    .select('*')
    .single()

  if (error) return jsonError(error.message, 500)

  return NextResponse.json({ ok: true, application: data })
}
