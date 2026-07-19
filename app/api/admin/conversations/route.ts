import { NextResponse, type NextRequest } from 'next/server'
import { requireAdmin, adminEmails } from '@/lib/admin/access'
import { createServiceClient } from '@/lib/supabase/admin'
import { jsonError } from '@/lib/supabase/auth-helpers'
import {
  ensureApplicationConversation,
  ensureMember,
  notifyConversationMembers,
  postUserMessage,
  staffRoleFromEmail,
  type MessageRow,
} from '@/lib/conversations/server'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

/** GET — recent application conversations for Office dashboard panel. */
export async function GET(req: NextRequest) {
  const auth = await requireAdmin()
  if (auth.error) return auth.error

  const supabase = createServiceClient()
  const limit = Math.min(Number(req.nextUrl.searchParams.get('limit') || 12), 40)

  // Ensure current admin is a member of recent threads (Realtime + RLS).
  const { data: convos } = await supabase
    .from('conversations')
    .select('*')
    .is('archived_at', null)
    .order('updated_at', { ascending: false })
    .limit(limit)

  let list = convos || []

  // Backfill threads for recent applications if the panel is empty.
  if (list.length === 0) {
    const { data: apps } = await supabase
      .from('insurance_applications')
      .select('id, created_at')
      .order('created_at', { ascending: false })
      .limit(8)
    for (const app of apps || []) {
      await ensureApplicationConversation({
        applicationId: app.id,
        createdAt: app.created_at,
        systemMessage: 'Application submitted',
      })
    }
    const { data: again } = await supabase
      .from('conversations')
      .select('*')
      .is('archived_at', null)
      .order('updated_at', { ascending: false })
      .limit(limit)
    list = again || []
  }
  for (const c of list) {
    await ensureMember(
      c.id,
      auth.user.id,
      staffRoleFromEmail(auth.user.email, adminEmails()),
    )
  }

  const enriched = await Promise.all(
    list.map(async (c) => {
      const { data: msgs } = await supabase
        .from('messages')
        .select('*')
        .eq('conversation_id', c.id)
        .order('created_at', { ascending: false })
        .limit(5)

      const messages = ((msgs || []) as MessageRow[]).slice().reverse()

      let unread = 0
      const { data: allIds } = await supabase
        .from('messages')
        .select('id')
        .eq('conversation_id', c.id)
        .neq('sender_id', auth.user.id)

      const ids = (allIds || []).map((m) => m.id as string)
      if (ids.length > 0) {
        const { data: reads } = await supabase
          .from('message_reads')
          .select('message_id')
          .eq('user_id', auth.user.id)
          .in('message_id', ids)
        const readSet = new Set((reads || []).map((r) => r.message_id))
        unread = ids.filter((id) => !readSet.has(id)).length
      }

      let application: {
        id: string
        first_name: string
        last_name: string
        application_status: string
        email: string
      } | null = null

      if (c.application_id) {
        const { data: app } = await supabase
          .from('insurance_applications')
          .select('id, first_name, last_name, application_status, email')
          .eq('id', c.application_id)
          .maybeSingle()
        application = app
      }

      return {
        ...c,
        messages,
        unread,
        application,
      }
    }),
  )

  return NextResponse.json({ ok: true, conversations: enriched })
}

/** POST — ensure conversation for application and optionally post a directory note into the thread. */
export async function POST(req: NextRequest) {
  const auth = await requireAdmin()
  if (auth.error) return auth.error

  let body: { applicationId?: string; note?: string; createdAt?: string }
  try {
    body = (await req.json()) as typeof body
  } catch {
    return jsonError('Invalid JSON body.')
  }

  const applicationId = body.applicationId?.trim()
  if (!applicationId) return jsonError('applicationId is required.', 400)

  const role = staffRoleFromEmail(auth.user.email, adminEmails())
  const convo = await ensureApplicationConversation({
    applicationId,
    createdAt: body.createdAt,
  })
  if (!convo) return jsonError('Could not open conversation.', 500)

  await ensureMember(convo.id, auth.user.id, role)

  let message = null
  const note = typeof body.note === 'string' ? body.note.trim() : ''
  if (note) {
    message = await postUserMessage({
      conversationId: convo.id,
      senderId: auth.user.id,
      senderRole: role,
      message: note,
      messageType: 'note',
    })
    await notifyConversationMembers({
      conversationId: convo.id,
      applicationId,
      excludeUserId: auth.user.id,
      type: 'new_message',
      title: convo.title,
      body: note.slice(0, 180),
    })
  }

  return NextResponse.json({ ok: true, conversation: convo, message }, { status: 201 })
}
