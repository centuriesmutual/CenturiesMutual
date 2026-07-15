import type { Metadata } from 'next'
import { ImmersivePage } from '@/components/immersive/immersive-page'

export const metadata: Metadata = {
  title: 'Forms',
  description:
    'Centuries Mutual Forms — enrollment, claims, authorizations, and member paperwork in one place.',
}

export default function FormsPage() {
  return (
    <ImmersivePage
      eyebrow="— Documents"
      title="Forms"
      lead="The Centuries Mutual Forms center is where membership paperwork lives — enrollment applications, claims submissions, authorizations, beneficiary updates, and plan change requests — organized so you always know what to file, what is pending, and what has been completed."
      ctaLabel="Create Account"
      ctaHref="/createaccount"
      secondaryLabel="Member login"
      secondaryHref="/login"
      sections={[
        {
          eyebrow: '01 Library',
          title: 'The right form for the right moment',
          body: 'Browse forms by coverage type and task: Individual & Family enrollment, Medicare Advantage and Supplement elections, Group employee elections, Dental applications, claims, appeals, and demographic updates. Each form lists what you need before you start so incomplete packets stop being the default.',
          points: [
            'Enrollment and election forms by plan pathway',
            'Claims, appeals, and authorization packets',
            'Dependent, address, and beneficiary change forms',
            'Clear prerequisite checklists on every packet',
          ],
        },
        {
          eyebrow: '02 Enrollment',
          title: 'Applications that stay with your membership',
          body: 'Start enrollment from Forms after you create an account. Drafts save to your membership so you can pause and return. Submitted applications show status — received, under review, needs information, or complete — without chasing email threads.',
          points: [
            'Save drafts tied to your member identity',
            'Status tracking after submission',
            'Upload supporting IDs and income proofs when required',
            'No form submission guarantees underwriting approval',
          ],
          tone: 'cream',
        },
        {
          eyebrow: '03 Claims & appeals',
          title: 'File, track, and escalate with a paper trail',
          body: 'Claims forms capture provider, date of service, and amount detail. Appeals and grievance packets follow plan rules with deadlines called out. Completed filings archive beside EOBs so your history stays auditable.',
          points: [
            'Medical and dental claim intake forms',
            'Appeal and grievance templates by plan type',
            'Deadline reminders where timing rules apply',
            'Archived filings next to related EOBs',
          ],
        },
        {
          eyebrow: '04 Authorizations',
          title: 'Prior auth and release forms without the scavenger hunt',
          body: 'Prior authorization requests, medical record releases, and PHI authorizations live here with instructions for what the carrier or provider still needs from you. Signed authorizations store with timestamps for later reference.',
          points: [
            'Prior authorization request packets',
            'Medical records and PHI release forms',
            'Timestamped signed copies in your archive',
            'Help Desk if a carrier asks for a different version',
          ],
          tone: 'cream',
        },
        {
          eyebrow: '05 Life events',
          title: 'Qualifying changes, dependents, and beneficiaries',
          body: 'Marriage, birth, loss of other coverage, address moves, and beneficiary updates each have dedicated change forms. Timing windows for special enrollment are called out so you do not miss a protected period.',
          points: [
            'Qualifying life event change forms',
            'Dependent add and remove packets',
            'Beneficiary designation updates',
            'Special enrollment timing called out clearly',
          ],
        },
        {
          eyebrow: '06 eSign & security',
          title: 'Sign once, store securely',
          body: 'Where electronic signature is allowed, Forms supports identity-aligned eSign so packets close without printing. Access is membership-scoped — only parties who belong to the account see sensitive filings.',
          points: [
            'eSign where product and law allow',
            'Membership-scoped access controls',
            'Version history on revised packets',
            'Encryption in transit and at rest',
          ],
          tone: 'cream',
        },
        {
          eyebrow: '07 Carrier handoff',
          title: 'When the carrier still needs the original',
          body: 'Some carriers require their own portal upload. Forms tells you when to use Carrier Portal vs. filing inside Centuries Mutual, and lets you keep a copy of whatever you submitted elsewhere.',
          points: [
            'Guidance on CM vs. carrier filing',
            'Carrier Portal linked for carrier-native tools',
            'Local copies of external submissions',
            'Status notes you can add for your own records',
          ],
        },
        {
          eyebrow: '08 Access',
          title: 'Create an account, then open Forms',
          body: 'Personalized forms and draft history require a Centuries Mutual membership. Create Account to begin, complete sign-up, then return to Forms from the Documents column anytime. Help Desk can point you to the correct packet if you are unsure which form applies.',
          points: [
            'Create Account unlocks member Forms',
            'Login for returning members',
            'Help Desk for form selection questions',
            'Legal center for terms that govern filings',
          ],
          tone: 'cream',
        },
      ]}
    />
  )
}
