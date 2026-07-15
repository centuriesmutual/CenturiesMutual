'use client'

import {
  UserGroupIcon,
  HeartIcon,
  DocumentCheckIcon,
  GiftIcon,
  MapPinIcon,
  ShieldCheckIcon,
} from '@heroicons/react/24/outline'
import { RewardsPayMarketingPage } from '@/components/rewards-pay/rewards-pay-marketing-page'

export function IndividualFamilyPageView() {
  return (
    <RewardsPayMarketingPage
      title="Individual & Family"
      lead="Health coverage built for individuals and households — medical benefits you can read, preventive care pathways, and Centuries Mutual rewards tied to the same membership identity. Create an account, continue into enrollment, and keep every document that governs your benefits in one place."
      ctaLabel="Create Account"
      ctaHref="/createaccount"
      flowEyebrow="Enrollment flow"
      flowTitle="From account to active coverage"
      flowLead="A four-step path: create your membership, review plan options, complete the application, and track status until coverage is effective."
      flow={[
        {
          step: '01',
          title: 'Create membership',
          body: 'Open a Centuries Mutual account so enrollment, documents, and rewards attach to one verified identity.',
        },
        {
          step: '02',
          title: 'Review plan options',
          body: 'Compare Individual & Family pathways with readable summaries before you commit to an application.',
        },
        {
          step: '03',
          title: 'Complete enrollment',
          body: 'Supply underwriting information, upload supporting documents, and submit through guided membership steps.',
        },
        {
          step: '04',
          title: 'Track & go live',
          body: 'Follow status in the member hub. Plan documents — not website copy — define benefits once coverage is effective.',
        },
      ]}
      platformEyebrow="Insurance pathway"
      platformTitle="Coverage for households outside a group plan"
      platformBody="Individual & Family serves people shopping outside an employer group — singles, couples, and households that need hospital, physician, and preventive benefits with a clear path to member rewards."
      benefitEyebrow="Insurance · Individual & Family"
      benefitTitle="What members complete"
      benefitBody="After account creation, you complete the application, add eligible dependents, confirm network preferences, and keep ID cards, EOBs, and plan documents in the membership library."
      benefitPoints={[
        'Personal and household medical coverage pathways',
        'Dependent enrollment and qualifying-event updates',
        'Find a Doctor for network confirmation',
        'Documents library for cards, EOBs, and binders',
      ]}
      features={[
        {
          Icon: UserGroupIcon,
          title: 'Household membership',
          blurb: 'Coverage pathways sized for one member or a full family unit.',
        },
        {
          Icon: HeartIcon,
          title: 'Medical & preventive',
          blurb: 'Hospital, physician, and preventive categories explained in plain language.',
        },
        {
          Icon: GiftIcon,
          title: 'Rewards alongside coverage',
          blurb: 'Supplemental rewards where program rules allow — never a substitute for benefits.',
        },
        {
          Icon: MapPinIcon,
          title: 'Network clarity',
          blurb: 'Confirm physicians and facilities before you need care.',
        },
        {
          Icon: DocumentCheckIcon,
          title: 'Document-first stewardship',
          blurb: 'EOBs, ID cards, and binders live in Documents after effective date.',
        },
        {
          Icon: ShieldCheckIcon,
          title: 'Underwriting honesty',
          blurb: 'No website button guarantees issuance — eligibility and underwriting decide.',
        },
      ]}
      scopeTitle="What Individual & Family is — and is not"
      scopeBody="A Centuries Mutual medical coverage pathway for individuals and households. Availability depends on eligibility, geography, and underwriting. Plan documents govern benefits; marketing never overrides the binder."
    />
  )
}
