import type { Metadata } from 'next'
import { ImmersivePage } from '@/components/immersive/immersive-page'

export const metadata: Metadata = {
  title: 'Help Desk',
  description:
    'Centuries Mutual Help Desk — support for membership, coverage, rewards, documents, wellness apps, and technical issues.',
}

export default function HelpDeskPage() {
  return (
    <ImmersivePage
      eyebrow="— Support"
      title="Help Desk"
      lead="Help Desk is the front door for Centuries Mutual members, applicants, and partners. Whether you need enrollment guidance, rewards clarification, document access, wellness sync help, or a security concern escalated — start here and we route you to the right steward."
      ctaLabel="Email support"
      ctaHref="mailto:support@centuriesmutual.com?subject=Centuries%20Mutual%20support%20request"
      secondaryLabel="Member login"
      secondaryHref="/login"
      sections={[
        {
          eyebrow: '01 Contact',
          title: 'How to reach us',
          body: 'Email support@centuriesmutual.com with a clear subject, your member ID if you have one, and a short description of what you need. Attach screenshots when something looks wrong on screen. We respond in business-day order and escalate urgent coverage or security issues faster.',
          points: [
            'support@centuriesmutual.com for all general requests',
            'Include member ID, plan type, and environment (app vs. web)',
            'Screenshots and error messages speed resolution',
            'Dallas-based member services with U.S. business-day coverage',
          ],
        },
        {
          eyebrow: '02 Coverage',
          title: 'Plans, enrollment, and benefits questions',
          body: 'Ask about Medicare Advantage, Medicare Supplement, dental, individual and family pathways, and enrollment status. Help Desk can point you to plan documents, explain next steps, and connect you with licensed pathways where advice is required — we will not invent benefits the documents do not contain.',
          points: [
            'Enrollment status and document access help',
            'Plain-language pointers into plan summaries',
            'Referrals to licensed channels when advice is needed',
            'No guarantee of coverage outcomes via chat or email',
          ],
          tone: 'cream',
        },
        {
          eyebrow: '03 Rewards & Pay',
          title: 'Wallet, credits, rent, bills, and groceries',
          body: 'If a credit is pending, a redemption failed, or a pay flow for rent, bills, or groceries needs a second look, Help Desk can trace the ledger event and explain eligibility. Bring the transaction timestamp and any confirmation IDs you see in the app.',
          points: [
            'Pending vs. settled credit investigations',
            'Pay-flow failures for eligible everyday uses',
            'Eligibility explanations tied to program rules',
            'Escalation to audit tracking when records disagree',
          ],
        },
        {
          eyebrow: '04 Wellness apps',
          title: 'My Brothers Keeper and Wintergarden',
          body: 'Sync issues, missing workouts, streak questions, and Wintergarden session access all land here. We verify membership linkage first, then app-side sync. Reminder: these programs are supplemental — Help Desk cannot provide medical advice.',
          points: [
            'Membership link and single sign-on troubleshooting',
            'Activity sync and streak discrepancies',
            'Wintergarden access and progress questions',
            'Clear boundary: not clinical or medical advice',
          ],
          tone: 'cream',
        },
        {
          eyebrow: '05 Documents & Taxes',
          title: 'Member hub operational support',
          body: 'Need a form, an eDocument, newspaper access, or help with the taxes surface? Help Desk walks you to the right member hub tool and can flag document delivery failures for engineering review.',
          points: [
            'Documents library and download issues',
            'Taxes flow navigation and filing demo questions',
            'Newspaper and neighborhood access',
            'Account recovery when login fails',
          ],
        },
        {
          eyebrow: '06 Security',
          title: 'Report something that does not feel right',
          body: 'Suspected unauthorized access, phishing that uses our brand, or odd account behavior should be reported immediately. We coordinate with in-house security and can force session resets. Never send passwords in email.',
          points: [
            'Unauthorized access and session reset requests',
            'Phishing and brand-impersonation reports',
            'Coordination with In-House Security',
            'Never email passwords or full card numbers',
          ],
          tone: 'cream',
        },
        {
          eyebrow: '07 Developers & partners',
          title: 'Technical and partnership queues',
          body: 'API errors, webhook delivery problems, and sandbox access requests should use a subject line that starts with “Developer” or “Partner.” Include partner ID, request IDs, and whether you are in sandbox or production.',
          points: [
            'Developer portal issues and credential requests',
            'Webhook and API incident reports',
            'Partner program relationship questions',
            'Routing to Investor Relations when capital-related',
          ],
        },
        {
          eyebrow: '08 SLAs & hours',
          title: 'What to expect on timing',
          body: 'Most non-urgent tickets receive a first response within one to two U.S. business days. Coverage-impacting and security tickets are prioritized. Complex underwriting or carrier questions may require additional time while we coordinate with licensed channels.',
          points: [
            'Standard first response: 1–2 U.S. business days',
            'Priority lane for security and coverage-impacting issues',
            'Carrier and underwriting questions may take longer',
            'Status updates when a ticket remains open',
          ],
          tone: 'cream',
        },
        {
          eyebrow: '09 Self-serve',
          title: 'Try these before you write',
          body: 'Many answers live in Legal (terms and privacy), plan documents in your member hub, the Developers portal for integration docs, and product pages for Wintergarden and My Brothers Keeper. Checking those first often saves a round trip.',
          points: [
            'Legal center for terms, privacy, and agreements',
            'Member login for documents and wallet history',
            'Product pages for feature how-tos',
            'Developers portal for API documentation',
          ],
        },
      ]}
    />
  )
}
