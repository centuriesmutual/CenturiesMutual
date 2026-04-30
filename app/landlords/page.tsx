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
  CalendarIcon,
  ChatBubbleLeftRightIcon,
  DocumentTextIcon,
  KeyIcon,
  UserGroupIcon
} from '@heroicons/react/24/outline'

export default function LandLords() {
  const [properties, setProperties] = useState(1)
  const [location, setLocation] = useState('McKinney')
  const estimatedEarnings = properties * 1500 // Example average earnings per property

  return (
    <>
      <Navbar />
      <main style={{ backgroundColor: '#ffffff' }}>
        {/* Hero Section with Revenue Calculator */}
        <section className="py-5" style={{ backgroundColor: '#f7f7f7', paddingTop: '100px' }}>
          <div className="container">
            <div className="row align-items-center">
              <div className="col-lg-6 mb-5 mb-lg-0">
                <h1 className="display-4 fw-bold mb-4" style={{ 
                  color: '#222222',
                  fontSize: '3rem',
                  lineHeight: '1.1'
                }}>
                  Manage your properties and earn
                </h1>
                <div className="mb-4">
                  <div className="d-flex align-items-baseline">
                    <span className="display-3 fw-bold" style={{ color: '#FF385C' }}>${estimatedEarnings.toLocaleString()}</span>
                  </div>
                  <p className="text-muted mb-0" style={{ fontSize: '1.1rem' }}>
                    per month on Centuries Mutual
                  </p>
                </div>
                <div className="mb-4">
                  <div className="d-flex align-items-center gap-3 mb-2">
                    <span className="text-muted">{properties} {properties === 1 ? 'property' : 'properties'}</span>
                    <span className="text-muted">·</span>
                    <span className="text-muted">${1500}/property (avg)</span>
                  </div>
                  <p className="text-muted small mb-3">
                    <Link href="#" className="text-decoration-none" style={{ color: '#222222' }}>
                      Learn how we estimate earnings
                    </Link>
                  </p>
                </div>
                
                {/* Properties Slider */}
                <div className="mb-4">
                  <label className="form-label fw-bold" style={{ color: '#222222' }}>
                    How many properties? {properties} {properties === 1 ? 'property' : 'properties'}. Adjustable.
                  </label>
                  <input
                    type="range"
                    className="form-range"
                    min="1"
                    max="10"
                    value={properties}
                    onChange={(e) => setProperties(parseInt(e.target.value))}
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
                      {location}, · Residential, · Commercial
                    </span>
                  </div>
                </div>

                <div className="mb-4">
                  <p className="text-muted small mb-2">Centered on Texas. Explore rates near you</p>
                  <div className="d-flex flex-wrap gap-2">
                    {['$1500', '$1800', '$1200', '$2000', '$2500'].map((price, idx) => (
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
                      <h3 className="fw-bold">Start Managing Today</h3>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* It's Easy to Manage Section */}
        <section className="py-5">
          <div className="container">
            <motion.div className="row mb-5" {...sectionAnimation}>
              <div className="col-lg-8 mx-auto text-center">
                <h2 className="display-5 fw-bold mb-4" style={{ color: '#222222' }}>
                  It's easy to manage your properties on Centuries Mutual
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
                    List your properties in just a few steps
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
                    <UserGroupIcon style={{ width: '40px', height: '40px', color: '#14432A' }} />
                  </div>
                  <h4 className="fw-bold mb-3" style={{ color: '#222222' }}>
                    Get 1:1 support from our property experts
                  </h4>
                  <p className="text-muted">
                    Our team is here to help you succeed
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
                    <CreditCardIcon style={{ width: '40px', height: '40px', color: '#14432A' }} />
                  </div>
                  <h4 className="fw-bold mb-3" style={{ color: '#222222' }}>
                    Connect with verified tenants
                  </h4>
                  <p className="text-muted">
                    Our trust score system helps you find reliable renters
                  </p>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* Landlord Protection Section */}
        <section className="py-5" style={{ backgroundColor: '#f7f7f7' }}>
          <div className="container">
            <div className="row align-items-center">
              <motion.div className="col-lg-6 mb-4 mb-lg-0" {...slideInLeft}>
                <div className="d-flex align-items-center mb-3">
                  <ShieldCheckIcon style={{ width: '48px', height: '48px', color: '#14432A', marginRight: '16px' }} />
                  <h2 className="fw-bold mb-0" style={{ color: '#222222' }}>Landlord Protection</h2>
                </div>
                <p className="lead mb-4" style={{ color: '#222222' }}>
                  However you manage, you're protected
                </p>
                <p className="text-muted mb-4">
                  Top-to-bottom protection, included every time you list your property on Centuries Mutual.
                </p>
                <ul className="list-unstyled">
                  <li className="mb-3 d-flex align-items-start">
                    <CheckCircleIcon style={{ width: '24px', height: '24px', color: '#10b981', marginRight: '12px', flexShrink: 0 }} />
                    <div>
                      <h5 className="fw-bold mb-1" style={{ color: '#222222' }}>Verified tenant screening</h5>
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
                      <h5 className="fw-bold mb-1" style={{ color: '#222222' }}>eDocument system for leases</h5>
                    </div>
                  </li>
                </ul>
                <Link href="/trustscore" className="btn btn-dark btn-lg">
                  Learn about Trust Scores
                </Link>
              </motion.div>
              <motion.div className="col-lg-6" {...slideInRight}>
                <div className="card border-0 shadow-lg" style={{ borderRadius: '16px' }}>
                  <div className="card-body p-5" style={{ background: 'linear-gradient(135deg, #14432A 0%, #1a5436 100%)', color: 'white' }}>
                    <h4 className="fw-bold mb-4">Protection Features</h4>
                    <div className="mb-4">
                      <div className="d-flex justify-content-between mb-2">
                        <span>Tenant Screening</span>
                        <span className="fw-bold">✓ Verified</span>
                      </div>
                      <div className="progress" style={{ height: '8px', backgroundColor: 'rgba(255,255,255,0.2)' }}>
                        <div className="progress-bar" style={{ width: '100%', backgroundColor: 'white' }}></div>
                      </div>
                    </div>
                    <div className="mb-4">
                      <div className="d-flex justify-content-between mb-2">
                        <span>Payment Security</span>
                        <span className="fw-bold">✓ Encrypted</span>
                      </div>
                      <div className="progress" style={{ height: '8px', backgroundColor: 'rgba(255,255,255,0.2)' }}>
                        <div className="progress-bar" style={{ width: '100%', backgroundColor: 'white' }}></div>
                      </div>
                    </div>
                    <div className="mb-4">
                      <div className="d-flex justify-content-between mb-2">
                        <span>Legal Document Storage</span>
                        <span className="fw-bold">✓ Secure</span>
                      </div>
                      <div className="progress" style={{ height: '8px', backgroundColor: 'rgba(255,255,255,0.2)' }}>
                        <div className="progress-bar" style={{ width: '100%', backgroundColor: 'white' }}></div>
                      </div>
                    </div>
                    <p className="mb-0 mt-4" style={{ fontSize: '0.9rem', opacity: 0.9 }}>
                      * All protection features are active for landlords using our platform.
                    </p>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Property Management Features */}
        <section className="py-5">
          <div className="container">
            <motion.div className="row mb-5" {...sectionAnimation}>
              <div className="col-lg-8 mx-auto text-center">
                <h2 className="display-5 fw-bold mb-4" style={{ color: '#222222' }}>
                  Comprehensive Property Management
                </h2>
                <p className="lead text-muted mb-5">
                  Everything you need to manage your properties efficiently, from tenant screening to financial reporting, all in one integrated platform.
                </p>
              </div>
            </motion.div>
            <motion.div 
              className="row g-4 mb-5"
              variants={staggerContainer}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true, margin: '-50px' }}
            >
              <motion.div className="col-md-6 col-lg-4" variants={cardAnimation}>
                <div className="card border-0 shadow-sm h-100" style={{ borderRadius: '16px' }}>
                  <div className="card-body p-4">
                    <ShieldCheckIcon style={{ width: '48px', height: '48px', color: '#14432A', marginBottom: '20px' }} />
                    <h4 className="fw-bold mb-3" style={{ color: '#222222' }}>Verified Tenants</h4>
                    <p className="text-muted mb-3">
                      Access our in-house trust score system to find reliable tenants with verified backgrounds and payment history.
                    </p>
                    <ul className="list-unstyled small text-muted">
                      <li className="mb-2">
                        <i className="bi bi-check-circle-fill text-success me-2"></i>
                        Background checks & credit verification
                      </li>
                      <li className="mb-2">
                        <i className="bi bi-check-circle-fill text-success me-2"></i>
                        Trust score evaluation
                      </li>
                      <li className="mb-2">
                        <i className="bi bi-check-circle-fill text-success me-2"></i>
                        Rental history verification
                      </li>
                    </ul>
                  </div>
                </div>
              </motion.div>
              <motion.div className="col-md-6 col-lg-4" variants={cardAnimation}>
                <div className="card border-0 shadow-sm h-100" style={{ borderRadius: '16px' }}>
                  <div className="card-body p-4">
                    <CreditCardIcon style={{ width: '48px', height: '48px', color: '#14432A', marginBottom: '20px' }} />
                    <h4 className="fw-bold mb-3" style={{ color: '#222222' }}>Secure Payments</h4>
                    <p className="text-muted mb-3">
                      Receive rent payments instantly through our blockchain-powered payment system with Coinbase Wallet integration.
                    </p>
                    <ul className="list-unstyled small text-muted">
                      <li className="mb-2">
                        <i className="bi bi-check-circle-fill text-success me-2"></i>
                        Automated rent collection
                      </li>
                      <li className="mb-2">
                        <i className="bi bi-check-circle-fill text-success me-2"></i>
                        Instant payment notifications
                      </li>
                      <li className="mb-2">
                        <i className="bi bi-check-circle-fill text-success me-2"></i>
                        Multiple payment methods
                      </li>
                    </ul>
                  </div>
                </div>
              </motion.div>
              <motion.div className="col-md-6 col-lg-4" variants={cardAnimation}>
                <div className="card border-0 shadow-sm h-100" style={{ borderRadius: '16px' }}>
                  <div className="card-body p-4">
                    <DocumentTextIcon style={{ width: '48px', height: '48px', color: '#14432A', marginBottom: '20px' }} />
                    <h4 className="fw-bold mb-3" style={{ color: '#222222' }}>Document Management</h4>
                    <p className="text-muted mb-3">
                      Manage all your leases, contracts, and property documents in one secure platform.
                    </p>
                    <ul className="list-unstyled small text-muted">
                      <li className="mb-2">
                        <i className="bi bi-check-circle-fill text-success me-2"></i>
                        Legally binding eDocuments
                      </li>
                      <li className="mb-2">
                        <i className="bi bi-check-circle-fill text-success me-2"></i>
                        Digital signature support
                      </li>
                      <li className="mb-2">
                        <i className="bi bi-check-circle-fill text-success me-2"></i>
                        Cloud storage & backup
                      </li>
                    </ul>
                  </div>
                </div>
              </motion.div>
              <motion.div className="col-md-6 col-lg-4" variants={cardAnimation}>
                <div className="card border-0 shadow-sm h-100" style={{ borderRadius: '16px' }}>
                  <div className="card-body p-4">
                    <CalendarIcon style={{ width: '48px', height: '48px', color: '#14432A', marginBottom: '20px' }} />
                    <h4 className="fw-bold mb-3" style={{ color: '#222222' }}>Lease Management</h4>
                    <p className="text-muted mb-3">
                      Track lease terms, renewals, and important dates with automated reminders.
                    </p>
                    <ul className="list-unstyled small text-muted">
                      <li className="mb-2">
                        <i className="bi bi-check-circle-fill text-success me-2"></i>
                        Automated renewal reminders
                      </li>
                      <li className="mb-2">
                        <i className="bi bi-check-circle-fill text-success me-2"></i>
                        Lease term tracking
                      </li>
                      <li className="mb-2">
                        <i className="bi bi-check-circle-fill text-success me-2"></i>
                        Important date notifications
                      </li>
                    </ul>
                  </div>
                </div>
              </motion.div>
              <motion.div className="col-md-6 col-lg-4" variants={cardAnimation}>
                <div className="card border-0 shadow-sm h-100" style={{ borderRadius: '16px' }}>
                  <div className="card-body p-4">
                    <ChatBubbleLeftRightIcon style={{ width: '48px', height: '48px', color: '#14432A', marginBottom: '20px' }} />
                    <h4 className="fw-bold mb-3" style={{ color: '#222222' }}>Tenant Communication</h4>
                    <p className="text-muted mb-3">
                      Secure messaging platform for all tenant communications and support.
                    </p>
                    <ul className="list-unstyled small text-muted">
                      <li className="mb-2">
                        <i className="bi bi-check-circle-fill text-success me-2"></i>
                        In-app messaging system
                      </li>
                      <li className="mb-2">
                        <i className="bi bi-check-circle-fill text-success me-2"></i>
                        Maintenance request tracking
                      </li>
                      <li className="mb-2">
                        <i className="bi bi-check-circle-fill text-success me-2"></i>
                        Document sharing
                      </li>
                    </ul>
                  </div>
                </div>
              </motion.div>
              <motion.div className="col-md-6 col-lg-4" variants={cardAnimation}>
                <div className="card border-0 shadow-sm h-100" style={{ borderRadius: '16px' }}>
                  <div className="card-body p-4">
                    <ChartBarIcon style={{ width: '48px', height: '48px', color: '#14432A', marginBottom: '20px' }} />
                    <h4 className="fw-bold mb-3" style={{ color: '#222222' }}>Analytics & Reports</h4>
                    <p className="text-muted mb-3">
                      Track income, expenses, and property performance with detailed analytics.
                    </p>
                    <ul className="list-unstyled small text-muted">
                      <li className="mb-2">
                        <i className="bi bi-check-circle-fill text-success me-2"></i>
                        Income & expense tracking
                      </li>
                      <li className="mb-2">
                        <i className="bi bi-check-circle-fill text-success me-2"></i>
                        Performance dashboards
                      </li>
                      <li className="mb-2">
                        <i className="bi bi-check-circle-fill text-success me-2"></i>
                        Tax-ready reports
                      </li>
                    </ul>
                  </div>
                </div>
              </motion.div>
            </motion.div>

            {/* Additional Property Management Features */}
            <motion.div 
              className="row g-4 mt-4"
              variants={staggerContainer}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true, margin: '-50px' }}
            >
              <motion.div className="col-md-6 col-lg-4" variants={cardAnimation}>
                <div className="card border-0 shadow-sm h-100" style={{ borderRadius: '16px' }}>
                  <div className="card-body p-4">
                    <KeyIcon style={{ width: '48px', height: '48px', color: '#14432A', marginBottom: '20px' }} />
                    <h4 className="fw-bold mb-3" style={{ color: '#222222' }}>Maintenance Management</h4>
                    <p className="text-muted mb-3">
                      Streamline maintenance requests and track work orders from submission to completion.
                    </p>
                    <ul className="list-unstyled small text-muted">
                      <li className="mb-2">
                        <i className="bi bi-check-circle-fill text-success me-2"></i>
                        Request tracking system
                      </li>
                      <li className="mb-2">
                        <i className="bi bi-check-circle-fill text-success me-2"></i>
                        Vendor management
                      </li>
                      <li className="mb-2">
                        <i className="bi bi-check-circle-fill text-success me-2"></i>
                        Cost tracking & budgeting
                      </li>
                    </ul>
                  </div>
                </div>
              </motion.div>
              <motion.div className="col-md-6 col-lg-4" variants={cardAnimation}>
                <div className="card border-0 shadow-sm h-100" style={{ borderRadius: '16px' }}>
                  <div className="card-body p-4">
                    <HomeIcon style={{ width: '48px', height: '48px', color: '#14432A', marginBottom: '20px' }} />
                    <h4 className="fw-bold mb-3" style={{ color: '#222222' }}>Property Inspections</h4>
                    <p className="text-muted mb-3">
                      Schedule and document property inspections with photo uploads and detailed reports.
                    </p>
                    <ul className="list-unstyled small text-muted">
                      <li className="mb-2">
                        <i className="bi bi-check-circle-fill text-success me-2"></i>
                        Inspection scheduling
                      </li>
                      <li className="mb-2">
                        <i className="bi bi-check-circle-fill text-success me-2"></i>
                        Photo documentation
                      </li>
                      <li className="mb-2">
                        <i className="bi bi-check-circle-fill text-success me-2"></i>
                        Condition reports
                      </li>
                    </ul>
                  </div>
                </div>
              </motion.div>
              <motion.div className="col-md-6 col-lg-4" variants={cardAnimation}>
                <div className="card border-0 shadow-sm h-100" style={{ borderRadius: '16px' }}>
                  <div className="card-body p-4">
                    <UserGroupIcon style={{ width: '48px', height: '48px', color: '#14432A', marginBottom: '20px' }} />
                    <h4 className="fw-bold mb-3" style={{ color: '#222222' }}>Tenant Portal</h4>
                    <p className="text-muted mb-3">
                      Provide tenants with their own portal to pay rent, submit requests, and access documents.
                    </p>
                    <ul className="list-unstyled small text-muted">
                      <li className="mb-2">
                        <i className="bi bi-check-circle-fill text-success me-2"></i>
                        Self-service portal
                      </li>
                      <li className="mb-2">
                        <i className="bi bi-check-circle-fill text-success me-2"></i>
                        Payment history access
                      </li>
                      <li className="mb-2">
                        <i className="bi bi-check-circle-fill text-success me-2"></i>
                        Document downloads
                      </li>
                    </ul>
                  </div>
                </div>
              </motion.div>
            </motion.div>

            {/* Benefits Summary */}
            <motion.div className="row mt-5" {...sectionAnimation}>
              <div className="col-lg-10 mx-auto">
                <div className="card border-0 shadow-sm" style={{ 
                  borderRadius: '16px',
                  background: 'linear-gradient(135deg, rgba(20, 67, 42, 0.05) 0%, rgba(20, 67, 42, 0.1) 100%)'
                }}>
                  <div className="card-body p-5">
                    <div className="row align-items-center">
                      <div className="col-md-8">
                        <h3 className="fw-bold mb-3" style={{ color: '#222222' }}>
                          Complete Property Management Solution
                        </h3>
                        <p className="text-muted mb-0">
                          Our comprehensive platform handles every aspect of property management, from initial listing to ongoing maintenance. 
                          Save time, reduce costs, and maximize your property's potential with our integrated tools and services.
                        </p>
                      </div>
                      <div className="col-md-4 text-center text-md-end">
                        <Link href="/contact" className="btn btn-primary btn-lg px-4 py-3">
                          Get Started
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>


        {/* Tools Section */}
        <section className="py-5">
          <div className="container">
            <motion.div className="row mb-5" {...sectionAnimation}>
              <div className="col-lg-8 mx-auto text-center">
                <h2 className="display-5 fw-bold mb-4" style={{ color: '#222222' }}>
                  All the tools you need to manage your properties, all in one app
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
              <motion.div className="col-md-4" variants={staggerItem}>
                <div className="card border-0 shadow-sm h-100" style={{ borderRadius: '16px' }}>
                  <div className="card-body p-4 text-center">
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
                    <h5 className="fw-bold mb-2" style={{ color: '#222222' }}>Property Dashboard</h5>
                    <p className="text-muted mb-0">
                      Manage all your listings, bookings, and tenant communications from a single dashboard.
                    </p>
                  </div>
                </div>
              </motion.div>
              <motion.div className="col-md-4" variants={staggerItem}>
                <div className="card border-0 shadow-sm h-100" style={{ borderRadius: '16px' }}>
                  <div className="card-body p-4 text-center">
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
                      <CalendarIcon style={{ width: '40px', height: '40px', color: '#14432A' }} />
                    </div>
                    <h5 className="fw-bold mb-2" style={{ color: '#222222' }}>Automated Calendar</h5>
                    <p className="text-muted mb-0">
                      Keep track of availability, maintenance schedules, and lease renewals with ease.
                    </p>
                  </div>
                </div>
              </motion.div>
              <motion.div className="col-md-4" variants={staggerItem}>
                <div className="card border-0 shadow-sm h-100" style={{ borderRadius: '16px' }}>
                  <div className="card-body p-4 text-center">
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
                      <CreditCardIcon style={{ width: '40px', height: '40px', color: '#14432A' }} />
                    </div>
                    <h5 className="fw-bold mb-2" style={{ color: '#222222' }}>Secure Payments</h5>
                    <p className="text-muted mb-0">
                      Receive rent payments securely and instantly through our blockchain-powered system.
                    </p>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-5" style={{ backgroundColor: '#f7f7f7' }}>
          <div className="container">
            <motion.div className="row mb-5" {...sectionAnimation}>
              <div className="col-lg-8 mx-auto text-center">
                <h2 className="display-5 fw-bold mb-4" style={{ color: '#222222' }}>
                  Your questions, answered
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
              <motion.div className="col-md-6" variants={staggerItem}>
                <div className="card border-0 shadow-sm h-100" style={{ borderRadius: '16px' }}>
                  <div className="card-body p-4">
                    <h5 className="fw-bold mb-3" style={{ color: '#222222' }}>Top questions</h5>
                    <ul className="list-unstyled mb-0">
                      <li className="mb-2"><Link href="#" className="text-decoration-none text-muted">How do I list my property?</Link></li>
                      <li className="mb-2"><Link href="#" className="text-decoration-none text-muted">What are the fees for landlords?</Link></li>
                      <li className="mb-2"><Link href="#" className="text-decoration-none text-muted">How does tenant screening work?</Link></li>
                    </ul>
                  </div>
                </div>
              </motion.div>
              <motion.div className="col-md-6" variants={staggerItem}>
                <div className="card border-0 shadow-sm h-100" style={{ borderRadius: '16px' }}>
                  <div className="card-body p-4">
                    <h5 className="fw-bold mb-3" style={{ color: '#222222' }}>Property management basics</h5>
                    <ul className="list-unstyled mb-0">
                      <li className="mb-2"><Link href="#" className="text-decoration-none text-muted">Managing multiple properties</Link></li>
                      <li className="mb-2"><Link href="#" className="text-decoration-none text-muted">Automated rent collection</Link></li>
                      <li className="mb-2"><Link href="#" className="text-decoration-none text-muted">Lease agreement templates</Link></li>
                    </ul>
                  </div>
                </div>
              </motion.div>
              <motion.div className="col-md-6" variants={staggerItem}>
                <div className="card border-0 shadow-sm h-100" style={{ borderRadius: '16px' }}>
                  <div className="card-body p-4">
                    <h5 className="fw-bold mb-3" style={{ color: '#222222' }}>Policy & regulations</h5>
                    <ul className="list-unstyled mb-0">
                      <li className="mb-2"><Link href="#" className="text-decoration-none text-muted">Local rental laws</Link></li>
                      <li className="mb-2"><Link href="#" className="text-decoration-none text-muted">Fair housing policies</Link></li>
                      <li className="mb-2"><Link href="#" className="text-decoration-none text-muted">Dispute resolution</Link></li>
                    </ul>
                  </div>
                </div>
              </motion.div>
              <motion.div className="col-md-6" variants={staggerItem}>
                <div className="card border-0 shadow-sm h-100" style={{ borderRadius: '16px' }}>
                  <div className="card-body p-4">
                    <h5 className="fw-bold mb-3" style={{ color: '#222222' }}>Tenant screening</h5>
                    <ul className="list-unstyled mb-0">
                      <li className="mb-2"><Link href="#" className="text-decoration-none text-muted">How trust scores are calculated</Link></li>
                      <li className="mb-2"><Link href="#" className="text-decoration-none text-muted">Background check process</Link></li>
                      <li className="mb-2"><Link href="#" className="text-decoration-none text-muted">Income verification</Link></li>
                    </ul>
                  </div>
                </div>
              </motion.div>
            </motion.div>
            <motion.div className="text-center mt-5" {...sectionAnimation}>
              <h4 className="fw-bold mb-3" style={{ color: '#222222' }}>Still have questions?</h4>
              <Link href="/contact" className="btn btn-outline-dark btn-lg px-5 py-3">
                Ask a property expert
              </Link>
            </motion.div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
