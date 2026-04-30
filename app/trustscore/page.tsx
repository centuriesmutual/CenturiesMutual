'use client'

import Navbar from '../../components/Navbar'
import Link from 'next/link'
import { 
  ShieldCheckIcon, 
  CheckCircleIcon,
  UserGroupIcon,
  ChartBarIcon,
  HomeIcon,
  CreditCardIcon,
  BanknotesIcon
} from '@heroicons/react/24/outline'

export default function TrustScore() {
  return (
    <>
      <Navbar />
      <main>
        {/* Hero Section */}
        <section className="position-relative" style={{ 
          background: 'linear-gradient(180deg, #14432A 0%, #1a5436 100%)',
          paddingTop: '80px',
          paddingBottom: '80px'
        }}>
          <div className="container">
            <div className="row justify-content-center">
              <div className="col-lg-10 text-center text-white">
                <h1 className="display-4 fw-bold mb-4" style={{ 
                  fontFamily: "'Playfair Display', serif",
                  letterSpacing: '-0.5px'
                }}>
                  In-House Trust Rating System
                </h1>
                <p className="lead mb-5" style={{ 
                  fontSize: '1.25rem', 
                  maxWidth: '800px', 
                  margin: '0 auto 2.5rem',
                  lineHeight: '1.8',
                  opacity: 0.95
                }}>
                  Learn how our proprietary trust rating system works to ensure safe, reliable roommate matching and property transactions.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Main Content */}
        <section className="py-5" style={{ backgroundColor: '#f8f9fa' }}>
          <div className="container py-5">
            <div className="row justify-content-center">
              <div className="col-lg-10">
                <div className="card border-0 shadow-sm mb-5" style={{ borderRadius: '16px' }}>
                  <div className="card-body p-5">
                    <h2 className="fw-bold mb-4 text-center" style={{ color: '#14432A' }}>
                      How Our In-House Trust Score System Works
                    </h2>
                    <p className="mb-4 text-center" style={{ fontSize: '1.1rem', color: '#495057' }}>
                      Our proprietary in-house trust score based on our recommendation engine (1-300 scale) evaluates members based on multiple 
                      social and financial factors to ensure safe, reliable roommate matching and property transactions.
                    </p>
                    
                    <div className="row g-4 mb-4">
                      <div className="col-md-6">
                        <div style={{
                          background: 'rgba(20, 67, 42, 0.05)',
                          borderRadius: '16px',
                          padding: '24px',
                          border: '1px solid rgba(20, 67, 42, 0.1)',
                          height: '100%'
                        }}>
                          <div className="d-flex align-items-center mb-3">
                            <UserGroupIcon style={{ width: '32px', height: '32px', color: '#14432A', marginRight: '12px' }} />
                            <h4 className="fw-bold mb-0" style={{ color: '#14432A', fontSize: '1.5rem' }}>Social Factors</h4>
                          </div>
                          <ul className="list-unstyled mb-0" style={{ fontSize: '1rem', color: '#495057' }}>
                            <li className="mb-2 d-flex align-items-start">
                              <CheckCircleIcon style={{ width: '20px', height: '20px', color: '#10b981', marginRight: '8px', marginTop: '2px', flexShrink: 0 }} />
                              <span>Community participation & engagement</span>
                            </li>
                            <li className="mb-2 d-flex align-items-start">
                              <CheckCircleIcon style={{ width: '20px', height: '20px', color: '#10b981', marginRight: '8px', marginTop: '2px', flexShrink: 0 }} />
                              <span>Reference checks from previous roommates</span>
                            </li>
                            <li className="mb-2 d-flex align-items-start">
                              <CheckCircleIcon style={{ width: '20px', height: '20px', color: '#10b981', marginRight: '8px', marginTop: '2px', flexShrink: 0 }} />
                              <span>Social media verification</span>
                            </li>
                            <li className="mb-2 d-flex align-items-start">
                              <CheckCircleIcon style={{ width: '20px', height: '20px', color: '#10b981', marginRight: '8px', marginTop: '2px', flexShrink: 0 }} />
                              <span>Communication responsiveness</span>
                            </li>
                            <li className="mb-2 d-flex align-items-start">
                              <CheckCircleIcon style={{ width: '20px', height: '20px', color: '#10b981', marginRight: '8px', marginTop: '2px', flexShrink: 0 }} />
                              <span>Lifestyle compatibility indicators</span>
                            </li>
                          </ul>
                        </div>
                      </div>
                      
                      <div className="col-md-6">
                        <div style={{
                          background: 'rgba(20, 67, 42, 0.05)',
                          borderRadius: '16px',
                          padding: '24px',
                          border: '1px solid rgba(20, 67, 42, 0.1)',
                          height: '100%'
                        }}>
                          <div className="d-flex align-items-center mb-3">
                            <ChartBarIcon style={{ width: '32px', height: '32px', color: '#14432A', marginRight: '12px' }} />
                            <h4 className="fw-bold mb-0" style={{ color: '#14432A', fontSize: '1.5rem' }}>Financial Factors</h4>
                          </div>
                          <ul className="list-unstyled mb-0" style={{ fontSize: '1rem', color: '#495057' }}>
                            <li className="mb-2 d-flex align-items-start">
                              <CheckCircleIcon style={{ width: '20px', height: '20px', color: '#10b981', marginRight: '8px', marginTop: '2px', flexShrink: 0 }} />
                              <span>Income verification & stability</span>
                            </li>
                            <li className="mb-2 d-flex align-items-start">
                              <CheckCircleIcon style={{ width: '20px', height: '20px', color: '#10b981', marginRight: '8px', marginTop: '2px', flexShrink: 0 }} />
                              <span>Payment history & reliability</span>
                            </li>
                            <li className="mb-2 d-flex align-items-start">
                              <CheckCircleIcon style={{ width: '20px', height: '20px', color: '#10b981', marginRight: '8px', marginTop: '2px', flexShrink: 0 }} />
                              <span>Employment verification</span>
                            </li>
                            <li className="mb-2 d-flex align-items-start">
                              <CheckCircleIcon style={{ width: '20px', height: '20px', color: '#10b981', marginRight: '8px', marginTop: '2px', flexShrink: 0 }} />
                              <span>Bank account verification</span>
                            </li>
                            <li className="mb-2 d-flex align-items-start">
                              <CheckCircleIcon style={{ width: '20px', height: '20px', color: '#10b981', marginRight: '8px', marginTop: '2px', flexShrink: 0 }} />
                              <span>Trust score history analysis</span>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-4 p-4 text-center" style={{
                      background: 'rgba(20, 67, 42, 0.1)',
                      borderRadius: '12px',
                      border: '1px solid rgba(20, 67, 42, 0.2)'
                    }}>
                      <h5 className="fw-bold mb-3" style={{ color: '#14432A' }}>Score Range</h5>
                      <div className="row g-3">
                        <div className="col-md-3">
                          <div style={{
                            background: 'white',
                            borderRadius: '8px',
                            padding: '16px',
                            border: '2px solid #dc3545'
                          }}>
                            <div className="fw-bold" style={{ color: '#dc3545', fontSize: '1.2rem' }}>1-100</div>
                            <div className="text-muted small">Poor</div>
                          </div>
                        </div>
                        <div className="col-md-3">
                          <div style={{
                            background: 'white',
                            borderRadius: '8px',
                            padding: '16px',
                            border: '2px solid #ffc107'
                          }}>
                            <div className="fw-bold" style={{ color: '#ffc107', fontSize: '1.2rem' }}>101-200</div>
                            <div className="text-muted small">Fair</div>
                          </div>
                        </div>
                        <div className="col-md-3">
                          <div style={{
                            background: 'white',
                            borderRadius: '8px',
                            padding: '16px',
                            border: '2px solid #0d6efd'
                          }}>
                            <div className="fw-bold" style={{ color: '#0d6efd', fontSize: '1.2rem' }}>201-250</div>
                            <div className="text-muted small">Good</div>
                          </div>
                        </div>
                        <div className="col-md-3">
                          <div style={{
                            background: 'white',
                            borderRadius: '8px',
                            padding: '16px',
                            border: '2px solid #10b981'
                          }}>
                            <div className="fw-bold" style={{ color: '#10b981', fontSize: '1.2rem' }}>251-300</div>
                            <div className="text-muted small">Excellent</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Rental Equity Section */}
                <div className="card border-0 shadow-sm mb-5" style={{ borderRadius: '16px' }}>
                  <div className="card-body p-5">
                    <div className="row align-items-center mb-4">
                      <div className="col-md-8">
                        <div className="d-flex align-items-center mb-3">
                          <ChartBarIcon style={{ width: '32px', height: '32px', color: '#14432A', marginRight: '12px' }} />
                          <h3 className="fw-bold mb-0" style={{ color: '#14432A', fontSize: '1.75rem' }}>Rental Equity</h3>
                        </div>
                        <p className="mb-4" style={{ fontSize: '1.1rem', color: '#495057' }}>
                          Transform your rent payments into trust score growth. With Rental Equity, every on-time rent payment helps build your trust score, giving you better standing, more opportunities, and greater confidence across Centuries Mutual.
                        </p>
                        <ul className="list-unstyled mb-0">
                          <li className="mb-3 d-flex align-items-start">
                            <CheckCircleIcon style={{ width: '24px', height: '24px', color: '#10b981', marginRight: '12px', marginTop: '2px', flexShrink: 0 }} />
                            <div>
                              <h5 className="fw-bold mb-1" style={{ color: '#14432A' }}>Build Trust History</h5>
                              <p className="text-muted mb-0">Build trust history month after month with consistent on-time payments</p>
                            </div>
                          </li>
                          <li className="mb-3 d-flex align-items-start">
                            <CheckCircleIcon style={{ width: '24px', height: '24px', color: '#10b981', marginRight: '12px', marginTop: '2px', flexShrink: 0 }} />
                            <div>
                              <h5 className="fw-bold mb-1" style={{ color: '#14432A' }}>Improve Your Score</h5>
                              <p className="text-muted mb-0">Improve your trust score for future loans and better rental opportunities</p>
                            </div>
                          </li>
                          <li className="mb-3 d-flex align-items-start">
                            <CheckCircleIcon style={{ width: '24px', height: '24px', color: '#10b981', marginRight: '12px', marginTop: '2px', flexShrink: 0 }} />
                            <div>
                              <h5 className="fw-bold mb-1" style={{ color: '#14432A' }}>Pathway to Homeownership</h5>
                              <p className="text-muted mb-0">Create a pathway to homeownership through consistent rental equity building</p>
                            </div>
                          </li>
                          <li className="d-flex align-items-start">
                            <CheckCircleIcon style={{ width: '24px', height: '24px', color: '#10b981', marginRight: '12px', marginTop: '2px', flexShrink: 0 }} />
                            <div>
                              <h5 className="fw-bold mb-1" style={{ color: '#14432A' }}>Better Rates</h5>
                              <p className="text-muted mb-0">Qualify for better rates on rentals and future housing opportunities</p>
                            </div>
                          </li>
                        </ul>
                      </div>
                      <div className="col-md-4">
                        <div className="card border-0" style={{ 
                          background: 'linear-gradient(135deg, #14432A 0%, #1a5436 100%)', 
                          color: 'white',
                          borderRadius: '16px'
                        }}>
                          <div className="card-body p-4 text-center">
                            <h4 className="fw-bold mb-4">Trust Building Impact</h4>
                            <div className="mb-4">
                              <div className="d-flex justify-content-between mb-2">
                                <span>Average Trust Score Increase</span>
                                <span className="fw-bold">+60 points</span>
                              </div>
                              <div className="progress" style={{ height: '8px', backgroundColor: 'rgba(255,255,255,0.2)' }}>
                                <div className="progress-bar" style={{ width: '75%', backgroundColor: 'white' }}></div>
                              </div>
                            </div>
                            <div className="mb-4">
                              <div className="d-flex justify-content-between mb-2">
                                <span>Time to See Results</span>
                                <span className="fw-bold">3-6 months</span>
                              </div>
                              <div className="progress" style={{ height: '8px', backgroundColor: 'rgba(255,255,255,0.2)' }}>
                                <div className="progress-bar" style={{ width: '50%', backgroundColor: 'white' }}></div>
                              </div>
                            </div>
                            <p className="mb-0 mt-4" style={{ fontSize: '0.85rem', opacity: 0.9 }}>
                              * Results based on average user data from renters with consistent on-time payments.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* CTA Section */}
                <div className="text-center">
                  <Link href="/rentalequity" className="btn btn-primary btn-lg px-5 py-3 fw-bold me-3">
                    Learn More About Rental Equity
                  </Link>
                  <Link href="/contact" className="btn btn-outline-primary btn-lg px-5 py-3 fw-bold">
                    Get Started
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  )
}

