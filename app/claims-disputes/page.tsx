'use client'

import Navbar from '../../components/Navbar'
import Footer from '../../components/Footer'
import Link from 'next/link'
import { 
  CheckBadgeIcon, 
  DocumentCheckIcon,
  ScaleIcon,
  ClockIcon,
  ShieldCheckIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline'

export default function ClaimsDisputes() {
  return (
    <>
      <Navbar />
      <main>
        {/* Hero Section */}
        <section className="py-5" style={{ 
          background: 'linear-gradient(135deg, #14432A 0%, #206542 100%)',
          color: 'white'
        }}>
          <div className="container py-5">
            <div className="row align-items-center">
              <div className="col-lg-6 mb-4 mb-lg-0">
                <h1 className="display-3 fw-bold mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>
                  Claims & Disputes
                </h1>
                <p className="lead mb-4" style={{ fontSize: '1.4rem' }}>
                  Automated smart contract governance and claims handling
                </p>
                <p className="fs-5 mb-5">
                  Our automated smart contract governance system ensures fair and transparent handling of claims and disputes. Built on blockchain technology, our system provides automated resolution for financial contracts, rental agreements, and property transactions.
                </p>
                <div className="d-flex gap-3 flex-wrap">
                  <Link href="/signup" className="btn btn-light btn-lg px-5 py-3">
                    Get Started
                  </Link>
                  <Link href="/audit-compliance" className="btn btn-outline-light btn-lg px-5 py-3">
                    Learn More
                  </Link>
                </div>
              </div>
              <div className="col-lg-6">
                <div className="position-relative" style={{ height: '500px', borderRadius: '20px', overflow: 'hidden' }}>
                  <div style={{
                    width: '100%',
                    height: '100%',
                    background: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)',
                    borderRadius: '20px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <ScaleIcon style={{ width: '200px', height: '200px', color: 'rgba(255,255,255,0.3)' }} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="py-5">
          <div className="container">
            <div className="row mb-5">
              <div className="col-lg-8 mx-auto text-center">
                <h2 className="display-5 fw-bold mb-4" style={{ color: '#14432A' }}>
                  Automated Claims & Dispute Resolution
                </h2>
                <p className="lead text-muted">
                  Our blockchain-based smart contract system automatically handles claims and disputes for financial contracts, ensuring fair and transparent resolution without the need for traditional legal processes.
                </p>
              </div>
            </div>

            <div className="row g-4 mb-5">
              <div className="col-md-6 col-lg-4">
                <div className="card border-0 shadow-sm h-100" style={{ borderRadius: '16px' }}>
                  <div className="card-body p-4 text-center">
                    <div className="mb-3">
                      <DocumentCheckIcon style={{ width: '48px', height: '48px', color: '#14432A', margin: '0 auto' }} />
                    </div>
                    <h4 className="fw-bold mb-3" style={{ color: '#14432A' }}>Smart Contracts</h4>
                    <p className="text-muted">
                      All agreements are encoded as smart contracts on the blockchain, ensuring automatic enforcement and transparent dispute resolution.
                    </p>
                  </div>
                </div>
              </div>

              <div className="col-md-6 col-lg-4">
                <div className="card border-0 shadow-sm h-100" style={{ borderRadius: '16px' }}>
                  <div className="card-body p-4 text-center">
                    <div className="mb-3">
                      <ClockIcon style={{ width: '48px', height: '48px', color: '#14432A', margin: '0 auto' }} />
                    </div>
                    <h4 className="fw-bold mb-3" style={{ color: '#14432A' }}>Automated Processing</h4>
                    <p className="text-muted">
                      Claims and disputes are processed automatically based on predefined rules, reducing processing time and ensuring consistent outcomes.
                    </p>
                  </div>
                </div>
              </div>

              <div className="col-md-6 col-lg-4">
                <div className="card border-0 shadow-sm h-100" style={{ borderRadius: '16px' }}>
                  <div className="card-body p-4 text-center">
                    <div className="mb-3">
                      <ShieldCheckIcon style={{ width: '48px', height: '48px', color: '#14432A', margin: '0 auto' }} />
                    </div>
                    <h4 className="fw-bold mb-3" style={{ color: '#14432A' }}>Transparent Resolution</h4>
                    <p className="text-muted">
                      All dispute resolutions are recorded on the blockchain, providing a transparent and immutable record of all decisions and outcomes.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="py-5 bg-light">
          <div className="container">
            <div className="row mb-5">
              <div className="col-lg-8 mx-auto text-center">
                <h2 className="display-5 fw-bold mb-4" style={{ color: '#14432A' }}>
                  Benefits of Automated Claims & Disputes
                </h2>
              </div>
            </div>

            <div className="row g-4">
              <div className="col-md-6">
                <div className="card border-0 shadow-sm h-100" style={{ borderRadius: '16px' }}>
                  <div className="card-body p-4">
                    <div className="mb-3">
                      <CheckCircleIcon style={{ width: '48px', height: '48px', color: '#14432A' }} />
                    </div>
                    <h4 className="fw-bold mb-3" style={{ color: '#14432A' }}>Faster Resolution</h4>
                    <p className="text-muted">
                      Automated processing means claims and disputes are resolved quickly, often within hours instead of weeks or months.
                    </p>
                  </div>
                </div>
              </div>

              <div className="col-md-6">
                <div className="card border-0 shadow-sm h-100" style={{ borderRadius: '16px' }}>
                  <div className="card-body p-4">
                    <div className="mb-3">
                      <CheckBadgeIcon style={{ width: '48px', height: '48px', color: '#14432A' }} />
                    </div>
                    <h4 className="fw-bold mb-3" style={{ color: '#14432A' }}>Fair & Consistent</h4>
                    <p className="text-muted">
                      Smart contracts ensure that all disputes are resolved according to predefined rules, ensuring fairness and consistency across all cases.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-5">
          <div className="container">
            <div className="row justify-content-center">
              <div className="col-lg-8 text-center">
                <h2 className="mb-4 fw-bold" style={{ color: '#14432A' }}>Experience Automated Claims & Disputes</h2>
                <p className="lead mb-4">
                  Join our platform and benefit from automated, transparent, and fair dispute resolution for all your contracts and transactions.
                </p>
                <div className="d-flex gap-3 justify-content-center">
                  <Link href="/signup" className="btn btn-primary btn-lg px-5 py-3">
                    Get Started
                  </Link>
                  <Link href="/audit-compliance" className="btn btn-outline-primary btn-lg px-5 py-3">
                    Learn More
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

