import Link from 'next/link'
import {
  ArrowDownTrayIcon,
  BoltIcon,
  CalendarDaysIcon,
  CheckBadgeIcon,
  DocumentTextIcon,
  HeartIcon,
  HomeIcon,
  KeyIcon,
  LinkIcon,
  MagnifyingGlassIcon,
  NewspaperIcon,
  ScaleIcon,
  ShieldCheckIcon,
  UserGroupIcon,
} from '@heroicons/react/24/outline'
import { AgreementRowCheck, NeighborhoodAgreementsDocFan } from '@/components/illustrations/neighborhood-agreements'
import { CorridorMapHero } from '@/components/illustrations/corridor-map-hero'
import { LeaseAgreementPanelHeader } from '@/components/illustrations/lease-agreement-header'
import {
  IllustrationHost,
  IllustrationLandlord,
  IllustrationLongTermTenant,
  IllustrationNewToCity,
  NeighborhoodClosingOrnament,
} from '@/components/illustrations/neighborhood-built-life'
import {
  IllustrationKnowsWhatsDue,
  IllustrationRecordsEveryStep,
  IllustrationResolvesDisputes,
  IllustrationTriggersAction,
} from '@/components/illustrations/neighborhood-live-agreement'
import { NeighborhoodRecordsTimeline } from '@/components/illustrations/neighborhood-records-timeline'
import {
  IllustrationStepBelong,
  IllustrationStepMatch,
  IllustrationStepMoveIn,
  IllustrationStepVerify,
  NeighborhoodStepsFlowDesktop,
  NeighborhoodStepsFlowMobile,
} from '@/components/illustrations/neighborhood-steps'
import {
  IllustrationConnectedNotScattered,
  IllustrationSearchableSeconds,
  IllustrationYoursToKeep,
} from '@/components/illustrations/neighborhood-why-record'
import {
  IllustrationListingsNearby,
  IllustrationLocalNewspaper,
  IllustrationPeopleLiveWith,
  IllustrationSharedStandards,
} from '@/components/illustrations/neighborhood-what-you-find'
import { Eyebrow, LuxuryCard, ProseBody, SectionTitle } from '@/components/treasury/treasury-luxury'
import { cn } from '@/lib/utils'
import '@/components/illustrations/neighborhood-motion.css'

const serifCard = 'font-serif font-semibold text-[1.125rem] leading-snug text-[#14432A]'
const bodySm = 'font-sans text-[0.9375rem] leading-[1.65] text-[#3d4a41]'
const iconWrap = 'relative mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-[#14432A]/[0.08] text-[#14432A]'
const stepNum =
  'flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 border-[#C9A53E] bg-[#FAFCFB] font-serif text-sm font-semibold text-[#14432A]'

