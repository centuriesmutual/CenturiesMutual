import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { Fraunces } from 'next/font/google'
import { CorridorMapHero } from '@/components/illustrations/corridor-map-hero'
import { NeighborhoodExpandedBody } from '@/components/neighborhood/neighborhood-expanded-body'
import { TopoPattern } from '@/components/ui/topo-pattern'
import { GRAIN_BG } from '@/components/layout/site-header'
import '@/components/illustrations/neighborhood-motion.css'

const editorial = Fraunces({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-neighborhood-editorial',
})

type Props = { query?: string }

export function NeighborhoodLanding({ query }: Props) {
  const q = query?.trim()

  return (
    <div className={`relative m-0 w-full overflow-x-hidden bg-[#FAFCFB] ${editorial.variable}`}>
      <section className="relative min-h-[min(88vh,820px)] w-full overflow-hidden bg-[#0F3D2E]">
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.05]"
          style={{ backgroundImage: GRAIN_BG, backgroundRepeat: 'repeat', backgroundSize: '220px 220px' }}
          aria-hidden
        />
        <TopoPattern className="pointer-events-none absolute bottom-8 left-0 h-48 w-[min(100%,400px)] text-[#C9A961] opacity-[0.1] lg:left-[6%]" />

        <div className="relative mx-auto grid min-h-[min(88vh,820px)] max-w-[1600px] grid-cols-1 items-center gap-10 px-6 py-16 md:grid-cols-2 md:gap-12 lg:px-10 lg:py-20">
          <div className="flex flex-col justify-center">
            <h1
              className="mb-6 max-w-xl text-3xl font-medium leading-[1.12] tracking-tight text-[#FAFCFB] md:text-4xl lg:text-[2.6rem]"
              style={{ fontFamily: 'var(--font-neighborhood-editorial), Fraunces, Georgia, serif' }}
            >
              Corridors, listings, and the search that starts at home
            </h1>
            <p className="max-w-lg font-sans text-[15px] leading-relaxed text-[#E8DFD6]/95">
              Explore rooms, amenities, and dates in one place — paired with the same forest-and-cream experience as the rest
              of Centuries Mutual.
            </p>
            {q ? (
              <p className="mt-6 rounded-xl border border-[#C9A961]/30 bg-[#0a1f18]/60 px-4 py-3 font-sans text-sm text-[#FAFCFB] backdrop-blur-sm">
                Showing context for{' '}
                <span className="font-semibold text-[#C9A961]">&ldquo;{q}&rdquo;</span> — full inventory filters connect under
                release planning.
              </p>
            ) : (
              <p className="mt-6 font-sans text-sm text-[#E8DFD6]/85">
                Start from the home search bar, or browse corridors as we expand coverage.
              </p>
            )}
          </div>

          <div className="flex min-h-0 flex-row items-stretch gap-4 sm:gap-6">
            <Link
              href="/"
              className="inline-flex shrink-0 items-center justify-center gap-2 self-center rounded-full border border-[#FAFCFB]/35 bg-transparent px-4 py-3 font-sans text-[10px] font-semibold uppercase tracking-wider text-[#FAFCFB] no-underline transition hover:bg-[#FAFCFB]/10 sm:px-5 sm:py-3.5"
            >
              Back to home search
              <ArrowRight className="h-4 w-4 shrink-0" aria-hidden />
            </Link>
            <div className="relative flex min-h-[220px] min-w-0 flex-1 flex-col overflow-hidden rounded-2xl border border-[#C9A961]/25 bg-[#FAFCFB] p-4 shadow-[0_24px_80px_rgba(0,0,0,0.35)] sm:min-h-[320px] sm:p-5 md:min-h-[400px]">
              <CorridorMapHero className="min-h-0 w-full flex-1" />
            </div>
          </div>
        </div>
      </section>

      <NeighborhoodExpandedBody />
    </div>
  )
}
