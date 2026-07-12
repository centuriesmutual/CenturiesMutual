import type { Metadata } from 'next'
import Link from 'next/link'
import { ImmersivePage } from '@/components/immersive/immersive-page'

export const metadata: Metadata = {
  title: 'Legal',
  description:
    'Centuries Mutual Legal center — terms of service, privacy policy, member agreements, disclaimers, and regulatory notices.',
}

export default function LegalPage() {
  return (
    <ImmersivePage
      eyebrow="— Legal"
      title="Legal Center"
      lead="Policies that govern Centuries Mutual websites, apps, brokerage services, rewards, and supplemental member programs. Read the summaries below, then the full terms and privacy sections. By using our services you agree to these terms; questions go to Help Desk."
      ctaLabel="Contact Help Desk"
      ctaHref="/help-desk"
      secondaryLabel="Privacy highlights"
      secondaryHref="#privacy"
      sections={[
        {
          eyebrow: '01 Scope',
          title: 'What these policies cover',
          body: 'These terms apply to members, applicants, visitors, developers, and partners who access Centuries Mutual websites, mobile applications, rewards wallets, wellness apps (including My Brothers Keeper), Wintergarden, document tools, and related brokerage services. If you do not agree, do not use the services.',
          points: [
            'Websites, apps, and member hub tools',
            'Insurance brokerage and enrollment pathways',
            'Rewards, pay, wellness, and performance programs',
            'Developer and partner integrations',
          ],
        },
        {
          eyebrow: '02 Terms',
          title: 'Core terms of service',
          body: 'You must be legally able to contract in your jurisdiction. Keep credentials confidential and provide accurate information. Do not misuse the services — no fraud, harassment, unlawful activity, scraping that violates our rules, or circumvention of security. We may modify or discontinue features with notice where required by law.',
          points: [
            'Binding agreement upon access or account creation',
            'Account responsibility and accurate profile data',
            'Prohibited misuse and interference with systems',
            'Feature changes with notice where legally required',
          ],
          tone: 'cream',
        },
        {
          eyebrow: '03 Coverage reality',
          title: 'Insurance is governed by plan documents',
          body: 'Marketing copy on this site does not create coverage. Benefits, premiums, networks, and eligibility are defined solely by applicable plan documents, carrier contracts, and law. Availability varies by geography and underwriting. Nothing on the website guarantees issuance, savings, or claim outcomes.',
          points: [
            'Plan documents control over website copy',
            'Eligibility, geography, and underwriting gates',
            'No guarantee of coverage or claim payment',
            'Licensed channels required for insurance advice',
          ],
        },
        {
          eyebrow: '04 Rewards & programs',
          title: 'Supplemental initiatives',
          body: 'Healthcare rewards, fitness, nutrition, preventive prompts, and Wintergarden music-performance software are supplemental member initiatives. They are not medical advice, not clinical care, and not a substitute for professional treatment. Reward amounts and eligibility can change under published program rules.',
          points: [
            'Not medical advice or covered clinical care',
            'Rewards subject to eligibility and program rules',
            'Programs may be modified or ended with notice',
            'Blockchain may verify participation where disclosed',
          ],
          tone: 'cream',
        },
        {
          eyebrow: '05 Privacy',
          title: 'How we handle personal data',
          body: 'We collect account, contact, usage, and service data needed to operate brokerage, rewards, and member tools. We share data with carriers, processors, and partners only as needed to deliver the service or as required by law. You may request access or correction through Help Desk. See the full privacy section below for detail.',
          points: [
            'Collection limited to operating the services',
            'Processors and carriers under appropriate agreements',
            'Security controls described in our security surfaces',
            'Help Desk path for access and correction requests',
          ],
        },
        {
          eyebrow: '06 Blockchain & third parties',
          title: 'Ledgers and other brands',
          body: 'Where we use blockchain or distributed ledger features, they supplement — not replace — legal agreements and plan documents. Third-party marks that appear on the site belong to their owners; appearance does not imply affiliation, sponsorship, or endorsement beyond expressly stated relationships.',
          points: [
            'Ledger features do not replace written agreements',
            'Third-party networks may apply additional terms',
            'Trademark ownership respected; no implied endorsement',
            'Partner relationships only where expressly stated',
          ],
          tone: 'cream',
        },
        {
          eyebrow: '07 Developers',
          title: 'API and integration rules',
          body: 'Developer access is subject to these terms plus any partner agreement. Store only the member data your product requires, honor scopes, verify webhooks, and never invent balances or eligibility. Production credentials may be revoked for misuse or security risk.',
          points: [
            'Partner agreements may add stricter obligations',
            'Data minimization and scope enforcement',
            'Signed webhooks and secure credential storage',
            'Revocation for abuse or security incidents',
          ],
        },
        {
          eyebrow: '08 Disclaimers',
          title: 'No securities, no tax advice, no guarantees',
          body: 'This website does not constitute an offer of securities, an offer to sell, or a solicitation of an offer to buy any security. Nothing here is tax, legal, or investment advice. We do not guarantee savings, coverage, rewards outcomes, or investment results. Investor Relations materials are informational only.',
          points: [
            'Not an offer or solicitation of securities',
            'Not tax, legal, or investment advice',
            'No guaranteed savings, coverage, or rewards',
            'Limitation of liability as permitted by law',
          ],
          tone: 'cream',
        },
        {
          eyebrow: '09 Contact',
          title: 'Legal and policy requests',
          body: 'For policy questions, privacy requests, or trademark concerns, contact support@centuriesmutual.com and mark the subject “Legal.” Member product issues should use Help Desk. Regulatory notices and audit topics may also be routed through Audit & Compliance.',
          points: [
            'Email subject: Legal for policy matters',
            'Help Desk for product and account support',
            'Audit & Compliance for regulatory notices',
            'Last substantive policy review: 2026',
          ],
        },
      ]}
    >
      <section id="privacy" className="border-t border-[#E8EBEA] bg-[#FAFCFB] py-12 sm:py-16">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <p className="mb-3 font-sans text-[11px] font-semibold uppercase tracking-[0.22em] text-[#C9A53E]">
            Full text
          </p>
          <h2
            className="mb-4 font-medium text-[#14432A]"
            style={{
              fontFamily: "'Playfair Display', Georgia, serif",
              fontSize: 'clamp(1.5rem, 3vw, 2rem)',
            }}
          >
            Terms and Privacy (summary record)
          </h2>
          <div className="space-y-4 font-sans text-[0.9375rem] leading-[1.65] text-[#3d4a41]">
            <p>
              <strong className="text-[#14432A]">Agreement.</strong> These Terms
              govern access to Centuries Mutual services. If you do not agree, do
              not use the services. We may update Terms with notice where required;
              continued use after the effective date constitutes acceptance.
            </p>
            <p>
              <strong className="text-[#14432A]">Services.</strong> We provide
              brokerage-related technology, rewards, documents, wellness and
              performance programs, and related member tools. Offerings may change.
              Insurance products remain subject to underwriting and plan documents.
            </p>
            <p>
              <strong className="text-[#14432A]">Privacy.</strong> We process
              personal data to operate accounts, deliver services, meet legal
              obligations, and improve security. We do not sell personal
              information in the conventional retail sense. Requests to access,
              correct, or delete data (where applicable law provides) may be sent
              via Help Desk.
            </p>
            <p>
              <strong className="text-[#14432A]">Liability.</strong> To the
              maximum extent permitted by law, Centuries Mutual is not liable for
              indirect, incidental, or consequential damages arising from use of
              the website or supplemental programs. Coverage disputes are governed
              by plan documents and applicable insurance law.
            </p>
            <p className="text-[#55655D]">
              For operational help see{' '}
              <Link href="/help-desk" className="font-semibold text-[#14432A]">
                Help Desk
              </Link>
              . For capital inquiries see{' '}
              <Link
                href="/investor-relations"
                className="font-semibold text-[#14432A]"
              >
                Investor Relations
              </Link>
              .
            </p>
          </div>
          </div>
        </section>
    </ImmersivePage>
  )
}
