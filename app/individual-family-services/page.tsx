'use client'

import Navbar from '../../components/Navbar'
import Footer from '../../components/Footer'
import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { UserGroupIcon, HeartIcon, ShieldCheckIcon, ChatBubbleLeftRightIcon } from '@heroicons/react/24/outline'

export default function IndividualFamilyServices() {
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
                  Individual & Family Services
                </h1>
                <p className="lead mb-4" style={{ fontSize: '1.4rem' }}>
                  Comprehensive health insurance and counseling services designed for individuals and families
                </p>
                <p className="fs-5 mb-5">
                  Get the protection you need with personalized health insurance plans and access to professional counseling services as an added value benefit with Centuries Mutual.
                </p>
                <div className="d-flex gap-3 flex-wrap">
                  <motion.a 
                    href="/enrollment" 
                    className="btn btn-light btn-lg px-5 py-3"
                    whileTap={{ scale: 0.95 }}
                    transition={{ duration: 0.1 }}
                  >
                    Start Enrollment
                  </motion.a>
                  <motion.a 
                    href="/contact" 
                    className="btn btn-outline-light btn-lg px-5 py-3"
                    whileTap={{ scale: 0.95 }}
                    transition={{ duration: 0.1 }}
                  >
                    Contact Us
                  </motion.a>
                </div>
              </div>
              <div className="col-lg-6">
                <div className="position-relative" style={{ height: '500px', borderRadius: '20px', overflow: 'hidden' }}>
                  <Image
                    src="/mountians.jpeg"
                    alt="Individual & Family Services"
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

        {/* Health Insurance Section */}
        <section className="py-5">
          <div className="container">
            <div className="row mb-5">
              <div className="col-lg-8 mx-auto text-center">
                <h2 className="display-5 fw-bold mb-4" style={{ color: '#14432A' }}>
                  Health Insurance for Individuals & Families
                </h2>
                <p className="lead text-muted">
                  Find the right health insurance coverage that fits your needs and budget. We offer comprehensive plans for individuals and families with flexible options and competitive rates.
                </p>
              </div>
            </div>

            <div className="row g-4 mb-5">
              <div className="col-md-6 col-lg-4">
                <div className="card border-0 shadow-sm h-100" style={{ borderRadius: '16px' }}>
                  <div className="card-body p-4">
                    <div className="mb-3">
                      <UserGroupIcon style={{ width: '48px', height: '48px', color: '#14432A' }} />
                    </div>
                    <h3 className="h4 fw-bold mb-3" style={{ color: '#14432A' }}>Individual Plans</h3>
                    <p className="text-muted">
                      Comprehensive health insurance coverage designed for individuals. Choose from a variety of plans with different coverage levels, deductibles, and premium options to match your specific needs and budget.
                    </p>
                    <ul className="list-unstyled mt-3">
                      <li className="mb-2">
                        <i className="bi bi-check-circle-fill text-success me-2"></i>
                        Flexible coverage options
                      </li>
                      <li className="mb-2">
                        <i className="bi bi-check-circle-fill text-success me-2"></i>
                        Competitive premium rates
                      </li>
                      <li className="mb-2">
                        <i className="bi bi-check-circle-fill text-success me-2"></i>
                        Nationwide network access
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="col-md-6 col-lg-4">
                <div className="card border-0 shadow-sm h-100" style={{ borderRadius: '16px' }}>
                  <div className="card-body p-4">
                    <div className="mb-3">
                      <HeartIcon style={{ width: '48px', height: '48px', color: '#14432A' }} />
                    </div>
                    <h3 className="h4 fw-bold mb-3" style={{ color: '#14432A' }}>Family Plans</h3>
                    <p className="text-muted">
                      Protect your entire family with comprehensive health insurance plans. Family coverage includes spouses, children, and dependents with options for preventive care, emergency services, and specialized treatments.
                    </p>
                    <ul className="list-unstyled mt-3">
                      <li className="mb-2">
                        <i className="bi bi-check-circle-fill text-success me-2"></i>
                        Coverage for all family members
                      </li>
                      <li className="mb-2">
                        <i className="bi bi-check-circle-fill text-success me-2"></i>
                        Pediatric and maternity care
                      </li>
                      <li className="mb-2">
                        <i className="bi bi-check-circle-fill text-success me-2"></i>
                        Family-friendly pricing
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
                    <h3 className="h4 fw-bold mb-3" style={{ color: '#14432A' }}>Comprehensive Coverage</h3>
                    <p className="text-muted">
                      Our health insurance plans include essential health benefits such as preventive care, emergency services, prescription drugs, mental health services, and more. All plans comply with Affordable Care Act requirements.
                    </p>
                    <ul className="list-unstyled mt-3">
                      <li className="mb-2">
                        <i className="bi bi-check-circle-fill text-success me-2"></i>
                        Preventive care included
                      </li>
                      <li className="mb-2">
                        <i className="bi bi-check-circle-fill text-success me-2"></i>
                        Prescription drug coverage
                      </li>
                      <li className="mb-2">
                        <i className="bi bi-check-circle-fill text-success me-2"></i>
                        Mental health services
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Counseling Services Section */}
        <section className="py-5 bg-light">
          <div className="container">
            <div className="row mb-5">
              <div className="col-lg-8 mx-auto text-center">
                <h2 className="display-5 fw-bold mb-4" style={{ color: '#14432A' }}>
                  Counseling Services - Added Value Benefit
                </h2>
                <p className="lead text-muted">
                  As a valued member of Centuries Mutual, you receive access to professional counseling services at no additional cost. Our counseling services are designed to support your mental health and well-being.
                </p>
              </div>
            </div>

            <div className="row g-4">
              <div className="col-md-6">
                <div className="card border-0 shadow-sm h-100" style={{ borderRadius: '16px' }}>
                  <div className="card-body p-4">
                    <div className="mb-3">
                      <ChatBubbleLeftRightIcon style={{ width: '48px', height: '48px', color: '#14432A' }} />
                    </div>
                    <h3 className="h4 fw-bold mb-3" style={{ color: '#14432A' }}>Individual Counseling</h3>
                    <p className="text-muted">
                      One-on-one counseling sessions with licensed mental health professionals. Get personalized support for stress management, anxiety, depression, relationship issues, career concerns, and life transitions.
                    </p>
                    <ul className="list-unstyled mt-3">
                      <li className="mb-2">
                        <i className="bi bi-check-circle-fill text-success me-2"></i>
                        Licensed professional counselors
                      </li>
                      <li className="mb-2">
                        <i className="bi bi-check-circle-fill text-success me-2"></i>
                        Confidential and secure sessions
                      </li>
                      <li className="mb-2">
                        <i className="bi bi-check-circle-fill text-success me-2"></i>
                        Flexible scheduling options
                      </li>
                      <li className="mb-2">
                        <i className="bi bi-check-circle-fill text-success me-2"></i>
                        In-person and telehealth options
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="col-md-6">
                <div className="card border-0 shadow-sm h-100" style={{ borderRadius: '16px' }}>
                  <div className="card-body p-4">
                    <div className="mb-3">
                      <UserGroupIcon style={{ width: '48px', height: '48px', color: '#14432A' }} />
                    </div>
                    <h3 className="h4 fw-bold mb-3" style={{ color: '#14432A' }}>Family Counseling</h3>
                    <p className="text-muted">
                      Family counseling services to help improve communication, resolve conflicts, and strengthen family bonds. Our family therapists work with all family members to create healthier relationships and home environments.
                    </p>
                    <ul className="list-unstyled mt-3">
                      <li className="mb-2">
                        <i className="bi bi-check-circle-fill text-success me-2"></i>
                        Family therapy sessions
                      </li>
                      <li className="mb-2">
                        <i className="bi bi-check-circle-fill text-success me-2"></i>
                        Couples counseling
                      </li>
                      <li className="mb-2">
                        <i className="bi bi-check-circle-fill text-success me-2"></i>
                        Parenting support
                      </li>
                      <li className="mb-2">
                        <i className="bi bi-check-circle-fill text-success me-2"></i>
                        Conflict resolution strategies
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            <div className="row mt-5">
              <div className="col-lg-10 mx-auto">
                <div className="alert mb-0 p-4" style={{ 
                  backgroundColor: '#14432A15', 
                  border: 'none',
                  borderRadius: '16px'
                }}>
                  <div className="d-flex align-items-start">
                    <ShieldCheckIcon style={{ width: '32px', height: '32px', color: '#14432A', flexShrink: 0 }} />
                    <div className="ms-3">
                      <h5 className="fw-bold mb-2" style={{ color: '#14432A' }}>
                        No Additional Cost
                      </h5>
                      <p className="mb-0 text-muted">
                        Counseling services are included as an added value benefit with your Centuries Mutual health insurance plan. There are no copays, deductibles, or additional fees for counseling sessions. Simply schedule an appointment through your member portal or by contacting our support team.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="py-5">
          <div className="container">
            <div className="row mb-5">
              <div className="col-lg-8 mx-auto text-center">
                <h2 className="display-5 fw-bold mb-4" style={{ color: '#14432A' }}>
                  Why Choose Centuries Mutual?
                </h2>
              </div>
            </div>

            <div className="row g-4">
              <div className="col-md-4">
                <div className="text-center">
                  <div className="rounded-circle bg-light d-inline-flex align-items-center justify-content-center mb-3" style={{ width: '80px', height: '80px' }}>
                    <ShieldCheckIcon style={{ width: '40px', height: '40px', color: '#14432A' }} />
                  </div>
                  <h4 className="h5 mb-3 fw-bold" style={{ color: '#14432A' }}>Expert Guidance</h4>
                  <p className="text-muted">Licensed insurance agents and mental health professionals dedicated to your well-being.</p>
                </div>
              </div>
              <div className="col-md-4">
                <div className="text-center">
                  <div className="rounded-circle bg-light d-inline-flex align-items-center justify-content-center mb-3" style={{ width: '80px', height: '80px' }}>
                    <HeartIcon style={{ width: '40px', height: '40px', color: '#14432A' }} />
                  </div>
                  <h4 className="h5 mb-3 fw-bold" style={{ color: '#14432A' }}>Comprehensive Care</h4>
                  <p className="text-muted">Health insurance and counseling services working together for your complete wellness.</p>
                </div>
              </div>
              <div className="col-md-4">
                <div className="text-center">
                  <div className="rounded-circle bg-light d-inline-flex align-items-center justify-content-center mb-3" style={{ width: '80px', height: '80px' }}>
                    <ChatBubbleLeftRightIcon style={{ width: '40px', height: '40px', color: '#14432A' }} />
                  </div>
                  <h4 className="h5 mb-3 fw-bold" style={{ color: '#14432A' }}>Ongoing Support</h4>
                  <p className="text-muted">Dedicated support for all your health insurance and counseling needs throughout the year.</p>
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
                <h2 className="mb-4 fw-bold" style={{ color: '#14432A' }}>Ready to Get Started?</h2>
                <p className="lead mb-4">
                  Get comprehensive health insurance coverage and access to professional counseling services today.
                </p>
                <div className="d-flex gap-3 justify-content-center">
                  <motion.a 
                    href="/enrollment" 
                    className="btn btn-primary btn-lg px-5 py-3"
                    whileTap={{ scale: 0.95 }}
                    transition={{ duration: 0.1 }}
                  >
                    Enroll Now
                  </motion.a>
                  <motion.a 
                    href="/contact" 
                    className="btn btn-outline-primary btn-lg px-5 py-3"
                    whileTap={{ scale: 0.95 }}
                    transition={{ duration: 0.1 }}
                  >
                    Contact Us
                  </motion.a>
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

