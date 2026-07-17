'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

export default function BoxNewsArticles() {
  const [articles, setArticles] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchBoxArticles()
  }, [])

  const fetchBoxArticles = async () => {
    try {
      const response = await fetch('/api/box-news')
      const data = await response.json()
      
      if (data.success) {
        setArticles(data.items.filter(item => item.type === 'file'))
      } else {
        setError(data.error || 'Failed to fetch articles')
      }
    } catch (err) {
      setError('Failed to connect to Box.com')
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  if (loading) {
    return (
      <div className="text-center py-4">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-2 text-muted">Loading articles...</p>
      </div>
    )
  }

  if (error) {
    return null
  }

  if (articles.length === 0) {
    return (
      <div className="text-center py-4">
        <p className="text-muted">No articles found in Box.com folder.</p>
      </div>
    )
  }

  return (
    <div className="row">
      {articles.map((article) => (
        <div key={article.id} className="col-md-6 mb-4">
          <div className="card h-100 border-0 shadow-sm">
            <div className="card-body">
              <div className="d-flex align-items-start mb-3">
                <div className="me-3">
                  <div style={{
                    width: '60px',
                    height: '60px',
                    borderRadius: '8px',
                    background: article.fileType === 'PDF' ? '#dc3545' : '#6c757d',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#ffffff',
                    fontSize: '1.5rem',
                    fontWeight: 'bold'
                  }}>
                    {article.fileType === 'PDF' ? '📄' : '📁'}
                  </div>
                </div>
                <div className="flex-grow-1">
                  <h5 className="card-title mb-2" style={{
                    fontFamily: "'Times New Roman', serif",
                    fontSize: '1.2rem',
                    color: '#000000',
                    lineHeight: '1.3'
                  }}>
                    {article.name.replace(/\.(pdf|doc|docx|txt)$/i, '')}
                  </h5>
                  <p className="text-muted mb-2" style={{ fontSize: '0.9rem' }}>
                    {formatDate(article.lastModified)} • {formatFileSize(article.size)}
                  </p>
                  {article.description && (
                    <p className="card-text text-muted" style={{ fontSize: '0.9rem' }}>
                      {article.description}
                    </p>
                  )}
                </div>
              </div>
              
              <div className="d-flex gap-2">
                {article.url && (
                  <Link 
                    href={article.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="btn btn-outline-primary btn-sm"
                  >
                    View Article
                  </Link>
                )}
                {article.downloadUrl && (
                  <Link 
                    href={article.downloadUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="btn btn-primary btn-sm"
                  >
                    Download PDF
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
