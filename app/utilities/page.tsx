import type { Metadata } from 'next'
import { ImmersivePage } from '@/components/immersive/immersive-page'

export const metadata: Metadata = {
  title: 'Utilities',
  description:
    'Pay electric, water, gas, and internet from your Centuries Mutual membership ledger with dated receipts and rewards eligibility where offered.',
}

export default function UtilitiesPage() {
  return (
    <ImmersivePage
      eyebrow="— Rewards & Pay"
      title="Utilities"
      lead="Electric, water, gas, internet, and related household utilities — paid from the same Centuries Mutual ledger that handles rent and groceries, with every settlement dated, stored, and eligible for rewards where program rules allow."
      ctaLabel="Sign up to get started"
      ctaHref="/signup?plan=utilities"
      secondaryLabel="Member login"
      secondaryHref="/login"
      sections={[
        {
          eyebrow: '01 Providers',
          title: 'Household utilities on one membership rail',
          body: 'Connect recurring utility providers and settle from your member wallet. Autopay and one-time pays share the same clear history as rent, bills, and grocery sends — one identity, one ledger language.',
          points: [
            'Electric, water, gas, and internet in one place',
            'Schedule or pay once from the membership wallet',
            'Provider detail kept with each send',
            'Eligible pays may contribute to rewards',
          ],
        },
        {
          eyebrow: '02 Autopay',
          title: 'Set it once, review every month',
          body: 'Autopay keeps lights on without forgotten due dates. You still get dated receipts and month-end summaries so automation never means invisibility. Pause or edit anytime from the member hub.',
          points: [
            'Recurring schedules with clear next-pay dates',
            'Pause, edit, or cancel without calling a call center maze',
            'Insufficient-balance alerts before a failed send',
            'Same receipt format as one-time pays',
          ],
          tone: 'cream',
        },
        {
          eyebrow: '03 Records',
          title: 'Statements that match the membership',
          body: 'Utility history is searchable and exportable beside rent and grocery receipts — coherent for roommates, landlords, tax prep, or your own audits. Longer retention aligns with Documents when you archive statements.',
          points: [
            'Dated receipts for every utility payment',
            'Month-by-month history you can open anytime',
            'Export for shared households or records',
            'Aligned with Documents for longer retention',
          ],
        },
        {
          eyebrow: '04 Rewards',
          title: 'Everyday pays that can earn',
          body: 'Where healthcare rewards program rules include eligible utility settlements, those pays surface beside your wallet activity. Eligibility is never invented client-side — the ledger and program rules decide.',
          points: [
            'Eligible utility pays may unlock rewards credits',
            'Pending vs. settled states shown clearly',
            'Program rules linked from the wallet',
            'No guarantee of any specific reward amount',
          ],
          tone: 'cream',
        },
        {
          eyebrow: '05 Setup',
          title: 'Sign up, fund, connect, pay',
          body: 'Create a Centuries Mutual account with Sign up to get started. After login you fund or link eligible balances, add providers with account numbers, and send your first utility payment. Help Desk assists when a provider needs a second look.',
          points: [
            'Sign-up creates your membership',
            'Add providers with account and service address detail',
            'Confirm amounts before each first send',
            'Help Desk for failed or disputed settlements',
          ],
        },
        {
          eyebrow: '06 Security',
          title: 'Stewardship on every settlement',
          body: 'Utility account numbers and payment credentials are handled with the same membership security posture as other pay rails. You control who can initiate pays on a shared household membership.',
          points: [
            'Encrypted handling of payment credentials',
            'Member-controlled permissions on household accounts',
            'Activity log for every send',
            'Report suspicious activity via Help Desk immediately',
          ],
          tone: 'cream',
        },
        {
          eyebrow: '07 With Pay',
          title: 'Part of rent, bills & groceries',
          body: 'Utilities sit next to Rent, Bills & Groceries and Compound Earnings in the Rewards & Pay family. The goal is one household finance surface — not five apps for five bill types.',
          points: [
            'Same ledger language as rent and groceries',
            'Rewards Wallet for balances and history',
            'Compound Earnings for longer-horizon membership value',
            'Consistent receipt and export patterns',
          ],
        },
        {
          eyebrow: '08 Limits',
          title: 'What Utilities is — and is not',
          body: 'Utilities is a payment and records rail for eligible providers. It is not a utility company, not a guarantee that every provider nationwide is supported, and not energy or rate advice. Provider availability varies.',
          points: [
            'Provider availability varies by market',
            'Not a utility or rate-advisory service',
            'Subject to wallet balances and program rules',
            'Legal terms govern use of pay features',
          ],
          tone: 'cream',
        },
      ]}
    />
  )
}
