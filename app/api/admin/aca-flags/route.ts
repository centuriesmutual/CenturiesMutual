import { NextResponse, type NextRequest } from 'next/server'
import { z } from 'zod'
import { requireAdmin } from '@/lib/admin/access'
import { createServiceClient } from '@/lib/supabase/admin'
import {
  ACA_FLAG_KEYS,
  evaluateOepActive,
  evaluateSepActive,
  listAcaEnrollmentFlags,
} from '@/lib/aca/enrollment-flags'
import { jsonError } from '@/lib/supabase/auth-helpers'
import { formatZodError } from '@/lib/validation/member'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

const patchSchema = z.object({
  key: z.enum([
    ACA_FLAG_KEYS.OEP,
    ACA_FLAG_KEYS.SEP,
    ACA_FLAG_KEYS.FORCE_NEXT_MONTH_START,
  ]),
  enabled: z.boolean().optional(),
  start_date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/)
    .nullable()
    .optional(),
  end_date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/)
    .nullable()
    .optional(),
  name: z.string().trim().min(1).max(120).optional(),
  description: z.string().trim().max(2000).optional(),
})

export async function GET() {
  const auth = await requireAdmin()
  if (auth.error) return auth.error

  try {
    const flags = await listAcaEnrollmentFlags()
    return NextResponse.json({
      ok: true,
      flags: flags.map((f) => ({
        ...f,
        active:
          f.key === ACA_FLAG_KEYS.OEP
            ? evaluateOepActive(f)
            : f.key === ACA_FLAG_KEYS.SEP || f.key === ACA_FLAG_KEYS.FORCE_NEXT_MONTH_START
              ? evaluateSepActive(f)
              : false,
      })),
    })
  } catch (e) {
    return jsonError(e instanceof Error ? e.message : 'Failed to load flags.', 500)
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

  const { key, ...rest } = parsed.data
  const updates = Object.fromEntries(
    Object.entries(rest).filter(([, v]) => v !== undefined),
  )
  if (Object.keys(updates).length === 0) {
    return jsonError('No fields to update.', 400)
  }

  if (
    key === ACA_FLAG_KEYS.OEP &&
    updates.start_date &&
    updates.end_date &&
    String(updates.start_date) > String(updates.end_date)
  ) {
    return jsonError('Open Enrollment start date must be on or before end date.', 400)
  }

  const supabase = createServiceClient()
  const { data, error } = await supabase
    .from('aca_enrollment_flags')
    .update(updates)
    .eq('key', key)
    .select('*')
    .single()

  if (error) return jsonError(error.message, 500)

  const flag = data as {
    key: string
    enabled: boolean
    start_date: string | null
    end_date: string | null
  }

  return NextResponse.json({
    ok: true,
    flag: {
      ...data,
      active:
        flag.key === ACA_FLAG_KEYS.OEP
          ? evaluateOepActive(flag)
          : evaluateSepActive(flag),
    },
  })
}
