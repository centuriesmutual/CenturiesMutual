import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { jsonError, assertRateLimit, requireUser } from '@/lib/supabase/auth-helpers'
import { formatZodError, profileUpdateSchema } from '@/lib/validation/member'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

export async function GET(req: Request) {
  const limited = assertRateLimit(`profile:get:${req.headers.get('x-forwarded-for') ?? 'local'}`)
  if (limited) return limited

  const auth = await requireUser()
  if (auth.error) return auth.error

  const supabase = createClient()
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', auth.user.id)
    .maybeSingle()

  if (error) return jsonError(error.message, 500)

  return NextResponse.json({ ok: true, profile: data, user: { id: auth.user.id, email: auth.user.email } })
}

export async function PATCH(req: Request) {
  const limited = assertRateLimit(`profile:patch:${req.headers.get('x-forwarded-for') ?? 'local'}`)
  if (limited) return limited

  const auth = await requireUser()
  if (auth.error) return auth.error

  let body: unknown
  try {
    body = await req.json()
  } catch {
    return jsonError('Invalid JSON body.')
  }

  const parsed = profileUpdateSchema.safeParse(body)
  if (!parsed.success) {
    return jsonError('Validation failed.', 400, formatZodError(parsed.error))
  }

  const supabase = createClient()
  const { data, error } = await supabase
    .from('profiles')
    .update({
      ...parsed.data,
      phone: parsed.data.phone === undefined ? undefined : parsed.data.phone || null,
    })
    .eq('id', auth.user.id)
    .select('*')
    .single()

  if (error) return jsonError(error.message, 500)

  return NextResponse.json({ ok: true, profile: data })
}
