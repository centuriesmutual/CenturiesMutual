import { NextResponse, type NextRequest } from 'next/server'
import { requireAdmin } from '@/lib/admin/access'
import { createServiceClient } from '@/lib/supabase/admin'
import { jsonError } from '@/lib/supabase/auth-helpers'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

const CAREER_STATUSES = [
  'new',
  'reviewing',
  'interview',
  'offer',
  'hired',
  'declined',
  'archived',
] as const

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

/** GET — all career (job) applications, newest first. Admin-gated. */
export async function GET() {
  const auth = await requireAdmin()
  if (auth.error) return auth.error

  const supabase = createServiceClient()
  const { data, error } = await supabase
    .from('career_applications')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) return jsonError(error.message, 500)

  return NextResponse.json({ ok: true, careers: data ?? [] })
}

/** PATCH — update a career application status. Admin-gated. */
export async function PATCH(req: NextRequest) {
  const auth = await requireAdmin()
  if (auth.error) return auth.error

  let body: { id?: string; status?: string }
  try {
    body = (await req.json()) as { id?: string; status?: string }
  } catch {
    return jsonError('Invalid JSON body.')
  }

  const id = body.id?.trim()
  const status = body.status?.trim()

  if (!id || !UUID_RE.test(id)) {
    return jsonError('A valid application id is required.', 400)
  }
  if (!status || !CAREER_STATUSES.includes(status as (typeof CAREER_STATUSES)[number])) {
    return jsonError('A valid status is required.', 400)
  }

  const supabase = createServiceClient()
  const { data, error } = await supabase
    .from('career_applications')
    .update({ status })
    .eq('id', id)
    .select('*')
    .single()

  if (error) return jsonError(error.message, 500)

  return NextResponse.json({ ok: true, career: data })
}
