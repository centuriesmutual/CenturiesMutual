import { NextResponse, type NextRequest } from 'next/server'
import { z } from 'zod'
import { requireAdmin } from '@/lib/admin/access'
import { createServiceClient } from '@/lib/supabase/admin'
import { listAcaStateFlags } from '@/lib/aca/state-flags'
import { jsonError } from '@/lib/supabase/auth-helpers'
import { formatZodError } from '@/lib/validation/member'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

const patchSchema = z.object({
  id: z.string().uuid().optional(),
  state_code: z
    .string()
    .trim()
    .length(2)
    .transform((v) => v.toUpperCase())
    .optional(),
  enabled: z.boolean().optional(),
  licensed: z.boolean().optional(),
  display_order: z.number().int().optional(),
})

export async function GET() {
  const auth = await requireAdmin()
  if (auth.error) return auth.error

  try {
    const states = await listAcaStateFlags()
    return NextResponse.json({
      ok: true,
      states: states.map((s) => ({
        ...s,
        status: s.licensed && s.enabled ? 'Available' : s.licensed ? 'Licensed only' : 'Unavailable',
      })),
    })
  } catch (e) {
    return jsonError(e instanceof Error ? e.message : 'Failed to load states.', 500)
  }
}

export async function PATCH(req: NextRequest) {
  const auth = await requireAdmin()
  if (auth.error) return auth.error

  let body: unknown
  try {
    body = await req.json()
  } catch {
    return jsonError('Invalid JSON body.')
  }

  const parsed = patchSchema.safeParse(body)
  if (!parsed.success) {
    return jsonError('Validation failed.', 400, formatZodError(parsed.error))
  }

  const { id, state_code, ...rest } = parsed.data
  if (!id && !state_code) {
    return jsonError('Provide id or state_code.', 400)
  }
  if (id && !UUID_RE.test(id)) {
    return jsonError('Invalid id.', 400)
  }

  const updates = Object.fromEntries(
    Object.entries(rest).filter(([, v]) => v !== undefined),
  )
  if (Object.keys(updates).length === 0) {
    return jsonError('No fields to update.', 400)
  }

  const supabase = createServiceClient()
  let query = supabase.from('aca_state_flags').update(updates)
  query = id ? query.eq('id', id) : query.eq('state_code', state_code!)

  const { data, error } = await query.select('*').single()
  if (error) return jsonError(error.message, 500)

  const row = data as {
    licensed: boolean
    enabled: boolean
  }

  return NextResponse.json({
    ok: true,
    state: {
      ...data,
      status:
        row.licensed && row.enabled
          ? 'Available'
          : row.licensed
            ? 'Licensed only'
            : 'Unavailable',
    },
  })
}
