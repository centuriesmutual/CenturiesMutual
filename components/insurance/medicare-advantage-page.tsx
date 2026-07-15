'use client'

import {
  HeartIcon,
  MapPinIcon,
  CurrencyDollarIcon,
  CalendarDaysIcon,
  DocumentCheckIcon,
  ShieldCheckIcon,
} from '@heroicons/react/24/outline'
import { RewardsPayMarketingPage } from '@/components/rewards-pay/rewards-pay-marketing-page'

export function MedicareAdvantagePageView() {
  return (
    <RewardsPayMarketingPage
      title="Medicare Advantage"
      lead="All-in-one Medicare Advantage for Centuries Mutual members — hospital, medical, and select supplemental benefits with transparent networks, readable cost sharing, and a sign-up flow that starts membership before enrollment paperwork."
      ctaLabel="Create Account"
      ctaHref="/createaccount"
      flowEyebrow="Enrollment flow"
      flowTitle="From membership to Advantage coverage"
      flowLead="A four-step path: create your account, review network and costs, complete election steps, and live with plan documents after the effective date."
      flow={[
        {
          step: '01',
          title: 'Create membership',
          body: 'Open a Centuries Mutual account so Medicare Advantage elections attach to a verified member identity.',
        },
        {
          step: '02',
          title: 'Review network & costs',
          body: 'Confirm HMO/PPO structure, out-of-pocket patterns, and provider access before you elect.',
        },
        {
          step: '03',
          title: 'Complete election',
          body: 'Move through application and enrollment-period steps with document collection in the member hub.',
        },
        {
          step: '04',
          title: 'Effective date stewardship',
          body: 'Receive ID cards and notices in Documents. Coverage is effective only when the plan and CMS rules say so.',
        },
      ]}
      platformEyebrow="Insurance pathway"
      platformTitle="Hospital, medical, and extras in one plan"
      platformBody="Medicare Advantage (Part C) bundles Part A and Part B benefits — and often adds supplemental extras — into a single membership surface with clear Evidence of Coverage."
      benefitEyebrow="Insurance · Medicare Advantage"
      benefitTitle="What members complete"
      benefitBody="After account creation, review networks and costs, complete election steps during applicable periods, and use Find a Doctor plus Documents for ongoing care access and records."
      benefitPoints={[
        'Part A and Part B benefits through an Advantage plan',
        'Network and referral patterns disclosed plainly',
        'Annual Election Period and Special Election Period guidance',
        'Documents for cards, EOBs, appeals, and notices',
      ]}
      features={[
        {
          Icon: HeartIcon,
          title: 'Bundled Medicare benefits',
          blurb: 'Hospital, medical, and select extras on one membership surface.',
        },
        {
          Icon: MapPinIcon,
          title: 'Network honesty',
          blurb: 'Find a Doctor and directory tools before you need care.',
        },
        {
          Icon: CurrencyDollarIcon,
          title: 'Readable cost sharing',
          blurb: 'Premiums, deductibles, copays, and maximums kept legible.',
        },
        {
          Icon: CalendarDaysIcon,
          title: 'Election timing',
          blurb: 'AEP and special periods explained without brochure theater.',
        },
        {
          Icon: DocumentCheckIcon,
          title: 'Post-enrollment records',
          blurb: 'Cards, EOBs, and appeals rights live in Documents.',
        },
        {
          Icon: ShieldCheckIcon,
          title: 'Rules-first coverage',
          blurb: 'No web button guarantees plan acceptance — CMS and plan rules decide.',
        },
      ]}
      scopeTitle="What Medicare Advantage is — and is not"
      scopeBody="A Centuries Mutual pathway to Part C Medicare Advantage coverage. Not Original Medicare alone, not Medigap, and not a guarantee of any specific plan, network, or supplemental extra. Official plan documents and CMS rules govern benefits."
    />
  )
}
