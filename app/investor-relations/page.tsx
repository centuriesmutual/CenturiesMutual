import type { Metadata } from 'next'
import { ImmersivePage } from '@/components/immersive/immersive-page'

export const metadata: Metadata = {
  title: 'Investor Relations',
  description:
    'Centuries Mutual Investor Relations — company overview, stewardship philosophy, capital narrative, and contact for qualified inquiries.',
}

export default function InvestorRelationsPage() {
  return (
    <ImmersivePage
      eyebrow="— Company"
      title="Investor Relations"
      lead="Centuries Mutual is building a healthcare rewards and insurance brokerage network grounded in stewardship, transparent incentives, and member products that compound trust over decades — not quarters of noise. This page outlines how we describe the business to qualified capital partners."
      ctaLabel="Contact IR"
      ctaHref="mailto:support@centuriesmutual.com?subject=Investor%20Relations%20inquiry"
      secondaryLabel="Legal"
      secondaryHref="/legal"
      sections={[
        {
          eyebrow: '01 Thesis',
          title: 'Brokerage, rewards, and stewardship in one network',
          body: 'We operate at the intersection of insurance brokerage and healthcare rewards: members enroll in coverage, engage in wellness and performance programs, and earn transparent incentives verified where appropriate on ledger infrastructure. The economic flywheel is membership depth — coverage plus daily engagement — not one-off acquisition stunts.',
          points: [
            'Insurance brokerage as the durable relationship',
            'Healthcare rewards that reinforce healthy participation',
            'Supplemental wellness and performance products in-network',
            'Stewardship language matched by operational controls',
          ],
        },
        {
          eyebrow: '02 Model',
          title: 'How value accrues',
          body: 'Revenue and margin narratives center on brokerage relationships, member platform engagement, and partner programs that share aligned incentives. Rewards are designed to be sustainable: eligibility and underwriting still govern coverage; incentives never invent benefits the plan documents do not support.',
          points: [
            'Brokerage economics tied to lasting member relationships',
            'Platform engagement across pay, wellness, and performance',
            'Partner programs with expressly stated affiliations only',
            'No marketing claim that overrides plan documents or law',
          ],
          tone: 'cream',
        },
        {
          eyebrow: '03 Products',
          title: 'The member surface investors should understand',
          body: 'Core surfaces include coverage and enrollment pathways, a rewards wallet, rent/bills/grocery pay flows where offered, My Brothers Keeper fitness, Wintergarden music performance software, and compounding / legacy storytelling for long-horizon members. Each product deepens the same identity.',
          points: [
            'Coverage: Medicare Advantage, Supplement, dental, and more',
            'Rewards wallet and eligible everyday pay use cases',
            'My Brothers Keeper and Wintergarden as engagement engines',
            'Documents, taxes, and member hub for operational trust',
          ],
        },
        {
          eyebrow: '04 Governance',
          title: 'Controls before marketing',
          body: 'Audit trails, in-house security posture, blockchain verification for select incentive events, and legal disclaimers are first-class. Investor materials will never outrun what members see in plan documents. This page itself is informational — not an offer to sell securities.',
          points: [
            'Audit & Compliance and security surfaces publicly linked',
            'Ledger verification for transparent incentive events',
            'Legal center for terms, privacy, and member agreements',
            'No securities offer on this website',
          ],
          tone: 'cream',
        },
        {
          eyebrow: '05 Geography',
          title: 'Dallas roots, network ambition',
          body: 'Centuries Mutual is based in Dallas, Texas, with member services oriented to U.S. insurance and rewards contexts. Plan availability always depends on eligibility, geography, and underwriting — investors should treat multi-state expansion as gated by regulatory and carrier reality, not slideware.',
          points: [
            'Headquarters: Dallas, Texas',
            'Member services: support@centuriesmutual.com',
            'Coverage availability varies by market and eligibility',
            'Expansion paced by compliance and carrier relationships',
          ],
        },
        {
          eyebrow: '06 Capital conversations',
          title: 'What we share, and what we do not',
          body: 'Qualified inquiries receive a structured overview: business description, product map, stewardship principles, and next-step diligence under NDA where appropriate. We do not publish forward-looking financial projections on this public page. Nothing here is a solicitation or an offer of securities.',
          points: [
            'Email IR via support with subject Investor Relations inquiry',
            'NDA-gated diligence for serious conversations',
            'No public financial projections on this page',
            'Not an offer or solicitation of securities',
          ],
          tone: 'cream',
        },
        {
          eyebrow: '07 Reporting rhythm',
          title: 'How we expect to communicate',
          body: 'As the company matures its capital relationships, IR communication will emphasize operating metrics that matter: member engagement quality, brokerage retention, rewards integrity, and compliance incidents (ideally none). Vanity metrics without stewardship context are not the culture.',
          points: [
            'Preference for durable operating metrics over vanity counts',
            'Rewards integrity and eligibility accuracy as first-class KPIs',
            'Compliance and security posture in every serious update',
            'Member trust treated as a balance-sheet intangible',
          ],
        },
        {
          eyebrow: '08 Contact',
          title: 'Reach Investor Relations',
          body: 'Send a brief introduction, your firm, and the nature of your interest to support@centuriesmutual.com with subject line “Investor Relations inquiry.” Our team routes qualified messages to the appropriate company contacts. For press or general support, use Help Desk instead.',
          points: [
            'support@centuriesmutual.com — subject: Investor Relations inquiry',
            'Include firm name and inquiry type',
            'Help Desk for member and product support',
            'Legal for policy and trademark questions',
          ],
          tone: 'cream',
        },
      ]}
    />
  )
}
