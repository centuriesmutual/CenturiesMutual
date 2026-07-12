import type { Metadata } from 'next'
import { ImmersivePage } from '@/components/immersive/immersive-page'

export const metadata: Metadata = {
  title: 'Developers',
  description:
    'Centuries Mutual Developer Portal — APIs, webhooks, sandbox access, authentication, and integration guides for membership, rewards, and wellness products.',
}

export default function DevelopersPage() {
  return (
    <ImmersivePage
      eyebrow="— Developers"
      title="Developer Portal"
      lead="Build on Centuries Mutual with documented APIs, sandbox environments, webhooks, and membership-aware integrations. Connect coverage status, rewards ledgers, Wintergarden progress, and My Brothers Keeper activity into your own products — with the same stewardship standards we apply to members."
      ctaLabel="Request API access"
      ctaHref="mailto:support@centuriesmutual.com?subject=Developer%20API%20access"
      secondaryLabel="Legal"
      secondaryHref="/legal"
      sections={[
        {
          eyebrow: '01 Overview',
          title: 'What you can build',
          body: 'The developer surface exposes membership identity, rewards balances and eligible events, document and enrollment status hooks, wellness activity summaries, and Wintergarden performance milestones. Partners use these endpoints to embed Centuries Mutual experiences in employer portals, broker tools, and member-facing apps.',
          points: [
            'Membership and eligibility status APIs',
            'Rewards ledger reads and eligible-event webhooks',
            'Wellness and activity summary endpoints',
            'Wintergarden progress and milestone events',
          ],
        },
        {
          eyebrow: '02 Auth',
          title: 'OAuth, keys, and scoped access',
          body: 'Integrations authenticate with OAuth 2.0 for member-delegated access and API keys for server-to-server partner flows. Every credential is scoped: you request only the permissions your product needs, and members can revoke delegated access from their account settings.',
          points: [
            'OAuth 2.0 authorization code flow for member consent',
            'Partner API keys for backend services',
            'Fine-grained scopes for membership, rewards, and wellness',
            'Member-facing revoke and audit of connected apps',
          ],
          tone: 'cream',
        },
        {
          eyebrow: '03 Sandbox',
          title: 'Build safely before production',
          body: 'A full sandbox mirrors production shapes with synthetic members, fake rewards events, and sample wellness payloads. Rate limits are generous; data never touches live coverage or real wallets. Promote to production only after review of your scopes and data-handling attestation.',
          points: [
            'Synthetic members and sample plan documents',
            'Replayable webhook fixtures for common events',
            'Separate base URLs for sandbox and production',
            'Promotion checklist before live credentials issue',
          ],
        },
        {
          eyebrow: '04 Webhooks',
          title: 'Events when something changes',
          body: 'Subscribe to enrollment updates, rewards credit posts, fitness sync completions, Wintergarden milestone unlocks, and document status changes. Payloads are signed so you can verify origin. Failed deliveries retry with exponential backoff; a delivery log shows what you received.',
          points: [
            'Signed webhook payloads with rotation-ready secrets',
            'Enrollment, rewards, wellness, and document event types',
            'Automatic retries with delivery history',
            'Filter subscriptions by event family',
          ],
          tone: 'cream',
        },
        {
          eyebrow: '05 Rewards API',
          title: 'Read ledgers without inventing balances',
          body: 'Query available balances, pending credits, and redemption history for consented members. You never invent a balance — the ledger is authoritative. Eligibility rules for credits remain server-side so partners cannot invent reward outcomes.',
          points: [
            'Balance and transaction history endpoints',
            'Pending vs. settled credit states',
            'Server-side eligibility; no client-side inventing',
            'Idempotent redemption intents where programs allow',
          ],
        },
        {
          eyebrow: '06 Wellness & Wintergarden',
          title: 'Activity and performance integrations',
          body: 'Pull summarized My Brothers Keeper activity (not raw medical data) and Wintergarden session milestones for members who consent. Use these to power employer dashboards, coach tools, or in-app celebration surfaces without storing unnecessary detail.',
          points: [
            'Aggregated activity summaries with consent',
            'Wintergarden milestone and streak events',
            'No clinical claims; wellness data is supplemental',
            'Retention guidance aligned to our Legal policies',
          ],
          tone: 'cream',
        },
        {
          eyebrow: '07 SDKs & docs',
          title: 'Guides, OpenAPI, and examples',
          body: 'OpenAPI specs, Postman collections, and reference SDKs for common languages ship with every major API version. Guides cover enrollment handoff, rewards display patterns, webhook verification, and error taxonomy so support tickets stay rare.',
          points: [
            'Versioned OpenAPI documents',
            'Postman and curl quickstarts',
            'Reference SDKs for popular server languages',
            'Error codes with human-readable remediation',
          ],
        },
        {
          eyebrow: '08 Security',
          title: 'Stewardship for every integration',
          body: 'TLS everywhere, signed webhooks, scoped tokens, and mandatory data-handling attestations for production. Partners must not store more member data than their product requires. Security reviews can be requested through Help Desk for high-volume integrations.',
          points: [
            'TLS-only endpoints and signed callbacks',
            'Least-privilege scopes enforced at token issue',
            'Data minimization requirements for partners',
            'Escalation path via Help Desk and Audit & Compliance',
          ],
          tone: 'cream',
        },
        {
          eyebrow: '09 Support',
          title: 'How developers get unblocked',
          body: 'Technical questions go to the developer queue at support@centuriesmutual.com. Include your partner ID, environment (sandbox or production), request IDs, and a minimal repro. Breaking changes are versioned; deprecations ship with notice windows documented in the portal changelog.',
          points: [
            'Dedicated developer support subject lines',
            'Changelog and deprecation notices',
            'Versioned APIs with migration guides',
            'Partner office hours for high-volume launches',
          ],
        },
      ]}
    />
  )
}
