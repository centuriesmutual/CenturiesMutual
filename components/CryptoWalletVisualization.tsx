'use client'

import { useState, useEffect } from 'react'

export default function CreditRatingDisplay() {
  const [isClient, setIsClient] = useState(false)
  
  useEffect(() => {
    setIsClient(true)
  }, [])

  return (
    <div style={{
      background: 'rgba(255,255,255,0.95)',
      borderRadius: '24px',
      padding: '40px',
      backdropFilter: 'blur(20px)',
      border: '1px solid rgba(255,255,255,0.3)',
      boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
      position: 'relative',
      overflow: 'hidden'
    }}>
      
      {/* Header */}
      <div className="text-center mb-5">
        <h3 className="fw-bold mb-3" style={{ 
          color: '#14432A',
          fontSize: '32px',
          fontFamily: "'Playfair Display', serif",
          textShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
          In-House Trust Score System
        </h3>
        <p style={{ 
          color: '#6b7280', 
          fontSize: '16px',
          marginBottom: '0'
        }}>
          Transparent in-house trust score based on our recommendation engine (1-300 scale) and verified member system
        </p>
      </div>
      
      {/* Clean In-House Trust Score Illustration */}
      <div className="text-center mb-5">
        <div style={{
          background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
          borderRadius: '20px',
          padding: '40px',
          border: '2px solid #e5e7eb',
          position: 'relative',
          maxWidth: '400px',
          margin: '0 auto'
        }}>
          {/* Clean In-House Trust Score Circle - No Shadow */}
          <div style={{
            width: '120px',
            height: '120px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 20px'
          }}>
            {/* Inner circle */}
            <div style={{
              width: '100px',
              height: '100px',
              borderRadius: '50%',
              background: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexDirection: 'column'
            }}>
              <div style={{
                color: '#10b981',
                fontSize: '32px',
                fontWeight: '800',
                lineHeight: '1',
                fontFamily: 'system-ui, -apple-system, sans-serif'
              }}>
                225
              </div>
            </div>
          </div>
          
          {/* Score Label */}
          <div style={{
            color: '#1f2937',
            fontSize: '18px',
            fontWeight: '600',
            marginBottom: '8px'
          }}>
            In-House Trust Score
          </div>
          
          {/* Rating Badge */}
          <div style={{
            background: '#10b981',
            borderRadius: '20px',
            padding: '6px 16px',
            display: 'inline-block',
            fontSize: '12px',
            fontWeight: '600',
            color: '#ffffff',
            textTransform: 'uppercase',
            letterSpacing: '0.5px'
          }}>
            Excellent Rating
          </div>
          
          {/* Score Range Indicator */}
          <div style={{
            marginTop: '20px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            fontSize: '12px',
            color: '#6b7280'
          }}>
            <span>1</span>
            <div style={{
              flex: '1',
              height: '4px',
              background: '#e5e7eb',
              borderRadius: '2px',
              margin: '0 10px',
              position: 'relative'
            }}>
              <div style={{
                position: 'absolute',
                left: '75%',
                top: '50%',
                transform: 'translateY(-50%)',
                width: '8px',
                height: '8px',
                background: '#10b981',
                borderRadius: '50%'
              }}></div>
            </div>
            <span>300</span>
          </div>
        </div>
      </div>
      
      {/* Features Grid */}
      <div className="mb-5">
        <div className="d-flex align-items-center mb-4">
          <div style={{
            background: 'linear-gradient(135deg, rgba(20, 67, 42, 0.1) 0%, rgba(20, 67, 42, 0.2) 100%)',
            borderRadius: '16px',
            width: '60px',
            height: '60px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginRight: '20px',
            boxShadow: '0 4px 12px rgba(20, 67, 42, 0.2)'
          }}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" style={{ width: '28px', height: '28px', color: '#14432A' }}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z" />
            </svg>
          </div>
          <div>
            <h5 className="fw-bold mb-2" style={{ color: '#14432A', fontSize: '18px' }}>In-House Trust Score Display</h5>
            <p className="text-muted mb-0" style={{ fontSize: '15px' }}>Transparent in-house ratings for all members</p>
          </div>
        </div>
        
        <div className="d-flex align-items-center mb-4">
          <div style={{
            background: 'linear-gradient(135deg, rgba(20, 67, 42, 0.1) 0%, rgba(20, 67, 42, 0.2) 100%)',
            borderRadius: '16px',
            width: '60px',
            height: '60px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginRight: '20px',
            boxShadow: '0 4px 12px rgba(20, 67, 42, 0.2)'
          }}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" style={{ width: '28px', height: '28px', color: '#14432A' }}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z" />
            </svg>
          </div>
          <div>
            <h5 className="fw-bold mb-2" style={{ color: '#14432A', fontSize: '18px' }}>Verified Members</h5>
            <p className="text-muted mb-0" style={{ fontSize: '15px' }}>ID verification required</p>
          </div>
        </div>
        
        <div className="d-flex align-items-center">
          <div style={{
            background: 'linear-gradient(135deg, rgba(20, 67, 42, 0.1) 0%, rgba(20, 67, 42, 0.2) 100%)',
            borderRadius: '16px',
            width: '60px',
            height: '60px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginRight: '20px',
            boxShadow: '0 4px 12px rgba(20, 67, 42, 0.2)'
          }}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" style={{ width: '28px', height: '28px', color: '#14432A' }}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193-.34.027-.68.052-1.02.072v3.091l-3-3c-1.354 0-2.694-.055-4.02-.163a2.115 2.115 0 0 1-.825-.242m9.345-8.334a2.126 2.126 0 0 0-.476-.095 48.64 48.64 0 0 0-8.048 0c-1.131.094-1.976 1.057-1.976 2.192v4.286c0 .837.46 1.58 1.155 1.951m9.345-8.334V6.637c0-1.621-1.152-3.026-2.76-3.235A48.455 48.455 0 0 0 11.25 3c-2.115 0-4.198.137-6.24.402-1.608.209-2.76 1.614-2.76 3.235v6.226c0 1.621 1.152 3.026 2.76 3.235.577.075 1.157.14 1.74.194V21l4.155-4.155" />
            </svg>
          </div>
          <div>
            <h5 className="fw-bold mb-2" style={{ color: '#14432A', fontSize: '18px' }}>Review System</h5>
            <p className="text-muted mb-0" style={{ fontSize: '15px' }}>Rate your roommates and landlords</p>
          </div>
        </div>
      </div>
    </div>
  )
}