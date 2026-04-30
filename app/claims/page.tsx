'use client'

import Navbar from '../../components/Navbar'
import Footer from '../../components/Footer'
import Link from 'next/link'
import Image from 'next/image'
import {
  ScaleIcon,
  ClockIcon,
  ShieldCheckIcon,
  MagnifyingGlassIcon,
  ArrowRightIcon
} from '@heroicons/react/24/outline'

export default function ClaimsPage() {
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
                  Resolution &amp; governance
                </p>
                <h1 className="display-4 fw-bold mb-4" style={{ fontFamily: "'Playfair Display', serif", lineHeight: 1.12 }}>
                  Claims
                </h1>
                <p className="lead mb-4" style={{ fontSize: '1.15rem', opacity: 0.95, maxWidth: '36rem' }}>
                  A structured path for submitting, tracking, and resolving claims tied to Centuries Mutual agreements,
                  rentals, and platform-backed contracts—designed for clarity from first notice to final outcome.
                </p>
                <Link href="/claims-disputes" className="btn btn-light btn-lg px-4 py-3 d-inline-flex align-items-center gap-2">
                  Claims &amp; disputes hub
                  <ArrowRightIcon style={{ width: '18px', height: '18px' }} />
                </Link>
              </div>
              <div className="col-lg-6">
                <div className="position-relative mx-auto rounded-4 overflow-hidden d-flex align-items-center justify-content-center" style={{
                  maxWidth: '520px',
                  height: '260px',
                  boxShadow: '0 24px 48px rgba(0,0,0,0.2)',
                  background: 'linear-gradient(135deg, rgba(255,255,255,0.12) 0%, rgba(255,255,255,0.04) 100%)'
                }}>
                  <ScaleIcon style={{ width: '120px', height: '120px', color: 'rgba(255,255,255,0.35)' }} aria-hidden />
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
                  How claims fit your Centuries Mutual relationship
                </h2>
                <p className="text-muted mb-0" style={{ lineHeight: 1.7 }}>
                  Whether a question involves a rental obligation, a payment dispute, or a service incident, claims are
                  routed through documented steps so both sides can see status, timelines, and required evidence—paired
                  with smart-contract governance where those products are active.
                </p>
              </div>
            </div>

            <div className="row g-4">
              {[
                {
                  Icon: MagnifyingGlassIcon,
                  title: 'Intake and evidence',
                  text: 'Submit the facts once, attach documents and communications, and keep everything associated with the right agreement record.'
                },
                {
                  Icon: ClockIcon,
                  title: 'Timeline visibility',
                  text: 'Milestones and review windows reduce uncertainty—parties know what happens next and when responses are due.'
                },
                {
                  Icon: ShieldCheckIcon,
                  title: 'Governance you can trust',
                  text: 'Automated rules and human review work together so outcomes stay consistent with your contract and platform policies.'
                },
                {
                  Icon: ScaleIcon,
                  title: 'Disputes and escalation',
                  text: 'When informal resolution is not enough, our disputes workflow captures the record for structured escalation and audit.'
                }
              ].map(({ Icon, title, text }) => (
                <div key={title} className="col-md-6">
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
                <div className="position-relative rounded-4 overflow-hidden" style={{ height: '220px' }}>
                  <Image src="/Bison.jpeg" alt="" fill sizes="(max-width: 992px) 100vw, 50vw" style={{ objectFit: 'cover' }} />
                </div>
              </div>
              <div className="col-lg-6 order-lg-1">
                <h2 className="h4 fw-bold mb-3" style={{ color: '#14432A' }}>
                  Product-specific detail
                </h2>
                <p className="text-muted mb-4" style={{ lineHeight: 1.7 }}>
                  For full documentation on automated governance, dispute mechanics, and compliance tie-ins, continue to
                  the Claims &amp; Disputes experience. Legal terms that apply to your account remain in our Legal center.
                </p>
                <div className="d-flex flex-wrap gap-3">
                  <Link href="/claims-disputes" className="btn btn-lg text-white fw-semibold px-4 py-3" style={{ background: '#14432A', borderColor: '#14432A' }}>
                    Open Claims &amp; Disputes
                  </Link>
                  <Link href="/audit-compliance" className="btn btn-outline-secondary btn-lg px-4 py-3" style={{ borderColor: '#14432A', color: '#14432A' }}>
                    Audit &amp; compliance
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
