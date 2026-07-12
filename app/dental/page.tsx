import type { Metadata } from 'next'
import { ImmersivePage } from '@/components/immersive/immersive-page'

export const metadata: Metadata = {
  title: 'Dental',
  description:
    'Centuries Mutual Dental — preventive and restorative dental benefits with a clear member sign-up flow.',
}

export default function DentalPage() {
  return (
    <ImmersivePage
      eyebrow="— Insurance"
      title="Dental"
      lead="Dental coverage that attaches cleanly to your Centuries Mutual membership — preventive cleanings, restorative pathways, orthodontia where offered, and member-readable benefits. Sign up to start your account, then complete dental enrollment with documents that govern every benefit."
      ctaLabel="Sign up to enroll"
      ctaHref="/signup?plan=dental"
      secondaryLabel="Find a Doctor"
      secondaryHref="/find-a-doctor"
      sections={[
        {
          eyebrow: '01 Preventive',
          title: 'Cleanings, exams, and early detection',
          body: 'Dental stewardship starts with prevention. Members get a clear path to routine exams and cleanings so small issues stay small — and benefits stay easy to understand in the plan summary.',
          points: [
            'Routine preventive visits highlighted in plan documents',
            'Network dentists you can locate before you need them',
            'Frequency limits and waiting periods disclosed up front',
            'Claims and EOBs readable in member Documents',
          ],
        },
        {
          eyebrow: '02 Basic restorative',
          title: 'Fillings and straightforward repairs',
          body: 'When a cavity or simple repair is needed, basic restorative benefits follow transparent coinsurance and annual maximums. Pre-treatment estimates help you see member cost before the chair.',
          points: [
            'Fillings and basic restorative categories',
            'Coinsurance and annual maximums in plain language',
            'Pre-treatment estimates when available',
            'Documents stored with your member file',
          ],
          tone: 'cream',
        },
        {
          eyebrow: '03 Major services',
          title: 'Crowns, bridges, and complex care',
          body: 'Major services often carry different cost sharing and waiting periods. We surface those rules so a crown quote does not become a membership surprise. Prior authorization may apply depending on the plan.',
          points: [
            'Major service categories and waiting periods',
            'Prior authorization pathways when required',
            'Alternate benefit provisions explained when they apply',
            'Help Desk if a claim needs a second look',
          ],
        },
        {
          eyebrow: '04 Orthodontia',
          title: 'Alignment benefits where the plan includes them',
          body: 'Some dental plans include orthodontia for eligible members. Lifetime maximums, age rules, and treatment timelines are called out in documents — never assumed from marketing copy.',
          points: [
            'Orthodontia eligibility by plan',
            'Lifetime maximums disclosed',
            'Age and dependent rules where applicable',
            'Treatment timeline coordination with the dentist',
          ],
          tone: 'cream',
        },
        {
          eyebrow: '05 Networks',
          title: 'Find a dentist in your plan',
          body: 'Use Find a Doctor and dental directories to confirm participating providers. Out-of-network reimbursement — if any — follows the plan’s fee schedule and may leave you with higher balances.',
          points: [
            'Network dentist search via Find a Doctor',
            'In-network vs. out-of-network cost patterns',
            'Carrier Portal for carrier dental tools',
            'Verify participation before major treatment',
          ],
        },
        {
          eyebrow: '06 Sign-up flow',
          title: 'Create your account, then elect dental',
          body: 'Sign up to enroll creates your Centuries Mutual membership. Afterward you select dental coverage, add eligible dependents, and track effective dates. Stand-alone dental and medical companion dental both follow the same document-first rule.',
          points: [
            'Sign-up button starts membership',
            'Dental election and dependent adds after account creation',
            'Effective dates per plan and enrollment rules',
            'No website button guarantees issuance',
          ],
          tone: 'cream',
        },
        {
          eyebrow: '07 With medical',
          title: 'Pair dental with your medical pathway',
          body: 'Dental can sit beside Individual & Family, Group, or Medicare pathways where offered. One membership identity holds medical and dental documents so you are not managing disconnected portals.',
          points: [
            'Companion dental with medical memberships where offered',
            'Stand-alone dental when medical is elsewhere',
            'Unified Documents library',
            'Rewards eligibility only where program rules allow',
          ],
        },
        {
          eyebrow: '08 Ongoing',
          title: 'Cleanings on the calendar, claims in Documents',
          body: 'After coverage is effective, schedule preventive visits, keep EOBs in Documents, and contact Help Desk for claim questions. Annual maximums reset per plan year — track them so major work is planned intentionally.',
          points: [
            'Preventive visit reminders where available',
            'EOBs and claims in Documents',
            'Annual maximum tracking',
            'Legal and Help Desk for policy vs. operational questions',
          ],
          tone: 'cream',
        },
      ]}
    />
  )
}
