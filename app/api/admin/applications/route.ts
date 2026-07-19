import { NextResponse, type NextRequest } from 'next/server'
import { requireAdmin } from '@/lib/admin/access'
import { createServiceClient } from '@/lib/supabase/admin'
import { jsonError } from '@/lib/supabase/auth-helpers'
import {
  ensureApplicationConversation,
  ensureMember,
  postSystemMessage,
  staffRoleFromEmail,
} from '@/lib/conversations/server'
import { adminEmails } from '@/lib/admin/access'

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

type ApplicationPatchBody = {
  id?: string
  application_status?: string
  notes?: string | null
  first_name?: string
  last_name?: string
  email?: string
  phone?: string | null
  date_of_birth?: string | null
  address?: string | null
  city?: string | null
  state?: string | null
  zip?: string | null
  plan_type?: string | null
}

/** PATCH — update application status, notes, and/or profile fields. Admin-gated. */
export async function PATCH(req: NextRequest) {
  const auth = await requireAdmin()
  if (auth.error) return auth.error

  let body: ApplicationPatchBody
  try {
    body = (await req.json()) as ApplicationPatchBody
  } catch {
    return jsonError('Invalid JSON body.')
  }

  const id = body.id?.trim()
  if (!id || !UUID_RE.test(id)) {
    return jsonError('A valid application id is required.', 400)
  }

  const patch: Record<string, string | null> = {}

  if (body.application_status !== undefined) {
    const status = body.application_status?.trim()
    if (!status || !APPLICATION_STATUSES.includes(status as (typeof APPLICATION_STATUSES)[number])) {
      return jsonError('A valid application_status is required.', 400)
    }
    patch.application_status = status
  }

  if (body.notes !== undefined) {
    patch.notes = body.notes
  }

  const optionalText = (key: keyof ApplicationPatchBody, allowEmptyAsNull = true) => {
    if (body[key] === undefined) return
    const raw = typeof body[key] === 'string' ? (body[key] as string).trim() : ''
    patch[key] = raw || (allowEmptyAsNull ? null : raw)
  }

  if (body.first_name !== undefined) {
    const first_name = typeof body.first_name === 'string' ? body.first_name.trim() : ''
    if (!first_name) return jsonError('First name is required.', 400)
    patch.first_name = first_name
  }

  if (body.last_name !== undefined) {
    const last_name = typeof body.last_name === 'string' ? body.last_name.trim() : ''
    if (!last_name) return jsonError('Last name is required.', 400)
    patch.last_name = last_name
  }

  if (body.email !== undefined) {
    const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : ''
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return jsonError('Enter a valid email address.', 400)
    }
    patch.email = email
  }

  optionalText('phone')
  optionalText('date_of_birth')
  optionalText('address')
  optionalText('city')
  optionalText('plan_type')
  optionalText('zip')

  if (body.state !== undefined) {
    const stateRaw = typeof body.state === 'string' ? body.state.trim().toUpperCase() : ''
    patch.state = stateRaw.length === 2 ? stateRaw : stateRaw || null
  }

  if (Object.keys(patch).length === 0) {
    return jsonError('Provide fields to update.', 400)
  }

  const supabase = createServiceClient()

  let previousStatus: string | null = null
  if (body.application_status !== undefined) {
    const { data: prev } = await supabase
      .from('insurance_applications')
      .select('application_status')
      .eq('id', id)
      .maybeSingle()
    previousStatus = prev?.application_status ?? null
  }

  const { data, error } = await supabase
    .from('insurance_applications')
    .update(patch)
    .eq('id', id)
    .select('*')
    .single()

  if (error) return jsonError(error.message, 500)

  const convo = await ensureApplicationConversation({
    applicationId: id,
    createdAt: data?.created_at,
  })

  if (convo && auth.user) {
    await ensureMember(
      convo.id,
      auth.user.id,
      staffRoleFromEmail(auth.user.email, adminEmails()),
    )
  }

  if (
    convo &&
    body.application_status !== undefined &&
    previousStatus &&
    previousStatus !== body.application_status
  ) {
    const label = String(body.application_status).replace(/_/g, ' ')
    await postSystemMessage(
      convo.id,
      `Status updated: ${previousStatus.replace(/_/g, ' ')} → ${label}`,
      'status',
    )
  }

  return NextResponse.json({ ok: true, application: data })
}

/** POST — create an application from the Office Clients intake form. Admin-gated. */
export async function POST(req: NextRequest) {
  const auth = await requireAdmin()
  if (auth.error) return auth.error

  let body: Record<string, unknown>
  try {
    body = (await req.json()) as Record<string, unknown>
  } catch {
    return jsonError('Invalid JSON body.')
  }

  const str = (key: string) => {
    const v = body[key]
    return typeof v === 'string' ? v.trim() : ''
  }

  const first_name = str('first_name')
  const last_name = str('last_name')
  const email = str('email').toLowerCase()

  if (!first_name || !last_name || !email) {
    return jsonError('First name, last name, and email are required.', 400)
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return jsonError('Enter a valid email address.', 400)
  }

  const phone = str('phone') || null
  const date_of_birth = str('date_of_birth') || null
  const address = str('address') || null
  const city = str('city') || null
  const stateRaw = str('state').toUpperCase()
  const state = stateRaw.length === 2 ? stateRaw : stateRaw || null
  const zip = str('zip') || null
  const plan_type = str('plan_type') || null
  const source = str('source') || 'office'
  const notesText = str('notes')
  const medicare_number = str('medicare_number')
  const preferred_language = str('preferred_language')
  const county = str('county')
  const coverage_start = str('coverage_start')

  const packet: Record<string, unknown> = {}
  if (medicare_number) packet.medicare_number = medicare_number
  if (preferred_language) packet.preferred_language = preferred_language
  if (county) packet.county = county
  if (coverage_start) packet.coverage_start = coverage_start
  if (notesText) packet.agent_notes = notesText

  const notes =
    Object.keys(packet).length > 0
      ? JSON.stringify({ office_intake: true, ...packet })
      : notesText || null

  const supabase = createServiceClient()
  const { data, error } = await supabase
    .from('insurance_applications')
    .insert({
      user_id: null,
      first_name,
      last_name,
      email,
      phone,
      date_of_birth,
      address,
      city,
      state,
      zip,
      plan_type,
      source,
      notes,
      application_status: 'submitted',
    })
    .select('*')
    .single()

  if (error) return jsonError(error.message, 500)

  await ensureApplicationConversation({
    applicationId: data.id,
    createdAt: data.created_at,
    systemMessage: 'Application submitted',
  })

  if (auth.user) {
    const supabase2 = createServiceClient()
    const { data: convo } = await supabase2
      .from('conversations')
      .select('id')
      .eq('application_id', data.id)
      .is('archived_at', null)
      .maybeSingle()
    if (convo) {
      await ensureMember(
        convo.id,
        auth.user.id,
        staffRoleFromEmail(auth.user.email, adminEmails()),
      )
    }
  }

  return NextResponse.json({ ok: true, application: data }, { status: 201 })
}
