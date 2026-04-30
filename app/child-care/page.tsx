'use client'

import Navbar from '../../components/Navbar'
import Footer from '../../components/Footer'
import Link from 'next/link'
import { useState } from 'react'
import Image from 'next/image'
import { 
  HeartIcon, 
  ShieldCheckIcon, 
  UserGroupIcon,
  CheckCircleIcon,
  ClockIcon,
  StarIcon,
  MapPinIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  PhoneIcon,
  EnvelopeIcon,
  AcademicCapIcon,
  BriefcaseIcon
} from '@heroicons/react/24/outline'

export default function ChildCare() {
  const [searchQuery, setSearchQuery] = useState('')
  const [filters, setFilters] = useState({
    location: '',
    careType: '',
    experience: '',
    availability: ''
  })

  // Sample caregiver profiles
  const caregivers = [
    {
      id: 1,
      name: 'Sarah Johnson',
      location: 'Seattle, WA',
      rating: 4.9,
      reviews: 127,
      trustScore: 290,
      hourlyRate: '$18-22',
      experience: '8 years',
      education: 'Early Childhood Education Degree',
      verified: true,
      available: 'Available Now',
      specialties: ['Infant Care', 'Toddler Care', 'Homework Help'],
      bio: 'Experienced and nurturing caregiver with a passion for early childhood development. I create engaging, educational activities while ensuring a safe and loving environment.',
      image: null,
      backgroundCheck: true,
      cprCertified: true
    },
    {
      id: 2,
      name: 'Maria Rodriguez',
      location: 'Bellevue, WA',
      rating: 5.0,
      reviews: 89,
      trustScore: 285,
      hourlyRate: '$20-25',
      experience: '12 years',
      education: 'Child Development Specialist',
      verified: true,
      available: 'Available in 1 week',
      specialties: ['Preschool Care', 'Bilingual (Spanish)', 'Arts & Crafts'],
      bio: 'Bilingual caregiver specializing in preschool-aged children. I incorporate language learning, creative activities, and outdoor play into daily routines.',
      image: null,
      backgroundCheck: true,
      cprCertified: true
    },
    {
      id: 3,
      name: 'Jennifer Chen',
      location: 'Redmond, WA',
      rating: 4.8,
      reviews: 156,
      trustScore: 288,
      hourlyRate: '$19-23',
      experience: '6 years',
      education: 'Elementary Education',
      verified: true,
      available: 'Available Now',
      specialties: ['After-School Care', 'Homework Help', 'STEM Activities'],
      bio: 'Dedicated caregiver with a focus on school-age children. I help with homework, organize educational activities, and ensure children have fun while learning.',
      image: null,
      backgroundCheck: true,
      cprCertified: true
    },
    {
      id: 4,
      name: 'Emily Thompson',
      location: 'Tacoma, WA',
      rating: 4.9,
      reviews: 203,
      trustScore: 292,
      hourlyRate: '$22-28',
      experience: '15 years',
      education: 'Master\'s in Child Psychology',
      verified: true,
      available: 'Available Now',
      specialties: ['Special Needs Care', 'Behavioral Support', 'Therapeutic Activities'],
      bio: 'Highly experienced caregiver specializing in children with special needs. I provide compassionate, individualized care with a focus on developmental support.',
      image: null,
      backgroundCheck: true,
      cprCertified: true
    },
    {
      id: 5,
      name: 'Lisa Anderson',
      location: 'Everett, WA',
      rating: 4.7,
      reviews: 94,
      trustScore: 275,
      hourlyRate: '$16-20',
      experience: '5 years',
      education: 'Childcare Certification',
      verified: true,
      available: 'Available in 2 weeks',
      specialties: ['Newborn Care', 'Infant Care', 'Meal Preparation'],
      bio: 'Caring and patient caregiver with expertise in infant and newborn care. I provide a nurturing environment with focus on feeding schedules, sleep routines, and developmental milestones.',
      image: null,
      backgroundCheck: true,
      cprCertified: true
    },
    {
      id: 6,
      name: 'Amanda Williams',
      location: 'Kirkland, WA',
      rating: 5.0,
      reviews: 178,
      trustScore: 295,
      hourlyRate: '$21-26',
      experience: '10 years',
      education: 'Early Childhood Development',
      verified: true,
      available: 'Available Now',
      specialties: ['Full-Time Care', 'Preschool Prep', 'Outdoor Activities'],
      bio: 'Energetic and creative caregiver who loves engaging children in outdoor activities and educational play. I prepare children for preschool while making learning fun.',
      image: null,
      backgroundCheck: true,
      cprCertified: true
    }
  ]

  const filteredCaregivers = caregivers.filter(caregiver => {
    const matchesSearch = !searchQuery || 
      caregiver.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      caregiver.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      caregiver.specialties.some(s => s.toLowerCase().includes(searchQuery.toLowerCase()))
    const matchesLocation = !filters.location || caregiver.location.toLowerCase().includes(filters.location.toLowerCase())
    return matchesSearch && matchesLocation
  })

  return (
    <>
      <Navbar />
      <main>
        {/* Hero Section */}
        <section className="position-relative" style={{ 
          background: 'linear-gradient(180deg, #14432A 0%, #1a5436 100%)',
          paddingTop: '100px',
          paddingBottom: '80px'
        }}>
          <div className="container">
            <div className="row justify-content-center">
              <div className="col-lg-10 text-center text-white">
                <h1 className="display-3 fw-bold mb-4" style={{ 
                  fontFamily: "'Playfair Display', serif",
                  letterSpacing: '-0.5px'
                }}>
                  Find Trusted Child Care
                </h1>
                <p className="lead mb-5" style={{ 
                  fontSize: '1.4rem', 
                  maxWidth: '800px', 
                  margin: '0 auto 2.5rem',
                  lineHeight: '1.8',
                  opacity: 0.95
                }}>
                  Connect with verified, experienced caregivers in your area. All caregivers are background-checked, 
                  trust-score verified, and committed to your child's safety and development.
                </p>
                
                {/* Search Bar */}
                <div className="card border-0 shadow-lg mb-4" style={{ borderRadius: '16px', maxWidth: '800px', margin: '0 auto' }}>
                  <div className="card-body p-4">
                    <div className="row g-3">
                      <div className="col-md-5">
                        <div className="input-group">
                          <span className="input-group-text bg-white border-0">
                            <MagnifyingGlassIcon style={{ width: '20px', height: '20px', color: '#6c757d' }} />
                          </span>
                          <input
                            type="text"
                            className="form-control border-0"
                            placeholder="Search by name, location, or specialty..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            style={{ fontSize: '1rem' }}
                          />
                        </div>
                      </div>
                      <div className="col-md-4">
                        <div className="input-group">
                          <span className="input-group-text bg-white border-0">
                            <MapPinIcon style={{ width: '20px', height: '20px', color: '#6c757d' }} />
                          </span>
                          <input
                            type="text"
                            className="form-control border-0"
                            placeholder="City or ZIP code"
                            value={filters.location}
                            onChange={(e) => setFilters({...filters, location: e.target.value})}
                            style={{ fontSize: '1rem' }}
                          />
                        </div>
                      </div>
                      <div className="col-md-3">
                        <button className="btn btn-primary w-100" style={{ backgroundColor: '#14432A', borderColor: '#14432A', height: '100%' }}>
                          Search Caregivers
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="d-flex gap-4 justify-content-center flex-wrap text-white" style={{ opacity: 0.9 }}>
                  <div className="d-flex align-items-center">
                    <ShieldCheckIcon style={{ width: '20px', height: '20px', marginRight: '8px' }} />
                    <span>Background Verified</span>
                  </div>
                  <div className="d-flex align-items-center">
                    <CheckCircleIcon style={{ width: '20px', height: '20px', marginRight: '8px' }} />
                    <span>Trust Score Rated</span>
                  </div>
                  <div className="d-flex align-items-center">
                    <HeartIcon style={{ width: '20px', height: '20px', marginRight: '8px' }} />
                    <span>Safe & Secure</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-4 bg-light border-bottom">
          <div className="container">
            <div className="row text-center">
              <div className="col-md-3">
                <div className="h3 fw-bold mb-1" style={{ color: '#14432A' }}>500+</div>
                <div className="text-muted small">Verified Caregivers</div>
              </div>
              <div className="col-md-3">
                <div className="h3 fw-bold mb-1" style={{ color: '#14432A' }}>10,000+</div>
                <div className="text-muted small">Happy Families</div>
              </div>
              <div className="col-md-3">
                <div className="h3 fw-bold mb-1" style={{ color: '#14432A' }}>4.9/5</div>
                <div className="text-muted small">Average Rating</div>
              </div>
              <div className="col-md-3">
                <div className="h3 fw-bold mb-1" style={{ color: '#14432A' }}>100%</div>
                <div className="text-muted small">Background Checked</div>
              </div>
            </div>
          </div>
        </section>

        {/* Caregiver Listings */}
        <section className="py-5">
          <div className="container">
            <div className="row mb-4">
              <div className="col-md-6">
                <h2 className="fw-bold mb-2" style={{ color: '#14432A' }}>
                  Available Caregivers
                </h2>
                <p className="text-muted mb-0">
                  {filteredCaregivers.length} {filteredCaregivers.length === 1 ? 'caregiver' : 'caregivers'} found
                </p>
              </div>
              <div className="col-md-6 text-end">
                <button className="btn btn-outline-primary">
                  <FunnelIcon style={{ width: '16px', height: '16px', display: 'inline', marginRight: '8px' }} />
                  More Filters
                </button>
              </div>
            </div>

            <div className="row g-4">
              {filteredCaregivers.map((caregiver) => (
                <div key={caregiver.id} className="col-md-6 col-lg-4">
                  <div className="card border-0 shadow-sm h-100" style={{ borderRadius: '16px', transition: 'all 0.3s ease' }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-5px)'
                      e.currentTarget.style.boxShadow = '0 8px 25px rgba(0,0,0,0.15)'
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)'
                      e.currentTarget.style.boxShadow = '0 2px 10px rgba(0,0,0,0.1)'
                    }}
                  >
                    <div className="card-body p-4">
                      {/* Header */}
                      <div className="d-flex justify-content-between align-items-start mb-3">
                        <div className="d-flex align-items-center">
                          <div style={{
                            width: '60px',
                            height: '60px',
                            borderRadius: '50%',
                            background: 'linear-gradient(135deg, #14432A 0%, #1a5436 100%)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: 'white',
                            fontSize: '1.5rem',
                            fontWeight: 'bold',
                            marginRight: '12px'
                          }}>
                            {caregiver.name.split(' ').map(n => n[0]).join('')}
                          </div>
                          <div>
                            <h5 className="fw-bold mb-1" style={{ color: '#14432A' }}>
                              {caregiver.name}
                              {caregiver.verified && (
                                <CheckCircleIcon style={{ width: '18px', height: '18px', color: '#10b981', display: 'inline', marginLeft: '6px' }} />
                              )}
                            </h5>
                            <div className="d-flex align-items-center mb-1">
                              <MapPinIcon style={{ width: '14px', height: '14px', color: '#6c757d', marginRight: '4px' }} />
                              <small className="text-muted">{caregiver.location}</small>
                            </div>
                            <div className="d-flex align-items-center">
                              <StarIcon style={{ width: '14px', height: '14px', color: '#fbbf24', marginRight: '4px', fill: '#fbbf24' }} />
                              <small className="fw-bold me-1">{caregiver.rating}</small>
                              <small className="text-muted">({caregiver.reviews})</small>
                            </div>
                          </div>
                        </div>
                        <button className="btn btn-sm p-1" style={{ border: 'none', background: 'transparent' }}>
                          <HeartIcon style={{ width: '20px', height: '20px', color: '#6c757d' }} />
                        </button>
                      </div>

                      {/* Bio */}
                      <p className="text-muted small mb-3" style={{ lineHeight: '1.6', fontSize: '0.9rem' }}>
                        {caregiver.bio}
                      </p>

                      {/* Details */}
                      <div className="mb-3">
                        <div className="d-flex align-items-center mb-2">
                          <BriefcaseIcon style={{ width: '16px', height: '16px', color: '#6c757d', marginRight: '8px' }} />
                          <small className="text-muted">{caregiver.experience} experience</small>
                        </div>
                        <div className="d-flex align-items-center mb-2">
                          <AcademicCapIcon style={{ width: '16px', height: '16px', color: '#6c757d', marginRight: '8px' }} />
                          <small className="text-muted">{caregiver.education}</small>
                        </div>
                        <div className="d-flex align-items-center">
                          <ClockIcon style={{ width: '16px', height: '16px', color: '#10b981', marginRight: '8px' }} />
                          <small style={{ color: '#10b981', fontWeight: '600' }}>{caregiver.available}</small>
                        </div>
                      </div>

                      {/* Specialties */}
                      <div className="mb-3">
                        <div className="d-flex flex-wrap gap-2">
                          {caregiver.specialties.slice(0, 3).map((specialty, idx) => (
                            <span key={idx} className="badge" style={{ 
                              background: 'rgba(20, 67, 42, 0.1)',
                              color: '#14432A',
                              fontSize: '0.75rem',
                              padding: '4px 8px'
                            }}>
                              {specialty}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Certifications */}
                      <div className="mb-3 d-flex gap-3">
                        {caregiver.backgroundCheck && (
                          <small className="text-muted">
                            <ShieldCheckIcon style={{ width: '14px', height: '14px', display: 'inline', marginRight: '4px', color: '#10b981' }} />
                            Background Check
                          </small>
                        )}
                        {caregiver.cprCertified && (
                          <small className="text-muted">
                            <CheckCircleIcon style={{ width: '14px', height: '14px', display: 'inline', marginRight: '4px', color: '#10b981' }} />
                            CPR Certified
                          </small>
                        )}
                      </div>

                      {/* Footer */}
                      <div className="d-flex justify-content-between align-items-center pt-3 border-top">
                        <div>
                          <div className="fw-bold" style={{ color: '#14432A', fontSize: '1.1rem' }}>{caregiver.hourlyRate}</div>
                          <small className="text-muted">per hour</small>
                        </div>
                        <div className="d-flex gap-2">
                          <button className="btn btn-outline-primary btn-sm">
                            <PhoneIcon style={{ width: '16px', height: '16px' }} />
                          </button>
                          <button className="btn btn-outline-primary btn-sm">
                            <EnvelopeIcon style={{ width: '16px', height: '16px' }} />
                          </button>
                          <button className="btn btn-primary btn-sm" style={{ backgroundColor: '#14432A', borderColor: '#14432A' }}>
                            View Profile
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Why Choose Us Section */}
        <section className="py-5 bg-light">
          <div className="container">
            <div className="row mb-5">
              <div className="col-lg-8 mx-auto text-center">
                <h2 className="display-5 fw-bold mb-4" style={{ color: '#14432A' }}>
                  Why Families Choose Us
                </h2>
              </div>
            </div>

            <div className="row g-4">
              <div className="col-md-6 col-lg-3">
                <div className="text-center">
                  <div style={{
                    background: 'rgba(20, 67, 42, 0.1)',
                    borderRadius: '50%',
                    width: '80px',
                    height: '80px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 20px'
                  }}>
                    <ShieldCheckIcon style={{ width: '40px', height: '40px', color: '#14432A' }} />
                  </div>
                  <h5 className="fw-bold mb-3" style={{ color: '#14432A' }}>Verified & Safe</h5>
                  <p className="text-muted small">Every caregiver undergoes comprehensive background checks and trust score verification.</p>
                </div>
              </div>
              <div className="col-md-6 col-lg-3">
                <div className="text-center">
                  <div style={{
                    background: 'rgba(20, 67, 42, 0.1)',
                    borderRadius: '50%',
                    width: '80px',
                    height: '80px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 20px'
                  }}>
                    <StarIcon style={{ width: '40px', height: '40px', color: '#14432A' }} />
                  </div>
                  <h5 className="fw-bold mb-3" style={{ color: '#14432A' }}>Highly Rated</h5>
                  <p className="text-muted small">Our caregivers have an average rating of 4.9/5 stars from thousands of family reviews.</p>
                </div>
              </div>
              <div className="col-md-6 col-lg-3">
                <div className="text-center">
                  <div style={{
                    background: 'rgba(20, 67, 42, 0.1)',
                    borderRadius: '50%',
                    width: '80px',
                    height: '80px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 20px'
                  }}>
                    <ClockIcon style={{ width: '40px', height: '40px', color: '#14432A' }} />
                  </div>
                  <h5 className="fw-bold mb-3" style={{ color: '#14432A' }}>Flexible Scheduling</h5>
                  <p className="text-muted small">Find caregivers available for full-time, part-time, after-school, or occasional care.</p>
                </div>
              </div>
              <div className="col-md-6 col-lg-3">
                <div className="text-center">
                  <div style={{
                    background: 'rgba(20, 67, 42, 0.1)',
                    borderRadius: '50%',
                    width: '80px',
                    height: '80px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 20px'
                  }}>
                    <HeartIcon style={{ width: '40px', height: '40px', color: '#14432A' }} />
                  </div>
                  <h5 className="fw-bold mb-3" style={{ color: '#14432A' }}>Secure Payments</h5>
                  <p className="text-muted small">Safe, blockchain-powered payment processing with transparent pricing and secure transactions.</p>
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
                  Ready to Find Your Perfect Caregiver?
                </h2>
                <p className="mb-4" style={{ opacity: 0.95, fontSize: '1.1rem' }}>
                  Join thousands of families who trust us to connect them with verified, experienced caregivers.
                </p>
                <div className="d-flex gap-3 justify-content-center flex-wrap">
                  <Link href="/signup" className="btn btn-light btn-lg px-5 py-3">
                    Get Started Free
                  </Link>
                  <Link href="/contact" className="btn btn-outline-light btn-lg px-5 py-3">
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
