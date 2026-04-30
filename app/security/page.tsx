'use client'

import Navbar from '../../components/Navbar'
import Footer from '../../components/Footer'
import Link from 'next/link'
import Image from 'next/image'
import {
  ShieldCheckIcon,
  LockClosedIcon,
  EyeIcon,
  IdentificationIcon,
  ServerStackIcon,
  DocumentCheckIcon
} from '@heroicons/react/24/outline'

export default function SecurityPage() {
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
                  Trust &amp; protection
                </p>
                <h1 className="display-4 fw-bold mb-4" style={{ fontFamily: "'Playfair Display', serif", lineHeight: 1.15 }}>
                  Security at Centuries Mutual
                </h1>
                <p className="lead mb-4" style={{ fontSize: '1.2rem', opacity: 0.95, maxWidth: '34rem' }}>
                  A unified approach to keeping identities, documents, payments, and conversations safe across our brokerage, 
                  blockchain tools, and community network.
                </p>
                <div className="d-flex flex-wrap gap-3">
                  <Link href="/in-house-security" className="btn btn-light btn-lg px-4 py-3">
                    In-house systems
                  </Link>
                  <Link href="/learnmore/security-system" className="btn btn-outline-light btn-lg px-4 py-3">
                    Technical overview
                  </Link>
                </div>
              </div>
              <div className="col-lg-6">
                <div className="position-relative mx-auto" style={{ maxWidth: '520px', height: '320px', borderRadius: '20px', overflow: 'hidden', boxShadow: '0 24px 48px rgba(0,0,0,0.2)' }}>
                  <Image
                    src="/Bison.jpeg"
                    alt="Centuries Mutual security"
                    fill
                    priority
                    sizes="(max-width: 992px) 100vw, 520px"
                    style={{ objectFit: 'cover' }}
                  />
                  <div className="position-absolute bottom-0 start-0 end-0 p-4" style={{ background: 'linear-gradient(transparent, rgba(20,40,30,0.85))' }}>
                    <p className="mb-0 small" style={{ opacity: 0.95 }}>
                      Defense in depth—from account safeguards to optional in-house hardware.
                    </p>
                  </div>
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
                  What we protect
                </h2>
                <p className="text-muted mb-0" style={{ fontSize: '1.05rem', lineHeight: 1.7 }}>
                  Members, hosts, landlords, and tenants rely on Centuries Mutual for rentals, eDocuments, messaging, and payments. 
                  Our security program is designed around those workflows—minimizing risk while keeping experiences fast and clear.
                </p>
              </div>
            </div>

            <div className="row g-4">
              {[
                {
                  Icon: LockClosedIcon,
                  title: 'Data in transit & at rest',
                  text: 'Strong encryption and modern transport protect sessions, uploads, and sensitive fields wherever the platform stores or moves them.'
                },
                {
                  Icon: IdentificationIcon,
                  title: 'Identity & access',
                  text: 'Sign-in flows, verification, and role-aware access reduce account takeover and help ensure the right people see the right leases and messages.'
                },
                {
                  Icon: DocumentCheckIcon,
                  title: 'Documents & auditability',
                  text: 'eDocument and agreement flows pair policy controls with traceable history so critical paperwork stays defensible and organized.'
                },
                {
                  Icon: ShieldCheckIcon,
                  title: 'Trust & abuse signals',
                  text: 'Trust tooling and monitoring patterns complement human review to surface anomalies across listings, chats, and financial touchpoints.'
                },
                {
                  Icon: EyeIcon,
                  title: 'Privacy by design',
                  text: 'We limit collection to what supports the service, segment environments where possible, and align with the commitments described in our Legal center.'
                },
                {
                  Icon: ServerStackIcon,
                  title: 'Resilient infrastructure',
                  text: 'Hardened hosting, patching discipline, and segregation between critical systems underpin uptime and recovery expectations for production workloads.'
                }
              ].map(({ Icon, title, text }) => (
                <div key={title} className="col-md-6 col-lg-4">
                  <div className="h-100 p-4 rounded-4" style={{ border: '1px solid #e8ebea', background: '#fafcfb' }}>
                    <Icon className="mb-3" style={{ width: '40px', height: '40px', color: '#14432A' }} />
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
                  Physical security, built in-house
                </h2>
                <p className="text-muted mb-4" style={{ lineHeight: 1.7 }}>
                  Beyond software, Centuries Mutual designs and manufactures select security hardware for environments that need 
                  bespoke cameras, firmware, and fleet management—ideal for properties and operations that want one accountable partner.
                </p>
                <Link href="/in-house-security" className="btn btn-lg px-4 py-3 text-white fw-semibold" style={{ background: '#14432A', borderColor: '#14432A' }}>
                  Explore in-house security
                </Link>
              </div>
              <div className="col-lg-6 order-lg-1">
                <div className="position-relative rounded-4 overflow-hidden" style={{ height: '280px' }}>
                  <Image src="/deer.jpeg" alt="Platform security" fill sizes="(max-width: 992px) 100vw, 50vw" style={{ objectFit: 'cover' }} />
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-5">
          <div className="container">
            <div className="row justify-content-center">
              <div className="col-lg-8 text-center">
                <h2 className="h4 fw-bold mb-3" style={{ color: '#14432A' }}>
                  Questions or incident reporting?
                </h2>
                <p className="text-muted mb-4">
                  Use our Help desk for account issues, or reach out if you believe you have discovered a vulnerability affecting Centuries Mutual customers.
                </p>
                <div className="d-flex flex-wrap gap-3 justify-content-center">
                  <Link href="/help-desk" className="btn btn-outline-secondary btn-lg px-4" style={{ borderColor: '#14432A', color: '#14432A' }}>
                    Help desk
                  </Link>
                  <Link href="/legal" className="btn btn-link btn-lg text-decoration-none" style={{ color: '#14432A' }}>
                    Legal &amp; privacy →
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
