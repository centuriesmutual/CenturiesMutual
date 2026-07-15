'use client'

import dynamic from 'next/dynamic'
import {
  HomeIcon,
  ShoppingCartIcon,
  DocumentCheckIcon,
  ReceiptPercentIcon,
  ShieldCheckIcon,
  BanknotesIcon,
} from '@heroicons/react/24/outline'
import { RewardsPayMarketingPage } from '@/components/rewards-pay/rewards-pay-marketing-page'

const PayMansion3D = dynamic(
  () =>
    import('@/components/illustrations/antebellum-mansion-3d').then(
      (m) => m.AntebellumMansion3D,
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

export function PayPageView() {
  return (
    <RewardsPayMarketingPage
      title="Rent, Bills & Groceries"
      lead="Keep the household running from one membership ledger. Schedule rent, settle household bills, and cover grocery essentials without switching apps — every send is confirmed before funds move, then stored as a dated receipt beside your rewards activity for roommates, landlords, and month-end review."
      flowEyebrow="Household pay flow"
      flowTitle="From Wallet to settled household pay"
      flowLead="A four-step path: authenticate, choose the pay rail, confirm the recipient and amount, and settle with a receipt on your ledger."
      flow={[
        {
          step: '01',
          title: 'Open Wallet',
          body: 'Sign in and open Account services for rent, bills, and grocery pays on the membership ledger.',
        },
        {
          step: '02',
          title: 'Choose the rail',
          body: 'Select rent, a household bill, or grocery checkout — each uses the same Wallet funding surface.',
        },
        {
          step: '03',
          title: 'Confirm the send',
          body: 'Enter payee or provider detail and amount. Review once before funds leave the ledger.',
        },
        {
          step: '04',
          title: 'Settle & record',
          body: 'The payment settles and a dated receipt lands in Wallet history, with rewards eligibility where program rules allow.',
        },
      ]}
      platformEyebrow="Enterprise rail"
      platformTitle="Household pays inside your membership"
      platformBody="Rent, bills, and groceries are not three separate money apps. They settle against the same Centuries Mutual Wallet that tracks utilities and rewards — one identity, one payment language."
      benefitEyebrow="Wallet · Household"
      benefitTitle="What members complete"
      benefitBody="From Account services, choose rent, bills, or groceries, enter payee detail and amount, then confirm. Centuries Mutual stores the settlement on your ledger with a dated receipt."
      benefitPoints={[
        'Funded from available Wallet balance',
        'Rent once or on a recurring schedule',
        'Provider and payee detail stored with each send',
        'Receipt appears in Wallet history after submit',
      ]}
      features={[
        {
          Icon: HomeIcon,
          title: 'Rent on schedule',
          blurb: 'Send rent once or set a recurring draw from the membership ledger.',
        },
        {
          Icon: BanknotesIcon,
          title: 'Household bills',
          blurb: 'Settle everyday bills from the same Wallet surface as rent and groceries.',
        },
        {
          Icon: ShoppingCartIcon,
          title: 'Grocery checkout',
          blurb: 'Cover household essentials without leaving the membership app.',
        },
        {
          Icon: ReceiptPercentIcon,
          title: 'Dated receipts',
          blurb: 'Every settlement leaves an export-ready record beside rewards activity.',
        },
        {
          Icon: DocumentCheckIcon,
          title: 'Clear confirmation',
          blurb: 'Review payee and amount before transmission — no silent draws.',
        },
        {
          Icon: ShieldCheckIcon,
          title: 'Member-scoped access',
          blurb: 'Pays and history stay locked to your verified Centuries Mutual identity.',
        },
      ]}
      scopeTitle="What household pay is — and is not"
      scopeBody="A membership payment and records rail for rent, household bills, and grocery-style sends. Not a bank, landlord service, or grocery retailer. Availability depends on Wallet balance, eligible payees, and program rules."
      illustration={<PayMansion3D />}
    />
  )
}
