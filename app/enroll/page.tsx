import type { Metadata } from 'next'
import { AcaEnrollment } from '@/components/enrollment/aca-enrollment'

export const metadata: Metadata = {
  title: 'Enroll',
  description:
    'Enroll in ACA individual & family marketplace coverage with Centuries Mutual — confirm your enrollment period, review income for potential savings, and submit a complete application with clear disclosures.',
}

export default function EnrollPage() {
  return <AcaEnrollment />
}
