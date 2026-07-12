import type { Metadata } from 'next'
import { ImmersivePage } from '@/components/immersive/immersive-page'

export const metadata: Metadata = {
  title: 'Individual & Family',
  description:
    'Centuries Mutual Individual & Family — personal health coverage with rewards, wellness, and clear stewardship for you and your household.',
}

export default function IndividualFamilyPlansPage() {
  return (
    <ImmersivePage
      eyebrow="— Insurance"
      title="Individual & Family"
      lead="Health coverage built for individuals and households — medical benefits you can read, preventive care pathways, and Centuries Mutual rewards that stay with the same membership identity. Start with a member account, then continue into enrollment with documents that govern every benefit."
      ctaLabel="Sign up to enroll"
      ctaHref="/signup?plan=individual-family"
      secondaryLabel="Find a Doctor"
      secondaryHref="/find-a-doctor"
      sections={[
        {
          eyebrow: '01 Who it’s for',
          title: 'Coverage when you are not on a group plan',
          body: 'Individual & Family Plans serve people shopping outside an employer group — singles, couples, and households that need hospital, physician, and preventive benefits with a clear path to member rewards. Availability depends on eligibility, geography, and underwriting.',
          points: [
            'Personal and household medical coverage pathways',
            'Options sized for one member or a full family unit',
            'Readable summaries before you commit to an application',
            'Plan documents — not website copy — define benefits',
          ],
        },
        {
          eyebrow: '02 Medical benefits',
          title: 'Hospital, physician, and preventive care',
          body: 'Core medical stewardship covers inpatient and outpatient pathways, primary and specialty physician access, and preventive services aligned to the plan you select. Networks and cost sharing are explained before enrollment so surprises stay rare.',
          points: [
            'Hospital and outpatient benefit categories',
            'Primary care and specialty referral patterns by plan',
            'Preventive visits highlighted in member materials',
            'Cost sharing and deductibles shown in plain language',
          ],
          tone: 'cream',
        },
        {
          eyebrow: '03 Household',
          title: 'One membership story for the family',
          body: 'Add eligible dependents under a household membership surface. Documents, ID cards, and rewards eligibility stay organized so parents are not juggling five portals for five people.',
          points: [
            'Dependent enrollment and qualifying-event updates',
            'Shared document vault in the member hub',
            'Per-member ID and coverage status views',
            'Help Desk support for household changes',
          ],
        },
        {
          eyebrow: '04 Rewards & wellness',
          title: 'Incentives that reinforce healthy participation',
          body: 'Where program rules allow, individual and family members unlock healthcare rewards, My Brothers Keeper fitness sync, and other supplemental initiatives. These never replace clinical care or invent benefits the plan does not contain.',
          points: [
            'Rewards wallet beside coverage status',
            'Wellness sync for eligible activity',
            'Supplemental programs clearly labeled as non-clinical',
            'Eligibility rules enforced server-side',
          ],
          tone: 'cream',
        },
        {
          eyebrow: '05 Enrollment path',
          title: 'Sign up, then complete your application',
          body: 'Create a Centuries Mutual account to start. From there you supply the information needed for underwriting and carrier submission, upload supporting documents, and track status in the member hub. Licensed channels handle advice when required.',
          points: [
            'Sign up button starts your member account',
            'Guided application steps after account creation',
            'Document upload and status tracking',
            'No guarantee of issuance — underwriting decides',
          ],
        },
        {
          eyebrow: '06 Networks',
          title: 'Know where you can receive care',
          body: 'Use Find a Doctor and plan network tools to confirm physicians and facilities before you need them. Out-of-network rules vary by plan — we surface them in documents rather than burying them in footnotes.',
          points: [
            'Find a Doctor linked from your membership',
            'Network directories by plan and geography',
            'Out-of-network cost sharing disclosed in documents',
            'Carrier Portal for carrier-side tools where issued',
          ],
          tone: 'cream',
        },
        {
          eyebrow: '07 Stewardship',
          title: 'Claims, EOBs, and ongoing support',
          body: 'After coverage is effective, claims history, EOBs, and ID cards live in Documents. Help Desk routes questions; Audit & Compliance handles formal notices. Marketing never overrides the binder.',
          points: [
            'EOBs and claims in your document library',
            'ID cards available after effective date',
            'Help Desk for operational questions',
            'Legal center for terms and privacy',
          ],
        },
        {
          eyebrow: '08 Compare',
          title: 'Other Centuries Mutual pathways',
          body: 'If you are 65+ or otherwise Medicare-eligible, review Medicare Advantage or Medicare Supplement. Employers should see Group Plans. Dental can attach as a stand-alone or companion benefit where offered.',
          points: [
            'Medicare Advantage and Supplement for Medicare paths',
            'Group Plans for employer-sponsored teams',
            'Dental for oral health benefits',
            'Utilities and rewards for everyday membership uses',
          ],
          tone: 'cream',
        },
      ]}
    />
  )
}
