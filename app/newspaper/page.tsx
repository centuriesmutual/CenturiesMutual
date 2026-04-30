'use client'

import Footer from '../../components/Footer'
import Link from 'next/link'
import Image from 'next/image'
import BoxNewsArticles from '../../components/BoxNewsArticles'
import { useState, useEffect } from 'react'

export default function Newspaper() {
  const [isHeaderVisible, setIsHeaderVisible] = useState(true)
  const [lastScrollY, setLastScrollY] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY
      
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        // Scrolling down and past 100px
        setIsHeaderVisible(false)
      } else {
        // Scrolling up
        setIsHeaderVisible(true)
      }
      
      setLastScrollY(currentScrollY)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [lastScrollY])
  return (
    <main style={{ background: '#ffffff' }}>
      <style jsx global>{`
        .main-content {
          padding-top: 170px !important;
          margin-top: 0 !important;
        }
        body {
          margin: 0 !important;
          padding: 0 !important;
        }
      `}</style>
      
      {/* NYT Header */}
      <header style={{ 
        background: '#ffffff', 
        borderBottom: '1px solid #e2e2e2',
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        transform: isHeaderVisible ? 'translateY(0)' : 'translateY(-100%)',
        transition: 'transform 0.3s ease-in-out'
      }}>
        <div className="container-fluid">
          {/* Top Navigation */}
          <div className="row py-2" style={{ background: '#000000', color: '#ffffff' }}>
            <div className="col-12">
              <div className="d-flex justify-content-between align-items-center">
                <div className="d-flex align-items-center gap-3">
                  <Link href="/" className="btn btn-link text-white p-0" style={{ fontSize: '0.8rem', textDecoration: 'none' }}>HOME</Link>
                  <button className="btn btn-link text-white p-0" style={{ fontSize: '0.8rem', textDecoration: 'none' }}>LOG IN</button>
                </div>
                <div className="d-flex align-items-center">
                  <button className="btn btn-link text-white p-0" style={{ fontSize: '1rem', opacity: '1', color: '#ffffff' }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="11" cy="11" r="8"></circle>
                      <path d="m21 21-4.35-4.35"></path>
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
          
          {/* Main Header */}
          <div className="container py-3">
            <div className="row align-items-center justify-content-center">
              <div className="col-md-10">
                <div className="d-flex align-items-center justify-content-center mb-2" style={{ gap: '8px' }}>
                  <Image 
                    src="/cmlogotreesmall-removebg-preview.png"
                    alt="Centuries Mutual"
                    width={80}
                    height={40}
                    style={{ 
                      objectFit: 'contain',
                      minWidth: '60px',
                      minHeight: '30px'
                    }}
                    className="d-none d-md-block"
                  />
                  <Image 
                    src="/cmlogotreesmall-removebg-preview.png"
                    alt="Centuries Mutual"
                    width={100}
                    height={50}
                    style={{ 
                      objectFit: 'contain',
                      minWidth: '80px',
                      minHeight: '40px'
                    }}
                    className="d-md-none"
                  />
                  <h1 className="mb-0" style={{ 
                    fontFamily: "'Times New Roman', serif",
                    fontSize: '2.8rem',
                    color: '#000000',
                    fontWeight: 'bold',
                    letterSpacing: '-1px',
                    marginLeft: '0'
                  }}>
                    <span className="d-none d-md-inline">Centuries Mutual Times</span>
                    <span className="d-md-none" style={{ fontSize: '1.8rem' }}>Centuries Mutual Times</span>
                  </h1>
                </div>
                <p className="mb-0 mt-1 text-center" style={{ 
                  fontSize: '0.85rem',
                  color: '#666666',
                  fontFamily: "'Helvetica Neue', Arial, sans-serif"
                }}>
                  {new Date().toLocaleDateString('en-US', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })} • Financial News & Real Estate Updates
                </p>
              </div>
            </div>
          </div>
          
        </div>
      </header>

      {/* Main Content */}
      <div className="container py-4 main-content" style={{ paddingTop: '170px !important', maxWidth: '1200px' }}>

        {/* Main Layout */}
        <div className="row justify-content-center">
          {/* Left Column - Main Story */}
          <div className="col-lg-8">
            {/* Featured Story */}
            <div className="mb-4">
              <div className="position-relative">
                <div style={{ 
                  background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)',
                  height: '300px',
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'flex-end',
                  justifyContent: 'center',
                  border: '1px solid #dee2e6',
                  paddingBottom: '2rem',
                  backgroundImage: 'url("https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80")',
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  backgroundRepeat: 'no-repeat'
                }}>
                  <div className="text-center">
                    <div style={{ 
                      fontSize: '3rem',
                      color: '#ffffff',
                      marginBottom: '1rem',
                      textShadow: '2px 2px 4px rgba(0,0,0,0.7)'
                    }}>📰</div>
                  </div>
                </div>
              </div>
              
              <div className="mt-3">
                <h1 className="fw-bold mb-3" style={{ 
                  fontFamily: "'Times New Roman', serif",
                  fontSize: '2.5rem',
                  color: '#000000',
                  lineHeight: '1.1'
                }}>
                  Centuries Mutual Launches Revolutionary eDocument System for Real Estate
                </h1>
                
                <div className="d-flex align-items-center mb-3">
                  <div className="d-flex align-items-center me-4">
                    <div style={{ 
                      width: '40px', 
                      height: '40px', 
                      borderRadius: '50%', 
                      background: '#14432A',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#ffffff',
                      fontSize: '1.2rem',
                      marginRight: '12px'
                    }}>CM</div>
                    <div>
                      <p className="mb-0 fw-bold" style={{ fontSize: '0.9rem' }}>Financial News Desk</p>
                      <p className="mb-0 text-muted" style={{ fontSize: '0.8rem' }}>3 minutes ago</p>
                    </div>
                  </div>
                  <div className="d-flex align-items-center">
                    <button className="btn btn-danger btn-sm me-2" style={{ fontSize: '0.8rem' }}>Read More</button>
                    <button className="btn btn-outline-dark btn-sm" style={{ fontSize: '0.8rem' }}>Share</button>
                  </div>
                </div>
                
                <p className="lead mb-4" style={{ 
                  fontFamily: "'Times New Roman', serif",
                  fontSize: '1.3rem',
                  lineHeight: '1.4',
                  color: '#000000',
                  fontWeight: '400'
                }}>
                  Centuries Mutual has unveiled its groundbreaking eDocument system, revolutionizing how individuals find and rent real estate with roommates.
                </p>
              </div>
            </div>

            {/* Title Card */}
            <div className="row mb-4">
              <div className="col-12">
                <div className="text-center py-4" style={{ 
                  backgroundColor: '#f8f9fa',
                  border: '2px solid #14432A',
                  borderRadius: '8px',
                  borderStyle: 'dashed'
                }}>
                  <h2 className="mb-0" style={{ 
                    fontFamily: "'Times New Roman', serif",
                    fontSize: '2rem',
                    color: '#14432A',
                    fontWeight: 'bold'
                  }}>
                    Featured Articles
                  </h2>
                </div>
              </div>
            </div>

            {/* Additional Stories */}
            <div className="row">
              <div className="col-md-6 mb-4">
                <div className="border-bottom pb-3">
                  <div className="d-flex align-items-start mb-3">
                    <div className="me-3">
                      <div style={{ 
                        width: '80px', 
                        height: '60px', 
                        borderRadius: '4px', 
                        backgroundImage: 'url("https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=200&q=80")',
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        backgroundRepeat: 'no-repeat',
                        border: '1px solid #dee2e6'
                      }}></div>
                    </div>
                    <div className="flex-grow-1">
                      <h3 className="fw-bold mb-2" style={{ 
                        fontFamily: "'Times New Roman', serif",
                        fontSize: '1.4rem',
                        color: '#000000',
                        lineHeight: '1.2'
                      }}>
                        Real Estate Market Shows Strong Growth in Q4
                      </h3>
                      <p className="text-muted mb-2" style={{ fontSize: '0.9rem' }}>
                        By Market Analysis Team • 1 hour ago
                      </p>
                    </div>
                  </div>
                  <p style={{ 
                    fontFamily: "'Times New Roman', serif",
                    fontSize: '1rem',
                    lineHeight: '1.5',
                    color: '#000000'
                  }}>
                    The real estate market continues to show robust growth with rental prices increasing by 8.5% year-over-year.
                  </p>
                  <div className="d-flex align-items-center mt-3">
                    <button className="btn btn-danger btn-sm me-2" style={{ fontSize: '0.8rem' }}>Read More</button>
                    <button className="btn btn-outline-dark btn-sm" style={{ fontSize: '0.8rem' }}>Share</button>
                  </div>
                </div>
              </div>
              
              <div className="col-md-6 mb-4">
                <div className="border-bottom pb-3">
                  <div className="d-flex align-items-start mb-3">
                    <div className="me-3">
                      <div style={{ 
                        width: '80px', 
                        height: '60px', 
                        borderRadius: '4px', 
                        backgroundImage: 'url("https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=200&q=80")',
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        backgroundRepeat: 'no-repeat',
                        border: '1px solid #dee2e6'
                      }}></div>
                    </div>
                    <div className="flex-grow-1">
                      <h3 className="fw-bold mb-2" style={{ 
                        fontFamily: "'Times New Roman', serif",
                        fontSize: '1.4rem',
                        color: '#000000',
                        lineHeight: '1.2'
                      }}>
                        In-House Trust Score System Gains Widespread Adoption
                      </h3>
                      <p className="text-muted mb-2" style={{ fontSize: '0.9rem' }}>
                        By Technology Reporter • 2 hours ago
                      </p>
                    </div>
                  </div>
                  <p style={{ 
                    fontFamily: "'Times New Roman', serif",
                    fontSize: '1rem',
                    lineHeight: '1.5',
                    color: '#000000'
                  }}>
                    The new member in-house trust score system based on our recommendation engine has seen widespread adoption, with over 5,000 verified members and 2,100 successful matches.
                  </p>
                  <div className="d-flex align-items-center mt-3">
                    <button className="btn btn-danger btn-sm me-2" style={{ fontSize: '0.8rem' }}>Read More</button>
                    <button className="btn btn-outline-dark btn-sm" style={{ fontSize: '0.8rem' }}>Share</button>
                  </div>
                </div>
              </div>
            </div>

            {/* More Articles Row 2 */}
            <div className="row">
              <div className="col-md-6 mb-4">
                <div className="border-bottom pb-3">
                  <div className="d-flex align-items-start mb-3">
                    <div className="me-3">
                      <div style={{ 
                        width: '80px', 
                        height: '60px', 
                        borderRadius: '4px', 
                        backgroundImage: 'url("https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=200&q=80")',
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        backgroundRepeat: 'no-repeat',
                        border: '1px solid #dee2e6'
                      }}></div>
                    </div>
                    <div className="flex-grow-1">
                      <h3 className="fw-bold mb-2" style={{ 
                        fontFamily: "'Times New Roman', serif",
                        fontSize: '1.4rem',
                        color: '#000000',
                        lineHeight: '1.2'
                      }}>
                        Document Processing Reaches 1 Million Milestone
                      </h3>
                      <p className="text-muted mb-2" style={{ fontSize: '0.9rem' }}>
                        By Business Reporter • 3 hours ago
                      </p>
                    </div>
                  </div>
                  <p style={{ 
                    fontFamily: "'Times New Roman', serif",
                    fontSize: '1rem',
                    lineHeight: '1.5',
                    color: '#000000'
                  }}>
                    Centuries Mutual's document processing system has successfully handled over 1 million documents with a 99.8% accuracy rate.
                  </p>
                  <div className="d-flex align-items-center mt-3">
                    <button className="btn btn-danger btn-sm me-2" style={{ fontSize: '0.8rem' }}>Read More</button>
                    <button className="btn btn-outline-dark btn-sm" style={{ fontSize: '0.8rem' }}>Share</button>
                  </div>
                </div>
              </div>
              
              <div className="col-md-6 mb-4">
                <div className="border-bottom pb-3">
                  <div className="d-flex align-items-start mb-3">
                    <div className="me-3">
                      <div style={{ 
                        width: '80px', 
                        height: '60px', 
                        borderRadius: '4px', 
                        backgroundImage: 'url("https://images.unsplash.com/photo-1485827404703-89b55fcc595e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=200&q=80")',
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        backgroundRepeat: 'no-repeat',
                        border: '1px solid #dee2e6'
                      }}></div>
                    </div>
                    <div className="flex-grow-1">
                      <h3 className="fw-bold mb-2" style={{ 
                        fontFamily: "'Times New Roman', serif",
                        fontSize: '1.4rem',
                        color: '#000000',
                        lineHeight: '1.2'
                      }}>
                        AI-Powered Features Enhance User Experience
                      </h3>
                      <p className="text-muted mb-2" style={{ fontSize: '0.9rem' }}>
                        By Technology Editor • 4 hours ago
                      </p>
                    </div>
                  </div>
                  <p style={{ 
                    fontFamily: "'Times New Roman', serif",
                    fontSize: '1rem',
                    lineHeight: '1.5',
                    color: '#000000'
                  }}>
                    New artificial intelligence features have been integrated into the platform, improving matching algorithms and providing more accurate roommate compatibility assessments.
                  </p>
                  <div className="d-flex align-items-center mt-3">
                    <button className="btn btn-danger btn-sm me-2" style={{ fontSize: '0.8rem' }}>Read More</button>
                    <button className="btn btn-outline-dark btn-sm" style={{ fontSize: '0.8rem' }}>Share</button>
                  </div>
                </div>
              </div>
            </div>

            {/* More Articles Row 3 */}
            <div className="row">
              <div className="col-md-6 mb-4">
                <div className="border-bottom pb-3">
                  <div className="d-flex align-items-start mb-3">
                    <div className="me-3">
                      <div style={{ 
                        width: '80px', 
                        height: '60px', 
                        borderRadius: '4px', 
                        backgroundImage: 'url("https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=200&q=80")',
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        backgroundRepeat: 'no-repeat',
                        border: '1px solid #dee2e6'
                      }}></div>
                    </div>
                    <div className="flex-grow-1">
                      <h3 className="fw-bold mb-2" style={{ 
                        fontFamily: "'Times New Roman', serif",
                        fontSize: '1.4rem',
                        color: '#000000',
                        lineHeight: '1.2'
                      }}>
                        Digital Lease Agreements See 300% Adoption
                      </h3>
                      <p className="text-muted mb-2" style={{ fontSize: '0.9rem' }}>
                        By Real Estate Correspondent • 5 hours ago
                      </p>
                    </div>
                  </div>
                  <p style={{ 
                    fontFamily: "'Times New Roman', serif",
                    fontSize: '1rem',
                    lineHeight: '1.5',
                    color: '#000000'
                  }}>
                    The adoption of digital lease agreements has increased by 300% in the past quarter, with tenants and landlords embracing the streamlined process.
                  </p>
                  <div className="d-flex align-items-center mt-3">
                    <button className="btn btn-danger btn-sm me-2" style={{ fontSize: '0.8rem' }}>Read More</button>
                    <button className="btn btn-outline-dark btn-sm" style={{ fontSize: '0.8rem' }}>Share</button>
                  </div>
                </div>
              </div>
              
              <div className="col-md-6 mb-4">
                <div className="border-bottom pb-3">
                  <div className="d-flex align-items-start mb-3">
                    <div className="me-3">
                      <div style={{ 
                        width: '80px', 
                        height: '60px', 
                        borderRadius: '4px', 
                        backgroundImage: 'url("https://images.unsplash.com/photo-1529156069898-49953e39b3ac?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=200&q=80")',
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        backgroundRepeat: 'no-repeat',
                        border: '1px solid #dee2e6'
                      }}></div>
                    </div>
                    <div className="flex-grow-1">
                      <h3 className="fw-bold mb-2" style={{ 
                        fontFamily: "'Times New Roman', serif",
                        fontSize: '1.4rem',
                        color: '#000000',
                        lineHeight: '1.2'
                      }}>
                        Roommate Matching Success Rate Hits 95%
                      </h3>
                      <p className="text-muted mb-2" style={{ fontSize: '0.9rem' }}>
                        By Community Affairs Reporter • 6 hours ago
                      </p>
                    </div>
                  </div>
                  <p style={{ 
                    fontFamily: "'Times New Roman', serif",
                    fontSize: '1rem',
                    lineHeight: '1.5',
                    color: '#000000'
                  }}>
                    The platform's roommate matching system has achieved a 95% success rate, with over 2,100 successful matches recorded in the first quarter.
                  </p>
                  <div className="d-flex align-items-center mt-3">
                    <button className="btn btn-danger btn-sm me-2" style={{ fontSize: '0.8rem' }}>Read More</button>
                    <button className="btn btn-outline-dark btn-sm" style={{ fontSize: '0.8rem' }}>Share</button>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Columns and Sidebar Row - Side by Side */}
        <div className="row justify-content-center mt-4">
          {/* Columns Section */}
          <div className="col-lg-8 mb-5">
            <div className="border-top pt-4">
              <h3 className="fw-bold mb-2 text-center" style={{ 
                fontFamily: "'Times New Roman', serif",
                fontSize: '1.8rem',
                color: '#000000'
              }}>
                Columns
              </h3>
              <BoxNewsArticles />
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="col-lg-4 mb-5">
            <div className="ps-lg-4">
              {/* Featured Articles */}
              <div className="mb-4">
                
                <div className="mb-3 border-bottom pb-3">
                  <Link href="/article/centuries-mutual-bbb-rating" className="text-decoration-none">
                    <h5 className="fw-bold mb-1" style={{ 
                      fontFamily: "'Times New Roman', serif",
                      fontSize: '1rem',
                      color: '#000000',
                      lineHeight: '1.3'
                    }}>
                      Centuries Mutual Maintains BBB A Rating
                    </h5>
                    <p className="text-muted mb-0" style={{ fontSize: '0.8rem' }}>
                      2 hours ago
                    </p>
                  </Link>
                </div>

                <div className="mb-3 border-bottom pb-3">
                  <Link href="/article/document-auditing-expansion" className="text-decoration-none">
                    <h5 className="fw-bold mb-1" style={{ 
                      fontFamily: "'Times New Roman', serif",
                      fontSize: '1rem',
                      color: '#000000',
                      lineHeight: '1.3'
                    }}>
                      Document Auditing Services Expand Nationwide
                    </h5>
                    <p className="text-muted mb-0" style={{ fontSize: '0.8rem' }}>
                      4 hours ago
                    </p>
                  </Link>
                </div>

                <div className="mb-3 border-bottom pb-3">
                  <Link href="/article/community-standards-update" className="text-decoration-none">
                    <h5 className="fw-bold mb-1" style={{ 
                      fontFamily: "'Times New Roman', serif",
                      fontSize: '1rem',
                      color: '#000000',
                      lineHeight: '1.3'
                    }}>
                      Community Standards Update Enhances Safety
                    </h5>
                    <p className="text-muted mb-0" style={{ fontSize: '0.8rem' }}>
                      6 hours ago
                    </p>
                  </Link>
                </div>

                <div className="mb-3 border-bottom pb-3">
                  <Link href="/article/real-estate-market-growth" className="text-decoration-none">
                    <h5 className="fw-bold mb-1" style={{ 
                      fontFamily: "'Times New Roman', serif",
                      fontSize: '1rem',
                      color: '#000000',
                      lineHeight: '1.3'
                    }}>
                      Real Estate Market Shows 8.5% Growth in Q4
                    </h5>
                    <p className="text-muted mb-0" style={{ fontSize: '0.8rem' }}>
                      8 hours ago
                    </p>
                  </Link>
                </div>

                <div className="mb-3 border-bottom pb-3">
                  <Link href="/article/credit-rating-5000-members" className="text-decoration-none">
                    <h5 className="fw-bold mb-1" style={{ 
                      fontFamily: "'Times New Roman', serif",
                      fontSize: '1rem',
                      color: '#000000',
                      lineHeight: '1.3'
                    }}>
                      In-House Trust Score System Reaches 5,000 Members
                    </h5>
                    <p className="text-muted mb-0" style={{ fontSize: '0.8rem' }}>
                      10 hours ago
                    </p>
                  </Link>
                </div>

                <div className="mb-3">
                  <Link href="/article/platform-million-documents" className="text-decoration-none">
                    <h5 className="fw-bold mb-1" style={{ 
                      fontFamily: "'Times New Roman', serif",
                      fontSize: '1rem',
                      color: '#000000',
                      lineHeight: '1.3'
                    }}>
                      Platform Reaches 1 Million Document Milestone
                    </h5>
                    <p className="text-muted mb-0" style={{ fontSize: '0.8rem' }}>
                      3 days ago
                    </p>
                  </Link>
                </div>
              </div>

              {/* Opinion Section */}
              <div className="mb-4">
                <h3 className="fw-bold mb-3" style={{ 
                  fontFamily: "'Times New Roman', serif",
                  fontSize: '1.6rem',
                  color: '#000000'
                }}>
                  Opinion
                </h3>
                
                <div className="border-start ps-3 mb-3" style={{ borderLeft: '4px solid #000000' }}>
                  <Link href="#" className="text-decoration-none">
                    <h4 className="fw-bold mb-2" style={{ 
                      fontFamily: "'Times New Roman', serif",
                      fontSize: '1.1rem',
                      color: '#000000'
                    }}>
                      The Future of Digital Real Estate
                    </h4>
                    <p className="text-muted mb-2" style={{ fontSize: '0.9rem' }}>
                      By Editorial Board
                    </p>
                    <p style={{ 
                      fontFamily: "'Times New Roman', serif",
                      fontSize: '0.95rem',
                      lineHeight: '1.5',
                      color: '#000000'
                    }}>
                      As technology continues to reshape the real estate landscape, platforms like Centuries Mutual are leading the charge in digital transformation and user protection.
                    </p>
                  </Link>
                </div>

                <div className="border-start ps-3 mb-3" style={{ borderLeft: '4px solid #000000' }}>
                  <Link href="#" className="text-decoration-none">
                    <h4 className="fw-bold mb-2" style={{ 
                      fontFamily: "'Times New Roman', serif",
                      fontSize: '1.1rem',
                      color: '#000000'
                    }}>
                      Community Standards Matter
                    </h4>
                    <p className="text-muted mb-2" style={{ fontSize: '0.9rem' }}>
                      By Guest Columnist
                    </p>
                    <p style={{ 
                      fontFamily: "'Times New Roman', serif",
                      fontSize: '0.95rem',
                      lineHeight: '1.5',
                      color: '#000000'
                    }}>
                      The implementation of comprehensive community standards demonstrates the company's commitment to creating safe, secure environments for all users.
                    </p>
                  </Link>
                </div>

                <div className="border-start ps-3" style={{ borderLeft: '4px solid #000000' }}>
                  <Link href="#" className="text-decoration-none">
                    <h4 className="fw-bold mb-2" style={{ 
                      fontFamily: "'Times New Roman', serif",
                      fontSize: '1.1rem',
                      color: '#000000'
                    }}>
                      Market Outlook 2024
                    </h4>
                    <p className="text-muted mb-2" style={{ fontSize: '0.9rem' }}>
                      By Financial Analyst
                    </p>
                    <p style={{ 
                      fontFamily: "'Times New Roman', serif",
                      fontSize: '0.95rem',
                      lineHeight: '1.5',
                      color: '#000000'
                    }}>
                      Industry experts predict continued growth in digital real estate services, with user safety and document security remaining top priorities.
                    </p>
                  </Link>
                </div>
              </div>

              {/* Business Briefs */}
              <div className="mb-4">
                <h3 className="fw-bold mb-3" style={{ 
                  fontFamily: "'Times New Roman', serif",
                  fontSize: '1.6rem',
                  color: '#000000'
                }}>
                  Business Briefs
                </h3>
                
                <div className="mb-3">
                  <Link href="#" className="text-decoration-none">
                    <h5 className="fw-bold mb-1" style={{ 
                      fontFamily: "'Times New Roman', serif",
                      fontSize: '0.95rem',
                      color: '#000000',
                      lineHeight: '1.3'
                    }}>
                      Document Processing Milestone
                    </h5>
                    <p style={{ 
                      fontFamily: "'Times New Roman', serif",
                      fontSize: '0.9rem',
                      lineHeight: '1.4',
                      color: '#000000'
                    }}>
                      Centuries Mutual has processed over 1 million documents with a 99.8% accuracy rate, setting new industry standards for digital document management.
                    </p>
                  </Link>
                </div>

                <div className="mb-3">
                  <Link href="#" className="text-decoration-none">
                    <h5 className="fw-bold mb-1" style={{ 
                      fontFamily: "'Times New Roman', serif",
                      fontSize: '0.95rem',
                      color: '#000000',
                      lineHeight: '1.3'
                    }}>
                      In-House Trust Score Expansion
                    </h5>
                    <p style={{ 
                      fontFamily: "'Times New Roman', serif",
                      fontSize: '0.9rem',
                      lineHeight: '1.4',
                      color: '#000000'
                    }}>
                      The member in-house trust score system based on our recommendation engine now serves over 5,000 verified users with a 95% successful matching rate for roommate compatibility.
                    </p>
                  </Link>
                </div>

                <div className="mb-3">
                  <Link href="#" className="text-decoration-none">
                    <h5 className="fw-bold mb-1" style={{ 
                      fontFamily: "'Times New Roman', serif",
                      fontSize: '0.95rem',
                      color: '#000000',
                      lineHeight: '1.3'
                    }}>
                      Security Enhancement
                    </h5>
                    <p style={{ 
                      fontFamily: "'Times New Roman', serif",
                      fontSize: '0.9rem',
                      lineHeight: '1.4',
                      color: '#000000'
                    }}>
                      Enhanced security protocols have been implemented across all platform services, ensuring maximum protection for user data and transactions.
                    </p>
                  </Link>
                </div>
              </div>

            </div>
          </div>
        </div>


        {/* Minimal Footer */}
        <div className="row mt-5 pt-4 border-top justify-content-center">
          <div className="col-lg-10 text-center">
            <p className="text-muted mb-0" style={{ 
              fontSize: '0.9rem',
              fontFamily: "'Times New Roman', serif"
            }}>
              © 2026 Centuries Mutual. All rights reserved.
            </p>
          </div>
        </div>
      </div>
      
      <Footer />
    </main>
  )
}
