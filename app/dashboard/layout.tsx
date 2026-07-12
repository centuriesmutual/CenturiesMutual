import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: {
    absolute: 'Wallet',
  },
  description: 'Centuries Mutual member wallet — rewards, coverage, and programs.',
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
