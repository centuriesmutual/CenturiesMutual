import { NextResponse, type NextRequest } from 'next/server'
import { requireAdmin } from '@/lib/admin/access'
import { createServiceClient } from '@/lib/supabase/admin'
import { jsonError } from '@/lib/supabase/auth-helpers'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

type Ctx = { params: { id: string } }

/** GET — messages in a thread. */
export async function GET(_req: NextRequest, ctx: Ctx) {
  const auth = await requireAdmin()
  if (auth.error) return auth.error

  const id = ctx.params.id
  const supabase = createServiceClient()

  await supabase.from('office_mailbox_participants').upsert(
    {
      thread_id: id,
      user_id: auth.user.id,
      email: auth.user.email ?? null,
    },
    { onConflict: 'thread_id,user_id' },
  )

  const { data: thread, error } = await supabase
    .from('office_mailbox_threads')
    .select('*')
    .eq('id', id)
    .maybeSingle()

  if (error) return jsonError(error.message, 500)
  if (!thread) return jsonError('Thread not found.', 404)

  const { data: messages, error: mErr } = await supabase
    .from('office_mailbox_messages')
    .select('*')
    .eq('thread_id', id)
    .order('created_at', { ascending: true })

  if (mErr) return jsonError(mErr.message, 500)
  return NextResponse.json({ ok: true, thread, messages: messages ?? [] })
}

/** POST — reply in thread. */
export async function POST(req: NextRequest, ctx: Ctx) {
  const auth = await requireAdmin()
  if (auth.error) return auth.error

  const id = ctx.params.id
  let body: { body?: string }
  try {
    body = (await req.json()) as typeof body
  } catch {
    return jsonError('Invalid JSON body.')
  }
  const text = body.body?.trim()
  if (!text) return jsonError('Message body is required.', 400)

  const supabase = createServiceClient()
  await supabase.from('office_mailbox_participants').upsert(
    {
      thread_id: id,
      user_id: auth.user.id,
      email: auth.user.email ?? null,
    },
    { onConflict: 'thread_id,user_id' },
  )

  const { data: message, error } = await supabase
    .from('office_mailbox_messages')
    .insert({
      thread_id: id,
      sender_id: auth.user.id,
      sender_email: auth.user.email ?? null,
      body: text,
    })
    .select('*')
    .single()

  if (error) return jsonError(error.message, 500)

  await supabase
    .from('office_mailbox_threads')
    .update({ updated_at: new Date().toISOString() })
    .eq('id', id)

  return NextResponse.json({ ok: true, message }, { status: 201 })
}
