'use client'

import Link from 'next/link'
import { 
  ChartBarIcon,
  BanknotesIcon,
  DocumentTextIcon
} from '@heroicons/react/24/outline'

export default function OfferingsOverview() {
  return (
    <section className="py-5" style={{ 
      background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
      position: 'relative'
    }}>
      <div className="container">
        <div className="row g-4">
          {/* Rental Equity Bubble */}
          <div className="col-md-4">
            <div style={{
              background: 'white',
              borderRadius: '20px',
              padding: '40px 32px',
              boxShadow: '0 8px 30px rgba(0,0,0,0.08)',
              border: '1px solid rgba(20, 67, 42, 0.1)',
              height: '100%',
              transition: 'all 0.3s ease',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              textAlign: 'center'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-5px)'
              e.currentTarget.style.boxShadow = '0 12px 40px rgba(20, 67, 42, 0.15)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)'
              e.currentTarget.style.boxShadow = '0 8px 30px rgba(0,0,0,0.08)'
            }}
            >
              <div style={{
                background: 'rgba(20, 67, 42, 0.1)',
                borderRadius: '16px',
                width: '72px',
                height: '72px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '24px'
              }}>
                <ChartBarIcon style={{ width: '36px', height: '36px', color: '#14432A' }} />
              </div>
              <h4 className="fw-bold mb-3" style={{ color: '#14432A', fontSize: '1.5rem', textAlign: 'center', width: '100%' }}>Rental Equity</h4>
              <p className="text-muted mb-0" style={{ fontSize: '1rem', lineHeight: '1.6', textAlign: 'center', maxWidth: '100%' }}>
                Transform your rent payments into building your in-house trust score based on our recommendation engine.
              </p>
            </div>
          </div>

          {/* Payment Technology Bubble */}
          <div className="col-md-4">
            <div style={{
              background: 'white',
              borderRadius: '20px',
              padding: '40px 32px',
              boxShadow: '0 8px 30px rgba(0,0,0,0.08)',
              border: '1px solid rgba(20, 67, 42, 0.1)',
              height: '100%',
              transition: 'all 0.3s ease',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              textAlign: 'center'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-5px)'
              e.currentTarget.style.boxShadow = '0 12px 40px rgba(20, 67, 42, 0.15)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)'
              e.currentTarget.style.boxShadow = '0 8px 30px rgba(0,0,0,0.08)'
            }}
            >
              <div style={{
                background: 'rgba(20, 67, 42, 0.1)',
                borderRadius: '16px',
                width: '72px',
                height: '72px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '24px'
              }}>
                <BanknotesIcon style={{ width: '36px', height: '36px', color: '#14432A' }} />
              </div>
              <h4 className="fw-bold mb-3" style={{ color: '#14432A', fontSize: '1.5rem', textAlign: 'center', width: '100%' }}>Payment Technology</h4>
              <p className="text-muted mb-0" style={{ fontSize: '1rem', lineHeight: '1.6', textAlign: 'center', maxWidth: '100%' }}>
                Blockchain-powered platform that enforces contracts with immutable, transparent, and secure smart contract technology.
              </p>
            </div>
          </div>

          {/* eDocument System Bubble */}
          <div className="col-md-4">
            <div style={{
              background: 'white',
              borderRadius: '20px',
              padding: '40px 32px',
              boxShadow: '0 8px 30px rgba(0,0,0,0.08)',
              border: '1px solid rgba(20, 67, 42, 0.1)',
              height: '100%',
              transition: 'all 0.3s ease',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              textAlign: 'center'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-5px)'
              e.currentTarget.style.boxShadow = '0 12px 40px rgba(20, 67, 42, 0.15)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)'
              e.currentTarget.style.boxShadow = '0 8px 30px rgba(0,0,0,0.08)'
            }}
            >
              <div style={{
                background: 'rgba(20, 67, 42, 0.1)',
                borderRadius: '16px',
                width: '72px',
                height: '72px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '24px'
              }}>
                <DocumentTextIcon style={{ width: '36px', height: '36px', color: '#14432A' }} />
              </div>
              <h4 className="fw-bold mb-3" style={{ color: '#14432A', fontSize: '1.5rem', textAlign: 'center', width: '100%' }}>eDocument System</h4>
              <p className="text-muted mb-0" style={{ fontSize: '1rem', lineHeight: '1.6', textAlign: 'center', maxWidth: '100%' }}>
                Streamline lease agreements, roommate contracts, and property documentation all in one secure platform.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
