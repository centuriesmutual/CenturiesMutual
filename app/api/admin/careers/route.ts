import { NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/admin/access'
import { createServiceClient } from '@/lib/supabase/admin'
import { jsonError } from '@/lib/supabase/auth-helpers'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

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
