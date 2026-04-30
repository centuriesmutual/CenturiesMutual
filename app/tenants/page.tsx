'use client'

import Footer from '../../components/Footer'
import Navbar from '../../components/Navbar'
import Link from 'next/link'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  sectionAnimation,
  staggerContainer,
  staggerItem,
  cardAnimation,
  slideInLeft,
  slideInRight
} from '../../utils/animations'
import { 
  HomeIcon, 
  ShieldCheckIcon, 
  CreditCardIcon,
  CheckCircleIcon,
  ChartBarIcon,
  MapPinIcon,
  StarIcon,
  MagnifyingGlassIcon,
  KeyIcon
} from '@heroicons/react/24/outline'

export default function Tenants() {
  const [nights, setNights] = useState(7)
  const [location, setLocation] = useState('McKinney')
  const estimatedCost = nights * 156

  return (
    <>
      <Navbar />
      <main style={{ backgroundColor: '#ffffff' }}>
        {/* Hero Section with Cost Calculator */}
        <section className="py-5" style={{ backgroundColor: '#f7f7f7', paddingTop: '100px' }}>
          <div className="container">
            <div className="row align-items-center">
              <div className="col-lg-6 mb-5 mb-lg-0">
                <h1 className="display-4 fw-bold mb-4" style={{ 
                  color: '#222222',
                  fontSize: '3rem',
                  lineHeight: '1.1'
                }}>
                  Find your perfect home
                </h1>
                <div className="mb-4">
                  <div className="d-flex align-items-baseline">
                    <span className="display-3 fw-bold" style={{ color: '#14432A' }}>${estimatedCost.toLocaleString()}</span>
                  </div>
                  <p className="text-muted mb-0" style={{ fontSize: '1.1rem' }}>
                    estimated monthly rent on Centuries Mutual
                  </p>
                </div>
                <div className="mb-4">
                  <div className="d-flex align-items-center gap-3 mb-2">
                    <span className="text-muted">{nights} nights</span>
                    <span className="text-muted">·</span>
                    <span className="text-muted">${156}/night</span>
                  </div>
                  <p className="text-muted small mb-3">
                    <Link href="#" className="text-decoration-none" style={{ color: '#222222' }}>
                      Learn how we estimate costs
                    </Link>
                  </p>
                </div>
                
                {/* Nights Slider */}
                <div className="mb-4">
                  <label className="form-label fw-bold" style={{ color: '#222222' }}>
                    How many nights? {nights} nights. Renting {nights} nights. Adjustable.
                  </label>
                  <input
                    type="range"
                    className="form-range"
                    min="1"
                    max="30"
                    value={nights}
                    onChange={(e) => setNights(parseInt(e.target.value))}
                    style={{ 
                      accentColor: '#14432A',
                      height: '8px'
                    }}
                  />
                  <div className="d-flex justify-content-between small text-muted">
                    <span>Slide backward to decrease</span>
                    <span>Slide forward to increase</span>
                  </div>
                </div>

                <div className="mb-4">
                  <input
                    type="text"
                    className="form-control form-control-lg"
                    placeholder="Enter your location"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    style={{
                      borderRadius: '8px',
                      border: '1px solid #dddddd',
                      padding: '12px 16px'
                    }}
                  />
                  <div className="mt-2">
                    <span className="text-muted small">
                      {location}, · Entire place, · 2 bedrooms
                    </span>
                  </div>
                </div>

                <div className="mb-4">
                  <p className="text-muted small mb-2">Centered on Texas. Explore rates near you</p>
                  <div className="d-flex flex-wrap gap-2">
                    {['$194', '$198', '$150', '$184', '$279', '$202', '$205', '$137', '$150', '$508'].map((price, idx) => (
                      <span key={idx} className="badge" style={{ 
                        backgroundColor: '#f7f7f7',
                        color: '#222222',
                        padding: '6px 12px',
                        borderRadius: '8px',
                        border: '1px solid #dddddd'
                      }}>
                        {price} USD, {location}, Texas
                      </span>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="col-lg-6">
                <div className="card border-0 shadow-lg" style={{ borderRadius: '16px', overflow: 'hidden' }}>
                  <div style={{
                    height: '400px',
                    background: 'linear-gradient(135deg, #14432A 0%, #1a5436 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white'
                  }}>
                    <div className="text-center">
                      <HomeIcon style={{ width: '80px', height: '80px', margin: '0 auto 20px' }} />
                      <h3 className="fw-bold">Start Your Search Today</h3>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* It's Easy to Find Section */}
        <section className="py-5">
          <div className="container">
            <motion.div className="row mb-5" {...sectionAnimation}>
              <div className="col-lg-8 mx-auto text-center">
                <h2 className="display-5 fw-bold mb-4" style={{ color: '#222222' }}>
                  It's easy to find your perfect home on Centuries Mutual
                </h2>
              </div>
            </motion.div>
            <motion.div 
              className="row g-4 mb-5"
              variants={staggerContainer}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true, margin: '-50px' }}
            >
              <motion.div className="col-md-4" variants={staggerItem}>
                <div className="text-center">
                  <div className="mb-3" style={{
                    width: '80px',
                    height: '80px',
                    borderRadius: '50%',
                    background: 'rgba(20, 67, 42, 0.1)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto'
                  }}>
                    <MagnifyingGlassIcon style={{ width: '40px', height: '40px', color: '#14432A' }} />
                  </div>
                  <h4 className="fw-bold mb-3" style={{ color: '#222222' }}>
                    Search verified listings in just a few clicks
                  </h4>
                  <p className="text-muted">
                    Browse through thousands of verified properties with our comprehensive search system
                  </p>
                </div>
              </motion.div>
              <motion.div className="col-md-4" variants={staggerItem}>
                <div className="text-center">
                  <div className="mb-3" style={{
                    width: '80px',
                    height: '80px',
                    borderRadius: '50%',
                    background: 'rgba(20, 67, 42, 0.1)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto'
                  }}>
                    <ShieldCheckIcon style={{ width: '40px', height: '40px', color: '#14432A' }} />
                  </div>
                  <h4 className="fw-bold mb-3" style={{ color: '#222222' }}>
                    Connect with verified landlords and hosts
                  </h4>
                  <p className="text-muted">
                    All hosts are verified through our comprehensive trust score system
                  </p>
                </div>
              </motion.div>
              <motion.div className="col-md-4" variants={staggerItem}>
                <div className="text-center">
                  <div className="mb-3" style={{
                    width: '80px',
                    height: '80px',
                    borderRadius: '50%',
                    background: 'rgba(20, 67, 42, 0.1)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto'
                  }}>
                    <KeyIcon style={{ width: '40px', height: '40px', color: '#14432A' }} />
                  </div>
                  <h4 className="fw-bold mb-3" style={{ color: '#222222' }}>
                    Secure booking and payment process
                  </h4>
                  <p className="text-muted">
                    Book with confidence using our blockchain-powered secure payment system
                  </p>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* Rental Equity Section */}
        <section className="py-5" style={{ backgroundColor: '#f7f7f7' }}>
          <div className="container">
            <div className="row align-items-center">
              <motion.div className="col-lg-6 mb-4 mb-lg-0" {...slideInLeft}>
                <div className="d-flex align-items-center mb-3">
                  <ChartBarIcon style={{ width: '48px', height: '48px', color: '#14432A', marginRight: '16px' }} />
                  <h2 className="fw-bold mb-0" style={{ color: '#222222' }}>Build Your Trust Score</h2>
                </div>
                <p className="lead mb-4" style={{ color: '#222222' }}>
                  Transform rent into trust score
                </p>
                <p className="text-muted mb-4">
                  With Rental Equity, every on-time rent payment helps build your trust score, giving you better standing, more opportunities, and greater confidence.
                </p>
                <ul className="list-unstyled">
                  <li className="mb-3 d-flex align-items-start">
                    <CheckCircleIcon style={{ width: '24px', height: '24px', color: '#10b981', marginRight: '12px', flexShrink: 0 }} />
                    <div>
                      <h5 className="fw-bold mb-1" style={{ color: '#222222' }}>Build trust history month after month</h5>
                    </div>
                  </li>
                  <li className="mb-3 d-flex align-items-start">
                    <CheckCircleIcon style={{ width: '24px', height: '24px', color: '#10b981', marginRight: '12px', flexShrink: 0 }} />
                    <div>
                      <h5 className="fw-bold mb-1" style={{ color: '#222222' }}>Improve your trust score for future loans</h5>
                    </div>
                  </li>
                  <li className="mb-3 d-flex align-items-start">
                    <CheckCircleIcon style={{ width: '24px', height: '24px', color: '#10b981', marginRight: '12px', flexShrink: 0 }} />
                    <div>
                      <h5 className="fw-bold mb-1" style={{ color: '#222222' }}>Create a pathway to homeownership</h5>
                    </div>
                  </li>
                  <li className="mb-3 d-flex align-items-start">
                    <CheckCircleIcon style={{ width: '24px', height: '24px', color: '#10b981', marginRight: '12px', flexShrink: 0 }} />
                    <div>
                      <h5 className="fw-bold mb-1" style={{ color: '#222222' }}>Qualify for better rates on rentals</h5>
                    </div>
                  </li>
                </ul>
                <Link href="/rentalequity" className="btn btn-dark btn-lg">
                  Learn about Rental Equity
                </Link>
              </motion.div>
              <div className="col-lg-6">
                <div className="card border-0 shadow-lg" style={{ borderRadius: '16px' }}>
                  <div className="card-body p-5" style={{ background: 'linear-gradient(135deg, #14432A 0%, #1a5436 100%)', color: 'white' }}>
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
                    <p className="mb-0 mt-4" style={{ fontSize: '0.9rem', opacity: 0.9 }}>
                      * Results based on average user data from renters with consistent on-time payments.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Tools Section */}
        <section className="py-5">
          <div className="container">
            <motion.div className="row mb-5" {...sectionAnimation}>
              <div className="col-lg-8 mx-auto text-center">
                <h2 className="display-5 fw-bold mb-4" style={{ color: '#222222' }}>
                  All the tools you need to find your home, all in one app
                </h2>
              </div>
            </motion.div>
            <motion.div 
              className="row g-4"
              variants={staggerContainer}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true, margin: '-50px' }}
            >
              <motion.div className="col-md-4" variants={cardAnimation}>
                <div className="card border-0 shadow-sm h-100" style={{ borderRadius: '16px' }}>
                  <div className="card-body p-4">
                    <MagnifyingGlassIcon style={{ width: '48px', height: '48px', color: '#14432A', marginBottom: '20px' }} />
                    <h4 className="fw-bold mb-3" style={{ color: '#222222' }}>Advanced Search</h4>
                    <p className="text-muted">
                      Filter by location, price, room type, and trust score
                    </p>
                  </div>
                </div>
              </motion.div>
              <motion.div className="col-md-4" variants={cardAnimation}>
                <div className="card border-0 shadow-sm h-100" style={{ borderRadius: '16px' }}>
                  <div className="card-body p-4">
                    <ShieldCheckIcon style={{ width: '48px', height: '48px', color: '#14432A', marginBottom: '20px' }} />
                    <h4 className="fw-bold mb-3" style={{ color: '#222222' }}>Verified Listings</h4>
                    <p className="text-muted">
                      All properties are verified with trust scores and background checks
                    </p>
                  </div>
                </div>
              </motion.div>
              <motion.div className="col-md-4" variants={cardAnimation}>
                <div className="card border-0 shadow-sm h-100" style={{ borderRadius: '16px' }}>
                  <div className="card-body p-4">
                    <CreditCardIcon style={{ width: '48px', height: '48px', color: '#14432A', marginBottom: '20px' }} />
                    <h4 className="fw-bold mb-3" style={{ color: '#222222' }}>Secure Payments</h4>
                    <p className="text-muted">
                      Blockchain-powered secure payment processing
                    </p>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* Protection Section */}
        <section className="py-5" style={{ backgroundColor: '#f7f7f7' }}>
          <div className="container">
            <div className="row align-items-center">
              <motion.div className="col-lg-6 mb-4 mb-lg-0" {...slideInLeft}>
                <div className="d-flex align-items-center mb-3">
                  <ShieldCheckIcon style={{ width: '48px', height: '48px', color: '#14432A', marginRight: '16px' }} />
                  <h2 className="fw-bold mb-0" style={{ color: '#222222' }}>Tenant Protection</h2>
                </div>
                <p className="lead mb-4" style={{ color: '#222222' }}>
                  However you rent, you're protected
                </p>
                <p className="text-muted mb-4">
                  Comprehensive protection included with every rental on Centuries Mutual.
                </p>
                <ul className="list-unstyled">
                  <li className="mb-3 d-flex align-items-start">
                    <CheckCircleIcon style={{ width: '24px', height: '24px', color: '#10b981', marginRight: '12px', flexShrink: 0 }} />
                    <div>
                      <h5 className="fw-bold mb-1" style={{ color: '#222222' }}>Verified landlords and hosts</h5>
                    </div>
                  </li>
                  <li className="mb-3 d-flex align-items-start">
                    <CheckCircleIcon style={{ width: '24px', height: '24px', color: '#10b981', marginRight: '12px', flexShrink: 0 }} />
                    <div>
                      <h5 className="fw-bold mb-1" style={{ color: '#222222' }}>Secure payment processing</h5>
                    </div>
                  </li>
                  <li className="mb-3 d-flex align-items-start">
                    <CheckCircleIcon style={{ width: '24px', height: '24px', color: '#10b981', marginRight: '12px', flexShrink: 0 }} />
                    <div>
                      <h5 className="fw-bold mb-1" style={{ color: '#222222' }}>24-hour support line</h5>
                    </div>
                  </li>
                  <li className="mb-3 d-flex align-items-start">
                    <CheckCircleIcon style={{ width: '24px', height: '24px', color: '#10b981', marginRight: '12px', flexShrink: 0 }} />
                    <div>
                      <h5 className="fw-bold mb-1" style={{ color: '#222222' }}>Rental equity benefits</h5>
                    </div>
                  </li>
                </ul>
                <Link href="/trustscore" className="btn btn-dark btn-lg">
                  Learn about Trust Scores
                </Link>
              </motion.div>
              <div className="col-lg-6">
                <div className="card border-0 shadow-lg" style={{ borderRadius: '16px' }}>
                  <div className="card-body p-5" style={{ background: 'linear-gradient(135deg, #14432A 0%, #1a5436 100%)', color: 'white' }}>
                    <h4 className="fw-bold mb-4">Protection Details</h4>
                    <p className="mb-0" style={{ opacity: 0.9 }}>
                      All rentals are protected through our comprehensive trust score system, secure payment processing, and verified landlord network. Your rental payments help build your trust score for future opportunities.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-5">
          <div className="container">
            <motion.div className="row" {...sectionAnimation}>
              <div className="col-lg-8 mx-auto">
                <h2 className="display-6 fw-bold mb-5 text-center" style={{ color: '#222222' }}>
                  Your questions, answered
                </h2>
                <div className="row mb-4">
                  <div className="col-md-6 mb-3">
                    <h5 className="fw-bold mb-3" style={{ color: '#222222' }}>Top questions</h5>
                    <ul className="list-unstyled">
                      {['How do I search for properties?', 'What is a trust score?', 'How do I make payments?', 'What are the requirements?'].map((q, idx) => (
                        <li key={idx} className="mb-2">
                          <Link href="#" className="text-decoration-none text-muted">
                            {q}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="col-md-6 mb-3">
                    <h5 className="fw-bold mb-3" style={{ color: '#222222' }}>Renting basics</h5>
                    <ul className="list-unstyled">
                      {['How to book a property', 'Understanding trust scores', 'Payment options', 'Lease agreements'].map((q, idx) => (
                        <li key={idx} className="mb-2">
                          <Link href="#" className="text-decoration-none text-muted">
                            {q}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
                <div className="row mb-4">
                  <div className="col-md-6 mb-3">
                    <h5 className="fw-bold mb-3" style={{ color: '#222222' }}>Rental Equity</h5>
                    <ul className="list-unstyled">
                      {['What is rental equity?', 'How to build trust score', 'Benefits of rental equity', 'Payment history tracking'].map((q, idx) => (
                        <li key={idx} className="mb-2">
                          <Link href="#" className="text-decoration-none text-muted">
                            {q}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="col-md-6 mb-3">
                    <h5 className="fw-bold mb-3" style={{ color: '#222222' }}>Safety & Security</h5>
                    <ul className="list-unstyled">
                      {['Verified landlords', 'Secure payments', 'Trust score system', 'Support resources'].map((q, idx) => (
                        <li key={idx} className="mb-2">
                          <Link href="#" className="text-decoration-none text-muted">
                            {q}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
                <div className="text-center">
                  <p className="mb-3" style={{ color: '#222222' }}>Still have questions?</p>
                  <Link href="/contact" className="btn btn-outline-dark">
                    Get answers from our support team
                  </Link>
                  <p className="mt-3 mb-0">
                    <Link href="/contact" className="text-decoration-none" style={{ color: '#222222' }}>
                      Contact Support
                    </Link>
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
