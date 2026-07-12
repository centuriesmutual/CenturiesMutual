'use client'

import { siCoinbase, siRobinhood } from 'simple-icons'

export function CoinbaseLogo({ className = 'h-10 w-10' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden fill={`#${siCoinbase.hex}`}>
      <path d={siCoinbase.path} />
    </svg>
  )
}

export function RobinhoodLogo({ className = 'h-10 w-10' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden fill={`#${siRobinhood.hex}`}>
      <path d={siRobinhood.path} />
    </svg>
  )
}

/** Paymentus is not in simple-icons — approximate brand mark. */
export function PaymentusLogo({ className = 'h-10 w-10' }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" className={className} aria-hidden>
      <rect width="48" height="48" rx="10" fill="#0B3D91" />
      <path
        d="M12 30V18h8.2c3.4 0 5.5 1.9 5.5 4.7 0 2.9-2.2 4.8-5.6 4.8H16.6V30H12zm4.6-6.2h3.3c1.5 0 2.4-.8 2.4-2s-.9-1.9-2.4-1.9h-3.3v3.9zM28.2 30l4.1-12h4.8l4.1 12h-4.5l-.7-2.2h-4.6L30.7 30h-2.5zm6.2-5.4h2.8l-1.4-4.3-1.4 4.3z"
        fill="#fff"
      />
    </svg>
  )
}
