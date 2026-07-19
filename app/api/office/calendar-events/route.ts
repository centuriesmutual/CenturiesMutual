import { NextResponse, type NextRequest } from 'next/server'
import { createServiceClient } from '@/lib/supabase/admin'
import { jsonError } from '@/lib/supabase/auth-helpers'
import { getAdminSession } from '@/lib/admin/access'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

/**
 * GET — calendar events for the Office subdomain.
 * Returns events marked sync_to_office (company/team always; individual when matching email).
 */
export async function GET(req: NextRequest) {
  const session = await getAdminSession()
  if (!session.authenticated || !session.admin) {
    return jsonError('Unauthorized', 401)
  }

  const from = req.nextUrl.searchParams.get('from')
  const to = req.nextUrl.searchParams.get('to')
  const email = (session.email || '').toLowerCase()
  const supabase = createServiceClient()

  let q = supabase
    .from('office_calendar_events')
    .select('*')
    .eq('sync_to_office', true)
    .order('starts_at', { ascending: true })

  if (from) q = q.gte('starts_at', from)
  if (to) q = q.lte('starts_at', to)

  const { data, error } = await q
  if (error) return jsonError(error.message, 500)

  const events = (data || []).filter((e) => {
    if (e.scope === 'company' || e.scope === 'team' || e.scope === 'executive') return true
    if (e.scope === 'individual') {
      return (e.assignee_email || '').toLowerCase() === email
    }
    return true
  })

  return NextResponse.json({ ok: true, events })
}
