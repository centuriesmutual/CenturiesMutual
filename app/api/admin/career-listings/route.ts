import { NextResponse, type NextRequest } from 'next/server'
import { z } from 'zod'
import { requireAdmin } from '@/lib/admin/access'
import { createServiceClient } from '@/lib/supabase/admin'
import { CAREER_DEPARTMENTS } from '@/lib/careers/listings'
import { jsonError } from '@/lib/supabase/auth-helpers'
import { formatZodError } from '@/lib/validation/member'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

const listingSchema = z.object({
  title: z.string().trim().min(1).max(120),
  department: z.enum(CAREER_DEPARTMENTS),
  employment_type: z.string().trim().min(1).max(60),
  location: z.string().trim().min(1).max(120),
  description: z.string().trim().min(1).max(2000),
  sort_order: z.number().int().min(0).max(9999).optional(),
  published: z.boolean().optional(),
})

/** GET — all career listings (including unpublished). Admin-gated. */
export async function GET() {
  const auth = await requireAdmin()
  if (auth.error) return auth.error

  const supabase = createServiceClient()
  const { data, error } = await supabase
    .from('career_listings')
    .select('*')
    .order('sort_order', { ascending: true })
    .order('created_at', { ascending: true })

  if (error) return jsonError(error.message, 500)
  return NextResponse.json({ ok: true, listings: data ?? [] })
}

/** POST — create a listing. Admin-gated. */
export async function POST(req: NextRequest) {
  const auth = await requireAdmin()
  if (auth.error) return auth.error

  let body: unknown
  try {
    body = await req.json()
  } catch {
    return jsonError('Invalid JSON body.')
  }

  const parsed = listingSchema.safeParse(body)
  if (!parsed.success) {
    return jsonError('Validation failed.', 400, formatZodError(parsed.error))
  }

  const row = parsed.data
  const supabase = createServiceClient()
  const { data, error } = await supabase
    .from('career_listings')
    .insert({
      title: row.title,
      department: row.department,
      employment_type: row.employment_type,
      location: row.location,
      description: row.description,
      sort_order: row.sort_order ?? 100,
      published: row.published ?? true,
    })
    .select('*')
    .single()

  if (error) return jsonError(error.message, 500)
  return NextResponse.json({ ok: true, listing: data }, { status: 201 })
}

/** PATCH — update a listing. Admin-gated. */
export async function PATCH(req: NextRequest) {
  const auth = await requireAdmin()
  if (auth.error) return auth.error

  let body: unknown
  try {
    body = await req.json()
  } catch {
    return jsonError('Invalid JSON body.')
  }

  const id =
    typeof body === 'object' && body && 'id' in body
      ? String((body as { id?: string }).id ?? '').trim()
      : ''
  if (!id || !UUID_RE.test(id)) {
    return jsonError('A valid listing id is required.', 400)
  }

  const parsed = listingSchema.partial().safeParse(body)
  if (!parsed.success) {
    return jsonError('Validation failed.', 400, formatZodError(parsed.error))
  }

  const updates = Object.fromEntries(
    Object.entries(parsed.data).filter(([, v]) => v !== undefined),
  )
  if (Object.keys(updates).length === 0) {
    return jsonError('No fields to update.', 400)
  }

  const supabase = createServiceClient()
  const { data, error } = await supabase
    .from('career_listings')
    .update(updates)
    .eq('id', id)
    .select('*')
    .single()

  if (error) return jsonError(error.message, 500)
  return NextResponse.json({ ok: true, listing: data })
}

/** DELETE — remove a listing. Admin-gated. */
export async function DELETE(req: NextRequest) {
  const auth = await requireAdmin()
  if (auth.error) return auth.error

  const id = req.nextUrl.searchParams.get('id')?.trim()
  if (!id || !UUID_RE.test(id)) {
    return jsonError('A valid listing id is required.', 400)
  }

  const supabase = createServiceClient()
  const { error } = await supabase.from('career_listings').delete().eq('id', id)
  if (error) return jsonError(error.message, 500)
  return NextResponse.json({ ok: true })
}
