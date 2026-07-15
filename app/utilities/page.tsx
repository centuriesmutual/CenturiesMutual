import type { Metadata } from 'next'
import { UtilitiesPageView } from '@/components/utilities/utilities-page'

export const metadata: Metadata = {
  title: 'Utilities',
  description:
    'Pay electric, water, gas, and internet from your Centuries Mutual Wallet through Paymentus — with dated receipts and rewards eligibility where program rules allow.',
}

export default function UtilitiesPage() {
  return <UtilitiesPageView />
}
