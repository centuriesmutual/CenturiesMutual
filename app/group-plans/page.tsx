import type { Metadata } from 'next'
import { ImmersivePage } from '@/components/immersive/immersive-page'

export const metadata: Metadata = {
  title: 'Group Plans',
  description:
    'Centuries Mutual Group Plans — employer and organization health coverage with rewards, wellness, and a clear sign-up path for admins and employees.',
}

export default function GroupPlansPage() {
  return (
    <ImmersivePage
      eyebrow="— Insurance"
      title="Group Plans"
      lead="Group health coverage for employers and organizations — medical benefits your people can understand, paired with Centuries Mutual rewards and stewardship. Employers start with a conversation; eligible employees sign up to join the membership after the group is live."
      ctaLabel="Sign up to enroll"
      ctaHref="/signup?plan=group"
      secondaryLabel="Contact for groups"
      secondaryHref="mailto:support@centuriesmutual.com?subject=Group%20Plans%20inquiry"
      sections={[
        {
          eyebrow: '01 Coverage',
          title: 'Plans built for teams, not one-offs',
          body: 'Group Plans bring hospital, physician, and preventive benefits under employer or organization sponsorship. We help compare structures, contribution models, and class eligibility — from small teams to multi-location groups.',
          points: [
            'Medical pathways for eligible employee groups',
            'Contribution and eligibility models explained plainly',
            'Preventive care and network access by plan design',
            'Plan documents HR and members can open anytime',
          ],
        },
        {
          eyebrow: '02 Employers',
          title: 'What organizations get',
          body: 'Admins need census coordination, renewal rhythm, and a partner who stays after the binder is signed. We support onboarding, mid-year adds and terms, and renewal reviews with the same stewardship tone members see on the site.',
          points: [
            'Group onboarding and census coordination',
            'Mid-year adds, terms, and qualifying events',
            'Renewal reviews with readable options',
            'Carrier and underwriting partner routing',
          ],
          tone: 'cream',
        },
        {
          eyebrow: '03 Employees',
          title: 'A membership employees actually use',
          body: 'Beyond the ID card: Documents in the member hub, Find a Doctor, wellness programs, and Help Desk when a claim needs a human. Coverage is first — supplemental programs never replace clinical care.',
          points: [
            'Member hub for documents and account tools',
            'Find a Doctor for network search',
            'Optional wellness and Wintergarden enrichment',
            'Supplemental programs are not medical advice',
          ],
        },
        {
          eyebrow: '04 Rewards',
          title: 'Healthcare rewards inside the membership',
          body: 'Where program rules allow, group members access rewards wallets, eligible everyday pays, and wellness participation so coverage and incentives share one identity.',
          points: [
            'Rewards wallet where eligibility applies',
            'Wellness sync through My Brothers Keeper',
            'Transparent incentive rules beside coverage',
            'No invented benefits beyond plan documents',
          ],
          tone: 'cream',
        },
        {
          eyebrow: '05 Classes & eligibility',
          title: 'Who can join the group',
          body: 'Waiting periods, hours thresholds, and employee classes define who is eligible. We document these rules so HR and employees share the same understanding — website marketing never overrides the group contract.',
          points: [
            'Waiting periods and hours rules disclosed',
            'Class definitions for full-time and other categories',
            'Dependent eligibility called out clearly',
            'COBRA and continuation pointers where applicable',
          ],
        },
        {
          eyebrow: '06 Sign-up flow',
          title: 'Employees create accounts to enroll',
          body: 'Once a group is established, eligible employees use Sign up to enroll to create Centuries Mutual accounts and complete elections during open enrollment or qualifying events. Employers coordinate census and effective dates separately with our team.',
          points: [
            'Employee sign-up for member identity',
            'Open enrollment and qualifying-event elections',
            'Employer inquiries via contact for groups',
            'Issuance and effective dates follow group contracts',
          ],
          tone: 'cream',
        },
        {
          eyebrow: '07 Networks & carriers',
          title: 'Care access and carrier tools',
          body: 'Find a Doctor helps members locate in-network care. Carrier Portal connects to carrier-side tools for ID cards, claims, and provider directories when the group’s carrier issues access.',
          points: [
            'Find a Doctor for member network search',
            'Carrier Portal for carrier-issued tools',
            'Prior auth patterns per plan design',
            'Help Desk for navigation between CM and carrier',
          ],
        },
        {
          eyebrow: '08 Next step',
          title: 'Start a group conversation',
          body: 'Share approximate headcount, locations, and renewal timing. We outline whether a group pathway fits and what underwriting steps come next. Availability always depends on eligibility, geography, and underwriting.',
          points: [
            'Email with subject Group Plans inquiry',
            'Employees: use Sign up when your group is live',
            'Individual & Family Plans if you need non-group coverage',
            'Legal center for terms that govern membership',
          ],
          tone: 'cream',
        },
      ]}
    />
  )
}
