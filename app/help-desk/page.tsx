'use client'

import Navbar from '../../components/Navbar'
import Footer from '../../components/Footer'
import Link from 'next/link'
import { EnvelopeIcon, DocumentTextIcon, ChatBubbleLeftRightIcon } from '@heroicons/react/24/outline'

export default function HelpDeskPage() {
  return (
    <>
      <Navbar />
      <main>
        <section className="py-5" style={{ 
          background: 'linear-gradient(135deg, #14432A 0%, #206542 100%)',
          color: 'white'
        }}>
          <div className="container py-4">
            <h1 className="display-5 fw-bold mb-3" style={{ fontFamily: "'Playfair Display', serif" }}>
              Help desk
            </h1>
            <p className="lead mb-0" style={{ maxWidth: '720px', opacity: 0.95 }}>
              Get support for Centuries Mutual accounts, rentals, documents, network features, and security.
            </p>
          </div>
        </section>

        <section className="py-5">
          <div className="container" style={{ maxWidth: '720px' }}>
            <p className="text-muted mb-5">
              Whether you are a landlord, tenant, host, or member, our help desk is the starting point for questions 
              about the platform, billing, verification, eDocuments, and how to report a problem.
            </p>

            <div className="row g-4">
              <div className="col-md-4">
                <div className="card border-0 shadow-sm h-100" style={{ borderRadius: '12px', border: '1px solid #e9ecef' }}>
                  <div className="card-body p-4 text-center text-md-start">
                    <ChatBubbleLeftRightIcon className="mb-3" style={{ width: '40px', height: '40px', color: '#14432A' }} />
                    <h2 className="h6 fw-bold mb-2" style={{ color: '#14432A' }}>Contact us</h2>
                    <p className="text-muted small mb-3">
                      Request help with your account, listings, or technical issues.
                    </p>
                    <a 
                      href="mailto:support@centuriesmutual.com?subject=Centuries%20Mutual%20support%20request" 
                      className="btn btn-sm fw-semibold text-white" 
                      style={{ background: '#14432A', borderColor: '#14432A' }}
                    >
                      Email support
                    </a>
                  </div>
                </div>
              </div>
              <div className="col-md-4">
                <div className="card border-0 shadow-sm h-100" style={{ borderRadius: '12px', border: '1px solid #e9ecef' }}>
                  <div className="card-body p-4 text-center text-md-start">
                    <DocumentTextIcon className="mb-3" style={{ width: '40px', height: '40px', color: '#14432A' }} />
                    <h2 className="h6 fw-bold mb-2" style={{ color: '#14432A' }}>Policies</h2>
                    <p className="text-muted small mb-3">
                      Terms, privacy, and how we handle data across our services.
                    </p>
                    <Link href="/legal" className="btn btn-outline-secondary btn-sm fw-semibold" style={{ borderColor: '#14432A', color: '#14432A' }}>
                      View legal
                    </Link>
                  </div>
                </div>
              </div>
              <div className="col-md-4">
                <div className="card border-0 shadow-sm h-100" style={{ borderRadius: '12px', border: '1px solid #e9ecef' }}>
                  <div className="card-body p-4 text-center text-md-start">
                    <EnvelopeIcon className="mb-3" style={{ width: '40px', height: '40px', color: '#14432A' }} />
                    <h2 className="h6 fw-bold mb-2" style={{ color: '#14432A' }}>Email</h2>
                    <p className="text-muted small mb-3">
                      For formal notices, use the address published on your agreement or invoice.
                    </p>
                    <a href="mailto:support@centuriesmutual.com" className="btn btn-outline-secondary btn-sm fw-semibold" style={{ borderColor: '#14432A', color: '#14432A' }}>
                      support@centuriesmutual.com
                    </a>
                  </div>
                </div>
              </div>
            </div>

            <p className="text-muted small mt-5 mb-0">
              Response times vary by channel. For urgent safety or fraud concerns, mention that in your message subject line.
            </p>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
