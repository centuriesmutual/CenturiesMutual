import type { Metadata } from 'next'
import { TreasuryPageView } from '@/components/rewards-pay/treasury-page'

export const metadata: Metadata = {
  title: 'Rewards Wallet',
  description:
    'Attach a Centuries Mutual healthcare rewards wallet — earn on eligible activity with a clear member ledger.',
}

export default function RewardsWalletPage() {
  return <TreasuryPageView />
}
