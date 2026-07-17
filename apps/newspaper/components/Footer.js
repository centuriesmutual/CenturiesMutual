'use client'

export default function Footer() {
  return (
    <footer className="bg-dark text-white py-3">
      <div className="container">
        <div className="row">
          <div className="col-12 text-center">
            <p className="mb-0 text-muted" style={{ fontSize: '0.9rem' }}>
              © {new Date().getFullYear()} Centuries Mutual. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
} 