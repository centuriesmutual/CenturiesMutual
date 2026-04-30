'use client'

import Footer from '../../../components/Footer'
import Navbar from '../../../components/Navbar'
import Link from 'next/link'
import { 
  WifiIcon, 
  ServerIcon, 
  SignalIcon, 
  ShieldCheckIcon, 
  BoltIcon, 
  GlobeAltIcon,
  PhoneIcon,
  ChatBubbleLeftRightIcon
} from '@heroicons/react/24/outline'

export default function NetworkDevicesLearnMore() {
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
                  Phone and Messaging Systems
                </h1>
                <p className="lead mb-5" style={{ 
                  fontSize: '1.25rem', 
                  maxWidth: '800px', 
                  margin: '0 auto 2.5rem',
                  lineHeight: '1.8',
                  opacity: 0.95
                }}>
                  Get your own dedicated phone number and secure messaging system. Our private phone and messaging protocol ensures complete privacy and control over your communications with enterprise-grade security.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-5" style={{ backgroundColor: '#f8f9fa' }}>
          <div className="container py-5">
            <div className="row g-4 mb-5">
              <div className="col-md-6 col-lg-4">
                <div className="card border-0 shadow-sm h-100" style={{ borderRadius: '16px' }}>
                  <div className="card-body p-4 text-center">
                    <div style={{
                      background: 'rgba(20, 67, 42, 0.1)',
                      borderRadius: '12px',
                      width: '64px',
                      height: '64px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      margin: '0 auto 20px'
                    }}>
                      <PhoneIcon style={{ width: '32px', height: '32px', color: '#14432A' }} />
                    </div>
                    <h4 className="fw-bold mb-3" style={{ color: '#14432A' }}>Dedicated Phone Number</h4>
                    <p className="text-muted">
                      Get your own private phone number that's exclusively yours. Choose from available numbers or request a custom number.
                    </p>
                  </div>
                </div>
              </div>

              <div className="col-md-6 col-lg-4">
                <div className="card border-0 shadow-sm h-100" style={{ borderRadius: '16px' }}>
                  <div className="card-body p-4 text-center">
                    <div style={{
                      background: 'rgba(20, 67, 42, 0.1)',
                      borderRadius: '12px',
                      width: '64px',
                      height: '64px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      margin: '0 auto 20px'
                    }}>
                      <ShieldCheckIcon style={{ width: '32px', height: '32px', color: '#14432A' }} />
                    </div>
                    <h4 className="fw-bold mb-3" style={{ color: '#14432A' }}>End-to-End Encryption</h4>
                    <p className="text-muted">
                      All communications are encrypted end-to-end, ensuring that only you and your intended recipients can access messages.
                    </p>
                  </div>
                </div>
              </div>

              <div className="col-md-6 col-lg-4">
                <div className="card border-0 shadow-sm h-100" style={{ borderRadius: '16px' }}>
                  <div className="card-body p-4 text-center">
                    <div style={{
                      background: 'rgba(20, 67, 42, 0.1)',
                      borderRadius: '12px',
                      width: '64px',
                      height: '64px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      margin: '0 auto 20px'
                    }}>
                      <ChatBubbleLeftRightIcon style={{ width: '32px', height: '32px', color: '#14432A' }} />
                    </div>
                    <h4 className="fw-bold mb-3" style={{ color: '#14432A' }}>Secure Messaging</h4>
                    <p className="text-muted">
                      Our messaging system uses a private protocol with blockchain backup, ensuring your messages are secure and permanently recorded.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Technical Specifications */}
            <div className="row mb-5">
              <div className="col-lg-8 mx-auto">
                <div className="card border-0 shadow-sm" style={{ borderRadius: '16px' }}>
                  <div className="card-body p-5">
                    <h3 className="fw-bold mb-4 text-center" style={{ color: '#14432A' }}>System Features</h3>
                    <div className="row g-4">
                      <div className="col-md-6">
                        <div className="d-flex align-items-center mb-3">
                          <PhoneIcon style={{ width: '24px', height: '24px', color: '#14432A', marginRight: '12px' }} />
                          <div>
                            <h5 className="fw-bold mb-1" style={{ color: '#14432A' }}>Private Phone Protocol</h5>
                            <p className="text-muted mb-0 small">Dedicated phone numbers with secure calling</p>
                          </div>
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="d-flex align-items-center mb-3">
                          <ChatBubbleLeftRightIcon style={{ width: '24px', height: '24px', color: '#14432A', marginRight: '12px' }} />
                          <div>
                            <h5 className="fw-bold mb-1" style={{ color: '#14432A' }}>Blockchain Backup</h5>
                            <p className="text-muted mb-0 small">Messages permanently recorded on blockchain</p>
                          </div>
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="d-flex align-items-center mb-3">
                          <ShieldCheckIcon style={{ width: '24px', height: '24px', color: '#14432A', marginRight: '12px' }} />
                          <div>
                            <h5 className="fw-bold mb-1" style={{ color: '#14432A' }}>End-to-End Encryption</h5>
                            <p className="text-muted mb-0 small">Complete privacy protection for all communications</p>
                          </div>
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="d-flex align-items-center mb-3">
                          <GlobeAltIcon style={{ width: '24px', height: '24px', color: '#14432A', marginRight: '12px' }} />
                          <div>
                            <h5 className="fw-bold mb-1" style={{ color: '#14432A' }}>Private Protocol</h5>
                            <p className="text-muted mb-0 small">Complete control over your communications</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
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

