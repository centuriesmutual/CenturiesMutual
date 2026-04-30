'use client'

import { useId, useState } from 'react'
import { MinusSmallIcon, PlusSmallIcon } from '@heroicons/react/24/outline'
import { cn } from '@/lib/utils'

type Item = { q: string; a: string }

const FAQ: Item[] = [
  {
    q: 'Is the digital dollar in my wallet really worth a real dollar?',
    a: 'Yes. The balance is fully backed dollar-for-dollar against reserves held in regulated accounts — one dollar in your wallet redeemable one-to-one with the U.S. dollar whenever you withdraw.',
  },
  {
    q: 'Which network Centuries Mutual uses for settlements',
    a: 'We settle member-to-member movements on a low-cost, high-speed settlement network built for everyday payments — the same rails that finalize in seconds with transparent fees, without tying your money to speculative assets.',
  },
  {
    q: 'How much are gas and network fees?',
    a: 'Network fees are typically only a small number of cents per transfer. Those fees compensate the settlement network itself, not Centuries Mutual, and remain predictable.',
  },
  {
    q: 'Does Centuries Mutual issue a token?',
    a: 'No. Centuries Mutual does not issue a speculative trading token for members to hold or speculate with. Members hold fully-backed digital dollars alongside their agreements and messaging; platform revenue follows published flat orchestration fees and memberships.',
  },
  {
    q: 'How do I add money to my wallet?',
    a: 'Fund from your connected bank account when prompted in Treasury — the amount settles into your dollar wallet once the originating bank clears the transfer.',
  },
  {
    q: 'How do I withdraw to my bank?',
    a: 'Use Withdraw inside Treasury when your balance is settled. Typical timing mirrors standard banking ACH windows; you will see status at every stage.',
  },
  {
    q: 'What happens if a payment is late?',
    a: 'The agreement and escrow rules you signed drive structured reminders and remedies — both sides can see timelines in plain language rather than restarting with guesswork.',
  },
  {
    q: 'Can I see exactly where my money is?',
    a: 'Yes. Ledger-style activity and holdings are surfaced in Treasury with plain-English explanations and timestamps, so balances and outbound transfers are understandable without specialist training.',
  },
]

export function TreasuryFaqAccordion() {
  const [open, setOpen] = useState<number | null>(0)
  const id = useId()

  return (
    <div className="space-y-3">
      {FAQ.map((item, idx) => {
        const expanded = open === idx
        const panelId = `${id}-panel-${idx}`
        const hdrId = `${id}-header-${idx}`
        return (
          <div
            key={item.q}
            className={cn(
              'overflow-hidden rounded-2xl border border-[#E5E0D5] bg-[#FAFCFB] shadow-[0_4px_20px_-4px_rgba(15,61,46,0.06)] transition-all',
              expanded && 'ring-1 ring-[#C9A53E]/35',
            )}
          >
            <button
              type="button"
              id={hdrId}
              aria-expanded={expanded}
              aria-controls={panelId}
              className="flex w-full items-start justify-between gap-4 px-5 py-4 text-left transition hover:bg-[#FAFCFB]/95"
              onClick={() => setOpen(expanded ? null : idx)}
            >
              <span
                className="flex-1 font-serif text-base font-semibold leading-snug text-[#14432A] sm:text-[1.05rem]"
                style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
              >
                {item.q}
              </span>
              <span className="shrink-0 text-[#C9A53E]" aria-hidden>
                {expanded ? <MinusSmallIcon className="h-6 w-6" /> : <PlusSmallIcon className="h-6 w-6" />}
              </span>
            </button>
            <div
              id={panelId}
              role="region"
              aria-labelledby={hdrId}
              hidden={!expanded}
              className={cn(!expanded && 'hidden')}
            >
              <p className="border-t border-[#E5E0D5]/80 px-5 pb-4 pt-3 font-sans text-[14px] leading-[1.65] text-[#3d4a41]">
                {item.a}
              </p>
            </div>
          </div>
        )
      })}
    </div>
  )
}
