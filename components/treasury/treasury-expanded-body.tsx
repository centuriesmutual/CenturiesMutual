import {
  BoltIcon,
  ScaleIcon,
  ShieldCheckIcon,
} from '@heroicons/react/24/outline'
import { Eyebrow, LuxuryCard, ProseBody, SectionTitle } from '@/components/treasury/treasury-luxury'
import { TreasuryGovernanceIllustration } from '@/components/treasury/treasury-governance-illustration'
import { TreasuryExpandedBodyContinued } from '@/components/treasury/treasury-expanded-body-part2'
import { TreasurySettlementViz } from '@/components/treasury/treasury-settlement-viz'
import { TreasurySimulatedWallet } from '@/components/treasury/treasury-simulated-wallet'
import { cn } from '@/lib/utils'

const serifCard = 'font-serif font-semibold text-[1.125rem] leading-snug text-[#14432A]'
const bodySmall = 'font-sans text-[0.9375rem] leading-[1.65] text-[#3d4a41]'
const iconWrap = 'mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-[#14432A]/[0.08] text-[#14432A]'

/** Two-column Treasury rows: top-aligned grid, ~2rem gap tablet / ~4rem desktop */
const treasuryTwoCol = 'grid grid-cols-1 items-start gap-8 md:gap-8 lg:grid-cols-2 lg:gap-16'
const treasuryTextStack = 'flex min-w-0 flex-col gap-6'
const treasuryBody = 'max-w-[36rem] font-sans text-[0.9375rem] leading-[1.65] text-[#55655D]'
const titleInCol = 'max-w-[48rem]'

