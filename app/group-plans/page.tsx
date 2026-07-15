import type { Metadata } from 'next'
import { GroupPlansPageView } from '@/components/insurance/group-plans-page'

export const metadata: Metadata = {
  title: 'Group Plans',
  description:
    'Centuries Mutual Group Plans — employer and organization health coverage with rewards, wellness, and a clear sign-up path for admins and employees.',
}

export default function GroupPlansPage() {
  return <GroupPlansPageView />
}
