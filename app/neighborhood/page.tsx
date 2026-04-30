import type { Metadata } from 'next'
import Footer from '@/components/Footer'
import { NeighborhoodLanding } from '@/components/neighborhood/neighborhood-landing'
import { SiteHeader } from '@/components/layout/site-header'

export const metadata: Metadata = {
  title: 'Neighborhood',
  description: 'Search rooms, neighborhoods, and dates with Centuries Mutual.',
}

interface NeighborhoodPageProps {
  searchParams?: { q?: string }
}

/** Marketing Neighborhood — corridors, listings, and home search context. */
export default function NeighborhoodPage({ searchParams }: NeighborhoodPageProps) {
  const q = searchParams?.q?.trim()

  return (
    <>
      <SiteHeader />
      <main className="m-0 block bg-transparent p-0">
        <NeighborhoodLanding query={q} />
      </main>
      <Footer />
    </>
  )
}
