'use client'

import Image from 'next/image'
import Link from 'next/link'
import Footer from '../../components/Footer'
import Navbar from '../../components/Navbar'
import { 
  DocumentTextIcon, 
  ShieldCheckIcon, 
  ClockIcon, 
  CheckCircleIcon,
  LockClosedIcon,
  CloudArrowUpIcon,
  DocumentCheckIcon,
  UserGroupIcon,
  VideoCameraIcon,
  PhoneIcon,
  ChatBubbleLeftRightIcon,
  CogIcon
} from '@heroicons/react/24/outline'

export default function EDocumentSystem() {
  return (
    <>
      <Navbar />
      <main>
        {/* Hero Section with Framed Image */}
        <section className="py-5" style={{ 
          background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
          minHeight: '60vh',
          display: 'flex',
          alignItems: 'center'
        }}>
          <div className="container">
            <div className="row align-items-center">
              <div className="col-lg-6 mb-5 mb-lg-0">
                <h1 className="display-3 fw-bold mb-4" style={{ 
                  color: '#14432A',
                  fontFamily: "'Playfair Display', serif"
                }}>
                  eDocument System
                </h1>
                <p className="lead mb-4" style={{ 
                  fontSize: '1.25rem',
                  color: '#495057',
                  lineHeight: '1.8'
                }}>
                  Legally binding electronic documents with verified video communications and telecommunications. 
                  Every interaction is admissible in court through our secure, blockchain-backed messaging protocol.
                </p>
                <p className="mb-4" style={{ color: '#6c757d' }}>
                  Our eDocument system integrates with edge compute systems and smart contracts to enforce a secure 
                  platform for roommates, partners, and cohabitants. All communications are verified, encrypted, and 
                  legally binding.
                </p>
                <div className="d-flex gap-3 flex-wrap">
                  <Link 
                    href="/edocuments-audit-tracking" 
                    className="btn btn-primary btn-lg px-4 py-3 fw-bold"
                    style={{ 
                      borderRadius: '12px',
                      backgroundColor: '#14432A',
                      borderColor: '#14432A'
                    }}
                  >
                    Access Documents
                  </Link>
                  <Link 
                    href="/contact" 
                    className="btn btn-outline-primary btn-lg px-4 py-3 fw-bold"
                    style={{ 
                      borderRadius: '12px',
                      borderColor: '#14432A',
                      color: '#14432A'
                    }}
                  >
                    Contact Us
                  </Link>
                </div>
              </div>
              <div className="col-lg-6">
                <div className="position-relative" style={{
                  padding: '20px',
                  background: 'linear-gradient(135deg, rgba(20, 67, 42, 0.05) 0%, rgba(20, 67, 42, 0.1) 100%)',
                  borderRadius: '24px',
                  border: '3px solid rgba(20, 67, 42, 0.2)',
                  boxShadow: '0 20px 60px rgba(0,0,0,0.15)'
                }}>
                  <div style={{
                    position: 'relative',
                    height: '500px',
                    width: '100%',
                    borderRadius: '20px',
                    overflow: 'hidden',
                    border: '2px solid rgba(20, 67, 42, 0.1)'
                  }}>
                    <Image
                      src="/mountians.jpeg"
                      alt="eDocument System"
                      fill
                      priority
                      quality={100}
                      style={{
                        objectFit: 'cover',
                        objectPosition: 'center',
                        borderRadius: '18px'
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Legally Binding Documents Section */}
        <section className="py-5" style={{ backgroundColor: '#f8f9fa' }}>
          <div className="container">
            <div className="row mb-5">
              <div className="col-lg-8 mx-auto text-center">
                <h2 className="display-5 fw-bold mb-3" style={{ 
                  color: '#14432A',
                  fontFamily: "'Playfair Display', serif"
                }}>
                  Legally Binding Electronic Documents
                </h2>
                <p className="lead text-muted">
                  Our eDocument system creates legally binding agreements that are recognized and enforceable in court. 
                  Every document is cryptographically signed, timestamped, and stored with complete audit trails.
                </p>
              </div>
            </div>

            <div className="row g-4">
              <div className="col-md-6 col-lg-4">
                <div className="card h-100 border-0 shadow-sm" style={{ borderRadius: '16px' }}>
                  <div className="card-body p-4 text-center">
                    <div className="mb-3">
                      <div style={{
                        background: 'rgba(20, 67, 42, 0.1)',
                        borderRadius: '12px',
                        width: '64px',
                        height: '64px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        margin: '0 auto'
                      }}>
                        <DocumentCheckIcon style={{ width: '32px', height: '32px', color: '#14432A' }} />
                      </div>
                    </div>
                    <h5 className="fw-bold mb-3" style={{ color: '#14432A' }}>Court Admissible</h5>
                    <p className="text-muted mb-0">
                      All documents meet legal standards for admissibility in court proceedings. Digital signatures 
                      are legally recognized and binding.
                    </p>
                  </div>
                </div>
              </div>

              <div className="col-md-6 col-lg-4">
                <div className="card h-100 border-0 shadow-sm" style={{ borderRadius: '16px' }}>
                  <div className="card-body p-4 text-center">
                    <div className="mb-3">
                      <div style={{
                        background: 'rgba(20, 67, 42, 0.1)',
                        borderRadius: '12px',
                        width: '64px',
                        height: '64px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        margin: '0 auto'
                      }}>
                        <LockClosedIcon style={{ width: '32px', height: '32px', color: '#14432A' }} />
                      </div>
                    </div>
                    <h5 className="fw-bold mb-3" style={{ color: '#14432A' }}>Cryptographic Security</h5>
                    <p className="text-muted mb-0">
                      Documents are secured with advanced cryptographic signatures that ensure authenticity, 
                      integrity, and non-repudiation.
                    </p>
                  </div>
                </div>
              </div>

              <div className="col-md-6 col-lg-4">
                <div className="card h-100 border-0 shadow-sm" style={{ borderRadius: '16px' }}>
                  <div className="card-body p-4 text-center">
                    <div className="mb-3">
                      <div style={{
                        background: 'rgba(20, 67, 42, 0.1)',
                        borderRadius: '12px',
                        width: '64px',
                        height: '64px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        margin: '0 auto'
                      }}>
                        <ClockIcon style={{ width: '32px', height: '32px', color: '#14432A' }} />
                      </div>
                    </div>
                    <h5 className="fw-bold mb-3" style={{ color: '#14432A' }}>Timestamped Records</h5>
                    <p className="text-muted mb-0">
                      Every document is timestamped with blockchain-verified timestamps that provide 
                      irrefutable proof of when documents were created and signed.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Verified Communications Section */}
        <section className="py-5 bg-white">
          <div className="container">
            <div className="row mb-5">
              <div className="col-lg-8 mx-auto text-center">
                <h2 className="display-5 fw-bold mb-3" style={{ 
                  color: '#14432A',
                  fontFamily: "'Playfair Display', serif"
                }}>
                  Verified Video & Telecommunications
                </h2>
                <p className="lead text-muted">
                  Every video communication and telephone call is verified, recorded, and stored in a format 
                  that is admissible as evidence in legal proceedings.
                </p>
              </div>
            </div>

            <div className="row g-4 mb-5">
              <div className="col-md-6">
                <div className="card border-0 shadow-sm h-100" style={{ borderRadius: '16px' }}>
                  <div className="card-body p-4">
                    <div className="mb-3">
                      <VideoCameraIcon style={{ width: '48px', height: '48px', color: '#14432A' }} />
                    </div>
                    <h4 className="fw-bold mb-3" style={{ color: '#14432A' }}>Verified Video Communications</h4>
                    <p className="text-muted">
                      All video calls and meetings are automatically recorded with participant verification, 
                      timestamp authentication, and cryptographic integrity checks. These recordings serve as 
                      legally admissible evidence of agreements, discussions, and interactions.
                    </p>
                    <ul className="list-unstyled mt-3">
                      <li className="mb-2">
                        <i className="bi bi-check-circle-fill text-success me-2"></i>
                        Participant identity verification
                      </li>
                      <li className="mb-2">
                        <i className="bi bi-check-circle-fill text-success me-2"></i>
                        Timestamp authentication
                      </li>
                      <li className="mb-2">
                        <i className="bi bi-check-circle-fill text-success me-2"></i>
                        Cryptographic integrity verification
                      </li>
                      <li className="mb-2">
                        <i className="bi bi-check-circle-fill text-success me-2"></i>
                        Court-admissible recordings
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="col-md-6">
                <div className="card border-0 shadow-sm h-100" style={{ borderRadius: '16px' }}>
                  <div className="card-body p-4">
                    <div className="mb-3">
                      <PhoneIcon style={{ width: '48px', height: '48px', color: '#14432A' }} />
                    </div>
                    <h4 className="fw-bold mb-3" style={{ color: '#14432A' }}>Verified Telecommunications</h4>
                    <p className="text-muted">
                      Telephone calls and voice communications are recorded with caller ID verification, 
                      call metadata authentication, and secure storage. Every conversation is preserved 
                      as legally admissible evidence.
                    </p>
                    <ul className="list-unstyled mt-3">
                      <li className="mb-2">
                        <i className="bi bi-check-circle-fill text-success me-2"></i>
                        Caller ID verification
                      </li>
                      <li className="mb-2">
                        <i className="bi bi-check-circle-fill text-success me-2"></i>
                        Call metadata authentication
                      </li>
                      <li className="mb-2">
                        <i className="bi bi-check-circle-fill text-success me-2"></i>
                        Encrypted voice recordings
                      </li>
                      <li className="mb-2">
                        <i className="bi bi-check-circle-fill text-success me-2"></i>
                        Legal evidence preservation
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Secure Messaging Protocol Section */}
        <section className="py-5" style={{ backgroundColor: '#14432A', color: 'white' }}>
          <div className="container">
            <div className="row mb-5">
              <div className="col-lg-8 mx-auto text-center">
                <h2 className="display-5 fw-bold mb-3" style={{ 
                  fontFamily: "'Playfair Display', serif"
                }}>
                  Secure & Backed Messaging Protocol
                </h2>
                <p className="lead" style={{ opacity: 0.95 }}>
                  Our communication systems use a secure, blockchain-backed messaging protocol that ensures 
                  every message is encrypted, authenticated, and permanently recorded.
                </p>
              </div>
            </div>

            <div className="row g-4">
              <div className="col-md-6">
                <div className="d-flex align-items-start">
                  <div className="me-4">
                    <div style={{
                      background: 'rgba(255, 255, 255, 0.2)',
                      borderRadius: '12px',
                      width: '56px',
                      height: '56px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <ChatBubbleLeftRightIcon style={{ width: '28px', height: '28px', color: 'white' }} />
                    </div>
                  </div>
                  <div>
                    <h5 className="fw-bold mb-3">End-to-End Encryption</h5>
                    <p style={{ opacity: 0.9 }}>
                      All messages are encrypted end-to-end, ensuring that only the intended recipients can 
                      read the content. Even our systems cannot decrypt messages without proper authorization.
                    </p>
                  </div>
                </div>
              </div>

              <div className="col-md-6">
                <div className="d-flex align-items-start">
                  <div className="me-4">
                    <div style={{
                      background: 'rgba(255, 255, 255, 0.2)',
                      borderRadius: '12px',
                      width: '56px',
                      height: '56px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <ShieldCheckIcon style={{ width: '28px', height: '28px', color: 'white' }} />
                    </div>
                  </div>
                  <div>
                    <h5 className="fw-bold mb-3">Blockchain-Backed Storage</h5>
                    <p style={{ opacity: 0.9 }}>
                      Every message is stored on the blockchain, creating an immutable record that cannot be 
                      altered or deleted. This provides permanent proof of all communications.
                    </p>
                  </div>
                </div>
              </div>

              <div className="col-md-6">
                <div className="d-flex align-items-start">
                  <div className="me-4">
                    <div style={{
                      background: 'rgba(255, 255, 255, 0.2)',
                      borderRadius: '12px',
                      width: '56px',
                      height: '56px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <CheckCircleIcon style={{ width: '28px', height: '28px', color: 'white' }} />
                    </div>
                  </div>
                  <div>
                    <h5 className="fw-bold mb-3">Message Authentication</h5>
                    <p style={{ opacity: 0.9 }}>
                      Each message includes cryptographic signatures that verify the sender's identity and 
                      ensure message integrity. This prevents tampering and provides legal proof of communication.
                    </p>
                  </div>
                </div>
              </div>

              <div className="col-md-6">
                <div className="d-flex align-items-start">
                  <div className="me-4">
                    <div style={{
                      background: 'rgba(255, 255, 255, 0.2)',
                      borderRadius: '12px',
                      width: '56px',
                      height: '56px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <LockClosedIcon style={{ width: '28px', height: '28px', color: 'white' }} />
                    </div>
                  </div>
                  <div>
                    <h5 className="fw-bold mb-3">Legal Admissibility</h5>
                    <p style={{ opacity: 0.9 }}>
                      All messages are stored in a format that meets legal standards for evidence. The 
                      blockchain verification and cryptographic signatures ensure messages are admissible in court.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Edge Compute & Smart Contracts Section */}
        <section className="py-5 bg-light">
          <div className="container">
            <div className="row mb-5">
              <div className="col-lg-8 mx-auto text-center">
                <h2 className="display-5 fw-bold mb-3" style={{ 
                  color: '#14432A',
                  fontFamily: "'Playfair Display', serif"
                }}>
                  Edge Compute Systems & Smart Contracts
                </h2>
                <p className="lead text-muted">
                  Our communication systems interact with edge compute systems and smart contracts to enforce 
                  a secure platform for roommates, partners, and cohabitants.
                </p>
              </div>
            </div>

            <div className="row g-4">
              <div className="col-md-6">
                <div className="card border-0 shadow-sm h-100" style={{ borderRadius: '16px' }}>
                  <div className="card-body p-4">
                    <div className="mb-3">
                      <CogIcon style={{ width: '48px', height: '48px', color: '#14432A' }} />
                    </div>
                    <h4 className="fw-bold mb-3" style={{ color: '#14432A' }}>Edge Compute Integration</h4>
                    <p className="text-muted">
                      Our communication systems leverage edge compute infrastructure to process and verify 
                      communications in real-time. This ensures low latency, high security, and immediate 
                      verification of all interactions.
                    </p>
                    <ul className="list-unstyled mt-3">
                      <li className="mb-2">
                        <i className="bi bi-check-circle-fill text-success me-2"></i>
                        Real-time communication processing
                      </li>
                      <li className="mb-2">
                        <i className="bi bi-check-circle-fill text-success me-2"></i>
                        Low-latency verification
                      </li>
                      <li className="mb-2">
                        <i className="bi bi-check-circle-fill text-success me-2"></i>
                        Distributed security enforcement
                      </li>
                      <li className="mb-2">
                        <i className="bi bi-check-circle-fill text-success me-2"></i>
                        Scalable infrastructure
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="col-md-6">
                <div className="card border-0 shadow-sm h-100" style={{ borderRadius: '16px' }}>
                  <div className="card-body p-4">
                    <div className="mb-3">
                      <DocumentCheckIcon style={{ width: '48px', height: '48px', color: '#14432A' }} />
                    </div>
                    <h4 className="fw-bold mb-3" style={{ color: '#14432A' }}>Smart Contract Enforcement</h4>
                    <p className="text-muted">
                      Smart contracts automatically enforce agreements between roommates, partners, and cohabitants. 
                      These contracts execute automatically based on predefined conditions, ensuring compliance and 
                      providing transparent dispute resolution.
                    </p>
                    <ul className="list-unstyled mt-3">
                      <li className="mb-2">
                        <i className="bi bi-check-circle-fill text-success me-2"></i>
                        Automated agreement enforcement
                      </li>
                      <li className="mb-2">
                        <i className="bi bi-check-circle-fill text-success me-2"></i>
                        Transparent contract execution
                      </li>
                      <li className="mb-2">
                        <i className="bi bi-check-circle-fill text-success me-2"></i>
                        Immutable contract records
                      </li>
                      <li className="mb-2">
                        <i className="bi bi-check-circle-fill text-success me-2"></i>
                        Dispute resolution automation
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
                        Complete Security Platform
                      </h5>
                      <p className="mb-0 text-muted">
                        Our eDocument system creates a comprehensive security platform for roommates, partners, 
                        and cohabitants. By integrating edge compute systems and smart contracts, we ensure that 
                        every communication, agreement, and interaction is verified, encrypted, and legally 
                        enforceable. This provides complete protection and peace of mind for all parties involved.
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
                <h2 className="display-5 fw-bold mb-3" style={{ 
                  color: '#14432A',
                  fontFamily: "'Playfair Display', serif"
                }}>
                  Why Choose Our eDocument System?
                </h2>
                <p className="lead text-muted">
                  Secure, legally binding, and court-admissible documentation for all your agreements
                </p>
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
                  <h5 className="fw-bold mb-3" style={{ color: '#14432A' }}>Legally Binding</h5>
                  <p className="text-muted">
                    All documents are legally binding and admissible in court. Digital signatures have the 
                    same legal standing as physical signatures.
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
                  <h5 className="fw-bold mb-3" style={{ color: '#14432A' }}>Verified Communications</h5>
                  <p className="text-muted">
                    Every video call and telephone conversation is verified and stored as legally admissible 
                    evidence. All communications are cryptographically secured.
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
                  <h5 className="fw-bold mb-3" style={{ color: '#14432A' }}>Smart Contract Enforcement</h5>
                  <p className="text-muted">
                    Agreements are automatically enforced through smart contracts integrated with edge compute 
                    systems, ensuring compliance and security.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-5 bg-light">
          <div className="container">
            <div className="row">
              <div className="col-lg-8 mx-auto">
                <div className="card border-0 shadow-lg" style={{ 
                  borderRadius: '20px',
                  background: 'linear-gradient(135deg, rgba(20, 67, 42, 0.05) 0%, rgba(20, 67, 42, 0.1) 100%)'
                }}>
                  <div className="card-body p-5 text-center">
                    <h3 className="fw-bold mb-3" style={{ color: '#14432A' }}>
                      Ready to Secure Your Agreements?
                    </h3>
                    <p className="lead mb-4" style={{ color: '#495057' }}>
                      Start using our legally binding eDocument system with verified communications and 
                      smart contract enforcement today.
                    </p>
                    <div className="d-flex gap-3 justify-content-center flex-wrap">
                      <Link 
                        href="/dashboard" 
                        className="btn btn-primary btn-lg px-5 py-3 fw-bold"
                        style={{ 
                          borderRadius: '12px',
                          backgroundColor: '#14432A',
                          borderColor: '#14432A'
                        }}
                      >
                        Access Documents
                      </Link>
                      <Link 
                        href="/contact" 
                        className="btn btn-outline-primary btn-lg px-5 py-3 fw-bold"
                        style={{ 
                          borderRadius: '12px',
                          borderColor: '#14432A',
                          color: '#14432A'
                        }}
                      >
                        Learn More
                      </Link>
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
