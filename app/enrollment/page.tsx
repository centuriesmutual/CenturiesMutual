'use client'

import { useState, useRef } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import SignatureCanvas from 'react-signature-canvas'

export default function Enrollment() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    ssn: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    planType: '',
    coverageStartDate: '',
    dependents: '',
    healthConditions: '',
    medications: '',
    idDocument: null,
    incomeDocument: null,
    additionalDocuments: null
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState('')
  const signaturePadRef = useRef(null)
  const [signatureData, setSignatureData] = useState(null)

  const planTypes = [
    'Individual Plan',
    'Family Plan',
    'Individual + Spouse',
    'Individual + Children'
  ]

  const states = [
    'Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado',
    'Connecticut', 'Delaware', 'Florida', 'Georgia', 'Hawaii', 'Idaho',
    'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky', 'Louisiana',
    'Maine', 'Maryland', 'Massachusetts', 'Michigan', 'Minnesota', 'Mississippi',
    'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire', 'New Jersey',
    'New Mexico', 'New York', 'North Carolina', 'North Dakota', 'Ohio', 'Oklahoma',
    'Oregon', 'Pennsylvania', 'Rhode Island', 'South Carolina', 'South Dakota',
    'Tennessee', 'Texas', 'Utah', 'Vermont', 'Virginia', 'Washington',
    'West Virginia', 'Wisconsin', 'Wyoming'
  ]

  const handleInputChange = (e) => {
    const { name, value, files } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: files ? files[0] : value
    }))
  }

  const handleClearSignature = () => {
    if (signaturePadRef.current) {
      signaturePadRef.current.clear()
      setSignatureData(null)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // Get signature if available
      let signature = null
      if (signaturePadRef.current && !signaturePadRef.current.isEmpty()) {
        signature = signaturePadRef.current.toDataURL('image/png')
        setSignatureData(signature)
      }

      // Create FormData for submission
      const submitFormData = new FormData()
      submitFormData.append('firstName', formData.firstName)
      submitFormData.append('lastName', formData.lastName)
      submitFormData.append('email', formData.email)
      submitFormData.append('phone', formData.phone)
      submitFormData.append('dateOfBirth', formData.dateOfBirth)
      submitFormData.append('ssn', formData.ssn)
      submitFormData.append('address', formData.address)
      submitFormData.append('city', formData.city)
      submitFormData.append('state', formData.state)
      submitFormData.append('zipCode', formData.zipCode)
      submitFormData.append('planType', formData.planType)
      submitFormData.append('coverageStartDate', formData.coverageStartDate)
      submitFormData.append('dependents', formData.dependents || '')
      submitFormData.append('healthConditions', formData.healthConditions || '')
      submitFormData.append('medications', formData.medications || '')
      
      if (signature) {
        submitFormData.append('signature', signature)
      }
      
      if (formData.idDocument) {
        submitFormData.append('idDocument', formData.idDocument)
      }
      
      if (formData.incomeDocument) {
        submitFormData.append('incomeDocument', formData.incomeDocument)
      }
      
      if (formData.additionalDocuments) {
        submitFormData.append('additionalDocuments', formData.additionalDocuments)
      }

      // Submit to API
      const response = await fetch('/api/enrollment', {
        method: 'POST',
        body: submitFormData
      })

      const result = await response.json()

      if (result.success) {
        setSubmitStatus('success')
        // Reset form
        setFormData({
          firstName: '',
          lastName: '',
          email: '',
          phone: '',
          dateOfBirth: '',
          ssn: '',
          address: '',
          city: '',
          state: '',
          zipCode: '',
          planType: '',
          coverageStartDate: '',
          dependents: '',
          healthConditions: '',
          medications: '',
          idDocument: null,
          incomeDocument: null,
          additionalDocuments: null
        })
        if (signaturePadRef.current) {
          signaturePadRef.current.clear()
        }
        setSignatureData(null)
      } else {
        setSubmitStatus('error')
        alert(result.error || 'Failed to submit enrollment. Please try again.')
      }
    } catch (error) {
      console.error('Error submitting enrollment:', error)
      setSubmitStatus('error')
      alert('An error occurred while submitting your enrollment. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-light">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="container py-4">
          <div className="row align-items-center">
            <div className="col">
              <h1 className="h3 mb-0" style={{ color: '#14432A' }}>
                <i className="bi bi-clipboard-check me-2"></i>Health Insurance Enrollment
              </h1>
            </div>
            <div className="col-auto">
              <Link href="/individual-family-services" className="btn btn-outline-secondary">
                <i className="bi bi-arrow-left me-2"></i>Back to Services
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Enrollment Form */}
      <div className="container py-5">
        <div className="row justify-content-center">
          <div className="col-lg-10">
            <motion.div 
              className="card border-0 shadow-sm"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="card-body p-4">
                {submitStatus === 'success' ? (
                  <motion.div 
                    className="text-center py-5"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.6 }}
                  >
                    <div className="bg-success rounded-circle d-inline-flex align-items-center justify-content-center mb-4" style={{ width: '80px', height: '80px' }}>
                      <i className="bi bi-check text-white" style={{ fontSize: '2rem' }}></i>
                    </div>
                    <h3 className="mb-3" style={{ color: '#14432A' }}>Enrollment Submitted!</h3>
                    <p className="text-muted mb-4">
                      Thank you for enrolling with Centuries Mutual. We'll review your application 
                      and process your enrollment within 3-5 business days. You'll receive a confirmation email shortly.
                    </p>
                    <div className="d-flex gap-3 justify-content-center">
                      <Link href="/individual-family-services" className="btn btn-primary">View Plans</Link>
                      <Link href="/" className="btn btn-outline-primary">Return Home</Link>
                    </div>
                  </motion.div>
                ) : (
                  <form onSubmit={handleSubmit}>
                    {/* Personal Information */}
                    <div className="mb-5">
                      <h4 className="mb-4" style={{ color: '#14432A' }}>Personal Information</h4>
                      <div className="row g-3">
                        <div className="col-md-6">
                          <label className="form-label">First Name *</label>
                          <input
                            type="text"
                            className="form-control"
                            name="firstName"
                            value={formData.firstName}
                            onChange={handleInputChange}
                            required
                          />
                        </div>
                        <div className="col-md-6">
                          <label className="form-label">Last Name *</label>
                          <input
                            type="text"
                            className="form-control"
                            name="lastName"
                            value={formData.lastName}
                            onChange={handleInputChange}
                            required
                          />
                        </div>
                        <div className="col-md-6">
                          <label className="form-label">Email Address *</label>
                          <input
                            type="email"
                            className="form-control"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            required
                          />
                        </div>
                        <div className="col-md-6">
                          <label className="form-label">Phone Number *</label>
                          <input
                            type="tel"
                            className="form-control"
                            name="phone"
                            value={formData.phone}
                            onChange={handleInputChange}
                            required
                          />
                        </div>
                        <div className="col-md-6">
                          <label className="form-label">Date of Birth *</label>
                          <input
                            type="date"
                            className="form-control"
                            name="dateOfBirth"
                            value={formData.dateOfBirth}
                            onChange={handleInputChange}
                            required
                          />
                        </div>
                        <div className="col-md-6">
                          <label className="form-label">Social Security Number *</label>
                          <input
                            type="text"
                            className="form-control"
                            name="ssn"
                            value={formData.ssn}
                            onChange={handleInputChange}
                            placeholder="XXX-XX-XXXX"
                            pattern="[0-9]{3}-[0-9]{2}-[0-9]{4}"
                            required
                          />
                          <small className="text-muted">Format: XXX-XX-XXXX</small>
                        </div>
                        <div className="col-12">
                          <label className="form-label">Street Address *</label>
                          <input
                            type="text"
                            className="form-control"
                            name="address"
                            value={formData.address}
                            onChange={handleInputChange}
                            required
                          />
                        </div>
                        <div className="col-md-4">
                          <label className="form-label">City *</label>
                          <input
                            type="text"
                            className="form-control"
                            name="city"
                            value={formData.city}
                            onChange={handleInputChange}
                            required
                          />
                        </div>
                        <div className="col-md-4">
                          <label className="form-label">State *</label>
                          <select
                            className="form-select"
                            name="state"
                            value={formData.state}
                            onChange={handleInputChange}
                            required
                          >
                            <option value="">Select state</option>
                            {states.map((state, index) => (
                              <option key={index} value={state}>{state}</option>
                            ))}
                          </select>
                        </div>
                        <div className="col-md-4">
                          <label className="form-label">ZIP Code *</label>
                          <input
                            type="text"
                            className="form-control"
                            name="zipCode"
                            value={formData.zipCode}
                            onChange={handleInputChange}
                            pattern="[0-9]{5}"
                            required
                          />
                        </div>
                      </div>
                    </div>

                    {/* Coverage Information */}
                    <div className="mb-5">
                      <h4 className="mb-4" style={{ color: '#14432A' }}>Coverage Information</h4>
                      <div className="row g-3">
                        <div className="col-md-6">
                          <label className="form-label">Plan Type *</label>
                          <select
                            className="form-select"
                            name="planType"
                            value={formData.planType}
                            onChange={handleInputChange}
                            required
                          >
                            <option value="">Select plan type</option>
                            {planTypes.map((plan, index) => (
                              <option key={index} value={plan}>{plan}</option>
                            ))}
                          </select>
                        </div>
                        <div className="col-md-6">
                          <label className="form-label">Desired Coverage Start Date *</label>
                          <input
                            type="date"
                            className="form-control"
                            name="coverageStartDate"
                            value={formData.coverageStartDate}
                            onChange={handleInputChange}
                            min={new Date().toISOString().split('T')[0]}
                            required
                          />
                        </div>
                        <div className="col-12">
                          <label className="form-label">Dependents Information</label>
                          <textarea
                            className="form-control"
                            name="dependents"
                            value={formData.dependents}
                            onChange={handleInputChange}
                            rows={4}
                            placeholder="List any dependents to be covered (name, date of birth, relationship):"
                          />
                          <small className="text-muted">Include name, date of birth, and relationship for each dependent</small>
                        </div>
                      </div>
                    </div>

                    {/* Health Information */}
                    <div className="mb-5">
                      <h4 className="mb-4" style={{ color: '#14432A' }}>Health Information</h4>
                      <div className="row g-3">
                        <div className="col-12">
                          <label className="form-label">Current Health Conditions (Optional)</label>
                          <textarea
                            className="form-control"
                            name="healthConditions"
                            value={formData.healthConditions}
                            onChange={handleInputChange}
                            rows={3}
                            placeholder="Please list any current health conditions or medical history..."
                          />
                        </div>
                        <div className="col-12">
                          <label className="form-label">Current Medications (Optional)</label>
                          <textarea
                            className="form-control"
                            name="medications"
                            value={formData.medications}
                            onChange={handleInputChange}
                            rows={3}
                            placeholder="Please list any current medications..."
                          />
                        </div>
                      </div>
                    </div>

                    {/* Documents */}
                    <div className="mb-5">
                      <h4 className="mb-4" style={{ color: '#14432A' }}>Documents</h4>
                      <div className="row g-3">
                        <div className="col-md-6">
                          <label className="form-label">Government-Issued ID *</label>
                          <input
                            type="file"
                            className="form-control"
                            name="idDocument"
                            onChange={handleInputChange}
                            accept=".pdf,.jpg,.jpeg,.png"
                            required
                          />
                          <small className="text-muted">Driver's license, passport, or state ID (PDF, JPG, or PNG)</small>
                        </div>
                        <div className="col-md-6">
                          <label className="form-label">Proof of Income *</label>
                          <input
                            type="file"
                            className="form-control"
                            name="incomeDocument"
                            onChange={handleInputChange}
                            accept=".pdf,.jpg,.jpeg,.png"
                            required
                          />
                          <small className="text-muted">Pay stub, tax return, or W-2 (PDF, JPG, or PNG)</small>
                        </div>
                        <div className="col-12">
                          <label className="form-label">Additional Documents (Optional)</label>
                          <input
                            type="file"
                            className="form-control"
                            name="additionalDocuments"
                            onChange={handleInputChange}
                            accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                          />
                          <small className="text-muted">Any additional supporting documents</small>
                        </div>
                      </div>
                    </div>

                    {/* E-Signature Section */}
                    <div className="mb-5">
                      <h4 className="mb-4" style={{ color: '#14432A' }}>E-Signature *</h4>
                      <p className="text-muted small mb-3">
                        Please sign below to confirm that all information provided is accurate and complete, and that you authorize Centuries Mutual to process your health insurance enrollment.
                      </p>
                      <div className="border rounded p-3 mb-3" style={{ backgroundColor: '#fff', minHeight: '200px' }}>
                        <SignatureCanvas
                          ref={signaturePadRef}
                          canvasProps={{
                            width: 600,
                            height: 200,
                            className: 'signature-canvas w-100'
                          }}
                          backgroundColor="#ffffff"
                          penColor="#000000"
                          onEnd={() => {
                            if (signaturePadRef.current && !signaturePadRef.current.isEmpty()) {
                              setSignatureData(signaturePadRef.current.toDataURL('image/png'))
                            }
                          }}
                        />
                      </div>
                      <div className="d-flex gap-2">
                        <button
                          type="button"
                          className="btn btn-outline-secondary btn-sm"
                          onClick={handleClearSignature}
                        >
                          Clear Signature
                        </button>
                        {signatureData && (
                          <span className="text-success small d-flex align-items-center">
                            <i className="bi bi-check-circle me-2"></i>Signature captured
                          </span>
                        )}
                      </div>
                      {!signatureData && (
                        <div className="text-danger small mt-2">
                          * Signature is required to submit your enrollment
                        </div>
                      )}
                    </div>

                    {/* Submit Button */}
                    <div className="d-flex gap-3 justify-content-center">
                      <button
                        type="submit"
                        className="btn btn-primary btn-lg"
                        disabled={isSubmitting || !signatureData}
                      >
                        {isSubmitting ? (
                          <>
                            <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                            Submitting...
                          </>
                        ) : (
                          <>
                            <i className="bi bi-send me-2"></i>Submit Enrollment
                          </>
                        )}
                      </button>
                      <Link href="/individual-family-services" className="btn btn-outline-secondary btn-lg">
                        Cancel
                      </Link>
                    </div>
                    {!signatureData && (
                      <div className="text-center mt-3">
                        <small className="text-muted">Please provide your signature above to enable submission</small>
                      </div>
                    )}
                  </form>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </div>

    </div>
  )
}

