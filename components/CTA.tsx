'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'

export default function CTA() {
  return (
    <section className="py-5" style={{ 
      background: 'linear-gradient(135deg, #14432A 0%, #1a5436 100%)',
      color: 'white',
      position: 'relative',
      overflow: 'hidden'
    }}>
      <div style={{ width: '100%', padding: '0' }}>
        <div className="row justify-content-center" style={{ margin: 0 }}>
          <div className="col-lg-10">
            <motion.div 
              className="text-center"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="display-4 fw-bold mb-4" style={{ 
                fontFamily: "'Playfair Display', serif",
                color: 'white'
              }}>
                Ready to Get Started?
              </h2>
              <p className="lead mb-5" style={{ 
                fontSize: '1.3rem',
                opacity: 0.95,
                maxWidth: '700px',
                margin: '0 auto'
              }}>
                Join thousands of members who trust Centuries Mutual for their housing, networking, and financial needs.
              </p>
              <div className="d-flex gap-3 justify-content-center flex-wrap">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link 
                    href="/signup" 
                    className="btn btn-light btn-lg px-5 py-3 fw-bold"
                    style={{ 
                      borderRadius: '12px',
                      fontSize: '1.1rem',
                      textDecoration: 'none'
                    }}
                  >
                    Get Started Today
                  </Link>
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link 
                    href="/contact" 
                    className="btn btn-outline-light btn-lg px-5 py-3 fw-bold"
                    style={{ 
                      borderRadius: '12px',
                      borderWidth: '2px',
                      fontSize: '1.1rem',
                      textDecoration: 'none'
                    }}
                  >
                    Contact Us
                  </Link>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  )
}

