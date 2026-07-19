import { NextResponse, type NextRequest } from 'next/server'
import { requireAdmin, adminEmails } from '@/lib/admin/access'
import { createServiceClient } from '@/lib/supabase/admin'
import { jsonError } from '@/lib/supabase/auth-helpers'
import {
  ensureMember,
  notifyConversationMembers,
  postUserMessage,
  staffRoleFromEmail,
  type MessageType,
  type StaffRole,
} from '@/lib/conversations/server'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

type Ctx = { params: { id: string } }

const MESSAGE_TYPES: MessageType[] = ['user', 'system', 'status', 'assignment', 'note']

/** POST — send a message (and optional attachment metadata). */
export async function POST(req: NextRequest, ctx: Ctx) {
  const auth = await requireAdmin()
  if (auth.error) return auth.error

  const id = ctx.params.id
  if (!id) return jsonError('Conversation id required.', 400)

  let body: {
    message?: string
    messageType?: string
    attachment?: {
      storagePath: string
      filename: string
      size: number
      mimeType: string
    }
  }
  try {
    body = (await req.json()) as typeof body
  } catch {
    return jsonError('Invalid JSON body.')
  }

  const text = typeof body.message === 'string' ? body.message.trim() : ''
  if (!text && !body.attachment) {
    return jsonError('Message or attachment is required.', 400)
  }

  const role = staffRoleFromEmail(auth.user.email, adminEmails()) as StaffRole
  await ensureMember(id, auth.user.id, role)

  const messageType = MESSAGE_TYPES.includes(body.messageType as MessageType)
    ? (body.messageType as MessageType)
    : 'user'

  const msg = await postUserMessage({
    conversationId: id,
    senderId: auth.user.id,
    senderRole: role,
    message: text || (body.attachment ? `Attached ${body.attachment.filename}` : ''),
    messageType,
  })

  if (!msg) return jsonError('Could not send message.', 500)

  const supabase = createServiceClient()
  let attachment = null
  if (body.attachment?.storagePath) {
    const { data: att, error } = await supabase
      .from('attachments')
      .insert({
        message_id: msg.id,
        storage_path: body.attachment.storagePath,
        filename: body.attachment.filename,
        size: body.attachment.size || 0,
        mime_type: body.attachment.mimeType || 'application/octet-stream',
      })
      .select('*')
      .single()
    if (error) return jsonError(error.message, 500)
    attachment = att
  }

  const { data: convo } = await supabase
    .from('conversations')
    .select('application_id, title')
    .eq('id', id)
    .maybeSingle()

  const mentionEmails = Array.from(
    text.matchAll(/@([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/g),
  ).map((m) => m[1].toLowerCase())

  await notifyConversationMembers({
    conversationId: id,
    applicationId: convo?.application_id,
    excludeUserId: auth.user.id,
    type: mentionEmails.length ? 'mention' : 'new_message',
    title: convo?.title || 'Application conversation',
    body: text.slice(0, 180),
  })

  return NextResponse.json({ ok: true, message: msg, attachment }, { status: 201 })
}
