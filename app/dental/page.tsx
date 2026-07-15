import type { Metadata } from 'next'
import { DentalPageView } from '@/components/insurance/dental-page'

export const metadata: Metadata = {
  title: 'Dental',
  description:
    'Centuries Mutual Dental — preventive and restorative dental benefits with a clear member sign-up flow.',
}

export default function DentalPage() {
  return <DentalPageView />
}
