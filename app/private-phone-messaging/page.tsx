'use client'

import Navbar from '../../components/Navbar'
import Footer from '../../components/Footer'
import Link from 'next/link'
import Image from 'next/image'
import { 
  PhoneIcon, 
  ChatBubbleLeftRightIcon, 
  ShieldCheckIcon, 
  CheckCircleIcon,
  LockClosedIcon,
  EnvelopeIcon,
  UserGroupIcon
} from '@heroicons/react/24/outline'

export default function PrivatePhoneMessaging() {
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
                  Private Phone and Messaging Protocol
                </h1>
                <p className="lead mb-4" style={{ fontSize: '1.4rem' }}>
                  Get your own phone number and secure messaging system
                </p>
                <p className="fs-5 mb-5">
                  Our private phone and messaging protocol provides you with a dedicated phone number and secure messaging system, ensuring complete privacy and control over your communications.
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
                    src="/mountians.jpeg"
                    alt="Private Phone and Messaging"
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

        {/* Get a Phone Number Section */}
        <section className="py-5">
          <div className="container">
            <div className="row mb-5">
              <div className="col-lg-8 mx-auto text-center">
                <h2 className="display-5 fw-bold mb-4" style={{ color: '#14432A' }}>
                  Get Your Own Phone Number
                </h2>
                <p className="lead text-muted">
                  Receive a dedicated phone number that works with our secure messaging protocol. Your number is private, secure, and fully integrated with our platform.
                </p>
              </div>
            </div>

            <div className="row g-4 mb-5">
              <div className="col-md-6 col-lg-4">
                <div className="card border-0 shadow-sm h-100" style={{ borderRadius: '16px' }}>
                  <div className="card-body p-4">
                    <div className="mb-3">
                      <PhoneIcon style={{ width: '48px', height: '48px', color: '#14432A' }} />
                    </div>
                    <h3 className="h4 fw-bold mb-3" style={{ color: '#14432A' }}>Dedicated Phone Number</h3>
                    <p className="text-muted">
                      Get your own phone number that's exclusively yours. Choose from available numbers or request a custom number that fits your needs.
                    </p>
                    <ul className="list-unstyled mt-3">
                      <li className="mb-2">
                        <i className="bi bi-check-circle-fill text-success me-2"></i>
                        Local or toll-free numbers
                      </li>
                      <li className="mb-2">
                        <i className="bi bi-check-circle-fill text-success me-2"></i>
                        Custom number selection
                      </li>
                      <li className="mb-2">
                        <i className="bi bi-check-circle-fill text-success me-2"></i>
                        Instant activation
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
                    <h3 className="h4 fw-bold mb-3" style={{ color: '#14432A' }}>Private & Secure</h3>
                    <p className="text-muted">
                      Your phone number is protected by our private protocol. All calls and messages are encrypted and stored securely on our blockchain infrastructure.
                    </p>
                    <ul className="list-unstyled mt-3">
                      <li className="mb-2">
                        <i className="bi bi-check-circle-fill text-success me-2"></i>
                        End-to-end encryption
                      </li>
                      <li className="mb-2">
                        <i className="bi bi-check-circle-fill text-success me-2"></i>
                        Blockchain-secured storage
                      </li>
                      <li className="mb-2">
                        <i className="bi bi-check-circle-fill text-success me-2"></i>
                        No third-party access
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="col-md-6 col-lg-4">
                <div className="card border-0 shadow-sm h-100" style={{ borderRadius: '16px' }}>
                  <div className="card-body p-4">
                    <div className="mb-3">
                      <CheckCircleIcon style={{ width: '48px', height: '48px', color: '#14432A' }} />
                    </div>
                    <h3 className="h4 fw-bold mb-3" style={{ color: '#14432A' }}>Easy Setup</h3>
                    <p className="text-muted">
                      Getting your phone number is quick and simple. Complete the registration process and start using your number within minutes.
                    </p>
                    <ul className="list-unstyled mt-3">
                      <li className="mb-2">
                        <i className="bi bi-check-circle-fill text-success me-2"></i>
                        Simple registration
                      </li>
                      <li className="mb-2">
                        <i className="bi bi-check-circle-fill text-success me-2"></i>
                        Instant activation
                      </li>
                      <li className="mb-2">
                        <i className="bi bi-check-circle-fill text-success me-2"></i>
                        Works on all devices
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Messaging System Section */}
        <section className="py-5 bg-light">
          <div className="container">
            <div className="row mb-5">
              <div className="col-lg-8 mx-auto text-center">
                <h2 className="display-5 fw-bold mb-4" style={{ color: '#14432A' }}>
                  Secure Messaging System
                </h2>
                <p className="lead text-muted">
                  Our messaging system is built on a private protocol that ensures your messages are secure, private, and accessible only to you and your intended recipients.
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
                    <h3 className="h4 fw-bold mb-3" style={{ color: '#14432A' }}>Private Messaging</h3>
                    <p className="text-muted">
                      Send and receive messages through our secure messaging protocol. All messages are encrypted end-to-end and stored on the blockchain for complete security and privacy.
                    </p>
                    <ul className="list-unstyled mt-3">
                      <li className="mb-2">
                        <i className="bi bi-check-circle-fill text-success me-2"></i>
                        End-to-end encryption
                      </li>
                      <li className="mb-2">
                        <i className="bi bi-check-circle-fill text-success me-2"></i>
                        Message history stored on blockchain
                      </li>
                      <li className="mb-2">
                        <i className="bi bi-check-circle-fill text-success me-2"></i>
                        File and media sharing
                      </li>
                      <li className="mb-2">
                        <i className="bi bi-check-circle-fill text-success me-2"></i>
                        Group messaging support
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="col-md-6">
                <div className="card border-0 shadow-sm h-100" style={{ borderRadius: '16px' }}>
                  <div className="card-body p-4">
                    <div className="mb-3">
                      <LockClosedIcon style={{ width: '48px', height: '48px', color: '#14432A' }} />
                    </div>
                    <h3 className="h4 fw-bold mb-3" style={{ color: '#14432A' }}>Protocol Security</h3>
                    <p className="text-muted">
                      Our private messaging protocol uses advanced cryptographic methods to ensure that only you and your intended recipients can read your messages. The protocol is built on blockchain technology for maximum security.
                    </p>
                    <ul className="list-unstyled mt-3">
                      <li className="mb-2">
                        <i className="bi bi-check-circle-fill text-success me-2"></i>
                        Cryptographic message signing
                      </li>
                      <li className="mb-2">
                        <i className="bi bi-check-circle-fill text-success me-2"></i>
                        Blockchain verification
                      </li>
                      <li className="mb-2">
                        <i className="bi bi-check-circle-fill text-success me-2"></i>
                        Zero-knowledge architecture
                      </li>
                      <li className="mb-2">
                        <i className="bi bi-check-circle-fill text-success me-2"></i>
                        No metadata collection
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
                  How to Get Started
                </h2>
              </div>
            </div>

            <div className="row g-4">
              <div className="col-md-4">
                <div className="text-center">
                  <div className="mb-4">
                    <div style={{
                      background: 'rgba(20, 67, 42, 0.1)',
                      borderRadius: '50%',
                      width: '80px',
                      height: '80px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      margin: '0 auto'
                    }}>
                      <span className="fw-bold" style={{ color: '#14432A', fontSize: '2rem' }}>1</span>
                    </div>
                  </div>
                  <h5 className="fw-bold mb-3" style={{ color: '#14432A' }}>Sign Up</h5>
                  <p className="text-muted">
                    Create your account on Centuries Mutual and complete the registration process.
                  </p>
                </div>
              </div>
              <div className="col-md-4">
                <div className="text-center">
                  <div className="mb-4">
                    <div style={{
                      background: 'rgba(20, 67, 42, 0.1)',
                      borderRadius: '50%',
                      width: '80px',
                      height: '80px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      margin: '0 auto'
                    }}>
                      <span className="fw-bold" style={{ color: '#14432A', fontSize: '2rem' }}>2</span>
                    </div>
                  </div>
                  <h5 className="fw-bold mb-3" style={{ color: '#14432A' }}>Choose Your Number</h5>
                  <p className="text-muted">
                    Select your phone number from available options or request a custom number.
                  </p>
                </div>
              </div>
              <div className="col-md-4">
                <div className="text-center">
                  <div className="mb-4">
                    <div style={{
                      background: 'rgba(20, 67, 42, 0.1)',
                      borderRadius: '50%',
                      width: '80px',
                      height: '80px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      margin: '0 auto'
                    }}>
                      <span className="fw-bold" style={{ color: '#14432A', fontSize: '2rem' }}>3</span>
                    </div>
                  </div>
                  <h5 className="fw-bold mb-3" style={{ color: '#14432A' }}>Start Using</h5>
                  <p className="text-muted">
                    Begin making calls and sending messages through your secure phone number and messaging system.
                  </p>
                </div>
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

            <div className="row g-4">
              <div className="col-md-6 col-lg-3">
                <div className="text-center">
                  <div className="rounded-circle bg-light d-inline-flex align-items-center justify-content-center mb-3" style={{ width: '80px', height: '80px' }}>
                    <PhoneIcon style={{ width: '40px', height: '40px', color: '#14432A' }} />
                  </div>
                  <h4 className="h5 mb-3 fw-bold" style={{ color: '#14432A' }}>Voice Calls</h4>
                  <p className="text-muted small">Make and receive voice calls with your dedicated phone number.</p>
                </div>
              </div>
              <div className="col-md-6 col-lg-3">
                <div className="text-center">
                  <div className="rounded-circle bg-light d-inline-flex align-items-center justify-content-center mb-3" style={{ width: '80px', height: '80px' }}>
                    <ChatBubbleLeftRightIcon style={{ width: '40px', height: '40px', color: '#14432A' }} />
                  </div>
                  <h4 className="h5 mb-3 fw-bold" style={{ color: '#14432A' }}>Text Messaging</h4>
                  <p className="text-muted small">Send and receive text messages through our secure protocol.</p>
                </div>
              </div>
              <div className="col-md-6 col-lg-3">
                <div className="text-center">
                  <div className="rounded-circle bg-light d-inline-flex align-items-center justify-content-center mb-3" style={{ width: '80px', height: '80px' }}>
                    <EnvelopeIcon style={{ width: '40px', height: '40px', color: '#14432A' }} />
                  </div>
                  <h4 className="h5 mb-3 fw-bold" style={{ color: '#14432A' }}>Media Sharing</h4>
                  <p className="text-muted small">Share photos, videos, and files securely through the messaging system.</p>
                </div>
              </div>
              <div className="col-md-6 col-lg-3">
                <div className="text-center">
                  <div className="rounded-circle bg-light d-inline-flex align-items-center justify-content-center mb-3" style={{ width: '80px', height: '80px' }}>
                    <UserGroupIcon style={{ width: '40px', height: '40px', color: '#14432A' }} />
                  </div>
                  <h4 className="h5 mb-3 fw-bold" style={{ color: '#14432A' }}>Group Chats</h4>
                  <p className="text-muted small">Create group conversations with multiple participants.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-5" style={{ background: 'linear-gradient(135deg, #14432A 0%, #1a5436 100%)', color: 'white' }}>
          <div className="container">
            <div className="row">
              <div className="col-lg-8 mx-auto text-center">
                <h2 className="fw-bold mb-3" style={{ fontFamily: "'Playfair Display', serif" }}>
                  Ready to Get Your Phone Number?
                </h2>
                <p className="mb-4" style={{ opacity: 0.95, fontSize: '1.1rem' }}>
                  Join our platform and get your own private phone number and secure messaging system today.
                </p>
                <div className="d-flex gap-3 justify-content-center flex-wrap">
                  <Link href="/signup" className="btn btn-light btn-lg px-5 py-3">
                    Get Started
                  </Link>
                  <Link href="/contact" className="btn btn-outline-light btn-lg px-5 py-3">
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

