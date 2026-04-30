'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import { useUser } from '@auth0/nextjs-auth0/client'

export default function Navbar() {
  const [mounted, setMounted] = useState<boolean>(false)
  const [windowWidth, setWindowWidth] = useState<number>(0)
  const { user, isLoading } = useUser()
  const pathname = usePathname()
  const isLoginPage = pathname === '/login'
  const isSignupPage = pathname === '/signup'
  const isRentalEquityPage = pathname === '/rentalequity'
  const isInvestorRelationsPage = pathname === '/investor-relations'
  const isCareersPage = pathname === '/careers'
  const isChildCarePage = pathname === '/child-care'
  const isTrustScorePage = pathname === '/trustscore'

  useEffect(() => {
    setMounted(true)
    setWindowWidth(window.innerWidth)

    const handleResize = () => {
      setWindowWidth(window.innerWidth)
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // Calculate responsive sizes - use default values until mounted
  const getLogoSize = (): { width: number; height: number; fontSize: string } => {
    if (!mounted) return { width: 200, height: 100, fontSize: '3.2rem' }
    if (windowWidth < 640) return { width: 50, height: 25, fontSize: '1.1rem' }
    if (windowWidth < 768) return { width: 40, height: 20, fontSize: '1.2rem' }
    return { width: 200, height: 100, fontSize: '3.2rem' }
  }

  const { width, height, fontSize } = getLogoSize()

  return (
    <>
      <style jsx global>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@500&display=swap');

          nav {
            background: #ffffff !important;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
            position: sticky;
            top: 0;
            z-index: 1000;
          }

          @media (max-width: 768px) {
            .mobile-login {
              font-size: 0.85rem !important;
              padding: 0.4rem 0.8rem !important;
            }
          }
        `}
      </style>
      <nav className="navbar navbar-expand-lg navbar-light bg-white py-3">
        <div className="container">
          <Link
            href="/"
            className="navbar-brand d-flex align-items-center"
            style={{ textDecoration: 'none' }}
          >
            <Image
              src="/cmlogotreesmall-removebg-preview.png"
              alt="Centuries Mutual"
              width={width}
              height={height}
              style={{
                objectFit: 'contain',
                marginRight: '12px',
              }}
            />
            <span
              style={{
                color: '#14432A',
                fontFamily: "'Playfair Display', serif",
                fontSize: fontSize,
                fontWeight: '500',
                letterSpacing: '0.5px',
              }}
            >
              Centuries Mutual
            </span>
          </Link>

          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
            aria-controls="navbarNav"
            aria-expanded="false"
            aria-label="Toggle navigation"
            style={{ borderColor: '#14432A' }}
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          <div className="collapse navbar-collapse" id="navbarNav">
            <div className="navbar-nav ms-auto d-flex align-items-center flex-wrap justify-content-end gap-2 gap-md-3">
              <Link
                href="/downloads"
                className="btn fw-semibold btn-sm px-3 px-lg-4 py-2 rounded-3 order-lg-1 flex-shrink-0"
                style={{
                  backgroundColor: '#ffffff',
                  color: '#14432A',
                  border: '2px solid #ffffff',
                  fontSize: '0.95rem',
                  whiteSpace: 'nowrap',
                  boxShadow: '0 2px 10px rgba(0, 0, 0, 0.08)',
                }}
              >
                Download App
              </Link>
              {pathname !== '/' && (
                <Link href="/" className="nav-link" style={{ color: '#14432A' }}>
                  Home
                </Link>
              )}
              {!isLoading && (
                <>
                  {user ? (
                    <>
                      <span
                        className="nav-link text-muted"
                        style={{ fontSize: '0.9rem' }}
                      >
                        {user.email}
                      </span>
                      <a
                        href="/api/auth/logout"
                        className="btn btn-outline-primary px-2 px-lg-4 py-1 py-lg-2 mobile-login"
                        style={{
                          borderColor: '#14432A',
                          color: '#14432A',
                          fontSize: '1rem',
                          whiteSpace: 'nowrap',
                          minWidth: '120px',
                          padding: '0.5rem 1rem',
                          flexShrink: 0,
                        }}
                      >
                        Logout
                      </a>
                    </>
                  ) : (
                    !isLoginPage &&
                    !isSignupPage &&
                    !isRentalEquityPage &&
                    !isInvestorRelationsPage &&
                    !isCareersPage &&
                    !isChildCarePage &&
                    !isTrustScorePage && (
                      <Link
                        href="/login"
                        className="btn btn-primary px-2 px-lg-4 py-1 py-lg-2 mobile-login"
                        style={{
                          backgroundColor: '#14432A',
                          borderColor: '#14432A',
                          fontSize: '1rem',
                          whiteSpace: 'nowrap',
                          minWidth: '120px',
                          padding: '0.5rem 1rem',
                          flexShrink: 0,
                        }}
                      >
                        Client Login
                      </Link>
                    )
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </nav>
    </>
  )
}
