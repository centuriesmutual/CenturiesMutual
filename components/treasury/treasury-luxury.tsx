import { cn } from '@/lib/utils'

/** Luxury card — paper surface, hover lift + gold top bar (matches GOD spec) */
export function LuxuryCard({
  children,
  className,
  padded = true,
}: {
  children: React.ReactNode
  className?: string
  padded?: boolean
}) {
  return (
    <div
      className={cn(
        'group relative overflow-hidden rounded-2xl border border-[#E5E0D5] bg-[#FAFCFB]',
        padded && 'p-6',
        'shadow-[0_6px_24px_-4px_rgba(15,61,46,0.07)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_14px_40px_-8px_rgba(20,67,42,0.13)]',
        'before:pointer-events-none before:absolute before:inset-x-0 before:top-0 before:h-[2px] before:origin-left before:scale-x-0 before:bg-[#C9A53E] before:transition-transform before:duration-300 group-hover:before:scale-x-100',
        className,
      )}
    >
      {children}
    </div>
  )
}

export function Eyebrow({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <p
      className={cn(
        'mb-3 flex items-center gap-2 font-sans text-[0.75rem] font-medium uppercase tracking-[0.12em] text-[#C9A53E]',
        className,
      )}
    >
      <span className="inline-block h-2 w-2 rotate-45 bg-[#C9A53E]" aria-hidden />
      {children}
    </p>
  )
}

export function SectionTitle({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <h2
      className={cn(
        'font-serif text-[clamp(1.75rem,4vw,2.5rem)] font-medium leading-[1.15] tracking-[-0.02em] text-[#14432A]',
        className,
      )}
      style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
    >
      {children}
    </h2>
  )
}

export function ProseBody({ children, className }: { children: React.ReactNode; className?: string }) {
  return <p className={cn('max-w-[65ch] font-sans text-[15px] leading-[1.65] text-[#3d4a41]', className)}>{children}</p>
}
