'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Paperclip, Send } from 'lucide-react'

export type ConversationPreview = {
  id: string
  title: string
  application_id: string | null
  updated_at: string
  unread: number
  messages: {
    id: string
    sender_role: string
    message: string
    message_type: string
    created_at: string
  }[]
  application: {
    id: string
    first_name: string
    last_name: string
    application_status: string
    email: string
  } | null
}

const displayFont = {
  fontFamily: 'var(--font-display, "Iowan Old Style", "Palatino Linotype", Palatino, serif)',
}

function roleLabel(role: string, messageType: string) {
  if (messageType === 'system' || messageType === 'status' || role === 'system') return 'System'
  if (role === 'admin') return 'Admin'
  if (role === 'producer') return 'Producer'
  if (role === 'office') return 'Office'
  return role
}

function fmtTime(iso: string) {
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return ''
  return d.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

function lightMarkdown(text: string) {
  const escaped = text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
  return escaped
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    .replace(/\n/g, '<br/>')
}

/** Compact panel for Office calendar aside — most recent conversation. */
export function ApplicationConversationsPanel({
  onOpen,
}: {
  onOpen: (conversationId: string) => void
}) {
  const [latest, setLatest] = useState<ConversationPreview | null>(null)
  const [loading, setLoading] = useState(true)

  const load = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/conversations?limit=1')
      const data = await res.json().catch(() => ({}))
      if (res.ok && data?.ok) {
        setLatest((data.conversations?.[0] as ConversationPreview) || null)
      }
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void load()
    const id = window.setInterval(() => void load(), 12000)
    return () => window.clearInterval(id)
  }, [load])

  useEffect(() => {
    const supabase = createClient()
    const channel = supabase
      .channel('office-conversations-panel')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'messages' },
        () => {
          void load()
        },
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'conversations' },
        () => {
          void load()
        },
      )
      .subscribe()
    return () => {
      void supabase.removeChannel(channel)
    }
  }, [load])

  return (
    <aside className="flex min-h-0 flex-col border-t border-[#0F3D2E]/10 bg-[#F7F3EE] p-3 lg:border-l lg:border-t-0">
      <p className="m-0 font-sans text-[0.625rem] font-semibold uppercase tracking-[0.14em] text-[#C9A961]">
        Application Conversations
      </p>
      {loading && !latest ? (
        <p className="m-0 mt-3 font-sans text-[0.8125rem] text-[#55655D]">Loading…</p>
      ) : !latest ? (
        <p className="m-0 mt-3 font-sans text-[0.8125rem] text-[#55655D]">
          No application threads yet. New ACA applications open a conversation automatically.
        </p>
      ) : (
        <button
          type="button"
          onClick={() => onOpen(latest.id)}
          className="mt-2 flex min-h-0 flex-1 flex-col rounded-[12px] border-0 bg-[#FAFCFB] p-3 text-left transition hover:bg-white"
        >
          <div className="flex items-start justify-between gap-2">
            <p
              className="m-0 font-medium text-[#0F3D2E]"
              style={{ ...displayFont, fontSize: '1.05rem' }}
            >
              {latest.title}
            </p>
            {latest.unread > 0 ? (
              <span className="inline-flex shrink-0 items-center rounded-full bg-[#0F3D2E] px-2 py-0.5 font-sans text-[0.625rem] font-semibold text-[#E8DFD6]">
                {latest.unread}
              </span>
            ) : null}
          </div>
          {latest.application ? (
            <p className="m-0 mt-0.5 font-sans text-[0.6875rem] text-[#55655D]">
              {latest.application.first_name} {latest.application.last_name} ·{' '}
              {latest.application.application_status.replace(/_/g, ' ')}
            </p>
          ) : null}
          <p className="m-0 mt-1 font-sans text-[0.625rem] text-[#55655D]">
            {fmtTime(latest.updated_at)}
          </p>
          <ul className="m-0 mt-2 min-h-0 flex-1 list-none space-y-2 overflow-hidden p-0">
            {latest.messages.slice(-5).map((m) => (
              <li key={m.id} className="min-w-0">
                <p className="m-0 font-sans text-[0.625rem] font-semibold uppercase tracking-[0.08em] text-[#0F3D2E]">
                  {roleLabel(m.sender_role, m.message_type)}
                </p>
                <p className="m-0 mt-0.5 truncate font-sans text-[0.75rem] leading-snug text-[#55655D]">
                  {m.message || '—'}
                </p>
              </li>
            ))}
          </ul>
          <p className="m-0 mt-2 font-sans text-[0.6875rem] font-semibold text-[#0F3D2E]">
            Open conversation →
          </p>
        </button>
      )}
    </aside>
  )
}

type FullMessage = {
  id: string
  sender_id: string | null
  sender_role: string
  message: string
  message_type: string
  created_at: string
}

