import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { Fraunces } from 'next/font/google'
import { TreasuryExpandedBody } from '@/components/treasury/treasury-expanded-body'
import { TopoPattern } from '@/components/ui/topo-pattern'
import { GRAIN_BG } from '@/components/layout/site-header'

const editorial = Fraunces({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-treasury-editorial',
})

const gold = '#A88332'

/** Warm neutral photography — not brand green; pairs with cream overlay for type. */
const HERO_BG =
  'https://images.unsplash.com/photo-1615800098779-1be32e60cca8?q=80&w=2400&auto=format&fit=crop'

export function TreasuryLanding() {
  return (
    <div className={`relative m-0 w-full overflow-x-hidden bg-[#FAFCFB] ${editorial.variable}`}>
      <section className="relative min-h-[min(92vh,880px)] w-full overflow-hidden">
        <Image
          src={HERO_BG}
          alt=""
          fill
          priority
          className="object-cover object-[center_40%]"
          sizes="100vw"
        />
        <div
          className="pointer-events-none absolute inset-0 bg-gradient-to-b from-[#FAF7F0]/93 via-[#F3EDE4]/88 to-[#EDE6DC]/92]"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.06]"
          style={{ backgroundImage: GRAIN_BG, backgroundRepeat: 'repeat', backgroundSize: '220px 220px' }}
          aria-hidden
        />
        <TopoPattern className="pointer-events-none absolute -right-8 top-8 h-56 w-[min(100%,420px)] text-[#0F3D2E] opacity-[0.08] lg:right-[8%] lg:top-16" />

        <div className="relative mx-auto grid min-h-[min(92vh,880px)] max-w-[1600px] grid-cols-1 items-center gap-10 px-6 py-16 lg:grid-cols-2 lg:gap-12 lg:px-10 lg:py-20">
          <div className="flex flex-col justify-center">
            <p className="mb-4 font-sans text-[10px] font-semibold uppercase tracking-[0.28em]" style={{ color: gold }}>
              Treasury
            </p>
            <h1
              className="mb-6 max-w-xl text-3xl font-medium leading-[1.12] tracking-tight text-[#0F3D2E] md:text-4xl lg:text-[2.75rem]"
              style={{ fontFamily: 'var(--font-treasury-editorial), Fraunces, Georgia, serif' }}
            >
              Payments, escrow, and how funds move on Centuries Mutual
            </h1>
            <p className="max-w-md font-sans text-[15px] leading-relaxed text-[#3d4a41]">
              Coordinate rent, deposits, utilities, and peer transfers with flows that respect leases, disputes, and how
              members already message one another.
            </p>
            <div className="mt-10 flex flex-wrap gap-4">
              <Link
                href="/pay"
                className="inline-flex items-center gap-2 rounded-full bg-[#0F3D2E] px-6 py-3 font-sans text-xs font-semibold uppercase tracking-wider text-[#FAFCFB] no-underline shadow-lg transition hover:bg-[#0c3328]"
              >
                Open Pay
                <ArrowRight className="h-4 w-4" aria-hidden />
              </Link>
            </div>
          </div>

          <div className="relative min-h-[280px] overflow-hidden rounded-2xl border border-[#D4C9BC] shadow-[0_24px_64px_rgba(15,51,33,0.12)] lg:min-h-[420px]">
            <Image
              src="/buffalo2.png"
              alt=""
              fill
              className="object-cover object-[center_38%]"
              sizes="(max-width: 1023px) 100vw, 50vw"
              priority
            />
            <div
              className="pointer-events-none absolute inset-0 bg-[linear-gradient(135deg,rgba(250,247,240,0.2)_0%,transparent_50%,rgba(15,61,46,0.12)_100%)]"
              aria-hidden
            />
            <div className="absolute bottom-6 left-6 right-6 rounded-xl border border-[#E5E0D5]/90 bg-[#FAFCFB]/92 px-4 py-3 shadow-sm backdrop-blur-sm">
              <p className="font-sans text-[11px] font-medium uppercase tracking-[0.2em] text-[#A88332]">Flow of funds</p>
              <p className="mt-1 font-sans text-sm leading-snug text-[#0f3321]">
                Routes align with product configuration in your jurisdiction — milestones, escrow, and scheduled release.
              </p>
            </div>
          </div>
        </div>
      </section>

      <TreasuryExpandedBody />
    </div>
  )
}
