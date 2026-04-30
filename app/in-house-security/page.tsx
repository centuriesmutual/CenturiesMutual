'use client'

import Navbar from '../../components/Navbar'
import Footer from '../../components/Footer'
import Link from 'next/link'
import Image from 'next/image'
import { 
  ShieldCheckIcon, 
  CogIcon, 
  CameraIcon,
  LockClosedIcon,
  CheckCircleIcon,
  WrenchScrewdriverIcon,
  CpuChipIcon
} from '@heroicons/react/24/outline'

export default function InHouseSecurity() {
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
                  In-House Crafted Security System
                </h1>
                <p className="lead mb-4" style={{ fontSize: '1.4rem' }}>
                  Our cameras and security systems are designed and built in-house
                </p>
                <p className="fs-5 mb-5">
                  Every component of our security systems, from cameras to network devices, is designed, engineered, and manufactured by our team. This ensures complete control over quality, security features, and functionality.
                </p>
                <div className="d-flex gap-3 flex-wrap">
                  <Link href="/shop" className="btn btn-light btn-lg px-5 py-3">
                    View Products
                  </Link>
                  <Link href="/contact" className="btn btn-outline-light btn-lg px-5 py-3">
                    Learn More
                  </Link>
                </div>
              </div>
              <div className="col-lg-6">
                <div className="position-relative" style={{ height: '500px', borderRadius: '20px', overflow: 'hidden' }}>
                  <Image
                    src="/Bison.jpeg"
                    alt="In-House Crafted Security System"
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

        {/* In-House Manufacturing Section */}
        <section className="py-5">
          <div className="container">
            <div className="row mb-5">
              <div className="col-lg-8 mx-auto text-center">
                <h2 className="display-5 fw-bold mb-4" style={{ color: '#14432A' }}>
                  Designed and Built In-House
                </h2>
                <p className="lead text-muted">
                  Our security cameras and systems are not off-the-shelf products. Every component is designed, engineered, and manufactured by our team to meet our exact specifications for security, performance, and reliability.
                </p>
              </div>
            </div>

            <div className="row g-4 mb-5">
              <div className="col-md-6">
                <div className="card border-0 shadow-sm h-100" style={{ borderRadius: '16px' }}>
                  <div className="card-body p-4">
                    <div className="mb-3">
                      <CameraIcon style={{ width: '48px', height: '48px', color: '#14432A' }} />
                    </div>
                    <h3 className="h4 fw-bold mb-3" style={{ color: '#14432A' }}>Custom Security Cameras</h3>
                    <p className="text-muted">
                      Our security cameras are designed from the ground up with security as the primary focus. We control every aspect of the hardware, firmware, and software to ensure maximum security and performance.
                    </p>
                    <ul className="list-unstyled mt-3">
                      <li className="mb-2">
                        <i className="bi bi-check-circle-fill text-success me-2"></i>
                        Custom-designed camera sensors
                      </li>
                      <li className="mb-2">
                        <i className="bi bi-check-circle-fill text-success me-2"></i>
                        Proprietary firmware
                      </li>
                      <li className="mb-2">
                        <i className="bi bi-check-circle-fill text-success me-2"></i>
                        Hardware-level encryption
                      </li>
                      <li className="mb-2">
                        <i className="bi bi-check-circle-fill text-success me-2"></i>
                        Built-in security features
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="col-md-6">
                <div className="card border-0 shadow-sm h-100" style={{ borderRadius: '16px' }}>
                  <div className="card-body p-4">
                    <div className="mb-3">
                      <CogIcon style={{ width: '48px', height: '48px', color: '#14432A' }} />
                    </div>
                    <h3 className="h4 fw-bold mb-3" style={{ color: '#14432A' }}>Custom Network Devices</h3>
                    <p className="text-muted">
                      Our network security devices are built with custom firmware specifically designed for our security requirements. This gives us complete control over network security features and protocols.
                    </p>
                    <ul className="list-unstyled mt-3">
                      <li className="mb-2">
                        <i className="bi bi-check-circle-fill text-success me-2"></i>
                        Custom hardware design
                      </li>
                      <li className="mb-2">
                        <i className="bi bi-check-circle-fill text-success me-2"></i>
                        Proprietary firmware
                      </li>
                      <li className="mb-2">
                        <i className="bi bi-check-circle-fill text-success me-2"></i>
                        Advanced security protocols
                      </li>
                      <li className="mb-2">
                        <i className="bi bi-check-circle-fill text-success me-2"></i>
                        Regular security updates
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Manufacturing Process Section */}
        <section className="py-5 bg-light">
          <div className="container">
            <div className="row mb-5">
              <div className="col-lg-8 mx-auto text-center">
                <h2 className="display-5 fw-bold mb-4" style={{ color: '#14432A' }}>
                  Our Manufacturing Process
                </h2>
                <p className="lead text-muted">
                  From design to production, every step is controlled in-house to ensure the highest quality and security standards.
                </p>
              </div>
            </div>

            <div className="row g-4">
              <div className="col-md-6 col-lg-3">
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
                  <h5 className="fw-bold mb-3" style={{ color: '#14432A' }}>Design & Engineering</h5>
                  <p className="text-muted small">
                    Our engineering team designs every component with security and performance in mind.
                  </p>
                </div>
              </div>
              <div className="col-md-6 col-lg-3">
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
                  <h5 className="fw-bold mb-3" style={{ color: '#14432A' }}>Hardware Manufacturing</h5>
                  <p className="text-muted small">
                    Components are manufactured to our exact specifications in our controlled facilities.
                  </p>
                </div>
              </div>
              <div className="col-md-6 col-lg-3">
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
                  <h5 className="fw-bold mb-3" style={{ color: '#14432A' }}>Firmware Development</h5>
                  <p className="text-muted small">
                    Custom firmware is developed and tested to ensure optimal security and functionality.
                  </p>
                </div>
              </div>
              <div className="col-md-6 col-lg-3">
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
                      <span className="fw-bold" style={{ color: '#14432A', fontSize: '2rem' }}>4</span>
                    </div>
                  </div>
                  <h5 className="fw-bold mb-3" style={{ color: '#14432A' }}>Quality Assurance</h5>
                  <p className="text-muted small">
                    Every device undergoes rigorous testing before being released to ensure reliability.
                  </p>
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
                  Why In-House Manufacturing Matters
                </h2>
              </div>
            </div>

            <div className="row g-4">
              <div className="col-md-6 col-lg-4">
                <div className="card border-0 shadow-sm h-100" style={{ borderRadius: '16px' }}>
                  <div className="card-body p-4">
                    <div className="mb-3">
                      <ShieldCheckIcon style={{ width: '48px', height: '48px', color: '#14432A' }} />
                    </div>
                    <h4 className="fw-bold mb-3" style={{ color: '#14432A' }}>Complete Control</h4>
                    <p className="text-muted">
                      By manufacturing in-house, we have complete control over every aspect of our security systems, ensuring they meet our exact security standards.
                    </p>
                  </div>
                </div>
              </div>

              <div className="col-md-6 col-lg-4">
                <div className="card border-0 shadow-sm h-100" style={{ borderRadius: '16px' }}>
                  <div className="card-body p-4">
                    <div className="mb-3">
                      <LockClosedIcon style={{ width: '48px', height: '48px', color: '#14432A' }} />
                    </div>
                    <h4 className="fw-bold mb-3" style={{ color: '#14432A' }}>Enhanced Security</h4>
                    <p className="text-muted">
                      Our in-house manufacturing allows us to implement security features at the hardware level, providing protection that off-the-shelf products cannot match.
                    </p>
                  </div>
                </div>
              </div>

              <div className="col-md-6 col-lg-4">
                <div className="card border-0 shadow-sm h-100" style={{ borderRadius: '16px' }}>
                  <div className="card-body p-4">
                    <div className="mb-3">
                      <WrenchScrewdriverIcon style={{ width: '48px', height: '48px', color: '#14432A' }} />
                    </div>
                    <h4 className="fw-bold mb-3" style={{ color: '#14432A' }}>Custom Features</h4>
                    <p className="text-muted">
                      We can add custom features and capabilities that are specifically designed for our platform and user needs.
                    </p>
                  </div>
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
                <h2 className="mb-4 fw-bold" style={{ color: '#14432A' }}>Experience In-House Crafted Security</h2>
                <p className="lead mb-4">
                  Discover our custom-built security cameras and systems designed and manufactured in-house for maximum security and performance.
                </p>
                <div className="d-flex gap-3 justify-content-center">
                  <Link href="/shop" className="btn btn-primary btn-lg px-5 py-3">
                    View Products
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