/** Full conversation modal — Slack-style thread. */
export function ConversationViewModal({
  conversationId,
  onClose,
}: {
  conversationId: string
  onClose: () => void
}) {
  const [title, setTitle] = useState('')
  const [status, setStatus] = useState('')
  const [applicant, setApplicant] = useState('')
  const [messages, setMessages] = useState<FullMessage[]>([])
  const [draft, setDraft] = useState('')
  const [sending, setSending] = useState(false)
  const [hasMore, setHasMore] = useState(false)
  const [loadingMore, setLoadingMore] = useState(false)
  const [typing, setTyping] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)
  const listRef = useRef<HTMLDivElement>(null)
  const typingChannel = useRef<ReturnType<ReturnType<typeof createClient>['channel']> | null>(
    null,
  )

  const scrollToBottom = useCallback((smooth = true) => {
    bottomRef.current?.scrollIntoView({ behavior: smooth ? 'smooth' : 'auto' })
  }, [])

  const load = useCallback(
    async (opts?: { before?: string; prepend?: boolean }) => {
      const qs = new URLSearchParams({ limit: '40' })
      if (opts?.before) qs.set('before', opts.before)
      const res = await fetch(`/api/admin/conversations/${conversationId}?${qs}`)
      const data = await res.json().catch(() => ({}))
      if (!res.ok || !data?.ok) return
      setTitle(data.conversation?.title || '')
      if (data.application) {
        setApplicant(`${data.application.first_name} ${data.application.last_name}`)
        setStatus(String(data.application.application_status || '').replace(/_/g, ' '))
      }
      setHasMore(Boolean(data.hasMore))
      const next = (data.messages || []) as FullMessage[]
      if (opts?.prepend) {
        setMessages((prev) => {
          const ids = new Set(prev.map((m) => m.id))
          return [...next.filter((m) => !ids.has(m.id)), ...prev]
        })
      } else {
        setMessages(next)
        requestAnimationFrame(() => scrollToBottom(false))
      }
    },
    [conversationId, scrollToBottom],
  )

  useEffect(() => {
    void load()
  }, [load])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  useEffect(() => {
    const supabase = createClient()
    const channel = supabase
      .channel(`conversation-${conversationId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `conversation_id=eq.${conversationId}`,
        },
        (payload) => {
          const row = payload.new as FullMessage
          setMessages((prev) => (prev.some((m) => m.id === row.id) ? prev : [...prev, row]))
          requestAnimationFrame(() => scrollToBottom(true))
        },
      )
      .on('broadcast', { event: 'typing' }, (payload) => {
        const p = payload.payload as { typing?: boolean }
        setTyping(Boolean(p?.typing))
        window.setTimeout(() => setTyping(false), 2500)
      })
      .subscribe()
    typingChannel.current = channel
    return () => {
      void supabase.removeChannel(channel)
    }
  }, [conversationId, scrollToBottom])

  const loadOlder = async () => {
    if (!hasMore || loadingMore || messages.length === 0) return
    setLoadingMore(true)
    try {
      const el = listRef.current
      const prevHeight = el?.scrollHeight || 0
      await load({ before: messages[0].created_at, prepend: true })
      requestAnimationFrame(() => {
        if (el) el.scrollTop = el.scrollHeight - prevHeight
      })
    } finally {
      setLoadingMore(false)
    }
  }

  const send = async () => {
    const text = draft.trim()
    if (!text || sending) return
    setSending(true)
    try {
      const res = await fetch(`/api/admin/conversations/${conversationId}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text, messageType: 'user' }),
      })
      const data = await res.json().catch(() => ({}))
      if (res.ok && data?.message) {
        setDraft('')
        setMessages((prev) =>
          prev.some((m) => m.id === data.message.id) ? prev : [...prev, data.message],
        )
        requestAnimationFrame(() => scrollToBottom(true))
      }
    } finally {
      setSending(false)
    }
  }

  const onDraftChange = (value: string) => {
    setDraft(value)
    typingChannel.current?.send({
      type: 'broadcast',
      event: 'typing',
      payload: { typing: true },
    })
  }

  return (
    <div
      className="fixed inset-0 z-[80] flex items-end justify-center bg-[#0F3D2E]/50 p-0 sm:items-center sm:p-4"
      role="dialog"
      aria-modal="true"
      aria-label="Application conversation"
      onClick={onClose}
    >
      <div
        className="flex h-[min(92vh,720px)] w-full max-w-2xl flex-col overflow-hidden rounded-t-[18px] bg-[#F7F3EE] shadow-[0_24px_60px_rgba(15,61,46,0.35)] sm:rounded-[18px]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex shrink-0 items-start justify-between gap-3 border-b border-[#0F3D2E]/10 px-4 py-3">
          <div className="min-w-0">
            <p className="m-0 font-sans text-[0.625rem] font-semibold uppercase tracking-[0.14em] text-[#C9A961]">
              Application Conversations
            </p>
            <h2
              className="m-0 mt-0.5 truncate font-medium text-[#0F3D2E]"
              style={{ ...displayFont, fontSize: '1.25rem' }}
            >
              {title || 'Conversation'}
            </h2>
            <p className="m-0 mt-0.5 font-sans text-[0.75rem] text-[#55655D]">
              {[applicant, status].filter(Boolean).join(' · ') || 'Internal staff only'}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-[10px] border-0 bg-transparent px-2.5 py-1.5 font-sans text-[0.8125rem] font-semibold text-[#55655D] transition hover:bg-[#0F3D2E]/[0.06] hover:text-[#0F3D2E]"
          >
            Close
          </button>
        </div>

        <div ref={listRef} className="min-h-0 flex-1 space-y-3 overflow-y-auto px-4 py-4">
          {hasMore ? (
            <div className="flex justify-center">
              <button
                type="button"
                disabled={loadingMore}
                onClick={() => void loadOlder()}
                className="rounded-[8px] border-0 bg-[#E8DFD6] px-3 py-1.5 font-sans text-[0.75rem] font-semibold text-[#0F3D2E] disabled:opacity-50"
              >
                {loadingMore ? 'Loading…' : 'Load earlier messages'}
              </button>
            </div>
          ) : null}
          {messages.map((m) => {
            const isSystem =
              m.message_type === 'system' ||
              m.message_type === 'status' ||
              m.sender_role === 'system'
            return (
              <div
                key={m.id}
                className={`rounded-[12px] px-3 py-2.5 ${
                  isSystem
                    ? 'border border-[#0F3D2E]/08 bg-[#E8DFD6]/70'
                    : 'bg-white'
                }`}
              >
                <div className="flex flex-wrap items-center gap-2">
                  <span
                    className={`inline-flex rounded-full px-2 py-0.5 font-sans text-[0.5625rem] font-semibold uppercase tracking-[0.08em] ${
                      isSystem
                        ? 'bg-[#0F3D2E]/15 text-[#0F3D2E]'
                        : 'bg-[#0F3D2E] text-[#E8DFD6]'
                    }`}
                  >
                    {roleLabel(m.sender_role, m.message_type)}
                  </span>
                  {m.message_type === 'note' ? (
                    <span className="rounded-full bg-[#C9A961]/25 px-2 py-0.5 font-sans text-[0.5625rem] font-semibold uppercase tracking-[0.08em] text-[#0F3D2E]">
                      Note
                    </span>
                  ) : null}
                  <span className="font-sans text-[0.625rem] text-[#55655D]">
                    {fmtTime(m.created_at)}
                  </span>
                </div>
                <div
                  className="mt-1.5 font-sans text-[0.875rem] leading-relaxed text-[#0F3D2E]"
                  dangerouslySetInnerHTML={{ __html: lightMarkdown(m.message) }}
                />
              </div>
            )
          })}
          {typing ? (
            <p className="m-0 font-sans text-[0.75rem] italic text-[#55655D]">Someone is typing…</p>
          ) : null}
          <div ref={bottomRef} />
        </div>

        <div className="shrink-0 border-t border-[#0F3D2E]/10 bg-[#E8DFD6] px-3 py-3">
          <div className="flex items-end gap-2">
            <label className="inline-flex cursor-pointer items-center justify-center rounded-[10px] bg-transparent p-2 text-[#0F3D2E] transition hover:bg-[#0F3D2E]/[0.08]">
              <Paperclip className="h-4 w-4" strokeWidth={2.25} />
              <input
                type="file"
                className="hidden"
                accept="image/*,.pdf,.doc,.docx,.txt"
                onChange={() => {
                  // Attachments upload via storage can be wired to signed upload next;
                  // for now announce intent in composer.
                  setDraft((d) => (d ? `${d}\n[Attachment selected — upload via Storage]` : '[Attachment selected — upload via Storage]'))
                }}
              />
            </label>
            <textarea
              value={draft}
              onChange={(e) => onDraftChange(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault()
                  void send()
                }
              }}
              rows={2}
              placeholder="Message this application thread… (markdown supported)"
              className="min-h-[44px] flex-1 resize-none rounded-[12px] border border-[#0F3D2E]/15 bg-white px-3 py-2 font-sans text-[0.875rem] text-[#0F3D2E] outline-none focus:border-[#0F3D2E]/40"
            />
            <button
              type="button"
              disabled={!draft.trim() || sending}
              onClick={() => void send()}
              className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-[12px] border-0 bg-[#0F3D2E] text-[#E8DFD6] transition hover:bg-[#0A2E22] disabled:opacity-45"
              aria-label="Send"
            >
              <Send className="h-4 w-4" strokeWidth={2.25} />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
