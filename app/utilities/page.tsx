'use client'

import Navbar from '../../components/Navbar'
import Footer from '../../components/Footer'
import Link from 'next/link'
import Image from 'next/image'
import {
  BoltIcon,
  DevicePhoneMobileIcon,
  CreditCardIcon,
  CloudArrowDownIcon,
  WrenchScrewdriverIcon
} from '@heroicons/react/24/outline'

export default function UtilitiesPage() {
  return (
    <>
      <Navbar />
      <main>
        <section className="py-5" style={{
          background: 'linear-gradient(135deg, #14432A 0%, #206542 100%)',
          color: 'white'
        }}>
          <div className="container py-4 py-lg-5">
            <div className="row align-items-center">
              <div className="col-lg-6 mb-4 mb-lg-0">
                <p className="small text-uppercase fw-semibold mb-2" style={{ letterSpacing: '0.08em', opacity: 0.9 }}>
                  Member utilities
                </p>
                <h1 className="display-4 fw-bold mb-4" style={{ fontFamily: "'Playfair Display', serif", lineHeight: 1.12 }}>
                  Utilities
                </h1>
                <p className="lead mb-0" style={{ fontSize: '1.15rem', opacity: 0.95, maxWidth: '36rem' }}>
                  Practical tools for accounts, devices, downloads, and everyday transactions on the Centuries Mutual
                  platform—built so brokerage workflows stay fast and coherent.
                </p>
              </div>
              <div className="col-lg-6">
                <div className="position-relative mx-auto rounded-4 overflow-hidden" style={{ maxWidth: '520px', height: '260px', boxShadow: '0 24px 48px rgba(0,0,0,0.2)' }}>
                  <Image
                    src="/mountians.jpeg"
                    alt=""
                    fill
                    sizes="(max-width: 992px) 100vw, 520px"
                    style={{ objectFit: 'cover' }}
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-5">
          <div className="container">
            <div className="row justify-content-center mb-5">
              <div className="col-lg-9 text-center">
                <h2 className="h3 fw-bold mb-3" style={{ color: '#14432A', fontFamily: "'Playfair Display', serif" }}>
                  What we mean by utilities
                </h2>
                <p className="text-muted mb-0" style={{ lineHeight: 1.7 }}>
                  Not energy bills—platform utilities: the apps, payment rails, and configuration surfaces that keep your
                  Centuries Mutual experience running, whether you list a room, manage a lease, or use secure messaging.
                </p>
              </div>
            </div>

            <div className="row g-4">
              {[
                {
                  Icon: DevicePhoneMobileIcon,
                  title: 'Apps & downloads',
                  text: 'Install mobile clients and grab updates from our downloads center so you stay on supported builds with the latest fixes.'
                },
                {
                  Icon: CreditCardIcon,
                  title: 'Payments & billing',
                  text: 'Use platform-grade checkout and account billing where offered—aligned with the same trust layer as your brokerage activity.'
                },
                {
                  Icon: BoltIcon,
                  title: 'Account tools',
                  text: 'Manage profile, notifications, and connected services from one place instead of hunting through disconnected dashboards.'
                },
                {
                  Icon: CloudArrowDownIcon,
                  title: 'Resources',
                  text: 'Access guides, templates, and onboarding materials published for landlords, tenants, and hosts using Centuries Mutual.'
                },
                {
                  Icon: WrenchScrewdriverIcon,
                  title: 'Network & devices',
                  text: 'When your plan includes connected hardware or network products, utilities tie those assets back to support and warranty workflows.'
                }
              ].map(({ Icon, title, text }) => (
                <div key={title} className="col-md-6 col-lg-4">
                  <div className="h-100 p-4 rounded-4" style={{ border: '1px solid #e8ebea', background: '#fafcfb' }}>
                    <Icon className="mb-3" style={{ width: '38px', height: '38px', color: '#14432A' }} />
                    <h3 className="h6 fw-bold mb-2" style={{ color: '#14432A' }}>{title}</h3>
                    <p className="text-muted small mb-0" style={{ lineHeight: 1.65 }}>{text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-5 bg-light border-top" style={{ borderColor: '#e9ecef' }}>
          <div className="container text-center">
            <p className="text-muted mb-4">Ready to jump in?</p>
            <div className="d-flex flex-wrap gap-3 justify-content-center">
              <Link href="/downloads" className="btn btn-lg text-white fw-semibold px-4 py-3" style={{ background: '#14432A', borderColor: '#14432A' }}>
                Downloads
              </Link>
              <Link href="/shop" className="btn btn-outline-secondary btn-lg px-4 py-3" style={{ borderColor: '#14432A', color: '#14432A' }}>
                Shop
              </Link>
              <Link href="/help-desk" className="btn btn-link btn-lg text-decoration-none" style={{ color: '#14432A' }}>
                Help Desk →
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
