'use client'

import {
  DocumentTextIcon,
  ClockIcon,
  ScaleIcon,
  DocumentCheckIcon,
  GiftIcon,
  ShieldCheckIcon,
} from '@heroicons/react/24/outline'
import { RewardsPayMarketingPage } from '@/components/rewards-pay/rewards-pay-marketing-page'

export function MedicareSupplementPageView() {
  return (
    <RewardsPayMarketingPage
      title="Medicare Supplement"
      lead="Medicare Supplement (Medigap) options that help cover deductibles, coinsurance, and copayments left by Original Medicare — with clear timing guidance, standardized plan-letter comparisons, and a membership sign-up flow that keeps every policy document in one place."
      ctaLabel="Create Account"
      ctaHref="/createaccount"
      flowEyebrow="Enrollment flow"
      flowTitle="From membership to Medigap policy"
      flowLead="A four-step path: create your account, review lettered plan tradeoffs, confirm enrollment timing, and complete application paperwork with documents on file."
      flow={[
        {
          step: '01',
          title: 'Create membership',
          body: 'Open a Centuries Mutual account so Medigap applications and policy files attach to your identity.',
        },
        {
          step: '02',
          title: 'Compare plan letters',
          body: 'Review standardized letter designs side by side — premiums versus the gaps you want filled.',
        },
        {
          step: '03',
          title: 'Confirm timing',
          body: 'Open enrollment and guaranteed-issue windows are called out before you apply so underwriting surprises stay rare.',
        },
        {
          step: '04',
          title: 'Apply & archive',
          body: 'Complete the application and keep cards, EOBs, and correspondence in your Documents library.',
        },
      ]}
      platformEyebrow="Insurance pathway"
      platformTitle="Help with what Original Medicare leaves behind"
      platformBody="Original Medicare pays a share; you may still owe deductibles, coinsurance, and copayments. Medicare Supplement plans are standardized lettered designs that help make those balances more predictable."
      benefitEyebrow="Insurance · Medicare Supplement"
      benefitTitle="What members complete"
      benefitBody="After account creation, compare letters, confirm enrollment eligibility timing, submit the application, and manage ongoing policy documents from the membership hub."
      benefitPoints={[
        'Standardized plan letters explained in plain English',
        'Open enrollment and guaranteed-issue timing disclosed up front',
        'Compare Supplement vs. Advantage tradeoffs when relevant',
        'Documents library for cards, EOBs, and policy files',
      ]}
      features={[
        {
          Icon: ScaleIcon,
          title: 'Gap coverage clarity',
          blurb: 'Help with Part A and Part B cost sharing in readable categories.',
        },
        {
          Icon: DocumentTextIcon,
          title: 'Letter comparisons',
          blurb: 'Side-by-side plan letter tradeoffs without pressure theater.',
        },
        {
          Icon: ClockIcon,
          title: 'Timing that matters',
          blurb: 'Enrollment windows and underwriting implications called out early.',
        },
        {
          Icon: GiftIcon,
          title: 'Supplemental rewards',
          blurb: 'Membership rewards only where program rules allow — never clinical care.',
        },
        {
          Icon: DocumentCheckIcon,
          title: 'Document stewardship',
          blurb: 'Policy files, cards, and EOBs stay with your membership.',
        },
        {
          Icon: ShieldCheckIcon,
          title: 'Policy-first benefits',
          blurb: 'Documents — not ads — define what is covered.',
        },
      ]}
      scopeTitle="What Medicare Supplement is — and is not"
      scopeBody="A Centuries Mutual pathway to standardized Medigap coverage that helps fill Original Medicare gaps. Not Medicare Advantage, not a guarantee of issuance outside applicable enrollment rules, and not a substitute for Official Medicare publications or plan documents."
    />
  )
}
