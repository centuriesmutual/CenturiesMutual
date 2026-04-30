'use client'

import Footer from '../../components/Footer'
import Navbar from '../../components/Navbar'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { 
  HomeIcon, 
  ShieldCheckIcon, 
  CheckCircleIcon,
  ChartBarIcon,
  UserGroupIcon,
  KeyIcon,
  BuildingOfficeIcon,
  CreditCardIcon
} from '@heroicons/react/24/outline'

export default function RentalEquity() {
  return (
    <>
      <Navbar />
      <main style={{ backgroundColor: '#ffffff' }}>
        {/* Hero Section */}
        <section className="position-relative" style={{ 
          background: 'linear-gradient(180deg, #14432A 0%, #1a5436 100%)',
          paddingTop: '100px',
          paddingBottom: '80px'
        }}>
          <div className="container">
            <div className="row justify-content-center">
              <div className="col-lg-10 text-center text-white">
                <h1 className="display-4 fw-bold mb-4" style={{ 
                  fontFamily: "'Playfair Display', serif",
                  letterSpacing: '-0.5px'
                }}>
                  Find Your Perfect Space or List Your Property
                </h1>
                <p className="lead mb-5" style={{ 
                  fontSize: '1.25rem', 
                  maxWidth: '800px', 
                  margin: '0 auto 2.5rem',
                  lineHeight: '1.8',
                  opacity: 0.95
                }}>
                  Centuries Mutual connects renters with quality rooms and helps landlords find reliable tenants through our secure in-house trust system.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Rooms for Rent Section */}
        <section className="py-5" style={{ backgroundColor: '#f8f9fa' }}>
          <div className="container py-5">
            <div className="row align-items-center mb-5">
              <div className="col-lg-6 mb-4 mb-lg-0">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6 }}
                >
                  <div className="d-flex align-items-center mb-4">
                    <HomeIcon style={{ width: '48px', height: '48px', color: '#14432A', marginRight: '16px' }} />
                    <h2 className="fw-bold mb-0" style={{ color: '#14432A', fontSize: '2.5rem' }}>
                      Rooms for Rent
                    </h2>
                  </div>
                  <p className="lead mb-4" style={{ fontSize: '1.2rem', color: '#495057' }}>
                    Find your perfect room with verified landlords and secure roommate matching through our in-house trust system.
                  </p>
                  <ul className="list-unstyled mb-4">
                    <li className="mb-3 d-flex align-items-start">
                      <CheckCircleIcon style={{ width: '24px', height: '24px', color: '#10b981', marginRight: '12px', marginTop: '2px', flexShrink: 0 }} />
                      <div>
                        <h5 className="fw-bold mb-1" style={{ color: '#14432A' }}>Verified Properties</h5>
                        <p className="text-muted mb-0">All properties and landlords are verified through our in-house trust system</p>
                      </div>
                    </li>
                    <li className="mb-3 d-flex align-items-start">
                      <CheckCircleIcon style={{ width: '24px', height: '24px', color: '#10b981', marginRight: '12px', marginTop: '2px', flexShrink: 0 }} />
                      <div>
                        <h5 className="fw-bold mb-1" style={{ color: '#14432A' }}>Smart Roommate Matching</h5>
                        <p className="text-muted mb-0">Our recommendation engine matches you with compatible roommates based on lifestyle and preferences</p>
                      </div>
                    </li>
                    <li className="mb-3 d-flex align-items-start">
                      <CheckCircleIcon style={{ width: '24px', height: '24px', color: '#10b981', marginRight: '12px', marginTop: '2px', flexShrink: 0 }} />
                      <div>
                        <h5 className="fw-bold mb-1" style={{ color: '#14432A' }}>Secure Payments</h5>
                        <p className="text-muted mb-0">All rental payments are processed securely through our platform</p>
                      </div>
                    </li>
                    <li className="d-flex align-items-start">
                      <CheckCircleIcon style={{ width: '24px', height: '24px', color: '#10b981', marginRight: '12px', marginTop: '2px', flexShrink: 0 }} />
                      <div>
                        <h5 className="fw-bold mb-1" style={{ color: '#14432A' }}>Build Your Trust Score</h5>
                        <p className="text-muted mb-0">Every on-time payment helps build your in-house trust score for better future opportunities</p>
                      </div>
                    </li>
                  </ul>
                  <Link href="/neighborhood" className="btn btn-primary btn-lg px-5 py-3 fw-bold">
                    Browse Available Rooms
                  </Link>
                </motion.div>
              </div>
              <div className="col-lg-6">
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6 }}
                  className="card border-0 shadow-lg" 
                  style={{ borderRadius: '16px', overflow: 'hidden' }}
                >
                  <div className="card-body p-4" style={{ background: 'linear-gradient(135deg, #14432A 0%, #1a5436 100%)', color: 'white' }}>
                    <h4 className="fw-bold mb-4 text-center">Why Choose Our Platform?</h4>
                    <div className="row g-3">
                      <div className="col-6">
                        <div className="text-center p-3" style={{ background: 'rgba(255,255,255,0.1)', borderRadius: '12px' }}>
                          <div className="display-6 fw-bold mb-2">5,000+</div>
                          <div className="small">Verified Members</div>
                        </div>
                      </div>
                      <div className="col-6">
                        <div className="text-center p-3" style={{ background: 'rgba(255,255,255,0.1)', borderRadius: '12px' }}>
                          <div className="display-6 fw-bold mb-2">95%</div>
                          <div className="small">Match Success Rate</div>
                        </div>
                      </div>
                      <div className="col-6">
                        <div className="text-center p-3" style={{ background: 'rgba(255,255,255,0.1)', borderRadius: '12px' }}>
                          <div className="display-6 fw-bold mb-2">2,100+</div>
                          <div className="small">Successful Matches</div>
                        </div>
                      </div>
                      <div className="col-6">
                        <div className="text-center p-3" style={{ background: 'rgba(255,255,255,0.1)', borderRadius: '12px' }}>
                          <div className="display-6 fw-bold mb-2">99.8%</div>
                          <div className="small">Accuracy Rate</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </section>

        {/* Space for Landlords Section */}
        <section className="py-5" style={{ backgroundColor: '#ffffff' }}>
          <div className="container py-5">
            <div className="row align-items-center">
              <div className="col-lg-6 order-lg-2 mb-4 mb-lg-0">
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6 }}
                >
                  <div className="d-flex align-items-center mb-4">
                    <BuildingOfficeIcon style={{ width: '48px', height: '48px', color: '#14432A', marginRight: '16px' }} />
                    <h2 className="fw-bold mb-0" style={{ color: '#14432A', fontSize: '2.5rem' }}>
                      Space for Landlords
                    </h2>
                  </div>
                  <p className="lead mb-4" style={{ fontSize: '1.2rem', color: '#495057' }}>
                    List your properties and connect with pre-verified tenants through our in-house trust system.
                  </p>
                  <ul className="list-unstyled mb-4">
                    <li className="mb-3 d-flex align-items-start">
                      <CheckCircleIcon style={{ width: '24px', height: '24px', color: '#10b981', marginRight: '12px', marginTop: '2px', flexShrink: 0 }} />
                      <div>
                        <h5 className="fw-bold mb-1" style={{ color: '#14432A' }}>Pre-Verified Tenants</h5>
                        <p className="text-muted mb-0">All tenants are verified through our in-house trust system before they can apply</p>
                      </div>
                    </li>
                    <li className="mb-3 d-flex align-items-start">
                      <CheckCircleIcon style={{ width: '24px', height: '24px', color: '#10b981', marginRight: '12px', marginTop: '2px', flexShrink: 0 }} />
                      <div>
                        <h5 className="fw-bold mb-1" style={{ color: '#14432A' }}>Reliable Payments</h5>
                        <p className="text-muted mb-0">Track payment history and build trust scores with our secure payment system</p>
                      </div>
                    </li>
                    <li className="mb-3 d-flex align-items-start">
                      <CheckCircleIcon style={{ width: '24px', height: '24px', color: '#10b981', marginRight: '12px', marginTop: '2px', flexShrink: 0 }} />
                      <div>
                        <h5 className="fw-bold mb-1" style={{ color: '#14432A' }}>Property Management Tools</h5>
                        <p className="text-muted mb-0">Access comprehensive tools to manage your properties, tenants, and payments</p>
                      </div>
                    </li>
                    <li className="d-flex align-items-start">
                      <CheckCircleIcon style={{ width: '24px', height: '24px', color: '#10b981', marginRight: '12px', marginTop: '2px', flexShrink: 0 }} />
                      <div>
                        <h5 className="fw-bold mb-1" style={{ color: '#14432A' }}>Trust Score Insights</h5>
                        <p className="text-muted mb-0">View detailed trust scores and history for all potential tenants</p>
                      </div>
                    </li>
                  </ul>
                  <Link href="/landlords" className="btn btn-primary btn-lg px-5 py-3 fw-bold">
                    List Your Property
                  </Link>
                </motion.div>
              </div>
              <div className="col-lg-6 order-lg-1">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6 }}
                  className="card border-0 shadow-lg" 
                  style={{ borderRadius: '16px', overflow: 'hidden' }}
                >
                  <div className="card-body p-4" style={{ background: 'linear-gradient(135deg, #14432A 0%, #1a5436 100%)', color: 'white' }}>
                    <h4 className="fw-bold mb-4 text-center">Landlord Benefits</h4>
                    <div className="mb-3">
                      <div className="d-flex justify-content-between mb-2">
                        <span>Average Monthly Earnings</span>
                        <span className="fw-bold">$1,500+</span>
                      </div>
                      <div className="progress" style={{ height: '8px', backgroundColor: 'rgba(255,255,255,0.2)' }}>
                        <div className="progress-bar" style={{ width: '100%', backgroundColor: 'white' }}></div>
                      </div>
                    </div>
                    <div className="mb-3">
                      <div className="d-flex justify-content-between mb-2">
                        <span>Tenant Verification Rate</span>
                        <span className="fw-bold">100%</span>
                      </div>
                      <div className="progress" style={{ height: '8px', backgroundColor: 'rgba(255,255,255,0.2)' }}>
                        <div className="progress-bar" style={{ width: '100%', backgroundColor: 'white' }}></div>
                      </div>
                    </div>
                    <div className="mb-3">
                      <div className="d-flex justify-content-between mb-2">
                        <span>Payment Reliability</span>
                        <span className="fw-bold">99.8%</span>
                      </div>
                      <div className="progress" style={{ height: '8px', backgroundColor: 'rgba(255,255,255,0.2)' }}>
                        <div className="progress-bar" style={{ width: '99.8%', backgroundColor: 'white' }}></div>
                      </div>
                    </div>
                    <p className="mb-0 mt-4 text-center" style={{ fontSize: '0.85rem', opacity: 0.9 }}>
                      All statistics based on our in-house trust system data
                    </p>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </section>

        {/* In-House Trust System Section */}
        <section className="py-5" style={{ backgroundColor: '#f8f9fa' }}>
          <div className="container py-5">
            <div className="row justify-content-center">
              <div className="col-lg-10">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6 }}
                  className="card border-0 shadow-sm mb-5" 
                  style={{ borderRadius: '16px' }}
                >
                  <div className="card-body p-5">
                    <div className="text-center mb-5">
                      <ShieldCheckIcon style={{ width: '64px', height: '64px', color: '#14432A', marginBottom: '24px' }} />
                      <h2 className="fw-bold mb-3" style={{ color: '#14432A', fontSize: '2.5rem' }}>
                        Our In-House Trust System
                      </h2>
                      <p className="lead mb-0" style={{ fontSize: '1.2rem', color: '#495057', maxWidth: '800px', margin: '0 auto' }}>
                        Centuries Mutual uses a proprietary in-house trust rating system (1-300 scale) based on our recommendation engine to ensure safe, reliable roommate matching and property transactions.
                      </p>
                    </div>
                    
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
                            <h4 className="fw-bold mb-0" style={{ color: '#14432A', fontSize: '1.5rem' }}>How It Works</h4>
                          </div>
                          <ul className="list-unstyled mb-0" style={{ fontSize: '1rem', color: '#495057' }}>
                            <li className="mb-2 d-flex align-items-start">
                              <CheckCircleIcon style={{ width: '20px', height: '20px', color: '#10b981', marginRight: '8px', marginTop: '2px', flexShrink: 0 }} />
                              <span>All members are evaluated through our proprietary in-house system</span>
                            </li>
                            <li className="mb-2 d-flex align-items-start">
                              <CheckCircleIcon style={{ width: '20px', height: '20px', color: '#10b981', marginRight: '8px', marginTop: '2px', flexShrink: 0 }} />
                              <span>Trust scores are calculated based on social and financial factors</span>
                            </li>
                            <li className="mb-2 d-flex align-items-start">
                              <CheckCircleIcon style={{ width: '20px', height: '20px', color: '#10b981', marginRight: '8px', marginTop: '2px', flexShrink: 0 }} />
                              <span>Our recommendation engine matches compatible roommates</span>
                            </li>
                            <li className="mb-2 d-flex align-items-start">
                              <CheckCircleIcon style={{ width: '20px', height: '20px', color: '#10b981', marginRight: '8px', marginTop: '2px', flexShrink: 0 }} />
                              <span>Payment history builds your trust score over time</span>
                            </li>
                            <li className="d-flex align-items-start">
                              <CheckCircleIcon style={{ width: '20px', height: '20px', color: '#10b981', marginRight: '8px', marginTop: '2px', flexShrink: 0 }} />
                              <span>All data stays within our secure in-house system</span>
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
                            <h4 className="fw-bold mb-0" style={{ color: '#14432A', fontSize: '1.5rem' }}>Key Features</h4>
                          </div>
                          <ul className="list-unstyled mb-0" style={{ fontSize: '1rem', color: '#495057' }}>
                            <li className="mb-2 d-flex align-items-start">
                              <CheckCircleIcon style={{ width: '20px', height: '20px', color: '#10b981', marginRight: '8px', marginTop: '2px', flexShrink: 0 }} />
                              <span><strong>In-House Only:</strong> Your trust score is managed entirely within our platform</span>
                            </li>
                            <li className="mb-2 d-flex align-items-start">
                              <CheckCircleIcon style={{ width: '20px', height: '20px', color: '#10b981', marginRight: '8px', marginTop: '2px', flexShrink: 0 }} />
                              <span><strong>Privacy Protected:</strong> Your information is never shared with external credit bureaus</span>
                            </li>
                            <li className="mb-2 d-flex align-items-start">
                              <CheckCircleIcon style={{ width: '20px', height: '20px', color: '#10b981', marginRight: '8px', marginTop: '2px', flexShrink: 0 }} />
                              <span><strong>Comprehensive Evaluation:</strong> We consider multiple factors beyond just credit history</span>
                            </li>
                            <li className="mb-2 d-flex align-items-start">
                              <CheckCircleIcon style={{ width: '20px', height: '20px', color: '#10b981', marginRight: '8px', marginTop: '2px', flexShrink: 0 }} />
                              <span><strong>Continuous Improvement:</strong> Your score improves with consistent positive behavior</span>
                            </li>
                            <li className="d-flex align-items-start">
                              <CheckCircleIcon style={{ width: '20px', height: '20px', color: '#10b981', marginRight: '8px', marginTop: '2px', flexShrink: 0 }} />
                              <span><strong>Transparent Process:</strong> View your trust score and understand how it's calculated</span>
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
                      <h5 className="fw-bold mb-3" style={{ color: '#14432A' }}>Trust Score Range</h5>
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
                </motion.div>
              </div>
            </div>
          </div>
        </section>

        {/* Rental Equity Section */}
        <section className="py-5" style={{ backgroundColor: '#ffffff' }}>
          <div className="container py-5">
            <div className="row justify-content-center">
              <div className="col-lg-10">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6 }}
                  className="card border-0 shadow-sm mb-5" 
                  style={{ borderRadius: '16px' }}
                >
                  <div className="card-body p-5">
                    <div className="row align-items-center mb-4">
                      <div className="col-md-8">
                        <div className="d-flex align-items-center mb-3">
                          <ChartBarIcon style={{ width: '32px', height: '32px', color: '#14432A', marginRight: '12px' }} />
                          <h3 className="fw-bold mb-0" style={{ color: '#14432A', fontSize: '1.75rem' }}>Rental Equity</h3>
                        </div>
                        <p className="mb-4" style={{ fontSize: '1.1rem', color: '#495057' }}>
                          Transform your rent payments into trust score growth. With Rental Equity, every on-time rent payment helps build your in-house trust score, giving you better standing, more opportunities, and greater confidence across Centuries Mutual.
                        </p>
                        <ul className="list-unstyled mb-0">
                          <li className="mb-3 d-flex align-items-start">
                            <CheckCircleIcon style={{ width: '24px', height: '24px', color: '#10b981', marginRight: '12px', marginTop: '2px', flexShrink: 0 }} />
                            <div>
                              <h5 className="fw-bold mb-1" style={{ color: '#14432A' }}>Build Trust History</h5>
                              <p className="text-muted mb-0">Build trust history month after month with consistent on-time payments tracked in our in-house system</p>
                            </div>
                          </li>
                          <li className="mb-3 d-flex align-items-start">
                            <CheckCircleIcon style={{ width: '24px', height: '24px', color: '#10b981', marginRight: '12px', marginTop: '2px', flexShrink: 0 }} />
                            <div>
                              <h5 className="fw-bold mb-1" style={{ color: '#14432A' }}>Improve Your Score</h5>
                              <p className="text-muted mb-0">Improve your in-house trust score for better rental opportunities and platform benefits</p>
                            </div>
                          </li>
                          <li className="mb-3 d-flex align-items-start">
                            <CheckCircleIcon style={{ width: '24px', height: '24px', color: '#10b981', marginRight: '12px', marginTop: '2px', flexShrink: 0 }} />
                            <div>
                              <h5 className="fw-bold mb-1" style={{ color: '#14432A' }}>Pathway to Better Opportunities</h5>
                              <p className="text-muted mb-0">Create a pathway to better housing opportunities through consistent rental equity building</p>
                            </div>
                          </li>
                          <li className="d-flex align-items-start">
                            <CheckCircleIcon style={{ width: '24px', height: '24px', color: '#10b981', marginRight: '12px', marginTop: '2px', flexShrink: 0 }} />
                            <div>
                              <h5 className="fw-bold mb-1" style={{ color: '#14432A' }}>Better Platform Standing</h5>
                              <p className="text-muted mb-0">Qualify for better rates on rentals and access premium features within our platform</p>
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
                              * Results based on average user data from renters with consistent on-time payments tracked in our in-house trust system.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>

                {/* CTA Section */}
                <div className="text-center">
                  <Link href="/trustscore" className="btn btn-primary btn-lg px-5 py-3 fw-bold me-3">
                    Learn More About Trust Scores
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
      <Footer />
    </>
  )
}

