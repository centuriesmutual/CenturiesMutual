import type { Metadata } from 'next'
import { MedicareAdvantagePageView } from '@/components/insurance/medicare-advantage-page'

export const metadata: Metadata = {
  title: 'Medicare Advantage',
  description:
    'Centuries Mutual Medicare Advantage — all-in-one Medicare coverage with rewards, wellness, and a clear member sign-up flow.',
}

export default function MedicareAdvantagePage() {
  return <MedicareAdvantagePageView />
}
