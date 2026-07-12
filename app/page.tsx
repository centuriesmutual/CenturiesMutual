import HealthInsuranceWallet from '../components/HealthInsuranceWallet'
import HealthInsurancePay from '../components/HealthInsurancePay'
import HealthInsuranceWellness from '../components/HealthInsuranceWellness'
import HealthInsuranceLegacy from '../components/HealthInsuranceLegacy'
import Footer from '../components/Footer'
import { SiteHeader } from '../components/layout/site-header'
import { CommunityHero } from '../components/hero/community-hero'

export default function Home() {
  return (
    <>
      <SiteHeader />
      <main className="m-0 block bg-transparent p-0">
        <CommunityHero />
        <HealthInsuranceWallet />
        <HealthInsurancePay />
        <HealthInsuranceWellness />
        <HealthInsuranceLegacy />
        <Footer />
      </main>
    </>
  )
}
