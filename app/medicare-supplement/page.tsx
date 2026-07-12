import type { Metadata } from 'next'
import { ImmersivePage } from '@/components/immersive/immersive-page'

export const metadata: Metadata = {
  title: 'Medicare Supplement',
  description:
    'Centuries Mutual Medicare Supplement (Medigap) — help fill Original Medicare gaps with clear stewardship and a simple sign-up path.',
}

export default function MedicareSupplementPage() {
  return (
    <ImmersivePage
      eyebrow="— Insurance"
      title="Medicare Supplement"
      lead="Medicare Supplement (Medigap) options that help cover deductibles, coinsurance, and copayments left by Original Medicare — with Centuries Mutual’s disciplined guidance and a member sign-up flow that keeps every document in one place."
      ctaLabel="Sign up to enroll"
      ctaHref="/signup?plan=medicare-supplement"
      secondaryLabel="Find a Doctor"
      secondaryHref="/find-a-doctor"
      sections={[
        {
          eyebrow: '01 Purpose',
          title: 'Help with what Original Medicare leaves behind',
          body: 'Original Medicare pays a share; you may still owe deductibles, coinsurance, and copayments. Medicare Supplement plans are standardized lettered designs that help fill those gaps so balances after Medicare are more predictable.',
          points: [
            'Help with Part A and Part B cost sharing',
            'Standardized plan letters explained in plain English',
            'Predictable member cost patterns by plan type',
            'Documents — not ads — define what is covered',
          ],
        },
        {
          eyebrow: '02 Plan letters',
          title: 'Choose with a clear map of tradeoffs',
          body: 'Each standardized plan letter packages a different mix of benefits. We walk you through side-by-side comparisons so you can weigh premiums against the gaps you want filled — without pressure theater.',
          points: [
            'Side-by-side letter comparisons',
            'Premium vs. benefit tradeoffs made visible',
            'Guidance on when a supplement may fit your use of care',
            'Disclosures kept with your membership file',
          ],
          tone: 'cream',
        },
        {
          eyebrow: '03 Timing',
          title: 'Enrollment windows that matter',
          body: 'Medigap has important timing rules, including open enrollment periods tied to Part B. Missing a window can mean medical underwriting later. Centuries Mutual calls timing out clearly before you apply.',
          points: [
            'Open enrollment timing explained up front',
            'Guaranteed-issue situations called out when they apply',
            'Underwriting implications outside protected windows',
            'Calendar reminders in the member hub where available',
          ],
        },
        {
          eyebrow: '04 With Original Medicare',
          title: 'How Supplement sits beside Parts A and B',
          body: 'A supplement works with Original Medicare — it does not replace it. You keep your Medicare card; the supplement helps with remaining cost sharing per the plan letter you select. Networks for Medicare providers still matter for where you receive care.',
          points: [
            'Works with — does not replace — Original Medicare',
            'Provider access follows Medicare acceptance rules',
            'Find a Doctor to locate participating physicians',
            'Carrier tools via Carrier Portal when issued',
          ],
          tone: 'cream',
        },
        {
          eyebrow: '05 Sign-up flow',
          title: 'Create your account, then apply',
          body: 'Use Sign up to enroll to create your Centuries Mutual membership. After account creation you continue into the application, upload any required forms, and track status. Issuance is never guaranteed by a website button.',
          points: [
            'Member account creation via the sign-up button',
            'Application and document steps after sign-up',
            'Status tracking in Documents and the member hub',
            'Help Desk for paperwork questions',
          ],
        },
        {
          eyebrow: '06 Vs. Advantage',
          title: 'When Supplement may fit better than Advantage',
          body: 'Medicare Advantage bundles benefits differently. A supplement may fit members who want Original Medicare plus gap coverage and broad provider flexibility. We help you compare without pretending one path is always “better.”',
          points: [
            'Compare Supplement vs. Medicare Advantage tradeoffs',
            'Provider flexibility considerations',
            'Premium and out-of-pocket pattern differences',
            'No pressure to choose a product that does not fit',
          ],
          tone: 'cream',
        },
        {
          eyebrow: '07 Membership extras',
          title: 'Rewards and wellness stay supplemental',
          body: 'Centuries Mutual membership may include rewards and wellness programs where rules allow. These are supplemental — not clinical care, and not a substitute for benefits defined in your Medigap policy.',
          points: [
            'Rewards eligibility only where program rules allow',
            'Wellness apps clearly labeled as non-clinical',
            'Policy documents control insurance benefits',
            'Legal center for terms and privacy',
          ],
        },
        {
          eyebrow: '08 Ongoing',
          title: 'After your policy is effective',
          body: 'ID cards, EOBs, and correspondence live in Documents. Premium billing questions route through Help Desk and carrier channels. Review annually so your letter still matches how you use care.',
          points: [
            'Documents library for cards and EOBs',
            'Annual review reminders',
            'Help Desk and Carrier Portal for carrier issues',
            'Audit & Compliance for formal notices',
          ],
          tone: 'cream',
        },
      ]}
    />
  )
}
