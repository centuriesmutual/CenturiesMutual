import type { Metadata } from 'next'
import { MedicareSupplementPageView } from '@/components/insurance/medicare-supplement-page'

export const metadata: Metadata = {
  title: 'Medicare Supplement',
  description:
    'Centuries Mutual Medicare Supplement (Medigap) — help fill Original Medicare gaps with clear stewardship and a simple sign-up path.',
}

export default function MedicareSupplementPage() {
  return <MedicareSupplementPageView />
}
