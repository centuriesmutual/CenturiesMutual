'use client'

import dynamic from 'next/dynamic'
import {
  WalletIcon,
  ChartBarIcon,
  DocumentCheckIcon,
  ReceiptPercentIcon,
  ShieldCheckIcon,
  SparklesIcon,
} from '@heroicons/react/24/outline'
import { RewardsPayMarketingPage } from '@/components/rewards-pay/rewards-pay-marketing-page'

const RewardsWallet3D = dynamic(
  () =>
    import('@/components/illustrations/rewards-wallet-3d').then(
      (m) => m.RewardsWallet3D,
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

export function TreasuryPageView() {
  return (
    <RewardsPayMarketingPage
      title="Rewards Wallet"
      lead="Attach a healthcare rewards wallet to your Centuries Mutual identity and earn supplemental credits on eligible activity — everyday membership use, household pays, and member programs. Every accrual is dated, attributed, and locked to your verified profile so value stays with the membership rather than scattering across third-party apps."
      flowEyebrow="Wallet flow"
      flowTitle="From membership to accrued value"
      flowLead="A four-step path: create the account, attach the wallet, earn on eligible activity, and read every credit on one ledger."
      flow={[
        {
          step: '01',
          title: 'Create membership',
          body: 'Open a Centuries Mutual account so rewards attach to a verified member identity.',
        },
        {
          step: '02',
          title: 'Attach the wallet',
          body: 'Clip the Rewards Wallet to your profile in one enrollment step inside the member hub.',
        },
        {
          step: '03',
          title: 'Earn on eligible activity',
          body: 'Credits accrue from qualifying membership activity according to program rules — never invented client-side.',
        },
        {
          step: '04',
          title: 'Read the ledger',
          body: 'Each credit shows source, amount, and timestamp. Fold value back into balances or spend on member-eligible rails.',
        },
      ]}
      platformEyebrow="Enterprise rail"
      platformTitle="Rewards inside your membership"
      platformBody="The Rewards Wallet is not a separate fintech silo. It sits on the same Centuries Mutual ledger as Wallet pays and receipts — one identity, one dated record of value."
      benefitEyebrow="Wallet · Rewards"
      benefitTitle="What members complete"
      benefitBody="After login, attach the wallet to your membership, review accrual sources, and track pending versus settled credits. Program rules decide eligibility; the ledger records the outcome."
      benefitPoints={[
        'Wallet attached to verified member identity',
        'Source-level accrual detail on every credit',
        'Pending and settled states shown clearly',
        'Statements available beside membership documents',
      ]}
      features={[
        {
          Icon: WalletIcon,
          title: 'One membership wallet',
          blurb: 'Clip rewards to your Centuries Mutual identity in a single step.',
        },
        {
          Icon: SparklesIcon,
          title: 'Eligible activity credits',
          blurb: 'Earn supplemental credits where program rules include the activity.',
        },
        {
          Icon: ChartBarIcon,
          title: 'Dated ledger visibility',
          blurb: 'Source, amount, and timestamp on every accrual you can open anytime.',
        },
        {
          Icon: ReceiptPercentIcon,
          title: 'Spend or compound',
          blurb: 'Move credits into balances that keep earning or use member-eligible pays.',
        },
        {
          Icon: DocumentCheckIcon,
          title: 'Export-ready history',
          blurb: 'Statements align with Documents for audits and month-end review.',
        },
        {
          Icon: ShieldCheckIcon,
          title: 'Member-locked controls',
          blurb: 'Transfer and visibility stay scoped to your verified membership.',
        },
      ]}
      scopeTitle="What Rewards Wallet is — and is not"
      scopeBody="A membership ledger for supplemental healthcare rewards credits. Not a bank account, not investment advice, and not a guarantee of any specific reward amount. Eligibility, timing, and value are governed by program rules and applicable plan documents."
      illustration={<RewardsWallet3D />}
    />
  )
}
