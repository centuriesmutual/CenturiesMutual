'use client'

import dynamic from 'next/dynamic'
import {
  ChartBarIcon,
  ArrowTrendingUpIcon,
  DocumentCheckIcon,
  CalendarDaysIcon,
  ShieldCheckIcon,
  ScaleIcon,
} from '@heroicons/react/24/outline'
import { RewardsPayMarketingPage } from '@/components/rewards-pay/rewards-pay-marketing-page'

const CompoundEarnings3D = dynamic(
  () =>
    import('@/components/illustrations/compound-earnings-3d').then(
      (m) => m.CompoundEarnings3D,
    ),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-full w-full items-center justify-center font-sans text-sm text-[#8FB39E]">
        Loading…
      </div>
    ),
  },
)

export function CompoundEarningsPageView() {
  return (
    <RewardsPayMarketingPage
      title="Compound Earnings"
      lead="Grow membership value on a surface that stays inside Centuries Mutual. Supplemental credits can fold back into balances that keep earning, with rate, principal, and projected path shown on one dated ledger — locked to your verified identity rather than handed off to third-party platforms."
      flowEyebrow="Compounding flow"
      flowTitle="From credit to continuing value"
      flowLead="A four-step path: attach rewards, fold eligible credits into principal, watch compounding on schedule, and audit every movement on the membership ledger."
      flow={[
        {
          step: '01',
          title: 'Attach rewards',
          body: 'Keep the Rewards Wallet tied to your Centuries Mutual membership so earnings have a home.',
        },
        {
          step: '02',
          title: 'Fold into principal',
          body: 'Where rules allow, move supplemental credits into balances that continue earning inside the membership.',
        },
        {
          step: '03',
          title: 'Watch the schedule',
          body: 'Credits and compounding land on a readable cadence with rate and principal visible together.',
        },
        {
          step: '04',
          title: 'Audit the path',
          body: 'Open dated history anytime — projected value stays aligned to membership records, not opaque third-party statements.',
        },
      ]}
      platformEyebrow="Enterprise rail"
      platformTitle="Compounding inside your membership"
      platformBody="Compound Earnings is not a brokerage portal outside Centuries Mutual. Growth runs on the same member-locked ledger as Wallet pays and rewards receipts — stewardship you can read."
      benefitEyebrow="Wallet · Earnings"
      benefitTitle="What members complete"
      benefitBody="After login, review rates and principal, fold eligible rewards into compounding balances, and track daily credit visibility with a full audit trail."
      benefitPoints={[
        'Member-only compounding inside Centuries Mutual',
        'Rate, principal, and projected value on one surface',
        'Daily compounding visibility you can reopen',
        'Audit history aligned to the membership year',
      ]}
      features={[
        {
          Icon: ArrowTrendingUpIcon,
          title: 'Member-only growth',
          blurb: 'Compounding stays inside Centuries Mutual — no third-party handoff.',
        },
        {
          Icon: ChartBarIcon,
          title: 'Rate and principal together',
          blurb: 'See how balances earn with rate, principal, and path in one view.',
        },
        {
          Icon: CalendarDaysIcon,
          title: 'Scheduled credits',
          blurb: 'Credits land on a cadence you can read and verify.',
        },
        {
          Icon: ScaleIcon,
          title: 'Fold rewards forward',
          blurb: 'Eligible credits can return to principal and keep earning.',
        },
        {
          Icon: DocumentCheckIcon,
          title: 'Clear audit trail',
          blurb: 'Every movement leaves a dated record for membership review.',
        },
        {
          Icon: ShieldCheckIcon,
          title: 'Identity-locked value',
          blurb: 'Earnings stay scoped to your verified Centuries Mutual profile.',
        },
      ]}
      scopeTitle="What Compound Earnings is — and is not"
      scopeBody="A membership view of compounding on supplemental rewards balances inside Centuries Mutual. Not an offer of securities, not tax advice, and not a guarantee of any rate or future value. Outcomes are governed by program rules and applicable plan documents."
      illustration={<CompoundEarnings3D />}
      flatHero
    />
  )
}
