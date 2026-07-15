import type { Metadata } from 'next'
import { PayPageView } from '@/components/rewards-pay/pay-page'

export const metadata: Metadata = {
  title: 'Rent, Bills & Groceries',
  description:
    'Pay rent, household bills, and groceries from your Centuries Mutual membership ledger with dated receipts.',
}

export default function PayPage() {
  return <PayPageView />
}
