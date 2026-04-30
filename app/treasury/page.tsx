import Footer from '@/components/Footer'
import { SiteHeader } from '@/components/layout/site-header'
import { TreasuryLanding } from '@/components/treasury/treasury-landing'

export default function TreasuryPage() {
  return (
    <>
      <SiteHeader />
      <main className="m-0 block bg-transparent p-0">
        <TreasuryLanding />
      </main>
      <Footer />
    </>
  )
}
