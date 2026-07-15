import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { jsonError, assertRateLimit, requireUser } from '@/lib/supabase/auth-helpers'
import {
  formatZodError,
  insuranceApplicationSchema,
  insuranceApplicationUpdateSchema,
} from '@/lib/validation/member'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

/** GET — current user's applications (most recent first) */
export async function GET(req: NextRequest) {
  const limited = assertRateLimit(`apps:get:${req.headers.get('x-forwarded-for') ?? 'local'}`)
  if (limited) return limited

  const auth = await requireUser()
  if (auth.error) return auth.error

  const supabase = createClient()
  const { data, error } = await supabase
    .from('insurance_applications')
    .select('*')
    .eq('user_id', auth.user.id)
    .order('created_at', { ascending: false })

  if (error) {
    return jsonError(error.message, 500)
  }

  return NextResponse.json({ ok: true, applications: data ?? [] })
}

/** POST — create insurance application */
export async function POST(req: NextRequest) {
  const limited = assertRateLimit(`apps:post:${req.headers.get('x-forwarded-for') ?? 'local'}`, 10)
  if (limited) return limited

  const auth = await requireUser()
  if (auth.error) return auth.error

  let body: unknown
  try {
    body = await req.json()
  } catch {
    return jsonError('Invalid JSON body.')
  }

  const parsed = insuranceApplicationSchema.safeParse(body)
  if (!parsed.success) {
    return jsonError('Validation failed.', 400, formatZodError(parsed.error))
  }

  const row = parsed.data
  const supabase = createClient()
  const { data, error } = await supabase
    .from('insurance_applications')
    .insert({
      user_id: auth.user.id,
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
      notes: row.notes ?? null,
    })
    .select('*')
    .single()

  if (error) {
    return jsonError(error.message, 500)
  }

  return NextResponse.json({ ok: true, application: data }, { status: 201 })
}

/** PATCH — update own application */
export async function PATCH(req: NextRequest) {
  const limited = assertRateLimit(`apps:patch:${req.headers.get('x-forwarded-for') ?? 'local'}`, 20)
  if (limited) return limited

  const auth = await requireUser()
  if (auth.error) return auth.error

  let body: unknown
  try {
    body = await req.json()
  } catch {
    return jsonError('Invalid JSON body.')
  }

  const parsed = insuranceApplicationUpdateSchema.safeParse(body)
  if (!parsed.success) {
    return jsonError('Validation failed.', 400, formatZodError(parsed.error))
  }

  const { id, ...updates } = parsed.data
  const supabase = createClient()

  const { data: existing, error: findError } = await supabase
    .from('insurance_applications')
    .select('id, user_id')
    .eq('id', id)
    .maybeSingle()

  if (findError) return jsonError(findError.message, 500)
  if (!existing || existing.user_id !== auth.user.id) {
    return jsonError('Application not found.', 404)
  }

  const { data, error } = await supabase
    .from('insurance_applications')
    .update({
      ...updates,
      phone: updates.phone === undefined ? undefined : updates.phone || null,
      notes: updates.notes === undefined ? undefined : updates.notes,
    })
    .eq('id', id)
    .eq('user_id', auth.user.id)
    .select('*')
    .single()

  if (error) return jsonError(error.message, 500)

  return NextResponse.json({ ok: true, application: data })
}
