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
  UserGroupIcon, 
  ShieldCheckIcon, 
  CreditCardIcon,
  CheckCircleIcon,
  HomeIcon,
  CalendarIcon,
  ChatBubbleLeftRightIcon,
  QuestionMarkCircleIcon,
  StarIcon
} from '@heroicons/react/24/outline'

export default function Hosts() {
  const [nights, setNights] = useState(7)
  const [location, setLocation] = useState('McKinney')
  const estimatedEarnings = nights * 156

  return (
    <>
      <Navbar />
      <main style={{ backgroundColor: '#ffffff' }}>
        {/* Hero Section with Earnings Calculator */}
        <section className="py-5" style={{ backgroundColor: '#f7f7f7', paddingTop: '100px' }}>
          <div className="container">
            <div className="row align-items-center">
              <div className="col-lg-6 mb-5 mb-lg-0">
                <h1 className="display-4 fw-bold mb-4" style={{ 
                  color: '#222222',
                  fontSize: '3rem',
                  lineHeight: '1.1'
                }}>
                  Your home could make
                </h1>
                <div className="mb-4">
                  <div className="d-flex align-items-baseline">
                    <span className="display-3 fw-bold" style={{ color: '#FF385C' }}>${estimatedEarnings.toLocaleString()}</span>
                  </div>
                  <p className="text-muted mb-0" style={{ fontSize: '1.1rem' }}>
                    on Centuries Mutual
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
                      Learn how we estimate earnings
                    </Link>
                  </p>
                </div>
                
                {/* Nights Slider */}
                <div className="mb-4">
                  <label className="form-label fw-bold" style={{ color: '#222222' }}>
                    How many nights? {nights} nights. Hosting {nights} nights. Adjustable.
                  </label>
                  <input
                    type="range"
                    className="form-range"
                    min="1"
                    max="30"
                    value={nights}
                    onChange={(e) => setNights(parseInt(e.target.value))}
                    style={{ 
                      accentColor: '#FF385C',
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
                      <h3 className="fw-bold">Start Hosting Today</h3>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* It's Easy to List Section */}
        <section className="py-5">
          <div className="container">
            <motion.div className="row mb-5" {...sectionAnimation}>
              <div className="col-lg-8 mx-auto text-center">
                <h2 className="display-5 fw-bold mb-4" style={{ color: '#222222' }}>
                  It's easy to list your home on Centuries Mutual
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
                    <HomeIcon style={{ width: '40px', height: '40px', color: '#14432A' }} />
                  </div>
                  <h4 className="fw-bold mb-3" style={{ color: '#222222' }}>
                    Create a listing for your place in just a few steps
                  </h4>
                  <p className="text-muted">
                    Go at your own pace, and make changes whenever
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
                    <ChatBubbleLeftRightIcon style={{ width: '40px', height: '40px', color: '#14432A' }} />
                  </div>
                  <h4 className="fw-bold mb-3" style={{ color: '#222222' }}>
                    Get 1:1 support from experienced hosts at any time
                  </h4>
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
                    <UserGroupIcon style={{ width: '40px', height: '40px', color: '#14432A' }} />
                  </div>
                  <h4 className="fw-bold mb-3" style={{ color: '#222222' }}>
                    A co-host can help you get started
                  </h4>
                  <p className="text-muted">
                    Now you can hire a local co-host to help create your listing, get your space ready, and more.
                  </p>
                </div>
              </motion.div>
            </motion.div>

            {/* Co-hosts Section */}
            <motion.div className="row mb-5" {...sectionAnimation}>
              <div className="col-12">
                <h3 className="fw-bold mb-4" style={{ color: '#222222' }}>Find a co-host</h3>
                <motion.div 
                  className="row g-3"
                  variants={staggerContainer}
                  initial="initial"
                  whileInView="animate"
                  viewport={{ once: true, margin: '-50px' }}
                >
                  {[
                    { name: 'Jorge', location: 'Mexico City, Mexico', rating: 4.89, years: 5 },
                    { name: 'Gabrielle', location: 'North Charleston, USA', rating: 4.98, years: 3 },
                    { name: 'Mariam', location: 'Los Angeles, USA', rating: 4.94, years: 5 },
                    { name: 'Elizabeth', location: 'Temple, USA', rating: 4.98, years: 4 },
                    { name: 'Anthony', location: 'Toronto, Canada', rating: 4.95, years: 9 },
                    { name: 'Jennifer', location: 'La Quinta, USA', rating: 4.96, years: 4 },
                    { name: 'Kayla', location: 'Los Angeles, USA', rating: 4.96, years: 5 }
                  ].map((host, idx) => (
                    <motion.div key={idx} className="col-md-3 col-sm-6" variants={cardAnimation}>
                      <div className="card border-0 shadow-sm h-100" style={{ borderRadius: '12px' }}>
                        <div className="card-body p-3 text-center">
                          <div className="mb-2" style={{
                            width: '60px',
                            height: '60px',
                            borderRadius: '50%',
                            background: 'rgba(20, 67, 42, 0.1)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            margin: '0 auto'
                          }}>
                            <span className="fw-bold" style={{ color: '#14432A', fontSize: '1.5rem' }}>
                              {host.name[0]}
                            </span>
                          </div>
                          <h6 className="fw-bold mb-1" style={{ color: '#222222' }}>{host.name}</h6>
                          <p className="text-muted small mb-2">Co-host in {host.location}</p>
                          <div className="d-flex justify-content-center align-items-center gap-1 mb-1">
                            <StarIcon style={{ width: '14px', height: '14px', color: '#FF385C', fill: '#FF385C' }} />
                            <span className="small fw-bold">{host.rating}</span>
                            <span className="text-muted small">guest rating</span>
                          </div>
                          <p className="text-muted small mb-0">{host.years} years hosting</p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              </div>
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
                  <h2 className="fw-bold mb-0" style={{ color: '#222222' }}>Centuries Mutual Protection for Hosts</h2>
                </div>
                <p className="lead mb-4" style={{ color: '#222222' }}>
                  However you host, you're protected
                </p>
                <p className="text-muted mb-4">
                  Top-to-bottom protection, included every time you host your home on Centuries Mutual.
                </p>
                <ul className="list-unstyled">
                  <li className="mb-3 d-flex align-items-start">
                    <CheckCircleIcon style={{ width: '24px', height: '24px', color: '#10b981', marginRight: '12px', flexShrink: 0 }} />
                    <div>
                      <h5 className="fw-bold mb-1" style={{ color: '#222222' }}>Up to $3M damage protection</h5>
                    </div>
                  </li>
                  <li className="mb-3 d-flex align-items-start">
                    <CheckCircleIcon style={{ width: '24px', height: '24px', color: '#10b981', marginRight: '12px', flexShrink: 0 }} />
                    <div>
                      <h5 className="fw-bold mb-1" style={{ color: '#222222' }}>Up to $1M liability insurance</h5>
                    </div>
                  </li>
                  <li className="mb-3 d-flex align-items-start">
                    <CheckCircleIcon style={{ width: '24px', height: '24px', color: '#10b981', marginRight: '12px', flexShrink: 0 }} />
                    <div>
                      <h5 className="fw-bold mb-1" style={{ color: '#222222' }}>24-hour safety line</h5>
                    </div>
                  </li>
                </ul>
                <Link href="#" className="btn btn-outline-dark">
                  Learn about Protection
                </Link>
              </motion.div>
              <motion.div className="col-lg-6" {...slideInRight}>
                <div className="card border-0 shadow-lg" style={{ borderRadius: '16px' }}>
                  <div className="card-body p-5" style={{ background: 'linear-gradient(135deg, #14432A 0%, #1a5436 100%)', color: 'white' }}>
                    <h4 className="fw-bold mb-4">Protection Details</h4>
                    <p className="mb-0" style={{ opacity: 0.9 }}>
                      Host Damage Protection reimburses for certain guest damages during stays. It's not insurance and may apply if guests don't pay. Liability insurance is provided by 3rd parties. See details and exclusions.
                    </p>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Tools Section */}
        <section className="py-5">
          <div className="container">
            <motion.div className="row mb-5" {...sectionAnimation}>
              <div className="col-lg-8 mx-auto text-center">
                <h2 className="display-5 fw-bold mb-4" style={{ color: '#222222' }}>
                  All the tools you need to host, all in one app
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
                    <HomeIcon style={{ width: '48px', height: '48px', color: '#14432A', marginBottom: '20px' }} />
                    <h4 className="fw-bold mb-3" style={{ color: '#222222' }}>Listing editor</h4>
                    <p className="text-muted">
                      Showcase every detail of your home
                    </p>
                  </div>
                </div>
              </motion.div>
              <motion.div className="col-md-4" variants={cardAnimation}>
                <div className="card border-0 shadow-sm h-100" style={{ borderRadius: '16px' }}>
                  <div className="card-body p-4">
                    <CalendarIcon style={{ width: '48px', height: '48px', color: '#14432A', marginBottom: '20px' }} />
                    <h4 className="fw-bold mb-3" style={{ color: '#222222' }}>Calendar</h4>
                    <p className="text-muted">
                      Manage your availability and pricing
                    </p>
                  </div>
                </div>
              </motion.div>
              <motion.div className="col-md-4" variants={cardAnimation}>
                <div className="card border-0 shadow-sm h-100" style={{ borderRadius: '16px' }}>
                  <div className="card-body p-4">
                    <ChatBubbleLeftRightIcon style={{ width: '48px', height: '48px', color: '#14432A', marginBottom: '20px' }} />
                    <h4 className="fw-bold mb-3" style={{ color: '#222222' }}>Messages</h4>
                    <p className="text-muted">
                      Quickly message guests and support
                    </p>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* Hosting for Renters Section */}
        <section className="py-5" style={{ backgroundColor: '#f7f7f7' }}>
          <div className="container">
            <div className="row align-items-center">
              <motion.div className="col-lg-6 mb-4 mb-lg-0" {...slideInLeft}>
                <h2 className="display-6 fw-bold mb-4" style={{ color: '#222222' }}>
                  Hosting isn't only for homeowners
                </h2>
                <p className="lead text-muted mb-4">
                  Centuries Mutual-friendly apartments make it easy for you to rent, host, and earn extra income when you're away.
                </p>
                <Link href="#" className="btn btn-dark btn-lg">
                  Learn more
                </Link>
              </motion.div>
              <motion.div className="col-lg-6" {...slideInRight}>
                <div style={{
                  height: '300px',
                  background: 'linear-gradient(135deg, #14432A 0%, #1a5436 100%)',
                  borderRadius: '16px'
                }}></div>
              </motion.div>
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
                      {['How much can I earn hosting?', 'What if I need help with my listing?', 'How do I get paid?', 'What are the requirements?'].map((q, idx) => (
                        <li key={idx} className="mb-2">
                          <Link href="#" className="text-decoration-none text-muted">
                            {q}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="col-md-6 mb-3">
                    <h5 className="fw-bold mb-3" style={{ color: '#222222' }}>Hosting basics</h5>
                    <ul className="list-unstyled">
                      {['How to create a listing', 'Setting your price', 'Managing reservations', 'Guest communication'].map((q, idx) => (
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
                    <h5 className="fw-bold mb-3" style={{ color: '#222222' }}>Policy & regulations</h5>
                    <ul className="list-unstyled">
                      {['Local regulations', 'Tax information', 'Insurance coverage', 'Safety requirements'].map((q, idx) => (
                        <li key={idx} className="mb-2">
                          <Link href="#" className="text-decoration-none text-muted">
                            {q}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="col-md-6 mb-3">
                    <h5 className="fw-bold mb-3" style={{ color: '#222222' }}>Co-hosts</h5>
                    <ul className="list-unstyled">
                      {['What is a co-host?', 'How to find a co-host', 'Co-host responsibilities', 'Co-host fees'].map((q, idx) => (
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
                    Get answers from an experienced local host
                  </Link>
                  <p className="mt-3 mb-0">
                    <Link href="/contact" className="text-decoration-none" style={{ color: '#222222' }}>
                      Ask a host
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
