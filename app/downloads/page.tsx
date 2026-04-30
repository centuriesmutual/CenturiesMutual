'use client'

import Link from 'next/link'
import Image from 'next/image'

export default function Downloads() {
  return (
    <div className="min-h-screen bg-light d-flex align-items-center">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-10 col-xl-8">
            {/* Header */}
            <div className="text-center mb-5">
              <h1 className="display-4 fw-bold mb-4" style={{ color: '#14432A' }}>
                Choose Your Platform
              </h1>
              <p className="lead text-muted mb-5">
                Download our app on your preferred platform
              </p>
            </div>

            {/* Download Options - Centered */}
            <div className="row g-4 justify-content-center">
              <div className="col-md-6 col-lg-5">
                <div className="card h-100 border-0 shadow-sm" style={{ borderRadius: '15px' }}>
                  <div className="card-body p-4 text-center">
                    <div className="bg-dark rounded-circle d-inline-flex align-items-center justify-content-center mb-3" style={{ width: '80px', height: '80px' }}>
                      <i className="bi bi-apple text-white" style={{ fontSize: '2rem' }}></i>
                    </div>
                    <h5 className="mb-2">iOS App</h5>
                    <p className="text-muted mb-4">Download for iPhone and iPad from the App Store</p>
                    <button className="btn btn-dark w-100">
                      <i className="bi bi-download me-2"></i>Download for iOS
                    </button>
                  </div>
                </div>
              </div>
              
              <div className="col-md-6 col-lg-5">
                <div className="card h-100 border-0 shadow-sm" style={{ borderRadius: '15px' }}>
                  <div className="card-body p-4 text-center">
                    <div className="bg-success rounded-circle d-inline-flex align-items-center justify-content-center mb-3" style={{ width: '80px', height: '80px' }}>
                      <i className="bi bi-android2 text-white" style={{ fontSize: '2rem' }}></i>
                    </div>
                    <h5 className="mb-2">Android App</h5>
                    <p className="text-muted mb-4">Download for Android devices from Google Play</p>
                    <button className="btn btn-success w-100">
                      <i className="bi bi-download me-2"></i>Download for Android
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>



    </div>
  )
}
