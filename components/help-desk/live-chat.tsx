'use client'

import { useEffect, useRef, useState, type FormEvent } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import {
  PaperAirplaneIcon,
  ShieldExclamationIcon,
  SparklesIcon,
} from '@heroicons/react/24/outline'

type ChatRole = 'assistant' | 'user'

type ChatMessage = {
  id: string
  role: ChatRole
  text: string
}

const INTRO_MESSAGE: ChatMessage = {
  id: 'intro',
  role: 'assistant',
  text: "Hi, I'm Aria — the Centuries Mutual virtual assistant. Ask me about coverage, rewards, documents, or wellness apps and I'll point you to the right steward. How can I help today?",
}

const CANNED_REPLIES: ReadonlyArray<string> = [
  "Thanks for that — I've noted the details. A member services specialist will follow up on this thread within one to two U.S. business days.",
  "Got it. Based on what you described, this routes to our coverage stewards. Keep your member ID and plan type handy and a specialist will pick it up shortly.",
  "Understood. I've flagged this for the rewards & pay team. If a credit looks stuck, the transaction timestamp helps them trace it faster.",
  "I hear you. I'm escalating this to a human steward so nothing gets missed. You'll see a reply here and by email if you're signed in.",
]

let replyCursor = 0

function nextCannedReply(): string {
  const reply = CANNED_REPLIES[replyCursor % CANNED_REPLIES.length]
  replyCursor += 1
  return reply
}

function createId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
}

export function LiveChat() {
  const [messages, setMessages] = useState<ReadonlyArray<ChatMessage>>([
    INTRO_MESSAGE,
  ])
  const [draft, setDraft] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const threadRef = useRef<HTMLDivElement>(null)
  const typingTimeout = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    const node = threadRef.current
    if (node) {
      node.scrollTop = node.scrollHeight
    }
  }, [messages, isTyping])

  useEffect(() => {
    return () => {
      if (typingTimeout.current) {
        clearTimeout(typingTimeout.current)
      }
    }
  }, [])

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const trimmed = draft.trim()
    if (!trimmed || isTyping) {
      return
    }

    const userMessage: ChatMessage = {
      id: createId(),
      role: 'user',
      text: trimmed,
    }

    setMessages((prev) => [...prev, userMessage])
    setDraft('')
    setIsTyping(true)

    typingTimeout.current = setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        { id: createId(), role: 'assistant', text: nextCannedReply() },
      ])
      setIsTyping(false)
    }, 1400)
  }

  return (
    <div className="flex h-full min-h-[30rem] flex-col overflow-hidden rounded-[18px] border border-[#E8EBEA] bg-[#FAFCFB] shadow-[0_12px_40px_-24px_rgba(15,61,46,0.55)]">
      <div className="flex items-center gap-3 border-b border-[#E8EBEA] bg-[#0F3D2E] px-5 py-4">
        <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#C9A53E]/20 text-[#C9A53E]">
          <SparklesIcon className="h-5 w-5" aria-hidden />
        </span>
        <div className="min-w-0">
          <p
            className="m-0 truncate text-[1.05rem] font-medium leading-tight text-[#FAFCFB]"
            style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
          >
            Real-Time Support
          </p>
          <p className="m-0 flex items-center gap-1.5 text-[0.7rem] font-semibold uppercase tracking-[0.14em] text-[#FAFCFB]/70">
            <span
              className="inline-block h-2 w-2 rounded-full bg-[#4ADE80]"
              aria-hidden
            />
            Aria · AI assistant
          </p>
        </div>
      </div>

      <div
        ref={threadRef}
        className="flex-1 space-y-4 overflow-y-auto bg-[#F4F1EC] px-5 py-5"
      >
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${
              message.role === 'user' ? 'justify-end' : 'justify-start'
            }`}
          >
            <div
              className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-[0.9rem] leading-[1.5] ${
                message.role === 'user'
                  ? 'rounded-br-sm bg-[#0F3D2E] text-[#FAFCFB]'
                  : 'rounded-bl-sm border border-[#E8EBEA] bg-[#FAFCFB] text-[#14432A]'
              }`}
            >
              {message.text}
            </div>
          </div>
        ))}

        <AnimatePresence>
          {isTyping ? (
            <motion.div
              key="typing"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="flex justify-start"
            >
              <div className="flex items-center gap-1.5 rounded-2xl rounded-bl-sm border border-[#E8EBEA] bg-[#FAFCFB] px-4 py-3">
                {[0, 1, 2].map((dot) => (
                  <motion.span
                    key={dot}
                    className="inline-block h-2 w-2 rounded-full bg-[#55655D]"
                    animate={{ opacity: [0.3, 1, 0.3], y: [0, -3, 0] }}
                    transition={{
                      duration: 0.9,
                      repeat: Infinity,
                      ease: 'easeInOut',
                      delay: dot * 0.18,
                    }}
                  />
                ))}
              </div>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>

      <form
        onSubmit={handleSubmit}
        className="border-t border-[#E8EBEA] bg-[#FAFCFB] px-4 py-3"
      >
        <div className="flex items-end gap-2">
          <label htmlFor="help-desk-chat-input" className="sr-only">
            Message the Centuries Mutual assistant
          </label>
          <input
            id="help-desk-chat-input"
            type="text"
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            placeholder="Type your question…"
            autoComplete="off"
            className="flex-1 rounded-[10px] border border-[#E8EBEA] bg-white px-3.5 py-2.5 font-sans text-[0.9rem] text-[#14432A] outline-none transition placeholder:text-[#55655D]/70 focus:border-[#0F3D2E] focus:ring-2 focus:ring-[#0F3D2E]/15"
          />
          <button
            type="submit"
            disabled={!draft.trim() || isTyping}
            aria-label="Send message"
            className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-[10px] bg-[#0F3D2E] text-[#FAFCFB] transition hover:bg-[#0A2E22] disabled:cursor-not-allowed disabled:opacity-40"
          >
            <PaperAirplaneIcon className="h-5 w-5" aria-hidden />
          </button>
        </div>
        <p className="mt-2 flex items-center gap-1.5 text-[0.72rem] leading-snug text-[#55655D]">
          <ShieldExclamationIcon className="h-4 w-4 shrink-0 text-[#C9A53E]" aria-hidden />
          Aria is an AI assistant. Urgent coverage or security issues are
          escalated to a human steward.
        </p>
      </form>
    </div>
  )
}