/** All sections appended below the Treasury hero — server-rendered shell + isolated client widgets */
export function TreasuryExpandedBody() {
  return (
    <>
      {/* Governance */}
      <section className="border-t border-[#E5E0D5]/90 bg-[#FAFCFB] py-20 md:py-28">
        <div className="mx-auto max-w-[1200px] px-6 lg:px-10">
          <div className={treasuryTwoCol}>
            <div className={treasuryTextStack}>
              <Eyebrow className="mb-0">Governance</Eyebrow>
              <SectionTitle className={titleInCol}>Governance you do not have to decode.</SectionTitle>
              <p className={treasuryBody}>
                Governance is how Centuries Mutual keeps Treasury legible in plain sight — who may move funds, under which
                checks, how disagreements escalate, and how the same words reach every party to a home, lease, or corridor
                instead of a patchwork of private side deals and forgotten attachments.
              </p>
              <p className={treasuryBody}>
                It sits next to your charter and your ledger: the charter states the promises, the ledger shows what happened,
                and governance ties them together so audits, disputes, and everyday coordination share one vocabulary. The
                schematic panel is a summary; in-product notices, policies, and signed agreements remain what you rely on when
                details matter.
              </p>
            </div>
            <div className="min-w-0 w-full max-w-[480px] lg:max-w-none">
              <TreasuryGovernanceIllustration className="lg:mx-0" />
            </div>
          </div>
        </div>
      </section>

      <section className="border-t border-[#E5E0D5]/80 bg-[#E8DFD6]/55 py-20 md:py-28">
        <div className="mx-auto max-w-[1200px] px-6 lg:px-10">
          <div className={treasuryTwoCol}>
            <div className={treasuryTextStack}>
              <SectionTitle className={titleInCol}>Reserve.</SectionTitle>
              {[
                `Reserve is the prudential backbone of Treasury: assets administered so your balance stays one-to-one with the U.S. dollar — redeemable on the terms you agreed to — without turning your rent plan into exposure to speculative tokens or opaque pools.`,
                `Fund from your bank, receive from another member or a landlord counterpart, pay rent or shared bills, and withdraw when you choose. Flows post on fast settlement rails, while reserve accounting stays deliberately boring: segregation, clear netting, and balances that do not drift with unrelated markets — shelter and clarity, not speculation.`,
              ].map((para, i) => (
                <p key={i} className={treasuryBody}>
                  {para}
                </p>
              ))}
            </div>
            <div className="min-w-0">
              <TreasurySimulatedWallet />
            </div>
          </div>
        </div>
      </section>

      <section className="border-t border-[#E5E0D5]/80 bg-[#FAFCFB] py-20 md:py-28">
        <div className="mx-auto max-w-[1200px] px-6 lg:px-10">
          <SectionTitle>Why a digital dollar.</SectionTitle>
          <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-3">
            {[
              {
                Icon: ScaleIcon,
                title: 'One-to-one with the dollar',
                body:
                  'The digital dollar is fully backed against reserves aligned with prudent practice — always worth exactly one dollar you can reconcile against withdrawals.',
              },
              {
                Icon: ShieldCheckIcon,
                title: 'No volatility',
                body:
                  'Your wallet is not indexed to risky assets — balances behave like cash you can plan around alongside your lease obligations.',
              },
              {
                Icon: BoltIcon,
                title: 'Faster than a wire',
                body:
                  'Member-to-member settlements confirm in seconds — when banking rails suit you better, withdrawals follow established scheduling windows.',
              },
            ].map(({ Icon, title, body }) => (
              <LuxuryCard key={title}>
                <div className={iconWrap}>
                  <Icon className="h-6 w-6" aria-hidden />
                </div>
                <h3 className={cn(serifCard, 'mt-1')}>{title}</h3>
                <p className={cn(bodySmall, 'mt-3')}>{body}</p>
              </LuxuryCard>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-[#E5E0D5]/80 bg-[#E8DFD6]/40 py-20 md:py-28">
        <div className="mx-auto max-w-[1200px] px-6 lg:px-10">
          <div className={treasuryTwoCol}>
            <div className={treasuryTextStack}>
              <SectionTitle className={titleInCol}>Settlement on a fast network.</SectionTitle>
              <ProseBody className={treasuryBody}>
                Wallet-to-wallet settlements run on an efficient settlement layer engineered for recurring payments instead of
                speculative trading — near-instant confirmation, transparent postings, predictable costs that reward network
                operators rather than inflating silently with unrelated market noise.
              </ProseBody>
              <ProseBody className={treasuryBody}>
                Typical network costs sit at a modest few cents paid to settlement infrastructure itself — enabling Centuries
                Mutual to prioritize orchestration transparency instead of taxing every proportional rent dollar.
              </ProseBody>
            </div>
            <div className="min-w-0">
              <TreasurySettlementViz />
            </div>
          </div>
        </div>
      </section>

      <section className="border-t border-[#E5E0D5]/80 bg-[#FAFCFB] py-20 md:py-28">
        <div className="mx-auto max-w-[1100px] px-6 lg:px-10">
          <div className={treasuryTwoCol}>
            <div className={cn(treasuryTextStack, 'min-w-0')}>
              <SectionTitle className={titleInCol}>Ledger.</SectionTitle>
              <ProseBody className={treasuryBody}>
                The Centuries Mutual ledger is the shared record where money, documents, and messages travel together. Settlements
                and escrows post alongside the leases, receipts, amendments, and member messages that belong to the same agreement
                — so auditing, disputes, and day-to-day coordination share one chronological trail instead of splitting across
                inboxes and file folders.
              </ProseBody>
              <ProseBody className={treasuryBody}>
                Economically, Centuries Mutual does not issue a speculative storefront token nor stack percentage rents
                indiscriminately. Revenue aligns with memberships and transparent flat orchestration — everyday members retain
                wallet portability without surrendering escalating cuts as agreements grow.
              </ProseBody>
            </div>
            <LuxuryCard className="w-full shrink-0">
              <dl className="space-y-4 font-sans">
                <div className="border-b border-[#E5E0D5]/80 pb-3">
                  <div className="flex justify-between gap-3 font-mono text-[13px] text-[#14432A]">
                    <span>Network fee</span>
                    <span>a few cents per transfer</span>
                  </div>
                  <p className="mt-1 text-[0.875rem] leading-snug text-[#6B6B66]">Paid to settlement infrastructure supporting fast posts.</p>
                </div>
                <div className="border-b border-[#E5E0D5]/80 pb-3">
                  <div className="flex justify-between gap-3 font-mono text-[13px] text-[#14432A]">
                    <span>Member-to-member</span>
                    <span>no platform fee</span>
                  </div>
                  <p className="mt-1 text-[0.875rem] leading-snug text-[#6B6B66]">Gifting and shared pools omit Centuries Mutual surcharges between members.</p>
                </div>
                <div>
                  <div className="flex justify-between gap-3 font-mono text-[13px] text-[#14432A]">
                    <span>Rent &amp; deposits</span>
                    <span>flat orchestration fee</span>
                  </div>
                  <p className="mt-1 text-[0.875rem] leading-snug text-[#6B6B66]">
                    Lease-aligned flows carry concise flat facilitation instead of escalating rent-percent fees.
                  </p>
                </div>
              </dl>
              <p className="mt-6 border-t border-[#E5E0D5]/80 pt-4 text-[0.8125rem] leading-relaxed text-[#6B6B66]">
                Fees are reviewed openly — Centuries Mutual never abstracts a proportion of contracted rent silently.
              </p>
            </LuxuryCard>
          </div>
        </div>
      </section>

      <TreasuryExpandedBodyContinued />
    </>
  )
}
