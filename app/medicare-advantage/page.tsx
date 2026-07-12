import type { Metadata } from 'next'
import { ImmersivePage } from '@/components/immersive/immersive-page'

export const metadata: Metadata = {
  title: 'Medicare Advantage',
  description:
    'Centuries Mutual Medicare Advantage — all-in-one Medicare coverage with rewards, wellness, and a clear member sign-up flow.',
}

export default function MedicareAdvantagePage() {
  return (
    <ImmersivePage
      eyebrow="— Insurance"
      title="Medicare Advantage"
      lead="All-in-one Medicare Advantage for Centuries Mutual members — hospital, medical, and select supplemental benefits with transparent stewardship, network tools, and a sign-up flow that starts your membership before enrollment paperwork."
      ctaLabel="Sign up to enroll"
      ctaHref="/signup?plan=medicare-advantage"
      secondaryLabel="Find a Doctor"
      secondaryHref="/find-a-doctor"
      sections={[
        {
          eyebrow: '01 Coverage',
          title: 'Hospital, medical, and extras in one plan',
          body: 'Medicare Advantage (Part C) bundles Part A and Part B benefits — and often adds supplemental extras — into a single membership surface. Everyday care, preventive visits, and plan-specific extras live together with clear documents.',
          points: [
            'Part A and Part B benefits through an Advantage plan',
            'Preventive care aligned to Medicare Advantage rules',
            'Select supplemental extras where the plan includes them',
            'Plan documents you can open anytime in Documents',
          ],
        },
        {
          eyebrow: '02 Networks',
          title: 'Know your doctors before you need them',
          body: 'Most Advantage plans use networks. Find a Doctor and plan directories help you confirm primary care, specialists, and facilities. Out-of-network rules vary — we surface them in the Evidence of Coverage, not in fine-print surprises.',
          points: [
            'HMO, PPO, and other structures explained plainly',
            'Find a Doctor for network search',
            'Referral and prior-auth patterns called out by plan',
            'Carrier Portal for carrier-side network tools',
          ],
          tone: 'cream',
        },
        {
          eyebrow: '03 Costs',
          title: 'Premiums, deductibles, and maximums you can read',
          body: 'We keep monthly premiums, deductibles, copays, and out-of-pocket maximums legible before you enroll. Cost sharing examples help you see how a typical visit might look — always subject to the official plan documents.',
          points: [
            'Plain-language cost sharing summaries',
            'Out-of-pocket maximums highlighted',
            'Pharmacy cost patterns where Part D is included',
            'No website estimate replaces the official EOC',
          ],
        },
        {
          eyebrow: '04 Pharmacy',
          title: 'Drug coverage when the plan includes Part D',
          body: 'Many Advantage plans include prescription drug coverage. Formulary tiers, preferred pharmacies, and prior authorization rules are part of stewardship — we help you locate the formulary and understand tiers before you rely on a medication.',
          points: [
            'Formulary access through plan and carrier tools',
            'Tier and preferred pharmacy explanations',
            'Prior auth and step therapy called out when applicable',
            'Help Desk for navigation — not clinical advice',
          ],
          tone: 'cream',
        },
        {
          eyebrow: '05 Rewards & wellness',
          title: 'Membership extras that reinforce healthy habits',
          body: 'Where allowed, Centuries Mutual rewards, My Brothers Keeper fitness, and other supplemental programs sit beside your Advantage membership. They never invent clinical benefits or replace covered care.',
          points: [
            'Rewards wallet eligibility per program rules',
            'Wellness sync into the member profile',
            'Supplemental labels on non-clinical programs',
            'Blockchain verification where participation incentives apply',
          ],
        },
        {
          eyebrow: '06 Sign-up flow',
          title: 'Start with an account, finish with enrollment',
          body: 'Tap Sign up to enroll to create your Centuries Mutual account. After sign-up you continue into Medicare Advantage application steps, election periods, and document collection. Coverage is effective only when the plan and CMS rules say so.',
          points: [
            'Sign-up creates your member identity',
            'Enrollment and election steps after account creation',
            'Annual Election Period and Special Election Period guidance',
            'No guarantee of plan acceptance from a web button',
          ],
          tone: 'cream',
        },
        {
          eyebrow: '07 Star & quality',
          title: 'Stewardship beyond the sales pitch',
          body: 'We emphasize readable benefits, network honesty, and post-enrollment support. Compare Supplement vs. Advantage carefully if you value broad Original Medicare provider access differently than a networked Advantage design.',
          points: [
            'Honest network and referral disclosure',
            'Compare with Medicare Supplement when relevant',
            'Post-enrollment document and ID card delivery',
            'Help Desk and Carrier Portal for ongoing issues',
          ],
        },
        {
          eyebrow: '08 After effective date',
          title: 'Live with the plan, not the brochure',
          body: 'ID cards, EOBs, appeals rights, and plan notices live in Documents. Use Find a Doctor before appointments. Review annually during AEP so your plan still matches how you receive care.',
          points: [
            'Documents for cards, EOBs, and notices',
            'Appeals and grievance pathways per plan rules',
            'Annual review during enrollment periods',
            'Audit & Compliance for formal regulatory notices',
          ],
          tone: 'cream',
        },
      ]}
    />
  )
}
