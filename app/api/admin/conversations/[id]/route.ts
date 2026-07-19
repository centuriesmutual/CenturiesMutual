import { NextResponse, type NextRequest } from 'next/server'
import { requireAdmin, adminEmails } from '@/lib/admin/access'
import { createServiceClient } from '@/lib/supabase/admin'
import { jsonError } from '@/lib/supabase/auth-helpers'
import { ensureMember, staffRoleFromEmail } from '@/lib/conversations/server'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

type Ctx = { params: { id: string } }

/** GET — full conversation with messages (paginated older messages via before=). */
export async function GET(req: NextRequest, ctx: Ctx) {
  const auth = await requireAdmin()
  if (auth.error) return auth.error

  const id = ctx.params.id
  if (!id) return jsonError('Conversation id required.', 400)

  const supabase = createServiceClient()
  await ensureMember(
    id,
    auth.user.id,
    staffRoleFromEmail(auth.user.email, adminEmails()),
  )

  const { data: conversation, error } = await supabase
    .from('conversations')
    .select('*')
    .eq('id', id)
    .maybeSingle()

  if (error) return jsonError(error.message, 500)
  if (!conversation) return jsonError('Conversation not found.', 404)

  const before = req.nextUrl.searchParams.get('before')
  const limit = Math.min(Number(req.nextUrl.searchParams.get('limit') || 40), 100)

  let q = supabase
    .from('messages')
    .select('*')
    .eq('conversation_id', id)
    .order('created_at', { ascending: false })
    .limit(limit)

  if (before) {
    q = q.lt('created_at', before)
  }

  const { data: msgs, error: msgErr } = await q
  if (msgErr) return jsonError(msgErr.message, 500)

  const messages = (msgs || []).slice().reverse()
  const messageIds = messages.map((m) => m.id as string)

  let attachments: Record<string, unknown>[] = []
  if (messageIds.length > 0) {
    const { data: atts } = await supabase
      .from('attachments')
      .select('*')
      .in('message_id', messageIds)
    attachments = atts || []
  }

  let reads: { message_id: string; user_id: string; read_at: string }[] = []
  if (messageIds.length > 0) {
    const { data: r } = await supabase
      .from('message_reads')
      .select('message_id, user_id, read_at')
      .in('message_id', messageIds)
    reads = (r || []) as typeof reads
  }

  let application = null
  if (conversation.application_id) {
    const { data: app } = await supabase
      .from('insurance_applications')
      .select(
        'id, first_name, last_name, application_status, email, phone, plan_type, source, created_at',
      )
      .eq('id', conversation.application_id)
      .maybeSingle()
    application = app
  }

  // Mark loaded messages as read for current user
  if (messageIds.length > 0) {
    await supabase.from('message_reads').upsert(
      messageIds.map((message_id) => ({
        message_id,
        user_id: auth.user.id,
        read_at: new Date().toISOString(),
      })),
      { onConflict: 'message_id,user_id' },
    )
  }

  return NextResponse.json({
    ok: true,
    conversation,
    application,
    messages,
    attachments,
    reads,
    hasMore: (msgs || []).length >= limit,
  })
}
