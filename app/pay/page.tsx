'use client'

import { useState } from 'react'
import Link from 'next/link'
import Footer from '../../components/Footer'

export default function PayPage() {
  const [activeTab, setActiveTab] = useState('rent')
  const [amount, setAmount] = useState('')
  const [recipient, setRecipient] = useState('')
  const [utilitiesType, setUtilitiesType] = useState('electricity')
  const [propertyAddress, setPropertyAddress] = useState('')

  return (
    <main>
      <div className="container-fluid" style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)' }}>
        <div className="container py-5">
          {/* Header */}
          <div className="row mb-5">
            <div className="col-12">
              <h1 className="display-4 fw-bold mb-3" style={{ color: '#14432A', fontFamily: "'Playfair Display', serif" }}>
                Pay
              </h1>
              <p className="lead mb-0" style={{ color: '#495057' }}>
                Peer to Peer, Utilities & Rent payments made simple.
              </p>
            </div>
          </div>

          {/* Tabs */}
          <div className="row mb-4">
            <div className="col-12">
              <ul className="nav nav-pills nav-justified" style={{ background: 'white', borderRadius: '12px', padding: '10px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
                <li className="nav-item">
                  <button 
                    className={`nav-link ${activeTab === 'rent' ? 'active' : ''}`}
                    onClick={() => setActiveTab('rent')}
                    style={{ 
                      borderRadius: '8px',
                      color: activeTab === 'rent' ? 'white' : '#14432A',
                      backgroundColor: activeTab === 'rent' ? '#14432A' : 'transparent',
                      border: 'none'
                    }}
                  >
                    💰 Rent
                  </button>
                </li>
                <li className="nav-item">
                  <button 
                    className={`nav-link ${activeTab === 'utilities' ? 'active' : ''}`}
                    onClick={() => setActiveTab('utilities')}
                    style={{ 
                      borderRadius: '8px',
                      color: activeTab === 'utilities' ? 'white' : '#14432A',
                      backgroundColor: activeTab === 'utilities' ? '#14432A' : 'transparent',
                      border: 'none'
                    }}
                  >
                    ⚡ Utilities
                  </button>
                </li>
                <li className="nav-item">
                  <button 
                    className={`nav-link ${activeTab === 'peer' ? 'active' : ''}`}
                    onClick={() => setActiveTab('peer')}
                    style={{ 
                      borderRadius: '8px',
                      color: activeTab === 'peer' ? 'white' : '#14432A',
                      backgroundColor: activeTab === 'peer' ? '#14432A' : 'transparent',
                      border: 'none'
                    }}
                  >
                    👥 Peer to Peer
                  </button>
                </li>
              </ul>
            </div>
          </div>

          <div className="row">
            {/* Main Payment Form */}
            <div className="col-lg-8">
              {activeTab === 'rent' && (
                <div className="card border-0 shadow-sm" style={{ borderRadius: '16px' }}>
                  <div className="card-header bg-white border-0 p-4">
                    <h4 className="fw-bold mb-0" style={{ color: '#14432A' }}>💰 Pay Rent</h4>
                  </div>
                  <div className="card-body p-4">
                    <div className="mb-4">
                      <label className="form-label fw-bold">Property Address</label>
                      <input 
                        type="text" 
                        className="form-control form-control-lg"
                        placeholder="Enter property address"
                        value={propertyAddress}
                        onChange={(e) => setPropertyAddress(e.target.value)}
                      />
                    </div>
                    <div className="mb-4">
                      <label className="form-label fw-bold">Amount</label>
                      <div className="input-group input-group-lg">
                        <span className="input-group-text">$</span>
                        <input 
                          type="number" 
                          className="form-control"
                          placeholder="0.00"
                          value={amount}
                          onChange={(e) => setAmount(e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="mb-4">
                      <label className="form-label fw-bold">Payment Method</label>
                      <select className="form-select form-select-lg">
                        <option>Visa ending in 4242</option>
                        <option>Mastercard ending in 1234</option>
                        <option>Bank Account ending in 5678</option>
                      </select>
                    </div>
                    <div className="mb-4">
                      <label className="form-label fw-bold">Payment Date</label>
                      <input type="date" className="form-control form-control-lg" />
                    </div>
                    <button className="btn btn-primary btn-lg w-100" style={{ backgroundColor: '#14432A', borderColor: '#14432A' }}>
                      Pay Rent
                    </button>
                  </div>
                </div>
              )}

              {activeTab === 'utilities' && (
                <div className="card border-0 shadow-sm" style={{ borderRadius: '16px' }}>
                  <div className="card-header bg-white border-0 p-4">
                    <h4 className="fw-bold mb-0" style={{ color: '#14432A' }}>⚡ Pay Utilities</h4>
                  </div>
                  <div className="card-body p-4">
                    <div className="mb-4">
                      <label className="form-label fw-bold">Utility Type</label>
                      <select 
                        className="form-select form-select-lg"
                        value={utilitiesType}
                        onChange={(e) => setUtilitiesType(e.target.value)}
                      >
                        <option value="electricity">Electricity</option>
                        <option value="water">Water</option>
                        <option value="gas">Gas</option>
                        <option value="internet">Internet</option>
                        <option value="phone">Phone</option>
                      </select>
                    </div>
                    <div className="mb-4">
                      <label className="form-label fw-bold">Account Number</label>
                      <input type="text" className="form-control form-control-lg" placeholder="Enter utility account number" />
                    </div>
                    <div className="mb-4">
                      <label className="form-label fw-bold">Amount</label>
                      <div className="input-group input-group-lg">
                        <span className="input-group-text">$</span>
                        <input 
                          type="number" 
                          className="form-control"
                          placeholder="0.00"
                          value={amount}
                          onChange={(e) => setAmount(e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="mb-4">
                      <label className="form-label fw-bold">Payment Method</label>
                      <select className="form-select form-select-lg">
                        <option>Visa ending in 4242</option>
                        <option>Mastercard ending in 1234</option>
                        <option>Bank Account ending in 5678</option>
                      </select>
                    </div>
                    <button className="btn btn-primary btn-lg w-100" style={{ backgroundColor: '#14432A', borderColor: '#14432A' }}>
                      Pay Utilities
                    </button>
                  </div>
                </div>
              )}

              {activeTab === 'peer' && (
                <div className="card border-0 shadow-sm" style={{ borderRadius: '16px' }}>
                  <div className="card-header bg-white border-0 p-4">
                    <h4 className="fw-bold mb-0" style={{ color: '#14432A' }}>👥 Peer to Peer Payment</h4>
                  </div>
                  <div className="card-body p-4">
                    <div className="mb-4">
                      <label className="form-label fw-bold">Send To</label>
                      <div className="input-group input-group-lg">
                        <span className="input-group-text">@</span>
                        <input 
                          type="text" 
                          className="form-control"
                          placeholder="Enter username or email"
                          value={recipient}
                          onChange={(e) => setRecipient(e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="mb-4">
                      <label className="form-label fw-bold">Amount</label>
                      <div className="input-group input-group-lg">
                        <span className="input-group-text">$</span>
                        <input 
                          type="number" 
                          className="form-control"
                          placeholder="0.00"
                          value={amount}
                          onChange={(e) => setAmount(e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="mb-4">
                      <label className="form-label fw-bold">Payment Note (Optional)</label>
                      <textarea className="form-control form-control-lg" rows={3} placeholder="Add a note to your payment"></textarea>
                    </div>
                    <div className="mb-4">
                      <label className="form-label fw-bold">Payment Method</label>
                      <select className="form-select form-select-lg">
                        <option>Visa ending in 4242</option>
                        <option>Mastercard ending in 1234</option>
                        <option>Bank Account ending in 5678</option>
                      </select>
                    </div>
                    <button className="btn btn-primary btn-lg w-100" style={{ backgroundColor: '#14432A', borderColor: '#14432A' }}>
                      Send Payment
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="col-lg-4">
              <div className="card border-0 shadow-sm mb-4" style={{ borderRadius: '16px' }}>
                <div className="card-header bg-white border-0 p-4">
                  <h5 className="fw-bold mb-0" style={{ color: '#14432A' }}>Quick Stats</h5>
                </div>
                <div className="card-body p-4">
                  <div className="d-flex justify-content-between mb-3">
                    <span className="text-muted">This Month</span>
                    <span className="fw-bold">$2,450</span>
                  </div>
                  <div className="d-flex justify-content-between mb-3">
                    <span className="text-muted">Rent Paid</span>
                    <span className="text-success">$1,200</span>
                  </div>
                  <div className="d-flex justify-content-between mb-3">
                    <span className="text-muted">Utilities Paid</span>
                    <span className="text-success">$680</span>
                  </div>
                  <div className="d-flex justify-content-between">
                    <span className="text-muted">P2P Sent</span>
                    <span className="text-success">$570</span>
                  </div>
                </div>
              </div>

              <div className="card border-0 shadow-sm" style={{ borderRadius: '16px' }}>
                <div className="card-header bg-white border-0 p-4">
                  <h5 className="fw-bold mb-0" style={{ color: '#14432A' }}>Recent Payments</h5>
                </div>
                <div className="card-body p-4">
                  <div className="border-bottom pb-3 mb-3">
                    <div className="d-flex justify-content-between">
                      <div>
                        <h6 className="mb-1 fw-bold">Rent - October</h6>
                        <small className="text-muted">Oct 15, 2024</small>
                      </div>
                      <span className="fw-bold text-success">-$1,200</span>
                    </div>
                  </div>
                  <div className="border-bottom pb-3 mb-3">
                    <div className="d-flex justify-content-between">
                      <div>
                        <h6 className="mb-1 fw-bold">Utilities - Electric</h6>
                        <small className="text-muted">Oct 12, 2024</small>
                      </div>
                      <span className="fw-bold text-success">-$180</span>
                    </div>
                  </div>
                  <div className="pb-3 mb-3">
                    <div className="d-flex justify-content-between">
                      <div>
                        <h6 className="mb-1 fw-bold">@john_doe</h6>
                        <small className="text-muted">Oct 10, 2024</small>
                      </div>
                      <span className="fw-bold text-success">-$125</span>
                    </div>
                  </div>
                  <Link href="/dashboard" className="btn btn-outline-primary w-100">
                    View All Payments
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </main>
  )
}
