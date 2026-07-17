import type { Metadata } from 'next'
import { DentalPageView } from '@/components/insurance/dental-page'

export const metadata: Metadata = {
  title: 'Dental & Vision',
  description:
    'Centuries Mutual Dental & Vision — preventive and restorative dental benefits, routine eye exams, and lens allowances with a clear member sign-up flow.',
}

export default function DentalPage() {
  return <DentalPageView />
}
