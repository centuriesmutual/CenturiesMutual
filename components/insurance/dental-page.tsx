'use client'

import {
  SparklesIcon,
  WrenchScrewdriverIcon,
  BuildingLibraryIcon,
  CalendarDaysIcon,
  DocumentCheckIcon,
  EyeIcon,
} from '@heroicons/react/24/outline'
import { RewardsPayMarketingPage } from '@/components/rewards-pay/rewards-pay-marketing-page'

export function DentalPageView() {
  return (
    <RewardsPayMarketingPage
      title="Dental & Vision"
      lead="Dental and vision coverage that attaches cleanly to your Centuries Mutual membership — preventive cleanings, restorative pathways, orthodontia where offered, routine eye exams, and an allowance toward lenses and frames. Create an account, elect dental and vision, and keep every document that governs oral and eye health coverage in one place."
      ctaLabel="Create Account"
      ctaHref="/createaccount"
      flowEyebrow="Enrollment flow"
      flowTitle="From membership to dental & vision coverage"
      flowLead="A four-step path: create your account, elect dental and vision benefits, add dependents where eligible, and keep preventive care and claims records on the membership calendar."
      flow={[
        {
          step: '01',
          title: 'Create membership',
          body: 'Open a Centuries Mutual account so dental and vision elections and EOBs attach to your identity.',
        },
        {
          step: '02',
          title: 'Elect dental & vision',
          body: 'Choose stand-alone or companion dental and vision where offered, with waiting periods, allowances, and maximums disclosed up front.',
        },
        {
          step: '03',
          title: 'Add household members',
          body: 'Include eligible dependents and confirm effective dates per plan and enrollment rules.',
        },
        {
          step: '04',
          title: 'Use & record',
          body: 'Schedule cleanings and eye exams, track annual maximums and frame allowances, and store claims and EOBs in Documents.',
        },
      ]}
      platformEyebrow="Insurance pathway"
      platformTitle="Preventive dental and routine vision on one membership"
      platformBody="Dental and vision stewardship starts with prevention — cleanings and annual eye exams — and continues through restorative dental work and corrective lenses, with coinsurance, allowances, annual maximums, and waiting periods kept legible in plan documents."
      benefitEyebrow="Insurance · Dental & Vision"
      benefitTitle="What members complete"
      benefitBody="After account creation, elect dental and vision coverage, add dependents, locate network dentists and eye-care providers, and manage EOBs, allowances, and annual maximums from the membership hub."
      benefitPoints={[
        'Preventive cleanings, exams, and annual eye exams highlighted in plan materials',
        'Basic and major restorative dental categories with clear cost sharing',
        'Vision allowances toward lenses, frames, and contacts where offered',
        'Documents library for EOBs, claims, and ID cards',
      ]}
      features={[
        {
          Icon: SparklesIcon,
          title: 'Preventive first',
          blurb: 'Routine dental exams, cleanings, and annual eye exams so small issues stay small.',
        },
        {
          Icon: WrenchScrewdriverIcon,
          title: 'Restorative pathways',
          blurb: 'Fillings and straightforward repairs with transparent coinsurance.',
        },
        {
          Icon: EyeIcon,
          title: 'Vision & corrective lenses',
          blurb: 'Eye exams plus allowances toward glasses, frames, and contacts where offered.',
        },
        {
          Icon: CalendarDaysIcon,
          title: 'Allowance & maximum tracking',
          blurb: 'Plan-year limits and frame allowances reset clearly so care is scheduled intentionally.',
        },
        {
          Icon: DocumentCheckIcon,
          title: 'Unified documents',
          blurb: 'Dental and vision sit beside medical files under one membership identity.',
        },
        {
          Icon: BuildingLibraryIcon,
          title: 'Major services clarity',
          blurb: 'Crowns, bridges, and complex care with waiting periods disclosed.',
        },
      ]}
      scopeTitle="What Dental & Vision is — and is not"
      scopeBody="A Centuries Mutual dental and vision coverage pathway for preventive, restorative, and routine eye care benefits. Availability depends on eligibility, geography, and underwriting. Waiting periods, annual maximums, vision allowances, and orthodontia rules are governed solely by plan documents."
    />
  )
}
