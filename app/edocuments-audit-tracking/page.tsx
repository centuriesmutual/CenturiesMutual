'use client'

import Navbar from '../../components/Navbar'
import Footer from '../../components/Footer'
import Link from 'next/link'
import Image from 'next/image'
import { 
  DocumentTextIcon, 
  ShieldCheckIcon, 
  ClockIcon, 
  CheckCircleIcon,
  LockClosedIcon,
  ChartBarIcon,
  DocumentCheckIcon,
  UserGroupIcon,
  HomeIcon,
  MagnifyingGlassIcon,
  CalendarIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline'

export default function EDocumentsAuditTracking() {
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
                  eDocuments, Audit & Tracking Living Arrangements
                </h1>
                <p className="lead mb-4" style={{ fontSize: '1.4rem' }}>
                  Comprehensive document management and audit system for tracking living arrangements
                </p>
                <p className="fs-5 mb-5">
                  Our eDocument system provides legally binding documents, comprehensive audit trails, and real-time tracking of all living arrangements, ensuring transparency and accountability for roommates, partners, and cohabitants.
                </p>
                <div className="d-flex gap-3 flex-wrap">
                  <Link href="/dashboard" className="btn btn-light btn-lg px-5 py-3">
                    View Dashboard
                  </Link>
                  <Link href="/contact" className="btn btn-outline-light btn-lg px-5 py-3">
                    Contact Us
                  </Link>
                </div>
              </div>
              <div className="col-lg-6">
                <div className="position-relative" style={{ height: '500px', borderRadius: '20px', overflow: 'hidden' }}>
                  <Image
                    src="/mountians.jpeg"
                    alt="eDocuments Audit & Tracking"
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

        {/* eDocuments Section */}
        <section className="py-5">
          <div className="container">
            <div className="row mb-5">
              <div className="col-lg-8 mx-auto text-center">
                <h2 className="display-5 fw-bold mb-4" style={{ color: '#14432A' }}>
                  Legally Binding eDocuments
                </h2>
                <p className="lead text-muted">
                  Create, sign, and manage legally binding electronic documents for all your living arrangement needs.
                </p>
              </div>
            </div>

            <div className="row g-4 mb-5">
              <div className="col-md-6 col-lg-4">
                <div className="card border-0 shadow-sm h-100" style={{ borderRadius: '16px' }}>
                  <div className="card-body p-4">
                    <div className="mb-3">
                      <DocumentTextIcon style={{ width: '48px', height: '48px', color: '#14432A' }} />
                    </div>
                    <h3 className="h4 fw-bold mb-3" style={{ color: '#14432A' }}>Lease Agreements</h3>
                    <p className="text-muted">
                      Create and sign legally binding lease agreements with digital signatures. All documents are stored on the blockchain for permanent record-keeping.
                    </p>
                    <ul className="list-unstyled mt-3">
                      <li className="mb-2">
                        <i className="bi bi-check-circle-fill text-success me-2"></i>
                        Digital signature support
                      </li>
                      <li className="mb-2">
                        <i className="bi bi-check-circle-fill text-success me-2"></i>
                        Blockchain storage
                      </li>
                      <li className="mb-2">
                        <i className="bi bi-check-circle-fill text-success me-2"></i>
                        Court-admissible documents
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
                    <h3 className="h4 fw-bold mb-3" style={{ color: '#14432A' }}>Roommate Contracts</h3>
                    <p className="text-muted">
                      Establish clear agreements between roommates covering rent, utilities, responsibilities, and house rules. All contracts are legally enforceable.
                    </p>
                    <ul className="list-unstyled mt-3">
                      <li className="mb-2">
                        <i className="bi bi-check-circle-fill text-success me-2"></i>
                        Customizable templates
                      </li>
                      <li className="mb-2">
                        <i className="bi bi-check-circle-fill text-success me-2"></i>
                        Multi-party signing
                      </li>
                      <li className="mb-2">
                        <i className="bi bi-check-circle-fill text-success me-2"></i>
                        Automatic notifications
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="col-md-6 col-lg-4">
                <div className="card border-0 shadow-sm h-100" style={{ borderRadius: '16px' }}>
                  <div className="card-body p-4">
                    <div className="mb-3">
                      <HomeIcon style={{ width: '48px', height: '48px', color: '#14432A' }} />
                    </div>
                    <h3 className="h4 fw-bold mb-3" style={{ color: '#14432A' }}>Property Documents</h3>
                    <p className="text-muted">
                      Store and manage all property-related documents including inspection reports, maintenance records, and property agreements.
                    </p>
                    <ul className="list-unstyled mt-3">
                      <li className="mb-2">
                        <i className="bi bi-check-circle-fill text-success me-2"></i>
                        Document organization
                      </li>
                      <li className="mb-2">
                        <i className="bi bi-check-circle-fill text-success me-2"></i>
                        Secure cloud storage
                      </li>
                      <li className="mb-2">
                        <i className="bi bi-check-circle-fill text-success me-2"></i>
                        Version control
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Audit System Section */}
        <section className="py-5 bg-light">
          <div className="container">
            <div className="row mb-5">
              <div className="col-lg-8 mx-auto text-center">
                <h2 className="display-5 fw-bold mb-4" style={{ color: '#14432A' }}>
                  Comprehensive Audit System
                </h2>
                <p className="lead text-muted">
                  Track and audit all activities, agreements, and changes to living arrangements with complete transparency and accountability.
                </p>
              </div>
            </div>

            <div className="row g-4">
              <div className="col-md-6">
                <div className="card border-0 shadow-sm h-100" style={{ borderRadius: '16px' }}>
                  <div className="card-body p-4">
                    <div className="mb-3">
                      <ChartBarIcon style={{ width: '48px', height: '48px', color: '#14432A' }} />
                    </div>
                    <h3 className="h4 fw-bold mb-3" style={{ color: '#14432A' }}>Activity Tracking</h3>
                    <p className="text-muted">
                      Every action, agreement, and modification is automatically logged in an immutable audit trail. View complete history of all living arrangement activities.
                    </p>
                    <ul className="list-unstyled mt-3">
                      <li className="mb-2">
                        <i className="bi bi-check-circle-fill text-success me-2"></i>
                        Immutable audit logs
                      </li>
                      <li className="mb-2">
                        <i className="bi bi-check-circle-fill text-success me-2"></i>
                        Timestamp verification
                      </li>
                      <li className="mb-2">
                        <i className="bi bi-check-circle-fill text-success me-2"></i>
                        User activity tracking
                      </li>
                      <li className="mb-2">
                        <i className="bi bi-check-circle-fill text-success me-2"></i>
                        Document change history
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="col-md-6">
                <div className="card border-0 shadow-sm h-100" style={{ borderRadius: '16px' }}>
                  <div className="card-body p-4">
                    <div className="mb-3">
                      <ShieldCheckIcon style={{ width: '48px', height: '48px', color: '#14432A' }} />
                    </div>
                    <h3 className="h4 fw-bold mb-3" style={{ color: '#14432A' }}>Compliance Monitoring</h3>
                    <p className="text-muted">
                      Monitor compliance with agreements, track payment history, and receive alerts for any violations or discrepancies in living arrangements.
                    </p>
                    <ul className="list-unstyled mt-3">
                      <li className="mb-2">
                        <i className="bi bi-check-circle-fill text-success me-2"></i>
                        Agreement compliance tracking
                      </li>
                      <li className="mb-2">
                        <i className="bi bi-check-circle-fill text-success me-2"></i>
                        Payment verification
                      </li>
                      <li className="mb-2">
                        <i className="bi bi-check-circle-fill text-success me-2"></i>
                        Automated alerts
                      </li>
                      <li className="mb-2">
                        <i className="bi bi-check-circle-fill text-success me-2"></i>
                        Violation reporting
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Tracking Living Arrangements Section */}
        <section className="py-5">
          <div className="container">
            <div className="row mb-5">
              <div className="col-lg-8 mx-auto text-center">
                <h2 className="display-5 fw-bold mb-4" style={{ color: '#14432A' }}>
                  Real-Time Living Arrangement Tracking
                </h2>
                <p className="lead text-muted">
                  Monitor and manage all aspects of your living arrangements in real-time, from occupancy to responsibilities.
                </p>
              </div>
            </div>

            <div className="row g-4">
              <div className="col-md-6 col-lg-4">
                <div className="card border-0 shadow-sm h-100" style={{ borderRadius: '16px' }}>
                  <div className="card-body p-4">
                    <div className="mb-3">
                      <UserGroupIcon style={{ width: '48px', height: '48px', color: '#14432A' }} />
                    </div>
                    <h4 className="fw-bold mb-3" style={{ color: '#14432A' }}>Occupancy Tracking</h4>
                    <p className="text-muted">
                      Track who is living in the property, their move-in and move-out dates, and current occupancy status.
                    </p>
                    <ul className="list-unstyled mt-3">
                      <li className="mb-2">
                        <i className="bi bi-check-circle-fill text-success me-2"></i>
                        Resident management
                      </li>
                      <li className="mb-2">
                        <i className="bi bi-check-circle-fill text-success me-2"></i>
                        Move-in/move-out tracking
                      </li>
                      <li className="mb-2">
                        <i className="bi bi-check-circle-fill text-success me-2"></i>
                        Occupancy reports
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="col-md-6 col-lg-4">
                <div className="card border-0 shadow-sm h-100" style={{ borderRadius: '16px' }}>
                  <div className="card-body p-4">
                    <div className="mb-3">
                      <CalendarIcon style={{ width: '48px', height: '48px', color: '#14432A' }} />
                    </div>
                    <h4 className="fw-bold mb-3" style={{ color: '#14432A' }}>Responsibility Tracking</h4>
                    <p className="text-muted">
                      Assign and track responsibilities for cleaning, maintenance, utilities, and other shared tasks among roommates.
                    </p>
                    <ul className="list-unstyled mt-3">
                      <li className="mb-2">
                        <i className="bi bi-check-circle-fill text-success me-2"></i>
                        Task assignment
                      </li>
                      <li className="mb-2">
                        <i className="bi bi-check-circle-fill text-success me-2"></i>
                        Completion tracking
                      </li>
                      <li className="mb-2">
                        <i className="bi bi-check-circle-fill text-success me-2"></i>
                        Reminder notifications
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
                    <h4 className="fw-bold mb-3" style={{ color: '#14432A' }}>Payment Tracking</h4>
                    <p className="text-muted">
                      Monitor rent payments, utility contributions, and shared expenses with complete transparency and verification.
                    </p>
                    <ul className="list-unstyled mt-3">
                      <li className="mb-2">
                        <i className="bi bi-check-circle-fill text-success me-2"></i>
                        Payment history
                      </li>
                      <li className="mb-2">
                        <i className="bi bi-check-circle-fill text-success me-2"></i>
                        Expense splitting
                      </li>
                      <li className="mb-2">
                        <i className="bi bi-check-circle-fill text-success me-2"></i>
                        Automated reminders
                      </li>
                    </ul>
                  </div>
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
                    <LockClosedIcon style={{ width: '40px', height: '40px', color: '#14432A' }} />
                  </div>
                  <h4 className="h5 mb-3 fw-bold" style={{ color: '#14432A' }}>Secure Storage</h4>
                  <p className="text-muted small">All documents stored securely on blockchain with encryption.</p>
                </div>
              </div>
              <div className="col-md-6 col-lg-3">
                <div className="text-center">
                  <div className="rounded-circle bg-light d-inline-flex align-items-center justify-content-center mb-3" style={{ width: '80px', height: '80px' }}>
                    <CheckCircleIcon style={{ width: '40px', height: '40px', color: '#14432A' }} />
                  </div>
                  <h4 className="h5 mb-3 fw-bold" style={{ color: '#14432A' }}>Legal Compliance</h4>
                  <p className="text-muted small">All documents are legally binding and court-admissible.</p>
                </div>
              </div>
              <div className="col-md-6 col-lg-3">
                <div className="text-center">
                  <div className="rounded-circle bg-light d-inline-flex align-items-center justify-content-center mb-3" style={{ width: '80px', height: '80px' }}>
                    <ClockIcon style={{ width: '40px', height: '40px', color: '#14432A' }} />
                  </div>
                  <h4 className="h5 mb-3 fw-bold" style={{ color: '#14432A' }}>Real-Time Updates</h4>
                  <p className="text-muted small">Get instant notifications for all document and arrangement changes.</p>
                </div>
              </div>
              <div className="col-md-6 col-lg-3">
                <div className="text-center">
                  <div className="rounded-circle bg-light d-inline-flex align-items-center justify-content-center mb-3" style={{ width: '80px', height: '80px' }}>
                    <DocumentCheckIcon style={{ width: '40px', height: '40px', color: '#14432A' }} />
                  </div>
                  <h4 className="h5 mb-3 fw-bold" style={{ color: '#14432A' }}>Complete Audit Trail</h4>
                  <p className="text-muted small">Immutable records of all activities and changes.</p>
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
                  Start Managing Your Living Arrangements Today
                </h2>
                <p className="mb-4" style={{ opacity: 0.95, fontSize: '1.1rem' }}>
                  Create legally binding documents, track all activities, and maintain complete transparency with our comprehensive eDocument and audit system.
                </p>
                <div className="d-flex gap-3 justify-content-center flex-wrap">
                  <Link href="/dashboard" className="btn btn-light btn-lg px-5 py-3">
                    Access Dashboard
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

