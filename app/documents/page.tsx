'use client'

import Navbar from '../../components/Navbar'
import Footer from '../../components/Footer'
import Link from 'next/link'
import Image from 'next/image'
import {
  DocumentTextIcon,
  DocumentCheckIcon,
  ClipboardDocumentListIcon,
  LockClosedIcon,
  ArrowRightIcon
} from '@heroicons/react/24/outline'

export default function DocumentsPage() {
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
                  Document center
                </p>
                <h1 className="display-4 fw-bold mb-4" style={{ fontFamily: "'Playfair Display', serif", lineHeight: 1.12 }}>
                  Documents
                </h1>
                <p className="lead mb-0" style={{ fontSize: '1.15rem', opacity: 0.95, maxWidth: '36rem' }}>
                  Leases, roommate agreements, eSignatures, and audit-friendly records—organized for renters, hosts,
                  and landlords who use Centuries Mutual end to end.
                </p>
              </div>
              <div className="col-lg-6">
                <div className="position-relative mx-auto rounded-4 overflow-hidden" style={{ maxWidth: '520px', height: '260px', boxShadow: '0 24px 48px rgba(0,0,0,0.2)' }}>
                  <Image
                    src="/deer.jpeg"
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

        <section className="py-5 border-bottom" style={{ borderColor: '#e9ecef' }}>
          <div className="container">
            <div className="row g-4">
              {[
                {
                  Icon: DocumentTextIcon,
                  title: 'Digital leases & contracts',
                  text: 'Generate and store lease packages and roommate addenda with clear versioning so everyone knows what was signed and when.'
                },
                {
                  Icon: DocumentCheckIcon,
                  title: 'eDocument system',
                  text: 'Our full eDocument stack supports binding workflows, identity-aligned handoffs, and admissible communications where the product applies.'
                },
                {
                  Icon: ClipboardDocumentListIcon,
                  title: 'Audit & compliance trails',
                  text: 'Track document status, obligations, and review checkpoints—useful for property managers coordinating inspections and renewals.'
                },
                {
                  Icon: LockClosedIcon,
                  title: 'Protected access',
                  text: 'Role-aware access keeps sensitive paperwork visible only to parties who belong in the thread—reducing accidental oversharing.'
                }
              ].map(({ Icon, title, text }) => (
                <div key={title} className="col-md-6">
                  <div className="h-100 p-4 rounded-4" style={{ border: '1px solid #e8ebea', background: '#fafcfb' }}>
                    <Icon className="mb-3" style={{ width: '40px', height: '40px', color: '#14432A' }} />
                    <h2 className="h6 fw-bold mb-2" style={{ color: '#14432A' }}>{title}</h2>
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
              <div className="col-lg-7">
                <h2 className="h4 fw-bold mb-3" style={{ color: '#14432A', fontFamily: "'Playfair Display', serif" }}>
                  Go deeper with the products you already use
                </h2>
                <p className="text-muted mb-4" style={{ lineHeight: 1.7 }}>
                  Start in the eDocument system for day-to-day execution, or explore audit-focused tooling when you need
                  stronger governance across folders, signatures, and event history.
                </p>
                <div className="d-flex flex-wrap gap-3">
                  <Link href="/edocument-system" className="btn btn-lg text-white fw-semibold px-4 py-3 d-inline-flex align-items-center gap-2" style={{ background: '#14432A', borderColor: '#14432A' }}>
                    eDocument system
                    <ArrowRightIcon style={{ width: '18px', height: '18px' }} />
                  </Link>
                  <Link href="/edocuments-audit-tracking" className="btn btn-outline-secondary btn-lg px-4 py-3" style={{ borderColor: '#14432A', color: '#14432A' }}>
                    Audit &amp; tracking
                  </Link>
                </div>
              </div>
              <div className="col-lg-5">
                <div className="p-4 rounded-4 bg-white border" style={{ borderColor: '#e8ebea' }}>
                  <p className="small text-muted mb-2">Also helpful</p>
                  <ul className="list-unstyled mb-0 small">
                    <li className="mb-2">
                      <Link href="/legal" className="text-decoration-none" style={{ color: '#14432A' }}>Legal &amp; privacy →</Link>
                    </li>
                    <li>
                      <Link href="/help-desk" className="text-decoration-none" style={{ color: '#14432A' }}>Help Desk →</Link>
                    </li>
                  </ul>
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
