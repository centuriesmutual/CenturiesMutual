'use client'

import {
  BuildingOffice2Icon,
  UserGroupIcon,
  ClipboardDocumentListIcon,
  MapPinIcon,
  DocumentCheckIcon,
  ShieldCheckIcon,
} from '@heroicons/react/24/outline'
import { RewardsPayMarketingPage } from '@/components/rewards-pay/rewards-pay-marketing-page'

export function GroupPlansPageView() {
  return (
    <RewardsPayMarketingPage
      title="Group Plans"
      lead="Group health coverage for employers and organizations — medical benefits your people can understand, paired with Centuries Mutual rewards and stewardship. Employers start a group conversation; eligible employees create memberships when the group is live."
      ctaLabel="Create Account"
      ctaHref="/createaccount"
      flowEyebrow="Group pathway"
      flowTitle="From employer setup to employee coverage"
      flowLead="A four-step path: start the group conversation, finalize plan design, enroll eligible employees, and support the team from the member hub."
      flow={[
        {
          step: '01',
          title: 'Start the group conversation',
          body: 'Share headcount, locations, and renewal timing so we can assess whether a group pathway fits.',
        },
        {
          step: '02',
          title: 'Design the plan',
          body: 'Compare structures, contribution models, and class eligibility with readable underwriting next steps.',
        },
        {
          step: '03',
          title: 'Employee enrollment',
          body: 'Eligible employees create Centuries Mutual accounts and complete elections during open enrollment or qualifying events.',
        },
        {
          step: '04',
          title: 'Ongoing stewardship',
          body: 'Admins manage census changes; members use Documents, Find a Doctor, and Help Desk after effective dates.',
        },
      ]}
      platformEyebrow="Insurance pathway"
      platformTitle="Plans built for teams, not one-offs"
      platformBody="Group Plans bring hospital, physician, and preventive benefits under employer or organization sponsorship — from small teams to multi-location groups — with the same document-first tone members see on the site."
      benefitEyebrow="Insurance · Group Plans"
      benefitTitle="What employers and employees complete"
      benefitBody="Employers coordinate census and contracts with our team. Eligible employees create memberships, elect coverage during open enrollment or qualifying events, and keep ID cards and EOBs in the member hub."
      benefitPoints={[
        'Group onboarding and census coordination',
        'Employee sign-up when the group is live',
        'Open enrollment and qualifying-event elections',
        'Find a Doctor and Carrier Portal for care access tools',
      ]}
      features={[
        {
          Icon: BuildingOffice2Icon,
          title: 'Employer sponsorship',
          blurb: 'Medical pathways for eligible employee groups with clear contribution models.',
        },
        {
          Icon: UserGroupIcon,
          title: 'Employee memberships',
          blurb: 'Workers enroll through Centuries Mutual accounts after the group is established.',
        },
        {
          Icon: ClipboardDocumentListIcon,
          title: 'Census & renewals',
          blurb: 'Mid-year adds, terms, and renewal reviews with readable options.',
        },
        {
          Icon: MapPinIcon,
          title: 'Network access',
          blurb: 'Find a Doctor and carrier tools for in-network care.',
        },
        {
          Icon: DocumentCheckIcon,
          title: 'Shared stewardship',
          blurb: 'HR and members open the same document-first plan materials.',
        },
        {
          Icon: ShieldCheckIcon,
          title: 'Contract-first issuance',
          blurb: 'Effective dates follow group contracts and underwriting — not a website button.',
        },
      ]}
      scopeTitle="What Group Plans is — and is not"
      scopeBody="A Centuries Mutual employer and organization coverage pathway. Availability depends on eligibility, geography, and underwriting. Not Individual & Family coverage, not a guarantee of any specific carrier package, and not a substitute for the group’s plan documents and contracts."
    />
  )
}
