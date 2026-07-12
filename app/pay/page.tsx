import type { Metadata } from 'next'
import { ImmersivePage } from '@/components/immersive/immersive-page'

export const metadata: Metadata = {
  title: 'Rent, Bills & Groceries',
  description:
    'Pay rent, utilities, and groceries from your Centuries Mutual membership ledger.',
}

export default function PayPage() {
  return (
    <ImmersivePage
      eyebrow="— Rewards & Pay"
      title="Rent, Bills & Groceries"
      lead="Send rent on a schedule, settle utilities from the same ledger, and check out for household essentials — every payment leaves a dated receipt inside your Centuries Mutual membership."
      ctaLabel="Pay from membership"
      ctaHref="/login"
      sections={[
        {
          eyebrow: '01 Household rails',
          title: 'One surface for the payments that keep a home running',
          body: 'Rent, electric, water, internet, and grocery checkout share the same member wallet rails. Schedule draws, pay providers, and keep landlords and utilities on time without leaving the app.',
          points: [
            'Rent once or on a recurring draw',
            'Electric, water, and internet from one ledger',
            'Grocery checkout without switching apps',
            'Full payment history you can revisit anytime',
          ],
        },
        {
          eyebrow: '02 Receipts',
          title: 'Every send is a record',
          body: 'Settlements produce dated receipts tied to your identity. Eligible pays can also feed supplemental rewards — so household discipline and member benefits move together.',
          points: [
            'Dated receipts for every payment',
            'Provider detail stored with the send',
            'Eligible activity can unlock wallet credits',
            'Export-ready history for your documents file',
          ],
          tone: 'cream',
        },
      ]}
    />
  )
}
