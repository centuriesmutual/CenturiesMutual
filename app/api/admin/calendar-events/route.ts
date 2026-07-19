import { NextResponse, type NextRequest } from 'next/server'
import { requireAdmin } from '@/lib/admin/access'
import { createServiceClient } from '@/lib/supabase/admin'
import { jsonError } from '@/lib/supabase/auth-helpers'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

const SCOPES = ['individual', 'executive', 'team', 'company'] as const

/** GET — list calendar events (optional from/to ISO range). */
export async function GET(req: NextRequest) {
  const auth = await requireAdmin()
  if (auth.error) return auth.error

  const from = req.nextUrl.searchParams.get('from')
  const to = req.nextUrl.searchParams.get('to')
  const supabase = createServiceClient()

  let q = supabase
    .from('office_calendar_events')
    .select('*')
    .order('starts_at', { ascending: true })

  if (from) q = q.gte('starts_at', from)
  if (to) q = q.lte('starts_at', to)

  const { data, error } = await q
  if (error) return jsonError(error.message, 500)
  return NextResponse.json({ ok: true, events: data ?? [] })
}

/** POST — create a calendar event (company-wide or selective employee). */
export async function POST(req: NextRequest) {
  const auth = await requireAdmin()
  if (auth.error) return auth.error

  let body: {
    title?: string
    description?: string
    startsAt?: string
    endsAt?: string | null
    allDay?: boolean
    scope?: string
    assigneeEmail?: string | null
    syncToOffice?: boolean
  }
  try {
    body = (await req.json()) as typeof body
  } catch {
    return jsonError('Invalid JSON body.')
  }

  const title = body.title?.trim()
  if (!title) return jsonError('Title is required.', 400)
  const startsAt = body.startsAt?.trim()
  if (!startsAt || Number.isNaN(new Date(startsAt).getTime())) {
    return jsonError('A valid startsAt is required.', 400)
  }
  const scope = (body.scope || 'company').toLowerCase()
  if (!SCOPES.includes(scope as (typeof SCOPES)[number])) {
    return jsonError('Invalid scope.', 400)
  }

  const assigneeEmail = body.assigneeEmail?.trim().toLowerCase() || null
  if (scope === 'individual' && !assigneeEmail) {
    return jsonError('Select an employee email for individual events.', 400)
  }

  const supabase = createServiceClient()
  let assigneeUserId: string | null = null
  if (assigneeEmail) {
    const { data: users } = await supabase.auth.admin.listUsers({ perPage: 200 })
    const match = users?.users?.find((u) => u.email?.toLowerCase() === assigneeEmail)
    assigneeUserId = match?.id ?? null
  }

  const { data, error } = await supabase
    .from('office_calendar_events')
    .insert({
      title,
      description: body.description?.trim() || null,
      starts_at: startsAt,
      ends_at: body.endsAt || null,
      all_day: Boolean(body.allDay),
      scope,
      assignee_user_id: assigneeUserId,
      assignee_email: assigneeEmail,
      created_by: auth.user.id,
      created_by_email: auth.user.email ?? null,
      sync_to_office: body.syncToOffice !== false,
    })
    .select('*')
    .single()

  if (error) return jsonError(error.message, 500)
  return NextResponse.json({ ok: true, event: data }, { status: 201 })
}