/** Body sections below Neighborhood hero — aligns with Treasury luxury system */
export function NeighborhoodExpandedBody() {
  return (
    <>
      <section className="border-t border-[#E5E0D5]/90 bg-[#FAFCFB] py-20 md:py-28">
        <div className="mx-auto max-w-[1200px] px-6 lg:px-10">
          <Eyebrow>Neighborhood</Eyebrow>
          <SectionTitle>A neighborhood is more than a map.</SectionTitle>
          <ProseBody className="mt-6">
            Neighborhood is the part of Centuries Mutual where you find homes, find people you can live beside, and find the quiet
            rhythms — coffee runs, stoop greetings, hallway hellos — that make a corridor feel worth coming back to. It is framed
            as real place, not a feed.
          </ProseBody>
          <div className="mt-14 grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-16">
            <div>
              <p className="max-w-[65ch] font-sans text-[15px] leading-[1.65] text-[#3d4a41]">
                Strong neighborhoods depend on everyday trust among people who happen to share a block — small favors, respectful
                noise, candor when something is off. Centuries Mutual is structured to support those human acts of care instead of
                trying to automate them away.
              </p>
            </div>
            <LuxuryCard className="overflow-hidden p-0">
              <div className="relative bg-[#FAFCFB] p-4 sm:p-5">
                <CorridorMapHero />
              </div>
            </LuxuryCard>
          </div>
        </div>
      </section>

      <section className="border-t border-[#E5E0D5]/80 bg-[#E8DFD6]/35 py-20 md:py-28">
        <div className="mx-auto max-w-[1150px] px-6 lg:px-10">
          <SectionTitle>What you&apos;ll find in your Neighborhood.</SectionTitle>
          <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2">
            {[
              {
                Icon: HomeIcon,
                title: 'Listings nearby',
                body:
                  'See homes open in the corridors you choose — framed with clarity on terms, timeline, and what life there actually asks of you.',
              },
              {
                Icon: UserGroupIcon,
                title: "People you'd actually live with",
                body:
                  'Patterns and preferences steer who surfaces for you — not just whoever tapped apply first yesterday afternoon.',
              },
              {
                Icon: NewspaperIcon,
                title: 'Local Newspaper',
                body:
                  'A steady, human-scale feed about the corridor — notes and news selected to be useful when you decide where home should be.',
              },
              {
                Icon: CheckBadgeIcon,
                title: 'Shared standards',
                body:
                  'Homes and hosts meet the same baseline of verification so you compare options on substance, not guesswork.',
              },
            ].map(({ Icon, title, body }) => {
              const TopIllu =
                title === 'Listings nearby'
                  ? IllustrationListingsNearby
                  : title === "People you'd actually live with"
                    ? IllustrationPeopleLiveWith
                    : title === 'Local Newspaper'
                      ? IllustrationLocalNewspaper
                      : IllustrationSharedStandards
              return (
                <LuxuryCard key={title}>
                  <span className="pointer-events-none absolute right-5 top-5 h-1.5 w-1.5 rotate-45 bg-[#C9A53E]" aria-hidden />
                  <TopIllu className="mb-4" />
                  <div className={iconWrap}>
                    <Icon className="h-6 w-6" aria-hidden />
                  </div>
                  <h3 className={cn(serifCard)}>{title}</h3>
                  <p className={cn(bodySm, 'mt-3')}>{body}</p>
                </LuxuryCard>
              )
            })}
          </div>
        </div>
      </section>

      <section className="border-t border-[#E5E0D5]/80 bg-[#FAFCFB] py-20 md:py-28">
        <div className="mx-auto max-w-[1200px] px-6 lg:px-10">
          <SectionTitle>How a Centuries Mutual neighborhood comes together.</SectionTitle>
          <div className="relative mt-14">
            <NeighborhoodStepsFlowDesktop />
            <NeighborhoodStepsFlowMobile />
            <div className="grid grid-cols-1 gap-10 md:grid-cols-4 md:gap-4">
              {[
                {
                  Icon: ShieldCheckIcon,
                  title: 'Verify',
                  StepIllu: IllustrationStepVerify,
                  body: 'You confirm identity and accountability practices align with how you already show up — no anonymous corners.',
                },
                {
                  Icon: UserGroupIcon,
                  title: 'Match',
                  StepIllu: IllustrationStepMatch,
                  body: 'You discover homes and people whose routines honestly fit yours before anyone signs anything.',
                },
                {
                  Icon: KeyIcon,
                  title: 'Move in',
                  StepIllu: IllustrationStepMoveIn,
                  body: 'Agreements settle into the record, deposits sit in Treasury, and possession changes without loose ends.',
                },
                {
                  Icon: HeartIcon,
                  title: 'Belong',
                  StepIllu: IllustrationStepBelong,
                  body:
                    'The small rituals and shared norms that define a corridor keep compounding — the record keeps pace quietly behind them.',
                },
              ].map(({ Icon, title, body, StepIllu }, idx) => (
                <LuxuryCard key={title} className="relative pt-8 md:pt-10">
                  <div className="absolute left-1/2 top-0 flex -translate-x-1/2 md:left-12 md:translate-x-0">
                    <span className={stepNum}>{idx + 1}</span>
                  </div>
                  <StepIllu className="mb-3" />
                  <div className={cn(iconWrap, 'mx-auto md:mx-0')}>
                    <Icon className="h-6 w-6" aria-hidden />
                  </div>
                  <h3 className={cn(serifCard, 'text-center md:text-left')}>{title}</h3>
                  <p className={cn(bodySm, 'mt-3 text-center text-[15px] md:text-left')}>{body}</p>
                </LuxuryCard>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="border-t border-[#E5E0D5]/80 bg-[#E8DFD6]/35 py-20 md:py-28">
        <div className="mx-auto max-w-[1100px] px-6 lg:px-10">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
            <div>
              <SectionTitle className="mb-8">Records that hold up.</SectionTitle>
              <ProseBody>
                Every consequential moment across a Neighborhood — a viewing, an application decision, verification, signatures,
                Treasury movements, decisive messages — rests in structured, searchable history you can open yourself.
              </ProseBody>
              <ProseBody className="mt-6">
                That is how later questions settle without devolving into &ldquo;I said, you said.&rdquo; The record preserves what happened,
                visibly and fairly.
              </ProseBody>
            </div>
            <LuxuryCard>
              <NeighborhoodRecordsTimeline />
              <p className="mt-8 border-t border-[#E5E0D5]/80 pt-4 text-[0.8125rem] leading-relaxed text-[#6B6B66]">
                Members can request a full export of their record at any time.
              </p>
            </LuxuryCard>
          </div>
        </div>
      </section>

      <section className="border-t border-[#E5E0D5]/80 bg-[#FAFCFB] py-20 md:py-28">
        <div className="mx-auto max-w-[1100px] px-6 lg:px-10">
          <SectionTitle>Why this kind of record matters.</SectionTitle>
          <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-3">
            {[
              {
                Icon: MagnifyingGlassIcon,
                title: 'Searchable in seconds',
                WhyIllu: IllustrationSearchableSeconds,
                body:
                  'Structured facts mean finding the hinge moment you care about instantly — instead of excavating chats and screenshots.',
              },
              {
                Icon: LinkIcon,
                title: 'Connected, not scattered',
                WhyIllu: IllustrationConnectedNotScattered,
                body:
                  'Events thread together logically: deposits know their lease lines, replies know which inquiry they settled.',
              },
              {
                Icon: ArrowDownTrayIcon,
                title: 'Yours to keep',
                WhyIllu: IllustrationYoursToKeep,
                body: 'Exports land in formats you control — archives for yourself or evidence another process genuinely needs.',
              },
            ].map(({ Icon, title, body, WhyIllu }) => (
              <LuxuryCard key={title}>
                <WhyIllu className="mb-4" />
                <div className={iconWrap}>
                  <Icon className="h-6 w-6" aria-hidden />
                </div>
                <h3 className={serifCard}>{title}</h3>
                <p className={cn(bodySm, 'mt-3')}>{body}</p>
              </LuxuryCard>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-[#E5E0D5]/80 bg-[#E8DFD6]/35 py-20 md:py-28">
        <div className="mx-auto max-w-[1100px] px-6 lg:px-10">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
            <div>
              <SectionTitle className="mb-8">Agreements that mean what they say.</SectionTitle>
              <ProseBody>
                Leases, addenda, and structured agreements assemble from deliberate plain-language patterns, signed digitally with binding effect, archived beside the broader member record — not orphaned in stray folders.
              </ProseBody>
              <ProseBody className="mt-6">
                Agreements stay alive alongside reality: reminders know due dates automatically, deposit returns reference conditions already written, milestones completed here generate the next warranted step automatically.
              </ProseBody>
            </div>
            <div className="space-y-4">
              <NeighborhoodAgreementsDocFan />
              <LuxuryCard className="overflow-hidden p-0">
                <LeaseAgreementPanelHeader />
                <ul className="divide-y divide-[#E5E0D5]/70 bg-[#FAFCFB] px-5 py-2 font-sans text-[13px] text-[#3d4a41]">
                  <li className="flex justify-between gap-4 py-2.5">
                    <span className="flex items-center gap-2 text-[#6B6B66]">
                      <AgreementRowCheck /> Parties
                    </span>
                    <span>Member · Property holder</span>
                  </li>
                  <li className="flex justify-between gap-4 py-2.5">
                    <span className="flex items-center gap-2 text-[#6B6B66]">
                      <AgreementRowCheck /> Term
                    </span>
                    <span className="font-mono text-xs text-[#242926]">12 months · renewing</span>
                  </li>
                  <li className="flex justify-between gap-4 py-2.5">
                    <span className="flex items-center gap-2 text-[#6B6B66]">
                      <AgreementRowCheck /> Monthly rent
                    </span>
                    <span className="font-mono text-[#14432A]">···</span>
                  </li>
                  <li className="flex justify-between gap-4 py-2.5">
                    <span className="flex items-center gap-2 text-[#6B6B66]">
                      <AgreementRowCheck /> Deposit
                    </span>
                    <span className="font-mono text-[#242926]">Held · Treasury</span>
                  </li>
                  <li className="flex items-center justify-between gap-4 py-2.5">
                    <span className="flex items-center gap-2 text-[#6B6B66]">
                      <AgreementRowCheck /> Status
                    </span>
                    <span className="flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full bg-[#C9A53E] shadow-[0_0_10px_rgba(201,169,62,0.7)]" />
                      <span className="font-medium text-[#14432A]">Active</span>
                    </span>
                  </li>
                </ul>
              </LuxuryCard>
              <div className="flex flex-wrap justify-center gap-6 font-sans text-[11px] font-semibold uppercase tracking-[0.12em] text-[#14432A]">
                {['Signed', 'Stored', 'Live'].map((label) => (
                  <span key={label} className="inline-flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rotate-45 bg-[#C9A53E]" aria-hidden /> {label}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-t border-[#E5E0D5]/80 bg-[#FAFCFB] py-20 md:py-28">
        <div className="mx-auto max-w-[1150px] px-6 lg:px-10">
          <SectionTitle>What a live agreement does for you.</SectionTitle>
          <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2">
            {[
              {
                Icon: CalendarDaysIcon,
                title: "Knows what's due",
                LiveIllu: IllustrationKnowsWhatsDue,
                body:
                  'Rent cadence, deposit conditions, recurring obligations tracked — fewer calendar surprises drifting back as conflict.',
              },
              {
                Icon: BoltIcon,
                title: 'Triggers the right action',
                LiveIllu: IllustrationTriggersAction,
                body: 'When finances or filings must advance, choreography happens without someone manually re-reading every clause.',
              },
              {
                Icon: DocumentTextIcon,
                title: 'Records every step',
                LiveIllu: IllustrationRecordsEveryStep,
                body: 'Each consequential action cites the controlling agreement — timelines stay explainable.',
              },
              {
                Icon: ScaleIcon,
                title: 'Resolves disputes with the receipts',
                LiveIllu: IllustrationResolvesDisputes,
                body:
                  'Formal resolution rests on impartial sequence data — anchored to what unfolded, visible to everyone implicated.',
              },
            ].map(({ Icon, title, body, LiveIllu }) => (
              <LuxuryCard key={title}>
                <span className="pointer-events-none absolute right-5 top-5 h-1.5 w-1.5 rotate-45 bg-[#C9A53E]" aria-hidden />
                <LiveIllu className="mb-4" />
                <div className={iconWrap}>
                  <Icon className="h-6 w-6" aria-hidden />
                </div>
                <h3 className={cn(serifCard)}>{title}</h3>
                <p className={cn(bodySm, 'mt-3')}>{body}</p>
              </LuxuryCard>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-[#E5E0D5]/80 bg-[#E8DFD6]/35 py-20 md:py-28">
        <div className="mx-auto max-w-[1150px] px-6 lg:px-10">
          <SectionTitle>Built around real life.</SectionTitle>
          <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2">
            {[
              {
                title: 'For a long-term tenant',
                body:
                  'You meet place and household with compatible cadence — agreements scaffold themselves so daily life can occupy center stage.',
                PanelIllu: IllustrationLongTermTenant,
              },
              {
                title: 'For a landlord',
                body:
                  'Verified applicants arrive with narrative context; leases articulate plainly; Treasury handles deposits cleanly alongside rent timelines.',
                PanelIllu: IllustrationLandlord,
              },
              {
                title: 'For a host',
                body:
                  'Shared ledgers illuminate who covered what — agreements keep micro-frictions from calcifying silently.',
                PanelIllu: IllustrationHost,
              },
              {
                title: 'For someone new to a city',
                body:
                  'Verification gives you footing where relationships have not formed yet — you step into corridors already upheld by communal standards.',
                PanelIllu: IllustrationNewToCity,
              },
            ].map((panel) => {
              const PanelIllu = panel.PanelIllu
              return (
              <LuxuryCard key={panel.title} className="grid grid-cols-1 gap-6 p-0 sm:grid-cols-[minmax(0,160px)_1fr] sm:p-0">
                <div className="flex min-h-[120px] items-center justify-center bg-[#14432A]/[0.06] p-4 sm:min-h-[120px]">
                  <PanelIllu />
                </div>
                <div className="p-6 sm:py-8">
                  <h3 className="font-serif text-[1.25rem] font-semibold text-[#14432A]" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
                    {panel.title}
                  </h3>
                  <p className="mt-3 font-sans text-[15px] leading-[1.65] text-[#3d4a41]">{panel.body}</p>
                </div>
              </LuxuryCard>
              )
            })}
            <div className="col-span-1 md:col-span-2">
              <NeighborhoodClosingOrnament />
            </div>
          </div>
        </div>
      </section>

      <section className="border-t border-[#E5E0D5]/90 bg-[#14432A] py-24">
        <div className="relative mx-auto max-w-[900px] overflow-hidden rounded-3xl border border-[#C9A53E]/30 bg-[linear-gradient(140deg,#0f3321_0%,#14432A_52%,#0f3d28_100%)] px-8 py-14 md:px-16">
          <div className="pointer-events-none absolute right-10 top-8 flex gap-1 opacity-65" aria-hidden>
            {[0, 1, 2].map((i) => (
              <span key={i} className="inline-block h-4 w-4 rotate-45 border border-[#C9A53E]/60" />
            ))}
          </div>
          <h2
            className="max-w-lg font-serif text-[clamp(1.75rem,3.5vw,2.35rem)] font-semibold leading-[1.18] tracking-[-0.02em] text-[#FAFCFB]"
            style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
          >
            Find your Neighborhood
          </h2>
          <p className="mt-4 max-w-[55ch] font-sans text-[15px] leading-[1.65] text-[#E8DFD6]/95">
            Browse what is available and meet people already held to the same standards you expect at home.
          </p>
          <div className="mt-10 flex flex-col gap-4 sm:flex-row">
            <Link
              href="/neighborhood"
              className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-[#b8943a] to-[#C9A53E] px-8 py-3.5 font-sans text-sm font-semibold uppercase tracking-wider text-[#0f3321] no-underline shadow-lg transition hover:brightness-105"
            >
              Browse listings
            </Link>
            <Link
              href="/network"
              className="inline-flex items-center justify-center rounded-full border-2 border-[#FAFCFB]/40 px-8 py-3.5 font-sans text-sm font-semibold text-[#FAFCFB] no-underline transition hover:border-[#C9A53E]"
            >
              Find roommates
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
