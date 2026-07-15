import type { Metadata } from 'next'
import { CompoundEarningsPageView } from '@/components/rewards-pay/compound-earnings-page'

export const metadata: Metadata = {
  title: 'Compound Earnings',
  description:
    'Member-only compounding inside Centuries Mutual — growth locked to your verified identity.',
}

export default function CompoundEarningsPage() {
  return <CompoundEarningsPageView />
}
