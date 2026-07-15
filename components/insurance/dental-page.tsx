'use client'

import {
  SparklesIcon,
  WrenchScrewdriverIcon,
  BuildingLibraryIcon,
  CalendarDaysIcon,
  DocumentCheckIcon,
  ShieldCheckIcon,
} from '@heroicons/react/24/outline'
import { RewardsPayMarketingPage } from '@/components/rewards-pay/rewards-pay-marketing-page'

export function DentalPageView() {
  return (
    <RewardsPayMarketingPage
      title="Dental"
      lead="Dental coverage that attaches cleanly to your Centuries Mutual membership — preventive cleanings, restorative pathways, orthodontia where offered, and member-readable benefits. Create an account, elect dental, and keep every document that governs oral health coverage in one place."
      ctaLabel="Create Account"
      ctaHref="/createaccount"
      flowEyebrow="Enrollment flow"
      flowTitle="From membership to dental coverage"
      flowLead="A four-step path: create your account, elect dental benefits, add dependents where eligible, and keep preventive care and claims records on the membership calendar."
      flow={[
        {
          step: '01',
          title: 'Create membership',
          body: 'Open a Centuries Mutual account so dental elections and EOBs attach to your identity.',
        },
        {
          step: '02',
          title: 'Elect dental',
          body: 'Choose stand-alone or companion dental where offered, with waiting periods and maximums disclosed up front.',
        },
        {
          step: '03',
          title: 'Add household members',
          body: 'Include eligible dependents and confirm effective dates per plan and enrollment rules.',
        },
        {
          step: '04',
          title: 'Use & record',
          body: 'Schedule preventive visits, track annual maximums, and store claims and EOBs in Documents.',
        },
      ]}
      platformEyebrow="Insurance pathway"
      platformTitle="Preventive and restorative dental on one membership"
      platformBody="Dental stewardship starts with prevention and continues through basic and major services — with coinsurance, annual maximums, and waiting periods kept legible in plan documents."
      benefitEyebrow="Insurance · Dental"
      benefitTitle="What members complete"
      benefitBody="After account creation, elect dental coverage, add dependents, locate network dentists, and manage EOBs and annual maximums from the membership hub."
      benefitPoints={[
        'Preventive cleanings and exams highlighted in plan materials',
        'Basic and major restorative categories with clear cost sharing',
        'Stand-alone or companion dental with medical pathways where offered',
        'Documents library for EOBs, claims, and ID cards',
      ]}
      features={[
        {
          Icon: SparklesIcon,
          title: 'Preventive first',
          blurb: 'Routine exams and cleanings so small issues stay small.',
        },
        {
          Icon: WrenchScrewdriverIcon,
          title: 'Restorative pathways',
          blurb: 'Fillings and straightforward repairs with transparent coinsurance.',
        },
        {
          Icon: BuildingLibraryIcon,
          title: 'Major services clarity',
          blurb: 'Crowns, bridges, and complex care with waiting periods disclosed.',
        },
        {
          Icon: CalendarDaysIcon,
          title: 'Annual maximum tracking',
          blurb: 'Plan-year limits reset clearly so major work is scheduled intentionally.',
        },
        {
          Icon: DocumentCheckIcon,
          title: 'Unified documents',
          blurb: 'Dental sits beside medical files under one membership identity.',
        },
        {
          Icon: ShieldCheckIcon,
          title: 'Document-governed benefits',
          blurb: 'No website button guarantees issuance — plan rules decide.',
        },
      ]}
      scopeTitle="What Dental is — and is not"
      scopeBody="A Centuries Mutual dental coverage pathway for preventive and restorative benefits. Availability depends on eligibility, geography, and underwriting. Waiting periods, annual maximums, and orthodontia rules are governed solely by plan documents."
    />
  )
}
