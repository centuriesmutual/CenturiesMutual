import { createServiceClient } from '@/lib/supabase/admin'

export type StaffRole = 'admin' | 'office' | 'producer' | 'system'
export type MessageType = 'user' | 'system' | 'status' | 'assignment' | 'note'

export type ConversationRow = {
  id: string
  application_id: string | null
  title: string
  archived_at: string | null
  created_at: string
  updated_at: string
}

export type MessageRow = {
  id: string
  conversation_id: string
  sender_id: string | null
  sender_role: StaffRole
  message: string
  message_type: MessageType
  created_at: string
  edited_at: string | null
}

function yearFrom(iso?: string | null) {
  const d = iso ? new Date(iso) : new Date()
  return Number.isNaN(d.getTime()) ? new Date().getFullYear() : d.getFullYear()
}

export async function nextConversationTitle(createdAt?: string | null) {
  const supabase = createServiceClient()
  const { data, error } = await supabase.rpc('next_application_conversation_number')
  let n = typeof data === 'number' || typeof data === 'string' ? Number(data) : NaN
  if (error || !Number.isFinite(n)) {
    n = Math.floor(Date.now() / 1000) % 100000
  }
  return `ACA-${yearFrom(createdAt)}-${String(n).padStart(5, '0')}`
}

/** Ensure a conversation exists for an application; returns the conversation row. */
export async function ensureApplicationConversation(opts: {
  applicationId: string
  createdAt?: string | null
  titleHint?: string | null
  systemMessage?: string | null
}) {
  const supabase = createServiceClient()

  const { data: existing } = await supabase
    .from('conversations')
    .select('*')
    .eq('application_id', opts.applicationId)
    .is('archived_at', null)
    .maybeSingle()

  if (existing) {
    if (opts.systemMessage) {
      await postSystemMessage(existing.id, opts.systemMessage, 'system')
    }
    return existing as ConversationRow
  }

  const title = opts.titleHint?.trim() || (await nextConversationTitle(opts.createdAt))

  const { data: created, error } = await supabase
    .from('conversations')
    .insert({
      application_id: opts.applicationId,
      title,
    })
    .select('*')
    .single()

  if (error || !created) {
    console.error('ensureApplicationConversation', error?.message)
    return null
  }

  await postSystemMessage(
    created.id,
    opts.systemMessage || 'Application created',
    'system',
  )

  return created as ConversationRow
}

export async function postSystemMessage(
  conversationId: string,
  message: string,
  messageType: MessageType = 'system',
  senderRole: StaffRole = 'system',
) {
  const supabase = createServiceClient()
  const { data, error } = await supabase
    .from('messages')
    .insert({
      conversation_id: conversationId,
      sender_id: null,
      sender_role: senderRole,
      message,
      message_type: messageType,
    })
    .select('*')
    .single()

  if (error) {
    console.error('postSystemMessage', error.message)
    return null
  }

  await supabase
    .from('conversations')
    .update({ updated_at: new Date().toISOString() })
    .eq('id', conversationId)

  return data as MessageRow
}

export async function postUserMessage(opts: {
  conversationId: string
  senderId: string
  senderRole: StaffRole
  message: string
  messageType?: MessageType
}) {
  const supabase = createServiceClient()
  const { data, error } = await supabase
    .from('messages')
    .insert({
      conversation_id: opts.conversationId,
      sender_id: opts.senderId,
      sender_role: opts.senderRole,
      message: opts.message,
      message_type: opts.messageType || 'user',
    })
    .select('*')
    .single()

  if (error) {
    console.error('postUserMessage', error.message)
    return null
  }

  await supabase
    .from('conversations')
    .update({ updated_at: new Date().toISOString() })
    .eq('id', opts.conversationId)

  return data as MessageRow
}

export async function ensureMember(
  conversationId: string,
  userId: string,
  role: StaffRole = 'admin',
) {
  const supabase = createServiceClient()
  await supabase.from('conversation_members').upsert(
    {
      conversation_id: conversationId,
      user_id: userId,
      role,
    },
    { onConflict: 'conversation_id,user_id' },
  )
}

export async function notifyConversationMembers(opts: {
  conversationId: string
  applicationId?: string | null
  excludeUserId?: string | null
  type: string
  title: string
  body?: string
}) {
  const supabase = createServiceClient()
  const { data: members } = await supabase
    .from('conversation_members')
    .select('user_id')
    .eq('conversation_id', opts.conversationId)

  const rows = (members || [])
    .map((m) => m.user_id as string)
    .filter((id) => id && id !== opts.excludeUserId)
    .map((user_id) => ({
      user_id,
      type: opts.type,
      title: opts.title,
      body: opts.body || null,
      conversation_id: opts.conversationId,
      application_id: opts.applicationId || null,
    }))

  if (rows.length === 0) return
  await supabase.from('staff_notifications').insert(rows)
}

export async function archiveConversationForApplication(applicationId: string) {
  const supabase = createServiceClient()
  await supabase
    .from('conversations')
    .update({ archived_at: new Date().toISOString() })
    .eq('application_id', applicationId)
    .is('archived_at', null)
}

export function staffRoleFromEmail(
  email: string | null | undefined,
  adminEmails: string[],
): StaffRole {
  const e = (email || '').toLowerCase()
  if (e && adminEmails.includes(e)) return 'admin'
  return 'office'
}

export function conversationTitleForApp(app: {
  id: string
  created_at?: string
  plan_type?: string | null
  source?: string | null
}) {
  const year = yearFrom(app.created_at)
  const hex = app.id.replace(/-/g, '').slice(0, 5)
  const n = (parseInt(hex, 16) % 100000).toString().padStart(5, '0')
  return `ACA-${year}-${n}`
}
