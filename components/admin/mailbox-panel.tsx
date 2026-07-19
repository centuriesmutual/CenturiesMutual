'use client'

import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Inbox, Users, PenSquare, Send, Search } from 'lucide-react'

type Thread = {
  id: string
  subject: string
  updated_at: string
  lastMessage?: {
    body: string
    sender_email?: string | null
    created_at: string
  } | null
}

type Message = {
  id: string
  body: string
  sender_email: string | null
  created_at: string
  sender_id: string | null
}

type Contact = {
  email: string
  name: string
}

type MailView = 'inbox' | 'contacts'

const displayFont = {
  fontFamily: 'var(--font-display, "Iowan Old Style", "Palatino Linotype", Palatino, serif)',
}

function fmt(iso: string) {
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return ''
  return d.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

function initials(name: string) {
  const parts = name.trim().split(/[\s.@_-]+/).filter(Boolean)
  return ((parts[0]?.[0] || '') + (parts[1]?.[0] || '')).toUpperCase() || '?'
}

export function MailboxPanel({ actorEmail }: { actorEmail: string | null }) {
  const [view, setView] = useState<MailView>('inbox')
  const [query, setQuery] = useState('')
  const [threads, setThreads] = useState<Thread[]>([])
  const [contacts, setContacts] = useState<Contact[]>([])
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [subject, setSubject] = useState('')
  const [draft, setDraft] = useState('')
  const [toEmail, setToEmail] = useState('')
  const [composeOpen, setComposeOpen] = useState(false)
  const [sending, setSending] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)

  const loadThreads = useCallback(async () => {
    const qs = query.trim() ? `?q=${encodeURIComponent(query.trim())}` : ''
    const res = await fetch(`/api/admin/mailbox${qs}`)
    const data = await res.json().catch(() => ({}))
    if (res.ok && data?.ok) {
      setThreads(data.threads || [])
      setContacts(data.contacts || [])
    }
  }, [query])

  const loadThread = useCallback(async (id: string) => {
    const res = await fetch(`/api/admin/mailbox/${id}`)
    const data = await res.json().catch(() => ({}))
    if (res.ok && data?.ok) {
      setMessages(data.messages || [])
      requestAnimationFrame(() => bottomRef.current?.scrollIntoView({ behavior: 'smooth' }))
    }
  }, [])

  useEffect(() => {
    void loadThreads()
  }, [loadThreads])

  useEffect(() => {
    if (selectedId) void loadThread(selectedId)
  }, [selectedId, loadThread])

  useEffect(() => {
    const supabase = createClient()
    const channel = supabase
      .channel('office-mailbox')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'office_mailbox_messages' },
        (payload) => {
          const row = payload.new as Message & { thread_id: string }
          if (selectedId && row.thread_id === selectedId) {
            setMessages((prev) => (prev.some((m) => m.id === row.id) ? prev : [...prev, row]))
            requestAnimationFrame(() => bottomRef.current?.scrollIntoView({ behavior: 'smooth' }))
          }
          void loadThreads()
        },
      )
      .subscribe()
    return () => {
      void supabase.removeChannel(channel)
    }
  }, [selectedId, loadThreads])

  const sendReply = async () => {
    if (!selectedId || !draft.trim() || sending) return
    setSending(true)
    try {
      const res = await fetch(`/api/admin/mailbox/${selectedId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ body: draft.trim() }),
      })
      const data = await res.json().catch(() => ({}))
      if (res.ok && data?.message) {
        setDraft('')
        setMessages((prev) =>
          prev.some((m) => m.id === data.message.id) ? prev : [...prev, data.message],
        )
      }
    } finally {
      setSending(false)
    }
  }

  const createThread = async () => {
    if (!draft.trim() || !toEmail.trim() || sending) return
    setSending(true)
    try {
      const res = await fetch('/api/admin/mailbox', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subject: subject.trim() || '(no subject)',
          body: draft.trim(),
          toEmail: toEmail.trim(),
        }),
      })
      const data = await res.json().catch(() => ({}))
      if (res.ok && data?.thread) {
        setComposeOpen(false)
        setSubject('')
        setToEmail('')
        setDraft('')
        setView('inbox')
        await loadThreads()
        setSelectedId(data.thread.id)
      }
    } finally {
      setSending(false)
    }
  }

  const openCompose = (email = '') => {
    setComposeOpen(true)
    setSelectedId(null)
    setDraft('')
    setSubject('')
    setToEmail(email)
    setView('inbox')
  }

  const selected = threads.find((t) => t.id === selectedId) ?? null
  const filteredContacts = query.trim()
    ? contacts.filter((c) => {
        const hay = `${c.name} ${c.email}`.toLowerCase()
        return hay.includes(query.trim().toLowerCase())
      })
    : contacts

  const navBtn = (id: MailView, label: string, icon: ReactNode, count?: number) => {
    const active = view === id && !composeOpen
    return (
      <button
        type="button"
        onClick={() => {
          setView(id)
          setComposeOpen(false)
          if (id === 'contacts') setSelectedId(null)
        }}
        className={`flex w-full items-center gap-3 rounded-r-full border-0 px-4 py-2.5 text-left font-sans text-[0.8125rem] font-medium transition ${
          active
            ? 'bg-[#0F3D2E]/12 font-semibold text-[#0F3D2E]'
            : 'bg-transparent text-[#55655D] hover:bg-[#0F3D2E]/[0.06] hover:text-[#0F3D2E]'
        }`}
      >
        <span className="inline-flex h-5 w-5 shrink-0 items-center justify-center">{icon}</span>
        <span className="flex-1 truncate">{label}</span>
        {typeof count === 'number' ? (
          <span className="font-sans text-[0.6875rem] tabular-nums text-[#55655D]">{count}</span>
        ) : null}
      </button>
    )
  }

  return (
    <div className="flex h-full min-h-0 flex-col overflow-hidden bg-[#F7F3EE]">
      <div className="flex shrink-0 flex-wrap items-center justify-between gap-2 border-b border-[#0F3D2E]/10 px-3 py-2.5 sm:px-4">
        <div>
          <p className="m-0 font-sans text-[0.625rem] font-semibold uppercase tracking-[0.14em] text-[#C9A961]">
            Mailbox
          </p>
          <h2 className="m-0 mt-0.5 font-medium text-[#0F3D2E]" style={{ ...displayFont, fontSize: '1.15rem' }}>
            Company Exchange
          </h2>
        </div>
        <div className="relative flex min-w-[12rem] flex-1 items-center sm:max-w-xs sm:flex-none">
          <Search className="pointer-events-none absolute left-2.5 h-3.5 w-3.5 text-[#55655D]" strokeWidth={2.25} />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={view === 'contacts' ? 'Search contacts…' : 'Search mail…'}
            className="w-full rounded-full border border-[#0F3D2E]/15 bg-[#E8DFD6] py-1.5 pl-8 pr-3 font-sans text-[0.75rem] text-[#0F3D2E] outline-none focus:border-[#0F3D2E]"
          />
        </div>
      </div>

      <div className="grid min-h-0 flex-1 grid-cols-1 lg:grid-cols-[200px_minmax(240px,0.36fr)_minmax(0,1fr)]">
        {/* Gmail-style nav */}
        <nav className="flex min-h-0 flex-col gap-1 border-b border-[#0F3D2E]/10 bg-[#F7F3EE] p-2 lg:border-b-0 lg:border-r lg:border-[#0F3D2E]/10">
          <button
            type="button"
            onClick={() => openCompose()}
            className="mb-2 flex w-full items-center justify-center gap-2 rounded-full border-0 bg-[#0F3D2E] px-4 py-2.5 font-sans text-[0.8125rem] font-semibold text-[#E8DFD6] shadow-[0_1px_2px_rgba(15,61,46,0.2)] transition hover:bg-[#0A2E22]"
          >
            <PenSquare className="h-4 w-4" strokeWidth={2.25} />
            Compose
          </button>
          {navBtn('inbox', 'Inbox', <Inbox className="h-4 w-4" strokeWidth={2.25} />, threads.length)}
          {navBtn('contacts', 'Contacts', <Users className="h-4 w-4" strokeWidth={2.25} />, contacts.length)}
          {actorEmail ? (
            <p className="mt-auto truncate px-4 pb-2 pt-4 font-sans text-[0.625rem] text-[#55655D]">
              {actorEmail}
            </p>
          ) : null}
        </nav>

        {/* List pane */}
        <aside className="min-h-0 overflow-y-auto border-b border-[#0F3D2E]/10 bg-white lg:border-b-0 lg:border-r lg:border-[#0F3D2E]/10">
          {view === 'contacts' && !composeOpen ? (
            filteredContacts.length === 0 ? (
              <p className="m-0 px-4 py-6 font-sans text-[0.8125rem] text-[#55655D]">No contacts found.</p>
            ) : (
              <ul className="m-0 list-none divide-y divide-[#0F3D2E]/08 p-0">
                {filteredContacts.map((c) => (
                  <li key={c.email}>
                    <button
                      type="button"
                      onClick={() => openCompose(c.email)}
                      className="flex w-full items-center gap-3 border-0 bg-transparent px-3 py-3 text-left transition hover:bg-[#F7F3EE]"
                    >
                      <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#0F3D2E]/10 font-sans text-[0.6875rem] font-bold text-[#0F3D2E]">
                        {initials(c.name)}
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block truncate font-sans text-[0.8125rem] font-semibold text-[#0F3D2E]">
                          {c.name}
                        </span>
                        <span className="block truncate font-sans text-[0.6875rem] text-[#55655D]">
                          {c.email}
                        </span>
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            )
          ) : threads.length === 0 ? (
            <p className="m-0 px-4 py-6 font-sans text-[0.8125rem] text-[#55655D]">No messages yet.</p>
          ) : (
            <ul className="m-0 list-none divide-y divide-[#0F3D2E]/08 p-0">
              {threads.map((t) => {
                const active = selectedId === t.id && !composeOpen
                return (
                  <li key={t.id}>
                    <button
                      type="button"
                      onClick={() => {
                        setComposeOpen(false)
                        setView('inbox')
                        setSelectedId(t.id)
                      }}
                      className={`flex w-full flex-col border-0 px-3 py-3 text-left transition ${
                        active ? 'bg-[#E8DFD6]' : 'bg-transparent hover:bg-[#F7F3EE]'
                      }`}
                    >
                      <span className="flex items-baseline justify-between gap-2">
                        <span className="truncate font-sans text-[0.8125rem] font-semibold text-[#0F3D2E]">
                          {t.lastMessage?.sender_email || 'Staff'}
                        </span>
                        <span className="shrink-0 font-sans text-[0.5625rem] text-[#55655D]">
                          {fmt(t.updated_at)}
                        </span>
                      </span>
                      <span className="mt-0.5 truncate font-sans text-[0.75rem] font-medium text-[#0F3D2E]">
                        {t.subject}
                      </span>
                      <span className="mt-0.5 truncate font-sans text-[0.6875rem] text-[#55655D]">
                        {t.lastMessage?.body || '—'}
                      </span>
                    </button>
                  </li>
                )
              })}
            </ul>
          )}
        </aside>

        {/* Reading / compose pane */}
        <section className="flex min-h-0 flex-col bg-[#FAFCFB] p-3 sm:p-4">
          {composeOpen ? (
            <div className="flex min-h-0 flex-1 flex-col gap-2">
              <p className="m-0 font-sans text-[0.625rem] font-semibold uppercase tracking-[0.12em] text-[#C9A961]">
                New message
              </p>
              <input
                value={toEmail}
                onChange={(e) => setToEmail(e.target.value)}
                placeholder="To"
                className="rounded-[10px] border border-[#0F3D2E]/15 bg-white px-3 py-2 font-sans text-[0.8125rem] text-[#0F3D2E] outline-none"
              />
              <input
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="Subject"
                className="rounded-[10px] border border-[#0F3D2E]/15 bg-white px-3 py-2 font-sans text-[0.8125rem] text-[#0F3D2E] outline-none"
              />
              <textarea
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                placeholder="Write your message…"
                className="min-h-[160px] flex-1 resize-none rounded-[12px] border border-[#0F3D2E]/15 bg-white px-3 py-2 font-sans text-[0.875rem] text-[#0F3D2E] outline-none"
              />
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setComposeOpen(false)}
                  className="rounded-[8px] border-0 bg-transparent px-3 py-1.5 font-sans text-[0.75rem] font-semibold text-[#55655D]"
                >
                  Discard
                </button>
                <button
                  type="button"
                  disabled={sending || !draft.trim() || !toEmail.trim()}
                  onClick={() => void createThread()}
                  className="inline-flex items-center gap-1.5 rounded-full border-0 bg-[#0F3D2E] px-4 py-1.5 font-sans text-[0.75rem] font-semibold text-[#E8DFD6] disabled:opacity-45"
                >
                  <Send className="h-3.5 w-3.5" strokeWidth={2.25} />
                  Send
                </button>
              </div>
            </div>
          ) : view === 'contacts' ? (
            <div className="flex flex-1 flex-col items-center justify-center text-center">
              <Users className="mb-2 h-8 w-8 text-[#0F3D2E]/40" strokeWidth={1.75} />
              <p className="m-0 font-sans text-[0.875rem] text-[#55655D]">
                Select a contact to compose a message.
              </p>
            </div>
          ) : !selected ? (
            <div className="flex flex-1 flex-col items-center justify-center text-center">
              <Inbox className="mb-2 h-8 w-8 text-[#0F3D2E]/40" strokeWidth={1.75} />
              <p className="m-0 font-sans text-[0.875rem] text-[#55655D]">
                Select a conversation to read.
              </p>
            </div>
          ) : (
            <>
              <div className="mb-3 shrink-0 border-b border-[#0F3D2E]/08 pb-3">
                <h3 className="m-0 font-medium text-[#0F3D2E]" style={{ ...displayFont, fontSize: '1.2rem' }}>
                  {selected.subject}
                </h3>
              </div>
              <div className="min-h-0 flex-1 space-y-3 overflow-y-auto">
                {messages.map((m) => {
                  const mine =
                    Boolean(actorEmail) &&
                    (m.sender_email || '').toLowerCase() === actorEmail!.toLowerCase()
                  return (
                    <div
                      key={m.id}
                      className={`flex ${mine ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[min(100%,28rem)] rounded-[14px] px-3 py-2.5 ${
                          mine
                            ? 'bg-[#0F3D2E] text-[#E8DFD6]'
                            : 'border border-[#0F3D2E]/10 bg-[#E8DFD6] text-[#0F3D2E]'
                        }`}
                      >
                        <div className={`flex items-center gap-2 ${mine ? 'flex-row-reverse' : ''}`}>
                          <span
                            className={`inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full font-sans text-[0.625rem] font-bold ${
                              mine
                                ? 'bg-[#E8DFD6]/20 text-[#E8DFD6]'
                                : 'bg-[#0F3D2E]/10 text-[#0F3D2E]'
                            }`}
                          >
                            {initials(m.sender_email || 'Staff')}
                          </span>
                          <div className={`min-w-0 flex-1 ${mine ? 'text-right' : ''}`}>
                            <p
                              className={`m-0 truncate font-sans text-[0.8125rem] font-semibold ${
                                mine ? 'text-[#E8DFD6]' : 'text-[#0F3D2E]'
                              }`}
                            >
                              {mine ? 'You' : m.sender_email || 'Staff'}
                            </p>
                            <p
                              className={`m-0 font-sans text-[0.625rem] ${
                                mine ? 'text-[#E8DFD6]/70' : 'text-[#55655D]'
                              }`}
                            >
                              {fmt(m.created_at)}
                            </p>
                          </div>
                        </div>
                        <p
                          className={`m-0 mt-2 whitespace-pre-wrap font-sans text-[0.875rem] leading-relaxed ${
                            mine ? 'text-[#E8DFD6]' : 'text-[#0F3D2E]'
                          }`}
                        >
                          {m.body}
                        </p>
                      </div>
                    </div>
                  )
                })}
                <div ref={bottomRef} />
              </div>
              <div className="mt-3 flex shrink-0 items-end gap-2 border-t border-[#0F3D2E]/08 pt-3">
                <textarea
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  rows={2}
                  placeholder="Reply…"
                  className="min-h-[44px] flex-1 resize-none rounded-[12px] border border-[#0F3D2E]/15 bg-white px-3 py-2 font-sans text-[0.875rem] text-[#0F3D2E] outline-none"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault()
                      void sendReply()
                    }
                  }}
                />
                <button
                  type="button"
                  disabled={!draft.trim() || sending}
                  onClick={() => void sendReply()}
                  className="inline-flex h-11 w-11 items-center justify-center rounded-full border-0 bg-[#0F3D2E] text-[#E8DFD6] disabled:opacity-45"
                  aria-label="Send"
                >
                  <Send className="h-4 w-4" strokeWidth={2.25} />
                </button>
              </div>
            </>
          )}
        </section>
      </div>
    </div>
  )
}
