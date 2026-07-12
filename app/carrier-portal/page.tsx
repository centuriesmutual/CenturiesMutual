import type { Metadata } from 'next'
import { ImmersivePage } from '@/components/immersive/immersive-page'

export const metadata: Metadata = {
  title: 'Carrier Portal',
  description:
    'Access carrier-issued tools for Centuries Mutual members — ID cards, claims, provider directories, and plan documents from your insurance carrier.',
}

export default function CarrierPortalPage() {
  return (
    <ImmersivePage
      eyebrow="— Trust & Technology"
      title="Carrier Portal"
      lead="The Carrier Portal is your bridge to carrier-issued tools — digital ID cards, claims status, provider directories, pharmacy resources, and plan documents maintained by the insurance carrier behind your Centuries Mutual coverage."
      ctaLabel="Sign up to get started"
      ctaHref="/signup?plan=carrier-portal"
      secondaryLabel="Find a Doctor"
      secondaryHref="/find-a-doctor"
      sections={[
        {
          eyebrow: '01 Purpose',
          title: 'Where Centuries Mutual ends and the carrier begins',
          body: 'Centuries Mutual is your brokerage and membership network. The carrier underwrites and administers many day-to-day insurance operations. Carrier Portal routes you to the carrier surfaces you need without pretending CM operates every claims engine.',
          points: [
            'Clear split between membership tools and carrier admin',
            'Links and guidance to carrier-issued portals',
            'ID cards, claims, and EOBs often live carrier-side',
            'CM Documents still stores copies you upload or receive',
          ],
        },
        {
          eyebrow: '02 ID cards',
          title: 'Digital and printable member ID',
          body: 'After coverage is effective, carriers typically issue ID cards. Carrier Portal helps you reach the carrier’s card download or mobile ID. Keep a copy in Centuries Mutual Documents for backup.',
          points: [
            'Digital ID card access via carrier tools',
            'Printable cards when the carrier offers them',
            'Store backups in CM Documents',
            'Report card errors to Help Desk and the carrier',
          ],
          tone: 'cream',
        },
        {
          eyebrow: '03 Claims',
          title: 'Status, EOBs, and appeals',
          body: 'Claim status, explanation of benefits, and formal appeals often run on carrier systems. We help you find the right login and understand what you are looking at — we do not invent claim outcomes.',
          points: [
            'Claims status on carrier portals',
            'EOB retrieval and download',
            'Appeals and grievance entry points per carrier',
            'Help Desk for navigation between CM and carrier',
          ],
        },
        {
          eyebrow: '04 Providers',
          title: 'Carrier directories beside Find a Doctor',
          body: 'Find a Doctor on Centuries Mutual and carrier provider directories should align — when they do not, verify by phone and report the mismatch. Carrier Portal is the place for carrier-native search tools.',
          points: [
            'Carrier-native provider search',
            'Cross-check with CM Find a Doctor',
            'Confirm participation before appointments',
            'Directory lag can affect both surfaces',
          ],
          tone: 'cream',
        },
        {
          eyebrow: '05 Pharmacy',
          title: 'Formulary and pharmacy finder',
          body: 'When your plan includes drug coverage, formulary lookup, preferred pharmacies, and mail-order setup usually live with the carrier or PBM. Carrier Portal points you there with membership context.',
          points: [
            'Formulary and tier lookup',
            'Preferred pharmacy finders',
            'Mail-order enrollment where offered',
            'Not clinical or prescribing advice',
          ],
        },
        {
          eyebrow: '06 Access',
          title: 'Sign up, enroll, then open carrier tools',
          body: 'You need an active Centuries Mutual membership and effective coverage before personalized carrier links appear. Sign up to get started, complete enrollment, then return to Carrier Portal for carrier logins tied to your plan.',
          points: [
            'Membership + effective coverage required',
            'Sign-up starts the CM account',
            'Carrier may require a separate login',
            'Keep usernames distinct and secure',
          ],
          tone: 'cream',
        },
        {
          eyebrow: '07 Security',
          title: 'Two portals, one stewardship standard',
          body: 'Never share passwords between Centuries Mutual and carrier sites in messages. Phishing that mimics either brand should be reported immediately. We will never ask for your full password by email.',
          points: [
            'Separate strong credentials for carrier sites',
            'Report phishing via Help Desk',
            'No password requests by email from CM',
            'Session hygiene on shared devices',
          ],
        },
        {
          eyebrow: '08 Support',
          title: 'Who to call for what',
          body: 'Membership, rewards, and CM app issues → Help Desk. Claim denials, network disputes, and ID card reissues → carrier channels (via Carrier Portal) and Help Desk for triage. Legal and privacy → Legal center.',
          points: [
            'Help Desk for CM membership issues',
            'Carrier for claims and ID card reissue',
            'Find a Doctor for care-access search',
            'Legal for policy and privacy requests',
          ],
          tone: 'cream',
        },
      ]}
    />
  )
}
