'use client'

import Navbar from '../../components/Navbar'
import Footer from '../../components/Footer'
import Link from 'next/link'
import Image from 'next/image'
import {
  GlobeAltIcon,
  ChatBubbleLeftRightIcon,
  UserGroupIcon,
  HomeIcon,
  CubeIcon,
  ArrowRightIcon
} from '@heroicons/react/24/outline'

export default function NetworkPage() {
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
                  Centuries Mutual Network
                </p>
                <h1 className="display-4 fw-bold mb-4" style={{ fontFamily: "'Playfair Display', serif", lineHeight: 1.12 }}>
                  Your community brokerage layer
                </h1>
                <p className="lead mb-4" style={{ fontSize: '1.2rem', opacity: 0.95, maxWidth: '36rem' }}>
                  One connected experience for profiles, messaging, listings, and discovery—whether you rent,
                  host, or invest with Centuries Mutual on web or mobile.
                </p>
                <div className="d-flex flex-wrap gap-3">
                  <Link href="/neighborhood" className="btn btn-light btn-lg px-4 py-3">
                    Browse rooms
                  </Link>
                  <Link href="/learnmore/network" className="btn btn-outline-light btn-lg px-4 py-3">
                    How it works
                  </Link>
                </div>
              </div>
              <div className="col-lg-6">
                <div className="position-relative mx-auto rounded-4 overflow-hidden" style={{ maxWidth: '520px', height: '300px', boxShadow: '0 24px 48px rgba(0,0,0,0.2)' }}>
                  <Image
                    src="/mountians.jpeg"
                    alt="Centuries Mutual network"
                    fill
                    priority
                    sizes="(max-width: 992px) 100vw, 520px"
                    style={{ objectFit: 'cover' }}
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-5 border-bottom" style={{ borderColor: '#e9ecef' }}>
          <div className="container">
            <div className="row justify-content-center mb-5">
              <div className="col-lg-9 text-center">
                <h2 className="h3 fw-bold mb-3" style={{ color: '#14432A', fontFamily: "'Playfair Display', serif" }}>
                  Built for how people actually move and connect
                </h2>
                <p className="text-muted mb-0" style={{ fontSize: '1.05rem', lineHeight: 1.7 }}>
                  The network brings together trusted identities, clear listings, and secure chat so landlords,
                  tenants, and hosts can coordinate without losing context—aligned with the same brokerage standards
                  you expect from Centuries Mutual.
                </p>
              </div>
            </div>

            <div className="row g-4">
              {[
                {
                  Icon: UserGroupIcon,
                  title: 'Profiles & trust',
                  text: 'Verified-style signals and consistent profiles help everyone know who they are working with before they sign or pay.'
                },
                {
                  Icon: ChatBubbleLeftRightIcon,
                  title: 'Messaging',
                  text: 'Keep negotiations, reminders, and handoffs in one thread instead of scattered apps and screenshots.'
                },
                {
                  Icon: HomeIcon,
                  title: 'Listings & rooms',
                  text: 'Surface compatible spaces and roommates with tools designed for real rental workflows, not generic ads.'
                },
                {
                  Icon: GlobeAltIcon,
                  title: 'Open ecosystem',
                  text: 'Connects to our broader services—documents, payments, and support—so the network is an entry point, not a dead end.'
                }
              ].map(({ Icon, title, text }) => (
                <div key={title} className="col-md-6 col-lg-3">
                  <div className="h-100 p-4 rounded-4" style={{ border: '1px solid #e8ebea', background: '#fafcfb' }}>
                    <Icon style={{ width: '36px', height: '36px', color: '#14432A' }} className="mb-3" />
                    <h3 className="h6 fw-bold mb-2" style={{ color: '#14432A' }}>{title}</h3>
                    <p className="text-muted small mb-0" style={{ lineHeight: 1.65 }}>{text}</p>
                  </div>
                </div>
              ))}
                 </div>
          </div>
        </section>

        <section className="py-5 bg-light">
          <div className="container">
            <div className="row align-items-center g-4">
              <div className="col-lg-6 order-lg-2">
                <h2 className="h3 fw-bold mb-3" style={{ color: '#14432A', fontFamily: "'Playfair Display', serif" }}>
                  Blockchain-ready when you need proof, not hype
                </h2>
                <p className="text-muted mb-4" style={{ lineHeight: 1.7 }}>
                  For agreements and activity that should be tamper-evident, Centuries Mutual ties into our blockchain
                  stack. Use the network for day-to-day collaboration; rely on blockchain-backed tools when immutability
                  matters for your deals.
                </p>
                <Link href="/blockchain" className="btn btn-lg d-inline-flex align-items-center gap-2 text-white fw-semibold px-4 py-3" style={{ background: '#14432A', borderColor: '#14432A' }}>
                  <CubeIcon style={{ width: '22px', height: '22px' }} />
                  Explore blockchain
                  <ArrowRightIcon style={{ width: '18px', height: '18px' }} />
                </Link>
              </div>
              <div className="col-lg-6 order-lg-1">
                <div className="position-relative rounded-4 overflow-hidden" style={{ height: '260px' }}>
                  <Image src="/deer.jpeg" alt="" fill sizes="(max-width: 992px) 100vw, 50vw" style={{ objectFit: 'cover' }} />
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-5">
          <div className="container text-center">
            <h2 className="h5 fw-bold mb-3" style={{ color: '#14432A' }}>Need hardware or deeper technical docs?</h2>
            <p className="text-muted mb-4 mx-auto" style={{ maxWidth: '540px' }}>
              Shop network products or read the extended technical overview for power users and partners.
            </p>
            <div className="d-flex flex-wrap gap-3 justify-content-center">
              <Link href="/shop" className="btn btn-outline-secondary btn-lg px-4" style={{ borderColor: '#14432A', color: '#14432A' }}>
                Shop
              </Link>
              <Link href="/help-desk" className="btn btn-link btn-lg text-decoration-none" style={{ color: '#14432A' }}>
                Help desk →
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
