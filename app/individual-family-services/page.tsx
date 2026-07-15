import type { Metadata } from 'next'
import { IndividualFamilyPageView } from '@/components/insurance/individual-family-page'

export const metadata: Metadata = {
  title: 'Individual & Family',
  description:
    'Centuries Mutual Individual & Family — personal health coverage with rewards, wellness, and clear stewardship for you and your household.',
}

export default function IndividualFamilyPlansPage() {
  return <IndividualFamilyPageView />
}
