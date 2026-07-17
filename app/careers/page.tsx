import type { Metadata } from 'next'
import { CareersPageView } from '@/components/careers/careers-page'

export const metadata: Metadata = {
  title: 'Careers',
  description:
    'Careers at Centuries Mutual — join a member-owned brokerage and healthcare rewards network building durable health and financial infrastructure for families and neighborhoods.',
}

export default function CareersPage() {
  return <CareersPageView />
}
