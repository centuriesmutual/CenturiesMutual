import { NextResponse, type NextRequest } from 'next/server'
import { requireAdmin, adminEmails } from '@/lib/admin/access'
import { createServiceClient } from '@/lib/supabase/admin'
import { jsonError } from '@/lib/supabase/auth-helpers'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

async function seedDemoMailbox(userId: string, userEmail: string | null) {
  const supabase = createServiceClient()
  const { count } = await supabase
    .from('office_mailbox_threads')
    .select('id', { count: 'exact', head: true })

  if ((count ?? 0) > 0) return

  const demos = [
    {
      subject: 'Welcome to Centuries Mutual Office Mail',
      body: 'This is a sample inbox message. Use Mailbox for internal staff notes, handoffs, and quick questions — customers never see these threads.',
      from: 'office@centuriesmutual.com',
    },
    {
      subject: 'Coverage start checklist — this week',
      body: 'Reminder: confirm binder docs and effective dates for any cases closing this week. Reply here if you need underwriting support.',
      from: 'operations@centuriesmutual.com',
    },
  ]

  for (const demo of demos) {
    const { data: thread } = await supabase
      .from('office_mailbox_threads')
      .insert({
        subject: demo.subject,
        created_by: userId,
      })
      .select('*')
      .single()

    if (!thread) continue

    await supabase.from('office_mailbox_participants').upsert(
      {
        thread_id: thread.id,
        user_id: userId,
        email: userEmail,
      },
      { onConflict: 'thread_id,user_id' },
    )

    await supabase.from('office_mailbox_messages').insert({
      thread_id: thread.id,
      sender_id: null,
      sender_email: demo.from,
      body: demo.body,
    })
  }
}

/** GET — mailbox threads + contacts (optional q search). */
export async function GET(req: NextRequest) {
  const auth = await requireAdmin()
  if (auth.error) return auth.error

  const q = (req.nextUrl.searchParams.get('q') || '').trim().toLowerCase()
  const supabase = createServiceClient()

  await seedDemoMailbox(auth.user.id, auth.user.email ?? null)

  const { data: threads, error } = await supabase
    .from('office_mailbox_threads')
    .select('*')
    .order('updated_at', { ascending: false })
    .limit(80)

  if (error) return jsonError(error.message, 500)

  const enriched = await Promise.all(
    (threads || []).map(async (t) => {
      const { data: msgs } = await supabase
        .from('office_mailbox_messages')
        .select('*')
        .eq('thread_id', t.id)
        .order('created_at', { ascending: false })
        .limit(1)
      const last = msgs?.[0] || null
      return { ...t, lastMessage: last }
    }),
  )

  const filtered = q
    ? enriched.filter((t) => {
        const hay = [t.subject, t.lastMessage?.body, t.lastMessage?.sender_email]
          .filter(Boolean)
          .join(' ')
          .toLowerCase()
        return hay.includes(q)
      })
    : enriched

  const contactSet = new Map<string, { email: string; name: string }>()
  for (const email of adminEmails()) {
    contactSet.set(email, {
      email,
      name: email.split('@')[0] || email,
    })
  }
  for (const t of enriched) {
    const sender = t.lastMessage?.sender_email
    if (sender) {
      const e = String(sender).toLowerCase()
      if (!contactSet.has(e)) {
        contactSet.set(e, { email: e, name: e.split('@')[0] || e })
      }
    }
  }
  const { data: participants } = await supabase
    .from('office_mailbox_participants')
    .select('email')
    .limit(100)
  for (const p of participants || []) {
    if (!p.email) continue
    const e = String(p.email).toLowerCase()
    if (!contactSet.has(e)) {
      contactSet.set(e, { email: e, name: e.split('@')[0] || e })
    }
  }

  for (const sample of [
    { email: 'office@centuriesmutual.com', name: 'Office Desk' },
    { email: 'operations@centuriesmutual.com', name: 'Operations' },
    { email: 'producers@centuriesmutual.com', name: 'Producer Support' },
  ]) {
    if (!contactSet.has(sample.email)) contactSet.set(sample.email, sample)
  }

  return NextResponse.json({
    ok: true,
    threads: filtered,
    contacts: Array.from(contactSet.values()).sort((a, b) => a.name.localeCompare(b.name)),
  })
}

/** POST — create a thread with first message (toEmail required). */
export async function POST(req: NextRequest) {
  const auth = await requireAdmin()
  if (auth.error) return auth.error

  let body: { subject?: string; body?: string; toEmail?: string }
  try {
    body = (await req.json()) as typeof body
  } catch {
    return jsonError('Invalid JSON body.')
  }

  const text = body.body?.trim()
  if (!text) return jsonError('Message body is required.', 400)
  const toEmail = body.toEmail?.trim().toLowerCase()
  if (!toEmail) return jsonError('Recipient email is required.', 400)

  const supabase = createServiceClient()
  const { data: users } = await supabase.auth.admin.listUsers({ perPage: 200 })
  const recipient = users?.users?.find((u) => u.email?.toLowerCase() === toEmail)

  const { data: thread, error: tErr } = await supabase
    .from('office_mailbox_threads')
    .insert({
      subject: body.subject?.trim() || '(no subject)',
      created_by: auth.user.id,
    })
    .select('*')
    .single()

  if (tErr || !thread) return jsonError(tErr?.message || 'Could not create thread.', 500)

  const participants = [
    { thread_id: thread.id, user_id: auth.user.id, email: auth.user.email ?? null },
  ]
  if (recipient?.id && recipient.id !== auth.user.id) {
    participants.push({
      thread_id: thread.id,
      user_id: recipient.id,
      email: recipient.email ?? toEmail,
    })
  }

  await supabase.from('office_mailbox_participants').upsert(participants, {
    onConflict: 'thread_id,user_id',
  })

  const { data: message, error: mErr } = await supabase
    .from('office_mailbox_messages')
    .insert({
      thread_id: thread.id,
      sender_id: auth.user.id,
      sender_email: auth.user.email ?? null,
      body: text,
    })
    .select('*')
    .single()

  if (mErr) return jsonError(mErr.message, 500)

  await supabase
    .from('office_mailbox_threads')
    .update({ updated_at: new Date().toISOString() })
    .eq('id', thread.id)

  return NextResponse.json({ ok: true, thread, message }, { status: 201 })
}
