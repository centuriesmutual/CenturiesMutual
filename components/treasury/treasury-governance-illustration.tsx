import { cn } from '@/lib/utils'

/**
 * Governance panel — formal certificate layout; policies, visibility, and accountability.
 */
export function TreasuryGovernanceIllustration({ className }: { className?: string }) {
  return (
    <figure
      className={cn(
        'relative mx-auto w-full max-w-[480px] rounded-2xl border border-[#E0D8CC] bg-[#FAF7F0] p-6 shadow-[0_20px_50px_rgba(15,51,33,0.08),0_2px_0_rgba(255,255,255,0.8)_inset] sm:p-8',
        className,
      )}
      aria-label="Illustration of Centuries Mutual governance for members"
    >
      <div className="pointer-events-none absolute inset-3 rounded-xl border border-[#C9A53E]/25 sm:inset-4" aria-hidden />

      <figcaption className="relative text-center">
        <p className="font-sans text-[10px] font-medium uppercase tracking-[0.35em] text-[#6B6B66]">Governance · member visibility</p>
        <p className="mt-4 font-sans text-[9px] font-semibold uppercase tracking-[0.42em] text-[#55655D]">
          Centuries Mutual · framework
        </p>
        <p
          className="mx-auto mt-5 max-w-[20rem] font-serif text-[1.35rem] font-medium italic leading-snug text-[#0f3321] sm:text-[1.5rem]"
          style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}
        >
          Rules worth reading aloud
        </p>

        <div className="relative mx-auto mt-7 flex h-[100px] w-full max-w-[240px] items-center justify-center text-[#B8B2A8]">
          <svg viewBox="0 0 240 100" className="h-full w-full" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
            {/* Policy → Treasury → Ledger → Member loop */}
            <path
              d="M28 50h52M96 50h48M152 50h52"
              stroke="currentColor"
              strokeWidth="0.7"
              strokeLinecap="round"
              opacity="0.4"
            />
            <path
              d="M80 28v16M120 44v28M160 28v16"
              stroke="#C9A53E"
              strokeWidth="0.85"
              strokeLinecap="round"
              opacity="0.65"
            />
            <rect x="12" y="38" width="36" height="24" rx="4" stroke="#A88332" strokeWidth="0.9" fill="rgba(201,165,62,0.08)" />
            <rect x="92" y="38" width="56" height="24" rx="4" stroke="#14432A" strokeWidth="0.9" fill="rgba(20,67,42,0.06)" />
            <rect x="172" y="38" width="56" height="24" rx="4" stroke="#A88332" strokeWidth="0.9" fill="rgba(201,165,62,0.06)" />
            <text x="30" y="54" textAnchor="middle" fill="#6B6B66" fontSize="7" fontFamily="system-ui, sans-serif">
              Policy
            </text>
            <text x="120" y="54" textAnchor="middle" fill="#6B6B66" fontSize="7" fontFamily="system-ui, sans-serif">
              Treasury
            </text>
            <text x="200" y="54" textAnchor="middle" fill="#6B6B66" fontSize="7" fontFamily="system-ui, sans-serif">
              You
            </text>
            <circle cx="120" cy="72" r="5" fill="#C9A53E" opacity="0.35" />
            <path d="M118 78c4 6 8 6 12 0" stroke="#A88332" strokeWidth="0.6" fill="none" opacity="0.6" />
          </svg>
        </div>

        <ul className="mx-auto mt-1 max-w-[17.5rem] space-y-2.5 text-left font-sans text-[11px] leading-snug text-[#3d4a41] sm:text-xs">
          {[
            'Fees, holds, and releases explained in plain language',
            'Disputes follow published steps and timeboxes',
            'Documents and messages stay tied to money movement',
            'Material rule changes are surfaced — not slipped in silently',
            'Humans on the help desk when judgment replaces automation',
          ].map((line) => (
            <li key={line} className="flex gap-2.5">
              <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full border border-[#C9A53E]/55 bg-[#C9A53E]/10">
                <svg width="10" height="10" viewBox="0 0 12 12" fill="none" aria-hidden>
                  <path d="M2.5 6L5 8.5L9.5 3.5" stroke="#A88332" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
              <span>{line}</span>
            </li>
          ))}
        </ul>

        <div className="mt-8 flex items-end justify-between gap-4 border-t border-[#E5E0D5]/90 pt-5">
          <p className="text-left font-sans text-[9px] font-semibold uppercase tracking-[0.2em] text-[#859087]">
            Accountable to members
          </p>
          <div className="relative flex h-14 w-14 shrink-0 items-center justify-center rounded-full border-2 border-[#C9A53E] bg-[linear-gradient(145deg,#E8D9A8_0%,#C9A53E_45%,#A88332_100%)] shadow-[0_4px_14px_rgba(168,131,50,0.35)]">
            <span
              className="font-serif text-sm font-bold tracking-tight text-[#0f3321]"
              style={{ fontFamily: 'Georgia, serif' }}
            >
              CM
            </span>
            <span
              className="pointer-events-none absolute -bottom-1 left-1/2 h-2 w-3 -translate-x-1/2 rounded-sm bg-[#8B2942]/90"
              aria-hidden
            />
            <span
              className="pointer-events-none absolute -bottom-1 left-[42%] h-2 w-2.5 -translate-x-1/2 rotate-6 rounded-sm bg-[#8B2942]/75"
              aria-hidden
            />
          </div>
        </div>
      </figcaption>
    </figure>
  )
}
