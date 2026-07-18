import type { Metadata } from 'next'
import { SiteHeader } from '@/components/layout/site-header'
import Footer from '@/components/Footer'
import { HelpDeskHero } from '@/components/help-desk/help-desk-hero'

export const metadata: Metadata = {
  title: 'Help Desk',
  description:
    'Centuries Mutual Help Desk — reach a Dallas-based member services steward by phone or start a real-time chat with our AI assistant.',
}

export default function HelpDeskPage() {
  return (
    <>
      <SiteHeader />
      <main className="m-0 block bg-transparent p-0">
        <HelpDeskHero />
      </main>
      <Footer />
    </>
  )
}
