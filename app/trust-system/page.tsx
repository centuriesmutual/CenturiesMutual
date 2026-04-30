'use client'

import Navbar from '../../components/Navbar'
import Footer from '../../components/Footer'
import Link from 'next/link'
import { 
  ShieldCheckIcon, 
  CheckCircleIcon,
  UserGroupIcon,
  ChartBarIcon,
  LockClosedIcon,
  StarIcon
} from '@heroicons/react/24/outline'

export default function TrustSystem() {
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
                  Trust System
                </h1>
                <p className="lead mb-4" style={{ fontSize: '1.4rem' }}>
                  Our proprietary in-house trust rating system
                </p>
                <p className="fs-5 mb-5">
                  Centuries Mutual uses a proprietary in-house trust rating system (1-300 scale) based on our recommendation engine to ensure safe, reliable roommate matching and property transactions. This transparent system helps you make informed decisions.
                </p>
                <div className="d-flex gap-3 flex-wrap">
                  <Link href="/signup" className="btn btn-light btn-lg px-5 py-3">
                    Get Started
                  </Link>
                  <Link href="/trustscore" className="btn btn-outline-light btn-lg px-5 py-3">
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
                    <ShieldCheckIcon style={{ width: '200px', height: '200px', color: 'rgba(255,255,255,0.3)' }} />
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
                  How Our Trust System Works
                </h2>
                <p className="lead text-muted">
                  Our proprietary in-house trust score based on our recommendation engine (1-300 scale) evaluates members based on multiple social and financial factors to ensure safe, reliable roommate matching and property transactions.
                </p>
              </div>
            </div>

            <div className="row g-4 mb-5">
              <div className="col-md-6 col-lg-4">
                <div className="card border-0 shadow-sm h-100" style={{ borderRadius: '16px' }}>
                  <div className="card-body p-4 text-center">
                    <div className="mb-3">
                      <ChartBarIcon style={{ width: '48px', height: '48px', color: '#14432A', margin: '0 auto' }} />
                    </div>
                    <h4 className="fw-bold mb-3" style={{ color: '#14432A' }}>1-300 Scale</h4>
                    <p className="text-muted">
                      Our trust score ranges from 1 to 300, providing a comprehensive rating that reflects member reliability and trustworthiness.
                    </p>
                  </div>
                </div>
              </div>

              <div className="col-md-6 col-lg-4">
                <div className="card border-0 shadow-sm h-100" style={{ borderRadius: '16px' }}>
                  <div className="card-body p-4 text-center">
                    <div className="mb-3">
                      <UserGroupIcon style={{ width: '48px', height: '48px', color: '#14432A', margin: '0 auto' }} />
                    </div>
                    <h4 className="fw-bold mb-3" style={{ color: '#14432A' }}>Verified Members</h4>
                    <p className="text-muted">
                      All members undergo ID verification and background checks to ensure the highest level of trust and security.
                    </p>
                  </div>
                </div>
              </div>

              <div className="col-md-6 col-lg-4">
                <div className="card border-0 shadow-sm h-100" style={{ borderRadius: '16px' }}>
                  <div className="card-body p-4 text-center">
                    <div className="mb-3">
                      <StarIcon style={{ width: '48px', height: '48px', color: '#14432A', margin: '0 auto' }} />
                    </div>
                    <h4 className="fw-bold mb-3" style={{ color: '#14432A' }}>Transparent Ratings</h4>
                    <p className="text-muted">
                      Trust scores are transparent and visible to all members, helping you make informed decisions about roommates and properties.
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
                  Benefits of Our Trust System
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
                    <h4 className="fw-bold mb-3" style={{ color: '#14432A' }}>Safe Roommate Matching</h4>
                    <p className="text-muted">
                      Our trust system helps you find compatible and reliable roommates by providing transparent ratings based on verified information and past interactions.
                    </p>
                  </div>
                </div>
              </div>

              <div className="col-md-6">
                <div className="card border-0 shadow-sm h-100" style={{ borderRadius: '16px' }}>
                  <div className="card-body p-4">
                    <div className="mb-3">
                      <LockClosedIcon style={{ width: '48px', height: '48px', color: '#14432A' }} />
                    </div>
                    <h4 className="fw-bold mb-3" style={{ color: '#14432A' }}>Secure Transactions</h4>
                    <p className="text-muted">
                      Trust scores help ensure secure property transactions by providing landlords and tenants with reliable information about each other's trustworthiness.
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
                <h2 className="mb-4 fw-bold" style={{ color: '#14432A' }}>Build Your Trust Score Today</h2>
                <p className="lead mb-4">
                  Join thousands of members who trust our system for safe roommate matching and property transactions.
                </p>
                <div className="d-flex gap-3 justify-content-center">
                  <Link href="/signup" className="btn btn-primary btn-lg px-5 py-3">
                    Get Started
                  </Link>
                  <Link href="/trustscore" className="btn btn-outline-primary btn-lg px-5 py-3">
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

