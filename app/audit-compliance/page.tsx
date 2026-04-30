'use client'

import Navbar from '../../components/Navbar'
import Footer from '../../components/Footer'
import Link from 'next/link'
import Image from 'next/image'
import { DocumentCheckIcon, CogIcon, ShieldCheckIcon, ScaleIcon, ClockIcon } from '@heroicons/react/24/outline'

export default function AuditCompliance() {
  return (
    <>
      <style jsx global>{`
        footer .row:first-child {
          display: none !important;
        }
        footer .border-top {
          border-top: 1px solid rgba(255, 255, 255, 0.1) !important;
        }
      `}</style>
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
                  Audit & Compliance
                </h1>
                <p className="lead mb-4" style={{ fontSize: '1.4rem' }}>
                  Automated smart contract governance and claims handling for financial contracts
                </p>
                <p className="fs-5 mb-5">
                  Leverage blockchain technology to automate the execution of financial contracts, ensure compliance, and efficiently handle claims that arise. Our system provides transparent, immutable governance for all financial agreements.
                </p>
                <div className="d-flex gap-3 flex-wrap">
                  <Link href="/contact" className="btn btn-light btn-lg px-5 py-3">
                    Get Started
                  </Link>
                  <Link href="/apply" className="btn btn-outline-light btn-lg px-5 py-3">
                    Learn More
                  </Link>
                </div>
              </div>
              <div className="col-lg-6">
                <div className="position-relative" style={{ height: '500px', borderRadius: '20px', overflow: 'hidden' }}>
                  <Image
                    src="/Bison.jpeg"
                    alt="Audit & Compliance"
                    fill
                    priority
                    quality={100}
                    style={{ objectFit: 'cover', borderRadius: '20px' }}
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Overview Section */}
        <section className="py-5">
          <div className="container">
            <div className="row mb-5">
              <div className="col-lg-8 mx-auto text-center">
                <h2 className="display-5 fw-bold mb-4" style={{ color: '#14432A' }}>
                  Smart Contract Automation
                </h2>
                <p className="lead text-muted">
                  Our audit and compliance platform uses smart contracts to automate the execution of financial agreements. Smart contracts are self-executing contracts with the terms of the agreement directly written into code, stored on the blockchain, and automatically executed when predetermined conditions are met.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Smart Contract Governance Section */}
        <section className="py-5 bg-light">
          <div className="container">
            <div className="row mb-5">
              <div className="col-lg-8 mx-auto text-center">
                <h2 className="display-5 fw-bold mb-4" style={{ color: '#14432A' }}>
                  Governing Financial Contract Execution
                </h2>
                <p className="lead text-muted">
                  We provide comprehensive governance systems to ensure financial contracts are executed fairly, transparently, and in compliance with all regulatory requirements.
                </p>
              </div>
            </div>

            <div className="row g-4 mb-5">
              <div className="col-md-6 col-lg-4">
                <div className="card border-0 shadow-sm h-100" style={{ borderRadius: '16px' }}>
                  <div className="card-body p-4">
                    <div className="mb-3">
                      <CogIcon style={{ width: '48px', height: '48px', color: '#14432A' }} />
                    </div>
                    <h3 className="h4 fw-bold mb-3" style={{ color: '#14432A' }}>Automated Execution</h3>
                    <p className="text-muted">
                      Smart contracts automatically execute financial agreements when predefined conditions are met. This eliminates the need for intermediaries and reduces the risk of human error or manipulation.
                    </p>
                    <ul className="list-unstyled mt-3">
                      <li className="mb-2">
                        <i className="bi bi-check-circle-fill text-success me-2"></i>
                        Self-executing contracts
                      </li>
                      <li className="mb-2">
                        <i className="bi bi-check-circle-fill text-success me-2"></i>
                        Condition-based triggers
                      </li>
                      <li className="mb-2">
                        <i className="bi bi-check-circle-fill text-success me-2"></i>
                        No manual intervention needed
                      </li>
                      <li className="mb-2">
                        <i className="bi bi-check-circle-fill text-success me-2"></i>
                        Instant execution
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="col-md-6 col-lg-4">
                <div className="card border-0 shadow-sm h-100" style={{ borderRadius: '16px' }}>
                  <div className="card-body p-4">
                    <div className="mb-3">
                      <ScaleIcon style={{ width: '48px', height: '48px', color: '#14432A' }} />
                    </div>
                    <h3 className="h4 fw-bold mb-3" style={{ color: '#14432A' }}>Regulatory Compliance</h3>
                    <p className="text-muted">
                      Our smart contracts are designed to comply with all relevant financial regulations. Compliance checks are built into the contract code, ensuring every transaction meets regulatory standards.
                    </p>
                    <ul className="list-unstyled mt-3">
                      <li className="mb-2">
                        <i className="bi bi-check-circle-fill text-success me-2"></i>
                        Built-in compliance rules
                      </li>
                      <li className="mb-2">
                        <i className="bi bi-check-circle-fill text-success me-2"></i>
                        Regulatory reporting
                      </li>
                      <li className="mb-2">
                        <i className="bi bi-check-circle-fill text-success me-2"></i>
                        Audit trail generation
                      </li>
                      <li className="mb-2">
                        <i className="bi bi-check-circle-fill text-success me-2"></i>
                        Real-time monitoring
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="col-md-6 col-lg-4">
                <div className="card border-0 shadow-sm h-100" style={{ borderRadius: '16px' }}>
                  <div className="card-body p-4">
                    <div className="mb-3">
                      <ShieldCheckIcon style={{ width: '48px', height: '48px', color: '#14432A' }} />
                    </div>
                    <h3 className="h4 fw-bold mb-3" style={{ color: '#14432A' }}>Transparent Governance</h3>
                    <p className="text-muted">
                      All contract executions are recorded on the blockchain, providing complete transparency. Every party can verify contract terms, execution conditions, and outcomes in real-time.
                    </p>
                    <ul className="list-unstyled mt-3">
                      <li className="mb-2">
                        <i className="bi bi-check-circle-fill text-success me-2"></i>
                        Immutable records
                      </li>
                      <li className="mb-2">
                        <i className="bi bi-check-circle-fill text-success me-2"></i>
                        Public verification
                      </li>
                      <li className="mb-2">
                        <i className="bi bi-check-circle-fill text-success me-2"></i>
                        Real-time tracking
                      </li>
                      <li className="mb-2">
                        <i className="bi bi-check-circle-fill text-success me-2"></i>
                        Complete audit trail
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Claims Handling Section */}
        <section className="py-5">
          <div className="container">
            <div className="row mb-5">
              <div className="col-lg-8 mx-auto text-center">
                <h2 className="display-5 fw-bold mb-4" style={{ color: '#14432A' }}>
                  Handling Claims That Arise
                </h2>
                <p className="lead text-muted">
                  When disputes or claims arise from financial contracts, our automated system provides a transparent, efficient process for resolution. All claims are processed through smart contract logic and blockchain verification.
                </p>
              </div>
            </div>

            <div className="row g-4">
              <div className="col-md-6">
                <div className="card border-0 shadow-sm h-100" style={{ borderRadius: '16px' }}>
                  <div className="card-body p-4">
                    <div className="mb-3">
                      <DocumentCheckIcon style={{ width: '48px', height: '48px', color: '#14432A' }} />
                    </div>
                    <h3 className="h4 fw-bold mb-3" style={{ color: '#14432A' }}>Automated Claims Processing</h3>
                    <p className="text-muted">
                      Claims are automatically evaluated against contract terms stored in the smart contract. The system verifies eligibility, checks conditions, and processes valid claims without manual intervention.
                    </p>
                    <ul className="list-unstyled mt-3">
                      <li className="mb-2">
                        <i className="bi bi-check-circle-fill text-success me-2"></i>
                        Instant claim verification
                      </li>
                      <li className="mb-2">
                        <i className="bi bi-check-circle-fill text-success me-2"></i>
                        Automated eligibility checks
                      </li>
                      <li className="mb-2">
                        <i className="bi bi-check-circle-fill text-success me-2"></i>
                        Smart contract validation
                      </li>
                      <li className="mb-2">
                        <i className="bi bi-check-circle-fill text-success me-2"></i>
                        Reduced processing time
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="col-md-6">
                <div className="card border-0 shadow-sm h-100" style={{ borderRadius: '16px' }}>
                  <div className="card-body p-4">
                    <div className="mb-3">
                      <ClockIcon style={{ width: '48px', height: '48px', color: '#14432A' }} />
                    </div>
                    <h3 className="h4 fw-bold mb-3" style={{ color: '#14432A' }}>Dispute Resolution</h3>
                    <p className="text-muted">
                      For complex claims that require review, our system provides a transparent dispute resolution process. All evidence, contract terms, and decisions are recorded on the blockchain for complete accountability.
                    </p>
                    <ul className="list-unstyled mt-3">
                      <li className="mb-2">
                        <i className="bi bi-check-circle-fill text-success me-2"></i>
                        Transparent review process
                      </li>
                      <li className="mb-2">
                        <i className="bi bi-check-circle-fill text-success me-2"></i>
                        Blockchain-verified evidence
                      </li>
                      <li className="mb-2">
                        <i className="bi bi-check-circle-fill text-success me-2"></i>
                        Immutable decision records
                      </li>
                      <li className="mb-2">
                        <i className="bi bi-check-circle-fill text-success me-2"></i>
                        Fair and objective evaluation
                      </li>
                    </ul>
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
                  Key Benefits
                </h2>
              </div>
            </div>

            <div className="row g-4">
              <div className="col-md-4">
                <div className="text-center">
                  <div className="rounded-circle bg-light d-inline-flex align-items-center justify-content-center mb-3" style={{ width: '80px', height: '80px' }}>
                    <CogIcon style={{ width: '40px', height: '40px', color: '#14432A' }} />
                  </div>
                  <h4 className="h5 mb-3 fw-bold" style={{ color: '#14432A' }}>Reduced Costs</h4>
                  <p className="text-muted">Automation eliminates the need for intermediaries and manual processing, significantly reducing operational costs.</p>
                </div>
              </div>
              <div className="col-md-4">
                <div className="text-center">
                  <div className="rounded-circle bg-light d-inline-flex align-items-center justify-content-center mb-3" style={{ width: '80px', height: '80px' }}>
                    <ClockIcon style={{ width: '40px', height: '40px', color: '#14432A' }} />
                  </div>
                  <h4 className="h5 mb-3 fw-bold" style={{ color: '#14432A' }}>Faster Processing</h4>
                  <p className="text-muted">Smart contracts execute instantly when conditions are met, dramatically reducing processing times for claims and payments.</p>
                </div>
              </div>
              <div className="col-md-4">
                <div className="text-center">
                  <div className="rounded-circle bg-light d-inline-flex align-items-center justify-content-center mb-3" style={{ width: '80px', height: '80px' }}>
                    <ShieldCheckIcon style={{ width: '40px', height: '40px', color: '#14432A' }} />
                  </div>
                  <h4 className="h5 mb-3 fw-bold" style={{ color: '#14432A' }}>Enhanced Security</h4>
                  <p className="text-muted">Blockchain technology ensures that all contract executions and claims are secure, tamper-proof, and verifiable.</p>
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
                  How It Works
                </h2>
              </div>
            </div>

            <div className="row g-4">
              <div className="col-md-3">
                <div className="text-center">
                  <div className="rounded-circle bg-light d-inline-flex align-items-center justify-content-center mb-3" style={{ width: '80px', height: '80px' }}>
                    <span className="fw-bold" style={{ color: '#14432A', fontSize: '1.5rem' }}>1</span>
                  </div>
                  <h4 className="h6 mb-3 fw-bold" style={{ color: '#14432A' }}>Contract Creation</h4>
                  <p className="text-muted small">Financial contract terms are encoded into a smart contract and deployed on the blockchain.</p>
                </div>
              </div>
              <div className="col-md-3">
                <div className="text-center">
                  <div className="rounded-circle bg-light d-inline-flex align-items-center justify-content-center mb-3" style={{ width: '80px', height: '80px' }}>
                    <span className="fw-bold" style={{ color: '#14432A', fontSize: '1.5rem' }}>2</span>
                  </div>
                  <h4 className="h6 mb-3 fw-bold" style={{ color: '#14432A' }}>Automated Execution</h4>
                  <p className="text-muted small">Smart contract automatically executes when predefined conditions are met, without manual intervention.</p>
                </div>
              </div>
              <div className="col-md-3">
                <div className="text-center">
                  <div className="rounded-circle bg-light d-inline-flex align-items-center justify-content-center mb-3" style={{ width: '80px', height: '80px' }}>
                    <span className="fw-bold" style={{ color: '#14432A', fontSize: '1.5rem' }}>3</span>
                  </div>
                  <h4 className="h6 mb-3 fw-bold" style={{ color: '#14432A' }}>Continuous Monitoring</h4>
                  <p className="text-muted small">System continuously monitors contract execution and compliance with all regulatory requirements.</p>
                </div>
              </div>
              <div className="col-md-3">
                <div className="text-center">
                  <div className="rounded-circle bg-light d-inline-flex align-items-center justify-content-center mb-3" style={{ width: '80px', height: '80px' }}>
                    <span className="fw-bold" style={{ color: '#14432A', fontSize: '1.5rem' }}>4</span>
                  </div>
                  <h4 className="h6 mb-3 fw-bold" style={{ color: '#14432A' }}>Claims Resolution</h4>
                  <p className="text-muted small">If claims arise, they are automatically processed or routed for review with full transparency.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-5 bg-light">
          <div className="container">
            <div className="row justify-content-center">
              <div className="col-lg-8 text-center">
                <h2 className="mb-4 fw-bold" style={{ color: '#14432A' }}>Ready to Automate Your Financial Contracts?</h2>
                <p className="lead mb-4">
                  Experience the future of contract governance and claims handling with our blockchain-powered audit and compliance platform.
                </p>
                <div className="d-flex gap-3 justify-content-center">
                  <Link href="/contact" className="btn btn-primary btn-lg px-5 py-3">
                    Contact Us
                  </Link>
                  <Link href="/apply" className="btn btn-outline-primary btn-lg px-5 py-3">
                    Get Started
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

