import type { Metadata } from 'next'
import { ImmersivePage } from '@/components/immersive/immersive-page'

export const metadata: Metadata = {
  title: 'Create Account',
  description:
    'Create your Centuries Mutual membership account — then continue into coverage, rewards, and care access.',
}

export default function CreateAccountPage() {
  return (
    <ImmersivePage
      eyebrow="— Membership"
      title="Create Account"
      lead="Open a Centuries Mutual membership to access exclusive health insurance pathways, member rewards, and care tools under one brokerage identity. Review what you get below, then start the secure sign-up flow."
      ctaLabel="Start sign-up"
      ctaHref="/signup"
      secondaryLabel="Already a member? Log in"
      secondaryHref="/login"
      sections={[
        {
          eyebrow: '01 Why join',
          title: 'One membership for coverage and rewards',
          body: 'Your Centuries Mutual account is the door to Individual & Family, Medicare, Group, and Dental pathways — plus the rewards wallet, documents, Find a Provider, and wellness programs tied to the same identity.',
          points: [
            'Single member identity across insurance and rewards',
            'Documents, ID cards, and plan status in one hub',
            'Healthcare rewards eligibility where program rules allow',
            'Care access tools including Find a Provider',
          ],
        },
        {
          eyebrow: '02 What you need',
          title: 'Have these ready before you begin',
          body: 'Sign-up collects basic identity and contact details, then hands you to our secure authentication flow to set credentials. After your account exists, you can continue into plan enrollment when you are ready.',
          points: [
            'Legal name and contact email',
            'Mobile number for account recovery',
            'A password you do not reuse elsewhere',
            'Agreement to Terms and Privacy in the Legal center',
          ],
          tone: 'cream',
        },
        {
          eyebrow: '03 Sign-up flow',
          title: 'Start sign-up when you are ready',
          body: 'Tap Start sign-up to open the account creation form and secure auth handoff. Coverage is not automatic — after your account is live you choose a plan pathway and complete enrollment underwriting where required.',
          points: [
            'Start sign-up opens the membership form',
            'Secure credential setup via our auth partner',
            'Plan enrollment is a separate next step',
            'No website button guarantees coverage issuance',
          ],
        },
        {
          eyebrow: '04 After you join',
          title: 'Enroll, explore rewards, find care',
          body: 'From your member hub you can explore insurance products, fund or view rewards, pay eligible household expenses, and locate providers. Help Desk is available if anything in sign-up needs a human.',
          points: [
            'Browse Individual & Family, Medicare, Group, and Dental',
            'Rewards Wallet and everyday pay rails',
            'Find a Provider for network search',
            'Help Desk for account or enrollment questions',
          ],
          tone: 'cream',
        },
      ]}
    />
  )
}
