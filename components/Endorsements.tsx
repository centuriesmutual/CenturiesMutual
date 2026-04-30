'use client'

export default function Endorsements() {
  return (
    <section className="py-5" style={{ 
      background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 50%, #ffffff 100%)',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Decorative background elements */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundImage: 'radial-gradient(circle at 20% 50%, rgba(20, 67, 42, 0.03) 0%, transparent 50%), radial-gradient(circle at 80% 50%, rgba(20, 67, 42, 0.03) 0%, transparent 50%)',
        pointerEvents: 'none'
      }} />
      
      <div className="container position-relative">
        <div className="row">
          <div className="col-12 text-center mb-4">
            <p style={{ 
              fontSize: '0.95rem',
              fontWeight: '600',
              color: '#6c757d',
              textTransform: 'uppercase',
              letterSpacing: '2px',
              marginBottom: '0.5rem'
            }}>
              Trusted by industry leaders
            </p>
          </div>
        </div>
        
        <div className="row g-4 justify-content-center align-items-center">
          {/* Salesforce */}
          <div className="col-6 col-md-4 col-lg-2">
            <div 
              className="endorsement-card"
              style={{
                background: 'white',
                borderRadius: '16px',
                padding: '24px 20px',
                boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                transition: 'all 0.3s ease',
                cursor: 'pointer',
                border: '1px solid rgba(0,0,0,0.05)',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: '120px'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-5px)'
                e.currentTarget.style.boxShadow = '0 8px 30px rgba(0, 161, 224, 0.2)'
                e.currentTarget.style.borderColor = 'rgba(0, 161, 224, 0.3)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)'
                e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.08)'
                e.currentTarget.style.borderColor = 'rgba(0,0,0,0.05)'
              }}
            >
              <div style={{ marginBottom: '12px' }}>
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none">
                  <path d="M12 2L2 7L12 12L22 7L12 2Z" fill="#00A1E0"/>
                  <path d="M2 17L12 22L22 17V12L12 17L2 12V17Z" fill="#00A1E0"/>
                </svg>
              </div>
              <span style={{
                color: '#00A1E0',
                fontSize: '0.9rem',
                fontWeight: '700',
                fontFamily: 'system-ui, -apple-system, sans-serif',
                letterSpacing: '-0.3px'
              }}>
                Salesforce
              </span>
            </div>
          </div>

          {/* Oracle */}
          <div className="col-6 col-md-4 col-lg-2">
            <div 
              className="endorsement-card"
              style={{
                background: 'white',
                borderRadius: '16px',
                padding: '24px 20px',
                boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                transition: 'all 0.3s ease',
                cursor: 'pointer',
                border: '1px solid rgba(0,0,0,0.05)',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: '120px'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-5px)'
                e.currentTarget.style.boxShadow = '0 8px 30px rgba(248, 0, 0, 0.2)'
                e.currentTarget.style.borderColor = 'rgba(248, 0, 0, 0.3)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)'
                e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.08)'
                e.currentTarget.style.borderColor = 'rgba(0,0,0,0.05)'
              }}
            >
              <div style={{ marginBottom: '12px' }}>
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none">
                  <rect x="4" y="4" width="16" height="16" rx="2" fill="#F80000"/>
                  <path d="M8 12L12 8L16 12L12 16L8 12Z" fill="white"/>
                </svg>
              </div>
              <span style={{
                color: '#F80000',
                fontSize: '0.9rem',
                fontWeight: '700',
                fontFamily: 'system-ui, -apple-system, sans-serif',
                letterSpacing: '-0.3px'
              }}>
                Oracle
              </span>
            </div>
          </div>

          {/* Coinbase */}
          <div className="col-6 col-md-4 col-lg-2">
            <div 
              className="endorsement-card"
              style={{
                background: 'white',
                borderRadius: '16px',
                padding: '24px 20px',
                boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                transition: 'all 0.3s ease',
                cursor: 'pointer',
                border: '1px solid rgba(0,0,0,0.05)',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: '120px'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-5px)'
                e.currentTarget.style.boxShadow = '0 8px 30px rgba(0, 82, 255, 0.2)'
                e.currentTarget.style.borderColor = 'rgba(0, 82, 255, 0.3)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)'
                e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.08)'
                e.currentTarget.style.borderColor = 'rgba(0,0,0,0.05)'
              }}
            >
              <div style={{ marginBottom: '12px' }}>
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="10" fill="#0052FF"/>
                  <path d="M12 6L12 18M6 12L18 12" stroke="white" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </div>
              <span style={{
                color: '#0052FF',
                fontSize: '0.9rem',
                fontWeight: '700',
                fontFamily: 'system-ui, -apple-system, sans-serif',
                letterSpacing: '-0.3px'
              }}>
                Coinbase
              </span>
            </div>
          </div>

          {/* Circle Internet Group */}
          <div className="col-6 col-md-4 col-lg-2">
            <div 
              className="endorsement-card"
              style={{
                background: 'white',
                borderRadius: '16px',
                padding: '24px 20px',
                boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                transition: 'all 0.3s ease',
                cursor: 'pointer',
                border: '1px solid rgba(0,0,0,0.05)',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: '120px'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-5px)'
                e.currentTarget.style.boxShadow = '0 8px 30px rgba(20, 67, 42, 0.2)'
                e.currentTarget.style.borderColor = 'rgba(20, 67, 42, 0.3)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)'
                e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.08)'
                e.currentTarget.style.borderColor = 'rgba(0,0,0,0.05)'
              }}
            >
              <div style={{ marginBottom: '12px' }}>
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="9" stroke="#14432A" strokeWidth="2" fill="none"/>
                  <circle cx="12" cy="12" r="5" fill="#14432A"/>
                </svg>
              </div>
              <span style={{
                color: '#14432A',
                fontSize: '0.85rem',
                fontWeight: '700',
                fontFamily: 'system-ui, -apple-system, sans-serif',
                letterSpacing: '-0.3px',
                textAlign: 'center',
                lineHeight: '1.2'
              }}>
                Circle Internet Group
              </span>
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}
