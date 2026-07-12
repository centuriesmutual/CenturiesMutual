import type { Metadata } from 'next'
import { ImmersivePage } from '@/components/immersive/immersive-page'

export const metadata: Metadata = {
  title: 'Rewards Wallet',
  description:
    'Attach a Centuries Mutual healthcare rewards wallet — earn on eligible activity with a clear member ledger.',
}

export default function RewardsWalletPage() {
  return (
    <ImmersivePage
      eyebrow="— Rewards"
      title="Rewards Wallet"
      lead="Clip a rewards wallet to your Centuries Mutual identity and earn supplemental credits on eligible activity — rent, bills, wellness, and member programs — with every accrual dated and locked to you."
      ctaLabel="Open Treasury"
      ctaHref="/login"
      sections={[
        {
          eyebrow: '01 Attachment',
          title: 'One wallet, one membership',
          body: 'Account attachment is a single step. The wallet stays tied to your verified Centuries Mutual profile so rewards compound inside the membership — not on a scatter of third-party apps.',
          points: [
            'Clip the wallet in one enrollment step',
            'Earn on everyday eligible activity',
            'Watch credits accrue with a dated ledger',
            'Rewards stay member-locked and portable only by you',
          ],
        },
        {
          eyebrow: '02 Transparency',
          title: 'Every credit has a date and a reason',
          body: 'Supplemental rewards show source, amount, and timestamp. Fold credits back into balances that keep earning, or spend them across member-eligible pay rails.',
          points: [
            'Source-level accrual detail',
            'Daily visibility beside your ledger',
            'Transfer controls that stay with you',
            'Statements you can open from Documents',
          ],
          tone: 'cream',
        },
      ]}
    />
  )
}
