import type { Metadata } from 'next'
import Footer from '@/components/Footer'
import { SiteHeader } from '@/components/layout/site-header'
import { ShopMain } from '@/components/shop/shop-main'

export const metadata: Metadata = {
  title: 'Shop · Network products | Centuries Mutual',
  description:
    'Custom-built security cameras, WiFi 6E networking, and smart home security systems from Centuries Mutual — enterprise-grade solutions for your home.',
}

export default function ShopPage() {
  return (
    <>
      <SiteHeader />
      <main className="m-0 block bg-transparent p-0">
        <ShopMain />
      </main>
      <Footer />
    </>
  )
}
