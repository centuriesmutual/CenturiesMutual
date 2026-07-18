'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

// Preserves the existing data source: the live "Columns" feed is pulled from
// Box.com through the /api/box-news route. Presentation is NYT-styled; when the
// Box API is not configured (503) or the folder is empty, the section quietly
// renders nothing so the front page stays clean.

interface BoxArticle {
  id: string
  name: string
  type: 'file' | 'folder'
  fileType: string
  url: string | null
  downloadUrl: string | null
  lastModified?: string
  size: number
  description?: string
}

function formatDate(dateString?: string): string {
  if (!dateString) return ''
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

function cleanTitle(name: string): string {
  return name.replace(/\.(pdf|doc|docx|txt)$/i, '')
}

export default function BoxNewsColumns() {
  const [articles, setArticles] = useState<BoxArticle[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    let active = true
    ;(async () => {
      try {
        const res = await fetch('/api/box-news')
        const data = await res.json()
        if (!active) return
        if (data.success && Array.isArray(data.items)) {
          setArticles(
            data.items.filter((item: BoxArticle) => item.type === 'file'),
          )
        } else {
          setError(true)
        }
      } catch {
        if (active) setError(true)
      } finally {
        if (active) setLoading(false)
      }
    })()
    return () => {
      active = false
    }
  }, [])

  // Stay silent while loading or when the Box feed is unavailable —
  // avoids a fragmented "Loading…" block on the front page.
  if (loading || error || articles.length === 0) {
    return null
  }

  return (
    <>
      <div className="nyt-section-rule">
        <h2>Columns</h2>
        <span className="nyt-section-more">From the Newsroom</span>
      </div>
      <div className="nyt-river">
        {articles.slice(0, 6).map((article) => {
          const href = article.url ?? '#'
          return (
            <article className="nyt-river-item" key={article.id}>
              <p className="nyt-kicker nyt-kicker--gold">{article.fileType}</p>
              <h3 className="nyt-hed">
                <Link
                  href={href}
                  target={article.url ? '_blank' : undefined}
                  rel={article.url ? 'noopener noreferrer' : undefined}
                >
                  {cleanTitle(article.name)}
                </Link>
              </h3>
              {article.description ? (
                <p className="nyt-summary">{article.description}</p>
              ) : null}
              <p className="nyt-byline" style={{ marginTop: '8px' }}>
                {formatDate(article.lastModified)}
              </p>
            </article>
          )
        })}
      </div>
    </>
  )
}
