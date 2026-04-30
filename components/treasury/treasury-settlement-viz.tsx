'use client'

export function TreasurySettlementViz() {
  return (
    <div className="rounded-2xl border border-[#E5E0D5] bg-[#FAFCFB] p-6 shadow-[0_6px_24px_-4px_rgba(15,61,46,0.06)]">
      <div className="relative flex flex-col gap-10 sm:flex-row sm:items-start sm:justify-between sm:gap-6">
        {['Sender', 'Network', 'Recipient'].map((label) => (
          <div key={label} className="relative z-[1] flex flex-1 flex-col items-center text-center">
            <div className="mb-2 h-14 w-14 rounded-xl border border-[#E5E0D5] bg-white shadow-sm sm:h-16 sm:w-16">
              <div className="flex h-full w-full flex-col items-center justify-center rounded-xl bg-[#14432A]/[0.06] px-2">
                <span className="font-sans text-[9px] font-bold uppercase tracking-wider text-[#14432A]/90">{label}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="relative -mt-[7.25rem] hidden h-8 sm:flex sm:-mt-[4.75rem]" aria-hidden>
        <div className="relative mx-auto w-[72%]">
          <div className="h-px w-full bg-gradient-to-r from-transparent via-[#C9A53E]/60 to-transparent" />
          <div className="absolute left-[12%] top-[-3px] h-2 w-2 rounded-full bg-[#C9A53E] opacity-70 motion-safe:animate-pulse" />
          <div className="absolute left-[48%] top-[-3px] h-2 w-2 rounded-full bg-[#C9A53E] opacity-90 motion-safe:animate-[pulse_2s_ease-in-out_infinite]" />
          <div className="absolute right-[12%] top-[-3px] h-2 w-2 rounded-full bg-[#C9A53E] opacity-70 motion-safe:animate-pulse motion-safe:delay-300" />
        </div>
      </div>

      <div className="mt-10 space-y-2 rounded-xl border border-[#E5E0D5]/80 bg-white p-4 font-mono text-[11px] text-[#3d4a41] sm:mt-6">
        <div className="flex justify-between gap-4 border-b border-[#E5E0D5]/70 pb-2">
          <span>Network fee</span>
          <span className="text-[#14432A]">~$0.02</span>
        </div>
        <div className="flex justify-between gap-4 border-b border-[#E5E0D5]/70 pb-2">
          <span>Settlement time</span>
          <span className="text-[#14432A]">&lt; 10 seconds</span>
        </div>
        <div className="flex justify-between gap-4 pt-1">
          <span>Confirmation</span>
          <span className="text-[#14432A]">Final</span>
        </div>
      </div>
    </div>
  )
}
