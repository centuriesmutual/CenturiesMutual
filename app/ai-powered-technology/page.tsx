'use client'

import Navbar from '../../components/Navbar'
import Footer from '../../components/Footer'
import Link from 'next/link'
import Image from 'next/image'
import { 
  CpuChipIcon, 
  EyeIcon, 
  ShieldCheckIcon, 
  ChartBarIcon,
  CheckCircleIcon,
  BoltIcon,
  CogIcon
} from '@heroicons/react/24/outline'

export default function AIPoweredTechnology() {
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
                  AI Powered Technology
                </h1>
                <p className="lead mb-4" style={{ fontSize: '1.4rem' }}>
                  Advanced anomaly detection technology powered by artificial intelligence
                </p>
                <p className="fs-5 mb-5">
                  Our AI-powered technology uses sophisticated machine learning algorithms to detect anomalies, identify threats, and protect your network and systems in real-time.
                </p>
                <div className="d-flex gap-3 flex-wrap">
                  <Link href="/contact" className="btn btn-light btn-lg px-5 py-3">
                    Learn More
                  </Link>
                  <Link href="/neighborhood?q=amenities" className="btn btn-outline-light btn-lg px-5 py-3">
                    Amenities
                  </Link>
                </div>
              </div>
              <div className="col-lg-6">
                <div className="position-relative" style={{ height: '500px', borderRadius: '20px', overflow: 'hidden' }}>
                  <Image
                    src="/deer.jpeg"
                    alt="AI Powered Technology"
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

        {/* Anomaly Detection Section */}
        <section className="py-5">
          <div className="container">
            <div className="row mb-5">
              <div className="col-lg-8 mx-auto text-center">
                <h2 className="display-5 fw-bold mb-4" style={{ color: '#14432A' }}>
                  Advanced Anomaly Detection Technology
                </h2>
                <p className="lead text-muted">
                  Our AI-powered anomaly detection system continuously monitors network traffic, user behavior, and system patterns to identify potential threats and security issues before they become problems.
                </p>
              </div>
            </div>

            <div className="row g-4 mb-5">
              <div className="col-md-6">
                <div className="card border-0 shadow-sm h-100" style={{ borderRadius: '16px' }}>
                  <div className="card-body p-4">
                    <div className="mb-3">
                      <CpuChipIcon style={{ width: '48px', height: '48px', color: '#14432A' }} />
                    </div>
                    <h3 className="h4 fw-bold mb-3" style={{ color: '#14432A' }}>Machine Learning Algorithms</h3>
                    <p className="text-muted">
                      Our AI systems use advanced machine learning algorithms trained on vast datasets to recognize normal patterns and instantly identify deviations that may indicate security threats or suspicious activity.
                    </p>
                    <ul className="list-unstyled mt-3">
                      <li className="mb-2">
                        <i className="bi bi-check-circle-fill text-success me-2"></i>
                        Deep learning neural networks
                      </li>
                      <li className="mb-2">
                        <i className="bi bi-check-circle-fill text-success me-2"></i>
                        Pattern recognition algorithms
                      </li>
                      <li className="mb-2">
                        <i className="bi bi-check-circle-fill text-success me-2"></i>
                        Behavioral analysis models
                      </li>
                      <li className="mb-2">
                        <i className="bi bi-check-circle-fill text-success me-2"></i>
                        Continuous learning and adaptation
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="col-md-6">
                <div className="card border-0 shadow-sm h-100" style={{ borderRadius: '16px' }}>
                  <div className="card-body p-4">
                    <div className="mb-3">
                      <EyeIcon style={{ width: '48px', height: '48px', color: '#14432A' }} />
                    </div>
                    <h3 className="h4 fw-bold mb-3" style={{ color: '#14432A' }}>Real-Time Monitoring</h3>
                    <p className="text-muted">
                      Our AI systems monitor network traffic, user behavior, and system activity in real-time, analyzing millions of data points per second to detect anomalies as they occur.
                    </p>
                    <ul className="list-unstyled mt-3">
                      <li className="mb-2">
                        <i className="bi bi-check-circle-fill text-success me-2"></i>
                        24/7 continuous monitoring
                      </li>
                      <li className="mb-2">
                        <i className="bi bi-check-circle-fill text-success me-2"></i>
                        Instant threat detection
                      </li>
                      <li className="mb-2">
                        <i className="bi bi-check-circle-fill text-success me-2"></i>
                        Automated alert system
                      </li>
                      <li className="mb-2">
                        <i className="bi bi-check-circle-fill text-success me-2"></i>
                        Predictive threat analysis
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* How Anomaly Detection Works Section */}
        <section className="py-5 bg-light">
          <div className="container">
            <div className="row mb-5">
              <div className="col-lg-8 mx-auto text-center">
                <h2 className="display-5 fw-bold mb-4" style={{ color: '#14432A' }}>
                  How Anomaly Detection Works
                </h2>
                <p className="lead text-muted">
                  Our AI systems learn normal patterns and automatically identify anything that deviates from expected behavior.
                </p>
              </div>
            </div>

            <div className="row g-4">
              <div className="col-md-6 col-lg-4">
                <div className="card border-0 shadow-sm h-100" style={{ borderRadius: '16px' }}>
                  <div className="card-body p-4">
                    <div className="mb-3">
                      <ChartBarIcon style={{ width: '48px', height: '48px', color: '#14432A' }} />
                    </div>
                    <h4 className="fw-bold mb-3" style={{ color: '#14432A' }}>Baseline Establishment</h4>
                    <p className="text-muted">
                      The AI system establishes a baseline of normal behavior by analyzing historical data and learning typical patterns of network traffic, user activity, and system operations.
                    </p>
                  </div>
                </div>
              </div>

              <div className="col-md-6 col-lg-4">
                <div className="card border-0 shadow-sm h-100" style={{ borderRadius: '16px' }}>
                  <div className="card-body p-4">
                    <div className="mb-3">
                      <BoltIcon style={{ width: '48px', height: '48px', color: '#14432A' }} />
                    </div>
                    <h4 className="fw-bold mb-3" style={{ color: '#14432A' }}>Real-Time Analysis</h4>
                    <p className="text-muted">
                      As new data flows in, the AI continuously compares current activity against the established baseline, identifying any deviations or anomalies in real-time.
                    </p>
                  </div>
                </div>
              </div>

              <div className="col-md-6 col-lg-4">
                <div className="card border-0 shadow-sm h-100" style={{ borderRadius: '16px' }}>
                  <div className="card-body p-4">
                    <div className="mb-3">
                      <ShieldCheckIcon style={{ width: '48px', height: '48px', color: '#14432A' }} />
                    </div>
                    <h4 className="fw-bold mb-3" style={{ color: '#14432A' }}>Threat Response</h4>
                    <p className="text-muted">
                      When anomalies are detected, the system automatically triggers security protocols, alerts administrators, and can take preventive actions to mitigate potential threats.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* AI Features Section */}
        <section className="py-5">
          <div className="container">
            <div className="row mb-5">
              <div className="col-lg-8 mx-auto text-center">
                <h2 className="display-5 fw-bold mb-4" style={{ color: '#14432A' }}>
                  AI-Powered Features
                </h2>
              </div>
            </div>

            <div className="row g-4">
              <div className="col-md-6">
                <div className="d-flex align-items-start">
                  <div className="me-4">
                    <div style={{
                      background: 'rgba(20, 67, 42, 0.1)',
                      borderRadius: '12px',
                      width: '56px',
                      height: '56px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <CpuChipIcon style={{ width: '28px', height: '28px', color: '#14432A' }} />
                    </div>
                  </div>
                  <div>
                    <h5 className="fw-bold mb-3" style={{ color: '#14432A' }}>Behavioral Analysis</h5>
                    <p className="text-muted">
                      AI analyzes user behavior patterns to identify unusual activities that may indicate security threats or unauthorized access attempts.
                    </p>
                  </div>
                </div>
              </div>

              <div className="col-md-6">
                <div className="d-flex align-items-start">
                  <div className="me-4">
                    <div style={{
                      background: 'rgba(20, 67, 42, 0.1)',
                      borderRadius: '12px',
                      width: '56px',
                      height: '56px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <EyeIcon style={{ width: '28px', height: '28px', color: '#14432A' }} />
                    </div>
                  </div>
                  <div>
                    <h5 className="fw-bold mb-3" style={{ color: '#14432A' }}>Network Traffic Analysis</h5>
                    <p className="text-muted">
                      Continuous monitoring of network traffic patterns to detect suspicious activities, potential intrusions, or unusual data transfers.
                    </p>
                  </div>
                </div>
              </div>

              <div className="col-md-6">
                <div className="d-flex align-items-start">
                  <div className="me-4">
                    <div style={{
                      background: 'rgba(20, 67, 42, 0.1)',
                      borderRadius: '12px',
                      width: '56px',
                      height: '56px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <BoltIcon style={{ width: '28px', height: '28px', color: '#14432A' }} />
                    </div>
                  </div>
                  <div>
                    <h5 className="fw-bold mb-3" style={{ color: '#14432A' }}>Predictive Threat Detection</h5>
                    <p className="text-muted">
                      AI algorithms predict potential security threats before they occur by analyzing patterns and trends, allowing for proactive protection.
                    </p>
                  </div>
                </div>
              </div>

              <div className="col-md-6">
                <div className="d-flex align-items-start">
                  <div className="me-4">
                    <div style={{
                      background: 'rgba(20, 67, 42, 0.1)',
                      borderRadius: '12px',
                      width: '56px',
                      height: '56px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <CogIcon style={{ width: '28px', height: '28px', color: '#14432A' }} />
                    </div>
                  </div>
                  <div>
                    <h5 className="fw-bold mb-3" style={{ color: '#14432A' }}>Automated Response</h5>
                    <p className="text-muted">
                      When threats are detected, the AI system can automatically implement security measures, block suspicious activities, and alert security teams.
                    </p>
                  </div>
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
                  Benefits of AI-Powered Anomaly Detection
                </h2>
              </div>
            </div>

            <div className="row g-4">
              <div className="col-md-4">
                <div className="text-center">
                  <div className="rounded-circle bg-light d-inline-flex align-items-center justify-content-center mb-3" style={{ width: '80px', height: '80px' }}>
                    <BoltIcon style={{ width: '40px', height: '40px', color: '#14432A' }} />
                  </div>
                  <h4 className="h5 mb-3 fw-bold" style={{ color: '#14432A' }}>Instant Detection</h4>
                  <p className="text-muted">Threats are detected in real-time, often before they can cause damage.</p>
                </div>
              </div>
              <div className="col-md-4">
                <div className="text-center">
                  <div className="rounded-circle bg-light d-inline-flex align-items-center justify-content-center mb-3" style={{ width: '80px', height: '80px' }}>
                    <ShieldCheckIcon style={{ width: '40px', height: '40px', color: '#14432A' }} />
                  </div>
                  <h4 className="h5 mb-3 fw-bold" style={{ color: '#14432A' }}>Proactive Protection</h4>
                  <p className="text-muted">Predictive analysis allows for proactive security measures before threats materialize.</p>
                </div>
              </div>
              <div className="col-md-4">
                <div className="text-center">
                  <div className="rounded-circle bg-light d-inline-flex align-items-center justify-content-center mb-3" style={{ width: '80px', height: '80px' }}>
                    <CpuChipIcon style={{ width: '40px', height: '40px', color: '#14432A' }} />
                  </div>
                  <h4 className="h5 mb-3 fw-bold" style={{ color: '#14432A' }}>Continuous Learning</h4>
                  <p className="text-muted">AI systems continuously learn and adapt to new threats and patterns.</p>
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
                  Experience AI-Powered Security
                </h2>
                <p className="mb-4" style={{ opacity: 0.95, fontSize: '1.1rem' }}>
                  Protect your network and systems with our advanced AI-powered anomaly detection technology.
                </p>
                <div className="d-flex gap-3 justify-content-center flex-wrap">
                  <Link href="/contact" className="btn btn-light btn-lg px-5 py-3">
                    Get Started
                  </Link>
                  <Link href="/network" className="btn btn-outline-light btn-lg px-5 py-3">
                    Learn More
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

