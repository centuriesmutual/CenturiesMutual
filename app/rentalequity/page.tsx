import type { Metadata } from 'next'
import { ImmersivePage } from '@/components/immersive/immersive-page'

export const metadata: Metadata = {
  title: 'Compound Earnings',
  description:
    'Member-only compounding inside Centuries Mutual — growth locked to your verified identity.',
}

export default function CompoundEarningsPage() {
  return (
    <ImmersivePage
      eyebrow="— Earnings"
      title="Compound Earnings"
      lead="Growth that runs exclusively inside Centuries Mutual — never on third-party platforms. Supplemental credits fold back into balances that keep earning, with rate, principal, and projected value on one dated surface."
      ctaLabel="View member ledger"
      ctaHref="/login"
      sections={[
        {
          eyebrow: '01 Member-only',
          title: 'Compounding that stays inside Centuries Mutual',
          body: 'Rewards and balances can compound for members only. The ledger shows the rate, the principal, and a projected path so stewardship is visible — not opaque.',
          points: [
            'Member-only compounding, exclusively inside Centuries Mutual',
            'Rewards fold back into principal and keep earning',
            'Rate, principal, and projected value on one dated surface',
            'Locked to your verified Centuries Mutual identity',
          ],
        },
        {
          eyebrow: '02 Discipline',
          title: 'Daily credit, clear audit',
          body: 'Credits land on a schedule you can read. Every movement leaves an audit trail so compounding remains as trustworthy as the coverage beside it.',
          points: [
            'Daily compounding visibility',
            'Audit history you can open anytime',
            'No third-party platform handoff',
            'Statements aligned with your membership year',
          ],
          tone: 'cream',
        },
      ]}
    />
  )
}
