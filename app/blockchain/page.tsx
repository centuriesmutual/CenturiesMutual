'use client'

import Navbar from '../../components/Navbar'
import Footer from '../../components/Footer'
import Link from 'next/link'
import Image from 'next/image'
import { CubeIcon, EnvelopeIcon, UserGroupIcon, MagnifyingGlassIcon, PhoneIcon } from '@heroicons/react/24/outline'

export default function Blockchain() {
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
                  BlockChain - Your Secure Block Space
                </h1>
                <p className="lead mb-4" style={{ fontSize: '1.4rem' }}>
                  A revolutionary block space platform where users can communicate, connect, and conduct business securely
                </p>
                <p className="fs-5 mb-5">
                  Experience a new dimension of digital interaction with our blockchain-powered block space featuring secure messaging, contact management, room listings, and pay-as-you-go communications.
                </p>
                <div className="d-flex gap-3 flex-wrap">
                  <Link href="/signup" className="btn btn-light btn-lg px-5 py-3">
                    Get Started
                  </Link>
                  <Link href="/contact" className="btn btn-outline-light btn-lg px-5 py-3">
                    Learn More
                  </Link>
                </div>
              </div>
              <div className="col-lg-6">
                <div className="position-relative" style={{ height: '500px', borderRadius: '20px', overflow: 'hidden' }}>
                  <Image
                    src="/deer.jpeg"
                    alt="BlockChain Block Space"
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
                  What is Block Space?
                </h2>
                <p className="lead text-muted">
                  Block space is a secure, decentralized environment built on blockchain technology where users can interact, communicate, and transact with complete privacy and security. Every action is recorded on the blockchain, ensuring transparency and immutability.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-5 bg-light">
          <div className="container">
            <div className="row mb-5">
              <div className="col-lg-8 mx-auto text-center">
                <h2 className="display-5 fw-bold mb-4" style={{ color: '#14432A' }}>
                  Key Features
                </h2>
              </div>
            </div>

            <div className="row g-4 mb-5">
              <div className="col-md-6 col-lg-4">
                <div className="card border-0 shadow-sm h-100" style={{ borderRadius: '16px' }}>
                  <div className="card-body p-4">
                    <div className="mb-3">
                      <EnvelopeIcon style={{ width: '48px', height: '48px', color: '#14432A' }} />
                    </div>
                    <h3 className="h4 fw-bold mb-3" style={{ color: '#14432A' }}>Secure Mailbox</h3>
                    <p className="text-muted">
                      Receive and send messages in your personal blockchain-secured mailbox. All messages are encrypted and stored on the blockchain, ensuring complete privacy and security. Access your messages from anywhere, anytime.
                    </p>
                    <ul className="list-unstyled mt-3">
                      <li className="mb-2">
                        <i className="bi bi-check-circle-fill text-success me-2"></i>
                        End-to-end encryption
                      </li>
                      <li className="mb-2">
                        <i className="bi bi-check-circle-fill text-success me-2"></i>
                        Blockchain-stored messages
                      </li>
                      <li className="mb-2">
                        <i className="bi bi-check-circle-fill text-success me-2"></i>
                        Message history tracking
                      </li>
                      <li className="mb-2">
                        <i className="bi bi-check-circle-fill text-success me-2"></i>
                        Secure file attachments
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="col-md-6 col-lg-4">
                <div className="card border-0 shadow-sm h-100" style={{ borderRadius: '16px' }}>
                  <div className="card-body p-4">
                    <div className="mb-3">
                      <UserGroupIcon style={{ width: '48px', height: '48px', color: '#14432A' }} />
                    </div>
                    <h3 className="h4 fw-bold mb-3" style={{ color: '#14432A' }}>Contact Management</h3>
                    <p className="text-muted">
                      Manage your contacts securely in your block space. Build your network of trusted connections with verified profiles. Each contact is verified on the blockchain, ensuring authenticity and trust.
                    </p>
                    <ul className="list-unstyled mt-3">
                      <li className="mb-2">
                        <i className="bi bi-check-circle-fill text-success me-2"></i>
                        Blockchain-verified contacts
                      </li>
                      <li className="mb-2">
                        <i className="bi bi-check-circle-fill text-success me-2"></i>
                        Contact groups and tags
                      </li>
                      <li className="mb-2">
                        <i className="bi bi-check-circle-fill text-success me-2"></i>
                        Trust score integration
                      </li>
                      <li className="mb-2">
                        <i className="bi bi-check-circle-fill text-success me-2"></i>
                        Secure contact sharing
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="col-md-6 col-lg-4">
                <div className="card border-0 shadow-sm h-100" style={{ borderRadius: '16px' }}>
                  <div className="card-body p-4">
                    <div className="mb-3">
                      <MagnifyingGlassIcon style={{ width: '48px', height: '48px', color: '#14432A' }} />
                    </div>
                    <h3 className="h4 fw-bold mb-3" style={{ color: '#14432A' }}>Room Listings Search</h3>
                    <p className="text-muted">
                      Search and browse available room listings directly from your block space. Use the powerful search bar to find rooms by location, price, amenities, and more. All listings are verified and stored on the blockchain for transparency.
                    </p>
                    <ul className="list-unstyled mt-3">
                      <li className="mb-2">
                        <i className="bi bi-check-circle-fill text-success me-2"></i>
                        Advanced search filters
                      </li>
                      <li className="mb-2">
                        <i className="bi bi-check-circle-fill text-success me-2"></i>
                        Verified listings only
                      </li>
                      <li className="mb-2">
                        <i className="bi bi-check-circle-fill text-success me-2"></i>
                        Real-time availability
                      </li>
                      <li className="mb-2">
                        <i className="bi bi-check-circle-fill text-success me-2"></i>
                        Secure booking system
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            <div className="row g-4">
              <div className="col-md-6">
                <div className="card border-0 shadow-sm h-100" style={{ borderRadius: '16px' }}>
                  <div className="card-body p-4">
                    <div className="mb-3">
                      <PhoneIcon style={{ width: '48px', height: '48px', color: '#14432A' }} />
                    </div>
                    <h3 className="h4 fw-bold mb-3" style={{ color: '#14432A' }}>Pay-As-You-Go Phone Calls</h3>
                    <p className="text-muted">
                      Make secure phone calls directly from your block space on a pay-as-you-go basis. No monthly fees, no contracts - only pay for what you use. All calls are encrypted and routed through our secure blockchain network.
                    </p>
                    <ul className="list-unstyled mt-3">
                      <li className="mb-2">
                        <i className="bi bi-check-circle-fill text-success me-2"></i>
                        Pay only for calls you make
                      </li>
                      <li className="mb-2">
                        <i className="bi bi-check-circle-fill text-success me-2"></i>
                        Competitive per-minute rates
                      </li>
                      <li className="mb-2">
                        <i className="bi bi-check-circle-fill text-success me-2"></i>
                        Encrypted voice calls
                      </li>
                      <li className="mb-2">
                        <i className="bi bi-check-circle-fill text-success me-2"></i>
                        International calling support
                      </li>
                      <li className="mb-2">
                        <i className="bi bi-check-circle-fill text-success me-2"></i>
                        Call history and records
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="col-md-6">
                <div className="card border-0 shadow-sm h-100" style={{ borderRadius: '16px' }}>
                  <div className="card-body p-4">
                    <div className="mb-3">
                      <CubeIcon style={{ width: '48px', height: '48px', color: '#14432A' }} />
                    </div>
                    <h3 className="h4 fw-bold mb-3" style={{ color: '#14432A' }}>Blockchain Security</h3>
                    <p className="text-muted">
                      Every interaction in your block space is secured by blockchain technology. This ensures that all messages, contacts, listings, and calls are immutable, transparent, and protected from tampering or unauthorized access.
                    </p>
                    <ul className="list-unstyled mt-3">
                      <li className="mb-2">
                        <i className="bi bi-check-circle-fill text-success me-2"></i>
                        Immutable records
                      </li>
                      <li className="mb-2">
                        <i className="bi bi-check-circle-fill text-success me-2"></i>
                        Transparent transactions
                      </li>
                      <li className="mb-2">
                        <i className="bi bi-check-circle-fill text-success me-2"></i>
                        Decentralized storage
                      </li>
                      <li className="mb-2">
                        <i className="bi bi-check-circle-fill text-success me-2"></i>
                        Zero-knowledge privacy
                      </li>
                    </ul>
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
                  How Block Space Works
                </h2>
              </div>
            </div>

            <div className="row g-4">
              <div className="col-md-4">
                <div className="text-center">
                  <div className="rounded-circle bg-light d-inline-flex align-items-center justify-content-center mb-3" style={{ width: '80px', height: '80px' }}>
                    <span className="fw-bold" style={{ color: '#14432A', fontSize: '1.5rem' }}>1</span>
                  </div>
                  <h4 className="h5 mb-3 fw-bold" style={{ color: '#14432A' }}>Create Your Account</h4>
                  <p className="text-muted">Sign up and create your secure block space account. Your identity is verified on the blockchain for security.</p>
                </div>
              </div>
              <div className="col-md-4">
                <div className="text-center">
                  <div className="rounded-circle bg-light d-inline-flex align-items-center justify-content-center mb-3" style={{ width: '80px', height: '80px' }}>
                    <span className="fw-bold" style={{ color: '#14432A', fontSize: '1.5rem' }}>2</span>
                  </div>
                  <h4 className="h5 mb-3 fw-bold" style={{ color: '#14432A' }}>Access Your Features</h4>
                  <p className="text-muted">Start using your mailbox, manage contacts, search room listings, and make phone calls - all in one secure space.</p>
                </div>
              </div>
              <div className="col-md-4">
                <div className="text-center">
                  <div className="rounded-circle bg-light d-inline-flex align-items-center justify-content-center mb-3" style={{ width: '80px', height: '80px' }}>
                    <span className="fw-bold" style={{ color: '#14432A', fontSize: '1.5rem' }}>3</span>
                  </div>
                  <h4 className="h5 mb-3 fw-bold" style={{ color: '#14432A' }}>Pay As You Go</h4>
                  <p className="text-muted">For phone calls and premium features, simply pay as you use them. No hidden fees or monthly commitments.</p>
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
                  Benefits of Block Space
                </h2>
              </div>
            </div>

            <div className="row g-4">
              <div className="col-md-6">
                <div className="d-flex align-items-start">
                  <div className="flex-shrink-0 me-3">
                    <CubeIcon style={{ width: '32px', height: '32px', color: '#14432A' }} />
                  </div>
                  <div>
                    <h5 className="fw-bold mb-2" style={{ color: '#14432A' }}>Complete Privacy</h5>
                    <p className="text-muted mb-0">Your data is encrypted and stored on the blockchain. Only you have access to your messages and contacts.</p>
                  </div>
                </div>
              </div>
              <div className="col-md-6">
                <div className="d-flex align-items-start">
                  <div className="flex-shrink-0 me-3">
                    <CubeIcon style={{ width: '32px', height: '32px', color: '#14432A' }} />
                  </div>
                  <div>
                    <h5 className="fw-bold mb-2" style={{ color: '#14432A' }}>Transparent Transactions</h5>
                    <p className="text-muted mb-0">All transactions and interactions are recorded on the blockchain, providing complete transparency and accountability.</p>
                  </div>
                </div>
              </div>
              <div className="col-md-6">
                <div className="d-flex align-items-start">
                  <div className="flex-shrink-0 me-3">
                    <CubeIcon style={{ width: '32px', height: '32px', color: '#14432A' }} />
                  </div>
                  <div>
                    <h5 className="fw-bold mb-2" style={{ color: '#14432A' }}>No Monthly Fees</h5>
                    <p className="text-muted mb-0">Use your mailbox, contacts, and search features for free. Only pay for phone calls and premium services as you use them.</p>
                  </div>
                </div>
              </div>
              <div className="col-md-6">
                <div className="d-flex align-items-start">
                  <div className="flex-shrink-0 me-3">
                    <CubeIcon style={{ width: '32px', height: '32px', color: '#14432A' }} />
                  </div>
                  <div>
                    <h5 className="fw-bold mb-2" style={{ color: '#14432A' }}>All-in-One Platform</h5>
                    <p className="text-muted mb-0">Everything you need in one secure block space - messaging, contacts, room search, and communications.</p>
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
                <h2 className="mb-4 fw-bold" style={{ color: '#14432A' }}>Ready to Enter Block Space?</h2>
                <p className="lead mb-4">
                  Join the future of secure digital communication and interaction.
                </p>
                <div className="d-flex gap-3 justify-content-center">
                  <Link href="/signup" className="btn btn-primary btn-lg px-5 py-3">
                    Create Account
                  </Link>
                  <Link href="/contact" className="btn btn-outline-primary btn-lg px-5 py-3">
                    Contact Us
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

